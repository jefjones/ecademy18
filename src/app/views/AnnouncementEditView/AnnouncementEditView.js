import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import { browserHistory } from 'react-router';
import styles from './AnnouncementEditView.css';
const p = 'AnnouncementEditView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MultiSelect from '../../components/MultiSelect';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import TextDisplay from '../../components/TextDisplay';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import RadioGroup from '../../components/RadioGroup';
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import Icon from '../../components/Icon';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import FilterGroupsSaved from '../../components/FilterGroupsSaved';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import moment from 'moment';
import { withAlert } from 'react-alert';
import {doSort} from '../../utils/sort.js';
import {guidEmpty} from '../../utils/guidValidate.js';
import debounce from 'lodash/debounce';
import {wait} from '../../utils/wait.js';

class AnnouncementEditView extends Component {
    constructor(props) {
      super(props);

      this.state = {
				hideGroupChoices: true,
        isRecordComplete: false,
				processedIncomingRecipients: false,
				isShowingFileUpload: false,
				isShowingModal_removeFile: false,
				messageGroupName: '',
				messageGroupId: '',
        errorSubject: '',
        errorStartDate: '',
        errorStartTime: '',
				selectedCourses: [],
				selectedGradeLevels: [],
				studentType: 'ALL',
				accredited: 'ALL',
				includeGuardians: false,
				notIncludeStudentsOfGuardians: false,
				selectedStudents: [],
				selectedGuardians: [],
				selectedFacilitators: [],
				selectedMentors: [],
				selectedCounselors: [],
				selectedAdmins: [],
        announcement: {
						subject: props.subject || props.messageSave.subject || '',
            message: props.messageSave.message || '',
						startDate: '',
		        startTime: '',
						recipients: props.toPersonId
								? [{personId: props.toPersonId, firstName: props.toPersonName}]
								: [],
        },
      }
    }

    componentDidMount() {
				let {announcementEdit, editType, fromPersonId, fromFirstName, fromLastName} = this.props;
	      if (!!announcementEdit) {
						announcementEdit.subject = announcementEdit.subject ? announcementEdit.subject.indexOf('Reply:') !== 0 ? 'Reply: ' + announcementEdit.subject : announcementEdit.subject : '';
						announcementEdit.message = '';
						if ((editType === 'reply' || editType === 'new')
								&& fromPersonId) announcementEdit.recipients = [this.getRecipient(fromPersonId, fromFirstName, fromLastName)];
	        	this.setState({ announcement: announcementEdit });
						this.setFromPersonId(fromPersonId);
	      }
				//Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
				// !announcementEdit || !announcementEdit.recipients || announcementEdit.recipients.length === 0
				// 		? document.getElementById('recipient_personId').focus()
				// 		: announcementEdit && announcementEdit.subject
				// 				? document.getElementById('message').focus()
				// 				: document.getElementById('subject').focus();
    }

    componentDidUpdate(prevProps) {
	      const {announcementEdit, editType, fromFirstName, fromLastName} = this.props;
				let {fromPersonId} = this.props;
	      if ((prevProps.announcementEdit !== announcementEdit && !!announcementEdit && editType === 'reply')
							|| (editType === 'new' && fromPersonId && (!announcementEdit.recipients || announcementEdit.recipients.length === 0))) {
						if (announcementEdit) {
								announcementEdit.subject = announcementEdit && announcementEdit.subject
										? announcementEdit.subject.indexOf('Reply:') !== 0
												? 'Reply: ' + announcementEdit.subject
												: announcementEdit.subject
										: '';
								announcementEdit.message = ''; //If this is a reply, don't automatically fill in the message body.
						}
						if (fromPersonId) announcementEdit.recipients = [this.getRecipient(fromPersonId, fromFirstName, fromLastName)];
	          this.setState({ announcement: announcementEdit });
						this.setFromPersonId(fromPersonId);
	      }
				if (this.props.chosenMessageGroupId !== this.state.messageGroupId && !this.state.isUserChangedMessageGroupId)
						this.setState({ messageGroupId: this.props.chosenMessageGroupId });

				if (!this.state.isInit && this.props.carpoolRequestId && this.props.toPersonId) {
						this.setState({ isInit: true });
						this.setFromPersonId(this.props.toPersonId, true);
				}
    }

		setFromPersonId = debounce((fromPersonId, isSingleListChoice) => {
				const {selectedStudents, selectedGuardians, selectedFacilitators, selectedAdmins} = this.state;
				if (fromPersonId) {
						const {students, guardians, facilitators, admins, carpoolRequests} = this.props;
						if (isSingleListChoice) this.resetFilters();
						wait(1000);
						let student = students && students.length > 0 && students.filter(m => m.studentPersonId === fromPersonId)[0];
						let guardian = guardians && guardians.length > 0 && guardians.filter(m => m.personId === fromPersonId)[0];
						let facilitator = facilitators && facilitators.length > 0 && facilitators.filter(m => m.personId === fromPersonId)[0];
						let admin = admins && admins.length > 0 && admins.filter(m => m.personId === fromPersonId)[0];
						let carpoolRequest = carpoolRequests && carpoolRequests.length > 0 && carpoolRequests.filter(m => m.personId === fromPersonId)[0];

						if (carpoolRequest && carpoolRequest.personId) {
								let announcement = this.state.announcement;
								announcement['recipients'] = [fromPersonId]
								this.setState({ recipient_personId: fromPersonId, announcement });
								//this.setRecipients('selectedStudents', [fromPersonId]);
						}
						if (student && student.personId) {
								this.setState({
										selectedStudents: selectedStudents && selectedStudents.length > 0 ? selectedStudents.concat([fromPersonId]) : [fromPersonId],
										recipient_personId: fromPersonId
								 });
								this.setRecipients('selectedStudents', [fromPersonId]);
						}
						if (guardian && guardian.personId) {
								this.setState({
										selectedGuardians: selectedGuardians && selectedGuardians.length > 0 ? selectedGuardians.concat([fromPersonId]) : [fromPersonId],
										recipient_personId: fromPersonId
								});
								this.setRecipients('selectedGuardians', [fromPersonId]);
						}
						if (facilitator && facilitator.personId) {
								this.setState({
										selectedFacilitators: selectedFacilitators && selectedFacilitators.length > 0 ? selectedFacilitators.concat([fromPersonId]) : [fromPersonId],
										recipient_personId: fromPersonId
								});
								this.setRecipients('selectedFacilitators', [fromPersonId]);
						}
						if (admin && admin.personId) {
								this.setState({
										selectedAdmins: selectedAdmins && selectedAdmins.length > 0 ? selectedAdmins.concat([fromPersonId]) : [fromPersonId],
										recipient_personId: fromPersonId
								});
								this.setRecipients('selectedAdmins', [fromPersonId]);
						}
						if (!this.state.initialUpdate) this.setState({ hideGroupChoices: true, initialUpdate: true });
						if (isSingleListChoice) this.setState({ recipient_personId: fromPersonId });
				}
		}, 1000);


