import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import {browserHistory} from 'react-router';
import styles from './StudentProfileView.css';
const p = 'StudentProfileView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import TextDisplay from '../../components/TextDisplay';
import LinkDisplay from '../../components/LinkDisplay';
import DateMoment from '../../components/DateMoment';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import Checkbox from '../../components/Checkbox';
import InputTextArea from '../../components/InputTextArea';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import FileUploadModal from '../../components/FileUploadModal';
import DateTimePicker from '../../components/DateTimePicker';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import ReactToPrint from "react-to-print";
import { withAlert } from 'react-alert';
import {wait} from '../../utils/wait.js';
import {formatPhoneNumber} from '../../utils/numberFormat.js';

class StudentProfileView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					showSaveButton: false,
					isShowingModal_missingInfo: false,
					isShowingModal_removeNote: false,
					newNote: '',
					withdrawnDate: '',
					selfPaced: '',
					printOpen: false,
      }
    }

		// componentDidUpdate() {
		// 		const {studentProfile} = this.props;
		// 		const {isInit} = this.state;
		// 		if (!isInit && studentProfile && studentProfile.studentPersonId) {
		// 				this.setState({ isInit: true, withdrawnDate: studentProfile.withdrawnDate, selfPaced: studentProfile.selfPaced });
		// 		}
		// }

		contactLink = (personId, emailAddress) => {
				const {setStudentsSelected} = this.props;
				return (
						  <div className={styles.row}>
									<a onClick={() => {setStudentsSelected([personId]); browserHistory.push('/announcementEdit');}}>
											<Icon pathName={'comment_text'} premium={true} className={styles.icon}/>
									</a>
									{emailAddress ? <a className={styles.link} href={`mailto: ${emailAddress}`}>{emailAddress}</a> : <i><L p={p} t={`none`}/></i>}
							</div>
				)
		}

		handleSend = () => {
				const {personId, sendLoginInstructions, studentProfile} = this.props;
				sendLoginInstructions(personId, studentProfile.studentPersonId);
				this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Login instructions have been sent to the parent/guardians`}/></div>)
		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, studentPersonId, updatePersonConfig, getRegistrationByStudent} = this.props;
				const {schoolYearId} = this.state;
				this.setState({ courseScheduledschoolYearId: target.value });
				updatePersonConfig(personId, 'SchoolYearId', target.value, () => getRegistrationByStudent(personId, studentPersonId, schoolYearId));
		}

		toggleCheckbox = (field) => {
				let newState = Object.assign({}, this.state);
				newState[field] = !newState[field];
				newState.showSaveButton = true;
				this.setState(newState);
		}

		handleNote = (event) => {
        event.stopPropagation();
        event.preventDefault();
				let field = event.target.name;
				let newState = Object.assign({}, this.state);
				newState[field] = event.target.value
				newState.showSaveButton = true;
        this.setState(newState);
    }

		processForm = () => {
	      const {personId, studentPersonId, updateStudentProfile, personConfig, companyConfig}  = this.props;
	      const {newNote, withdrawnDate, selfPaced, schoolYearId} = this.state;
	      // let hasError = false;
				// let missingInfoMessage = ``;
	      //if (!hasError) {
						updateStudentProfile(personId, studentPersonId, withdrawnDate, selfPaced, newNote, schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId);
	      // } else {
				// 		this.handleMissingInfoOpen(missingInfoMessage);
				// }
		}

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

		handleRemoveNoteOpen = (studentAdminNoteId) => this.setState({isShowingModal_removeNote: true, studentAdminNoteId })
		handleRemoveNoteClose = () => this.setState({isShowingModal_removeNote: false, studentAdminNoteId: ''})
		handleRemoveNote = () => {
				const {personId, studentPersonId, removeStudentAdminNote, personConfig, companyConfig} = this.props;
				const {studentAdminNoteId, schoolYearId} = this.state;
				removeStudentAdminNote(personId, studentPersonId, studentAdminNoteId, schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId);
				this.handleRemoveNoteClose();
		}

		changeWithdrawnDate = (event) => this.setState({ withdrawnDate: event.target.value, showSaveButton: true });

		changeItem = (event) => {
				const {personId, getRegistrationByStudent, schoolYearId} = this.props;
				this.setState({ newNote: '', withdrawnDate: '', selfPaced: '', isInit: false });
				getRegistrationByStudent(personId, event.target.value, schoolYearId);
		}

		handlePrintOpen = () => this.setState({ printOpen: true });
		handlePrintClose = () => this.setState({ printOpen: false });

		handleRemoveStudentDocOpen = (studentDocumentId) => this.setState({isShowingModal_removeStudentDoc: true, studentDocumentId })
		handleRemoveStudentDocClose = () => this.setState({isShowingModal_removeStudentDoc: false})
		handleRemoveStudentDoc = () => {
				const {removeStudentDocumentFile, personId} = this.props;
				const {studentDocumentId} = this.state;
				removeStudentDocumentFile(personId, studentDocumentId)
				this.handleRemoveStudentDocClose();
		}

		handleFileUploadOpen = () => this.setState({isShowingFileUpload_course: true })
	  handleFileUploadClose = () => this.setState({isShowingFileUpload_course: false})
	  handleSubmitFile = () => {
	      const {getStudentDocuments, personId, studentPersonId} = this.props;
	      getStudentDocuments(personId, studentPersonId);
				this.handleFileUploadClose();
	  }

		fileUploadBuildUrl = (title) => {
	      const {personId, studentPersonId} = this.props;
	      return `${apiHost}ebi/studentDocuments/fileUpload/` + personId + `/` + studentPersonId + `/` + encodeURIComponent(title);
	  }

		recallAfterFileUpload = () => {
	    	const {getStudentDocuments, personId, studentPersonId} = this.props;
				wait(5000);
	    	getStudentDocuments(personId, studentPersonId);
	  }

    reset = () => {
        this.setState({
            newNote: '',
            withdrawnDate: '',
            selfPaced: '',
        		siblingPersonId: '',
        })
    }

    render() {
			const {personId, accessRoles, studentProfile, login, companyConfig, schoolYears, personConfig, students, studentDocuments } = this.props;
      const {schoolYearId, newNote, withdrawnDate, selfPaced, isShowingModal_missingInfo, messageInfoIncomplete, showSaveButton, isShowingModal_removeNote,
						siblingPersonId, printOpen, isShowingModal_removeStudentDoc, isShowingFileUpload_course} = this.state;

      let schoolYear = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === (personConfig.schoolYearId))[0];
      let schoolYearName = schoolYear && schoolYear.label;
      let leftLabel = companyConfig.urlcode && companyConfig.urlcode.indexOf('Caritas') > -1 ? true : false;

      return (
        <div className={styles.container}>
		        <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
		          	<L p={p} t={`Student Profile`}/>
		        </div>
						{accessRoles.admin && companyConfig.urlcode !== 'Manheim' &&
								<div className={styles.row}>
										{students && students.length > 0 &&
												<div className={styles.listPosition}>
														<SelectSingleDropDown
																id={`schoolYearId`}
																label={<L p={p} t={`School year`}/>}
																value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
																options={schoolYears}
																height={`medium`}
																onChange={this.handleUpdateSchoolYear}/>
												</div>
										}
										<div onMouseOver={this.handlePrintOpen} onMouseOut={this.handlePrintClose} className={styles.moveUpLittle}>
												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={classes(styles.icon, styles.moveUp)}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}
														onBeforePrint={this.handlePrintOpen} onAfterPrint={this.handlePrintClose}/>
										</div>
										{accessRoles.admin &&
												<a onClick={this.handleSend} className={classes(styles.editLink, styles.moreLeft, styles.row)} data-rh={'This teacher will receive an email with login details'}>
														<Icon pathName={'key0'} premium={true} className={classes(styles.icon, styles.moveUp)}/>
														<L p={p} t={`Send Login Instructions`}/>
												</a>
										}
								</div>
						}
						<div ref={el => (this.componentRef = el)} className={styles.componentPrint}>
            <div className={styles.row}>
                {printOpen && companyConfig.logoFileUrl &&
                    <div>
                        <img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
                    </div>
                }
                {printOpen &&
                    <div className={classes(styles.row, styles.headingTop)}>
                        <div className={classes(styles.printTitle, styles.bold)}>
                            {studentProfile.middleName
                                ? `${studentProfile.firstName} ${studentProfile.middleName} ${studentProfile.lastName}`
                                : `${studentProfile.firstName} ${studentProfile.lastName}`}
                        </div>
                        <div className={classes(styles.printTitle, styles.moreBottom)}>
                            {`School year: ${schoolYearName}`}
                        </div>
                    </div>
                }
            </div>
          	<div className={styles.rowWrap}>
                <div>
                    <div className={styles.classification}>Student Information</div>
						        <div className={styles.column}>
                        {!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`First name`}/>} text={studentProfile.firstName} hideIfEmpty={true} />}
												{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Middle name`}/>} text={studentProfile.middleName} hideIfEmpty={true} />}
												{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Last name`}/>} text={studentProfile.lastName} hideIfEmpty={true} />}
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Preferred name`}/>} text={studentProfile.preferredName} hideIfEmpty={true} />
												{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp username`}/>} text={studentProfile.username} hideIfEmpty={true} textClassName={styles.red} salta={accessRoles.admin || accessRoles.counselor ? () => login({username: studentProfile.username, clave: '*&^', salta: personId }, '', 'salta') : () => {}}/>}
												{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp first time password`}/>} text={studentProfile.firstTimeEntry} hideIfEmpty={true} textClassName={styles.red}/>}
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Suffix`}/>} text={studentProfile.suffix} hideIfEmpty={true} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Date of birth`}/>} text={<DateMoment date={studentProfile.birthDate || ''} format={`D MMM YYYY`} className={styles.entryDate}/> } hideIfEmpty={true} />
												{/*<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Preferred Name`}/>} text={studentProfile.preferredName} hideIfEmpty={true} />*/}
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Email address`}/>} text={this.contactLink(studentProfile.personId, studentProfile.emailAddress)} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Gender`}/>} text={studentProfile.genderName} hideIfEmpty={true} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone`}/>} text={formatPhoneNumber(studentProfile.phone)} hideIfEmpty={true} />
												{studentProfile.phone && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone can receive texts`}/>} text={studentProfile.canPhoneReceiveTexts ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} hideIfEmpty={true} />}
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Best way to contact`}/>} text={studentProfile.bestContactEmail ? 'Email ' : studentProfile.bestContactPhoneCall ? 'Phone call ' : studentProfile.bestContactPhoneText ? 'Text message' : ''} hideIfEmpty={true} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address`}/>} text={studentProfile.address1} hideIfEmpty={true} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address`}/>} text={studentProfile.address2} hideIfEmpty={true} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`City`}/>} text={studentProfile.city} hideIfEmpty={true} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`US State`}/>} text={studentProfile.usStateName} hideIfEmpty={false} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Postal code`}/>} text={studentProfile.postalCode} hideIfEmpty={true} />
                        <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Country`}/>} text={studentProfile.countryName} hideIfEmpty={false} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`People approved to pick up student`}/>} text={studentProfile.peopleApprovedToPickup} hideIfEmpty={false} />
										</div>
                </div>
								{companyConfig.urlcode === 'Liahona' &&
										<div className={styles.column}>
												<div className={styles.classification}>Accreditation</div>
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Student Type`}/>} text={studentProfile.academyOrDistanceEd === 'DE' ? 'Distance Education' : studentProfile.academyOrDistanceEd === 'ACADEMY' ? 'Academy' : ''} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Accredited`}/>} text={studentProfile.accredited ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Grade level`}/>} text={studentProfile.gradeLevelName || '- - '} />
												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Individual Education Plan Record (IEP)`}/>} text={studentProfile.iep ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
												{studentProfile.academyOrDistanceEd === "ACADEMY" &&
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Carson Smith`}/>} text={studentProfile.carsonSmith ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
												}
                        {!printOpen
                            ?
                              <Checkbox
                                  id={'selfPaced'}
                                  label={<L p={p} t={`Self-paced`}/>}
                                  labelClass={styles.checkboxLabel}
                                  checked={selfPaced || false}
                                  onClick={() => this.toggleCheckbox('selfPaced')}
                                  className={classes(styles.checkbox, styles.littleMoreLeft)}/>
                            :
                            <div className={styles.noWrap}>
                                <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Self-paced `}/>} text={selfPaced ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} hideIfEmpty={false} />
                            </div>
                        }
								</div>
										}
										{accessRoles.admin && (!printOpen || (printOpen && ((studentProfile.studentAdminNotes && studentProfile.studentAdminNotes.length > 0) || withdrawnDate))) &&
                        <div>
                            <div className={styles.classification}><L p={p} t={`Admin Entry`}/></div>
    												<div className={classes(styles.column, styles.littleLeft)}>
    														<div className={styles.checkbox}>
    																{!printOpen
                                        ? <DateTimePicker id={`fromDate`} value={withdrawnDate || studentProfile.withdrawnDate} label={<L p={p} t={`Withdrawn date`}/>} onChange={this.changeWithdrawnDate}/>
                                        : <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Withdrawn date`}/>} text={studentProfile.withdrawnDate} hideIfEmpty={true} />}
    														</div>
    														{!printOpen &&
    																<InputTextArea label={<L p={p} t={`Note`}/>} rows={5} cols={45} value={newNote} onChange={this.handleNote} id={'newNote'} name={'newNote'}
    				                            className={styles.commentBox} boldText={true}/>
    														}
    														{!printOpen &&
    																<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={showSaveButton ? this.processForm : () => {}}
    																		addClassName={showSaveButton ? '' : styles.lowOpacity}/>
    														}
                                {studentProfile.studentAdminNotes && studentProfile.studentAdminNotes.length > 0 && <hr/>}
    														{studentProfile.studentAdminNotes && studentProfile.studentAdminNotes.length > 0 && studentProfile.studentAdminNotes.map((m, i) =>
    																<div key={i}>
    																		<TextDisplay leftLabel={leftLabel} text={m.note}
    																				label={<div className={styles.row}>
    																										<DateMoment date={m.entryDate} includeTime={true} minusHours={6} labelClass={styles.label}/>
    																										<div className={styles.label}>{m.entryPersonName}</div>
    																										<a onClick={() => this.handleRemoveNoteOpen(m.studentAdminNoteId)} className={styles.remove}>remove</a>
    																								</div>}/>
    																</div>
    														)}

                          </div>
													<div>
															<div className={classes(styles.row, styles.moreTop)}>
																	<div className={styles.classification}><L p={p} t={`Student Documents`}/></div>
																	{(accessRoles.admin || accessRoles.facilitator) &&
																			<div className={styles.moveTop}>
																					<a onClick={this.handleFileUploadOpen} className={classes(styles.muchLeft, globalStyles.link)}><L p={p} t={`Add file`}/></a>
																			</div>
																	}
															</div>
															{studentDocuments && studentDocuments.length > 0 && studentDocuments.map((f, i) => (
																	<div key={i} className={styles.row}>
																			<div className={styles.linkDisplay}>
																					{accessRoles.admin &&
																							<a onClick={() => this.handleRemoveStudentDocOpen(f.id)} className={styles.remove}>
																									<L p={p} t={`remove`}/>
																							</a>
																					}
																					<a href={f.fileUrl} className={classes(globalStyles.link, styles.moreSpace)} target="_blank">
																							{f.title}
																					</a>
																			</div>
																	</div>
															))}
															{(!studentDocuments || studentDocuments.length === 0) &&
																	<div className={styles.noDocs}><L p={p} t={`No documents found`}/></div>
															}
													</div>

											</div>
										}
										{studentProfile && studentProfile.primaryGuardian &&
												<div className={styles.column}>
													<div className={styles.classification}><L p={p} t={`Primary Guardian`}/></div>
                          <div>
                          {!printOpen &&
															<SelectSingleDropDown
																	id={`siblingPersonId`}
																	name={`siblingPersonId`}
																	label={`Siblings`}
																	value={siblingPersonId || ''}
																	options={students}
																	className={styles.moreBottomMargin}
																	height={`medium`}
																	onChange={this.changeItem}/>}
														</div>
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Prefix`}/>} text={studentProfile.primaryGuardian.prefix} hideIfEmpty={true}/>
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`First name`}/>} text={studentProfile.primaryGuardian.firstName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Middle name`}/>} text={studentProfile.primaryGuardian.middleName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Last name`}/>} text={studentProfile.primaryGuardian.lastName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={`Relation to ${studentProfile.firstName}`} text={studentProfile.primaryGuardian.relationTypeName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={`Custody of ${studentProfile.firstName}`} text={studentProfile.primaryGuardian.registrationCustodyName} hideIfEmpty={true} />
													{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp username`}/>} text={studentProfile.primaryGuardian.username} hideIfEmpty={true} textClassName={styles.red} salta={accessRoles.admin || accessRoles.counselor ? () => login({username: studentProfile.primaryGuardian.username, clave: '*&^', salta: personId }, '', 'salta') : () => {}}/>}
													{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp first time password`}/>} text={studentProfile.primaryGuardian.firstTimeEntry} hideIfEmpty={true} textClassName={styles.red}/>}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Suffix`}/>} text={studentProfile.primaryGuardian.suffix} hideIfEmpty={true} />
													{/*<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Preferred Name`}/>} text={studentProfile.primaryGuardian.preferredName} hideIfEmpty={true} />*/}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Email address`}/>} text={this.contactLink(studentProfile.primaryGuardian.personId, studentProfile.primaryGuardian.emailAddress || studentProfile.primaryGuardian.username)} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Gender`}/>} text={studentProfile.primaryGuardian.genderName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone`}/>} text={formatPhoneNumber(studentProfile.primaryGuardian.phone)} hideIfEmpty={true} />
													{studentProfile.primaryGuardian.phone && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone can receive texts`}/>} text={studentProfile.primaryGuardian.canPhoneReceiveTexts ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} hideIfEmpty={true} />}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Best way to contact`}/>} text={studentProfile.primaryGuardian.bestContactEmail ? 'Email ' : studentProfile.primaryGuardian.bestContactPhoneCall ? 'Phone call ' : studentProfile.primaryGuardian.bestContactPhoneText ? 'Text message' : ''} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address (line 1)`}/>} text={studentProfile.primaryGuardian.address1} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address (line 2)`}/>} text={studentProfile.primaryGuardian.address2} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`City`}/>} text={studentProfile.primaryGuardian.city} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`US State`}/>} text={studentProfile.primaryGuardian.usStateName} hideIfEmpty={false} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Postal code`}/>} text={studentProfile.primaryGuardian.postalCode} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Country`}/>} text={studentProfile.primaryGuardian.countryName} hideIfEmpty={false} />
												</div>
										}
										{studentProfile && studentProfile.secondaryGuardians && studentProfile.secondaryGuardians.length > 0 && studentProfile.secondaryGuardians.map((m, i) =>
												<div key={i} className={styles.column}>
													<div className={styles.classification}><L p={p} t={`Secondary Guardian`}/></div>
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Prefix`}/>} text={m.prefix} hideIfEmpty={true}/>
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`First name`}/>} text={m.firstName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Middle name`}/>} text={m.middleName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Last name`}/>} text={m.lastName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={`Relation to ${studentProfile.firstName}`} text={m.relationTypeName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={`Custody of ${studentProfile.firstName}`} text={m.registrationCustodyName} hideIfEmpty={true} />
													{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp username`}/>} text={m.username} hideIfEmpty={true} textClassName={styles.red} salta={accessRoles.admin || accessRoles.counselor ? () => login({username: m.username, clave: '*&^', salta: personId }, '', 'salta') : () => {}}/>}
													{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp first time password`}/>} text={m.firstTimeEntry} hideIfEmpty={true} textClassName={styles.red}/>}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Suffix`}/>} text={m.suffix} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Preferred Name`}/>} text={m.preferredName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Email address`}/>} text={this.contactLink(m.personId, m.emailAddress)} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Gender`}/>} text={m.genderName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone`}/>} text={formatPhoneNumber(m.phone)} hideIfEmpty={true} />
													{m.phone && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone can receive texts`}/>} text={m.canPhoneReceiveTexts ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} hideIfEmpty={true} />}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Best way to contact`}/>} text={m.bestContactEmail ? 'Email ' : m.bestContactPhoneCall ? 'Phone call ' : m.bestContactPhoneText ? 'Text message' : ''} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address (line 1)`}/>} text={m.address1} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address (line 2)`}/>} text={m.address2} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`City`}/>} text={m.city} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`US State`}/>} text={m.usStateName} hideIfEmpty={false} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Postal code`}/>} text={m.postalCode} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Country`}/>} text={m.countryName} hideIfEmpty={false} />
												</div>
										)}
										{studentProfile && studentProfile.emergencyContacts && studentProfile.emergencyContacts.length > 0 && studentProfile.emergencyContacts.map((m, i) =>
												<div key={i} className={styles.column}>
													<div className={styles.classification}><L p={p} t={`Emergency Contact`}/></div>
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Prefix`}/>} text={m.prefix} hideIfEmpty={true}/>
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`First name`}/>} text={m.firstName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Middle name`}/>} text={m.middleName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Last name`}/>} text={m.lastName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={`Relation to ${studentProfile.firstName}`} text={m.relationTypeName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={`Custody of ${studentProfile.firstName}`} text={m.registrationCustodyName} hideIfEmpty={true} />
													{!printOpen && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`eCADEMYapp username`}/>} text={m.username} hideIfEmpty={true} textClassName={styles.red} salta={accessRoles.admin || accessRoles.counselor ? () => login({username: m.username, clave: '*&^', salta: personId }, '', 'salta') : () => {}}/>}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Suffix`}/>} text={m.suffix} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Preferred Name`}/>} text={m.preferredName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Email address`}/>} text={this.contactLink(m.personId, m.emailAddress)} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Gender`}/>} text={m.genderName} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone`}/>} text={formatPhoneNumber(m.phone)} hideIfEmpty={true} />
													{m.phone && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Phone can receive texts`}/>} text={m.canPhoneReceiveTexts ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} hideIfEmpty={true} />}
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Best way to contact`}/>} text={m.bestContactEmail ? 'Email ' : m.bestContactPhoneCall ? 'Phone call ' : m.bestContactPhoneText ? 'Text message' : ''} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address (line 1)`}/>} text={m.address1} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Address (line 2)`}/>} text={m.address2} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`City`}/>} text={m.city} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`US State`}/>} text={m.usStateName} hideIfEmpty={false} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Postal code`}/>} text={m.postalCode} hideIfEmpty={true} />
													<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Country`}/>} text={m.countryName} hideIfEmpty={false} />
												</div>
										)}
										{studentProfile && studentProfile.academyOrDistanceEd === "ACADEMY" &&
												<div className={styles.columnDouble}>
														<div className={styles.classification}><L p={p} t={`Medical Insurance`}/></div>
														{studentProfile.noInsurance && <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`No Insurance`}/>} text={'We do not have insurance and will be responsible for all health expenses'} />}
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Insurance carrier`}/>} text={studentProfile.insuranceCompany || '- -'} />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Group number`}/>} text={studentProfile.insuranceGroupNumber || '- -'} />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Client number`}/>} text={studentProfile.insuranceClientNumber || '- -'} />
														<hr />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Dentist name`}/>} text={studentProfile.dentistName || '- -'} />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Dentist phone`}/>} text={formatPhoneNumber(studentProfile.dentistPhone) || '- -'} />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Physician name`}/>} text={studentProfile.physicianName || '- -'} />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Physician phone`}/>} text={formatPhoneNumber(studentProfile.physicianPhone) || '- -'} />
														<hr />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Diabetes, seizures. allergies, mental or emotional disturbances, etc?`}/>} text={studentProfile.seizureMentalEmotional ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														{studentProfile.seizureMentalEmotional &&
																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.seizureMentalEmotionalNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														}
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Student is on prescription medication which needs to be administered at school?`}/>} text={studentProfile.prescriptionMedication ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														{studentProfile.prescriptionMedication &&
																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.prescriptionMedicationNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														}
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Student has permission to take over-the-counter medications? (Aspirin, Tylenol, Allergy, Code, etc.)`}/>} text={studentProfile.overTheCounterMeds ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Are there any learning disabilities or special circumstances that might affect your student?`}/>} text={studentProfile.learningDisability ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														{studentProfile.learningDisability &&
																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.seizureLearningDisabilityNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
														}
														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`I agree to allow the school to obtain emergency care`}/>} text={studentProfile.obtainEmergencyCare ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
                            {((studentProfile.VaccinationBringToOffice) || (studentProfile.VaccinationMailToOffice) || (studentProfile.fileSystemName)) &&
                            <div className={styles.classification}><L p={p} t={`Vaccination Record`}/></div>
                            }
                            {studentProfile.VaccinationBringToOffice && <div className={styles.indentedText}><L p={p} t={`Will bring to the office`}/></div>}
														{studentProfile.VaccinationMailToOffice && <div className={styles.indentedText}><L p={p} t={`Will mail to the office`}/></div>}
														{studentProfile.fileSystemName &&
																<LinkDisplay links={[studentProfile.vaccionationFileURL]} label={<L p={p} t={`Vaccination File Attachment`}/>} displayArray={true} linkPath={'/static/vaccinationReport/'}
								                		deleteFunction={this.handleRemoveFileUploadOpen} deleteId={studentProfile.vaccinationFileUploadId}/>
														}
											 </div>
									 }

										<div className={styles.columnDouble}>
                    <div className={styles.classification}><L p={p} t={`Other Information`}/></div>
 												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Primary language at home`}/>} text={studentProfile.languageName} />
 												{companyConfig.urlcode === 'Liahona' &&
 														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Are both parents living?`}/>} text={studentProfile.bothParentsLiving ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
 												}
 												{companyConfig.urlcode === 'Liahona' &&
 														<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`How did you learn about us?`}/>} text={studentProfile.howLearnAboutUsName} hideIfEmpty={true}/>
 												}
 												<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Referred by whom?`}/>} text={studentProfile.referredByWhom} hideIfEmpty={true}/>
 												{studentProfile.academyOrDistanceEd === "ACADEMY" &&
 														<div>
 																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Has your student ever been expelled or suspended?`}/>} text={studentProfile.everExpelled ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																{studentProfile.everExpelled &&
																		<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.everExpelledNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																}
 																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Has your student ever been in a treatment center or rehabilitation program?`}/>} text={studentProfile.treatmentCenter ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																{studentProfile.treatmentCenter &&
																		<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.treatmentCenterNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																}
 																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Does your student have a criminal record?`}/>} text={studentProfile.criminalRecord ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																{studentProfile.criminalRecord &&
																		<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.criminalRecordNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																}
 																<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Is your student currently supervised by a court or other governmental agency?`}/>} text={studentProfile.supervisedCourt ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																{studentProfile.supervisedCourt &&
																		<TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Note`}/>} text={studentProfile.supervisedCourtNote ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
																}
                                <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Foster child?`}/>} text={studentProfile.fosterChild ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
                                <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Homeless, runaway, or migrant?`}/>} text={studentProfile.homelessRunawayMigrant ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
                                <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Hispanic or latino?`}/>} text={studentProfile.hispanicOrLatino ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
                                <TextDisplay leftLabel={leftLabel} label={<L p={p} t={`Race`}/>} text={studentProfile.raceName} />
 														</div>
 												}
												{studentProfile.academyOrDistanceEd === 'DE' && studentProfile.selectedCourses && studentProfile.selectedCourses.length > 0 &&
														<div className={styles.columnDouble}>
																<div className={styles.classification}><L p={p} t={`DE Classes`}/></div>
																{studentProfile.selectedCourses.map((c, i) => <div key={i} className={styles.indentedText}>{c.courseName} {c.accredited ? '(Acc)' : '(Non)'}</div>)}
														</div>
												}
 										</div>
								</div>
						</div>
            {!printOpen &&
						<OneFJefFooter />}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
						{isShowingModal_removeNote &&
								<MessageModal handleClose={this.handleRemoveNoteClose} heading={<L p={p} t={`Remove Note?`}/>} isConfirmType={true}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this note?`}/>} onClick={this.handleRemoveNote} />
						}
						{isShowingModal_removeStudentDoc &&
                <MessageModal handleClose={this.handleRemoveStudentDoc} heading={<L p={p} t={`Remove this course document?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this course document?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveStudentDoc} />
            }
						{isShowingFileUpload_course &&
                <FileUploadModal handleClose={this.handleFileUploadClose}
										title={<L p={p} t={`Student Document`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={true}
                    personId={personId} submitFileUpload={this.handleSubmitFile}
										sendInBuildUrl={this.fileUploadBuildUrl}
                    handleRecordRecall={this.recallAfterFileUpload}
                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .mp4, .mov, .m4a"}
                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.mp4', '.mov', '.m4a']}/>
            }
        </div>
    )};
}

export default withAlert(StudentProfileView);
