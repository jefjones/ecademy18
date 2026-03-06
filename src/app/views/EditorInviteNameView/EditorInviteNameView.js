import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './EditorInviteNameView.css';
const p = 'EditorInviteNameView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import InputText from '../../components/InputText';
import InvitesPending from '../../components/InvitesPending';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import ContactSummary from '../../components/ContactSummary';
import OneFJefFooter from '../../components/OneFJefFooter';

class EditorInviteNameView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			isSending: false,
      isUserComplete: false,
      errorEmailAddress: '',
      errorFirstName: '',
      inviteMessage: '',
      user: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        phone: '',
      },
      contactMatches: [],
    };
}

  componentDidMount() {
    const {editorInviteName} = this.props;
    //document.getElementById("firstName").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
    editorInviteName && editorInviteName.firstName
        && this.setState({
            user: {
                firstName: editorInviteName.firstName,
                lastName: editorInviteName.lastName,
                emailAddress: editorInviteName.emailAddress,
                phone: editorInviteName.phone,
            }
        })
  }

  handleMessageChange = (event) => {
      this.setState({inviteMessage: event.target.value});
  }

  findContactMatches = (emailAddress, phone) => {
      const {contacts} = this.props;
      if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
          this.setState({ contactMatches: contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)) });
      }
  }

  changeUser = (event) => {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    field === "firstName" && this.setState({errorFirstName: ''});
    (field === "emailAddress" || field === "phone") && this.setState({errorEmailAddress: ''});
    field === "emailAddress" && this.findContactMatches(event.target.value, '');
    field === "phone" && this.findContactMatches('', event.target.value);

    this.setState({
      user
    });

    this.showNextButton();
  }

  handleEnterKey = (event) => {
      event.key === "Enter" && this.processForm();
  }

  showNextButton = () => {
    const user = this.state.user;
    if (user.firstName && ((user.emailAddress && this.validateEmail(user.emailAddress)) || (user.phone && user.phone.length > 8))) {
        this.setState({isUserComplete: true});
    } else {
        this.setState({isUserComplete: false});
    }
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

  processForm = (event) => {
		const {personId, works, setNameAndEmail, sendEditorInvite} = this.props;
    const {user, inviteMessage} = this.state;

    event && event.preventDefault();
    let hasError = false;

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
    } else if (user.phone && !this.validatePhone(user.phone)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`The phone number should be ten digits long.`}/> });
    }

    if (!hasError) {
				if (works && works.length > 0) {
        		setNameAndEmail(user.firstName, user.lastName, user.emailAddress, this.stripPhoneFormatAndPrefix(user.phone), inviteMessage);
				} else {
						let editorInviteName = {
								emailAddress: user.emailAddress,
								phone: user.phone,
								firstName: user.firstName,
								lastName: user.lastName,
								//to_PersonId, //this is for the existing contact record when it is detected that they are not yet a Penspring user.
								inviteMessage,
						}

				    sendEditorInvite(personId, editorInviteName, []);
				    this.setState ({
				        isSending: true
				    });
				}
    }
  }

  render() {
    const {personId, editorInvitePending, deleteInvite, acceptInvite, resendInvite, setContactCurrentSelected, works} = this.props;
    const {contactMatches, isUserComplete, user, inviteMessage, errorFirstName, errorEmailAddress, isSending} = this.state;

    return (
        <section className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Invite New Editor`}/>
            </div>
            {editorInvitePending && editorInvitePending.length > 0 &&
                <InvitesPending invites={editorInvitePending} personId={personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                    resendInvite={resendInvite}/>
            }
            <hr />
            <div className={styles.formLeft}>
                <InputText
                    size={"medium"}
                    name={"firstName"}
                    label={<L p={p} t={`First name`}/>}
                    value={user.firstName}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    error={errorFirstName} />
                <InputText
                    size={"medium"}
                    name={"lastName"}
                    label={<L p={p} t={`Last name`}/>}
                    value={user.lastName}
                    onEnterKey={this.handleEnterKey}
                    onChange={this.changeUser}/>
                <hr />
                <InputText
                    size={"medium-long"}
                    name={"emailAddress"}
                    label={<L p={p} t={`Email address`}/>}
                    value={user.emailAddress}
                    onChange={this.changeUser}
                    onEnterKey={this.handleEnterKey}
                    error={errorEmailAddress} />
                <div className={styles.orPhone}><L p={p} t={`Or enter cell phone for text messaging:`}/></div>
                <div className={styles.row}>
                    <InputText
                        size={"medium-short"}
                        name={"phone"}
                        label={<L p={p} t={`Cell phone number`}/>}
                        value={user.phone}
                        onChange={this.changeUser}
                        onEnterKey={this.handleEnterKey}
                        instructions={<L p={p} t={`numbers only are acceptable`}/>} />
                </div>
                <hr />
            </div>
            <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => this.handleMessageChange(event)}
            placeholder={<L p={p} t={`Optional: add a message`}/>} className={styles.messageBox}></textarea>
            <div className={styles.leftMargin}>
								{!isSending &&
		                <button className={classes(styles.loginButton, (!works || works.length === 0 || isUserComplete ? styles.opacityFull : styles.opacityLow))} onClick={this.processForm}>
		                    {works && works.length > 0 ? <L p={p} t={`Next ->`}/> : <L p={p} t={`Send`}/>}
		                </button>
								}
								{isSending && <span className={styles.sendingLabel}><L p={p} t={`Sending...`}/></span>}
            </div>
            {contactMatches && contactMatches.length > 0 &&
                <div>
                    <div className={classes(styles.row, styles.matches)}><L p={p} t={`Found existing contacts:`}/><div>{contactMatches.length}</div></div><br/>
                    <Accordion allowMultiple={true}>
                        {contactMatches.map( (contactSummary, i) => {
                            return (
                                <AccordionItem contactSummary={contactSummary} expanded={false} key={i} className={styles.accordionTitle} onTitleClick={() => {}}
                                    showAssignWorkToEditor={false} onContactClick={setContactCurrentSelected} personId={personId}>
                                <ContactSummary key={i*100} summary={contactSummary} className={styles.contactSummary} showAccessIcon={true}
                                    userPersonId={contactSummary.personId} noShowTitle={true}/>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </div>
            }
            <OneFJefFooter />
        </section>
    );
  }
}

export default EditorInviteNameView;
