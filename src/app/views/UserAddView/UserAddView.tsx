import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './UserAddView.css'
import classes from 'classnames'
import InputText from '../../components/InputText'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import Required from '../../components/Required'
import { withAlert } from 'react-alert'
import OneFJefFooter from '../../components/OneFJefFooter'

function UserAddView(props) {
  const [personId, setPersonId] = useState(props.personId)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errorEmailAddress, setErrorEmailAddress] = useState('')
  const [errorExternalId, setErrorExternalId] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [users, setUsers] = useState([])
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal_hasClass, setIsShowingModal_hasClass] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        externalId: '',
        emailAddress: '',
				phone: '',
				fromGradeLevelId: '',
        toGradeLevelId: '',
      })
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [externalId, setExternalId] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [fromGradeLevelId, setFromGradeLevelId] = useState('')
  const [toGradeLevelId, setToGradeLevelId] = useState('')
  const [isInit, setIsInit] = useState(undefined)
  const [userPersonId, setUserPersonId] = useState(undefined)
  const [inviteMessage, setInviteMessage] = useState(undefined)
  const [errorLastName, setErrorLastName] = useState(undefined)
  const [contactMatches, setContactMatches] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorPhone, setErrorPhone] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {user} = props
    			if (!isInit && user && user.personId) {
    					setIsInit(true); setUser(user); setUserPersonId(props.userPersonId)
    			}
    	
  }, [])

  const handleMessageChange = (event) => {
    
          setInviteMessage(event.target.value)
      
  }

  const changeUser = (event) => {
    
        const field = event.target.name
        let user = Object.assign({}, user)
        user[field] = event.target.value
    		field === "firstName" && setErrorFirstName('')
        field === "lastName" && setErrorLastName('')
        (field === "emailAddress" || field === "phone") && setErrorEmailAddress('')
        field === "emailAddress" && findContactMatches(event.target.value, '')
        field === "phone" && findContactMatches('', event.target.value)
        if (field === "emailAddress") user[field] = user[field].replace(/ /g, "")
        setUser(user)
      
  }

  const findContactMatches = (emailAddress, phone) => {
    
    			const {contacts} = props
    			if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
    					setContactMatches(contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)))
    			}
    	
  }

  const handleEnterKey = (event) => {
    
          event.key === "Enter" && processForm("STAY")
      
  }

  const validateEmail = (email) => {
    
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
          return re.test(email)
      
  }

  const validatePhone = (phone) => {
    
          return stripPhoneFormatAndPrefix(phone).length === 10 ? true : false
      
  }

  const stripPhoneFormatAndPrefix = (phone) => {
    
          phone = phone && phone.replace(/\D+/g, "")
          if (phone && phone.indexOf('1') === 0) { //if 1 is in the first place, get rid of it.
              phone = phone.substring(1)
          }
          return phone
      
  }

  const processForm = (stayOrFinish, event) => {
    
        const {addUser, updateUser, personId, params, loginData, gradeLevels} = props
        
        // prevent default action. in this case, action is the form submission event
        event && event.preventDefault()
    		let missingInfoMessage = []
    
        if (!user.firstName) {
            setErrorFirstName(<L p={p} t={`First name required.`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`}/></div>
        }
    
    		if (!user.lastName) {
            setErrorLastName(<L p={p} t={`Last name required.`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Last name`}/></div>
        }
    
        if (!user.emailAddress) {
            setErrorEmailAddress(<L p={p} t={`An email address or cell phone for texting is required`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address or cell phone`}/></div>
        } else if (user.emailAddress && !validateEmail(user.emailAddress)) {
            setErrorEmailAddress(<L p={p} t={`Email address appears to be invalid`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Invalid email address`}/></div>
        } else if (user.phone && !validatePhone(user.phone) ) {
            setErrorPhone(<L p={p} t={`The phone number should be ten digits long`}/>)
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Ten digit phone number`}/></div>
        }
    
    		if (!(user.fromGradeLevelId && user.fromGradeLevelId !== '0') || !(user.toGradeLevelId && user.toGradeLevelId !== '0')) {
    				if (!(user.fromGradeLevelId && user.fromGradeLevelId !== '0')) {
    		        setFromGradeLevelId(<L p={p} t={`Required`}/>)
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
    		    }
    
    				if (!(user.toGradeLevelId && user.toGradeLevelId !== '0')) {
    		        setToGradeLevelId(<L p={p} t={`Required`}/>)
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
    		    }
    		} else {
    				let fromGradeLevelSequence = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.gradeLevelId === user.fromGradeLevelId)[0]
    				if (fromGradeLevelSequence && fromGradeLevelSequence.sequence) fromGradeLevelSequence = fromGradeLevelSequence.sequence
    				let toGradeLevelSequence = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.gradeLevelId === user.toGradeLevelId)[0]
    				if (toGradeLevelSequence && toGradeLevelSequence.sequence) toGradeLevelSequence = toGradeLevelSequence.sequence
    				if (toGradeLevelSequence < fromGradeLevelSequence ) {
    						setFromGradeLevelId(<L p={p} t={`The 'to grade level' is less than the 'from grade level'`}/>)
    						missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The 'from grade level' is less than the 'to grade level`}/></div>
    				}
    		}
    
    		if (loginData.isDuplicateUsername) {
    				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Username is duplicate`}/></div>
    		}
    
        if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
    				user.userRole = props.userRole
            params && params.userPersonId ? updateUser(personId, user) : addUser(personId, [user])
    				props.alert.info(<div className={styles.alertText}><L p={p} t={`The user's record has been saved.`}/></div>)
            setUser({
                  firstName: '',
                  lastName: '',
    							username: '',
                  externalId: '',
                  emailAddress: '',
                  phone: '',
    							fromGradeLevelId: '',
    							toGradeLevelId: '',
                }); setErrorFirstName(''); setErrorLastName(''); setErrorEmailAddress(''); setFromGradeLevelId(''); setToGradeLevelId('')
            params && params.userPersonId && navigate(`/schoolSettings`)
    		} else {
    				handleMissingInfoOpen(missingInfoMessage)
        }
      
  }

  const fillInEmailAddress = (event) => {
    
    			//if this is a valid email address and the emailAddress is empty, fill it in automatically with the user
    			
    			let username = event.target.value
    			if (validateEmail(username) && !user.emailAddress) user.emailAddress = username
    	
  }

  const checkDuplicateUsername = (event) => {
    
    			props.isDuplicateUsername(event.target.value)
    	
  }

  const handleDeleteOpen = () => {
    return setIsShowingModal_delete(true)
  }

  const handleDeleteClose = () => {
    return setIsShowingModal_delete(false)
  }

  const handleDelete = () => {
    
    			const {removeUser, personId, userPersonId} = props
    			removeUser(personId, userPersonId)
    			handleDeleteClose()
    			navigate('/firstNav')
    	
  }

  const handleHasClassOpen = () => {
    return setIsShowingModal_hasClass(true)
  }

  const handleHasClassClose = () => {
    return setIsShowingModal_hasClass(false)
  }

  const handleHasClass = () => {
    
    			const {removeUser, personId} = props
    			
    			removeUser(personId, user.personId)
    			handleHasClassClose()
    			navigate('/firstNav')
    	
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    	handleMissingInfoClose = () => setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
      render() {
        const {userRole, personId, login, accessRoles, loginData, userPersonId, gradeLevels, myFrequentPlaces, setMyFrequentPlace} = props
  }

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
      render() {
        const {userRole, personId, login, accessRoles, loginData, userPersonId, gradeLevels, myFrequentPlaces, setMyFrequentPlace} = props
  }

  const {userRole, personId, login, accessRoles, loginData, userPersonId, gradeLevels, myFrequentPlaces, setMyFrequentPlace} = props
      
  
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
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={user.firstName}
                          error={errorFirstName} />
                      <InputText
                          size={"medium"}
                          name={"lastName"}
                          label={<L p={p} t={`Last name`}/>}
                          value={user.lastName || ''}
                          onEnterKey={handleEnterKey}
                          onChange={changeUser}required={true}
  												whenFilled={user.lastName}
                          error={errorLastName} />
  										<InputText
                          size={"medium"}
                          name={"username"}
                          label={<L p={p} t={`Username`}/>}
                          value={user.username || ''}
                          onEnterKey={handleEnterKey}
  												onBlur={(event) => {fillInEmailAddress(event); checkDuplicateUsername(event)}}
                          onChange={changeUser}
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
  																setWhen={(user.phone && validatePhone(user.phone)) ||  (user.emailAddress && validateEmail(user.emailAddress))}/>
  												</div>
                          <InputText
                              size={"medium-long"}
                              name={"emailAddress"}
                              label={<L p={p} t={`Email address`}/>}
                              value={user.emailAddress || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              error={errorEmailAddress} />
                          <InputText
                              size={"medium-short"}
                              name={"phone"}
                              label={<L p={p} t={`Text message phone number`}/>}
                              value={user.phone || ''}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
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
  														onChange={changeUser}
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
  														onChange={changeUser}
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
  												onEnterKey={handleEnterKey}
  												onChange={changeUser}
  												error={errorExternalId}/>
  								</div>
  
                  <div className={classes(styles.rowRight)}>
  										<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
  										{userPersonId &&
  												<ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={handleDeleteOpen} changeRed={true}/>
  										}
  										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
                  </div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`User Add`}/>} path={`userAdd/${userRole}`} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal_delete &&
  								<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this user?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this user?`}/>} isConfirmType={true}
  									 onClick={handleDelete} />
  						}
  						{isShowingModal_hasClass &&
  								<MessageModal handleClose={handleHasClassClose} heading={<L p={p} t={`This user has at least one class`}/>}
  									 explainJSX={<L p={p} t={`This user is assigned to the following classes.  Are you sure you want to delete this user?  The user will be set as inactive and won't be able to be chosen as a user in the future.<br/><br/>`}/> + user.hasClass.join('<br/>')}
  									 isConfirmType={true}
  									 onClick={handleHasClass} />
  						}
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
          </section>
      )
}

export default withAlert(UserAddView)
