import { useEffect, useState } from 'react';import * as styles from './MenuEditModes.css'
import EditModeOption from '../EditModeOption'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function MenuEditModes(props) {
  const [isShowingLabels, setIsShowingLabels] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener('keyup', checkForKeypress)
        
  }, [])

  const {opened, toggleOpen, className, editReview, setEditMode, handleShowInstructions, tooltipDirection} = props
          
  
          return (
              <div className={classes(styles.mainContainer, className)}>
                  <span onClick={toggleOpen} className={classes(styles.jef_caret, opened ? styles.jefCaretUp : styles.jefCaretDown)}></span>
                  <div className={classes((opened ? styles.opened : styles.notOpen))}>
                      <div className={styles.row}>
                          {opened &&
                              <div className={styles.leftColumn}>
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`edit text (default)`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'edit'} toggleOpen={toggleOpen} showInstructions={false}
                                          iconName={`pencil`} handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.editCount}
                                          tooltipDirection={tooltipDirection}/>
                                  }
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`new paragraph break`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'breakNew'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`paragraph`} iconSuperscript={'plus'} iconSuperscriptColor={'green'}
                                          handleShowInstructions={handleShowInstructions} tooltipDirection={tooltipDirection}/>
                                  }
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`delete paragraph break`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'breakDelete'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`paragraph`} iconSuperscript={'cross'} iconSuperscriptColor={'maroon'}
  																				handleShowInstructions={handleShowInstructions} tooltipDirection={tooltipDirection}/>
                                  }
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`move sentence`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'sentenceMove'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`move_sentence`}handleShowInstructions={handleShowInstructions}
                                          tooltipDirection={tooltipDirection}/>
                                  }
                                  {/*!editReview.isTranslation &&
                                      <EditModeOption label={`new image`} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'imageNew'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`image_picture`} handleShowInstructions={handleShowInstructions}
                                          tooltipDirection={tooltipDirection}/>
                                  */}
                              </div>
                          }
                      </div>
                  </div>
              </div>
          )
}


// <div className={styles.moreLeft}>
//     <div className={opened ? styles.labelChoice : styles.hidden}>
//         <a onClick={this.toggleLabels}>
//             {isShowingLabels ? `hide labels` : `show labels`}
//         </a>
//     </div>
// </div>
export default MenuEditModes
