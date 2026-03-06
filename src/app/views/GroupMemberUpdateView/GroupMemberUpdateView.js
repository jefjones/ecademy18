import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './GroupMemberUpdateView.css';
const p = 'GroupMemberUpdateView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import InputText from '../../components/InputText';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';

//This page is different out of necessity because a group member can have its data manipulated by the teacher.  But be aware that them
//  PersonGroupAssign table has its own copy of the first name, last name, email address, phone, and internal member id.  The user can
//  change their own name for their own record on Penspring and continue to use Penspring at their own discretion.  This is particularly
//  helpful, too, in class arrangements when the names of the people need to be hidden from other students. An arbitrary nickname can be given.

class GroupMemberUpdateView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserComplete: false,
      errorEmailAddress: '',
      errorFirstName: '',
      user: {
        firstName: '',
        lastName: '',
        memberId: '',
        emailAddress: '',
        phone: '',
      },
    };

    this.processForm = this.processForm.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.stripPhoneFormatAndPrefix = this.stripPhoneFormatAndPrefix.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return nextState !== this.state ? true : false;
  // }

  componentDidMount() {
      this.setState({
          // errorEmailAddress: '',
          // errorFirstName: '',
          user: this.props.member
      });
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    field === "firstName" && this.setState({errorFirstName: ''});
    (field === "emailAddress" || field === "phone") && this.setState({errorEmailAddress: ''});

    this.setState({
      user
    });
  }

  handleEnterKey(event) {
      event.key === "Enter" && this.processForm();
  }

  validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
      return re.test(email);
  }

  validatePhone(phone) {
      return this.stripPhoneFormatAndPrefix(phone).length === 10 ? true : false;
  }

  stripPhoneFormatAndPrefix(phone) {
      phone = phone && phone.replace(/\D+/g, "");
      if (phone && phone.indexOf('1') === 0) { //if 1 is in the first place, get rid of it.
          phone = phone.substring(1);
      }
      return phone;
  }

  processForm(event) {
    const {updateGroupMember, personId, group} = this.props;
    const {user} = this.state;
    let hasError = false;
    // event.preventDefault();
    // event.stopPropagation();

    if (!user.firstName) {
        hasError = true;
        this.setState({errorFirstName: <L p={p} t={`First name required.`}/> });
    }

    if (!user.emailAddress && !user.phone) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`Please enter an email address or a phone number for text messaging.`}/> });
    } else if (user.emailAddress && !this.validateEmail(user.emailAddress)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`Email address appears to be invalid.`}/> });
    }

    if (user.phone && !this.validatePhone(user.phone)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`The phone number should be ten digits long.`}/> });
    }

    if (!hasError) {
        updateGroupMember(personId, group.groupId, user);
        browserHistory.push(`/assignmentDashboard`)
    }
  }

  render() {
    const {group} = this.props;
    const {user, errorFirstName, errorEmailAddress} = this.state;

    return (
        <div className={styles.container}>
            <div className={styles.titleLine}>
                <span className={globalStyles.pageTitle}>Group Members</span>
            </div>
            <div className={styles.row}>
                <span className={styles.subTitle}>{group && group.groupName}</span>
            </div>
            <div>
                <div className={styles.formLeft}>
                    <InputText
                        size={"medium"}
                        name={"firstName"}
                        label={<L p={p} t={`First name`}/>}
                        value={user.firstName || ''}
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
                    <InputText
                        size={"medium"}
                        name={"memberId"}
                        label={<L p={p} t={`Internal id (optional)`}/>}
                        value={user.memberId || ''}
                        onEnterKey={this.handleEnterKey}
                        onChange={this.changeUser}/>
                    <hr />
                    <InputText
                        size={"medium-long"}
                        name={"emailAddress"}
                        label={<L p={p} t={`Email address`}/>}
                        value={user.emailAddress || ''}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        error={errorEmailAddress} />
                    <div className={styles.orPhone}><L p={p} t={`Or enter cell phone for text messaging:`}/></div>
                    <InputText
                        size={"medium-short"}
                        name={"phone"}
                        label={<L p={p} t={`Text message phone number`}/>}
                        value={user.phone || ''}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        instructions={<L p={p} t={`numbers only are acceptable`}/>} />
                    <hr />
                </div>
                <div className={classes(styles.rowRight)}>
                    <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} className={styles.button} onClick={(event) => this.processForm(event)}/>
                </div>
            </div>
            <OneFJefFooter />
        </div>
    );
  }
}

export default GroupMemberUpdateView;
