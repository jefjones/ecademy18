import { useEffect, useState } from 'react'
import * as styles from './RegGuardiansContactsView.css'
const p = 'RegGuardiansContactsView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import Checkbox from '../../components/Checkbox'
import Required from '../../components/Required'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import { formatPhoneNumber } from '../../utils/numberFormat'

function RegGuardiansContactsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
	const params = useParams()
	const [isRecordComplete, setIsRecordComplete] = useState(false)
	const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
	const [errors, setErrors] = useState({})
	const [person, setPerson] = useState({
		personId: params && params.contactPersonId,
		personType: params && params.personType, //The options are PRIMARYGUARDIAN, SECONDARYGUARDIAN, EMERGENCYCONTACT
		prefix: '',
		firstName: '',
		middleName: '',
		lastName: '',
		suffix: '',
		preferredName: '',
		emailAddress: '',
		maritalStatusId: '',
		genderId: '',
		phone: '',
		canPhoneReceiveTexts: '',
		bestContactEmail: '',
		bestContactPhoneCall: '',
		bestContactPhoneText: '',
		address1: '',
		address2: '',
		city: '',
		uSStateId: '',
		countryId: 251,
		postalCode: '',
		comments: '',
		schoolEmployeeName: '',
		isSchoolEmployee: '',
		//disclaimerSignature: '',
	})
	const [personId, setPersonId] = useState(params && params.contactPersonId)
	const [personType, setPersonType] = useState(params && params.personType)
	const [prefix, setPrefix] = useState('')
	const [firstName, setFirstName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [lastName, setLastName] = useState('')
	const [suffix, setSuffix] = useState('')
	const [preferredName, setPreferredName] = useState('')
	const [emailAddress, setEmailAddress] = useState('')
	const [maritalStatusId, setMaritalStatusId] = useState('')
	const [genderId, setGenderId] = useState('')
	const [phone, setPhone] = useState('')
	const [canPhoneReceiveTexts, setCanPhoneReceiveTexts] = useState('')
	const [bestContactEmail, setBestContactEmail] = useState('')
	const [bestContactPhoneCall, setBestContactPhoneCall] = useState('')
	const [bestContactPhoneText, setBestContactPhoneText] = useState('')
	const [address1, setAddress1] = useState('')
	const [address2, setAddress2] = useState('')
	const [city, setCity] = useState('')
	const [uSStateId, setUSStateId] = useState('')
	const [countryId, setCountryId] = useState(251)
	const [postalCode, setPostalCode] = useState('')
	const [comments, setComments] = useState('')
	const [schoolEmployeeName, setSchoolEmployeeName] = useState('')
	const [isSchoolEmployee, setIsSchoolEmployee] = useState('')
	const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
	const [errorPhone, setErrorPhone] = useState(undefined)
	const [p, setP] = useState(undefined)

	useEffect(() => {

		//document.getElementById('firstName').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		loadPersonFromProps()

	}, [])

	// TODO: verify useEffect deps (converted from componentDidUpdate)
	useEffect(() => {

		if (params.personType && person.personType !== params.personType) {
			loadPersonFromProps()
			//document.getElementById('firstName').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		}

	}, [])

	const loadPersonFromProps = () => {

		const { registration } = props
		let personEntry = props.personEntry ? props.personEntry : {}
		if (props.personType === 'PRIMARYGUARDIAN') {
			let guardianContacts = registration && registration.guardianContacts
			//person.disclaimerSignature = guardianContacts.disclaimerSignature;
			person.isSchoolEmployee = guardianContacts.isSchoolEmployee
			person.schoolEmployeeName = guardianContacts.schoolEmployeeName
		}

		person.personId = props.contactPersonId
		person.personType = props.personType; //The options are PRIMARYGUARDIAN, SECONDARYGUARDIAN, EMERGENCYCONTACT;
		person.prefix = personEntry.prefix
		person.firstName = personEntry.fname
		person.middleName = personEntry.mname
		person.lastName = personEntry.lname
		person.suffix = personEntry.suffix
		person.preferredName = personEntry.preferredName
		person.emailAddress = personEntry.emailAddress
		person.maritalStatusId = personEntry.maritalStatusId
		person.genderId = personEntry.genderId
		person.phone = personEntry.phone
		person.canPhoneReceiveTexts = personEntry.canPhoneReceiveTexts
		person.bestContactEmail = personEntry.bestContactEmail
		person.bestContactPhoneCall = personEntry.bestContactPhoneCall
		person.bestContactPhoneText = personEntry.bestContactPhoneText
		person.address1 = personEntry.address1
		person.address2 = personEntry.address2
		person.city = personEntry.city
		person.uSStateId = personEntry.usstateId
		person.countryId = personEntry.countryId || 251
		person.postalCode = personEntry.postalCode
		person.comment = personEntry.comment

		if (!person.address1) {
			if (registration.guardianContacts && registration.guardianContacts.primaryGuardians && registration.guardianContacts.primaryGuardians.length > 0) {
				let primaryGuardian = registration.guardianContacts.primaryGuardians[0]
				//person.lastName = primaryGuardian.lname;
				person.address1 = primaryGuardian.address1
				person.address2 = primaryGuardian.address2
				person.city = primaryGuardian.city
				person.uSStateId = primaryGuardian.usstateId
				person.countryId = primaryGuardian.countryId || 251
				person.postalCode = primaryGuardian.postalCode
			} else if (registration.guardianContacts && registration.guardianContacts.secondaryGuardians && registration.guardianContacts.secondaryGuardians.length > 0) {
				let secondaryGuardian = registration.guardianContacts.secondaryGuardians[0]
				//person.lastName = secondaryGuardian.lname;
				person.address1 = secondaryGuardian.address1
				person.address2 = secondaryGuardian.address2
				person.city = secondaryGuardian.city
				person.uSStateId = secondaryGuardian.usstateId
				person.countryId = secondaryGuardian.countryId || 251
				person.postalCode = secondaryGuardian.postalCode
			}
		}

		setPerson(person)

	}

	const changePerson = ({ target }) => {

		let field = target.name
		if (field === 'state') field = 'uSStateId'
		setPerson({ ...person, [field]: target.value })

	}

	const handleEnterKey = (event) => {

		event.key === "Enter" && processForm("STAY")

	}

	const validateEmail = (email) => {

		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
		return re.test(email)

	}

	const processForm = (stayOrFinish) => {
		//, event
		let errors = {}
		let missingInfoMessage = []

		if (!person.firstName) {
			errors.firstName = <L p={p} t={`First name is required`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`First name`} /></div>
		}
		if (!person.lastName) {
			errors.lastName = <L p={p} t={`Last name is required`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Last name`} /></div>
		}
		if (('' + person.phone).replace(/\D/g, '').length !== 10) {
			errors.phone = <L p={p} t={`The phone number entered is not 10 digits`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`The phone number entered is not 10 digits`} /></div>
		}

		// if (personType === "PRIMARYCONTACT") {
		//     if (person.isSchoolEmployee && !person.schoolEmployeeName) {
		//         errors.schoolEmployeeName = <L p={p} t={`School employee name is required`}/> ;
		// 				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`School employee name`}/></div>
		//     }
		//     if (!person.disclaimerSignature) {
		//         errors.disclaimerSignature = <L p={p} t={`Disclaimer signature is required`}/> ;
		// 				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Disclaimer signature`}/></div>
		//     }
		// }

		if (personType !== "EMERGENCYCONTACT") {
			if (!person.emailAddress) {
				errors.eitherEmailOrCell = <L p={p} t={`Please enter an email address.`} />
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address`} /></div>
			} else if (!validateEmail(person.emailAddress)) {
				errors.emailAddress = <L p={p} t={`Email address appears to be invalid.`} />
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Invalid email address`} /></div>
			}

			if (!person.address1 && !person.address2) {
				errors.streetAddress = <L p={p} t={`Please enter a street address`} />
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Street address`} /></div>
			}
			if (!person.city) {
				errors.city = <L p={p} t={`Please enter a city`} />
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`City`} /></div>
			}
			if (!person.postalCode) {
				errors.postalCode = <L p={p} t={`Please enter a postal code`} />
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Postal code`} /></div>
			}
		}
		if (!person.genderId) {
			errors.gender = <L p={p} t={`Please enter a gender`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Gender`} /></div>
		}
		if (!person.phone) {
			errors.phone = <L p={p} t={`Please enter a phone number`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Phone number`} /></div>
		}

		if (!person.bestContactEmail && !person.bestContactPhoneCall && !person.bestContactPhoneText) {
			errors.bestContact = <L p={p} t={`Please choose a best way to contact this person`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Best way to contact`} /></div>
		}
		if (!person.countryId) {
			errors.country = <L p={p} t={`Please choose a country`} />
			missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Country`} /></div>
		}

		if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
			addOrUpdatePerson(personId, person, schoolYearId)
			props.alert.info(<div className={styles.alertText}><L p={p} t={`The guardian record has been saved.`} /></div>)
			navigate('/firstNav')
		} else {
			handleMissingInfoOpen(missingInfoMessage)
		}

	}

	const handleMissingInfoOpen = (messageInfoIncomplete) => {
		return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)


	}
	const handleMissingInfoClose = () => {
		return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')


	}
	const toggleCheckbox = (field) => {

		let person = person
		person[field] = !person[field]
		setPerson(person)

	}

	const handleFormatPhone = () => {


		if (person.phone && ('' + person.phone).replace(/\D/g, '').length !== 10) {
			setErrorPhone(<L p={p} t={`The phone number entered is not 10 digits`} />)
		} else if (formatPhoneNumber(person.phone)) {
			setErrorPhone(''); setPerson({ ...person, phone: formatPhoneNumber(person.phone) })
		}

	}


	return (
		<div className={styles.container}>
			<div className={styles.marginLeft}>
				<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
					{person.personType.indexOf('PRIMARY') > -1
						? <L p={p} t={`Primary Guardian`} />
						: person.personType.indexOf('SECONDARY') > -1
							? <L p={p} t={`Secondary Guardian`} />
							: <L p={p} t={`Emergency Contact`} />}
				</div>
				{person.personType === 'EMERGENCYCONTACT' &&
					<div className={styles.instructions}>
						<L p={p} t={`At least one non-parent emergency contact is required.`} />
					</div>
				}
				<div className={styles.formLeft}>
					<InputText
						id={`prefix`}
						name={`prefix`}
						size={"medium"}
						label={<L p={p} t={`Prefix`} />}
						autoComplete={'dontdoit'}
						value={person.prefix || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey} />
					<InputText
						id={`firstName`}
						name={`firstName`}
						size={"medium"}
						label={<L p={p} t={`First name`} />}
						value={person.firstName || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						autoComplete={'dontdoit'}
						required={true}
						whenFilled={person.firstName}
						error={errors.firstName} />
					<InputText
						id={`middleName`}
						name={`middleName`}
						size={"medium"}
						label={<L p={p} t={`Middle name`} />}
						autoComplete={'dontdoit'}
						value={person.middleName || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey} />
					<InputText
						id={`lastName`}
						name={`lastName`}
						size={"medium"}
						label={<L p={p} t={`Last name`} />}
						value={person.lastName || ''}
						autoComplete={'dontdoit'}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						required={true}
						whenFilled={person.lastName}
						error={errors.lastName} />
					<InputText
						id={`suffix`}
						name={`suffix`}
						size={"medium"}
						label={<L p={p} t={`Suffix`} />}
						autoComplete={'dontdoit'}
						value={person.suffix || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey} />
					<InputText
						id={`preferredName`}
						name={`preferredName`}
						size={"medium"}
						label={<L p={p} t={`Preferred name`} />}
						autoComplete={'dontdoit'}
						value={person.preferredName || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey} />
					<hr />
					<InputText
						id={`emailAddress`}
						name={`emailAddress`}
						size={"medium"}
						label={<L p={p} t={`Email address`} />}
						value={person.emailAddress || ''}
						onChange={changePerson}
						autoComplete={'dontdoit'}
						onEnterKey={handleEnterKey}
						required={person.personType.indexOf('GUARDIAN') > -1}
						whenFilled={person.emailAddress}
						error={errors.emailAddress} />
					{maritalStati && maritalStati.length > 0 &&
						<SelectSingleDropDown
							id={`maritalStatusId`}
							name={`maritalStatusId`}
							label={<L p={p} t={`Marital status`} />}
							value={person.maritalStatusId || ''}
							options={maritalStati}
							className={styles.moreBottomMargin}
							height={`medium`}
							onChange={changePerson}
							onEnterKey={handleEnterKey}
							error={errors.maritalStatus} />
					}
					<SelectSingleDropDown
						id={`genderId`}
						name={`genderId`}
						label={<L p={p} t={`Gender`} />}
						value={person.genderId || ''}
						options={genders}
						className={styles.moreBottomMargin}
						height={`medium`}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						required={true}
						whenFilled={person.genderId}
						error={errors.gender} />
					<hr />
					<div className={styles.row}>
						<InputText
							id={`phone`}
							name={`phone`}
							size={"medium"}
							label={<L p={p} t={`Phone`} />}
							value={person.phone || ''}
							onChange={changePerson}
							onBlur={handleFormatPhone}
							onEnterKey={handleEnterKey}
							autoComplete={'dontdoit'}
							required={true}
							whenFilled={person.phone}
							error={errors.phone} />
						<div className={styles.phoneText}>
							<Checkbox
								id={'canPhoneReceiveTexts'}
								label={<L p={p} t={`Phone can receive texts`} />}
								checked={person.canPhoneReceiveTexts || ''}
								onClick={() => toggleCheckbox('canPhoneReceiveTexts')}
								labelClass={styles.label} />
						</div>
					</div>
					<div className={classes(styles.row, styles.inputText)}>
						<span className={person.personType.indexOf('GUARDIAN') > -1 || person.personType.indexOf('EMERGENCY') > -1 ? styles.lower : ''}>
							<L p={p} t={`Best way to contact`} />
						</span>
						<Required setIf={person.personType.indexOf('GUARDIAN') > -1 || person.personType.indexOf('EMERGENCY') > -1}
							setWhen={person.bestContactEmail || person.bestContactPhoneCall || person.bestContactPhoneText} />
					</div>
					<div className={styles.row}>
						<Checkbox
							id={'bestContactEmail'}
							label={<L p={p} t={`Email`} />}
							checked={person.bestContactEmail || ''}
							onClick={() => toggleCheckbox('bestContactEmail')}
							labelClass={styles.labelCheckbox} />
						<Checkbox
							id={'bestContactPhoneCall'}
							label={<L p={p} t={`Phone call`} />}
							checked={person.bestContactPhoneCall || ''}
							onClick={() => toggleCheckbox('bestContactPhoneCall')}
							labelClass={styles.labelCheckbox} />
						<Checkbox
							id={'bestContactPhoneText'}
							label={<L p={p} t={`Text message`} />}
							checked={person.bestContactPhoneText || ''}
							onClick={() => toggleCheckbox('bestContactPhoneText')}
							labelClass={styles.labelCheckbox} />
					</div>
					<span className={styles.error}>{errors.bestContact}</span>
					<hr />
					<SelectSingleDropDown
						id={`countryId`}
						name={`countryId`}
						label={<L p={p} t={`Country`} />}
						value={person.countryId || 251}
						options={countries}
						className={styles.moreBottomMargin}
						height={`medium`}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						error={errors.country} />
					<InputText
						id={`address1`}
						name={`address1`}
						size={"medium"}
						label={<L p={p} t={`Address (line 1)`} />}
						value={person.address1 || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						required={person.personType.indexOf('GUARDIAN') > -1}
						whenFilled={person.address1}
						error={errors.streetAddress} />
					<InputText
						id={`address2`}
						name={`address2`}
						size={"medium"}
						label={<L p={p} t={`Address (line 2)`} />}
						value={person.address2 || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey} />
					<InputText
						id={`city`}
						name={`city`}
						size={"medium"}
						label={<L p={p} t={`City`} />}
						value={person.city || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						required={person.personType.indexOf('GUARDIAN') > -1}
						whenFilled={person.city}
						error={errors.city} />
					<SelectSingleDropDown
						id={`state`}
						name={`state`}
						label={<L p={p} t={`US State`} />}
						value={person.uSStateId || ''}
						options={usStates}
						className={styles.moreBottomMargin}
						height={`medium`}
						onChange={changePerson}
						onEnterKey={handleEnterKey} />
					<InputText
						id={`postalCode`}
						name={`postalCode`}
						size={"medium"}
						label={<L p={p} t={`Postal code`} />}
						value={person.postalCode || ''}
						onChange={changePerson}
						onEnterKey={handleEnterKey}
						required={person.personType.indexOf('GUARDIAN') > -1}
						whenFilled={person.postalCode}
						error={errors.postalCode} />
					<div className={styles.inputText}><L p={p} t={`Additional note (including additional phone numbers)`} /></div>
					<textarea rows={5} cols={45}
						id={`comment`}
						name={`comment`}
						onChange={changePerson}
						value={person.comment || ''}
						className={styles.commentTextarea} />
					<hr />
					{person.personType === 'PRIMARYGUARDIAN' &&
						<div>
							<div className={styles.moreTop}>
								<Checkbox
									id={'isSchoolEmployee'}
									label={<L p={p} t={`Are you or your spouse a school employee?`} />}
									checked={person.isSchoolEmployee || ''}
									onClick={() => toggleCheckbox('isSchoolEmployee')}
									labelClass={styles.label} />
							</div>
							{person.isSchoolEmployee &&
								<InputText
									id={`schoolEmployeeName`}
									name={`schoolEmployeeName`}
									size={"medium"}
									label={<L p={p} t={`Please enter the employee's name here:`} />}
									value={person.schoolEmployeeName || ''}
									onChange={changePerson}
									required={true}
									whenFilled={person.schoolEmployeeName}
									error={errors.schoolEmployeeName} />
							}
							{/*<hr/>
                              <div className={styles.subHeading}>Disclaimer</div>
            									<div className={classes(styles.label, globalStyles.instructionsBigger, styles.moreBottom)}>
            											<L p={p} t={`State law requires that a form of identification and a current immunization record must be on file in order to attend school.`}/>
            											<L p={p} t={`As custodial parent/legal guardian of this student I verify that the information provided to the best of my knowledge is true and correct.`}/>
            											<L p={p} t={`I also understand that misrepresentation of ANY information may result in this student being removed from school permanently or until the issue is resolved.`}/>
            									</div>
                              <div className={classes(styles.label, globalStyles.instructionsBigger)}>
            											<L p={p} t={`Policy: It is the policy of this school not to discriminate on the basis of sex, race, color, national origin, religion, disabilities or any other legally protected class.`}/>
            									</div>
                              <InputText
                                  label={<L p={p} t={`By typing your name here you are agreeing to the terms of the disclaimer.`}/>}
                                  id={`disclaimerSignature`}
                                  name={`disclaimerSignature`}
                                  size={"medium"}
                                  value={person.disclaimerSignature || ''}
                                  autoComplete={'dontdoit'}
                                  onChange={changePerson}
                                  onEnterKey={handleEnterKey}
                                  required={true}
                                  whenFilled={person.disclaimerSignature}
                                  error={errors.disclaimerSignature} />
                                */}
						</div>
					}
					<div className={styles.centerRowRight}>
						<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`} /></Link>
						<button className={styles.submitButton} onClick={(event) => processForm("STAY", event)}>
							<L p={p} t={`Submit`} />
						</button>
					</div>
				</div>
			</div>
			{isShowingModal_missingInfo &&
				<MessageModal handleClose={handleMissingInfoClose} heading={`Missing information`}
					explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
			}
			<OneFJefFooter />
		</div>
	)
}

export default withAlert(RegGuardiansContactsView)
