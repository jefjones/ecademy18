import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AssessmentCorrectView.css'
const p = 'AssessmentCorrectView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
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
import AssessmentSingleEntry from '../../components/AssessmentSingleEntry'
import AssessmentFillBlank from '../../components/AssessmentFillBlank'
import AssessmentMatching from '../../components/AssessmentMatching'
import StandardsAssignmentResult from '../../components/StandardsAssignmentResult'
import StandardDisplay from '../../components/StandardDisplay'
import InputText from '../../components/InputText'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function AssessmentCorrectView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [studentPersonId, setStudentPersonId] = useState(props.studentPersonId)
  const [correctionTypes, setCorrectionTypes] = useState('all')
  const [questionTypes, setQuestionTypes] = useState('all')
  const [localQuestionView, setLocalQuestionView] = useState([])
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [score, setScore] = useState(undefined)

  useEffect(() => {
    
    		 setStudentPersonId(props.studentPersonId)
    	
    return () => {
      
      			props.clearAssessmentQuestion()
      			props.clearAssessmentCorrect()
      	
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

  const changeQuestionTypes = (questionTypes) => {
    
    			setQuestionTypes(questionTypes)
    	
  }

  const handleLearnerChange = (event) => {
    
    			const {getCorrectedAssessment, assessmentQuestionsInit, personId, assessmentId, courseScheduledId, assignmentId} = props
          setStudentPersonId(event.target.value); setScore([])
    			getCorrectedAssessment(personId, event.target.value, assessmentId, assignmentId)
    			assessmentQuestionsInit(personId, event.target.value, assessmentId, assignmentId)
    			navigate(`/assessmentCorrect/${assignmentId}/${assessmentId}/${event.target.value}/${courseScheduledId}`)
      
  }

  const handleRetakeTestClose = () => {
    return setIsShowingModal(false)

  }
  const handleRetakeTestOpen = () => {
    return setIsShowingModal(true)

  }
  const handleRetakeTest = () => {
    
    			const {retakeTest, personId, assessmentId, assignmentId} = props
    			retakeTest(personId, assignmentId, assessmentId)
    			handleRetakeTestClose()
    	
  }

  const onBlurScore = (assessmentQuestionId, event) => {
    
    			const {updateTeacherAssessmentLearnerAnswer, personId, accessRoles, assignmentId } = props
    			
    			if (accessRoles.facilitator || accessRoles.admin) {
    					updateTeacherAssessmentLearnerAnswer(personId, studentPersonId, assessmentQuestionId, event.target.value, assignmentId)
    			}
    	
  }

  const handleScore = (assessmentQuestionId, event) => {
    
          props.setLocalScore(assessmentQuestionId, event.target.value)
      
  }

  const {personId, studentFullName, assessment, assessmentCorrect={}, students, questionTypeFilter, standardsRatings,
  						setPenspringTransfer, correctionTypeFilter, accessRoles={}, courseScheduledId, fetchingRecord, benchmarkTestId} = props
  		
  
  		let canViewAnswers = accessRoles.learner || accessRoles.facilitator
  				? !assessment.doNotShowAnswersImmediately
  				: true
  
      let headings = [
          {label: '%', tightText: true},
          {label: <L p={p} t={`Score`}/>, tightText: true},
          {label: <L p={p} t={`Score Pending`}/>, tightText: true},
          {label: <L p={p} t={`Essays pending`}/>, tightText: true},
          {label: <L p={p} t={`Total`}/>, tightText: true},
          {label: <L p={p} t={`Questions`}/>, tightText: true}
      ]
  
      let data = []
  
      let details = assessmentCorrect.details
  
      if (details && details.length > 0) {
  				let scorePending = details.reduce((acc, m) => m.pendingCorrection ? acc + m.pointsPossible : acc, 0)
  				let essaysPending = details.reduce((acc, m) => m.pendingCorrection ? ++acc : acc, 0)
  				let totalPoints = details.reduce((acc, m) => acc + m.pointsPossible, 0)
  				let questionsCount = details.length
  				let scorePercent = (totalPoints - scorePending) > 0 ? Math.round((score / (totalPoints - scorePending))*100) : 0
  
          data = [[
  						{value: scorePending ? <L p={p} t={`pending`}/> : scorePercent + '%', boldText: true},
  						{value: Number(score), boldText: true},
  						{value: <div className={styles.red}>{!!scorePending ? scorePending : ''}</div>, boldText: true},
  						{value: <div className={styles.red}>{!!essaysPending ? essaysPending : ''}</div>, boldText: true},
  						{value: totalPoints, boldText: true},
              {value: questionsCount, boldText: true},
          ]]
      }
  
  		let filteredQuestions = Object.assign([], props.assessmentQuestions)
  
  		if (correctionTypes !== "all" && details && details.length > 0) {
  				let questionIds = []
  				if (correctionTypes === "pendingEssays") {
  						questionIds = details.reduce((acc, m) => m.pendingCorrection ? acc.concat(m.assessmentQuestionId) : acc, [])
  				} else if (correctionTypes === "correctAnswers") {
  						questionIds = details.reduce((acc, m) => m.isCorrect ? acc.concat(m.assessmentQuestionId) : acc, [])
  				} else if (correctionTypes === "wrongAnswers") {
  						questionIds = details.reduce((acc, m) => !m.isCorrect && !m.pendingCorrection ? acc.concat(m.assessmentQuestionId) : acc, [])
  				}
  				filteredQuestions = filteredQuestions.filter(m => questionIds.indexOf(m.assessmentQuestionId) > -1)
  		}
  
  		if (questionTypes !== "all" && filteredQuestions && filteredQuestions.length > 0) {
  				filteredQuestions = filteredQuestions.filter(m => m.questionTypeCode === questionTypes)
  		}
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Result'}
              </div>
  						<div className={(styles.moreTop, styles.rowWrap)}>
  								<TextDisplay label={<L p={p} t={`Student`}/>} className={styles.textDisplay} text={studentFullName}  />
  								{assessmentCorrect.courseName &&
  										<TextDisplay label={<L p={p} t={`Course`}/>} className={styles.textDisplay}
  												text={<Link to={(accessRoles.admin || accessRoles.facilitator) ? `/gradebookEntry/${courseScheduledId}` : `/studentAssignments/${courseScheduledId}`} className={classes(globalStyles.link, styles.bold)}>
  																	{assessmentCorrect.courseName}
  															</Link>} />
  								}
                  <TextDisplay label={benchmarkTestId ? `Benchmark assessment` : `Assessment`} className={styles.textDisplay} text={assessment && assessment.name} />
  								{accessRoles.learner && assessmentCorrect.canRetakeQuiz &&
  										<a onClick={handleRetakeTestOpen} className={styles.link}>
  												<L p={p} t={`Re-take`}/>
  										</a>
  								}
  								{(accessRoles.facilitator || accessRoles.admin) &&
  										<Link to={`/gradebookEntry/${courseScheduledId}`} className={classes(styles.link, styles.row)}>
  												<Icon pathName={'medal_empty'} premium={true} /><L p={p} t={`Go to Gradebook`}/>
  										</Link>
  								}
  						</div>
              {(accessRoles.facilitator || accessRoles.admin || accessRoles.observer) &&
                  <div>
                      <SelectSingleDropDown
                          id={'studentPersonId'}
                          value={studentPersonId || ''}
                          label={<L p={p} t={`Student`}/>}
                          options={students}
                          height={`medium`}
                          noBlank={false}
                          className={styles.singleDropDown}
                          onChange={handleLearnerChange}/>
                  </div>
              }
              <hr />
  						<div className={styles.rowWrap}>
  								<div className={styles.backgroundGray}>
  		            		<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  												isFetchingRecord={fetchingRecord.assessmentCorrect}/>
  								</div>
  								{assessmentCorrect.gradingType === 'STANDARDSRATING' && standardsRatings && standardsRatings.length > 0 &&
  										<StandardsAssignmentResult scores={details} standardsRatings={standardsRatings} horizontal={false} showRightCode={true}/>
  								}
  						</div>
  						{canViewAnswers &&
  								<a onClick={toggleSearch} className={classes(styles.row, styles.search)}>
  										<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  										{isSearch ? <L p={p} t={`Hide filter controls`}/> : <L p={p} t={`Show filter choices for question types?`}/>}
  								</a>
  						}
  						<hr />
  						{isSearch && canViewAnswers &&
  								<div className={styles.backgroundGray}>
  										<RadioGroup
  												title={<L p={p} t={`View correction types`}/>}
  												data={correctionTypeFilter}
  												horizontal={true}
  												className={styles.radio}
  												initialValue={correctionTypes || 'all'}
  												onClick={changeCorrectionTypes}/>
  										<hr />
  										<RadioGroup
  												title={<L p={p} t={`View question types`}/>}
  												data={questionTypeFilter}
  												horizontal={true}
  												className={styles.radio}
  												initialValue={questionTypes || 'all'}
  												onClick={changeQuestionTypes}/>
  				            <hr />
  								</div>
  						}
  						{canViewAnswers && filteredQuestions && filteredQuestions.length > 0 && filteredQuestions.map((m, i) => {
  								//let correct = (details && details.length > 0 && details.filter(m => m.assessmentQuestionId === m.assessmentQuestionId)[0]) || {};
  								let correctControls = ''
                  //let scoreRecord = details && details.length > 0 && details.filter(f => f.assessmentQuestionId === m.assessmentQuestionId)[0];
  								//let score = scoreRecord && scoreRecord.assessmentQuestionId ? scoreRecord.score : '';
                  let score = m.learnerAnswer && m.learnerAnswer.score
  
  								if (accessRoles.facilitator || accessRoles.admin) {
  										correctControls =
  												<div className={styles.lessTop}>
  														<InputText size={'super-short'}
                                  label={''}
  																value={score === 0
  																					? '0'
  																					: score || ''
  																}
  																numberOnly={true}
  																maxLength={6}
  																name={m.assessmentQuestionId}
  																onChange={(event) => handleScore(m.assessmentQuestionId, event)}
  																onBlur={(event) => onBlurScore(m.assessmentQuestionId, event)}/>
  												</div>
  								}
                  if (m.questionTypeCode === 'TRUEFALSE') {
                      return (
                        <div key={i}>
                            <AssessmentTrueFalse nameKey={i} question={m} personId={personId} assessmentCorrect={details}/>
  													<StandardDisplay standards={m.standards} />
  													<TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  																	? <div className={styles.row}>
  																				{correctControls}
  																				<div className={classes(styles.littleTop, styles.row)}>
  																						<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																						<div>{m.pointsPossible}</div>
  																				</div>
  																		</div>
  																	: <div className={(styles.littleTop, styles.row)}>
  																				<div>{Math.round(score*10)/10 || '0'}</div>
  																				<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																				<div>{m.pointsPossible}</div>
  																		</div>
  															} className={styles.moreTop} />
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
                          <AssessmentMultipleChoice nameKey={i} question={m} personId={personId} assessmentCorrect={details} viewMode={'CorrectedView'}/>
  												<StandardDisplay standards={m.standards} />
  												<TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  														? <div className={styles.row}>
  																	{correctControls}
  																	<div className={classes(styles.littleTop, styles.row)}>
  																			<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																			<div>{m.pointsPossible}</div>
  																	</div>
  															</div>
  														: <div className={(styles.littleTop, styles.row)}>
  																	<div>{Math.round(score*10)/10 || '0'}</div>
  																	<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																	<div>{m.pointsPossible}</div>
  															</div>
  												}/>
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
                          <AssessmentMultipleAnswer nameKey={i} question={m} answers={m.answers} personId={personId} assessmentCorrect={details} viewMode={'CorrectedView'}/>
  												<StandardDisplay standards={m.standards} />
                          <div className={styles.littleRight}>
                              <TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  																? <div className={styles.row}>
  																			{correctControls}
  																			<div className={classes(styles.littleTop, styles.row)}>
  																					<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																					<div>{m.pointsPossible}</div>
  																			</div>
  																	</div>
  																: <div className={(styles.littleTop, styles.row)}>
  																			<div>{Math.round(score*10)/10 || '0'}</div>
  																			<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																			<div>{m.pointsPossible}</div>
  																	</div>
  														}/>
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                    )
                  } else if (m.questionTypeCode === 'ESSAY') {
  									let correct = details && details.length > 0 && details.filter(a => a.assessmentQuestionId === m.assessmentQuestionId)[0]
  									let score = correct && correct.score ? correct.score : 0
  
                    return (
                      <div key={i}>
                          <AssessmentEssay nameKey={i} question={m} personId={personId} assessmentCorrect={details} accessRoles={accessRoles}
  														isTeacher={accessRoles.facilitator} isSubmitted={true}  submitEssayResponse={submitEssayResponse}
  														setPenspringTransfer={setPenspringTransfer}/>
  												<StandardDisplay standards={m.standards} />
                          <TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  														? <div className={styles.row}>
  																	{correctControls}
  																	<div className={classes(styles.littleTop, styles.row)}>
  																			<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																			<div>{m.pointsPossible}</div>
  																	</div>
  															</div>
  														: <div className={(styles.littleTop, styles.row)}>
  																	<div>{Math.round(score*10)/10 || '0'}</div>
  																	<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																	<div>{m.pointsPossible}</div>
  															</div>
  												}/>
  												{/*<TextDisplay text={m.keywordCountAccuracy || score ? `${score} out of ${m.pointsPossible}` : `pending teacher review`} label={'Points'} />*/}
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
  								} else if (m.questionTypeCode === 'SINGLEENTRY') {
                    return (
                      <div key={i}>
                          <AssessmentSingleEntry nameKey={i} question={m} answers={m.answers} learnerAnswer={m.learnerAnswer} personId={personId} accessRoles={accessRoles}
  														assessmentCorrect={details}/>
  												<StandardDisplay standards={m.standards} />
                          <div className={styles.littleRight}>
                              <TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  																? <div className={styles.row}>
  																			{correctControls}
  																			<div className={classes(styles.littleTop, styles.row)}>
  																					<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																					<div>{m.pointsPossible}</div>
  																			</div>
  																	</div>
  																: <div className={(styles.littleTop, styles.row)}>
  																			<div>{Math.round(score*10)/10 || '0'}</div>
  																			<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																			<div>{m.pointsPossible}</div>
  																	</div>
  														}/>
                          </div>
                          <div className={styles.linkDisplay}>
  														{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  														)}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                    )
  								} else if (m.questionTypeCode === 'FILLBLANK') {
                    return (
                      <div key={i}>
                          <AssessmentFillBlank nameKey={i} question={m} learnerAnswer={m.learnerAnswer} personId={personId} accessRoles={accessRoles} assessmentCorrect={details}/>
  												<StandardDisplay standards={m.standards} />
                          <div className={styles.littleRight}>
                              <TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  																? <div className={styles.row}>
  																			{correctControls}
  																			<div className={classes(styles.littleTop, styles.row)}>
  																					<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																					<div>{m.pointsPossible}</div>
  																			</div>
  																	</div>
  																: <div className={(styles.littleTop, styles.row)}>
  																			<div>{Math.round(score*10)/10 || '0'}</div>
  																			<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																			<div>{m.pointsPossible}</div>
  																	</div>
  														}/>
                          </div>
                          <div className={styles.linkDisplay}>
  														{m.websiteLinks && m.websiteLinks.length > 0 && m.websiteLinks.map((w, i) =>
  																<LinkDisplay key={i} linkText={w} isWebsiteLink={true} />
  														)}
                          </div>
                          <hr className={styles.hrHeight}/>
                      </div>
                    )
  								} else if (m.questionTypeCode === 'MATCHING') {
                    return (
                      <div key={i}>
                          <AssessmentMatching nameKey={i} question={m} learnerAnswer={m.learnerAnswer} personId={personId} accessRoles={accessRoles}
  														assessmentCorrect={details} viewMode={'CorrectedView'}/>
  												<StandardDisplay standards={m.standards} />
                          <div className={styles.littleRight}>
                              <TextDisplay label={<L p={p} t={`Points`}/>} text={correctControls
  																? <div className={styles.row}>
  																			{correctControls}
  																			<div className={classes(styles.littleTop, styles.row)}>
  																					<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																					<div>{m.pointsPossible}</div>
  																			</div>
  																	</div>
  																: <div className={(styles.littleTop, styles.row)}>
  																			<div>{Math.round(score*10)/10 || '0'}</div>
  																			<div className={styles.plainText}><L p={p} t={`out of`}/></div>
  																			<div>{m.pointsPossible}</div>
  																	</div>
  														}/>
                          </div>
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
              <OneFJefFooter />
  						{isShowingModal &&
                  <MessageModal handleClose={handleRetakeTestClose} heading={<L p={p} t={`Re-take?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to retake this assignment?`}/>} isConfirmType={true}
                     onClick={handleRetakeTest} />
              }
        </div>
      )
}
export default AssessmentCorrectView
