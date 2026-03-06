import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './UserAddView.css';
import classes from 'classnames';
import InputText from '../../components/InputText';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import Required from '../../components/Required';
import { withAlert } from 'react-alert';
import OneFJefFooter from '../../components/OneFJefFooter';

class UserAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			personId: props.personId,  //This is only used when modifying an existing record. but only one at a time and the bulk entry will be hidden.
      isUserComplete: false,
      errorEmailAddress: '',
      errorExternalId: '',
      errorFirstName: '',
      users: [], //This is an array of objects whether it is fed by the single entry or the bulk paste.
			isShowingModal_delete: false,
			isShowingModal_hasClass: false,
			isShowingModal_missingInfo: false,
      user: {
        firstName: '',
        lastName: '',
        externalId: '',
        emailAddress: '',
				phone: '',
				fromGradeLevelId: '',
        toGradeLevelId: '',
      },
    };
  }

	componentDidUpdate() {
			const {user} = this.props;
			if (!this.state.isInit && user && user.personId) {
					this.setState({ isInit: true, user, userPersonId: this.props.userPersonId });
			}
	}

  handleMessageChange = (event) => {
      this.setState({inviteMessage: event.target.value});
  }

  changeUser = (event) => {
    const field = event.target.name;
    let user = Object.assign({}, this.state.user);
    user[field] = event.target.value;
		field === "firstName" && this.setState({errorFirstName: ''});
    field === "lastName" && this.setState({errorLastName: ''});
    (field === "emailAddress" || field === "phone") && this.setState({errorEmailAddress: ''});
    field === "emailAddress" && this.findContactMatches(event.target.value, '');
    field === "phone" && this.findContactMatches('', event.target.value);
    if (field === "emailAddress") user[field] = user[field].replace(/ /g, "");
    this.setState({ user });
  }

	findContactMatches = (emailAddress, phone) => {
			const {contacts} = this.props;
			if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
					this.setState({ contactMatches: contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)) });
			}
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
    const {addUser, updateUser, personId, params, loginData, gradeLevels} = this.props;
    const {user} = this.state;
    // prevent default action. in this case, action is the form submission event
    event && event.preventDefault();
		let missingInfoMessage = [];

    if (!user.firstName) {
        this.setState({errorFirstName: <L p={p} t={`First name required.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
    }

		if (!user.lastName) {
        this.setState({errorLastName: <L p={p} t={`Last name required.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Last name`}/></div>
    }

    if (!user.emailAddress) {
        this.setState({errorEmailAddress: <L p={p} t={`An email address or cell phone for texting is required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address or cell phone`}/></div>
    } else if (user.emailAddress && !this.validateEmail(user.emailAddress)) {
        this.setState({errorEmailAddress: <L p={p} t={`Email address appears to be invalid`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Invalid email address`}/></div>
    } else if (user.phone && !this.validatePhone(user.phone) ) {
        this.setState({errorPhone: <L p={p} t={`The phone number should be ten digits long`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Ten digit phone number`}/></div>
    }

		if (!(user.fromGradeLevelId && user.fromGradeLevelId !== '0') || !(user.toGradeLevelId && user.toGradeLevelId !== '0')) {
				if (!(user.fromGradeLevelId && user.fromGradeLevelId !== '0')) {
		        this.setState({fromGradeLevelId: <L p={p} t={`Required`}/> });
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
		    }

				if (!(user.toGradeLevelId && user.toGradeLevelId !== '0')) {
		        this.setState({toGradeLevelId: <L p={p} t={`Required`}/> });
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
		    }
		} else {
				let fromGradeLevelSequence = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.gradeLevelId === user.fromGradeLevelId)[0]
				if (fromGradeLevelSequence && fromGradeLevelSequence.sequence) fromGradeLevelSequence = fromGradeLevelSequence.sequence;
				let toGradeLevelSequence = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.gradeLevelId === user.toGradeLevelId)[0]
				if (toGradeLevelSequence && toGradeLevelSequence.sequence) toGradeLevelSequence = toGradeLevelSequence.sequence;
				if (toGradeLevelSequence < fromGradeLevelSequence ) {
						this.setState({fromGradeLevelId: <L p={p} t={`The 'to grade level' is less than the 'from grade level'`}/> });
						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The 'from grade level' is less than the 'to grade level`}/></div>
				}
		}

		if (loginData.isDuplicateUsername) {
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username is duplicate`}/></div>
		}

    if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
				user.userRole = this.props.userRole;
        params && params.userPersonId ? updateUser(personId, user) : addUser(personId, [user]);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The user's record has been saved.`}/></div>)
        this.setState({
            user: {
              firstName: '',
              lastName: '',
							username: '',
              externalId: '',
              emailAddress: '',
              phone: '',
							fromGradeLevelId: '',
							toGradeLevelId: '',
            },
            errorFirstName: '',
            errorLastName: '',
            errorEmailAddress: '',
            fromGradeLevelId: '',
            toGradeLevelId: '',
        });
        params && params.userPersonId && browserHistory.push(`/schoolSettings`);
		} else {
				this.handleMissingInfoOpen(missingInfoMessage);
    }
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

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeUser, personId, userPersonId} = this.props;
			removeUser(personId, userPersonId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

	handleHasClassOpen = () => this.setState({ isShowingModal_hasClass: true });
	handleHasClassClose = () => this.setState({ isShowingModal_hasClass: false });
	handleHasClass = () => {
			const {removeUser, personId} = this.props;
			const {user} = this.state;
			removeUser(personId, user.personId);
			this.handleHasClassClose();
			browserHistory.push('/firstNav');
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

  render() {
    const {userRole, personId, login, accessRoles, loginData, userPersonId, gradeLevels, myFrequentPlaces, setMyFrequentPlace} = this.props;
    const {user, errorFirstName, errorLastName, errorEmailAddress, isShowingModal_hasClass, errorExternalId, isShowingModal_delete, messageInfoIncomplete,
						isShowingModal_missingInfo, fromGradeLevelId, toGradeLevelId} = this.state;

    return (
        <section className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <span className={globalStyles.pageTitle}>
										{userRole === 'admin'
												? `Add an Administrator`
												: userRole === 'facilitator'
														? `Add a Teacher`
														: userRole === 'frontDesk'
																? `Add a Front Desk User`
																: userRole === 'Counselor'
																		? `Add a Counselor`
																		: `Unknown`
										}
								</span>
            </div>
            <hr />
            <div>
                <div className={styles.formLeft}>
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
                        name={"lastName"}
                        label={<L p={p} t={`Last name`}/>}
                        value={user.lastName || ''}
                        onEnterKey={this.handleEnterKey}
                        onChange={this.changeUser}required={true}
												whenFilled={user.lastName}
                        error={errorLastName} />
										<InputText
                        size={"medium"}
                        name={"username"}
                        label={<L p={p} t={`Username`}/>}
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
                    <hr />
										<div className={styles.grayBack}>
												<div className={classes(styles.subheader, styles.row)}>
														Email address and/or cell number for text messages
														<Required setIf={true} className={styles.required}
																setWhen={(user.phone && this.validatePhone(user.phone)) ||  (user.emailAddress && this.validateEmail(user.emailAddress))}/>
												</div>
                        <InputText
                            size={"medium-long"}
                            name={"emailAddress"}
                            label={<L p={p} t={`Email address`}/>}
                            value={user.emailAddress || ''}
                            onChange={this.changeUser}
                            onEnterKey={this.handleEnterKey}
                            error={errorEmailAddress} />
                        <InputText
                            size={"medium-short"}
                            name={"phone"}
                            label={<L p={p} t={`Text message phone number`}/>}
                            value={user.phone || ''}
                            onChange={this.changeUser}
                            onEnterKey={this.handleEnterKey}
                            instructions={``} />
										</div>
								<hr />
                </div>
								{userPersonId &&
										<TextDisplay label={<L p={p} t={`eCademyApp username`}/>} text={user.username} hideIfEmpty={true} textClassName={styles.red}
												salta={accessRoles.admin ? () => login({username: user.username, clave: '*&^', salta: personId }, '', 'salta') : () => {}}/>
								}
								<div className={classes(styles.moreLeft, styles.headLabel)}><L p={p} t={`Grade level range:`}/></div>
								<div className={classes(styles.moreLeft, styles.row)}>
										<div>
												<SelectSingleDropDown
														id={'fromGradeLevelId'}
														label={<L p={p} t={`From`}/>}
														value={user.fromGradeLevelId || ''}
														onChange={this.changeUser}
														options={gradeLevels}
														height={'medium'}
														required={true}
														whenFilled={user.fromGradeLevelId}
														error={fromGradeLevelId}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={'toGradeLevelId'}
														label={<L p={p} t={`To`}/>}
														value={user.toGradeLevelId || ''}
														onChange={this.changeUser}
														options={gradeLevels}
														height={'medium'}
														required={true}
														whenFilled={user.toGradeLevelId}
														error={toGradeLevelId}/>
										</div>
								</div>
								<hr/>
								<div className={styles.moreLeft}>
										<InputText
												size={"short"}
												name={"externalId"}
												label={<L p={p} t={`External id (optional for other school systems)`}/>}
												value={user.externalId || ''}
												onEnterKey={this.handleEnterKey}
												onChange={this.changeUser}
												error={errorExternalId}/>
								</div>

                <div className={classes(styles.rowRight)}>
										<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
										{userPersonId &&
												<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={this.handleDeleteOpen} changeRed={true}/>
										}
										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
                </div>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`User Add`}/>} path={`userAdd/${userRole}`} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this user?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this user?`}/>} isConfirmType={true}
									 onClick={this.handleDelete} />
						}
						{isShowingModal_hasClass &&
								<MessageModal handleClose={this.handleHasClassClose} heading={<L p={p} t={`This user has at least one class`}/>}
									 explainJSX={<L p={p} t={`This user is assigned to the following classes.  Are you sure you want to delete this user?  The user will be set as inactive and won't be able to be chosen as a user in the future.<br/><br/>`}/> + user.hasClass.join('<br/>')}
									 isConfirmType={true}
									 onClick={this.handleHasClass} />
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
        </section>
    );
  }
}

export default withAlert(UserAddView);
