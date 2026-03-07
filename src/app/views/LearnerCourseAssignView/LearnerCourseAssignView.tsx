import { useState } from 'react'
import * as styles from './LearnerCourseAssignView.css'
const p = 'LearnerCourseAssignView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import StudentClipboard from '../../components/StudentClipboard'
import CourseClipboard from '../../components/CourseClipboard'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import moment from 'moment'
import { withAlert } from 'react-alert'

function LearnerCourseAssignView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isRecordComplete, setIsRecordComplete] = useState(false)
  const [errorCourse, setErrorCourse] = useState('')
  const [errorLearner, setErrorLearner] = useState('')
  const [conflicts, setConflicts] = useState('')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [selectedCourses, setSelectedCourses] = useState([])
  const [assign, setAssign] = useState({
                learners: props.personal ? [[{id: props.personId}]] : props.params && props.params.studentPersonId ? [[{id: props.params.studentPersonId}]] : [],
                courses: [],
            })
  const [learners, setLearners] = useState(props.personal ? [[{id: props.personId}]] : props.params && props.params.studentPersonId ? [[{id: props.params.studentPersonId}]] : [])
  const [courses, setCourses] = useState([])
  const [calendarConflicts, setCalendarConflicts] = useState([])
  const [filters, setFilters] = useState({
								birthDateFrom: '',
								birthDateTo: '',
								courseScheduledId: '',
								learningPathwayId: '',
								selectedLearnerOutcomeTargets: '',
								loProficient: '',
								loInProgress: '',
								loNotStarted: '',
								learningFocusAreaId: '',
								facilitatorPersonId: '',
								mentorPersonId: '',
								selectedGradeLevels: [],
						})
  const [birthDateFrom, setBirthDateFrom] = useState('')
  const [birthDateTo, setBirthDateTo] = useState('')
  const [courseScheduledId, setCourseScheduledId] = useState('')
  const [learningPathwayId, setLearningPathwayId] = useState('')
  const [selectedLearnerOutcomeTargets, setSelectedLearnerOutcomeTargets] = useState('')
  const [loProficient, setLoProficient] = useState('')
  const [loInProgress, setLoInProgress] = useState('')
  const [loNotStarted, setLoNotStarted] = useState('')
  const [learningFocusAreaId, setLearningFocusAreaId] = useState('')
  const [facilitatorPersonId, setFacilitatorPersonId] = useState('')
  const [mentorPersonId, setMentorPersonId] = useState('')
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])
  const [errorLearners, setErrorLearners] = useState(<L p={p} t={`At least one student is required`}/>)
  const [p, setP] = useState(undefined)
  const [errorCourses, setErrorCourses] = useState(<L p={p} t={`At least one course is required`}/>)

  const {personId, timeTarget, personal, companyConfig={}, accessRoles, gradeLevels, clipboardStudents, clipboardCourses,
  							courseListType, setStudentsSelected, removeAllCourseClipboard, myFrequentPlaces, setMyFrequentPlace, fetchingRecord,
  							getStudentSchedule } = props
        
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom, styles.row)}>
                      {companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)
  												? <L p={p} t={`Recommend Courses to Students`}/>
  												: <L p={p} t={`Assign Courses to Students`}/>
  										}
  										<Link to={`/studentSchedule/0`} className={classes(styles.row, styles.text, styles.moreLeft, styles.white)}>
  												<Icon pathName={'clock3'} premium={true} className={styles.icon} fillColor={'white'}/>
  												<L p={p} t={`See a student's schedule`}/>
  										</Link>
                  </div>
  								<div className={classes(globalStyles.instructionsBigger, styles.instructionWidth)}>
  										<L p={p} t={`Instructions: This page contains two separate clipboards.`}/>&nbsp
  										<L p={p} t={`One for students and one for courses.`}/>&nbsp
  										<L p={p} t={`Click on 'Choose students' to go to the student list to select one or more students.`}/>&nbsp
  										<L p={p} t={`Then go to the course list page to select courses.`}/>&nbsp
  										<L p={p} t={`Those two selections are gathered on this page to allow you to assign many students to many courses at one time.`}/>&nbsp
  								</div>
                  {((!timeTarget && !personal && !studentPersonId) || accessRoles.admin) &&
                    <div>
                      <div className={styles.classification}>{`Students`}</div>
                      <span className={styles.error}>{errorLearners}</span>
  										<StudentClipboard students={clipboardStudents} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
  												setStudentsSelected={setStudentsSelected} hideIcons={true} personId={personId} emptyMessage={<L p={p} t={`No students chosen`}/>}
  												includeRemoveClipboardIcon={false} singleRemoveFromClipboard={handleRemoveSingleStudentClipboard}
  												removeAllUserPersonClipboard={handleRemoveAllStudents} isFetchingRecord={fetchingRecord.studentClipboard}
  												getStudentSchedule={getStudentSchedule}/>
                      <hr />
                    </div>
                  }
                  <div className={styles.classification}>{'Courses'}</div>
                  <span className={styles.error}>{errorCourses}</span>
  								<CourseClipboard courses={clipboardCourses} companyConfig={companyConfig} courseListType={courseListType}
  										hideIcons={true} personId={personId} emptyMessage={<L p={p} t={`No courses chosen`}/>} accessRoles={accessRoles}
  										includeRemoveClipboardIcon={false} singleRemove={handleRemoveSingleCourseClipboard}
  										removeAllCourseClipboard={removeAllCourseClipboard} isFetchingRecord={fetchingRecord.courseClipboard}/>
                  <hr />
                  <div className={classes(styles.rowRight)}>
  										<div className={styles.cancelLink} onClick={() => navigate('/firstNav')}>
  												<L p={p} t={`Close`}/>
  										</div>
  										<div>
                      		<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} disabled={!(clipboardStudents && clipboardStudents.length > 0 && clipboardCourses && clipboardCourses.length > 0)} onClick={processForm}/>
  										</div>
                  </div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Assign Courses to Students`}/>} path={'learnerCourseAssign'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
          </div>
      )
}

export default withAlert(LearnerCourseAssignView)
