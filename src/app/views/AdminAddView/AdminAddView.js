import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './AdminAddView.css';
import classes from 'classnames';
import InputText from '../../components/InputText';
//import TabPage from '../../components/TabPage';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import Required from '../../components/Required';
import { withAlert } from 'react-alert';
import OneFJefFooter from '../../components/OneFJefFooter';
const p = 'AdminAddView';
import L from '../../components/PageLanguage';

class AdminAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminPersonId: props.adminPersonId,  //This is only used when modifying an existing record. but only one at a time and the bulk entry will be hidden.
      isUserComplete: false,
      isBulkEntered: false,
      errorEmailAddress: '',
      errorExternalId: '',
      errorFirstName: '',
      inviteMessage: '',
      admins: [], //This is an array of objects whether it is fed by the single entry or the bulk paste.
      duplicateEntries: [],
      isShowingNoBulkEntryMessage: false,
			isShowingModal_delete: false,
			isShowingModal_hasClass: false,
			isShowingModal_missingInfo: false,
      user: {
        firstName: '',
        lastName: '',
        externalId: '',
        emailAddress: '',
        phone: '',
      },
      bulk: {
          delimiter: 'comma',
          firstField: 'fullNameFirstFirst',
          secondField: 'emailAddress',
          thirdField: 'externalId',
          fourthField: '',
          fifthField: '',
          memberData: '', //This should always be text for the textarea.  Never an array of objects.
      },
      contactMatches: [],
    };
  }

  componentDidMount() {
      this.setState({
          localTabsData: this.props.tabsData,
          adminPersonId: this.props.params && this.props.params.adminPersonId,
      });
  }

	componentDidUpdate() {
			const {admin} = this.props;
			if (admin !== this.state.origAdmin) {
					this.setState({ user: admin, origAdmin: admin });
			}
			if (this.state.adminPersonId !== this.props.adminPersonId) {
					this.setState({ adminPersonId: this.props.adminPersonId });
			}
	}

  returnToBulkEntry = () => {
      this.setState({ isBulkEntered: false });
  }

  goToBulkVerification = () => {
      const {bulk} = this.state;
      let newAdmins = [];
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
                  } else if (bulk.firstField === 'externalId') {
                  	  m.externalId = col[0].trim();
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
                } else if (bulk.secondField === 'externalId') {
                  	m.externalId = col[1].trim();
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
                } else if (bulk.thirdField === 'externalId') {
                  	m.externalId = col[2].trim();
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
                } else if (bulk.fourthField === 'externalId') {
                  	m.externalId = col[3].trim();
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
                } else if (bulk.fifthField === 'externalId') {
                  	m.externalId = col[4].trim();
                } else if (bulk.fifthField === 'emailAddress') {
                  	m.emailAddress = col[4].trim();
                } else if (bulk.fifthField === 'phone') {
                  	m.phone = col[4].trim();
                  }
              }
              newAdmins = newAdmins ? newAdmins.concat(m) : [m];
          }
      });

      newAdmins = this.stripOutDuplicates(newAdmins);
      newAdmins = newAdmins.reduce((acc, m) => {
          if(!!m.firstName || !!m.lastName || !!m.emailAddress || !!m.phone) {
              acc = acc ? acc.concat(m) : [m];
          }
          return acc;
        }, []);
      this.setState({ isBulkEntered: true, admins: newAdmins });
  }

  stripOutDuplicates = (newAdmins) => {
      const {existingAdmins, editorInvitePending} = this.props;
      let duplicateEntries = [];
      let minusMembers = Object.assign([], newAdmins);

      !!newAdmins && newAdmins.forEach((m, index) => {
          !!editorInvitePending && editorInvitePending.forEach(p => {
              if (m.firstName === p.firstName
                      || m.lastName === p.lastName
                      || m.emailAddress === p.emailAddress
                      || m.phone === p.phone) {
                  duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m];
                  delete minusMembers[index];
               }
            });
            !!existingAdmins && existingAdmins.forEach(p => {
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

  handleFormChange = (chosenTab) => {
      this.setState({ localTabsData: { ...this.state.localTabsData, chosenTab }});
  }

  handleBulkEntry = (event) => {
      this.setState({bulk : { ...this.state.bulk, memberData: event.target.value} });
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
    let user = this.state.user;
    user[field] = event.target.value;
    field === "firstName" && this.setState({errorFirstName: ''});
    (field === "emailAddress" || field === "phone") && this.setState({errorEmailAddress: ''});
    field === "emailAddress" && this.findContactMatches(event.target.value, '');
    field === "phone" && this.findContactMatches('', event.target.value);
    if (field === "emailAddress") user[field] = user[field].replace(/ /g, "");

    this.setState({ user });
    this.showNextButton();
  }

  changeBulk = (event) => {
    const field = event.target.name;
    let bulk = this.state.bulk;
    bulk[field] = event.target.value;
    this.setState({ bulk });
  }

  handleEnterKey = (event) => {
      event.key === "Enter" && this.processForm("STAY");
  }

  showNextButton = () => {
    let user = this.state.user;
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

  processBulk = () => {
      const {addAdmin, personId} = this.props;
      const {admins} = this.state;
      addAdmin(personId, admins);
      browserHistory.push(`/firstNav`)
  }

  processForm = (stayOrFinish, event) => {
    const {addAdmin, updateAdmin, personId, params, loginData} = this.props;
    const {user} = this.state;
    // prevent default action. in this case, action is the form submission event
    event && event.preventDefault();
    let hasError = false;
		let missingInfoMessage = [];

    //It is possible that this is the "Finish" version of the processForm and the user might not be filled in.
    if (!user.firstName) {
        hasError = true;
        this.setState({errorFirstName: <L p={p} t={`First name required.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Question type`}/></div>
    }

    if (!user.emailAddress) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`An email address or cell phone for texting is required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address or cell phone`}/></div>
    } else if (user.emailAddress && !this.validateEmail(user.emailAddress)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`Email address appears to be invalid`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Invalid email address`}/></div>
    } else if (user.phone && !this.validatePhone(user.phone) ) {
        hasError = true;
        this.setState({errorPhone: <L p={p} t={`The phone number should be ten digits long`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Ten digit phone number`}/></div>
    }

		if (!user.fromGradeLevelId) {
        hasError = true;
        this.setState({errorFromGradeLevelId: <L p={p} t={`Required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
    }

		if (!user.toGradeLevelId) {
        hasError = true;
        this.setState({errorToGradeLevelId: <L p={p} t={`Required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
    }

		if (loginData.isDuplicateUsername) {
				hasError = true;
		}

    if (!hasError) {
        params && params.adminPersonId ? updateAdmin(personId, user) : addAdmin(personId, [user]);
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The new administrator has been added.`}/></div>)
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
        });
        params && params.adminPersonId && browserHistory.push(`/schoolSettings`);
		} else {
				this.handleMissingInfoOpen(missingInfoMessage);
    }
  }

  handleNoBulkEntryMessageOpen = () => this.setState({isShowingNoBulkEntryMessage: true})
  handleNoBulkEntryMessageClose = () => this.setState({isShowingNoBulkEntryMessage: false})

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
			const {removeAdmin, personId, adminPersonId} = this.props;
			removeAdmin(personId, adminPersonId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

	handleHasClassOpen = () => this.setState({ isShowingModal_hasClass: true });
	handleHasClassClose = () => this.setState({ isShowingModal_hasClass: false });
	handleHasClass = () => {
			const {removeAdmin, personId} = this.props;
			const {user} = this.state;
			removeAdmin(personId, user.personId);
			this.handleHasClassClose();
			browserHistory.push('/firstNav');
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

  render() {
    const {personId, bulkDelimiterOptions, login, accessRoles, fieldOptions, loginData, adminPersonId, gradeLevels} = this.props;
    const {isBulkEntered, user, bulk, errorFirstName, errorEmailAddress, localTabsData, admins, isShowingModal_hasClass,
            duplicateEntries, isShowingNoBulkEntryMessage, errorExternalId, isShowingModal_delete,
						messageInfoIncomplete, isShowingModal_missingInfo, errorFromGradeLevelId, errorToGradeLevelId} = this.state;

    return (
        <section className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <span className={globalStyles.pageTitle}><L p={p} t={`Add an Administrator`}/></span>
            </div>
            <hr />
            {/*!adminPersonId && <TabPage tabsData={localTabsData} onClick={this.handleFormChange} />*/}
            {localTabsData && localTabsData.chosenTab === 'FieldEntry' &&
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
                            onChange={this.changeUser}/>
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
																<L p={p} t={`Email address and/or cell number for text messages`}/>
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
										{adminPersonId &&
												<TextDisplay label={<L p={p} t={`eCademyApp username`}/>} text={user.username} hideIfEmpty={true} textClassName={styles.red}
														salta={accessRoles.admin ? () => login({username: user.username, clave: '*&^', salta: personId }, '', 'salta') : () => {}}/>
										}
                    {/*<span className={styles.label}>{`Add a message (optional)`}</span><br />
                    <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => this.handleMessageChange(event)
                        className={styles.messageBox}></textarea>*/}
										<div className={classes(styles.moreLeft, styles.headLabel)}>Grade level range:</div>
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
																error={errorFromGradeLevelId}/>
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
																error={errorToGradeLevelId}/>
												</div>
										</div>
										<hr/>
										<div className={styles.moreLeft}>
												<InputText
														size={"short"}
														name={"externalId"}
														label={<L p={p} t={`Admin id (optional for other school systems)`}/>}
														value={user.externalId || ''}
														onEnterKey={this.handleEnterKey}
														onChange={this.changeUser}
														error={errorExternalId}/>
										</div>

                    <div className={classes(styles.rowRight)}>
												<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
												{adminPersonId &&
														<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={this.handleDeleteOpen} changeRed={true}/>
												}
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
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
                            <SelectSingleDropDown
                                id={`sixthField`}
                                label={<L p={p} t={`Sixth field`}/>}
                                value={bulk.sixthField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`seventhField`}
                                label={<L p={p} t={`Seventh field`}/>}
                                value={bulk.seventhField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <span className={styles.labelBulk}><L p={p} t={`Paste in data in bulk (one record per line)`}/></span>
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
                                                    <td className={styles.hdr}><L p={p} t={`Admin Id`}/></td>
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
                                                        <span className={styles.txtRed}>{m.externalId}</span>
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
                            <div className={styles.headerText}><L p={p} t={`${admins.length} records will be added`}/></div>
                            <table className={styles.tableStyle}>
                                <thead>
                                    <tr>
                                        <td className={styles.hdr}><L p={p} t={`First`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Last`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Admin Id`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Email address`}/></td>
                                        <td className={styles.hdr}><L p={p} t={`Phone`}/></td>
                                    </tr>
                                </thead>
                                <tbody>
                                {admins && admins.length > 0 && admins.map((m, i) =>
                                    <tr key={i}>
                                        <td>
                                            <span className={styles.txt}>{m.firstName}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.lastName}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.externalId}</span>
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
            {/*contactMatches && contactMatches.length > 0 &&
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
            */}
            <OneFJefFooter />
            {isShowingNoBulkEntryMessage &&
                <MessageModal handleClose={this.handleNoBulkEntryMessageClose} heading={<L p={p} t={`No entries found`}/>}
                   explainJSX={<L p={p} t={`It doesn't appear that there are any records entered in the bulk entry box below.`}/>} isConfirmType={false}
                   onClick={this.handleNoBulkEntryMessageClose} />
            }
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this administrator?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this administrator?`}/>} isConfirmType={true}
									 onClick={this.handleDelete} />
						}
						{isShowingModal_hasClass &&
								<MessageModal handleClose={this.handleHasClassClose} heading={<L p={p} t={`This administrator has at least one class`}/>}
									 explainJSX={<div><L p={p} t={`This administrator is assigned to the following classes.  Are you sure you want to delete this administrator?  The administrator will be set as inactive and won't be able to be chosen as a administrator in the future.`}/><br/><br/>{user.hasClass.join('<br/>')}</div>}
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

export default withAlert(AdminAddView);
