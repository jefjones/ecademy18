import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './StudentAddManualView.css';
import classes from 'classnames';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import DateTimePicker from '../../components/DateTimePicker';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import { withAlert } from 'react-alert';

class StudentAddManualView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentPersonId: '', //This is only used when modifying an existing record. but only one at a time and the bulk entry will be hidden.
      errorEmailAddress: '',
      errorBirthDate: '',
      errorExternalId: '',
      errorFirstName: '',
      errorEmailAddressParent1: '',
      errorFirstNameParent1: '',
      inviteMessage: '',
			isShowingModal_missingInfo: false,
      user: {
				firstName: '',
        middleName: '',
        lastName: '',
				genderId: '',
        birthDate: '',
				gradeLevelId: '',
        externalId: '',
        emailAddress: '',
        phone: '',
        mentorPersonId: '',
        firstNameParent1: '',
        lastNameParent1: '',
        emailAddressParent1: '',
        phoneParent1: '',
        firstNameParent2: '',
        lastNameParent2: '',
        emailAddressParent2: '',
        phoneParent2: '',
      },
    };
  }

  componentDidMount() {
      this.setState({
          studentPersonId: this.props.params && this.props.params.studentPersonId,
      });
      if (this.props.student) this.setState({ user: this.props.student });
  }

  handleFormChange = (chosenTab) => {
      this.setState({ localTabsData: { ...this.state.localTabsData, chosenTab }});
  }

  handleMessageChange = (event) => {
      this.setState({inviteMessage: event.target.value});
  }

  changeUser = (event) => {
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    field === "firstName" && this.setState({errorFirstName: ''});
    (field === "emailAddress" || field === "phone") && this.setState({errorEmailAddress: ''});
    // field === "emailAddress" && this.findContactMatches(event.target.value, '');
    // field === "phone" && this.findContactMatches('', event.target.value);
    if (field === "emailAddress") user[field] = user[field].replace(/ /g, "");

    this.setState({ user });
  }

  handleEnterKey = (event) => {
      event.key === "Enter" && this.processForm("STAY");
  }

  validateEmail = (email) => {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
      return re.test(email);
  }

  validatePhone = (phone) => {
      return this.stripPhoneFormatAndPrefix(phone).length === 10 ? true : false;
  }

  stripPhoneFormatAndPrefix = (phone) => {
      phone = phone && phone.replace(/\D+/g, "");
      if (phone && phone.indexOf('1') === 0) { //if 1 is in the first place, get rid of it.
          phone = phone.substring(1);
      }
      return phone;
  }

  processForm = (stayOrFinish, event) => {
    const {updateLearner, addLearner, personId} = this.props;
    const {user, studentPersonId} = this.state;
    // prevent default action. in this case, action is the form submission event
    event && event.preventDefault();
    let hasError = false;
		let missingInfoMessage = [];

    //It is possible that this is the "Finish" version of the processForm and the user might not be filled in.
    if (!user.firstName) {
        hasError = true;
        this.setState({errorFirstName: <L p={p} t={`The first name is required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
    }

		// if (!user.genderId) {
    //     hasError = true;
    //     this.setState({errorGender: <L p={p} t={`The student gender is required`}/> });
		// 		missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Gender`}/></div>
    // }

		if (user.emailAddress && !this.validateEmail(user.emailAddress)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`Email address appears to be invalid.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Invalid email address`}/></div>
    } else if (user.phone && !this.validatePhone(user.phone)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`The phone number should be ten digits long`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Ten digit phone number`}/></div>
    }
    // if (!user.externalId) {
    //     hasError = true;
    //     this.setState({errorExternalId: <L p={p} t={`The Learner Id is required.`}/> });
    // }
    // if (!user.birthDate) {
    //     hasError = true;
    //     this.setState({errorBirthDate: <L p={p} t={`The birth date is required`}/> });
		// 		missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Birth date`}/></div>
    // }
		if (!user.gradeLevelId) {
        hasError = true;
        this.setState({errorBirthDateerrorGradeLevel: <L p={p} t={`The grade level is required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Grade level`}/></div>
    }

    if (!user.firstNameParent1) {
        hasError = true;
        this.setState({errorFirstNameParent1: <L p={p} t={`Primary guardian's first name required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's first name`}/></div>
    }
    if (!user.emailAddressParent1) {
        hasError = true;
        this.setState({errorEmailAddressParent1: <L p={p} t={`Primary guardian's email address required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's email address`}/></div>
		} else if (user.emailAddressParent1 && !this.validateEmail(user.emailAddressParent1)) {
        hasError = true;
        this.setState({errorEmailAddressParent1: <L p={p} t={`Email address appears to be invalid.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary guardian's email address invalid`}/></div>
    }

		if (user.emailAddressParent2 && !this.validateEmail(user.emailAddressParent2)) {
				hasError = true;
				this.setState({errorEmailAddressParent2: <L p={p} t={`Email address appears to be invalid.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Secondary guardian's email address invalid`}/></div>
		}

    if (!hasError) {
        studentPersonId ? updateLearner(personId, user) : addLearner(personId, [user]);
        this.setState({
						studentPersonId: '', //This is only used when modifying an existing record. but only one at a time and the bulk entry will be hidden.
			      errorEmailAddress: '',
			      errorBirthDate: '',
			      errorExternalId: '',
						errorFirstName: '',
			      errorGender: '',
			      errorEmailAddressParent1: '',
			      errorFirstNameParent1: '',
			      inviteMessage: '',
            user: {
								firstName: '',
                middleName: '',
                lastName: '',
								genderId: '',
                birthDate: '',
								externalId: '',
                gradeLevelId: '',
                emailAddress: '',
                phone: '',
                mentorPersonId: '',
                firstNameParent1: '',
                lastNameParent1: '',
                emailAddressParent1: '',
								errorEmailAddressParent2: '',
                phoneParent1: '',
                firstNameParent2: '',
                lastNameParent2: '',
                emailAddressParent2: '',
                phoneParent2: '',
            },
        });
        if (stayOrFinish === "FINISH") {
            browserHistory.push(`/firstNav`)
        }
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The new student and guardian(s) have been entered.`}/></div>);
    } else {
				this.handleMissingInfoOpen(missingInfoMessage);
		}
  }

  handleBirthDate = (event) => {
    let user = this.state.user;
    user.birthDate = event.target.value;
    this.setState({ user });
  }

	fillInEmailAddress = (event) => {
			//if this is a valid email address and the emailAddress is empty, fill it in automatically with the user
			const {user} = this.state;
			let username = event.target.value;
			if (this.validateEmail(username) && !user.emailAddress) user.emailAddress = username;
	}

	checkDuplicateUsername = (event) => {
			this.props.isDuplicateUsername(event.target.value);
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleUpdateSchoolYear = ({target}) => {
			const {personId, updatePersonConfig, getLearners} = this.props;
			this.setState({ courseScheduledschoolYearId: target.value });
			updatePersonConfig(personId, 'SchoolYearId', target.value, () => getLearners(personId));
	}

  handleSelectedSchoolYears = selectedSchoolYears => {
      let user = Object.assign({}, this.state.user);
      user['schoolYearIds'] = selectedSchoolYears && selectedSchoolYears.length > 0 && selectedSchoolYears.reduce((acc, m) => acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
      this.setState({ user, selectedSchoolYears });
  }

  render() {
    const {personId, gradeLevels, loginData, schoolYears, genders, myFrequentPlaces, setMyFrequentPlace} = this.props;
    const {user, errorFirstName, errorBirthDate, errorExternalId, errorEmailAddressParent1, errorEmailAddressParent2, errorFirstNameParent1,
            errorGradeLevel, messageInfoIncomplete, isShowingModal_missingInfo, selectedSchoolYears, errorSchoolYear} = this.state;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <span className={globalStyles.pageTitle}><L p={p} t={`Add Student`}/></span>
            </div>
            <div className={styles.formLeft}>
                <div>
                    <InputDataList
                        label={<L p={p} t={`School year(s)`}/>}
                        name={'selectedSchoolYears'}
                        options={schoolYears}
                        value={selectedSchoolYears}
                        multiple={true}
                        height={`medium`}
                        listAbove={true}
                        className={styles.moreSpace}
                        onChange={this.handleSelectedSchoolYears}
                        required={true}
                        whenFilled={selectedSchoolYears && selectedSchoolYears.length > 0}
                        error={errorSchoolYear}/>
                </div>
                <InputText
                    size={"medium"}
                    name={"firstName"}
                    label={<L p={p} t={`First name`}/>}
                    value={user.firstName || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
										required={true}
										whenFilled={user.firstName}
                    error={errorFirstName} />
								<InputText
                    size={"medium"}
                    name={"middleName"}
                    label={<L p={p} t={`Middle name`}/>}
                    value={user.middleName || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    error={errorFirstName} />
                <InputText
                    size={"medium"}
                    name={"lastName"}
                    label={<L p={p} t={`Last name`}/>}
                    value={user.lastName || ''}
                    onEnterKey={this.handleEnterKey}
                    onChange={this.changeUser}/>
								<SelectSingleDropDown
                    id={`genderId`}
                    name={`genderId`}
                    label={<L p={p} t={`Gender`}/>}
                    value={user.genderId || ''}
										height={`medium`}
                    options={genders}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey} />
                <div className={styles.columnAndText}>
                    <span className={styles.text}><L p={p} t={`Birth date:`}/></span>
                    <DateTimePicker name={`birthDate`} value={user.birthDate || ''} onChange={this.handleBirthDate}/>
                    <span className={styles.error}>{errorBirthDate}</span>
                </div>
								<div>
										<SelectSingleDropDown
												id={`gradeLevelId`}
												name={`gradeLevelId`}
												label={<L p={p} t={`Grade level`}/>}
												value={user.gradeLevelId || ''}
												options={gradeLevels}
												height={`medium`}
												onChange={this.changeUser}
												onEnterKey={this.handleEnterKey}
												required={true}
												whenFilled={user.gradeLevelId}
												error={errorGradeLevel} />
								</div>
								<InputText
                    size={"medium"}
                    name={"username"}
                    label={"Username"}
                    value={user.username || ''}
                    onEnterKey={this.handleEnterKey}
										onBlur={(event) => {this.fillInEmailAddress(event); this.checkDuplicateUsername(event)}}
                    onChange={this.changeUser}
										required={true}
										whenFilled={user.username && !loginData.isDuplicateUsername}
										error={loginData.isDuplicateUsername
												? <div className={styles.error}>Duplicate username!</div>
												: errorExternalId
										}/>
                <InputText
                    size={"medium"}
                    name={"password"}
                    label={"Password (optional)"}
                    value={user.password || ''}
                    onChange={this.changeUser}
										required={true}/>
                <hr />
								<div className={styles.grayBack}>
										<div className={globalStyles.instructions}>
												<L p={p} t={`Optional:  This is the student's email and cell number.`}/>
												<L p={p} t={`You may enter the parent/guardians' contact information here, but you will also have the chance to enter the parent/guardians' information on their entry form.`}/>
										</div>
										<div className={classes(styles.subheader, styles.row)}>
												<L p={p} t={`Email address and/or cell number for text messages`}/>
										</div>
                    <InputText
                        size={"medium-long"}
                        name={"emailAddress"}
                        label={<L p={p} t={`Email address`}/>}
                        value={user.emailAddress || ''}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey} />
                    <InputText
                        size={"medium-short"}
                        name={"phone"}
                        label={<L p={p} t={`Text message phone number (optional)`}/>}
                        value={user.phone || ''}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey} />
								</div>
								<InputText
                    size={"short"}
                    name={"externalId"}
                    label={<L p={p} t={`Student id (optional - for other school systems)`}/>}
                    value={user.externalId || ''}
                    onEnterKey={this.handleEnterKey}
                    onChange={this.changeUser}
                    error={errorExternalId}/>
                {/*<SelectSingleDropDown
                    id={`mentorPersonId`}
                    label={<L p={p} t={`Learning coach`}/>}
                    value={user.mentorPersonId || ''}
                    options={mentors}
                    height={`medium`}
                    onChange={this.changeUser} />*/}
                <hr />
                <span className={styles.subHeader}><L p={p} t={`Guardian (primary)`}/></span>
                <InputText
                    size={"medium"}
                    name={"firstNameParent1"}
                    label={<L p={p} t={`First name`}/>}
                    value={user.firstNameParent1 || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
										required={true}
										whenFilled={user.firstNameParent1}
                    error={errorFirstNameParent1} />
                <InputText
                    size={"medium"}
                    name={"lastNameParent1"}
                    label={<L p={p} t={`Last name`}/>}
                    value={user.lastNameParent1 || ''}
                    onEnterKey={this.handleEnterKey}
                    onChange={this.changeUser}/>
                <InputText
                    size={"medium-long"}
                    name={"emailAddressParent1"}
                    label={<L p={p} t={`Email address`}/>}
                    value={user.emailAddressParent1 || ''}
                    onChange={this.changeUser}
										required={true}
										whenFilled={user.emailAddressParent1}
                    onEnterKey={this.handleEnterKey}
                    error={errorEmailAddressParent1} />
                <InputText
                    size={"medium-short"}
                    name={"phoneParent1"}
                    label={<L p={p} t={`Text message phone number (optional)`}/>}
                    value={user.phoneParent1 || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    instructions={``} />
                <hr />
                <span className={styles.subHeader}><L p={p} t={`Guardian (secondary - optional)`}/></span>
                <InputText
                    size={"medium"}
                    name={"firstNameParent2"}
                    label={<L p={p} t={`First name`}/>}
                    value={user.firstNameParent2 || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    error={errorFirstName} />
                <InputText
                    size={"medium"}
                    name={"lastNameParent2"}
                    label={<L p={p} t={`Last name`}/>}
                    value={user.lastNameParent2 || ''}
                    onEnterKey={this.handleEnterKey}
                    onChange={this.changeUser}/>
                <InputText
                    size={"medium-long"}
                    name={"emailAddressParent2"}
                    label={<L p={p} t={`Email address`}/>}
                    value={user.emailAddressParent2 || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    error={errorEmailAddressParent2}	 />
                <InputText
                    size={"medium-short"}
                    name={"phoneParent2"}
                    label={<L p={p} t={`Text message phone number (optional)`}/>}
                    value={user.phoneParent2 || ''}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    instructions={``} />
            </div>
            {/*<span className={styles.label}>{`Add a message (optional)`}</span><br/>
            <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => this.handleMessageChange(event)}
                className={styles.messageBox}></textarea>*/}
            <div className={classes(styles.rowRight)}>
								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Add (manual)`}/>} path={'studentAddManual'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
        </div>
    );
  }
}

export default withAlert(StudentAddManualView);
