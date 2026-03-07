import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {penspringHost} from '../../penspring_host'
import * as styles from './AssessmentPendingEssayView.css'
const p = 'AssessmentPendingEssayView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'

function AssessmentPendingEssayView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [studentPersonId, setStudentPersonId] = useState('')
  const [testTypes, setTestTypes] = useState('all')
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(false)
  const [assignmentTitle, setAssignmentTitle] = useState(undefined)

  const {personId, myFrequentPlaces, setMyFrequentPlace, assessmentPendingEssay, students, accessRoles={}, fetchingRecord} = props
  		
  
      let headings = [{},
  				{label: <L p={p} t={`Possible score`}/>, tightText: true},
  				{label: <L p={p} t={`Score`}/>, tightText: true},
  				{label: <L p={p} t={`Assignment`}/>, tightText: true},
  				{label: <L p={p} t={`Essay subject`}/>, tightText: true},
  				{label: <L p={p} t={`Student`}/>, tightText: true},
  				{label: <L p={p} t={`Course`}/>, tightText: true},
  				{label: <L p={p} t={`Word count`}/>, tightText: true},
  				{label: <L p={p} t={`Entry date`}/>, tightText: true}
  		]
  
      let data = assessmentPendingEssay && assessmentPendingEssay.length > 0 && assessmentPendingEssay.map((m, i) =>
           [
  						{value: <a key={i} onClick={() => handlePenspringView(m.penspringWorkId, m)}
  														href={`${penspringHost}/lms/${personId}`} target={'_penspring'}
  														className={m.isTeacherResponse ? styles.teacherResponse : ''}>
  												<Icon pathN	ame={'pencil0'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: m.pointsPossible},
  						{value: <InputText id={i} tabIndex={i} size={"super-short"} value={state.scores[m.assignmentId + '#$' + m.studentPersonId] === 0 ? 0 : state.scores[m.assignmentId + '#$' + m.studentPersonId] ? state.scores[m.assignmentId + '#$' + m.studentPersonId] : ''}
  												numberOnly={true}
  												onChange={(event) => handleScore(m.assignmentId, event)}
  												onBlur={(event) => onBlurScore(m.courseScheduledId, m.assignmentId, m.studentPersonId, event)}
  												onDoubleClick={(accessRoles.admin || accessRoles.facilitator) ? () => handleDocumentOpen(m.assignmentId, null, m) : () => {}}/>},
  						{value: m.assignmentTitle},
  						{value: m.instructions, clickFunction: () => handleInstructionsOpen(m.assignmentTitle, m.instructions) },
  						{value: m.studentNameFirst === 'FIRST' ? m.studentFirstName + ' ' + m.studentLastName : m.studentLastName + ', ' + m.studentFirstName},
  						{value: m.courseNameTime + ' - ' + m.classPeriodOrTime},
  						{value: m.wordCount},
  						{value: m.entryDate},
          ]
  		)
  
      return (
          <div className={styles.container}>
  				<div className={globalStyles.pageTitle}>
  						<L p={p} t={`Pending Essay Reviews from Tests`}/>
  				</div>
  				{(accessRoles.facilitator || accessRoles.admin || accessRoles.observer) &&
  						<div>
  								<SelectSingleDropDown
  										id={'studentPersonId'}
  										value={studentPersonId}
  										label={<L p={p} t={`Students with pending essays`}/>}
  										options={students}
  										height={`medium`}
  										noBlank={false}
  										className={styles.singleDropDown}
  										onChange={handleStudentChange}/>
  						</div>
  				}
  				<hr />
  				<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={fetchingRecord.assessmentPendingEssay}/>
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Assessment Pending Essay`}/>} path={'assessmentPendingEssay'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
  				{isShowingModal_instructions &&
  						<MessageModal handleClose={handleInstructionsClose} heading={`Quiz: ${assignmentTitle}`}
  							 explain={instructions}  onClick={handleInstructionsClose} />
  				}
        	</div>
      )
}
export default AssessmentPendingEssayView
