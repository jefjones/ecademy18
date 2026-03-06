import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import styles from './FinanceBillingAddView.css';
const p = 'FinanceBillingAddView';
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
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import DateTimePicker from '../../components/DateTimePicker';
import RadioGroup from '../../components/RadioGroup';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';

class FinanceBillingAddView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					isShowingModal: false,
					fileUrl: '',
					isShowingModal_missingInfo: false,
					selectedStudents: null,
					selectedObservers: [],
					financeBilling: {
					},
					errors: {},
	    }
  }

	componentDidUpdate() {
			const {financeBilling, financeBillingId, students, financeFeeTypeId, paramPersonId} = this.props;
			const {isInitPerson, isInit, isInitLunchBilling} = this.state;
			if (!isInit && financeBillingId && financeBilling && financeBilling.financeBillingId) {
					let student = students && students.length > 0 && students.filter(m => m.id === financeBilling.personId)[0];
					let selectedStudents = [student];
					this.setState({ financeBilling, isInit: true, selectedStudents });
			} else if (!isInitLunchBilling && financeFeeTypeId && financeFeeTypeId !== guidEmpty) {
					this.setState({ isInitLunchBilling: true, financeBilling: {...this.state.financeBilling, financeFeeTypeId} });
			} else if (!isInitPerson && paramPersonId && students && students.length > 0) {
					let paramPerson = students.filter(m => m.id === paramPersonId)[0];
					if (paramPerson && paramPerson.id) this.setState({ isInitPerson: true, selectedStudents: [paramPerson] });
			}
	}

  processForm = () => {
      const {personId, getFinanceBillings} = this.props;
			const {financeBilling, selectedStudents} = this.state;
			let errors = Object.assign({}, this.state.errors);
			let data = new FormData();
			data.append('file', this.state.selectedFile)
			let missingInfoMessage = [];

			if (!(selectedStudents && selectedStudents.length > 0) && !financeBilling.financeGroupTableId && financeBilling.financeGroupTableId !== guidEmpty) {
					errors.billedPersonId = <L p={p} t={`A student or group is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`(s) or Group`}/></div>
			}

			if (!financeBilling.financeFeeTypeId) {
					errors.financeFeeTypeId = <L p={p} t={`Fee type is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Billing type`}/></div>
			}

			if (!financeBilling || !financeBilling.amount) {
					errors.amount = <L p={p} t={`Amount is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Amount`}/></div>
			}

			if (!financeBilling || !financeBilling.refundType) {
					errors.refundType = <L p={p} t={`Refund Option is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Refund Option`}/></div>
			}

			if (!financeBilling || !financeBilling.mandatoryOrOptional) {
					errors.mandatoryOrOptional = <L p={p} t={`Mandatory or Optional is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Mandatory or Optional`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
					this.setState ({errors});
			} else {
					let studentIds = selectedStudents && selectedStudents.length > 0 && selectedStudents.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
					studentIds = studentIds && studentIds.length > 0 ? studentIds.join('^') : 'EMPTY';

					let url = `${apiHost}ebi/financeBilling/${personId}` +
							`/${financeBilling.financeBillingId || guidEmpty}` +
							`/${financeBilling.financeFeeTypeId}` +
							`/${financeBilling.amount}` +
							`/${studentIds || 'EMPTY'}` +
							`/${financeBilling.financeGroupTableId || guidEmpty}` +
							`/${financeBilling.financeGlcodeId || guidEmpty}` +
							`/${financeBilling.refundType || 'EMPTY'}` +
							`/${financeBilling.financeWaiverScheduleId || guidEmpty}` +
							`/${financeBilling.financeLowIncomeWaiverId || guidEmpty}` +
							`/${financeBilling.courseScheduleId || guidEmpty}` +
							`/${financeBilling.mandatoryOrOptional}` +
							`/${financeBilling.dueDate || 'EMPTY'}` +
							`/${encodeURIComponent(financeBilling.description || 'EMPTY')}`

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
							.then(getFinanceBillings(personId));

					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The billing entry has been saved.`}/></div>)
					this.reset();
      }
  }

	reset = () => {
			this.setState({
					fileUrl: '',
					selectedStudents: null,
          clearStudent: true,
					financeBilling: {
							financeBillingId: '',
							financeFeeTypeId: '',
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

  resetClearTextValue = () => this.setState({ clearStudent: false })

	handleChange = ({target}) => {
			const {financeFeeTypes} = this.props;
			let financeBilling = Object.assign({}, this.state.financeBilling);
			financeBilling[target.name] = target.value;
			if (target.name === 'financeGroupTableId') {
					this.setState({ financeBilling, selectedStudents: [] }); //Blank out the selectedStudents if a financeGroupTableId is chosen
			} else if (target.name === 'financeFeeTypeId') {
					let financeFeeType = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.financeFeeTypeId === target.value)[0];
					if (financeFeeType && financeFeeType.financeFeeTypeId) {
							if (financeFeeType && financeFeeType.financeGlcodeId !== guidEmpty) financeBilling.financeGlcodeId = financeFeeType.financeGlcodeId;
							if (financeFeeType.financeLowIncomeWaiverId && financeFeeType.financeLowIncomeWaiverId !== guidEmpty) financeBilling.financeLowIncomeWaiverId = financeFeeType.financeLowIncomeWaiverId;
							if (financeFeeType.refundType) financeBilling.refundType = financeFeeType.refundType;
					}
					this.setState({ financeBilling, financeFeeTypeId: '' });  //financeFeeTypeId might come from the addLunchBilling call.  Set it to blank so that it doesn't continue to force this list to Lunch.
			} else {
					this.setState({ financeBilling });
			}
	}

	changeDate = (field, {target}) => {
			let financeBilling = Object.assign({}, this.state.financeBilling);
			financeBilling[field] = target.value;
			this.setState({financeBilling});
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeVolunteerHours, personId, financeBillingId} = this.props;
			removeVolunteerHours(personId, financeBillingId);
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

	handleSelectedStudents = selectedStudents => this.setState({ selectedStudents });

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

	handleMandatory = (value) => {
      let financeBilling = Object.assign({}, this.state.financeBilling);
      financeBilling['mandatoryOrOptional'] = value;
      this.setState({ financeBilling });
  }

	handleRadioChoice = (value) => {
			let financeBilling = Object.assign({}, this.state.financeBilling);
			financeBilling['refundType'] = value;
			this.setState({ financeBilling });
	}

  render() {
    const {personId, financeFeeTypes, students, myFrequentPlaces, setMyFrequentPlace, financeGroups, refundOptions, financeGLCodes,
						financeLowIncomeWaivers} = this.props;
		const {financeBilling, errors, isShowingModal_delete, isShowingModal, fileUrl, financeBillingId, messageInfoIncomplete, isShowingModal_missingInfo,
						selectedStudents, noSiblingsFound, financeFeeTypeId, clearStudent} = this.state;

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								{financeBillingId ? <L p={p} t={`Update Billing Entry`}/> : <L p={p} t={`Add New Billing`}/>}
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
                            onChange={this.handleSelectedStudents}
														className={styles.moreSpace}
                            clearTextValue={clearStudent}
                            resetClearTextValue={this.resetClearTextValue}
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
												value={financeBilling.financeGroupTableId || ''}
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
												id={`financeFeeTypeId`}
												name={`financeFeeTypeId`}
												label={<L p={p} t={`Fee type`}/>}
												value={financeFeeTypeId || financeBilling.financeFeeTypeId || ''}
												options={financeFeeTypes}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleChange}
												required={true}
												whenFilled={financeBilling.financeFeeTypeId}
												errors={errors.financeFeeTypeId}/>
								</div>
								<InputText
										id={'amount'}
										name={'amount'}
										size={'short'}
                    height={'medium'}
										numberOnly={true}
										label={<L p={p} t={`Amount`}/>}
										value={financeBilling.amount || ''}
										onChange={this.handleChange}
										required={true}
										whenFilled={financeBilling.amount}
										error={errors.amount}/>
								<div className={classes(styles.moreTop, styles.moreRight)}>
										<DateTimePicker label={'Due date (optional)'} id={`dueDate`} value={financeBilling.dueDate} onChange={this.handleChange}/>
								</div>
								<div className={styles.moreRight}>
										<InputTextArea
												label={<L p={p} t={`Description`}/>}
												name={'description'}
												value={financeBilling.description || ''}
												autoComplete={'dontdoit'}
												inputClassName={styles.moreRight}
												boldText={true}
												onChange={this.handleChange}/>
								</div>
								<div className={styles.moreSpace}>
										<InputFile label={'Include a picture'} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
								</div>
								<div className={styles.moreTop}>
										<RadioGroup
												label={<L p={p} t={`Refund option`}/>}
												data={refundOptions}
												name={`refundType`}
												horizontal={false}
												className={styles.radio}
												initialValue={financeBilling.refundType}
												onClick={this.handleRadioChoice}
												required={true}
												whenFilled={financeBilling.refundType}
												error={errors.refundType}/>
								</div>
								<div>
										<SelectSingleDropDown
												id={`financeGlcodeId`}
												name={`financeGlcodeId`}
												label={<L p={p} t={`GL code`}/>}
												value={financeBilling.financeGlcodeId || ''}
												options={financeGLCodes}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleChange}/>
								</div>
								<div>
										<SelectSingleDropDown
												id={`financeLowIncomeWaiverId`}
												name={`financeLowIncomeWaiverId`}
												label={<L p={p} t={`Low income waiver`}/>}
												value={financeBilling.financeLowIncomeWaiverId || ''}
												options={financeLowIncomeWaivers}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleChange}/>
								</div>
								<div className={styles.moreTop}>
										<RadioGroup
											label={<L p={p} t={`Is this fee mandatory?`}/>}
											data={[{ label: 'Mandatory', id: 'Mandatory' }, { label: 'Optional', id: 'Optional' }, ]}
											name={`answerTrueFalse`}
											horizontal={true}
											className={styles.radio}
											initialValue={financeBilling.mandatoryOrOptional}
											required={true}
											whenFilled={financeBilling.mandatoryOrOptional}
											onClick={this.handleMandatory}
											error={errors.mandatoryOrOptional}/>
								</div>
						</div>
						<div className={classes(styles.muchLeft, styles.row)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.push('/financeBillingList')}>Close</a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
						</div>
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this billing record?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this billing record?`}/>} isConfirmType={true}
									 onClick={this.handleDelete} />
						}
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Billing`}/>} path={'financeBillingAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinanceBillingAddView);
