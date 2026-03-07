import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './RegistrationPendingView.css'
const p = 'RegistrationPendingView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import Checkbox from '../../components/Checkbox'
import EditTable from '../../components/EditTable'
import MessageModal from '../../components/MessageModal'
import TextareaModal from '../../components/TextareaModal'
import Icon from '../../components/Icon'
import TextDisplay from '../../components/TextDisplay'
import InputText from '../../components/InputText'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import DateMoment from '../../components/DateMoment'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import CheckboxGroup from '../../components/CheckboxGroup'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {doSort} from '../../utils/sort'

function RegistrationPendingView(props) {
  const [isShowingModal_accept, setIsShowingModal_accept] = useState(false)
  const [isShowingModal_deny, setIsShowingModal_deny] = useState(false)
  const [orderBy, setOrderBy] = useState('finalizedDate')
  const [orderDirection, setOrderDirection] = useState('desc')
  const [registrationTableId, setRegistrationTableId] = useState(undefined)
  const [partialNameText, setPartialNameText] = useState('')
  const [studentIdList, setStudentIdList] = useState([])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])
  const [registrationStatusFilter, setRegistrationStatusFilter] = useState([])

  const {fetchingRecord, students, companyConfig} = props
        const {personId, setRegistrationPaidDate, personConfig, registrationPending, registrationStati, myFrequentPlaces, setMyFrequentPlace} = props
  			let localRegPending = Object.assign([], registrationPending)
  			let headings = [
  					{label: <L p={p} t={`Paid`}/>, tightText: true, clickFunction: () => resort('paidDate'), biggerClickArea: true},
  					{label: <L p={p} t={`Entry Date`}/>, tightText: true, clickFunction: () => resort('entryDate'), biggerClickArea: true},
  					{label: <L p={p} t={`Primary Guardian`}/>, tightText: true, clickFunction: () => resort('primaryGuardianLastFirstName'), biggerClickArea: true},
  					{label: <L p={p} t={`Student`}/>, tightText: true},
  					{label: <L p={p} t={`Other Contact`}/>, tightText: true},
  			]
  			// if (search && registration && registration.length > 0)
  			// 		registrationPending = registrationPending.filter(m => moment(m.entryDate).format("D MMM YYYY").toLowerCase().indexOf(search) > -1
  			// 				|| String(m.recipients).toLowerCase().indexOf(search) > -1 || m.subject.toLowerCase().indexOf(search) > -1 || m.message.toLowerCase().indexOf(search) > -1)
  			let registrations = localRegPending.registrations
  			if (personConfig.showOnlyUnpaidReg && registrations && registrations.length > 0) {
  					registrations = registrations.filter(m => !m.paidDate)
  			}
  			if (registrationStatusFilter && registrationStatusFilter.length > 0) registrations = registrations.filter(m => registrationStatusFilter.indexOf(m.registrationStatus) > -1)
  
  			if (registrations && registrations.length > 0) {
  					if (partialNameText) {
  							let partialNameLower = partialNameText.toLowerCase()
  							registrations = registrations && registrations.length > 0 && registrations.filter(w => {
  									if ((w.primaryGuardianLastFirstName && w.primaryGuardianLastFirstName.toLowerCase().indexOf(partialNameLower) > -1)
  													|| (w.responsibleFirstName && w.responsibleFirstName.toLowerCase().indexOf(partialNameLower) > -1)
  													|| (w.responsibleLastName && w.responsibleLastName.toLowerCase().indexOf(partialNameLower) > -1)
  													|| (w.responsibleFirstName && w.responsibleFirstName.toLowerCase().indexOf(partialNameLower) > -1)) {
  											return true
  									}
  									let hasStudentName = false
  									registrationPending.students && registrationPending.students.length > 0 && registrationPending.students.filter(f => f.registrationTableId === w.registrationTableId).forEach(f => {
  											if (f.firstName.toLowerCase().indexOf(partialNameLower) > -1 || f.lastName.toLowerCase().indexOf(partialNameLower) > -1) {
  													hasStudentName = true
  											}
  									})
  									return hasStudentName ? true : false
  							})
  					}
  					if (studentIdList && studentIdList.length > 0) {
  							let studentIdsOnly = studentIdList.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
  							registrations = registrations && registrations.length > 0 && registrations.filter(w => {
  									let hasStudentName = false
  									registrationPending.students && registrationPending.students.length > 0 && registrationPending.students.filter(f => f.registrationTableId === w.registrationTableId).forEach(f => {
  											if (studentIdsOnly.indexOf(f.studentPersonId) > -1) {
  													hasStudentName = true
  											}
  									})
  									return hasStudentName ? true : false
  							})
  					}
  					if (selectedGradeLevels && selectedGradeLevels.length > 0) {
  							registrations = registrations && registrations.length > 0 && registrations.filter(w => {
  									let hasStudentName = false
  									registrationPending.students && registrationPending.students.length > 0 && registrationPending.students.filter(f => f.registrationTableId === w.registrationTableId).forEach(f => {
  											if (selectedGradeLevels.indexOf(f.gradeLevelId) > -1) {
  													hasStudentName = true
  											}
  									})
  									return hasStudentName ? true : false
  							})
  					}
  			}
  
  			registrations = doSort(registrations, { sortField: orderBy, isAsc: orderDirection === 'asc', isNumber: false })
  			localRegPending.registrations = registrations
  
  			let data = localRegPending && localRegPending.registrations && localRegPending.registrations.length > 0 && localRegPending.registrations.map((m, i) => {
  				let payDetails = m.billingType === 'BANKACCOUNT'
  						? 'eft: ' + m.account
  						: m.billingType === 'CREDITCARD'
  								? 'cc: ' + m.cardNumber
  								: ''
  
  				let responsibleGuardian = registrationPending.guardians && registrationPending.guardians.length > 0 && registrationPending.guardians
  						.filter(f => f.personId === m.responsiblePersonId)[0]
  
  				let responsiblePerson = responsibleGuardian && responsibleGuardian.personId
  				 		? responsibleGuardian.firstName + ' ' + responsibleGuardian.lastName
  						: m.responsibleFirstName + ' ' + m.responsibleLastName
  
  				return [
  						{value: <div>
  												<div className={styles.text}>{payDetails}</div>
  												<div className={styles.text}>{responsiblePerson}</div>
  												<div className={styles.text}>{m.billingFrequency}</div>
  												{!!m.paidDate
  														? <TextDisplay label={<L p={p} t={`Paid date`}/>} text={<DateMoment date={m.paidDate} format={'D MMM  h:mm a'} minusHours={6}/>} />
  														: <ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Set as Paid`}/>} onClick={() => setRegistrationPaidDate(personId, m.registrationTableId)}
  																	id={m.registrationTableId} />
  												}
  										</div>
  						},
  						{value: <DateMoment date={m.finalizedDate} format={'D MMM  h:mm a'} minusHours={6}/>},
  						{value: registrationPending.guardians && registrationPending.guardians.length > 0 && registrationPending.guardians
  								.filter(f => f.registrationTableId === m.registrationTableId && f.guardianType === 'Primary')
  								.map((f, i) => (
  										<div key={i}>
  												<div className={styles.row}>
  														{`${f.lastName}, ${f.firstName}  ${f.phone}  (`}
  														<a href={`mailto: ${f.emailAddress}`} className={styles.link}>{f.emailAddress}</a>{`)`}
  												</div>
  												<div>
  														<SelectSingleDropDown
  																id={`registrationStatus`}
  																name={`registrationStatus`}
  																label={`Review status`}
  																value={m.registrationStatus || ''}
  																options={registrationStati}
  																className={styles.moreBottomMargin}
  																height={`medium`}
  																onChange={(event) => handleRegistrationStatus(event, m.registrationTableId)}/>
  													</div>
  										</div>
  						))},
  						{value: registrationPending.students && registrationPending.students.length > 0 && registrationPending.students
  								.filter(f => f.registrationTableId === m.registrationTableId)
  								.map((f, i) => {
  									return (
  										<div key={i} >
  												<div className={styles.row}>
  														{f.regApprovedOrDenied
  																? <div className={f.regApprovedOrDenied === 'Approved' ? styles.approved : styles.denied}>
  																			{f.regApprovedOrDenied}
  																	</div>
  																:	<div className={styles.row}>
  																			<div className={classes(styles.text, styles.littleRight)}>Pending:</div>
  																			<div onClick={() => handleAcceptOpen(m.registrationTableId, f.studentPersonId)}
  																							className={classes(styles.approve, styles.moreRight, styles.row)} data-rh={'Approve? Waiting for review'}>
  																					<Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																			</div>
  																			<div onClick={() => handleDenyOpen(m.registrationTableId, f.studentPersonId)}
  																							className={classes(styles.moreRight, styles.decline, styles.row)} data-rh={'Decline? Waiting for review'}>
  																					<Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
  																			</div>
  																	</div>
  														}
  														{(companyConfig.hasDistanceLearning ? f.studentType : '') + (!companyConfig.hasAccredited ? '' : ' (' + (f.accredited ? `Accredited` : `Non`) + '): ')}
  														<Link to={`/studentProfile/`+ f.studentPersonId + '/' + m.schoolYearId} className={styles.link}>{f.firstName + ' ' + f.lastName}</Link>
  														<div className={styles.moreSpace}>[ {f.gradeLevelName} ]</div>
  												</div>
  												<div className={styles.bigIndent}>
  														{f.studentType === 'DE' && registrationPending.selectedCourses && registrationPending.selectedCourses.length > 0
  																&& registrationPending.selectedCourses
  																			.filter(c => c.studentPersonId === f.studentPersonId)
  																			.map((c, i) =>
  																					<div key={i}>{i+1}. {companyConfig.hasDistanceLearning && c.courseName} {!companyConfig.hasAccredited ? '' : c.accredited ? '(Acc)' : '(Non)'}</div>)
  														 }
  												</div>
  										</div>
  								)})
  						},
  						{value: registrationPending.guardians && registrationPending.guardians.length > 0 && registrationPending.guardians
  								.filter(f => f.registrationTableId === m.registrationTableId && f.guardianType !== 'Primary')
  								.map((f, i) => (
  										<div key={i} className={styles.row}>
  												{`${f.guardianType}: ${f.firstName} ${f.lastName}  ${f.phone}  (`}
  												<a href={`mailto: ${f.emailAddress}`} className={styles.link}>{f.emailAddress}</a>{`)`}
  										</div>
  						))},
  				]})
  
          return (
              <div className={styles.container}>
  								<div className={globalStyles.pageTitle}>
  										{`Registration Pending`}
  								</div>
  								<div>
  										<div className={styles.rowWrap}>
  												<div className={classes(styles.moreTop, styles.moreLeft)}>
  														<InputText
  																id={"partialNameText"}
  																name={"partialNameText"}
  																size={"medium"}
  																label={<L p={p} t={`Name search`}/>}
  																value={partialNameText || ''}
  																onChange={changeItem}/>
  												</div>
  
  												<div className={styles.moreTop}>
  														<InputDataList
  																label={<L p={p} t={`Student(s)`}/>}
  																name={'studentIdList'}
  																options={students}
  																value={studentIdList || []}
  																multiple={true}
  																height={`medium`}
  																className={styles.moreSpace}
  																labelClass={styles.checkboxLabel}
  																onChange={(values) => dataListChange('studentIdList', values)}
  																removeFunction={removeStudent}/>
  												</div>
  
  												<div className={classes(styles.moreTop, styles.moreLeft, styles.moreBottom)}>
  														<span className={styles.textRating}><L p={p} t={`Grade levels`}/></span>
  														<div className={styles.row}>
  																{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
  																		<Checkbox
  																				key={i}
  																				id={m.gradeLevelId}
  																				label={m.name}
  																				checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && (selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
  																				onClick={() => toggleGradeLevel(m.gradeLevelId)}
  																				labelClass={styles.labelCheckbox}
  																				checkboxClass={styles.checkbox} />
  																)}
  														</div>
  												</div>
  												<div className={classes(styles.moreLeft, styles.border, styles.moreTop)}>
  														<CheckboxGroup
  																name={'registrationStati'}
  																options={registrationStati || []}
  																horizontal={true}
  																onSelectedChanged={handleCheckboxGroup}
  																label={<L p={p} t={`Registration status type:`}/>}
  																selected={registrationStatusFilter}/>
  												</div>
  												<div className={styles.moreTop}>
  														<Checkbox
  																label={<L p={p} t={`Show only unpaid registrations`}/>}
  																checked={personConfig.showOnlyUnpaidReg || ''}
  																onClick={toggleCheckbox}
  																labelClass={styles.checkboxLabel}
  																checkboxClass={styles.checkbox} />
                              <div className={classes(styles.row, styles.moreLeft)}>
                                  <div onClick={clearFilters} className={classes(globalStyles.link, styles.moreTop)}>
                                      <L p={p} t={`Clear filters`}/>
                                  </div>
                              </div>
  												</div>
  										</div>
  								</div>
  								<hr/>
  								<div className={styles.heightDiv}>
  										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={fetchingRecord.registrationPending}/>
  								</div>
  								<div>
  										<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Registration Pending`}/>} path={'registrationPending'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  								</div>
  								<OneFJefFooter />
  								{isShowingModal_accept &&
  		                <MessageModal handleClose={handleAcceptClose} heading={<L p={p} t={`Accept this student's registration?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to accept this student's registration?`}/>} isConfirmType={true} onClick={handleAccept} />
  		            }
  								{isShowingModal_deny &&
  										<TextareaModal handleClose={handleDenyClose} heading={<L p={p} t={<L p={p} t={`Deny this student's registration`}/>}/>}
  												explainJSX={<L p={p} t={<L p={p} t={`Please provide an explanation for denying this registration.`}/>}/>} onClick={handleDeny}/>
  								}
              </div>
          )
}

// approve
// <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
// decline
// <Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
export default RegistrationPendingView
