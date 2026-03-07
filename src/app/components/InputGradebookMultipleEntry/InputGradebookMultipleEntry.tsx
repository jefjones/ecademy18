import { useState } from 'react';  //PropTypes
import * as styles from './InputGradebookMultipleEntry.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import StandardsRatingColor from '../../components/StandardsRatingColor'
import InputText from '../InputText'
const p = 'component'
import L from '../../components/PageLanguage'

function InputGradebookMultipleEntry(props) {
  const [chosenOption, setChosenOption] = useState('')
  const [error, setError] = useState(isLevelOnly ? <L p={p} t={`Please choose an option`}/> : <L p={p} t={`Please enter an option`}/>)
  const [p, setP] = useState(undefined)

  const {handleClose, className, headerClass, explainClass, heading, explain, isLevelOnly, standardsRatings} = props
          
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose} className={styles.maxWidth}>
                          <div className={classes(styles.dialogHeader, headerClass)}>{heading}</div>
  												<div className={classes(styles.dialogExplain, explainClass)}>
  														{explain}
  														{isLevelOnly
  																? <L p={p} t={`Choose the sequence that you want to assign to all students. In this case, all students (including the self-paced students) will be given the standard setting you choose.`}/>
  																: <L p={p} t={`Enter a number to set all empty scores for this assignment.  The self-paced students, if any, will not have their scores set.  You can set their scores individually, as needed.`}/>
  														}
  												</div>
  												<div className={classes(styles.centered, styles.moreSpace)}>
  														{isLevelOnly //Then this is the StandardsRating that is the type you can set directly.  The other type is a hybrid of a traditional grading percentage that sets the various standards of an assignment automatically in view.
  																? <div className={styles.row}>
                                        {standardsRatings && standardsRatings.length > 0 && standardsRatings.map((m, i) =>
                                            <div key={i} onClick={() => handleSetStandardLevel(i+1*1)} className={classes((chosenOption === i+1*1 ? styles.border : ''), styles.space)}>
                                                <StandardsRatingColor label={m.levelAbbrev} color={m.color} description={m.description} showName={false} name={m.name}/>
                                            </div>
                                        )}
  																	</div>
  
  																: <InputText
  																		id={"chosenOption"}
  																		name={"chosenOption"}
  																		size={"super-short"}
  																		//label={gradingType === 'STANDARDSRATING' ? 'Choose score ' : 'Score'}
  																		label={'Score'}
  																		value={chosenOption}
  																		inputClassName={styles.inputText}
  																		onChange={handleChange}/>
  														}
  												</div>
                          <div className={styles.dialogButtons}>
  														<div className={styles.row}>
  		                            <a className={styles.noButton} onClick={handleClose}><L p={p} t={`Cancel`}/></a>
  																<div>
  																		<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={validateClick}/>
  																</div>
  														</div>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default InputGradebookMultipleEntry
