import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import InputFile from '../../components/InputFile';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
import styles from './MyProfileView.css';
const p = 'MyProfileView';
import L from '../../components/PageLanguage';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import classes from 'classnames';
import Checkbox from '../../components/Checkbox';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
import {formatPhoneNumber} from '../../utils/numberFormat.js';
import { withAlert } from 'react-alert';
import ButtonWithIcon from "../../components/ButtonWithIcon";

class MyProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserComplete: false,
      errorFirstName: '',
      errorEmailAddress: '',
      errorEitherEmailOrCell: '',
      errorNativeLanguage: '',
      contactMatches: [],
			hasOriginalUpdate: false
    };
	}

	componentDidUpdate() {
			const {user} = this.props;
			if (!this.state.isInit && user && user.username) {
					this.setState({ isInit: true, localUsername: user.username });
			}
	}

  returnNav = () => {
      browserHistory.goBack()
  }

  handleMessageChange = (event) => {
      this.setState({inviteMessage: event.target.value});
  }

  changeUser = (event) => {
			const {personId, setMyProfile} = this.props;
			let field = event.target.name;
			let value = event.target.value;
			if (field === "emailAddress") value = value.replace(/ /g, '');
			setMyProfile(personId, field, value);
	    field === "firstName" && this.setState({errorFirstName: ''});
			field === "lastName" && this.setState({errorLastName: ''});
			field === "username" && this.setState({errorUsername: ''});
			field === "emailAddress" && this.setState({errorEmailAddress: ''});
	    field === "phone" && this.setState({errorPhone: ''});
  }

	changeUsername = (event) => {
			this.setState({ localUsername: event.target.value });
	}

	toggleCheckbox = (field) => {
			const {personId, setMyProfile, user} = this.props;
			let stringValue = user[field] ? 'false' : 'true'; //Notice that this is opposite because we are toggling the value into the string version for the database function.
			setMyProfile(personId, field, stringValue);
  }

  handleSelectedLanguages = (translateLanguageIds) => {
      this.setState({user: { ...this.state.user, translateLanguageIds}});
  }

  handleSelectedGenres = (genreIds) => {
      this.setState({user: { ...this.state.user, genreIds}});
  }

  handleEnterKey = (event) => {
      event.key === "Enter" && this.processForm();
  }

  handleUsernameCheck = () => {
        const {personId, setMyProfile} = this.props;
        const {localUsername} = this.state;
				let errorUsername = '';
        let errors = {};
        let isVerify = false;
        let usernameExists = true;
        let hasError = false;

        if (!localUsername) {
            hasError = true;
            errors.username = <L p={p} t={`The username is required`}/>;
        }

        if (!hasError) {
            axios.get(`${apiHost}ebi/username/verify/${personId}/${localUsername}`,
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
                if (response.data === 'FOUND') {
                    errorUsername = <L p={p} t={`Username already exists`}/>;
                    usernameExists = true;
                } else {
                    errorUsername = '';
                    usernameExists = false;
										setMyProfile(personId, "username", localUsername);
                }
                isVerify = true;
                this.setState({errors, isVerify, usernameExists, errorUsername});

            })
        }
        this.setState({errors});
    }

  validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    return re.test(email);
  }

  processForm = (event) => {
		const {getMyProfile, user} = this.props;
    const {usernameExists, localUsername} = this.state;
    // prevent default action. in this case, action is the form submission event
		event && event.preventDefault();
		let data = new FormData();
		data.append('file', this.state.selectedFile)
    let hasError = false;
    
    if (!user.firstName) {
      hasError = true;
      this.setState({errorFirstName: "First name is required." });
    }

    if (!user.lastName) {
      hasError = true;
      this.setState({errorLastName: <L p={p} t={`Last name is required.`}/> });
    }

		if (!localUsername) {
      hasError = true;
      this.setState({errorUsername: <L p={p} t={`A username is required.`}/> });
    }

		if (usernameExists) {
      hasError = true;
      this.setState({errorUsername: <L p={p} t={`Username already exists.`}/> });
    }
		
		if (user.phone && ('' + user.phone).replace(/\D/g, '').length !== 10) {
				hasError = true;
				this.setState({errorPhone: <L p={p} t={`The phone number entered is not 10 digits`}/> });
		}

    if (user.emailAddress && !this.validateEmail(user.emailAddress)) {
        hasError = true;
        this.setState({errorEmailAddress: <L p={p} t={`Email address appears to be invalid.`}/> });
    }

    // if (!user.nativeLanguageId) {
    //   hasError = true;
    //   this.setState({errorNativeLanguage: "Native language required." });
    // }

    if (!hasError) {
        data.append('firstName', user.firstName);
        data.append('lastName', user.lastName);
        data.append('preferredName', user.preferredName);
        data.append('languageId', user.nativeLanguageId);
        data.append('bestContactEmail', user.bestContactEmail);
        data.append('bestContactPhoneText', user.bestContactPhoneText);
        data.append('experienceExplanation', user.experienceExplanation);
        data.append('userName', localUsername);
        data.append('phone', user.phone ? user.phone : 'EMPTY');
        data.append('emailAddress', user.emailAddress);
      
				axios.post(`${apiHost}ebi/myProfile/${user.personId}`, data,
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
						.then(() => {
              this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your profile has been updated`}/></div>);
						  getMyProfile(user.personId);
            });
						//updateMyProfile(user);

        browserHistory.goBack();
    }
  }

  languageValueRenderer = (selected, options) => {
    if (!selected || selected.length === 0) {
        return <L p={p} t={`Select languages you can translate`}/>;
    }

    if (selected.length === options.length) {
        return <L p={p} t={`All languages are selected`}/>;
    }

    if (selected.length < 4) {
        let comma = "";
        let languageNames = "";
        selected && selected.length > 0 && selected.forEach(value => {
            languageNames += comma + options.filter(o => o.value === value)[0].label;
            comma = ", ";
        });
        languageNames = languageNames === 'en' ? 'English' : languageNames;
        return <L p={p} t={`I can translate:  ${languageNames}`}/>;
    } else {
        return <L p={p} t={`Languages to translate:  ${selected.length} of ${options.length}`}/>;
    }
  }

  genreValueRenderer = (selected, options) => {
      if (selected.length === 0) {
          return <L p={p} t={`Select preferred genres...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All genres are selected`}/>;
      }

      if (selected.length < 4) {
          let comma = "";
          let genreNames = "";
          selected && selected.length > 0 && selected.forEach(value => {
              genreNames += comma + options.filter(o => o.value === value)[0].label;
              comma = ", ";
          });
          genreNames = genreNames === 'en' ? 'English' : genreNames;
          if (selected.length === 1) {
              return <L p={p} t={`Genre:  ${genreNames}`}/>;
          } else {
              return <L p={p} t={`Genres:  ${genreNames}`}/>;
          }
      } else {
          return <L p={p} t={`Genres:  ${selected.length} of ${options.length}`}/>;
      }
  }

	handleInputFile = (file) => this.setState({ selectedFile: file });

	handleFormatPhone = () => {
			const {user, setMyProfile, personId} = this.props;
			if (user && user.phone && ('' + user.phone).replace(/\D/g, '').length !== 10) {
					this.setState({errorPhone: <L p={p} t={`The phone number entered is not 10 digits`}/> });
			} else if (user && formatPhoneNumber(user.phone)) {
          let phone = formatPhoneNumber(user.phone);
					setMyProfile(personId, 'phone', phone);
					this.setState({ errorPhone: '' })
			}
	}

  render() {
      const {personId, languageOptions, user={}} = this.props;
      const {errorFirstName, errorLastName, errorUsername, errorEmailAddress, errorNativeLanguage, usernameExists, isVerify, localUsername,
							errorPhone} = this.state;

    return (
      <section className={styles.container}>
          <div className={globalStyles.pageTitle}>
              <L p={p} t={`My Profile`}/>
          </div>
          <hr />
          <div>
              <div className={styles.centered}>
                  <div className={styles.nameFull}>
                    <InputText
                      size={"medium-left"}
                      name={"firstName"}
                      label={<L p={p} t={`First name`}/>}
                      value={user.firstName || ''}
                      onChange={this.changeUser}
                      onEnterKey={this.handleEnterKey}
											required={true}
											whenFilled={user.firstName}
                      inputClassName={styles.inputNoBold}
                      error={errorFirstName} />

                    <InputText
                      size={"medium-right"}
                      name={"lastName"}
                      label={<L p={p} t={`Last name`}/>}
                      value={user.lastName || ''}
                      onEnterKey={this.handleEnterKey}
                      inputClassName={styles.inputNoBold}
											required={true}
											whenFilled={user.lastName}
                      onChange={this.changeUser}
                      error={errorLastName}  />
                  </div>
                  <div className={styles.nameFull}>
                    <InputText
                      size={"medium-left"}
                      name={"preferredName"}
                      label={<L p={p} t={`Preferred name`}/>}
                      value={user.preferredName || ''}
                      onChange={this.changeUser}
                      onEnterKey={this.handleEnterKey}
                      inputClassName={styles.inputNoBold}/>
                  </div>
                <div className={styles.row}>
                    <InputText
                        size={"medium-long"}
                        name={"username"}
                        value={localUsername || ''}
                        onChange={this.changeUsername}
                        label={<L p={p} t={`Username`}/>}
                        onBlur={this.handleUsernameCheck}
												required={true}
												whenFilled={localUsername}
												error={errorUsername} />

                    <div onClick={this.handleUsernameCheck} className={classes(globalStyles.link, styles.row, styles.muchTop)}>
                        <Icon pathName={isVerify ? usernameExists ? 'cross_circle' : 'checkmark0' : 'checkmark0'}
                            className={styles.icon} premium={true} fillColor={isVerify ? usernameExists ? 'red' : 'green' : ''}/>
                        <div className={classes(globalStyles.link, styles.moreTop, styles.moreLeft)}><L p={p} t={`Verify`}/></div>
                		</div>
                </div>
	                  <InputText
		                    size={"medium-long"}
		                    name={"emailAddress"}
		                    label={<L p={p} t={`Email address`}/>}
		                    value={user.emailAddress || ''}
		                    onChange={this.changeUser}
		                    onEnterKey={this.handleEnterKey}
		                    height={`medium`}
		                    inputClassName={styles.inputNoBold}
		                    error={errorEmailAddress} />
										<Checkbox
													id={`bestContactEmail`}
													label={<L p={p} t={`Okay to send emails`}/>}
													checked={user.bestContactEmail || ''}
													checkboxClass={styles.checkbox}
													labelClass={styles.labelCheckbox}
													onClick={() => this.toggleCheckbox('bestContactEmail')} />

                  	<InputText
                    		size={"medium"}
		                    name={"phone"}
		                    label={<L p={p} t={`Cell phone (for text messaging)`}/>}
		                    value={user.phone || ''}
		                    onChange={this.changeUser}
												onBlur={this.handleFormatPhone}
		                    onEnterKey={this.handleEnterKey}
		                    height={`medium`}
		                    inputClassName={styles.inputNoBold}
												error={errorPhone}/>

										<Checkbox
												id={`bestContactPhoneText`}
												label={<L p={p} t={`Okay to send text messages`}/>}
												checked={user.bestContactPhoneText || ''}
												checkboxClass={styles.checkbox}
												labelClass={styles.labelCheckbox}
												onClick={() => this.toggleCheckbox('bestContactPhoneText')} />

								<div className={styles.languageDiv}>
									<div>
										<SelectSingleDropDown
												label={<L p={p} t={`Native language`}/>}
												value={user.nativeLanguageId}
												options={languageOptions}
												error={''}
												height={`medium`}
												className={styles.singleDropDown}
												id={`nativeLanguageId`}
												onChange={this.changeUser} />
										</div>
										<div className={styles.errorLanguage}>{errorNativeLanguage}</div>
								</div>
								<span className={styles.inputText}><L p={p} t={`About Me`}/></span><br/>
                <textarea rows={5} cols={42} value={user.experienceExplanation || ''} id={`experienceExplanation`} name={`experienceExplanation`}
                    onChange={this.changeUser} className={styles.messageBox}>{user.experienceExplanation || ''}</textarea>
								<InputFile label={<L p={p} t={`Add a profile picture`}/>} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
								{user.profilePictures && user.profilePictures.length > 0 && user.profilePictures.map((p, i) =>
										<img key={i} width={100} src={p.fileUrl} alt={'profile'}/>
								)}
            </div>
            <div className={styles.resetPassword}>
                <a href={`/profileResetPassword/${personId}/${localUsername}`} className={styles.resetPassword}><L p={p} t={`Reset password`}/></a>
            </div>
            <div className={styles.buttonCenter}>
                <span className={styles.cancelButton} onClick={this.returnNav}>
                    <L p={p} t={`Close`}/>
                </span>
                <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
          </div>
			 <OneFJefFooter />
    </section>
    );
  }
}

export default withAlert(MyProfileView);
