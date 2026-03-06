import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './StudentAssignmentAssignView.css'
const p = 'StudentAssignmentAssignView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import EditTableFreezeLeft from '../../components/EditTableFreezeLeft'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
//import Loading from '../../components/Loading';
import MessageModal from '../../components/MessageModal'
import Checkbox from '../../components/Checkbox'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import moment from 'moment'
import debounce from 'lodash/debounce'
import {doSort} from '../../utils/sort'
import { withAlert } from 'react-alert'

function StudentAssignmentAssignView(props) {
  const [showSearchControls, setShowSearchControls] = useState(false)
  const [contentTypeId, setContentTypeId] = useState('')
  const [singleAssignmentId, setSingleAssignmentId] = useState('')
  const [contentTypeCode, setContentTypeCode] = useState('')
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(false)
  const [showHideResponseTypes, setShowHideResponseTypes] = useState(false)
  const [jumpToAssignmentId, setJumpToAssignmentId] = useState(undefined)
  const [forceUpdate, setForceUpdate] = useState(undefined)
  const [schoolYearId, setSchoolYearId] = useState(undefined)

  useEffect(() => {
    
    				const {contentTypeId} = props
    				setContentTypeId(contentTypeId)
    				//document.getElementById('courseScheduledId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    		
  }, [])

  const sendToStudentSchedule = (studentPersonId) => {
    
    				const {getStudentAssignments, personId, courseEntryId} = props
    				getStudentAssignments(personId, studentPersonId, courseEntryId)
    				navigate('/studentSchedule/' + studentPersonId)
    		
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && moveToNextScoreDown(event)
        
  }

  const toggleCheckbox = (studentPersonId, assignmentId) => {
    
    				const {personId, setStudentAssignmentAssign, courseScheduledId, getStudentAssignmentAssign} = props
    				const {jumpToAssignmentId, singleAssignmentId} = props
    				setStudentAssignmentAssign(studentPersonId, assignmentId, () => getStudentAssignmentAssign(personId, courseScheduledId, jumpToAssignmentId, singleAssignmentId))
    				props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The new setting is being saved.`}/></div>)
        
  }

  const recallPageWithJump = (event) => {
    
    				const {personId, updatePersonConfigCourse, getStudentAssignmentAssign, courseScheduledId} = props
    				updatePersonConfigCourse(personId, courseScheduledId, event.target.value === '0' ? '' : event.target.value)
            getStudentAssignmentAssign(personId, courseScheduledId, event.target.value); //All assignments are already in our record from the database.
            setJumpToAssignmentId(event.target.value)
        
  }

  const changeFilters = (event) => {
    
    				let newState = Object.assign({}, state)
    				let field = event.target.name
    				newState[field] = event.target.value
    				setState(newState)
    		
  }

  const handleUpdateInterval = (event) => {
    
    				const {personId, updatePersonConfig, getCoursesScheduled, getStudentAssignmentAssign} = props
    				updatePersonConfig(personId, 'IntervalId', event.target.value,
    						() => {
    								getCoursesScheduled(personId)
    								getStudentAssignmentAssign(personId, 0, 0, 0)
    						}
    				)
    				setJumpToAssignmentId(null); setForceUpdate(true)
    				navigate('/studentAssignmentAssign/0')
    		
  }

  const recallPage = (event, singleAssignmentId='') => {
    
    				//const {getStudentAssignmentAssign, personId} = props;
    				const {courseScheduledId, clearStudentAssignmentAssign} = props
    				clearStudentAssignmentAssign()
    				let id = event && event.target && event.target.value ? event.target.value : courseScheduledId
    				sendDebounce(id, singleAssignmentId); //There is something going on with the event that gets overridden that we have to put off the debounce call until we get the event data.
    				navigate(`/studentAssignmentAssign/${id}`)
        
  }

  const isChecked = (studentPersonId, assignmentId) => {
    
    				const {studentAssignmentAssign} = props
    				let record = studentAssignmentAssign.studentAssign && studentAssignmentAssign.studentAssign.length > 0
    						&& studentAssignmentAssign.studentAssign.filter(m => m.studentPersonId === studentPersonId && m.assignmentId === assignmentId)[0]
    				return record && record.studentPersonId ? true : false
    		
  }

  const handleUpdateSchoolYear = ({target}) => {
    
    				const {personId, updatePersonConfig, getCoursesScheduled} = props
    				setSchoolYearId(target.value)
    				updatePersonConfig(personId, 'SchoolYearId', target.value, () => getCoursesScheduled(personId, true))
    				navigate(`/studentAssignmentAssign/0`)
    		
  }

  const {personId, companyConfig={}, courses, accessRoles={}, courseEntryId, contentTypes, intervals, personConfig, studentAssignmentAssign,
  							schoolYears, myFrequentPlaces, setMyFrequentPlace, courseScheduledId} = props
        
  			let {jumpToAssignmentId} = state
  
  			const fullAssignmentList = props.studentAssignmentAssign && props.studentAssignmentAssign.assignments
  
  	 		let headings = [{label: '', cellColor: 'white'}]
  			let data = []
  			let foundJumpTo = !jumpToAssignmentId || jumpToAssignmentId === guidEmpty || jumpToAssignmentId === "0" ? true : false
  			let matchesFilter = false
  			let isValidJump = studentAssignmentAssign && studentAssignmentAssign.assignments && studentAssignmentAssign.assignments.length > 0 && studentAssignmentAssign.assignments.filter(j => j.assignmentId === jumpToAssignmentId)[0]
  			if (!isValidJump) { jumpToAssignmentId = null; foundJumpTo = true; }
  
  			studentAssignmentAssign && studentAssignmentAssign.assignments && studentAssignmentAssign.assignments.length > 0 && studentAssignmentAssign.assignments.forEach((m, i) => {
  					if (!foundJumpTo && m.assignmentId === jumpToAssignmentId) foundJumpTo = true
  					matchesFilter = !contentTypeId || contentTypeId === "0"
  					 		? true
  							: m.contentTypeId === contentTypeId
  									? true
  									: false
  
  					if (foundJumpTo && matchesFilter) {
  							headings.push({
  									verticalText: true,
  									label: <div className={styles.narrowLine}>
  														<div className={classes(styles.labelHead, (m.contentTypeName === 'Exam' ? styles.testColor : ''))}>{m.title && m.title.length > 35 ? m.title.substring(0,35) + '...' : m.title}</div>
  														<div className={classes(styles.row, styles.labelSubhead)}>
  																points:<div className={styles.lineSub}>{m.totalPoints}</div>
  																{m.dueDate && <div className={classes(styles.labelSubhead, styles.moreLeft)}>{`due:`}</div>}
  																{m.dueDate && <div className={styles.lineSub}><DateMoment date={m.dueDate} format={'D MMM'}/></div>}
  														</div>
  												</div>,
  									reactHint:  m.title + '  (points: ' + m.totalPoints + ')  ' + (m.dueDate ? '[due: ' + moment(m.dueDate).format('D MMM') + ']' : '')
  							})
  					}
  			})
  
  			let students = []
  			if (studentAssignmentAssign && studentAssignmentAssign.students && studentAssignmentAssign.students.length > 0)
  					students = doSort(studentAssignmentAssign.students, { sortField: studentAssignmentAssign.studentNameOrder === 'FIRSTNAME' ? 'firstName' : 'lastName', isAsc: true, isNumber: false })
  
  			students.forEach((m, i) => {
  					let row = [{
  						cellColor: i === 0 ? 'white' : '',
  						value: <div className={styles.spaceHeight}>
  											 <div className={styles.row}>
  													 <Link to={'/studentProfile/' + m.personId}><Icon pathName={'info'} className={styles.icon}/></Link>
  													 <Link to={'/studentSchedule/' + m.personId}><Icon pathName={'clock3'} premium={true} className={styles.icon}/></Link>
  													 <div onClick={() => sendToStudentSchedule(m.personId)} className={classes(styles.link, styles.row)}>
  													 		{studentAssignmentAssign.studentNameOrder === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName}
  															{m.accredited && <Icon pathName={'shield_check'} premium={true} className={styles.iconSmall}/>}
  													</div>
  											 </div>
  									 </div>
  					}]
  
  					if (isValidJump) foundJumpTo = false
  
  					studentAssignmentAssign && studentAssignmentAssign.assignments && studentAssignmentAssign.assignments.length > 0 && studentAssignmentAssign.assignments.forEach(s => {
  							if (!foundJumpTo && s.assignmentId === jumpToAssignmentId) foundJumpTo = true
  							matchesFilter = !contentTypeId || contentTypeId === "0"
  							 		? true
  									: s.contentTypeId === contentTypeId
  											? true
  											: false
  
  							if (foundJumpTo && matchesFilter) {
  									row.push({
  											reactHint: s.title,
  											value: <div className={styles.spaceHeight}>
  																<Checkbox
  																		checked={isChecked(m.personId, s.assignmentId) || ''}
  																		onClick={() => toggleCheckbox(m.personId, s.assignmentId)}
  																		checkboxClass={styles.checkbox}/>
  														 </div>
  									})
  							}
  					})
  
  					data.push(row)
  			})
  
        return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                	<L p={p} t={`Student Assignments Assigned`}/>
              </div>
              <div className={styles.formLeft}>
  								<div className={styles.row}>
  										<div>
  												<SelectSingleDropDown
  														id={`schoolYearId`}
  														label={<L p={p} t={`School year`}/>}
  														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
  														options={schoolYears}
  														height={`medium`}
  														onChange={handleUpdateSchoolYear}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`intervalId`}
  														label={<L p={p} t={`Interval`}/>}
  														value={personConfig.intervalId || companyConfig.intervalId}
  														options={intervals}
  														noBlank={true}
  														height={`medium`}
  														onChange={handleUpdateInterval}/>
  										</div>
  								</div>
  								<div>
  		                <SelectSingleDropDown
  		                    id={`courseScheduledId`}
  		                    name={`courseScheduledId`}
  		                    label={<L p={p} t={`Course`}/>}
  		                    value={courseScheduledId || ''}
  		                    options={courses}
  		                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  		                    height={`medium`}
  		                    noBlank={false}
  		                    onChange={recallPage} />
  								</div>
  
  								{!(fullAssignmentList && fullAssignmentList.length > 0) && (accessRoles.admin || accessRoles.facilitator) &&
  										<div className={styles.positionIconLink}>
  												<Link to={'/assignmentList/' + courseEntryId} className={classes(styles.row, styles.link)}>
  														<Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
  														<L p={p} t={`Create or modify assignments`}/>
  												</Link>
  										</div>
  								}
  								{fullAssignmentList && fullAssignmentList.length > 0 &&
  										<div className={styles.rowWrap}>
  												{/*<div>
  														<SelectSingleDropDown
  						                    id={`jumpToAssignmentId`}
  						                    label={`Jump to:`}
  						                    value={jumpToAssignmentId || ''}
  						                    options={studentAssignmentAssign && studentAssignmentAssign.assignments}
  						                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  						                    height={`medium`}
  						                    onChange={recallPageWithJump} />
  												</div>*/}
  												<div>
  														<SelectSingleDropDown
  																id={`contentTypeId`}
  																name={`contentTypeId`}
  																label={<L p={p} t={`Assignment types`}/>}
  																value={contentTypeId || ''}
  																options={contentTypes}
  																className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  																height={`medium`}
  																onChange={changeFilters} />
  												</div>
  										</div>
  								}
                  <div className={styles.topMargin}>
  										{/*<Loading loadingText={`Loading`} isLoading={fetchingRecord && fetchingRecord.studentAssignmentAssign} />*/}
                      {fullAssignmentList && fullAssignmentList.length > 0 && courseScheduledId !== "0" &&
  												<EditTableFreezeLeft labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}
  														firstColumnClass={styles.firstColumnClass}/>
  										}
                  </div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Assignments Assign`}/>} path={'studentAssignmentAssign'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={assignmentName}
  									 explain={instructions} onClick={handleInstructionsClose} />
  						}
          </div>
      )
}

export default withAlert(StudentAssignmentAssignView)


//See line 315: maxNumber={Number(s.totalPoints || 0) + Number(s.extraCredit || 0)}

//See <input where I took this out.  I can't remember what it was used for, but it is causing an error. Oh, it was for the teacher to make a response to homework when there is not a homework response to start with from the student.
//onDoubleClick={(accessRoles.admin || accessRoles.facilitator) ? () => this.handleAddOrUpdateOpen(s.assignmentId, null, m) : () => {}}
