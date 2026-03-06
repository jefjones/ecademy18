import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import styles from './FinanceCreditAddView.css';
const p = 'FinanceCreditAddView';
import L from '../../components/PageLanguage';
import InputFile from '../../components/InputFile';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import InputTextArea from '../../components/InputTextArea';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import EditTable from '../../components/EditTable';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';

class FinanceCreditAddView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					isShowingModal: false,
					fileUrl: '',
					isShowingModal_missingInfo: false,
					selectedStudents: [],
					selectedObservers: [],
					financeCredit: {
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

  processForm = () => {
      const {personId, getFinanceCredits} = this.props;
			const {financeCredit, selectedStudents} = this.state;
			let errors = Object.assign({}, this.state.errors);
			let data = new FormData();
			data.append('file', this.state.selectedFile)
			let missingInfoMessage = [];

			if (!(selectedStudents && selectedStudents.length > 0) && !financeCredit.financeGroupTableId && financeCredit.financeGroupTableId !== guidEmpty) {
					errors.studentOrGroup = <L p={p} t={`A student or group is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student(s) or Group`}/></div>
			}

			if (!financeCredit.financeCreditTypeId) {
					errors.financeCreditTypeId = <L p={p} t={`Credit type is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Credit type`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
					this.setState ({errors});
			} else {
          const newState = Object.assign({}, this.state);
					let studentIdsAndAmounts = selectedStudents && selectedStudents.length > 0 && selectedStudents.reduce((acc, m) => {
							let option = m.id + '~' + (newState[`amount${m.id}`] || 0); //This is a string separated by a ~ to be split on the server side.
							acc = acc && acc.length > 0
									? acc.concat(option)
									: [option];
							return acc;
					},[]);

					studentIdsAndAmounts = studentIdsAndAmounts && studentIdsAndAmounts.length > 0 ? studentIdsAndAmounts.join('^') : 'EMPTY';

					let url = `${apiHost}ebi/financeCredit/${personId}` +
							`/${financeCredit.financeCreditTransactionId || guidEmpty}` +
							`/${financeCredit.financeCreditTypeId}` +
							`/${studentIdsAndAmounts || 'EMPTY'}` +
							`/${financeCredit.financeGroupTableId || guidEmpty}` +
							`/${encodeURIComponent(financeCredit.description || 'EMPTY')}`

					axios.post(url, data,
							{
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Access-Control-Allow-Credentials' : 'true',
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
									"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
									"Authorization": "Bearer " + localStorage.getItem("authToken"),
							}})
							.then(getFinanceCredits(personId));

					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The credit entry has been saved.`}/></div>)
					this.reset();
      }
  }

	reset = () => {
			this.setState({
					fileUrl: '',
					selectedStudents: [],
					creditAmounts: [],
					financeCredit: {
							financeCreditTransactionId: '',
							financeCreditTypeId: '',
							financeGlcodeId: '',
							financeGroupTableId: '',
							refundType: '',
							financeWaiverScheduleId: '',
							financeLowIncomeWaiverId: '',
							amount: '',
							description: '',
							mandatoryOrOptional: '',
					},
					errors: {}
			})
	}

	handleChange = ({target}) => {
			const {financeCreditTypes, financeGroups, students} = this.props;
			let financeCredit = Object.assign({}, this.state.financeCredit);
			financeCredit[target.name] = target.value;
			if (target.name === 'financeGroupTableId') {
					let financeGroup = financeGroups && financeGroups.length > 0 && financeGroups.filter(m => m.financeGroupTableId === target.value)[0];
					let selectedStudents = [];
					if (financeGroup && financeGroup.financeGroupTableId) {
							selectedStudents = students && students.length > 0 && students.filter(m => financeGroup.studentPersonIds.indexOf(m.id) > -1);
					}
					financeCredit.financeGroupTableId = target.value;
					this.setState({ financeCredit, selectedStudents });
			} else if (target.name === 'financeCreditTypeId') {
					let financeCreditType = financeCreditTypes && financeCreditTypes.length > 0 && financeCreditTypes.filter(m => m.financeCreditTypeId === target.value)[0];
					if (financeCreditType && financeCreditType.financeCreditTypeId) {
							if (financeCreditType && financeCreditType.financeGlcodeId !== guidEmpty) financeCredit.financeGlcodeId = financeCreditType.financeGlcodeId;
							if (financeCreditType.financeLowIncomeWaiverId && financeCreditType.financeLowIncomeWaiverId !== guidEmpty) financeCredit.financeLowIncomeWaiverId = financeCreditType.financeLowIncomeWaiverId;
							if (financeCreditType.refundType) financeCredit.refundType = financeCreditType.refundType;
					}
					this.setState({ financeCredit });
			} else {
					this.setState({ financeCredit });
			}
	}

	changeDate = (field, {target}) => {
			let financeCredit = Object.assign({}, this.state.financeCredit);
			financeCredit[field] = target.value;
			this.setState({financeCredit});
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeVolunteerHours, personId, financeCreditTransactionId} = this.props;
			removeVolunteerHours(personId, financeCreditTransactionId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})
	handleInputFile = (file) => this.setState({ selectedFile: file });

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	resetClearTextValue = () => {
			this.setState({ clearStudent: false, clearGuardian: false, clearTeacher: false });
	}

	handleSelectedStudents = selectedStudents => {
			//1. Get the creditAmounts
			//2. Loop through selectedStudents to see if a student needs to be added.
			//3. Loop through the creditAmounts to see if any students are not found in selectedStudents and need to be deleted from creditAmounts
			let creditAmounts = Object.assign([], this.state.creditAmounts);
			selectedStudents && selectedStudents.length > 0 && selectedStudents.forEach(m => {
					let found = false;
					creditAmounts && creditAmounts.length > 0 && creditAmounts.forEach(c => {
							if (c.studentPersonId === m.id) found = true;
					})
					if (!found) {
							let option = {studentPersonId: m.id, amount: ''};
							creditAmounts = creditAmounts && creditAmounts.length > 0 ? creditAmounts.concat(option) : [option];
					}
			})

			creditAmounts && creditAmounts.length > 0 && creditAmounts.forEach(m => {
					let found = false;
					selectedStudents && selectedStudents.length > 0 && selectedStudents.forEach(s => {
							if (m.studentPersonId === s.id) found = true;
					});
					if (!found) creditAmounts = creditAmounts && creditAmounts.length > 0 && creditAmounts.filter(s => s.studentPersonId !== m.studentPersonId);
			})

			this.setState({ selectedStudents, creditAmounts });
	}

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

	handleCreditAmount = (studentPersonId, {target}) => {
			let newState = Object.assign({}, this.state);
			newState[`amount${studentPersonId}`] = target.value;
			this.setState(newState);
	}

	getFinanceCreditAmount = (studentPersonId) => {
			let {creditAmounts} = this.state;
			let creditAmount = creditAmounts && creditAmounts.length > 0 && creditAmounts.filter(m => m.studentPersonId === studentPersonId)[0];
			if (creditAmount && creditAmount.studentPersonId && creditAmount.studentPersonId !== guidEmpty && !creditAmount.amount) {
					return creditAmount.amount
			} else {
					return '';
			}
	}

  render() {
    const {personId, financeCreditTypes, students, myFrequentPlaces, setMyFrequentPlace, financeGroups} = this.props;
		const {financeCredit, errors, isShowingModal, fileUrl, financeCreditTransactionId, messageInfoIncomplete, isShowingModal_missingInfo,
						selectedStudents, noSiblingsFound} = this.state;

		let headings = [{label: <L p={p} t={`Student`}/>},{label: <L p={p} t={`Grade level`}/>}, {label: <L p={p} t={`Amount`}/>}];

		let data = selectedStudents && selectedStudents.length > 0 && selectedStudents.map((m, i) =>
				[
						{ value: m.label},
						{ value: m.gradeLevelName},
						{ value: <InputText
													id={`amount${m.id}`}
													name={`amount${m.id}`}
													size={"short"}
													numberOnly={true}
													label={``}
													//value={this.getFinanceCreditAmount(m.id)}
													value={this.state[`amount${m.id}`] || ''}
													onChange={(event) => this.handleCreditAmount(m.id, event)}/>
						},
				]
		);

		data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}>Please choose at least one student</div>, colSpan: 4}]];

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								{financeCreditTransactionId ? <L p={p} t={`Update Credit Entry`}/> : <L p={p} t={`Add New Credit`}/>}
						</div>
						<div className={globalStyles.instructionsBigger}>
								<L p={p} t={`Choose a group or at least one student`}/>
						</div>
						<div className={styles.rowWrap}>
								<div className={styles.row}>
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
								<div className={classes(styles.moreBottom, styles.littleTop)}>
										<SelectSingleDropDown
												id={`financeGroupTableId`}
												name={`financeGroupTableId`}
												label={<L p={p} t={`or Group`}/>}
												value={financeCredit.financeGroupTableId || ''}
												options={financeGroups}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleChange}
												errors={errors.financeGroupTableId}/>
								</div>
						</div>
						<hr/>
						<div className={styles.rowWrap}>
								<div className={styles.moreBottom}>
										<SelectSingleDropDown
												id={`financeCreditTypeId`}
												name={`financeCreditTypeId`}
												label={<L p={p} t={`Credit type`}/>}
												value={financeCredit.financeCreditTypeId || ''}
												options={financeCreditTypes}
												height={`medium`}
												onChange={this.handleChange}
												required={true}
												whenFilled={financeCredit.financeCreditTypeId}
												errors={errors.financeCreditTypeId}/>
								</div>
								<div className={classes(styles.moreRight, styles.littleTop)}>
										<InputTextArea
												label={<L p={p} t={`Description`}/>}
												name={'description'}
												value={financeCredit.description || ''}
												autoComplete={'dontdoit'}
												inputClassName={styles.moreRight}
												boldText={true}
												onChange={this.handleChange}/>
								</div>
								<div className={styles.moreSpace}>
										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
								</div>
						</div>
						<div className={classes(styles.muchLeft, styles.row)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.push('/schoolSettings')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
						</div>
						<hr/>
						<EditTable headings={headings} data={data} />
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Credit Entry`}/>} path={'financeCreditAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinanceCreditAddView);
