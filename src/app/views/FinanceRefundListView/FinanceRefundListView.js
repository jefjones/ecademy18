import React, {Component} from 'react';
import styles from './FinanceRefundListView.css';
const p = 'FinanceRefundListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {formatNumber} from '../../utils/numberFormat';
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

class FinanceRefundListView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					isShowingModal: false,
					fileUrl: '',
					isShowingModal_missingInfo: false,
					selectedStudents: [],
					selectedObservers: [],
					financeRefund: {
					},
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
			this.setState({ clearStudent: false, clearGuardian: false, clearTeacher: false });
	}

	handleSelectedStudents = selectedStudents => this.setState({ selectedStudents });
	handleSelectedFinanceFeeTypes = (selectedFinanceFeeTypes) => this.setState({ selectedFinanceFeeTypes });

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

	handleFinanceBillingOpen = (financeBillingId) => {
			const {financeBillings} = this.props;
			let m = financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.financeBillingId === financeBillingId)[0];
			if (m !== null) {
					let financeBillingDisplay =
							<div className={styles.rowWrap}>
									<TextDisplay label={<L p={p} t={`Fee type`}/>} text={m.financeFeeTypeName}/>
									<TextDisplay label={<L p={p} t={`Student`}/>} text={m.creditPersonName}/>
									<TextDisplay label={<L p={p} t={`Amount`}/>} text={`$${formatNumber(m.amount, true, false, 2)}`}/>
									{m.fileUploads && m.fileUploads.length > 0 &&
											<TextDisplay label={<L p={p} t={`File(s)`}/>} text={m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
															<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
													)} />
									}
									<TextDisplay label={<L p={p} t={`GL code`}/>} text={m.financeGlcodeName}/>
									<TextDisplay label={<L p={p} t={`Refund type`}/>} text={m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}/>
									<TextDisplay label={<L p={p} t={`Income waiver`}/>} text={m.financeLowIncomeWaiverName}/>
									<TextDisplay label={<L p={p} t={`Mandatory?`}/>} text={m.mandatoryOrOptional}/>
									<TextDisplay label={<L p={p} t={`Due date`}/>} text={<DateMoment date={m.dueDate}/>}/>
									{m.financeGroupTableName && <TextDisplay label={<L p={p} t={`Group`}/>} text={m.financeGroupTableName}/>}
									<TextDisplay label={<L p={p} t={`Description`}/>} text={m.description}/>
									<TextDisplay label={<L p={p} t={`Entry`}/>} text={<DateMoment date={m.entryDate}/>}/>
									<TextDisplay label={<L p={p} t={`Entered by`}/>} text={m.entryPersonName}/>
							</div>;
					this.setState({ isShowingModal_financeBilling: true, financeBillingDisplay})
			}
	}

	handleFinanceBillingClose = () => this.setState({ isShowingModal_financeBilling: false, financeBillingDisplay: ''})
	chooseRecord = (financeRefundId) => this.setState({ financeRefundId })

	handleDescriptionOpen = (studentName, description) => this.setState({ isShowingModal_description: true, studentName, description });
	handleDescriptionClose = () => this.setState({ isShowingModal_description: false, studentName: '', description: '' });

	resetFilters = () => this.setState({ partialNameText: '', selectedFinanceFeeTypes: [], selectedStudents: [], fromDate: '', toDate: '' });

  render() {
	    const {personId, students, myFrequentPlaces, setMyFrequentPlace, financeRefunds, fetchingRecord, financeFeeTypes} = this.props;
			const {errors, isShowingModal, fileUrl, messageInfoIncomplete, isShowingModal_missingInfo, partialNameText, selectedStudents, noSiblingsFound,
							selectedFinanceFeeTypes, financeRefundId, fromDate, toDate, isShowingModal_financeBilling, financeBillingDisplay,
							isShowingModal_description, studentName, description} = this.state;

			let filteredRefunds = financeRefunds;

			if (partialNameText) {
					let cutBackTextFilter = partialNameText.toLowerCase();
					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.creditPersonName && m.creditPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1));
			}

			if (selectedStudents && selectedStudents.length > 0) {
					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => {
							let found = false;
							selectedStudents.forEach(s => {
									if (s.id === m.personId) found = true;
							})
							return found;
					});
			}

			if (selectedFinanceFeeTypes && selectedFinanceFeeTypes.length > 0) {
					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => {
							let found = false;
							selectedFinanceFeeTypes.forEach(s => {
									if (s.id === m.financeFeeTypeId) found = true;
							})
							return found;
					});
			}

			if (fromDate && toDate) {
					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (fromDate) {
					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (toDate) {
					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			}

			filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.map((m, i) => {
					m.fee = <div className={classes(globalStyles.link, globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => {this.handleFinanceBillingOpen(m.financeBillingId); this.chooseRecord(m.financeRefundId)}}>
											{m.financeFeeTypeName}
									 </div>;
					m.name = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeRefundId)}>
											{m.creditPersonName}
									 </div>;
					m.billingAmount = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeRefundId)}>
																{`$${formatNumber(m.amount, true, false, 2)}`}
														 </div>;
				  m.files = <div className={classes(globalStyles.cellText, styles.row, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))}>
												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
														<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
												)}
									  </div>;
					m.desc = <div className={classes(globalStyles.link, globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => {this.handleDescriptionOpen(m.studentName, m.description); this.chooseRecord(m.financeRefundId);}}>
												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
										</div>;
					m.entry = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeRefundId)}>
												<DateMoment date={m.entryDate}/>
										</div>;
					m.entryPerson = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeRefundId)}>
															{m.entryPersonName}
													</div>;

					return m;
			});

			let columns = [
				{
					width: 120,
					label: <L p={p} t={`Fee`}/>,
					dataKey: 'fee',
				},
				{
					width: 160,
					label: <L p={p} t={`Name`}/>,
					dataKey: 'name',
				},
				{
					width: 60,
					label: <L p={p} t={`Amount`}/>,
					dataKey: 'billingAmount',
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
					width: 100,
					label: <L p={p} t={`Entry date`}/>,
					dataKey: 'entry',
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
								<L p={p} t={`Refund History`}/>
						</div>
						<div className={styles.rowWrap}>
							<div className={styles.row}>
									<div>
											<div className={globalStyles.filterLabel}><L p={p} t={`FILTERS:`}/></div>
											<div onClick={this.resetFilters} className={globalStyles.clearLink}><L p={p} t={`clear`}/></div>
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
													label={<L p={p} t={`Fee type(s)`}/>}
													id={'financeFeeTypes'}
													name={'financeFeeTypes'}
													options={financeFeeTypes}
													value={selectedFinanceFeeTypes || []}
													multiple={true}
													height={`medium`}
													className={styles.moreSpace}
													onChange={this.handleSelectedFinanceFeeTypes}/>
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
								<Loading isLoading={fetchingRecord.financeRefunds} />
								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
										<TableVirtualFast rowCount={(filteredRefunds && filteredRefunds.length) || 0}
												rowGetter={({ index }) => (filteredRefunds && filteredRefunds.length > 0 && filteredRefunds[index]) || ''}
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
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Refund History`}/>} path={'financeRefundList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinanceRefundListView);
