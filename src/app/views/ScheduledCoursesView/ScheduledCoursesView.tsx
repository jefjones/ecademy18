import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './ScheduledCoursesView.css'
const p = 'ScheduledCoursesView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import BaseCourseMenu from '../../components/BaseCourseMenu'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import StudentListModal from '../../components/StudentListModal'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import InputText from '../../components/InputText'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'

function ScheduledCoursesView(props) {
  const [isScheduledCourseContextOpen, setIsScheduledCourseContextOpen] = useState(false)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)
  const [isShowingModal_students, setIsShowingModal_students] = useState(false)
  const [outcomeList, setOutcomeList] = useState([])
  const [actionType, setActionType] = useState('')
  const [intervalId, setIntervalId] = useState(props.personConfig.intervalId)
  const [courseEntryId, setCourseEntryId] = useState('')
  const [courseTypeId, setCourseTypeId] = useState('')
  const [classPeriodId, setClassPeriodId] = useState('')
  const [facilitatorPersonId, setFacilitatorPersonId] = useState('')
  const [sortByHeadings, setSortByHeadings] = useState({
							sortField: '',
							isAsc: '',
							isNumber: ''
					})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')
  const [isInit, setIsInit] = useState(true)
  const [partialNameText, setPartialNameText] = useState(personConfig.choices['CoursePartialNameText'])
  const [learningPathwayId, setLearningPathwayId] = useState(personConfig.choices['CourseLearningPathwayId'])
  const [courseScheduledId, setCourseScheduledId] = useState(course.courseScheduledId)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(target.value)

  useEffect(() => {
    
    				document.body.addEventListener('keyup', checkEscapeKey)
    				setPersonConfig()
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {courseEntryId, courseScheduledId, personConfig} = props
    				if (!isInit && courseEntryId && courseScheduledId && personConfig && personConfig.personId) {
    						setIsInit(true); setCourseEntryId(courseEntryId); setCourseScheduledId(courseScheduledId); setPartialNameText(personConfig.choices['CoursePartialNameText']); setIntervalId(personConfig.choices['CourseIntervalId']); setCourseTypeId(personConfig.choices['CourseCourseTypeId']); setClassPeriodId(personConfig.choices['CourseClassPeriodId']); setFacilitatorPersonId(personConfig.choices['CourseFacilitatorPersonId']); setLearningPathwayId(personConfig.choices['CourseLearningPathwayId'])
    				}
    		
  }, [])

  const {personId, removeCourseToSchedule, companyConfig={}, courseTypes, classPeriods, facilitators, courseClipboard, personConfig={choices:[]},
  							intervals, accessRoles, schoolYears, learningPathways, myFrequentPlaces, setMyFrequentPlace, scheduledCourses, students,
  							fetchingRecord, setPersonConfigChoice, studentListByCourse, seatsStatistics } = props
        
  
  			let localScheduledCourses = scheduledCourses
  			if (localScheduledCourses && localScheduledCourses.length > 0 ) {
  					if (partialNameText) {
  							let cutBackTextFilter = partialNameText.toLowerCase()
  							//cutBackTextFilter = cutBackTextFilter && cutBackTextFilter.length > 15 ? cutBackTextFilter.substring(0,15) : cutBackTextFilter;
  							localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1))
  					}
  					if (intervalId && intervalId != 0) { //eslint-disable-line
  							localScheduledCourses = localScheduledCourses.reduce((acc, m) => {
  									let hasInterval = m.intervals.filter(f => f.intervalId === intervalId)[0]
  									if (hasInterval && hasInterval.intervalId) {
  											acc = acc && acc.length > 0 ? acc.concat(m) : [m]
  									}
  									return acc
  								},
  							[])
  					}
  					if (courseTypeId && courseTypeId != 0) { //eslint-disable-line
  							localScheduledCourses = localScheduledCourses.filter(m => m.courseTypeId === courseTypeId)
  					}
  					if (classPeriodId && classPeriodId != 0) { //eslint-disable-line
  							localScheduledCourses = localScheduledCourses.filter(m => m.classPeriodId === classPeriodId)
  					}
  					if (facilitatorPersonId && facilitatorPersonId !== guidEmpty && facilitatorPersonId != 0) { //eslint-disable-line
  							localScheduledCourses = localScheduledCourses.filter(m => {
  									let found = false
  									m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
  											if (t.id === facilitatorPersonId) found = true
  									})
  									return found
  							})
  					}
  					if (learningPathwayId && learningPathwayId !== guidEmpty && learningPathwayId != 0) { //eslint-disable-line
  							localScheduledCourses = localScheduledCourses.filter(m => m.learningPathwayId === learningPathwayId)
  					}
  
  					if (sortByHeadings && sortByHeadings.sortField) {
  							localScheduledCourses = doSort(localScheduledCourses, sortByHeadings)
  					}
  			}
  
  			let scheduledHeadings = [{},
  					{label: <L p={p} t={`Name`}/>, tightText:true, clickFunction: () => resort('courseName')},
  			]
  
  			if (companyConfig.urlcode === 'Liahona') {
  					scheduledHeadings.push({label: <L p={p} t={`Type`}/>, tightText:true, clickFunction: () => resort('courseTypeName')})
  			}
  			if (companyConfig.urlcode === 'Manheim') {
  					scheduledHeadings.push({label: <L p={p} t={`Code`}/>, tightText:true, clickFunction: () => resort('Code')})
  			}
  			if (companyConfig.urlcode === 'Manheim') {
  					scheduledHeadings.push({label: <L p={p} t={`Section`}/>, tightText:true, clickFunction: () => resort('section')})
  			}
  			scheduledHeadings = scheduledHeadings.concat([
  					{label: <L p={p} t={`Seats used`}/>, tightText:true},
  					{label: <L p={p} t={`Open seats`}/>, tightText:true, clickFunction: () => resort('maxSeats')},
  					{label: companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Block`}/>: <L p={p} t={`Period`}/>, tightText:true, clickFunction: () => resort('classPeriodName')},
  					{label: <L p={p} t={`Start time`}/>, tightText:true, clickFunction: () => resort('startTime')},
  					{label: <L p={p} t={`Teacher`}/>, tightText:true},
  					{label: <L p={p} t={`Location`}/>, tightText:true, clickFunction: () => resort('location')},
  			])
  			if (companyConfig.urlcode !== 'Liahona') {
  					scheduledHeadings.push({label: <L p={p} t={`Online`}/>, tightText:true, clickFunction: () => resort('onlineName')})
  			}
  			scheduledHeadings = scheduledHeadings.concat([
  					{label: <L p={p} t={`Interval`}/>, tightText:true, clickFunction: () => resort('intervalName')},
  					{label: <L p={p} t={`Weekdays`}/>, tightText:true, clickFunction: () => resort('weekdaysText')},
  					{label: <L p={p} t={`Duration`}/>, tightText:true, clickFunction: () => resort('duration')},
  					{label: <L p={p} t={`From`}/>, tightText:true, clickFunction: () => resort('fromDate')},
  					{label: <L p={p} t={`To`}/>, tightText:true, clickFunction: () => resort('toDate')},
  			])
  
  			// if (companyConfig.urlcode !== 'Liahona') {
  			// 		scheduledHeadings = scheduledHeadings.concat([
  			// 				{label: <L p={p} t={`Administrative where taught`}/>, tightText: true},
  			// 				{label: <L p={p} t={`School where taught`}/>, tightText: true},
  			// 				{label: <L p={p} t={`GPA`}/>, tightText: true},
  			// 				{label: <L p={p} t={`ClassRank`}/>, tightText: true},
  			// 				{label: <L p={p} t={`HonorRoll`}/>, tightText: true},
  			// 				{label: <L p={p} t={`Use course for lunch`}/>, tightText: true},
  			// 				{label: <L p={p} t={`Grade report`}/>, tightText: true},
  			// 				{label: <L p={p} t={`State reports`}/>, tightText: true},
  			// 				{label: <L p={p} t={`Granting credit college`}/>, tightText: true},
  			// 				{label: <L p={p} t={`Where taught campus`}/>, tightText: true},
  			// 				{label: <L p={p} t={`Instructional setting`}/>, tightText: true},
  			// 		]);
  			// }
  
  			let scheduledData = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.map(m => {
            let seats = seatsStatistics && seatsStatistics.length > 0 && seatsStatistics.filter(s => s.courseScheduledId === m.id)[0]
  
            let comma = ''
            let intervalCodes = m.intervals && m.intervals.length > 0 && m.intervals.reduce((acc, i) => {
                acc += comma + i.code
                comma = ', '
                return acc
            }, '')
  
  					let row = [
  								{value: setIcons(m), cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.courseName,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					]
  					if (companyConfig.urlcode === 'Liahona') {
  							row.push({ value: m.courseTypeName,
  								clickFunction: () => chooseRecord(m),
                  notShowLink: true,
  							  cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''})
  					}
  					if (companyConfig.urlcode === 'Manheim') {
  							row.push({ value: m.code,
  								clickFunction: () => chooseRecord(m),
                  notShowLink: true,
  								cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''})
  					}
  					if (companyConfig.urlcode === 'Manheim') {
  							row.push({ value: m.section,
  								clickFunction: () => chooseRecord(m),
                  notShowLink: true,
  								cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''})
  					}
  					row = row.concat([
                  { value: <a onClick={!(seats && seats.seatsTaken > 0) ? () => {} : () => handleStudentListOpen(m)} className={styles.link}>{(seats && seats.seatsTaken > 0) ? seats.seatsTaken : ''}</a>,
  										clickFunction: () => chooseRecord(m),
  										cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.maxSeats,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.classPeriodsMultiple && m.classPeriodsMultiple.length > 0 ? m.classPeriodsMultiple.join(',') : m.classPeriodName,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.startTime ? <DateMoment date={m.startTime} timeOnly={true}/> : '',
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.teachers && m.teachers.length > 0 && m.teachers.reduce((acc, t) => acc += acc ? ', ' + t.label : t.label, ''),
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.location,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					])
  					if (companyConfig.urlcode !== 'Liahona') {
  							row.push({ value: m.onlineName,
  								clickFunction: () => chooseRecord(m),
                  notShowLink: true,
  								cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''})
  					}
  					row = row.concat([
  								{ value: intervalCodes,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.weekdaysText,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: m.duration && m.duration + ' min',
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: <DateMoment date={m.fromDate} format={'D MMM'}/>,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  								{ value: <DateMoment date={m.toDate} format={'D MMM'}/>,
  									clickFunction: () => chooseRecord(m),
                    notShowLink: true,
  									cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					])
  
  					// if (companyConfig.urlcode !== 'Liahona') {
  					// 		row = row.concat([
  					// 				{ value: m.administrativeWhereTaught,
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.schoolWhereTaught,
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.excludeFromGPA ? 'Exclude' : 'Include',
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.excludeFromClassRank ? 'Exclude' : 'Include',
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.excludeFromHonorRoll ? 'Exclude' : 'Include',
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.useTheCourseForLunch ? 'Exclude' : 'Include',
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.excludeOnGradeReport ? 'Exclude' : 'Include',
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.excludeFromStateReports ? 'Exclude' : 'Include',
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.grantingCreditCollegeId,
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.whereTaughtCampus,
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 				{ value: m.instructionalSetting,
  					// 					clickFunction: () => chooseRecord(m),
  					// 					cellColor: m.courseScheduledId === courseScheduledId ? 'highlight' : ''},
  					// 		]);
  					//}
  					return row
  			})
  
        return (
          <div className={styles.container} id={'topContainer'}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
                    	<L p={p} t={`Course Sections`}/>
                  </div>
  								<div className={classes(styles.muchLeft, styles.rowWrap)}>
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
  														value={intervalId || ''}
  														options={intervals}
  														height={`medium`}
                              onChange={changeSearch}
  														onBlur={() => setPersonConfigChoice(personId, 'CourseIntervalId', event.target.value)}/>
  										</div>
  										<InputText
  												id={"partialNameText"}
  												name={"partialNameText"}
  												size={"medium"}
  												label={<L p={p} t={`Name search`}/>}
                          value={partialNameText || ''}
                          onChange={changeSearch}
  												onBlur={() => setPersonConfigChoice(personId, 'CoursePartialNameText', event.target.value)}/>
  										{companyConfig.urlcode !== 'Manheim' &&
  												<div>
  														<SelectSingleDropDown
  																id={`courseTypeId`}
  																label={<L p={p} t={`Course Type`}/>}
  																options={courseTypes}
  																height={`medium`}
                                  value={courseTypeId || ''}
                                  onChange={changeSearch}
          												onBlur={() => setPersonConfigChoice(personId, 'CourseCourseTypeId', event.target.value)}/>
  												</div>
  										}
  										<div>
  												<SelectSingleDropDown
  														id={`classPeriodId`}
  														label={companyConfig.urlcode === 'Manheim' ? 'Block' : <L p={p} t={`Class Period`}/>}
  														options={classPeriods}
  														height={`medium`}
                              value={classPeriodId || ''}
                              onChange={changeSearch}
                              onBlur={() => setPersonConfigChoice(personId, 'CourseClassPeriodId', event.target.value)}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`facilitatorPersonId`}
  														label={<L p={p} t={`Teachers`}/>}
  														options={facilitators || []}
  														height={`medium`}
                              value={facilitatorPersonId || ''}
                              onChange={changeSearch}
                              onBlur={() => setPersonConfigChoice(personId, 'CourseFacilitatorPersonId', event.target.value)}/>
  										</div>
  										<div className={styles.moreBottomMargin}>
  												<SelectSingleDropDown
  														id={`learningPathwayId`}
  														name={`learningPathwayId`}
  														label={companyConfig.urlcode === 'Manheim' ? `Content Area` : <L p={p} t={`Subject/Discipline`}/>}
  														options={learningPathways || []}
  														height={`medium`}
                              value={learningPathwayId || ''}
                              onChange={changeSearch}
                              onBlur={() => setPersonConfigChoice(personId, 'CourseLearningPathwayId', event.target.value)}/>
  										</div>
  								</div>
  								<div className={classes(styles.row, styles.moreLeft, styles.littleTop)}>
  										<div className={styles.filterLabel}>{`Count: ${scheduledData.length > 0 && !!scheduledData[0][0].value ? scheduledData.length : 0}`}</div>
                      <a onClick={handleResetFilter} className={classes(styles.row, styles.link, styles.muchLeft)}>
  												<Icon pathName={'flashlight'} premium={true} className={styles.iconSmall}/>
  												<L p={p} t={`Clear search`}/>
  										</a>
  										<a onClick={handleResetClipboard} className={classes(styles.row, styles.link, styles.muchLeft)}>
  												<Icon pathName={'sync'} premium={true} className={styles.iconSmall}/>
  												<L p={p} t={`Clear clipboard`}/>
  												<div className={styles.count}>{(courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length) || 0}</div>
  										</a>
  										{accessRoles.admin &&
  												<Link to={'/learnerCourseAssign'} className={classes(styles.row, styles.link, styles.muchLeft)}>
  														<Icon pathName={'clock3'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuper} superScriptClass={styles.superScript}/><L p={p} t={`Go to Course Assign`}/>
  												</Link>
  										}
                      {/*accessRoles.admin &&  //I think that this would be confusing here since the user could be thinking that they need to create a new base course when it might already exist.
  												<a onClick={() => navigate('/courseEntry')} className={classes(styles.row, styles.addNew, styles.moreTop)}>
  						                <Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
  						                {'Create a new course'}
  						            </a>
  										*/}
  								</div>
  								<div className={styles.widthStop}>
  										{localScheduledCourses && localScheduledCourses.length > 0 && accessRoles.admin &&
  												<BaseCourseMenu personId={personId} removeRecord={removeCourseToSchedule} courseName={courseName} actionType={"SCHEDULEDCOURSE"}
  														hideContextCourseActionMenu={hideContextCourseActionMenu} courseDuplicate={handleDuplicateCourse}
  														id={courseScheduledId} courseEntryId={courseEntryId} courseScheduledId={courseScheduledId} hideMenu={hideContextScheduledCourseMenu}
  														scheduledCourses={localScheduledCourses} isAdmin={accessRoles.admin}
  														addToClipboard={handleSingleAddToClipboard} courseClipboard={courseClipboard}
  														singleRemoveCourseClipboard={handleRemoveSingleCourseClipboard} companyConfig={companyConfig}/>
  										}
  										<div className={styles.instructions}>
  												<L p={p} t={`If you don't see a course listed below that you are expecting, it could be on a different semester.  Change the semester choice above.`}/>
  										</div>
  										<div className={styles.scrollable}>
  												<EditTable labelClass={classes(styles.tableLabelClass, styles.moreBottomMargin)} headings={scheduledHeadings} data={scheduledData}
  														noCount={true} isFetchingRecord={fetchingRecord.scheduledCourses}/>
  										</div>
  								</div>
  						</div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Scheduled Courses (sections)`}/>} path={'scheduledCourses'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
          		<OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this course from the schedule?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this course from the schedule?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_students &&
  								<StudentListModal handleClose={handleStudentListClose} course={course} students={students} studentList={studentListByCourse}
  										courseScheduledId={courseScheduledId}/>
  						}
          </div>
      )
}

export default withAlert(ScheduledCoursesView)