		getRecipient = (personId, firstName, lastName) => {
				const {students, companyConfig} = this.props;
				let student = students && students.length > 0 && students.filter(s => s.id === personId)[0]
				return student && student.firstName
						? {
								id: student.id,
								label: companyConfig.studentNameFirst === 'FIRSTNAME' ? student.firstName + ' ' + student.lastName : student.lastName + ', ' + student.firstName,
								personId: student.id,
								firstName: student.firstName,
								lastName: student.lastName,
								role: 'Student',
								fromFilter: 'Courses',
								gradeLevelId: student.gradeLevelId,
								studentType: student.studentType,
								accredited: student.accredited,
						}
						: {
								id: personId,
								label: companyConfig.studentNameFirst === 'FIRSTNAME' ? firstName + ' ' + lastName : lastName + ', ' + firstName,
								personId,
								firstName,
								lastName,
						}
		}

		componentWillUnmount() {
				this.props.setStudentsSelected([], 'EMPTY'); //We want to clear the students selected after this message is sent.
				this.props.removeAnnouncementAttachmentsUnused(this.props.personId);
		}

		hasFilterChosen = () => {
			const {selectedCourses, selectedGradeLevels, studentType, accredited, includeGuardians, notIncludeStudentsOfGuardians, selectedStudents,
							selectedGuardians, selectedFacilitators, selectedMentors, selectedCounselors, selectedAdmins} = this.state;

				if (selectedCourses && selectedCourses.length > 0) return true;
				if (selectedGradeLevels && selectedGradeLevels.length > 0) return true;
				if (studentType !== 'ALL') return true;
				if (accredited !== 'ALL') return true;
				if (includeGuardians) return true;
				if (notIncludeStudentsOfGuardians) return true;
				if (selectedStudents && selectedStudents.length > 0) return true;
				if (selectedGuardians && selectedGuardians.length > 0) return true;
				if (selectedFacilitators && selectedFacilitators.length > 0) return true;
				if (selectedMentors && selectedMentors.length > 0) return true;
				if (selectedCounselors && selectedCounselors.length > 0) return true;
				if (selectedAdmins && selectedAdmins.length > 0) return true;
		}

		resetFilters = (resetSingleRecipient=true) => {
			this.setState({
					isUserChangedMessageGroupId: true,
					messageGroupId: '',
					selectedCourses: [],
					selectedGradeLevels: [],
					studentType: 'ALL',
					accredited: 'ALL',
					includeGuardians: false,
					notIncludeStudentsOfGuardians: false,
					selectedStudents: [],
					selectedGuardians: [],
					selectedFacilitators: [],
					selectedMentors: [],
					selectedCounselors: [],
					selectedAdmins: [],
					announcement: {
							...this.state.announcement,
							recipients: [],
					},
			})
			//if (resetSingleRecipient) this.setState({ recipient_personId: '' })
			this.props.alert.info(<div className={styles.alertText}>All filters and recipient choices have been reset.</div>)
		}

		handleMessageSave = () => {
				const {saveMessage} = this.props;
				const {announcement} = this.state;
				saveMessage(announcement.subject, announcement.message);
		}

    changeAnnouncement = ({target}) => {
	      this.setState({ announcement: {...this.state.announcement, [target.name]: target.value} });
    }

		setTimeNow = () => {
				const announcement = this.state.announcement;
				var todayNow = new Date();
				announcement.startDate = moment(todayNow).format("YYYY-MM-DD");
	      announcement.startTime = moment(todayNow).format("HH:mm");
	      this.setState({ announcement });
		}

