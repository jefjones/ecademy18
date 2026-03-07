import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './StudentScheduleView.css'
const p = 'StudentScheduleView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import EditTable from '../../components/EditTable'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import FinanceCourseFeeStudentModal from '../../components/FinanceCourseFeeStudentModal'
import DateMoment from '../../components/DateMoment'
import Icon from '../../components/Icon'
import Checkbox from '../../components/Checkbox'
import InputDataList from '../../components/InputDataList'
import ManheimStudentSchedule from '../../components/ManheimStudentSchedule'
import OneFJefFooter from '../../components/OneFJefFooter'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import { withAlert } from 'react-alert'
import ReactToPrint from "react-to-print"
import {guidEmpty} from '../../utils/guidValidate'

function StudentScheduleView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_noStudent, setIsShowingModal_noStudent] = useState(false)
  const [scheduleAssignByMathId, setScheduleAssignByMathId] = useState('')
  const [intervalId, setIntervalId] = useState(props.personConfig.intervalId || props.companyConfig.intervalId)
  const [hideSearch, setHideSearch] = useState(true)
  const [schoolYearId, setSchoolYearId] = useState(props.personConfig.schoolYearId || props.companyConfig.schoolYearId)
  const [sortByHeadings, setSortByHeadings] = useState({sortField: 'courseName', isAsc: true, isNumber: false})
  const [isAsc, setIsAsc] = useState(true)
  const [isNumber, setIsNumber] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const [hideMoreClasses, setHideMoreClasses] = useState(!this.state.hideMoreClasses)
  const [isShowingModal_finalizeGrades, setIsShowingModal_finalizeGrades] = useState(true)
  const [isShowingModal_billings, setIsShowingModal_billings] = useState(true)
  const [financeBillings, setFinanceBillings] = useState([])
  const [courseScheduledId, setCourseScheduledId] = useState('')
  const [isShowingModal_notAccredited, setIsShowingModal_notAccredited] = useState(true)
  const [isShowingModal_addCourse, setIsShowingModal_addCourse] = useState(true)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(target.value)

  const {me, personId, studentSchedule, accessRoles, students, mathNames, fetchingRecord, companyConfig={}, studentAssignmentsInit,
  							removeStudentCourseAssign, intervals, personConfig, learningPathways, courseTypes, classPeriods, studentFirstName, studentLastName,
  							facilitators, openRegistration, schoolYears, myFrequentPlaces, setMyFrequentPlace, scheduledCourses} = props
  
  			let student = (students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]) || {}
  			let interval = intervalId && intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === intervalId)[0]
  			let intervalName = interval && interval.name
  			let schoolYear = schoolYearId && schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === schoolYearId)[0]
  			let schoolYearName = schoolYear && schoolYear.label
        let localScheduledCourses = scheduledCourses
        let scheduledData = studentSchedule
  
        scheduledData = scheduledData && scheduledData.length > 0 && scheduledData.filter(m => {
            let isFound = false
            m.assignedIntervals && m.assignedIntervals.length > 0 && m.assignedIntervals.forEach(id => {
                if (id === personConfig.intervalId) isFound = true
            })
            return isFound
        })
  
  			//Scheduled headings and Data
  			let scheduledHeadings = [{},
  					{label: '', tightText:true},
  					{label: <L p={p} t={`Name`}/>, tightText:true},
  			]
  
  			if (companyConfig.urlcode !== 'Manheim' && accessRoles.admin) scheduledHeadings.push({label: 'Accredited', tightText:true, className: styles.radioClass})
  
  			scheduledHeadings = scheduledHeadings.concat([
  					{label: <L p={p} t={`Type`}/>, tightText:true},
  					{label: <L p={p} t={`Interval`}/>, tightText:true},
  					{label: <L p={p} t={`Class period`}/>, tightText:true},
  					{label: <L p={p} t={`Teacher`}/>, tightText:true},
  					{label: <L p={p} t={`Location`}/>, tightText:true},
  					// {label: <L p={p} t={`Campus`}/>, tightText:true},
  					// {label: <L p={p} t={`Online`}/>, tightText:true},
  					// {label: <L p={p} t={`Self-paced`}/>, tightText:true},
  					{label: <L p={p} t={`Weekdays`}/>, tightText:true},
  					{label: <L p={p} t={`Start time`}/>, tightText:true},
  					{label: <L p={p} t={`Duration`}/>, tightText:true},
  					{label: <L p={p} t={`Date range`}/>, tightText:true},
  			])
  
  			scheduledData = scheduledData && scheduledData.length > 0 && scheduledData.map((m, i) => {
            let hasFacilitatorAccess = false
            m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
                if (t.id === personId) hasFacilitatorAccess = true
            })
  
  					let row = [
  							{ value: setIcons(m)},
  							{ value: m.courseName === 'Seminary'
  													? ''
  													: !accessRoles.facilitator || (accessRoles.facilitator && hasFacilitatorAccess)
  															? <a onClick={() => {navigate('/studentAssignments/' + m.courseScheduledId + '/' + m.studentPersonId); studentAssignmentsInit(personId, m.studentPersonId, m.courseScheduledId);}} className={styles.link}>
                                      {m.overallGrade || ''}
                                  </a>
  															: m.overallGrade || ''
  							},
  							{ value: !accessRoles.facilitator || (accessRoles.facilitator && hasFacilitatorAccess)
                            ? <div className={globalStyles.link} onClick={() => {navigate('/studentAssignments/' + m.courseScheduledId + '/' + m.studentPersonId); studentAssignmentsInit(personId, m.studentPersonId, m.courseScheduledId);}}>
                                  {m.courseName}
                              </div>
                            : m.courseName
                }
  					]
  
  					if (companyConfig.urlcode !== 'Manheim' && accessRoles.admin)
  							row.push({value: m.courseName !== 'Seminary' &&
                                <Checkbox id={m.learnerCourseAssignId} key={i} label={''} checked={m.courseAssignAccredited || false}
                                    onClick={m.courseAssignAccredited || m.studentAccredited ? () => toggleAccredited(m.learnerCourseAssignId, i, m.courseAssignAccredited) : handleNotAccreditedOpen} />
                })
  
  					row = row.concat([
  							{ value: m.courseTypeName},
  							{ value: <div>
                            {accessRoles.admin
                                ? m.intervals && m.intervals.length > 0 && m.intervals.map((i, index) =>
                                    <Checkbox key={index}
                                        id={'intervalId'}
                                        name={'intervalId'}
                                        label={i.name}
                                        checked={m.assignedIntervals.indexOf(i.intervalId) > -1 || false}
                                        checkboxClass={styles.checkbox}
                                        onClick={() => handleToggleInterval(m.courseScheduledId, i.intervalId)}/>
                                  )
                                : m.assignedIntervals && m.assignedIntervals.length > 0 && m.assignedIntervals.map((id, index) => {
                                    let interval = m.intervals && m.intervals.length > 0 && m.intervals.filter(i => i.intervalId === id)[0]
                                    let intervalName = interval && interval.name ? interval.name : ''
                                    return <div key={index} className={styles.text}>{intervalName}</div>
                                  })
                              }
                          </div>
                },
  							{ value: m.classPeriodName},
  							{ value: m.teachers && m.teachers.length > 0 && m.teachers.reduce((acc, t) => acc += acc ? ', ' + t.label : t.label, '')},
  							{ value: m.location},
  							{ value: m.weekdaysText},
  							{ value: m.startTimeText},
  							{ value: m.durationText && m.durationText.indexOf('null') > -1 ? '' : m.durationText},
  							{ value: m.dateRangeText},
  					])
  					return row
  			})
  
  			//***************  the new course assign data and header
  			if (localScheduledCourses && localScheduledCourses.length > 0 ) {
  					if (intervalId) {
  							localScheduledCourses = localScheduledCourses.reduce((acc, m) => {
  									let hasInterval = m.intervals && m.intervals.length > 0 && m.intervals.filter(f => f.intervalId === intervalId)[0]
  									if (hasInterval && hasInterval.intervalId) {
  											acc = acc && acc.length > 0 ? acc.concat(m) : [m]
  									}
  									return acc
  								},
  							[])
  					}
  					if (localScheduledCourses && localScheduledCourses.length > 0) {
  							if (learningPathwayId) {
  									localScheduledCourses = localScheduledCourses.filter(m => m.learningPathwayId === learningPathwayId)
  							}
  							if (courseTypeId) {
  									localScheduledCourses = localScheduledCourses.filter(m => m.courseTypeId === courseTypeId)
  							}
  							if (classPeriodId) {
  									localScheduledCourses = localScheduledCourses.filter(m => m.classPeriodId === classPeriodId)
  							}
  							if (!!facilitatorPersonId && facilitatorPersonId !== guidEmpty) {
  									localScheduledCourses = localScheduledCourses.filter(m => {
  											let found = false
  											m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
  													if (t.id === facilitatorPersonId) found = true
  											})
  											return found
  									})
  
  							}
  					}
  			}
  
  			//new Course data and headings
  			localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.map(m => {
  					m.icons =	<a onClick={() => {handleNewCourseAssignOpen(m.courseScheduledId); chooseRecord(m.courseScheduledId)} }>
  												<Icon pathName={'clock3'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuperAdd} superScriptClass={styles.superScriptAdd}/>
  										</a>
  					m.name = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  											{m.courseName}
  									 </div>
  					m.type = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
    										{m.courseTypeName}
    									</div>
  					m.openSeats = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  													{m.maxSeats}
  												</div>
  					m.period = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  												{m.classPeriodName}
  											</div>
  					m.start = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  											<DateMoment date={m.startTime} timeOnly={true}/>
  										</div>
  					m.teacher = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  												{m.teachers && m.teachers.length > 0 && m.teachers.reduce((acc, t) => acc += acc ? ', ' + t.label : t.label, '')}
  											</div>
            m.teacherSort = m.teachers && m.teachers.length > 0 && m.teachers.reduce((acc, t) => acc += acc ? ', ' + t.label : t.label, '')
  					m.roomLocation = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  															{m.location}
  														</div>
  					m.interval = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  													{m.intervalName}
  												</div>
  					m.weekdays = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  													{m.weekdaysText}
  											 </div>
  					m.durationTime = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  															{m.duration && m.duration + ' min'}
  														</div>
  					m.from = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  											<DateMoment date={m.fromDate} format={'D MMM'}/>
  									 </div>
  					m.to = <div className={classes(globalStyles.cellText, (m.courseScheduledId === courseScheduledId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.courseScheduledId)}>
  										<DateMoment date={m.toDate} format={'D MMM'}/>
  								</div>
            return m
  			})
  
        if (sortByHeadings && sortByHeadings.sortField) {
            localScheduledCourses = doSort(localScheduledCourses, sortByHeadings)
        }
  
        let newCourseHeadings = [
            {
            	width: 60,
            	label: '',
            	dataKey: 'icons',
            },
            {
            	width: 320,
            	label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('courseName')}><L p={p} t={`Name`}/></div>,
            	dataKey: 'name',
            },
            {
            	width: 110,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('courseTypeName')}><L p={p} t={`Type`}/></div>,
            	dataKey: 'type',
            },
              // {
              // 	width: 90,
              // 	label: 'Seats used',
              // 	dataKey: 'seatsUsed',
              // },
            {
            	width: 90,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('maxSeats')}><L p={p} t={`Open seats`}/></div>,
            	dataKey: 'openSeats',
            },
            {
            	width: 90,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('classPeriodName')}><L p={p} t={`Period`}/></div>,
            	dataKey: 'period',
            },
            {
            	width: 120,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('startTime')}><L p={p} t={`Start time`}/></div>,
            	dataKey: 'start',
            },
            {
            	width: 280,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('teacherSort')}><L p={p} t={`Teacher`}/></div>,
            	dataKey: 'teacher',
            },
            {
            	width: 90,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('location')}><L p={p} t={`Location`}/></div>,
            	dataKey: 'roomLocation',
            },
            {
            	width: 120,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('intervalName')}><L p={p} t={`Interval`}/></div>,
            	dataKey: 'interval',
            },
            {
            	width: 120,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('weekdaysText')}><L p={p} t={`Weekdays`}/></div>,
            	dataKey: 'weekdays',
            },
            {
            	width: 90,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('duration')}><L p={p} t={`Duration`}/></div>,
            	dataKey: 'durationTime',
            },
            {
            	width: 120,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('fromDate')}><L p={p} t={`From`}/></div>,
            	dataKey: 'from',
            },
            {
            	width: 120,
              label: <div className={classes(globalStyles.link, globalStyles.cellText)} onClick={() => resort('toDate')}><L p={p} t={`To`}/></div>,
            	dataKey: 'to',
            },
  			]
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
                    	{`Student's Schedule`}
                  </div>
  								<div className={styles.row}>
  										{/*<div>
  												<SelectSingleDropDown
  														id={`schoolYearId`}
  														label={<L p={p} t={`School year`}/>}
  														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
  														options={schoolYears}
  														height={`medium`}
  														onChange={handleUpdateSchoolYear}/>
  										</div>*/}
  										<div className={styles.printPosition}>
  												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  										</div>
  										<div className={styles.printPosition}>
  												<Link to={`/studentScheduleWeek/${studentPersonId}`} className={classes(globalStyles.link, styles.row)}>
  														<Icon pathName={'clock3'} premium={true} className={styles.iconInline}/>
  														<L p={p} t={`Go to schedule week view`}/>
  												</Link>
  										</div>
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
  								<div>
  										<InputDataList
  												name={`studentPersonId`}
  												label={<L p={p} t={`Student`}/>}
  												value={student}
  												options={students}
  												height={`medium`}
  												className={styles.inputPosition}
  												onChange={changeStudent}/>
  								</div>
  								{accessRoles.admin && student.studentType === "ACADEMY" && !(localScheduledCourses && localScheduledCourses.length > 0) &&
  										<div>
  												<div className={styles.row}>
  														<div>
  								                <SelectSingleDropDown
  								                    id={'mathName'}
  								                    value={scheduleAssignByMathId}
  								                    label={<L p={p} t={`Math Name Schedule`}/>}
  								                    options={mathNames}
  								                    height={`medium`}
  								                    className={styles.singleDropDown}
  								                    onChange={setMathScheduleId}/>
  														</div>
  														<ButtonWithIcon label={scheduledData && scheduledData.length > 1 ? <L p={p} t={` Reset `}/> : <L p={p} t={` Set `}/>} icon={'checkmark_circle'} onClick={setStudentMathSchedule}/>
  						            </div>
  										</div>
  								}
  								{companyConfig.urlcode === 'Manheim' && accessRoles.admin &&
  										<div className={classes(styles.row, styles.moreTop)}>
  												<a onClick={() => navigate('/studentProfile/' + studentPersonId)} className={classes(styles.row, styles.addNew)}>
  														<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
  														<L p={p} t={`Log in as this student to change class schedule`}/>
  												</a>
  										</div>
  								}
  								{companyConfig.urlcode !== 'Manheim' && studentPersonId && studentPersonId !== "0" &&
  										<div ref={el => (componentRef = el)} >
  												<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
  														{(studentFirstName || student.firstName) &&
  																<div className={styles.row}>
  																		<div className={styles.textRight}><L p={p} t={`Schedule for`}/></div>
  																		<div className={styles.boldText}>{`${studentFirstName || student.firstName} ${studentLastName || student.lastName}`}</div>
  																		<div className={styles.textLeft}>{`(${intervalName} ${schoolYearName})`}</div>
  																</div>
  														}
  												</div>
  												{studentSchedule && studentSchedule.length > 0 &&
    														<div className={classes(styles.positionTop, styles.label, styles.row)}>
  																<L p={p} t={`Accredited:`}/>
  																<div className={styles.labelBold}>{studentSchedule[0].studentAccredited ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>}</div>
  														</div>
  												}
  												<div className={styles.horizScroll}>
  														<EditTable labelClass={styles.tableLabelClass} headings={scheduledHeadings} data={scheduledData} noCount={true}
  																isFetchingRecord={fetchingRecord.studentSchedule} />
  														<div className={styles.farFromleft}>
  																<button className={classes(styles.positionRelative, styles.submitButton)} onClick={() => navigate('/firstNav')}><L p={p} t={` Close `}/></button>
  														</div>
  												</div>
  										</div>
  								}
  								{companyConfig.urlcode === 'Manheim' &&
  										<div className={styles.moreTop}>
  												<ManheimStudentSchedule studentSchedule={studentSchedule} removeStudentCourseAssign={removeStudentCourseAssign}
  														personId={personId} schoolYearId={schoolYearId || 10} openRegistration={openRegistration} me={me}/>
  										</div>
  								}
                  {companyConfig.urlcode !== 'Manheim' && studentFirstName &&
                      <div onClick={handleFinalizeGradesOpen} className={classes(styles.row, globalStyles.link)}>
                          <Icon pathName={'medal_empty'} className={styles.icon} premium={true}/>
                          <L p={p} t={`Refinalize students' grades?`}/>
                      </div>
                  }
  								{companyConfig.urlcode !== 'Manheim' && accessRoles.admin && studentPersonId && studentPersonId !== "0" &&
  										<div>
  												<hr/>
  												<a onClick={toggleHideMoreClasses} className={classes(styles.row, styles.link, styles.moreLeft)}>
  														<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  														{hideMoreClasses ? <L p={p} t={`Hide classes to add to this student's schedule`}/> : <L p={p} t={`Show classes to add to this student's schedule`}/>}
  												</a>
  												{hideMoreClasses &&
  														<div>
  																<div className={classes(styles.rowWrap, styles.headerLabel)}>
  																		<L p={p} t={`Available Courses`}/>
  																		<a onClick={toggleHideSearch} className={classes(styles.row, styles.link, styles.moreLeft)}>
  																				<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  																				{hideSearch ? <L p={p} t={`Show search options`}/> : <L p={p} t={`Hide search options`}/>}
  																		</a>
  																</div>
  																{!hideSearch &&
  																		<div>
  																				<div className={classes(styles.rowWrap, styles.headerLabel)}>
  																						<L p={p} t={`Search options`}/>
  																				</div>
  																				<div className={classes(styles.rowWrap, styles.grayBack)}>
  																						<div>
  																								<SelectSingleDropDown
  																										id={`learningPathwayId`}
  																										label={<L p={p} t={`Subject/Discipline`}/>}
  																										value={learningPathwayId || ''}
  																										options={learningPathways}
  																										height={`medium`}
  																										onChange={changeItem}/>
  																						</div>
  																						<div>
  																								<SelectSingleDropDown
  																										id={`courseTypeId`}
  																										label={<L p={p} t={`Course Type`}/>}
  																										value={courseTypeId || ''}
  																										options={courseTypes}
  																										height={`medium`}
  																										onChange={changeItem}/>
  																						</div>
  																						<div>
  																								<SelectSingleDropDown
  																										id={`classPeriodId`}
  																										label={companyConfig.urlcode === 'Manheim' ? 'Block' : <L p={p} t={`Class Period`}/>}
  																										value={classPeriodId || ''}
  																										options={classPeriods}
  																										height={`medium`}
  																										onChange={changeItem}/>
  																						</div>
  																						<div>
  																								<SelectSingleDropDown
  																										id={`facilitatorPersonId`}
  																										label={<L p={p} t={`Teacher`}/>}
  																										value={facilitatorPersonId || ''}
  																										options={facilitators}
  																										height={`medium`}
  																										onChange={changeItem}/>
  																						</div>
  																				</div>
  																		</div>
  																}
                                  <Loading isLoading={fetchingRecord.baseCourses && studentPersonId} />
              										<Paper style={{ height: 400, width: '1060px', marginTop: '8px' }}>
              												<TableVirtualFast rowCount={(localScheduledCourses && localScheduledCourses.length) || 0}
              														rowGetter={({ index }) => (localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses[index]) || ''}
              														columns={newCourseHeadings} />
              										</Paper>
  														</div>
  												}
  										</div>
  								}
  						</div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Schedule`}/>} path={'studentSchedule'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
          		<OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveCourseAssignClose} heading={<L p={p} t={`Remove this course from this schedule?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this course from this student's schedule?`}/>} isConfirmType={true}
                     onClick={handleRemoveCourseAssign} />
              }
  						{isShowingModal_noStudent &&
                  <MessageModal handleClose={handleNoStudentClose} heading={<L p={p} t={`No student chosen`}/>}
                     explainJSX={<L p={p} t={`Please choose a student before adding a class.`}/>}
                     onClick={handleNoStudentClose} />
              }
  						{isShowingModal_addCourse &&
                  <MessageModal handleClose={handleNewCourseAssignClose} heading={<L p={p} t={`Add Course to Schedule?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to add this course to this student's schedule?`}/>} isConfirmType={true}
                     onClick={handleNewCourseAssign} />
              }
              {isShowingModal_finalizeGrades &&
                  <MessageModal handleClose={handleFinalizeGradesClose} heading={<L p={p} t={`Finalize Grades for this Student's Schedule?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to refinalize the grades for this student's schedule?`}/>} isConfirmType={true}
                     onClick={handleFinalizeGrades} />
              }
              {isShowingModal_notAccredited &&
                  <MessageModal handleClose={handleNotAccreditedClose} heading={<L p={p} t={`This Student is not Accredited`}/>}
                     explainJSX={<L p={p} t={`The class cannot be checked as accredited if the student is not accredited`}/>}
                     onClick={handleNotAccreditedClose} />
              }
  						{isShowingModal_billings &&
                  <FinanceCourseFeeStudentModal financeBillings={financeBillings} onSubmit={handleFinanceBillingsRefund} handleClose={handleFinanceBillingsRefundClose}/>
              }
          </div>
      )
}

export default withAlert(StudentScheduleView)
