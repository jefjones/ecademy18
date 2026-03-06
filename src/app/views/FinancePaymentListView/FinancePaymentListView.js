import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './FinancePaymentListView.css';
const p = 'FinancePaymentListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {formatNumber} from '../../utils/numberformat';
import TextDisplay from '../../components/TextDisplay';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import DateMoment from '../../components/DateMoment';
import DateTimePicker from '../../components/DateTimePicker';
import InputText from '../../components/InputText';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import Icon from '../../components/Icon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';
import { withAlert } from 'react-alert';

class FinancePaymentListView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal: false,
					fileUrl: '',
					isShowingModal_missingInfo: false,
					selectedStudents: [],
					selectedPaymentTypes: [],
					financePayment: {},
					errors: {},
	    }
  }

	componentDidUpdate() {
			const {paramPersonId, students} = this.props;
			const {isInit} = this.state;
			if (!isInit && paramPersonId && students && students.length > 0) {
					let paramPerson = students.filter(m => m.id === paramPersonId)[0];
					if (paramPerson && paramPerson.id) this.setState({ isInit: true, selectedStudents: [paramPerson] });
			}
	}

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			let field = target.name;
			newState[field] = target.value;
			this.setState(newState);
	}

	changeDate = (field, {target}) => {
			let newState = Object.assign({}, this.state);
			newState[field] = target.value;
			this.setState(newState);
	}

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})
	handleInputFile = (file) => this.setState({ selectedFile: file });

	resetClearTextValue = () => {
			this.setState({ clearStudent: false });
	}

	handleSelectedStudents = selectedStudents => this.setState({ selectedStudents });
	handleSelectedFinancePaymentTypes = (selectedFinancePaymentTypes) => this.setState({ selectedFinancePaymentTypes });

	includeSiblings = (event) => {
			const {students} = this.props;
			const {selectedStudents} = this.state;
			let studentPersonId = selectedStudents && selectedStudents.length > 0 && selectedStudents[0].id;
			let student = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0];
			let primaryGuardianPersonId = student && student.primaryGuardianPersonId ? student.primaryGuardianPersonId : '';
			if (primaryGuardianPersonId) {
					let selectedStudents = students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === primaryGuardianPersonId);
					let noSiblingsFound = selectedStudents && selectedStudents.length === 1;
					this.setState({ selectedStudents, noSiblingsFound });
			}
	}

	handleFinanceBillingOpen = () => {
			const {fetchingRecord, financeBillings} = this.props;
			let financeBillingDisplay =
					<div>
							<Loading isLoading={fetchingRecord.financePaymentBillings} />
							{financeBillings && financeBillings.length > 0 && financeBillings.map((m, i) =>
									<div>
											<div className={styles.rowWrap}>
													<TextDisplay label={<L p={p} t={`Fee type`}/>} text={m.financeFeeTypeName} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Student`}/>} text={m.billedPersonName} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Amount`}/>} text={`$${formatNumber(m.amount, true, false, 2)}`} hideIfEmpty={true}/>
													{m.fileUploads && m.fileUploads.length > 0 &&
															<TextDisplay label={<L p={p} t={`File(s)`}/>} text={m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
																			<a key={i} href={f.url} target={m.financePaymentTableId}><Icon pathName={'document0'} premium={true} hideIfEmpty={true}/></a>)}  hideIfEmpty={true}/>
													}
													<TextDisplay label={<L p={p} t={`GL code`}/>} text={m.financeGlcodeName} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Payment type`}/>} text={m.refundType === 'NotPaymentable' ? 'Not Paymentable' : m.refundType === '100Paymentable' ? '100% refundable' : 'Payment schedule'} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Income waiver`}/>} text={m.financeLowIncomeWaiverName} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Mandatory?`}/>} text={m.mandatoryOrOptional} hideIfEmpty={true}/>
													{m.dueDate && <TextDisplay label={<L p={p} t={`Due date`}/>} text={<DateMoment date={m.dueDate} hideIfEmpty={true}/>}/>}
													{m.financeGroupTableName && <TextDisplay label={<L p={p} t={`Group`}/>} text={m.financeGroupTableName} hideIfEmpty={true}/>}
													<TextDisplay label={<L p={p} t={`Description`}/>} text={m.description ? m.description : <div className={styles.noneDesc}>none</div>} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Entry`}/>} text={<DateMoment date={m.entryDate} hideIfEmpty={true}/>} hideIfEmpty={true}/>
													<TextDisplay label={<L p={p} t={`Entered by`}/>} text={m.entryPersonName} hideIfEmpty={true}/>
											</div>
											<hr/>
									</div>
							)}
					</div>

			this.setState({ isShowingModal_financeBilling: true, financeBillingDisplay})
	}

	handleFinanceBillingClose = () => this.setState({ isShowingModal_financeBilling: false, financeBillingDisplay: ''})
	chooseRecord = (financePaymentTableId) => this.setState({ financePaymentTableId })

	handleDescriptionOpen = (studentName, description) => this.setState({ isShowingModal_description: true, studentName, description });
	handleDescriptionClose = () => this.setState({ isShowingModal_description: false, studentName: '', description: '' });

	resetFilters = () => this.setState({ partialNameText: '', selectedFinancePaymentTypes: [], selectedStudents: [], fromDate: '', toDate: '' });

  render() {
	    const {personId, students, myFrequentPlaces, setMyFrequentPlace, financePayments, fetchingRecord, financePaymentTypes,
							getFinancePaymentBillings} = this.props;
			const {errors, isShowingModal, fileUrl, messageInfoIncomplete, isShowingModal_missingInfo, partialNameText, selectedStudents, noSiblingsFound,
							selectedFinancePaymentTypes, financePaymentTableId, fromDate, toDate, isShowingModal_financeBilling, financeBillingDisplay,
							isShowingModal_description, studentName, description} = this.state;

			let filteredPayments = financePayments;

			if (partialNameText) {
					let cutBackTextFilter = partialNameText.toLowerCase();
					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.personName && m.personName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financePaymentTypeName && m.financePaymentTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.totalAmount && String(m.totalAmount).indexOf(cutBackTextFilter) > -1));
			}

			if (selectedStudents && selectedStudents.length > 0) {
					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => {
							let found = false;
							selectedStudents.forEach(s => {
									if (s.id === m.personId) found = true;
							})
							return found;
					});
			}

			if (selectedFinancePaymentTypes && selectedFinancePaymentTypes.length > 0) {
					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => {
							let found = false;
							selectedFinancePaymentTypes.forEach(s => {
									if (s.id === m.financePaymentTypeId) found = true;
							})
							return found;
					});
			}

			if (fromDate && toDate) {
					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (fromDate) {
					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (toDate) {
					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			}

			filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.map((m, i) => {
					m.icons = <div className={classes(globalStyles.cellText, styles.row)} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
												<div onClick={() => browserHistory.push(`/financePaymentReceipt/${m.financePaymentTableId}`)} className={globalStyles.link}>
														<Icon pathName={'printer'} premium={true} className={styles.icon}/>
												</div>
												<div onClick={() => getFinancePaymentBillings(personId, m.financePaymentTableId, () => this.handleFinanceBillingOpen())} className={globalStyles.link}>
														<Icon pathName={'document0'} premium={true} className={styles.icon}/>
												</div>
										</div>;
					m.entry = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
												<DateMoment date={m.entryDate}/>
										</div>;
					m.paymentType = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
 											{m.financePaymentTypeName}
 									 </div>;
					m.applyTo = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
											{m.applyFundsTo}
									 </div>;
					m.name = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
											{m.personName}
									 </div>;
					m.amount = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
												{`$${formatNumber(m.totalAmount, true, false, 2)}`}
										 </div>;
				  m.files = <div className={classes(globalStyles.cellText, styles.row, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))}>
												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
														<a key={i} href={f.url} target={m.financePaymentTableId}><Icon pathName={'document0'} premium={true}/></a>
												)}
									  </div>;
					m.desc = <div className={classes(globalStyles.link, globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => {this.handleDescriptionOpen(m.personName, m.description); this.chooseRecord(m.financePaymentTableId);}}>
												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
										</div>;
					m.entryPerson = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financePaymentTableId)}>
															{m.entryPersonName}
													</div>;
					return m;
			});

			let columns = [
				{
					width: 60,
					label: '',
					dataKey: 'icons',
				},
				{
					width: 130,
					label: <L p={p} t={`Entry date`}/>,
					dataKey: 'entry',
				},
				{
					width: 100,
					label: <L p={p} t={`Payment type`}/>,
					dataKey: 'paymentType',
				},
				{
					width: 100,
					label: <L p={p} t={`Apply funds to`}/>,
					dataKey: 'applyTo',
				},
				{
					width: 160,
					label: <L p={p} t={`Name`}/>,
					dataKey: 'name',
				},
				{
					width: 60,
					label: <L p={p} t={`Amount`}/>,
					dataKey: 'amount',
				},
				{
					width: 60,
					label: <L p={p} t={`File(s)`}/>,
					dataKey: 'files',
				},
				{
					width: 320,
					label: <L p={p} t={`Description`}/>,
					dataKey: 'desc',
				},
				{
					width: 120,
					label: <L p={p} t={`Entered by`}/>,
					dataKey: 'entryPerson',
				}
		];

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								{`Payment History`}
						</div>
						<div className={styles.rowWrap}>
							<div className={styles.row}>
									<div>
											<div className={globalStyles.filterLabel}>FILTERS:</div>
											<div onClick={this.resetFilters} className={globalStyles.clearLink}>clear</div>
									</div>
									<div className={styles.littleTop}>
											<InputText
													id={"partialNameText"}
													name={"partialNameText"}
													size={"medium"}
													label={<L p={p} t={`Text search`}/>}
													value={partialNameText || ''}
													onChange={this.handleChange}/>
									</div>
									<div>
											<InputDataList
													label={<L p={p} t={`Payment type(s)`}/>}
													id={'financePaymentTypes'}
													name={'financePaymentTypes'}
													options={financePaymentTypes}
													value={selectedFinancePaymentTypes || []}
													multiple={true}
													height={`medium`}
													className={styles.moreSpace}
													onChange={this.handleSelectedFinancePaymentTypes}/>
									</div>
										<div>
												<InputDataList
														label={<L p={p} t={`Student(s)`}/>}
														name={'students'}
														options={students}
														value={selectedStudents}
														multiple={true}
														height={`medium`}
														className={styles.moreSpace}
														onChange={this.handleSelectedStudents}
														error={errors.studentsOrGroup}/>
										</div>
										{selectedStudents && selectedStudents.length === 1 &&
												<div className={classes(styles.siblingPosition, styles.smallWidth, styles.row, styles.moreRight)}>
														<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={this.includeSiblings} addClassName={styles.smallButton}/>
														<div className={classes(styles.label, styles.labelPosition)}>{noSiblingsFound ? <L p={p} t={`No siblings found`}/> : <L p={p} t={`Include siblings`}/>}</div>
												</div>
										}
								</div>
								<div className={classes(styles.moreRight, styles.row, styles.dateRow)}>
										<div className={styles.moreRight}>
												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={fromDate} maxDate={toDate}
														onChange={(event) => this.changeDate('fromDate', event)}/>
										</div>
										<div className={styles.muchRight}>
												<DateTimePicker id={`toDate`} value={toDate} label={<L p={p} t={`To date`}/>} minDate={fromDate ? fromDate : ''}
														onChange={(event) => this.changeDate('toDate', event)}/>
										</div>
								</div>
						</div>
						<div className={styles.widthStop}>
								<Loading isLoading={fetchingRecord.financePayments} />
								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
										<TableVirtualFast rowCount={(filteredPayments && filteredPayments.length) || 0}
												rowGetter={({ index }) => (filteredPayments && filteredPayments.length > 0 && filteredPayments[index]) || ''}
												columns={columns} />
								</Paper>
						</div>
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
						{isShowingModal_financeBilling &&
								<MessageModal handleClose={this.handleFinanceBillingClose} heading={<L p={p} t={`Finance Billing`}/>}
									 explainJSX={financeBillingDisplay} onClick={this.handleFinanceBillingClose} />
						}
						{isShowingModal_description &&
								<MessageModal handleClose={this.handleDescriptionClose} heading={studentName} explain={description} onClick={this.handleDescriptionClose} />
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Payment History`}/>} path={'financePaymentList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinancePaymentListView);
