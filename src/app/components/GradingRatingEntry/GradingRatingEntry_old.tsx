import styles from './GradingRatingEntry.css'
import globalStyles from '../../utils/globalStyles.css'

import InputText from '../InputText'
import classes from 'classnames'

export const GradingRatingEntry = ({ gradingType, studentScore={}, studentPersonId, assignmentId, handleEnterKey=()=>{}, handleScore=()=>{}, onBlurScore=()=>{}, onEnterKey=()=>{},
 																			onPassFailIncrement=()=>{}, theScore, useType, setEditMode, isEditMode}) => { //onSTANDARDSRATINGIncrement=()=>{}
		let sequence = gradingType === 'STANDARDSRATING'
				? (studentScore && studentScore.STANDARDSRATINGSequence)
				: (studentScore && studentScore.passFailSequence)
						? (studentScore && studentScore.passFailSequence)
						: 0

		let ratingLabel = gradingType === 'STANDARDSRATING'
				? ['N', 'i', 'Re', 'Ps', 'Ph', 'Ms', 'Me'] //Not started, Introduced, Remedial, Proficient sufficient, Proficient high, Mastered sufficient, Mastered expert
				: ['N', 'P', 'F']

    return (
        <div className={styles.container}>
						{(!gradingType || gradingType === 'TRADITIONAL') && (isEditMode || !studentScore || (studentScore && studentScore.score !== 0 && !studentScore.score))
								?  <InputText size={"super-short"}
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
											name={studentPersonId + '#$' + assignmentId}
											onChange={(event) => { handleScore(assignmentId, studentPersonId, event); setEditMode(assignmentId, studentPersonId);}}
                      onBlur={(event) => { onBlurScore(assignmentId, studentPersonId, event); setEditMode(assignmentId, studentPersonId);}}
											onEnterKey={(event) => { handleEnterKey(assignmentId, studentPersonId, event); setEditMode(assignmentId, studentPersonId);}}
											inputClassName={styles.lessTop} />

								: gradingType === 'STANDARDSRATING' || gradingType === 'PASSFAIL'
										? ''
										: <div onClick={() => setEditMode(assignmentId, studentPersonId)} className={styles.scoreLink}>
													{useType === 'GRADEBOOK'
															? studentScore
																	? studentScore.score === 0
																			? 0
																			: studentScore.score || <div className={styles.blankheight}>&nbsp;</div>
																	: (studentScore && studentScore.score) || <div className={styles.blankheight}>&nbsp;</div>
															: theScore === 0
																	? 0
																	: theScore || <div className={styles.blankheight}>&nbsp;</div>
													}
											</div>
						}
						{gradingType === 'STANDARDSRATING' &&
								<span id={`${studentPersonId}^${assignmentId}`}>
										<button type={'button'} className={classes(globalStyles[`color${sequence}`], styles.button)}>
												<div className={classes(styles.buttonText, (ratingLabel[sequence] === 'i' ? styles.littleLeft : ''))}>{ratingLabel[sequence]}</div>
										</button>
								</span>
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