    changeStartDate = (field, event) => {
				const announcement = this.state.announcement;
	      announcement.startDate = event.target.value;
	      this.setState({ announcement });
    }

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm("STAY");
    }

    processForm = (stayOrFinish) => {
	      const {addOrUpdateAnnouncement, personId, saveMessage, reply_announcementId} = this.props;
	      let  announcement = Object.assign({}, this.state.announcement);
	      let hasError = false;

	      if (!announcement.subject) {
	          hasError = true;
	          this.setState({errorSubject: <L p={p} t={`A subject is required`}/> });
	      }
      
				if (!announcement.recipients || announcement.recipients.length === 0) {
						if (this.props.editType === 'carpoolRequest') {
								announcement.recipients = [{personId: this.props.toPersonId, firstName: this.props.toPersonName}];
						} else {
			          hasError = true;
								this.props.alert.info(<div className={styles.alertText}><L p={p} t={`At least one recipient is necessary before sending a message.`}/></div>)
						}
	      }
				announcement.startDate = new Date();
				// if (!announcement.startDate) {
	      //     hasError = true;
	      //     this.setState({errorStartDate: "A start date is required" });
	      // }
				// if (!announcement.message) {
	      //     hasError = true;
	      //     this.setState({errorSubject: "Announcement message required" });
	      // }

	      if (!hasError) {
						if (this.props.carpoolRequestId) announcement.carpoolRequestId = this.props.carpoolRequestId;
            announcement.reply_announcementId = reply_announcementId;

	          addOrUpdateAnnouncement(personId, announcement);

	          this.setState({
							isRecordComplete: false,
							errorSubject: '',
							errorStartDate: '',
							errorStartTime: '',
							selectedGuardians: [],
							selectedStudents: [],
							selectedCourses: [],
							selectedFacilitators: [],
							selectedAdmins: [],
							selectedMentors: [],
							selectedCounselors: [],
							selectedGradeLevels: [],
							studentType: 'ALL',
							accredited: 'ALL',
							announcement: {
									subject: '',
			            message: '',
									startDate: '',
					        startTime: '',
									recipients: [],
							},
	    			});
						saveMessage('', ''); //Blank it out.
	          if (stayOrFinish === "FINISH") {
	              browserHistory.push(`/messagesAndReminders`)
	          } else {
								browserHistory.push(`/announcementEdit`)
						}
	          //document.getElementById('subject').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
	      }
    }

		noDuplicate = (id, recipients) => {
				let duplicate = recipients && recipients.length > 0 && recipients.filter(m => m.personId === id)[0];
				return !(duplicate && duplicate.personId);
		}
		setRecipients = (fromFilter, incomingValue, newState=null) => {
				// 1.	Send in the changed filter values.
				// 2.	Get the local state
				// 3.	Update the local state with the parameter value
				// 4.	Clear out the recipients
				// 5.	Rebuild the recipients
				// 	a.	Take the course students, if any.
				// 	b.	If there is a restricter chosen (grade level, student type or accredited)
				// 		i.	If no course is chosen, set all students as recipients - in preparation to restrict the recipient list by one or more restricters.
				//					Otherwise, the selectedCourses above set the recipient list for us.
				//    ii. Apply the filter to restrict the list according to the restricter(s) chosen
				// 	c.	Add on individual students (inferring that the other students are set as recipients automatically by the filter choices of courses, grade level, student type and/or accredited).
				// 	d.	If IncludeGuardians was chosen
				// 		i.	Include the guardians
				// 		ii.	If students are being cut out (NotIncludeStudentGuardians)
				// 			1.	Cut out the students from the entire list.
				// 	e.	Add on the individual guardians, if any (inferring that the other guardians are set as recipients automatically without updating the guardian list specifically).
				// 	f.	Add on the teachers, if any.
				// 	g.	Add on the counselors, if any.
				// 	h.	Add on the mentors, if any.
				// 	i.	Add on the admins, if any.

				const {students, guardians, facilitators, mentors, counselors, admins} = this.props;

				// 2.	Get the local state
				let state = newState ? newState : Object.assign({}, this.state);
				// 3.	Update the local state with the parameter value
				if (fromFilter) state[fromFilter] = incomingValue;
				// 4.	Clear out the recipients
				let recipients = [];

				// 5.	Rebuild the recipients
				// 	a.	Take the course students, if any.
				if (state.selectedCourses && state.selectedCourses.length > 0) {
            const {studentCourseAssigns} = this.props;
						state.selectedCourses.forEach(courseScheduledId => {
								studentCourseAssigns && studentCourseAssigns.length > 0 && studentCourseAssigns.filter(m => m.courseScheduledId === courseScheduledId).forEach(m => {
										let student = students && students.length > 0 && students.filter(s => s.id === m.studentPersonId)[0]
										if (student && student.firstName && this.noDuplicate(student.id, recipients)) {
												let newRecipient = {
														personId: student.id,
														firstName: student.firstName,
														lastName: student.lastName,
														role: 'Student',
                            sendToEmail: student.emailAddress && student.bestContactEmail,
                            sendToText: student.phone && student.bestContactPhoneText,
														fromFilter: 'Courses',
														gradeLevelId: student.gradeLevelId,
														studentType: student.studentType,
														accredited: student.accredited,
												};
												recipients = recipients && recipients.length > 0 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 	b.	If there is a restricter chosen (grade level, student type or accredited)
				if ((state.selectedGradeLevels && state.selectedGradeLevels.length > 0) || state.studentType !== 'ALL' || state.accredited !== 'ALL') {
						// 		i.	If no course is chosen, set all students as recipients - in preparation to restrict the recipient list by one or more restricters.
						//					Otherwise, the selectedCourses above set the recipient list for us.
						if (!state.selectedCourses || state.selectedCourses.length === 0) {
								students && students.length > 0 && students.forEach(m => {
										if (this.noDuplicate(m.id, recipients)) {
												let newRecipient = {
														personId: m.id,
														firstName: m.firstName,
														lastName: m.lastName,
														role: 'Student',
                            sendToEmail: m.emailAddress && m.bestContactEmail,
                            sendToText: m.phone && m.bestContactPhoneText,
														fromFilter: 'Restricters',
														gradeLevelId: m.gradeLevelId,
														studentType: m.studentType,
														accredited: m.accredited,
												};
												recipients = recipients && recipients.length > 0 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						}
						//    ii. Apply the filter to restrict the list according to the restricter(s) chosen
						if (state.selectedGradeLevels && state.selectedGradeLevels.length > 0)
								recipients = recipients.filter(m => state.selectedGradeLevels.indexOf(m.gradeLevelId) > -1);

						if (state.studentType !== 'ALL')
								recipients = recipients.filter(m => m.studentType === state.studentType);

						if (state.accredited !== 'ALL')
								recipients = recipients.filter(m => m.accredited === state.accredited);
				}
				// 	c.	Add on individual students (inferring that the other students are set as recipients automatically by the filter choices of courses, grade level, student type and/or accredited).
				if (state.selectedStudents && state.selectedStudents.length > 0) {
						state.selectedStudents.forEach(id => {
								students && students.length > 0 && students.filter(s => s.id === id).forEach(s => {
										if (this.noDuplicate(s.id, recipients)) {
												let newRecipient = {
														personId: s.id,
														firstName: s.firstName,
														lastName: s.lastName,
														role: 'Student',
                              sendToEmail: s.emailAddress && s.bestContactEmail,
                            sendToText: s.phone && s.bestContactPhoneText,
														fromFilter: 'Students',
														gradeLevelId: s.gradeLevelId,
														studentType: s.studentType,
														accredited: s.accredited,
												};
												recipients = recipients && recipients.length > 0 && recipients.indexOf(s.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 	d.	If IncludeGuardians was chosen
				// 		i.	Include the guardians
				if (state.includeGuardians) {
						state.includeGuardians && recipients && recipients.length > 0 && recipients.forEach(m => {
								students && students.length > 0 && students.filter(s => s.id === m.personId).forEach(s => {
										let guardian = guardians && guardians.length > 0 && guardians.filter(g => g.id === s.primaryGuardianPersonId)[0]
										if (guardian && guardian.firstName && this.noDuplicate(guardian.id, recipients)) {
												let newRecipient = { personId: guardian.id, firstName: guardian.firstName, lastName: guardian.lastName, role: 'Guardian',
                        sendToEmail: guardian.emailAddress && guardian.bestContactEmail,
                        sendToText: guardian.phone && guardian.bestContactPhoneText,
                        fromFilter: 'IncludeGuardians' };
												recipients = recipients && recipients.length > 0 && recipients.indexOf(guardian.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 		ii.	If students are being cut out (NotIncludeStudentGuardians)
				// 			1.	Cut out the students from the entire list.
				if (state.notIncludeStudentsOfGuardians) {
						//Notice that this filter is for "role" and not "fromFilter" like the others.
						recipients = recipients && recipients.length > 0 && recipients.filter(m => m.role !== 'Student');
				}
				// 	e.	Add on the individual guardians, if any (inferring that the other guardians are set as recipients automatically without updating the guardian list specifically).
				if (state.selectedGuardians && state.selectedGuardians.length > 0) {
						state.selectedGuardians.forEach(id => {
								guardians && guardians.length > 0 && guardians.filter(s => s.id === id).forEach(g => {
										if (this.noDuplicate(g.id, recipients)) {
												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Guardian',
                        sendToEmail: g.emailAddress && g.bestContactEmail,
                        sendToText: g.phone && g.bestContactPhoneText,
                        fromFilter: 'Guardians' };
												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 	f.	Add on the teachers, if any.
				if (state.selectedFacilitators && state.selectedFacilitators.length > 0) {
						state.selectedFacilitators.forEach(id => {
								facilitators && facilitators.length > 0 && facilitators.filter(s => s.id === id).forEach(g => {
										if (this.noDuplicate(g.id, recipients)) {
												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Teacher',
                        sendToEmail: g.emailAddress && g.bestContactEmail,
                        sendToText: g.phone && g.bestContactPhoneText,
                        fromFilter: 'Facilitators' };
												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 	g.	Add on the counselors, if any.
				if (state.selectedCounselors && state.selectedCounselors.length > 0) {
						state.selectedCounselors.forEach(id => {
								counselors && counselors.length > 0 && counselors.filter(s => s.id === id).forEach(g => {
										if (this.noDuplicate(g.id, recipients)) {
												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Counselor',
                        sendToEmail: g.emailAddress && g.bestContactEmail,
                        sendToText: g.phone && g.bestContactPhoneText,
                        fromFilter: 'Counselors' };
												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 	h.	Add on the mentors, if any.
				if (state.selectedMentors && state.selectedMentors.length > 0) {
						state.selectedMentors.forEach(id => {
								mentors && mentors.length > 0 && mentors.filter(s => s.id === id).forEach(g => {
										if (this.noDuplicate(g.id, recipients)) {
												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Mentor',
                        sendToEmail: g.emailAddress && g.bestContactEmail,
                        sendToText: g.phone && g.bestContactPhoneText,
                        fromFilter: 'Mentors' };
												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}
				// 	i.	Add on the admins, if any.
				if (state.selectedAdmins && state.selectedAdmins.length > 0) {
						state.selectedAdmins.forEach(id => {
								admins && admins.length > 0 && admins.filter(s => s.id === id).forEach(g => {
										if (this.noDuplicate(g.id, recipients)) {
												let newRecipient = { personId: g.id, firstName: g.firstName, lastName: g.lastName, role: 'Admin',
                        sendToEmail: g.emailAddress && g.bestContactEmail,
                        sendToText: g.phone && g.bestContactPhoneText,
                        fromFilter: 'Admins' };
												recipients = recipients && recipients.length > 0 && recipients.indexOf(g.id) === -1 ? recipients.concat(newRecipient) : [newRecipient]
										}
								})
						})
				}

				this.setState({ announcement: {...this.state.announcement, recipients }});
		}

		handleSelectedGuardians = (selectedGuardians) => {
				this.setState({selectedGuardians});
				this.setRecipients('selectedGuardians', selectedGuardians);
    }

		handleSelectedStudents = (selectedStudents) => {
				this.setState({selectedStudents});
				this.setRecipients('selectedStudents', selectedStudents);
    }

		handleSelectedCourses = (selectedCourses) => {
				this.setState({selectedCourses});
				this.setRecipients('selectedCourses', selectedCourses);
    }

		handleSelectedFacilitators = (selectedFacilitators) => {
				this.setState({selectedFacilitators});
				this.setRecipients('selectedFacilitators', selectedFacilitators);
    }

		handleSelectedAdmins = (selectedAdmins) => {
				this.setState({selectedAdmins});
				this.setRecipients('selectedAdmins', selectedAdmins);
    }

		handleSelectedMentors = (selectedMentors) => {
				this.setState({selectedMentors});
				this.setRecipients('selectedMentors', selectedMentors);
    }

		handleSelectedCounselors = (selectedCounselors) => {
				this.setState({selectedCounselors});
				this.setRecipients('selectedCounselors', selectedCounselors);
    }

		removeRecipient = (personId) => {
				let announcement = this.state.announcement;
				announcement.recipients = announcement.recipients.filter(m => m.personId !== personId);
				this.setState({announcement});
		}

		guardiansValueRenderer = (selected, options) => {
        return <L p={p} t={`Add Individual Guardians:  ${selected.length} of ${options.length}`}/>;
    }

		studentsValueRenderer = (selected, options) => {
        return <L p={p} t={`Add Individual Students:  ${selected.length} of ${options.length}`}/>;
    }

		coursesValueRenderer = (selected, options) => {
        return <div className={styles.bold}><L p={p} t={`Courses (students assigned):  ${selected.length} of ${options.length}`}/></div>;
    }

		facilitatorsValueRenderer = (selected, options) => {
        return <L p={p} t={`Teachers:  ${selected.length} of ${options.length}`}/>;
    }

		adminsValueRenderer = (selected, options) => {
        return <L p={p} t={`Administrators:  ${selected.length} of ${options.length}`}/>;
    }

		mentorsValueRenderer = (selected, options) => {
        return <L p={p} t={`Learning Coaches:  ${selected.length} of ${options.length}`}/>;
    }

		counselorsValueRenderer = (selected, options) => {
        return <L p={p} t={`Counselors:  ${selected.length} of ${options.length}`}/>;
    }

		togglePrimaryGuardian = (event) => {
				//When this is set to true, include all of the primary guardians of the chosen students.
				//when it is false, unselect specifically the guardians that are chosen in the guardian list (since it is possible that one or more guardians are chosen which do not belong to chosen students)
				//And remember that when a student is de-selected that the guardian is also de-selected IF this is checked.
				//	And that deselection can happen in the table list below on a "remove" click.
	      this.setState({ includeGuardians: event.target.checked, notIncludeStudentsOfGuardians: event.target.checked ? this.state.notIncludeStudentsOfGuardians : false });
				this.setRecipients('includeGuardians', event.target.checked)
		}

		toggleNotStudentsOfGuardian = (event) => {
	      this.setState({ notIncludeStudentsOfGuardians: event.target.checked });
				this.setRecipients('notIncludeStudentsOfGuardians', event.target.checked)
		}

		// handleFileUploadOpen = () => this.setState({isShowingFileUpload: true })
	  // handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
		// handleSubmitFile = () => {
		// 		const {getAnnouncementAttachments, personId, announcementId} = this.props;
		// 		getAnnouncementAttachments(personId, announcementId);
		// 		//this.handleFileUploadClose();
	  // }

    handleRemoveInputFile = () => {
  			this.setState({
            selectedFile: null,
            attachmentUrl: '',
            attachmentTitle: '',
            announcementAttachmentId: '',
        });
  			var img = this.imageViewer;
  	    img.src = '';
  			this.showFile.after(img);
  	}

    handleInputFile = (selectedFile) => {
  			this.setState({ selectedFile });
  			var img = this.imageViewer;
  			var reader = new FileReader();
  			reader.onloadend = function() {
  			    img.src = reader.result;
  			}
  			reader.readAsDataURL(selectedFile);
  			this.showFile.after(img);
  	}

    handleFileUploadOpen = () => this.setState({isShowingFileUpload: true })
  	handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
  	handleFileUploadSubmit = () => {
  			const {personId} = this.props;
  			const {selectedFile, announcement={}} = this.state;
  			let data = new FormData();
  			data.append('file', selectedFile)
  			let url = `${apiHost}ebi/announcementAttachments/fileUpload/${personId}/${announcement.announcementId || ''}`; // + `/` + encodeURIComponent(announcement.title);
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
  					.catch(function (error) {
  						//Show error here.
  				  })
  					.then(response => {
                if (!announcement.assignmentId || announcement.assignmentId === guidEmpty) {
                    let announcement = Object.assign({}, this.state.announcement);
                    announcement.announcementId = response.data.announcementId;
                    this.setState({
                        announcement,
                        attachmentUrl: response.data.urlTemp,
                        attachmentTitle: response.data.title,
                        announcementAttachmentId: response.data.announcementAttachmentId,
                    })
  							}
  					})
  			this.handleFileUploadClose();
  	}

		handleRemoveFileOpen = (announcementAttachmentId) => this.setState({isShowingModal_removeFile: true, announcementAttachmentId })
		handleRemoveFileClose = () => this.setState({isShowingModal_removeFile: false})
		handleRemoveFile = () => {
				const {removeAnnouncementAttachmentFile, personId} = this.props;
				const {announcementAttachmentId} = this.state;
				removeAnnouncementAttachmentFile(personId, announcementAttachmentId);
				this.handleRemoveFileClose();
        this.handleRemoveInputFile();
		}

		// fileUploadBuildUrl = (title) => {
	  //     const {personId, announcementId} = this.props;
	  //     return `${apiHost}ebi/announcementAttachments/fileUpload/` + personId + `/` + announcementId + `/` + encodeURIComponent(title);
	  // }

		// recallAfterFileUpload = () => {
	  //   	const {getAnnouncementAttachments, personId, announcementId} = this.props;
	  //   	getAnnouncementAttachments(personId, announcementId);
		// 		this.handleFileUploadClose();
	  // }

		toggleGradeLevel = (gradeLevelId) => {
				let selectedGradeLevels = this.state.selectedGradeLevels;
				selectedGradeLevels = selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(gradeLevelId) > -1
						? selectedGradeLevels.filter(id => id !== gradeLevelId)
						: selectedGradeLevels && selectedGradeLevels.length > 0
								? selectedGradeLevels.concat(gradeLevelId)
								: [gradeLevelId];
				this.setState({ selectedGradeLevels })
				this.setRecipients('selectedGradeLevels', selectedGradeLevels)
		}

		handleStudentType = (value) => {
				this.setState({ studentType: value });
				this.setRecipients('studentType', value);
		}

		handleAccredited = (value) => {
				this.setState({ accredited: value });
				this.setRecipients('accredited', value);
		}

		changeNewSavedMessageGroupName = (event) => {
				this.setState({ messageGroupName: event.target.value });
		}

		handleEnterKeySaveGroupName = (event) => {
				if (event.key === 'Enter') {
						this.saveOrUpdateMessageGroup(event, false)
				}
		}

		saveOrUpdateMessageGroup = (event, isUpdate) => {
				const {addOrUpdateMessageGroup, personId, messageGroups} = this.props;
				const {messageGroupId, messageGroupName} = this.state;

				let groupName = '';
				if (isUpdate) {
						let messageGroup  = messageGroups && messageGroups.length > 0 && messageGroups.filter(m => m.messageGroupId === messageGroupId)[0];
						if (messageGroup && messageGroup.groupName) groupName = messageGroup.groupName;
						this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Your message group was updated.`}/></div>)

				} else {
						groupName = messageGroupName;
						this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Your message group was added.`}/></div>)
				}

				let messageGroup = {
						messageGroupId: isUpdate ? this.state.messageGroupId : guidEmpty,
						personId: personId,
						groupName,
						selectedCourses: this.state.selectedCourses.toString(),
						selectedGradeLevels: this.state.selectedGradeLevels.toString(),
						studentType: this.state.studentType,
						accredited: this.state.accredited,
						includeGuardians: !!this.state.includeGuardians,
						notIncludeStudentsOfGuardians: !!this.state.notIncludeStudentsOfGuardians,
						selectedStudents: this.state.selectedStudents.toString(),
						selectedGuardians: this.state.selectedGuardians.toString(),
						selectedFacilitators: this.state.selectedFacilitators.toString(),
						selectedMentors: this.state.selectedMentors.toString(),
						selectedCounselors: this.state.selectedCounselors.toString(),
						selectedAdmins: this.state.selectedAdmins.toString(),
				}
				addOrUpdateMessageGroup(personId, messageGroup)
				this.setState({ messageGroupName: '' })
		}

		setMessageGroup = (event) => {
				const {messageGroups} = this.props;
				let newState = Object.assign({}, this.state);

				if (!event.target.value || event.target.value === "0") {
						newState.messageGroupId = event.target.value;
						newState.selectedCourses = [];
						newState.selectedGradeLevels = [];
						newState.studentType = 'ALL';
						newState.accredited = 'ALL';
						newState.includeGuardians = false;
						newState.notIncludeStudentsOfGuardians = false;
						newState.selectedStudents = [];
						newState.selectedGuardians = [];
						newState.selectedFacilitators = [];
						newState.selectedMentors = [];
						newState.selectedCounselors = [];
						newState.selectedAdmins = [];
				} else {
						let messageGroup = messageGroups && messageGroups.length > 0 && messageGroups.filter(m => m.messageGroupId === event.target.value)[0]
						if (messageGroup && messageGroup.messageGroupId) {
								newState.messageGroupId = event.target.value;
								newState.selectedCourses = !messageGroup.selectedCourses ? [] : messageGroup.selectedCourses.split(',');
								newState.selectedGradeLevels = !messageGroup.selectedGradeLevels ? [] : messageGroup.selectedGradeLevels.split(',');
								newState.studentType = messageGroup.studentType;
								newState.accredited = messageGroup.accredited;
								newState.includeGuardians = messageGroup.includeGuardians;
								newState.notIncludeStudentsOfGuardians = messageGroup.notIncludeStudentsOfGuardians;
								newState.selectedStudents = !messageGroup.selectedStudents ? [] : messageGroup.selectedStudents.split(',');
								newState.selectedGuardians = !messageGroup.selectedGuardians ? [] : messageGroup.selectedGuardians.split(',');
								newState.selectedFacilitators = !messageGroup.selectedFacilitators ? [] : messageGroup.selectedFacilitators.split(',');
								newState.selectedMentors = !messageGroup.selectedMentors ? [] : messageGroup.selectedMentors.split(',');
								newState.selectedCounselors = !messageGroup.selectedCounselors ? [] : messageGroup.selectedCounselors.split(',');
								newState.selectedAdmins = !messageGroup.selectedAdmins ? [] : messageGroup.selectedAdmins.split(',');
						}
				}
				newState.isUserChangedMessageGroupId = true;
				this.setState(newState);
				this.setRecipients('', '', newState);
		}

		deleteSavedMessageGroup = () => {
				const {removeMessageGroup, personId} = this.props
				const {messageGroupId} = this.state
				removeMessageGroup(personId, messageGroupId)
				this.setState({ messageGroupId: '' })
		}

		toggleHideGroupChoices = () => {
				this.setState({ hideGroupChoices: !this.state.hideGroupChoices });
		}

		handleResetGroupOpen = (recipient_personId) => this.setState({ isShowingModal_resetGroup: true, recipient_personId })
		handleResetGroupClose = (isClose, setRecipient) => {
				if (isClose) this.setState({ isShowingModal_resetGroup: false })
				if (setRecipient) this.setFromPersonId(this.state.recipient_personId, false); //false is NOT to reset the group choices.
		}
		handleResetGroup = () => {
				this.handleResetGroupClose(true);
				this.resetFilters(false); //Don't reset the single recipient.
				this.setFromPersonId(this.state.recipient_personId, true); //True is to reset the group choices.
		};

    changeRecipient = (personChosen) => {
        if (personChosen && personChosen.id) this.setFromPersonId(personChosen.id, true);
        this.setState({ personChosen });
    }

    render() {
      const {personId, facilitators, mentors, guardians, counselors, accessRoles={}, companyConfig={}, announcementAttachments,
							gradeLevels, messageGroups, students, coursesScheduled, admins, singleSimpleList, myFrequentPlaces, setMyFrequentPlace} = this.props;
      const {announcement={}, isRecordComplete, errorSubject, includeGuardians, isShowingFileUpload, isShowingModal_removeFile,
		 					messageGroupId, messageGroupName, notIncludeStudentsOfGuardians, selectedGradeLevels, studentType,
							accredited, selectedGuardians, selectedStudents, selectedCourses, selectedFacilitators, selectedAdmins, selectedMentors,
							selectedCounselors, hideGroupChoices, personChosen, isShowingModal_resetGroup, selectedFile, attachmentTitle,
              announcementAttachmentId} = this.state;
			let recipients = []

			if (announcement && announcement.recipients && announcement && announcement.recipients.length > 0) {
					recipients = doSort(announcement.recipients, {sortField: companyConfig.studentNameFirst === 'FIRSTNAME' ? 'firstName' : 'lastName', isAsc: true, isNumber: false})
			}
      let headings = [{},
      		{label: <L p={p} t={`Recipient`}/>},
      		{label: <L p={p} t={`Role`}/>},
      		{label: <L p={p} t={`Email`}/>},
      		{label: <L p={p} t={`Text`}/>}
		];
      let data = recipients && recipients.length > 0
          ? recipients.map((m, i) => {
								if (!m) return null;
                return [
                    { value: <a onClick={() => this.removeRecipient(m.personId)} className={styles.remove}><L p={p} t={`remove`}/></a>},
										{ id: m.fromPersonId, value: m.firstName + ' ' + m.lastName},
                    { id: m.fromPersonId, value: m.role},
                    { id: m.fromPersonId, value: m.sendToEmail ? <L p={p} t={`Email`}/> : ''},
                    { id: m.fromPersonId, value: m.sendToText ? <L p={p} t={`Text`}/> : ''},
                ]})
          : [[{},{value: <L p={p} t={`no recipients chosen`}/>}]]

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  	<L p={p} t={`Compose a message`}/>
                </div>
								<div className={styles.row}>
										<div>
                        <InputDataList
                            name={`personChosen`}
                            label={<L p={p} t={`Single recipient`}/>}
                            value={personChosen}
                            options={singleSimpleList}
                            className={styles.moreBottomMargin}
                            height={`medium`}
                            multiple={false}
                            onChange={this.changeRecipient}/>
										</div>
										<div className={styles.groupPlacement}>
                        <div className={styles.plainText}><L p={p} t={`For multiple recipients`}/></div>
												<TextDisplay text={<a className={styles.link} onClick={this.toggleHideGroupChoices}><L p={p} t={`Choose from groups`}/></a>} />
										</div>
								</div>
                <div className={styles.formLeft}>
                    <InputText
                        id={`subject`}
                        name={`subject`}
                        size={"long"}
                        label={<L p={p} t={`Subject`}/>}
                        value={announcement.subject || this.props.subject || ''}
                        onChange={this.changeAnnouncement}
												onBlur={this.handleMessageSave}
                        onEnterKey={this.handleEnterKey}
                        error={errorSubject} />
								</div>
								<div className={styles.textareaDiv}>
	                  <span className={styles.inputText}><L p={p} t={`Message`}/></span><br/>
	                  <textarea rows={5}
	                          id={'message'}
	                          name={'message'}
														value={announcement.message}
	                          onChange={this.changeAnnouncement}
														onBlur={this.handleMessageSave}
	                          className={styles.commentTextarea}>
	                  </textarea>
	              </div>
								<div className={styles.marginLeft}>
                    <img src={''} alt={'New'} ref={(ref) => (this.imageViewer = ref)} />
                    <div className={classes(styles.row, styles.includePicture)} ref={(ref) => (this.showFile = ref)} onClick={this.handleFileUploadOpen}>
                        <Icon pathName={'camera2'} premium={true} className={styles.icon}/>
                        <div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Attach file or picture`}/></div>
                    </div>
                    <div className={styles.row}>
                        {attachmentTitle &&
                            <div className={styles.text}>
                                {attachmentTitle}
                            </div>
                        }
                        {announcementAttachmentId &&
                            <a onClick={() => this.handleRemoveFileOpen(announcementAttachmentId)} className={styles.remove}>
                                <L p={p} t={`remove`}/>
                            </a>
                        }
                    </div>
										{announcementAttachments && announcementAttachments.length > 0 && announcementAttachments.map((f, i) => (
												<div key={i} className={styles.row}>
														<div className={styles.linkDisplay}>
														</div>
												</div>
										))}
										{!announcementAttachmentId &&
												<div className={styles.noDocs}><L p={p} t={`No attachment found`}/></div>
										}
								</div>
								<div className={classes(styles.rowRight)}>
                    <Button label={<L p={p} t={`Send`}/>} className={classes((isRecordComplete ? styles.opacityFull : styles.opacityLow))}
												onClick={(event) => this.processForm("FINISH", event)}/>
                </div>
								<div className={classes(styles.classification, styles.row)}>
										<div className={styles.lowerPosition}><L p={p} t={`Send to group:`}/></div>
										<div className={classes(styles.biggerLeft, styles.lowerPosition)}>
												<a onClick={this.toggleHideGroupChoices} className={classes(styles.row, styles.whiteLink, styles.moreLeft)}>
														<Icon pathName={'magnifier'} premium={true} className={styles.icon} fillColor={'white'}/>
														{hideGroupChoices ? <L p={p} t={`Show group choices`}/> : <L p={p} t={`Hide group choices`}/>}
												</a>
										</div>
								</div>
								{(accessRoles.admin || accessRoles.facilitator) && !hideGroupChoices &&
										<div className={styles.grayBackground}>
                        <FilterGroupsSaved filterGroups={messageGroups} filterGroupSavedId={messageGroupId} filterGroupName={messageGroupName}
                            setFilterGroup={this.setMessageGroup} saveOrUpdateGroup={this.saveOrUpdateMessageGroup} hasFilterChosen={this.hasFilterChosen}
                            changeNewSavedGroupName={this.changeNewSavedMessageGroupName} deleteSavedGroup={this.deleteSavedMessageGroup} resetFilters={this.resetFilters}
                            handleEnterKeySaveGroupName={this.handleEnterKeySaveGroupName}/>
										</div>
								}
								{(accessRoles.admin || accessRoles.facilitator) && !hideGroupChoices &&
										<div className={styles.backgroundFilters}>
												<hr/>
												<div className={styles.multiSelect}>
														<MultiSelect
																name={'Courses'}
																options={coursesScheduled || []}
																onSelectedChanged={this.handleSelectedCourses}
																valueRenderer={this.coursesValueRenderer}
																getJustCollapsed={() => {}}
																selected={selectedCourses || []}/>
												</div>
												<hr/>
												<div className={classes(styles.moreLeft, styles.header)}><L p={p} t={`Students in grade level`}/></div>
												<div className={classes(styles.doubleLeft, styles.moreBottomMargin, styles.rowWrap)}>
														{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label.length <= 2).map((m, i) =>
																<Checkbox
																		key={i}
																		id={m.id}
																		label={m.label}
																		checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(m.id) > -1) || ''}
																		onClick={() => this.toggleGradeLevel(m.id)}
																		labelClass={styles.labelCheckbox}
																		checkboxClass={styles.checkbox} />
														)}
												</div>
												{companyConfig.urlcode === 'Liahona' &&
														<RadioGroup
																data={[{ id: "ALL", label: <L p={p} t={`All`}/> }, { id: "ACADEMY", label: <L p={p} t={`Academy`}/> }, { id: "DE", label: <L p={p} t={`Distance Education`}/> }]}
																title={<L p={p} t={`Student Type`}/>}
																id={'studentType'}
																name={'studentType'}
																horizontal={true}
																className={styles.radio}
																initialValue={studentType}
																onClick={(value) => this.handleStudentType(value)}/>
												}
												{companyConfig.urlcode === 'Liahona' &&
														<RadioGroup
																data={[{ id: "ALL", label: <L p={p} t={`All`}/> }, { id: 'accredited', label: <L p={p} t={`Accredited`}/> }, { id: 'non-accredited', label: <L p={p} t={`Non-accredited`}/> }]}
																title={<L p={p} t={`Accredited`}/>}
																id={'accredited'}
																name={'accredited'}
																horizontal={true}
																className={styles.radio}
																initialValue={accredited}
																onClick={(value) => this.handleAccredited(value)}/>
												}
										</div>
								}
								{!hideGroupChoices &&
										<div className={styles.backgroundFilters}>
												<hr/>
												<div className={styles.multiSelect}>
														<MultiSelect
																name={'students'}
																options={students || []}
																onSelectedChanged={this.handleSelectedStudents}
																valueRenderer={this.studentsValueRenderer}
																getJustCollapsed={() => {}}
																selected={selectedStudents || []}/>
												</div>
										</div>
								}
								{(accessRoles.admin || accessRoles.facilitator) && !hideGroupChoices &&
										<div className={styles.backgroundFilters}>
												<hr/>
												<div className={styles.checkboxPosition}>
														<div className={classes(styles.leftMove, styles.header)}><L p={p} t={`Guardians`}/></div>
														<Checkbox
								                id={`includeGuardians`}
								                label={<L p={p} t={`With the chosen students, include their primary guardians?`}/>}
								                position={'after'}
								                checked={includeGuardians || ''}
								                onClick={this.togglePrimaryGuardian}
								                labelClass={styles.longLabel}
								                checkboxClass={styles.checkbox} />
														<Checkbox
																id={`notIncludeStudentsOfGuardians`}
								                label={<L p={p} t={`Do NOT include students in the recipient list?`}/>}
								                position={'after'}
								                checked={notIncludeStudentsOfGuardians || ''}
								                onClick={this.toggleNotStudentsOfGuardian}
								                labelClass={classes(styles.longLabel, (includeGuardians ? '' : styles.disabledText))}
																disabled={!includeGuardians}
								                checkboxClass={styles.checkbox} />
												</div>
												<div className={styles.multiSelect}>
				                    <MultiSelect
				                        name={'guardians'}
				                        options={guardians || []}
				                        onSelectedChanged={this.handleSelectedGuardians}
				                        valueRenderer={this.guardiansValueRenderer}
				                        getJustCollapsed={() => {}}
				                        selected={selectedGuardians || []}/>
												</div>
		                </div>
								}
								{(companyConfig.urlcode !== 'Manheim' || (companyConfig.urlcode === 'Manheim' && (accessRoles.admin || accessRoles.counselor))) && !hideGroupChoices &&
										<div className={classes(styles.backgroundFilters, styles.multiSelect, styles.biggerTop)}>
												<hr/>
		                    <MultiSelect
		                        name={'facilitators'}
		                        options={facilitators || []}
		                        onSelectedChanged={this.handleSelectedFacilitators}
		                        valueRenderer={this.facilitatorsValueRenderer}
		                        getJustCollapsed={() => {}}
		                        selected={selectedFacilitators || []}/>
		                </div>
								}
								{companyConfig.isMcl && !hideGroupChoices &&
										<div className={classes(styles.backgroundFilters, styles.multiSelect, styles.moreTop)}>
												<hr/>
		                    <MultiSelect
		                        name={'mentors'}
		                        options={mentors || []}
		                        onSelectedChanged={this.handleSelectedMentors}
		                        valueRenderer={this.mentorsValueRenderer}
		                        getJustCollapsed={() => {}}
		                        selected={selectedMentors || []}/>
		                </div>
								}
								{counselors && companyConfig.urlcode === 'Manheim' && !hideGroupChoices &&
										<div className={classes(styles.backgroundFilters, styles.multiSelect)}>
												<hr/>
		                    <MultiSelect
		                        name={'counselors'}
		                        options={counselors || []}
		                        onSelectedChanged={this.handleSelectedCounselors}
		                        valueRenderer={this.counselorsValueRenderer}
		                        getJustCollapsed={() => {}}
		                        selected={selectedCounselors || []}/>
		                </div>
								}
								{(accessRoles.admin || accessRoles.facilitator || accessRoles.counselor) && !hideGroupChoices &&
										<div className={classes(styles.backgroundFilters, styles.multiSelect)}>
												<hr/>
		                    <MultiSelect
		                        name={'admins'}
		                        options={admins || []}
		                        onSelectedChanged={this.handleSelectedAdmins}
		                        valueRenderer={this.adminsValueRenderer}
		                        getJustCollapsed={() => {}}
		                        selected={selectedAdmins || []}/>
		                </div>
								}
								{!hideGroupChoices && <hr />}
								{!hideGroupChoices &&
		                <div className={classes(styles.rowRight)}>
		                    <Button label={<L p={p} t={`Send`}/>} className={classes((isRecordComplete ? styles.opacityFull : styles.opacityLow))} onClick={(event) => this.processForm("FINISH", event)}/>
		                </div>
								}
								<hr/>
								<div className={styles.text}>{announcement && announcement.recipients
									? <div className={styles.row}><L p={p} t={`Recipients: `}/>{announcement && announcement.recipients && announcement.recipients.length}</div>
									: <div className={styles.row}><L p={p} t={`Recipients: `}/>0</div>}</div>
                <div className={globalStyles.instructions}><L p={p} t={`Recipients without email or text messaging will still recieve messages in their eCademy inbox.`}/></div>
								<div className={styles.scrollable}>
										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data}/>
								</div>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Compose Message`}/>} path={'announcementEdit'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingFileUpload &&
                <FileUploadModalWithCrop handleClose={this.handleFileUploadClose} title={<L p={p} t={`Message Attachment`}/>}
										personId={personId} submitFileUpload={this.handleFileUploadSubmit}
										file={selectedFile}
										handleInputFile={this.handleInputFile}
										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .mp3, .mp4, .m4a"}
										handleCancelFile={this.handleRemoveInputFile}/>
            }
						{isShowingModal_removeFile &&
                <MessageModal handleClose={this.handleRemoveFileClose} heading={<L p={p} t={`Remove this file attachment?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this file attachment?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFile} />
            }
						{isShowingModal_resetGroup &&
                <MessageModal handleClose={() => this.handleResetGroupClose(true, true)} heading={<L p={p} t={`Reset the group choices?`}/>}
                   explainJSX={<L p={p} t={`By choosing this single recipient, do you want to reset the group choices you have made?`}/>} isConfirmType={true}
                   onClick={this.handleResetGroup} />
            }
        </div>
    )};
}

export default withAlert(AnnouncementEditView);


// <FileUploadModal handleClose={this.handleFileUploadClose}
//     title={<L p={p} t={`Message Attachment`}/>} label={<L p={p} t={`File for`}/>} personId={personId} submitFileUpload={this.handleSubmitFile}
//     sendInBuildUrl={this.fileUploadBuildUrl} handleRecordRecall={this.recallAfterFileUpload} showTitleEntry={true}
//     acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .mp3, .mp4, .m4a"}
//     iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.mp3', '.mp4', '.m4a']}/>
