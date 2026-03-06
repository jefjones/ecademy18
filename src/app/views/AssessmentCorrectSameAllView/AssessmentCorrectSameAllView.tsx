import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './AssessmentCorrectSameAllView.css'
const p = 'AssessmentCorrectSameAllView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import TextDisplay from '../../components/TextDisplay'
import RadioGroup from '../../components/RadioGroup'
import MessageModal from '../../components/MessageModal'
import LinkDisplay from '../../components/LinkDisplay'
import Icon from '../../components/Icon'
import AssessmentTrueFalse from '../../components/AssessmentTrueFalse'
import AssessmentMultipleChoice from '../../components/AssessmentMultipleChoice'
import AssessmentMultipleAnswer from '../../components/AssessmentMultipleAnswer'
import AssessmentEssay from '../../components/AssessmentEssay'
import AssessmentPassage from '../../components/AssessmentPassage'
import InputText from '../../components/InputText'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function AssessmentCorrectSameAllView(props) {
  const [studentPersonId, setStudentPersonId] = useState(props.studentPersonId)
  const [assessmentQuestionId, setAssessmentQuestionId] = useState(props.assessmentQuestionId)
  const [correctionTypes, setCorrectionTypes] = useState('all')
  const [localQuestionView, setLocalQuestionView] = useState([])
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [isInitScore, setIsInitScore] = useState(undefined)
  const [scores, setScores] = useState(undefined)

  useEffect(() => {
    
    		 setStudentPersonId(props.studentPersonId)
    	
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {assessmentCorrectSameAllStudents} = props
    			
    
    			if (!isInitScore && assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.length > 0) {
    					let scores = []
    					assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.length > 0
    							&& assessmentCorrectSameAllStudents.forEach(m => scores[m.personId] = m.score)
    					setIsInitScore(true); setScores(scores)
    			}
    	
  }, [])

  const submitEssayResponse = (assessmentQuestionId, teacherResponse) => {
    
    			const {personId, teacherEssayResponse, studentPersonId, assessmentId} = props
    			teacherResponse.studentPersonId = studentPersonId
    			teacherResponse.assessmentQuestionId = assessmentQuestionId
    			teacherResponse.assessmentId = assessmentId
    			teacherEssayResponse(personId, teacherResponse)
    			//getCorrectedAssessment(personId, studentPersonId, assessmentId, assignmentId);  Don't call this.  The function above, teacherEssayResponse will do the calling already ... after the update.
    	
  }

  const toggleSearch = () => {
    
    			setIsSearch(!isSearch)
    	
  }

  const changeCorrectionTypes = (correctionTypes) => {
    
    			setCorrectionTypes(correctionTypes)
    	
  }

  const handleQuestionChange = (event) => {
    
          const {getSameCorrectedAssessmentAllStudents, personId, assessmentId, assignmentId} = props
          setAssessmentQuestionId(event.target.value); setIsInitScore(false); setScores([])
          getSameCorrectedAssessmentAllStudents(personId, assessmentId, event.target.value)
    			navigate(`/assessmentCorrectSameAll/${assignmentId}/${assessmentId}/${event.target.value}`)
      
  }

  const onBlurScore = (studentPersonId, event) => {
    
    			const {updateTeacherAssessmentLearnerAnswer, personId, accessRoles, assessmentQuestionId, assignmentId } = props
    			if (accessRoles.facilitator || accessRoles.admin) {
    					updateTeacherAssessmentLearnerAnswer(personId, studentPersonId, assessmentQuestionId, event.target.value, assignmentId)
    			}
    	
  }

  const handleScore = (personId, event) => {
    
    			let scores = scores
    			scores[personId] = event.target.value
    			setScores(scores)
    	
  }

  const {personId, assessment, assessmentCorrectSameAllStudents, assessmentQuestions, setPenspringTransfer, correctionTypeFilter,
  						accessRoles={}, course, assessmentId, assignmentId} = props
  		
  
  		let filteredQuestions = assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.filter(m => m.assessmentQuestionId === assessmentQuestionId)
  
  		if (correctionTypes !== "all" && assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.length > 0) {
  				let questionIds = []
  				if (correctionTypes === "pendingEssays") {
  						questionIds = assessmentCorrectSameAllStudents.reduce((acc, m) => m.pendingCorrection ? acc.concat(m.assessmentQuestionId) : acc, [])
  				} else if (correctionTypes === "correctAnswers") {
  						questionIds = assessmentCorrectSameAllStudents.reduce((acc, m) => m.isCorrect ? acc.concat(m.assessmentQuestionId) : acc, [])
  				} else if (correctionTypes === "wrongAnswers") {
  						questionIds = assessmentCorrectSameAllStudents.reduce((acc, m) => !m.isCorrect && !m.pendingCorrection ? acc.concat(m.assessmentQuestionId) : acc, [])
  				}
  				filteredQuestions = filteredQuestions.filter(m => questionIds.indexOf(m.assessmentQuestionId) > -1)
  		}
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Correct Same Assessment Question for All Students`}/>
              </div>
  						<div className={(styles.moreTop, styles.rowWrap)}>
  								<TextDisplay label={`Course`} className={styles.textDisplay} text={course && course.courseName} />
                  <TextDisplay label={<L p={p} t={`Assessment`}/>} className={styles.textDisplay} text={assessment && assessment.name} />
  								{accessRoles.learner &&
  										<a onClick={handleRetakeTestOpen} className={classes(styles.link, styles.row)}>
  												<L p={p} t={`Re-take `}/> {assessment && assessment.courseContentTypeName}
  										</a>
  								}
  						</div>
  						<div className={styles.rowWrap}>
  		            <div>
  		                <SelectSingleDropDown
  		                    id={'assessmentQuestionId'}
  		                    value={assessmentQuestionId}
  		                    label={<L p={p} t={`Question`}/>}
  		                    options={assessmentQuestions}
  		                    height={`medium`}
  		                    className={styles.singleDropDown}
  		                    onChange={handleQuestionChange}/>
  		            </div>
  								<Link to={`/assessmentCorrectSummary/${assignmentId}/${assessmentId}`} className={classes(styles.moreLeft, globalStyles.link)}>
  										<L p={p} t={`Summary Report`}/>
  								</Link>
  						</div>
              <hr />
  						<a onClick={toggleSearch} className={classes(styles.row, styles.search)}>
  								<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  								{isSearch ? <L p={p} t={`Hide filter controls`}/> : <L p={p} t={`Show filter choices for question types?`}/>}
  						</a>
  						<hr />
  						{isSearch &&
  								<div className={styles.backgroundGray}>
  										<RadioGroup
  												title={<L p={p} t={`View correction types`}/>}
  												data={correctionTypeFilter}
  												horizontal={true}
  												className={styles.radio}
  												initialValue={correctionTypes || 'all'}
  												onClick={changeCorrectionTypes}/>
  				            <hr />
  								</div>
  						}
  						 {assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.length > 0 && assessmentCorrectSameAllStudents.map((studentAnswer, i) =>
  							 	<div key={i}>
  									{filteredQuestions && filteredQuestions.length > 0 && filteredQuestions.map((m, i) => {
  										//let correct = (assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.length > 0 && assessmentCorrectSameAllStudents.filter(m => m.assessmentQuestionId === m.assessmentQuestionId)[0]) || {};
  										let correctControls = ''
  
  										if (accessRoles.facilitator || accessRoles.admin) {
  												correctControls =
  														<div>
  																<div className={styles.headerLabel}>{studentAnswer.personName}</div>
  																<InputText size={"super-short"}
  																		value={scores[studentAnswer.personId] === 0
  																							? 0
  																							: scores[studentAnswer.personId]
  																									? scores[studentAnswer.personId]
  																									: ''
  																		}
  																		numberOnly={true}
  																		maxLength={6}
  																		name={m.assessmentQuestionId}
  																		onChange={(event) => handleScore(studentAnswer.personId, event)}
  																		onBlur={(event) => onBlurScore(studentAnswer.personId, event)}/>
  														</div>
  										}
  		                if (m.questionTypeCode === 'TRUEFALSE') {
  		                    return (
  		                      <div key={i}>
  															{correctControls}
  		                          <AssessmentTrueFalse nameKey={i} question={m} personId={personId} assessmentCorrect={assessmentCorrectSameAllStudents}/>
  															<TextDisplay text={m.pointsPossible} label={<L p={p} t={`Points`}/>} />
  		                          <div className={styles.linkDisplay}>
  																	{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																			<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																	)}
  		                          </div>
  		                          <hr className={styles.hrHeight}/>
  		                      </div>
  		                    )
  		                } else if (m.questionTypeCode === 'MULTIPLECHOICE') {
  		                  return (
  		                    <div key={i}>
  														{correctControls}
  		                        <AssessmentMultipleChoice nameKey={i} question={m} personId={personId} assessmentCorrect={assessmentCorrectSameAllStudents}/>
  														<TextDisplay text={m.pointsPossible} label={<L p={p} t={`Points`}/>} />
  		                        <div className={styles.linkDisplay}>
  																{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																		<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																)}
  		                        </div>
  		                        <hr className={styles.hrHeight}/>
  		                    </div>
  		                  )
  		                } else if (m.questionTypeCode === 'MULTIPLEANSWER') {
  		                  return (
  		                    <div key={i}>
  														{correctControls}
  		                        <AssessmentMultipleAnswer nameKey={i} question={m} answers={m.answers} personId={personId} assessmentCorrect={assessmentCorrectSameAllStudents}/>
  														<TextDisplay text={m.pointsPossible} label={<L p={p} t={`Points`}/>} />
  		                        <div className={styles.linkDisplay}>
  																{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																		<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																)}
  		                        </div>
  		                        <hr className={styles.hrHeight}/>
  		                    </div>
  		                  )
  		                } else if (m.questionTypeCode === 'ESSAY') {
  											let correct = assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.length > 0 && assessmentCorrectSameAllStudents.filter(a => a.assessmentQuestionId === m.assessmentQuestionId)[0]
  											let score = correct && correct.score ? correct.score : 0
  
  		                  return (
  		                    <div key={i}>
  														{correctControls}
  		                        <AssessmentEssay nameKey={i} question={m} personId={personId} assessmentCorrect={assessmentCorrectSameAllStudents}
  																accessRoles={accessRoles} isTeacher={accessRoles.facilitator} isSubmitted={true} submitEssayResponse={submitEssayResponse}
  																setPenspringTransfer={setPenspringTransfer}/>
  														<TextDisplay text={m.keywordCountAccuracy || score ? <L p={p} t={`${score} out of ${m.pointsPossible}`}/> : <L p={p} t={`pending teacher review`}/>} label={<L p={p} t={`Points`}/>} />
  		                        <div className={styles.linkDisplay}>
  																{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																		<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																)}
  		                        </div>
  		                        <hr className={styles.hrHeight}/>
  		                    </div>
  		                  )
  		                } else if (m.questionTypeCode === 'PASSAGE') {
  		                  return (
  		                    <div key={i}>
  		                        <AssessmentPassage nameKey={i} question={m}/>
  		                        <div className={styles.linkDisplay}>
  																{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																		<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  																)}
  		                        </div>
  		                        <hr className={styles.hrHeight}/>
  		                    </div>
  		                  )
  		                }
  		                return m
  		            })}
  							</div>)
  					  }
              <OneFJefFooter />
  						{isShowingModal &&
                  <MessageModal handleClose={handleRetakeTestClose} heading={<div className={styles.row}><L p={p} t={`Re-take `}/>{assessment && assessment.courseContentTypeName}</div>}
                     explainJSX={<L p={p} t={`Are you sure you want to retake this ${assessment && assessment.courseContentTypeName}?`}/>} isConfirmType={true}
                     onClick={handleRetakeTest} />
              }
        </div>
      )
}
export default AssessmentCorrectSameAllView
