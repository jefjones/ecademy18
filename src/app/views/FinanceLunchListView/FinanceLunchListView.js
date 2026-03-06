import React, {Component} from 'react';
import styles from './FinanceLunchListView.css';
const p = 'FinanceLunchListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {formatNumber} from '../../utils/numberformat';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import DateMoment from '../../components/DateMoment';
import DateTimePicker from '../../components/DateTimePicker';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class FinanceLunchListView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					financeLunchTransactionId: '',
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

		handleDescriptionOpen = (studentName, description) => this.setState({isShowingModal_description: true, studentName, description })
    handleDescriptionOpenClose = () => this.setState({isShowingModal_description: false, studentName: '', description: '' })

    handleRemoveOpen = (financeLunchTransactionId) => this.setState({isShowingModal_remove: true, financeLunchTransactionId })
		handleRemoveClose = () => this.setState({isShowingModal_remove: false, financeLunchTransactionId: ''})
    handleRemove = () => {
				const {personId, removeFinanceLunch} = this.props;
				const {financeLunchTransactionId} = this.state;
        removeFinanceLunch(personId, financeLunchTransactionId);
        this.handleRemoveClose();
    }

		chooseRecord = (financeTransferId) => this.setState({ financeTransferId })

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
		}

		changeDate = (field, {target}) => {
				let newState = Object.assign({}, this.state);
				newState[field] = target.value;
				this.setState(newState);
		}

		handleSelectedStudents = selectedStudents => this.setState({ selectedStudents });

		resetFilters = () => this.setState({ partialNameText: '', selectedStudents: [], fromDate: '', toDate: '' });

    render() {
      const {personId, financeLunches, companyConfig={}, students, myFrequentPlaces, setMyFrequentPlace, fetchingRecord } = this.props;
      const {isShowingModal_remove, partialNameText, selectedStudents, fromDate, toDate, isShowingModal_description,
							studentName, description, financeTransferId} = this.state;

			let filteredLunches = financeLunches;
			if (partialNameText) {
					let cutBackTextFilter = partialNameText.toLowerCase();
					filteredLunches = filteredLunches && filteredLunches.length > 0 && filteredLunches.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.studentPersonName && m.studentPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1));
			}

			if (selectedStudents && selectedStudents.length > 0) {
					filteredLunches = filteredLunches && filteredLunches.length > 0 && filteredLunches.filter(m => {
							let found = false;
							selectedStudents.forEach(s => {
									if (s.id === m.personId) found = true;
							})
							return found;
					});
			}

			if (fromDate && toDate) {
					filteredLunches = filteredLunches && filteredLunches.length > 0 && filteredLunches.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (fromDate) {
					filteredLunches = filteredLunches && filteredLunches.length > 0 && filteredLunches.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (toDate) {
					filteredLunches = filteredLunches && filteredLunches.length > 0 && filteredLunches.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			}

			filteredLunches = filteredLunches && filteredLunches.length > 0 && filteredLunches.map((m, i) => {
					m.name = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeTransferId)}>
											{m.studentPersonName}
									 </div>;
					m.creditAmount = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeTransferId)}>
															{`$${formatNumber(m.amount, true, false, 2)}`}
													 </div>;
				  m.files = <div className={classes(styles.cellText, styles.row, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))}>
		 										{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
											 			<a key={i} href={f.url} target={m.financeLunchTransactionId}><Icon pathName={'document0'} premium={true}/></a>
												)}
									 </div>;
					m.desc = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => {this.handleDescriptionOpen(m.studentName, m.description); this.chooseRecord(m.financeTransferId);}}>
												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
										</div>;
					m.entry = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeTransferId)}>
												<DateMoment date={m.entryDate}/>
										</div>;
					m.entryPerson = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeTransferId)}>
															{m.entryPersonName}
													</div>;

					return m;
			});

			let columns = [
				// {
				// 	width: 60,
				// 	label: '',
				// 	dataKey: 'icons',
				// },
				{
					width: 160,
					label: <L p={p} t={`Name`}/>,
					dataKey: 'name',
				},
				{
					width: 60,
					label: <L p={p} t={`Amount`}/>,
					dataKey: 'creditAmount',
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
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreBottomMarginl)}>
                  	<L p={p} t={`Lunch History`}/>
                </div>
								<div className={styles.row}>
										<div>
												<div className={globalStyles.filterLabel}><L p={p} t={`FILTERS:`}/></div>
												<div onClick={this.resetFilters} className={globalStyles.clearLink}><L p={p} t={`clear`}/></div>
										</div>
										<div className={styles.littleLeft}>
												<InputText
														id={"partialNameText"}
														name={"partialNameText"}
														size={"medium"}
														label={<L p={p} t={`Text search`}/>}
														value={partialNameText || ''}
														onChange={this.changeItem}/>
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
														onChange={this.handleSelectedStudents}/>
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
										<Loading isLoading={fetchingRecord.financeLunches} />
										<Paper style={{ height: 400, width: companyConfig.urlcode === 'Liahona' ? '700px' : '1260px', marginTop: '8px' }}>
												<TableVirtualFast rowCount={(filteredLunches && filteredLunches.length) || 0}
														rowGetter={({ index }) => (filteredLunches && filteredLunches.length > 0 && filteredLunches[index]) || ''}
														columns={columns} />
										</Paper>
								</div>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Lunch History`}/>} path={'financeLunchList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
        		<OneFJefFooter />
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this billing entry?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this billing entry?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionOpenClose} heading={studentName} explain={description} onClick={this.handleDescriptionOpenClose} />
            }
        </div>
    )};
}

export default withAlert(FinanceLunchListView);
