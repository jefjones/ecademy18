import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './GroupMemberAddView.css';
const p = 'GroupMemberAddView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import InputText from '../../components/InputText';
import TabPage from '../../components/TabPage';
import InvitesPending from '../../components/InvitesPending';
import GroupMembers from '../../components/GroupMembers';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import ContactSummary from '../../components/ContactSummary';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';

class GroupMemberAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserComplete: false,
      isBulkEntered: false,
      errorEmailAddress: '',
      errorFirstName: '',
      inviteMessage: '',
      members: [], //This is an array of objects whether it is fed by the single entry of the bulk paste.
      duplicateEntries: [],
      isShowingNoBulkEntryMessage: false,
      user: {
        firstName: '',
        lastName: '',
        memberId: '',
        emailAddress: '',
        phone: '',
      },
      bulk: {
          delimiter: 'comma',
          firstField: 'fullNameFirstFirst',
          secondField: 'emailAddress',
          thirdField: '',
          fourthField: '',
          fifthField: '',
          memberData: '', //This should always be text for the textarea.  Never an array of objects.
      },
      contactMatches: [],
    };

    this.processForm = this.processForm.bind(this);
    this.processBulk = this.processBulk.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.stripPhoneFormatAndPrefix = this.stripPhoneFormatAndPrefix.bind(this);
    this.showNextButton = this.showNextButton.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleBulkEntry = this.handleBulkEntry.bind(this);
    this.findContactMatches = this.findContactMatches.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.changeBulk = this.changeBulk.bind(this);
    this.returnToBulkEntry = this.returnToBulkEntry.bind(this);
    this.goToBulkVerification = this.goToBulkVerification.bind(this);
    this.stripOutDuplicates = this.stripOutDuplicates.bind(this);
    this.handleNoBulkEntryMessageOpen = this.handleNoBulkEntryMessageOpen.bind(this);
    this.handleNoBulkEntryMessageClose = this.handleNoBulkEntryMessageClose.bind(this);
  }

  componentDidMount() {
      this.setState({
          localTabsData: this.props.tabsData,
      });
  }


  returnToBulkEntry() {
      this.setState({ isBulkEntered: false });
  }

  goToBulkVerification() {
      const {bulk} = this.state;
      let newMembers = [];
      let lines = bulk && !!bulk.memberData && bulk.memberData.split('\n');
      let splitCharacter = bulk.delimiter === "comma" ? ',' : bulk.delimiter === "semicolon" ? ";" : bulk.delimiter === "hyphen" ? '-' : bulk.delimiter === "tab" ? '\t' : ',';

      if (!lines) {
          this.handleNoBulkEntryMessageOpen();
          return;
      }

      lines.forEach(line => {
          let checkBlank = line.replace(/<[^>]*>/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .trim();

          if (!!checkBlank) {
              let col = line.split(splitCharacter)
              let m = {};
              if (bulk.firstField) {
                  if (bulk.firstField === 'firstName') {
                  	  m.firstName = col[0].trim();
                  } else if (bulk.firstField === 'lastName') {
                  	  m.lastName = col[0].trim();
                  } else if (bulk.firstField === 'fullNameLastFirst') {
                      if (col[0].indexOf(",") > -1) {
                          let name = col[0].split(",");
                          m.lastName = name[0].trim();
                          m.firstName = name[1].trim();
                      } else {
                          m.lastName = col[0].substring(col[0].indexOf(" "));
                          m.firstName = col[0].substring(col[0].lastIndexOf(" "));
                      }
                  } else if (bulk.firstField === 'fullNameFirstFirst') {
                      let name = col[0].split(" ");
                      m.firstName = name[0].trim();
                      m.lastName = name[name.length-1].trim();
                  } else if (bulk.firstField === 'memberId') {
                  	  m.memberId = col[0].trim();
                  } else if (bulk.firstField === 'emailAddress') {
                  	  m.emailAddress = col[0].trim();
                  } else if (bulk.firstField === 'phone') {
                  	  m.phone = col[0].trim();
                  }
              }
              if (bulk.secondField) {
                if (bulk.secondField === 'firstName') {
                  	m.secondName = col[1].trim();
                } else if (bulk.secondField === 'lastName') {
                  	m.lastName = col[1].trim();
                } else if (bulk.secondField === 'fullNameLastFirst') {
                    if (col[0].indexOf(",") > -1) {
                        let name = col[0].split(",");
                        m.lastName = name[0].trim();
                        m.firstName = name[1].trim();
                    } else {
                        m.lastName = col[0].substring(col[0].indexOf(" ")).trim();
                        m.firstName = col[0].substring(col[0].lastIndexOf(" ")).trim();
                    }
                } else if (bulk.secondField === 'fullNameFirstFirst') {
                    let name = col[0].split(" ");
                    m.firstName = name[0].trim();
                    m.lastName = name[name.length-1].trim();
                } else if (bulk.secondField === 'memberId') {
                  	m.memberId = col[1].trim();
                } else if (bulk.secondField === 'emailAddress') {
                  	m.emailAddress = col[1].trim();
                } else if (bulk.secondField === 'phone') {
                  	m.phone = col[1].trim();
                  }
              }
              if (bulk.thirdField) {
                if (bulk.thirdField === 'firstName') {
                  	m.thirdName = col[2].trim();
                } else if (bulk.thirdField === 'lastName') {
                  	m.lastName = col[2].trim();
                } else if (bulk.thirdField === 'fullNameLastFirst') {
                    if (col[0].indexOf(",") > -1) {
                        let name = col[0].split(",");
                        m.lastName = name[0].trim();
                        m.firstName = name[1].trim();
                    } else {
                        m.lastName = col[0].substring(col[0].indexOf(" ")).trim();
                        m.firstName = col[0].substring(col[0].lastIndexOf(" ")).trim();
                    }
                } else if (bulk.thirdField === 'fullNameFirstFirst') {
                    let name = col[0].split(" ");
                    m.firstName = name[0].trim();
                    m.lastName = name[name.length-1];
                } else if (bulk.thirdField === 'memberId') {
                  	m.memberId = col[2].trim();
                } else if (bulk.thirdField === 'emailAddress') {
                  	m.emailAddress = col[2].trim();
                } else if (bulk.thirdField === 'phone') {
                  	m.phone = col[2].trim();
                  }
              }
              if (bulk.fourthField) {
                if (bulk.fourthField === 'firstName') {
                  	m.fourthName = col[3].trim();
                } else if (bulk.fourthField === 'lastName') {
                  	m.lastName = col[3].trim();
                } else if (bulk.fourthField === 'fullNameLastFirst') {
                    if (col[0].indexOf(",") > -1) {
                        let name = col[0].split(",");
                        m.lastName = name[0].trim();
                        m.firstName = name[1].trim();
                    } else {
                        m.lastName = col[0].substring(col[0].indexOf(" "));
                        m.firstName = col[0].substring(col[0].lastIndexOf(" "));
                    }
                } else if (bulk.fourthField === 'fullNameFirstFirst') {
                    let name = col[0].split(" ");
                    m.firstName = name[0].trim();
                    m.lastName = name[name.length-1].trim();
                } else if (bulk.fourthField === 'memberId') {
                  	m.memberId = col[3].trim();
                } else if (bulk.fourthField === 'emailAddress') {
                  	m.emailAddress = col[3].trim();
                } else if (bulk.fourthField === 'phone') {
                  	m.phone = col[3].trim();
                  }
              }
              if (bulk.fifthField) {
                if (bulk.fifthField === 'firstName') {
                  	m.fifthName = col[4].trim();
                } else if (bulk.fifthField === 'lastName') {
                  	m.lastName = col[4].trim();
                } else if (bulk.fifthField === 'fullNameLastFirst') {
                    if (col[0].indexOf(",") > -1) {
                        let name = col[0].split(",");
                        m.lastName = name[0].trim();
                        m.firstName = name[1].trim();
                    } else {
                        m.lastName = col[0].substring(col[0].indexOf(" "));
                        m.firstName = col[0].substring(col[0].lastIndexOf(" "));
                    }
                } else if (bulk.fifthField === 'fullNameFirstFirst') {
                    let name = col[0].split(" ");
                    m.firstName = name[0].trim();
                    m.lastName = name[name.length-1].trim();
                } else if (bulk.fifthField === 'memberId') {
                  	m.memberId = col[4].trim();
                } else if (bulk.fifthField === 'emailAddress') {
                  	m.emailAddress = col[4].trim();
                } else if (bulk.fifthField === 'phone') {
                  	m.phone = col[4].trim();
                  }
              }
              newMembers = newMembers ? newMembers.concat(m) : [m];
          }
      });

      newMembers = this.stripOutDuplicates(newMembers);
      newMembers = newMembers.reduce((acc, m) => {
          if(!!m.firstName || !!m.lastName || !!m.emailAddress || !!m.phone) {
              acc = acc ? acc.concat(m) : [m];
          }
          return acc;
        }, []);
      this.setState({ isBulkEntered: true, members: newMembers });
  }

  stripOutDuplicates(newMembers) {
      const {editorInvitePending, group} = this.props;
      let duplicateEntries = [];
      let minusMembers = Object.assign([], newMembers);

      !!newMembers && newMembers.forEach((m, index) => {
          !!editorInvitePending && editorInvitePending.forEach(p => {
              if (m.firstName === p.firstName
                      || m.lastName === p.lastName
                      || m.emailAddress === p.emailAddress
                      || m.phone === p.phone) {
                  duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m];
                  delete minusMembers[index];
               }
            });
            group && !!group.members && group.members.forEach(p => {
                if (m.firstName === p.firstName
                            || m.lastName === p.lastName
                            || m.emailAddress === p.emailAddress
                            || m.phone === p.phone) {
                    duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m];
                    delete minusMembers[index];
                }
            });
      });

      this.setState({ duplicateEntries });
      return minusMembers;
  }

  handleFormChange(chosenTab) {
      this.setState({ localTabsData: { ...this.state.localTabsData, chosenTab }});
  }

  handleBulkEntry(event) {
      this.setState({bulk : { ...this.state.bulk, memberData: event.target.value} });
  }

  handleMessageChange(event) {
      this.setState({inviteMessage: event.target.value});
  }

  findContactMatches(emailAddress, phone) {
      const {contacts} = this.props;
      if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
          this.setState({ contactMatches: contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)) });
      }
  }

  changeUser(event) {
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

  changeBulk(event) {
    const field = event.target.name;
    const bulk = this.state.bulk;
    bulk[field] = event.target.value;
    this.setState({ bulk });
  }

  handleEnterKey(event) {
      event.key === "Enter" && this.processForm("STAY");
  }

  showNextButton() {
    const user = this.state.user;
    if (user.firstName && ((user.emailAddress && this.validateEmail(user.emailAddress)) || (user.phone && user.phone.length > 8))) {
        this.setState({isUserComplete: true});
    } else {
        this.setState({isUserComplete: false});
    }
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

  processBulk() {
      const {setGroupMembers, personId, group} = this.props;
      const {members} = this.state;
      setGroupMembers(personId, group.groupId, members);
      browserHistory.push(`/assignmentDashboard`)
  }

  processForm(stayOrFinish, event) {
    const {setGroupMembers, personId, group} = this.props;
    const {user} = this.state;
    // prevent default action. in this case, action is the form submission event
    event && event.preventDefault();
    let hasError = false;

    //It is possible that this is the "Finish" version of the processForm and the user might not be filled in.
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
        setGroupMembers(personId, group.groupId, [user]);
        this.setState({
            user: {
              firstName: '',
              lastName: '',
              memberId: '',
              emailAddress: '',
              phone: '',
            },
        });
        if (stayOrFinish === "FINISH") {
            browserHistory.push(`/assignmentDashboard`)
        }
        //document.getElementById('firstName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
    }
  }

  handleNoBulkEntryMessageOpen = () => this.setState({isShowingNoBulkEntryMessage: true})
  handleNoBulkEntryMessageClose = () => this.setState({isShowingNoBulkEntryMessage: false})

  render() {
    const {editorInvitePending, personId, deleteInvite, acceptInvite, resendInvite, setContactCurrentSelected, group, removeMember,
            bulkDelimiterOptions, fieldOptions} = this.props;
    const {contactMatches, isBulkEntered, user, bulk, inviteMessage, errorFirstName, errorEmailAddress, localTabsData, members,
            isUserComplete, duplicateEntries, isShowingNoBulkEntryMessage} = this.state;

    return (
        <section className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Group Members`}/>
            </div>
            <div className={styles.row}>
                <span className={styles.subTitle}>{group && group.groupName}</span>
            </div>
            {editorInvitePending && editorInvitePending.length > 0 &&
                <InvitesPending invites={editorInvitePending} personId={personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                    resendInvite={resendInvite} excludeReverseInvites={true}/>
            }
            {group && group.members && group.members.length > 0 &&
                <GroupMembers members={group.members} personId={personId} groupId={group.groupId} removeMember={removeMember} />
            }
            <hr />
            <TabPage tabsData={localTabsData} onClick={this.handleFormChange} />
            {localTabsData && localTabsData.chosenTab === 'FieldEntry' &&
                <div>
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
                        <InputText
                            size={"medium"}
                            name={"memberId"}
                            label={<L p={p} t={`Internal id (optional)`}/>}
                            value={user.memberId}
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
                        <InputText
                            size={"medium-short"}
                            name={"phone"}
                            label={<L p={p} t={`Text message phone number`}/>}
                            value={user.phone}
                            onChange={this.changeUser}
                            onEnterKey={this.handleEnterKey}
                            instructions={<L p={p} t={`numbers only are acceptable`}/>} />
                        <hr />
                    </div>
                    <span className={styles.label}><L p={p} t={`Add a message (optional)`}/></span>
                    <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => this.handleMessageChange(event)}
                        className={styles.messageBox}></textarea>
                    <div className={classes(styles.rowRight)}>
                        <ButtonWithIcon label={<L p={p} t={`Save & Stay`}/>} icon={'checkmark_circle'} className={classes(styles.button, (isUserComplete ? styles.opacityFull : styles.opacityLow))} onClick={(event) => this.processForm("STAY", event)}/>
                        <ButtonWithIcon label={<L p={p} t={`Save & Finish`}/>} icon={'checkmark_circle'} className={classes(styles.button, (isUserComplete ? styles.opacityFull : styles.opacityLow))} onClick={(event) => this.processForm("FINISH", event)}/>
                    </div>
                </div>
            }
            {localTabsData && localTabsData.chosenTab === 'BulkPaste' &&
                <div className={styles.formLeft}>
                    <div className={classes(styles.rowRight)}>
                        <button className={classes(styles.button, (isBulkEntered ? styles.opacityFull : styles.opacityLow))} onClick={this.returnToBulkEntry}>
                            <L p={p} t={`<- Prev`}/>
                        </button>
                        <button className={classes(styles.button, (!!bulk.memberData ? styles.opacityFull : styles.opacityLow))}
                                onClick={isBulkEntered ? this.processBulk : this.goToBulkVerification}>
                            {isBulkEntered ? <L p={p} t={`Finish`}/> : <L p={p} t={`Next ->`}/>}
                        </button>
                    </div>
                    {!isBulkEntered &&
                        <div>
                            <SelectSingleDropDown
                                id={`delimiter`}
                                label={<L p={p} t={`How are the fields separated?`}/>}
                                value={bulk.delimiter}
                                options={bulkDelimiterOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`firstField`}
                                label={<L p={p} t={`First field`}/>}
                                value={bulk.firstField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`secondField`}
                                label={<L p={p} t={`Second field`}/>}
                                value={bulk.secondField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`thirdField`}
                                label={<L p={p} t={`Third field`}/>}
                                value={bulk.thirdField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`fourthField`}
                                label={<L p={p} t={`Fourth field`}/>}
                                value={bulk.fourthField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`fifthField`}
                                label={<L p={p} t={`Fifth field`}/>}
                                value={bulk.fifthField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <span className={styles.labelBulk}><L p={p} t={`Paste in member data in bulk (one member per line)`}/></span>
                            <textarea rows={25} cols={100} value={bulk.memberData} onChange={(event) => this.handleBulkEntry(event)}
                                className={styles.bulkBox}></textarea>
                        </div>
                    }
                    {isBulkEntered &&
                        <div>
                            {duplicateEntries &&
                                <div className={styles.column}>
                                    <div className={styles.warningText}><L p={p} t={`You have ${duplicateEntries.length} duplicate entries`}/></div>
                                    {!duplicateEntries.length ? '' :
                                        <table className={styles.tableStyle}>
                                            <thead>
                                                <tr>
                                                    <td className={styles.hdr}><L p={p} t={`First`}/></td>
                                                    <td className={styles.hdr}><L p={p} t={`Last`}/></td>
                                                    <td className={styles.hdr}><L p={p} t={`Member id`}/></td>
                                                    <td className={styles.hdr}><L p={p} t={`Email address`}/></td>
                                                    <td className={styles.hdr}><L p={p} t={`Phone`}/></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {duplicateEntries && duplicateEntries.length > 0 && duplicateEntries.map((m, i) =>
                                                <tr key={i}>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.firstName}</span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.lastName}</span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.memberId}</span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.emailAddress}</span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.phone}</span>
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            }
                            <div className={styles.headerText}><L p={p} t={`${members.length} entries will be assigned to this group`}/></div>
                            <table className={styles.tableStyle}>
                                <thead>
                                    <tr>
                                        <td className={styles.hdr}><L p={p} t={`First`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Last`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Member id`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Email address`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Phone`}/></td>
                                    </tr>
                                </thead>
                                <tbody>
                                {members && members.length > 0 && members.map((m, i) =>
                                    <tr key={i}>
                                        <td>
                                            <span className={styles.txt}>{m.firstName}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.lastName}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.memberId}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.emailAddress}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.phone}</span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            }
            {contactMatches && contactMatches.length > 0 &&
                <div>
                    <span className={styles.matches}>Found existing contacts: {contactMatches.length}</span><br/>
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
            {isShowingNoBulkEntryMessage &&
                <MessageModal handleClose={this.handleNoBulkEntryMessageClose} heading={<L p={p} t={`No entries found`}/>}
                   explainJSX={<L p={p} t={`It doesn't appear that there are any group members entered in the bulk entry box below.`}/>} isConfirmType={false}
                   onClick={this.handleNoBulkEntryMessageClose} />
            }
        </section>
    );
  }
}

export default GroupMemberAddView;
