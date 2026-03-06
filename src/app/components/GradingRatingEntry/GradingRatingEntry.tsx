import { Link } from 'react-router-dom'
import styles from './GradingRatingEntry.css'
import globalStyles from '../../utils/globalStyles.css'
import StandardsAssignmentResult from '../StandardsAssignmentResult'
import StandardsRatingColor from '../StandardsRatingColor'
import InputText from '../InputText'
import Icon from '../Icon'
import classes from 'classnames'

export const GradingRatingEntry = ({ gradingType, studentScore={}, studentPersonId, assignmentId, handleEnterKey=()=>{}, handleScore=()=>{}, onBlurScore=()=>{}, onEnterKey=()=>{},
 																			onPassFailIncrement=()=>{}, theScore, useType, setEditMode, isEditMode, courseScheduledId, assessmentId, onStandardLevelIncrement=()=>{},
																			canEditScore, standards, standardsRatings, scoredAnswers, contentTypeCode, hasAssessmentQuestions, forceInputBox, chooseRecord}) => {

		//forceInputBox: Force the input box to be shown on the last two assignments so that the enter key will work to go downward to enter scores for all students more easily.

    //There are two versions of the standards-based rating now.  If the checkbox "isLevelOnly" in the standards based rating settings is chosen, then the rating is just subjective
    //  by the teacher.  The teacher an click on the standard circle and it will increment to the next standard rating.  The version that is no the "isLevelOnly" expects a standards
    //  to be added to an assignment or to each quiz question - and that rating is set by the percentage of the traditional grading perspective.
    //isLevelOnly:  Will only show the circle standard rating.  No traditional grade anywhere.
    //NOT isLevelOnly:  Will show the traditional grade as well as the actual score of the assignment next to the one or more standards circles.

    //If this is isLevelOnly
    let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly
    let standardsRating = (standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.sequence === studentScore.knowledgeRatingSequence)[0]) || {}


		let sequence = isLevelOnly
        ? (studentScore && studentScore.knowledgeRatingSequence)
        : gradingType === 'STANDARDSRATING'
    				? ''
    				: (studentScore && studentScore.passFailSequence)
    						? (studentScore && studentScore.passFailSequence)
    						: 0

		let ratingLabel = isLevelOnly
        ? standardsRatings && standardsRatings.length > 0 && standardsRatings.reduce((acc, m) => acc = acc && acc.length > 0 ? acc.concat(m.levelAbbrev) : [m.levelAbbrev], [])
        : gradingType === 'STANDARDSRATING'
    				? ''
    				: ['N', 'P', 'F']

    return (
        <div className={styles.container}>
						{isLevelOnly
                ? ''
                : (canEditScore && forceInputBox) || (canEditScore && isEditMode && useType === 'GRADEBOOK') || (useType !== 'GRADEBOOK' && canEditScore && (isEditMode || !studentScore || (studentScore && studentScore.score !== 0 && !studentScore.score)))
    								? <div className={styles.row} onClick={() => chooseRecord(studentPersonId)}>
    											{(hasAssessmentQuestions || studentScore.hasAssessmentQuestions || contentTypeCode === 'BENCHMARK') &&
    													<Link to={`/assessmentCorrect/${assignmentId}/${studentScore.assessmentId}/${studentPersonId}/${courseScheduledId}`} className={classes(styles.littleTop, styles.link, styles.littleRight)} data-rh={'Open the quiz to see answers'}>
    															<Icon pathName={'clipboard_check'} premium={true} className={styles.iconCell}/>
    													</Link>
    											}
    											<InputText size={"super-short"}
    														name={studentPersonId + '#$' + assignmentId}
    													  value={useType === 'GRADEBOOK'
    																? studentScore
    																		? studentScore.score === 0
    																				? 0
    																				: studentScore.score || ''
    																		: (studentScore && studentScore.score) || ''
    																: theScore === 0
    																		? 0
    																		: theScore || ''
    														}
    														numberOnly={true}
    														maxLength={6}
    														onChange={(event) => { handleScore(assignmentId, studentPersonId, event); setEditMode(assignmentId, studentPersonId);}}
    			                      onBlur={(event) => { onBlurScore(assignmentId, studentPersonId, event); setEditMode(assignmentId, studentPersonId);}}
    														onEnterKey={(event) => { handleEnterKey(assignmentId, studentPersonId, event); setEditMode(assignmentId, studentPersonId);}}
    														inputClassName={styles.lessTop} />
    									</div>

    								: gradingType === 'PASSFAIL'
    										? studentScore.score === 0
    												? 0
    												: studentScore.score || ''

    										: <div className={styles.row}>
    													{(hasAssessmentQuestions || studentScore.hasAssessmentQuestions || contentTypeCode === 'BENCHMARK') &&
    															<Link to={`/assessmentCorrect/${assignmentId}/${studentScore.assessmentId}/${studentPersonId}/${courseScheduledId}`} className={classes(styles.littleTop, styles.link, styles.littleRight)} data-rh={'Open the quiz to see answers'}>
    																	<Icon pathName={'clipboard_check'} premium={true} className={styles.iconCell}/>
    															</Link>
    													}
    													<div onClick={() => {setEditMode(assignmentId, studentPersonId); chooseRecord(studentPersonId)}} className={canEditScore ? styles.scoreLink : styles.text}>
    																{useType === 'GRADEBOOK'
    																		? studentScore
    																				? studentScore.score === 0
    																						? 0
    																						: studentScore.score
    																						 		? studentScore.score
    																								: useType === 'GRADEBOOK' && contentTypeCode !== 'BENCHMARK'
    																										? <div tabIndex={1} onFocus={() => {setEditMode(assignmentId, studentPersonId); chooseRecord(studentPersonId)}}><Icon pathName={'dotted_underscore'} premium={true}/></div>
    																										: <div className={styles.blankheight}>&nbsp;</div>
    																				: (studentScore && studentScore.score)
    																						? studentScore.score
    																						: useType === 'GRADEBOOK' && contentTypeCode !== 'BENCHMARK'
    																								? <div tabIndex={1} onFocus={() => {setEditMode(assignmentId, studentPersonId); chooseRecord(studentPersonId)}}><Icon pathName={'dotted_underscore'} premium={true}/></div>
    																								: <div className={styles.blankheight}>&nbsp;</div>
    																		: theScore === 0
    																				? 0
    																				: theScore
    																				 		? theScore
    																						: useType === 'GRADEBOOK' && contentTypeCode !== 'BENCHMARK'
    																								? <div tabIndex={1} onFocus={() => {setEditMode(assignmentId, studentPersonId); chooseRecord(studentPersonId)}}><Icon pathName={'dotted_underscore'} premium={true}/></div>
    																								: <div className={styles.blankheight}>&nbsp;</div>
    																}
    													</div>
    											</div>
						}
            {isLevelOnly &&
								<span id={`${studentPersonId}^${assignmentId}`} onClick={() => onStandardLevelIncrement(studentPersonId, assignmentId, studentScore.knowledgeRatingSequence+1*1)}>
                    <StandardsRatingColor label={standardsRating.levelAbbrev} color={standardsRating.color} description={standardsRating.description} name={standardsRating.name} showName={false}/>
								</span>
						}
						{!isLevelOnly && gradingType === 'STANDARDSRATING' && standardsRatings && standardsRatings.length > 0 &&
								<StandardsAssignmentResult scores={scoredAnswers} standards={standards} standardsRatings={standardsRatings} showTopPercent={false}/>
						}
						{gradingType === 'PASSFAIL' &&
								<button type={'button'} className={classes(globalStyles[`colorPassFail${sequence}`], styles.button)} onClick={() => onPassFailIncrement(studentPersonId, assignmentId, studentScore && studentScore.passFailSequence)}>
										<div className={classes(styles.buttonText, (ratingLabel[sequence] === 'i' ? styles.littleLeft : ''))}>{ratingLabel[sequence]}</div>
								</button>
						}
        </div>
    )
}

export default GradingRatingEntry
