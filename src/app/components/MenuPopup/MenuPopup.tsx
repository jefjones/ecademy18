import { useState } from 'react';import { Link } from 'react-router-dom'
import * as styles from './MenuPopup.css'
import Icon from '../Icon'
import SectionChangeModal from '../SectionChangeModal'
import EditModeOption from '../EditModeOption'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function MenuPopup(props) {
  const [isShowingLabels, setIsShowingLabels] = useState(false)
  const [isShowingSectionChange, setIsShowingSectionChange] = useState(false)

  const {opened, toggleOpen, setEditOptionTools, className, personId, workSummary, editReview, setEditMode, handleShowInstructions} = props
          
  
          return (
              <div className={classes(styles.mainContainer, className)}>
                  <span onClick={toggleOpen} className={classes(styles.jef_caret, opened ? styles.jefCaretUp : styles.jefCaretDown)}></span>
                  <div className={classes((opened ? styles.opened : styles.notOpen), (isShowingLabels ? styles.pushLeft : ''))}>
                      <div className={styles.row}>
                          {opened &&
                              <div className={styles.leftColumn}>
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`edit text (default)`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'edit'} toggleOpen={toggleOpen} showInstructions={false}
                                          iconName={`pencil`} handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.editCount}/>
                                  }
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`new paragraph break`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'breakNew'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`paragraph`} iconSuperscript={'plus'} iconSuperscriptColor={'green'}
  																				handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.breakNewCount}/>
                                  }
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`delete paragraph break`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'breakDelete'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`paragraph`} iconSuperscript={'cross'} iconSuperscriptColor={'maroon'}
  																				handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.breakDeleteCount}/>
                                  }
                                  {!editReview.isTranslation &&
                                      <EditModeOption label={<L p={p} t={`move sentence`}/>} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'sentenceMove'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`move_sentence`}handleShowInstructions={handleShowInstructions}
                                           counts={editReview.modeCounts.sentenceMoveCount}/>
                                  }
                                  {/*!editReview.isTranslation &&
                                      <EditModeOption label={`new image`} editReview={editReview} isShowingLabelsTop={isShowingLabels}
                                          setEditMode={setEditMode} editMode={'imageNew'} toggleOpen={toggleOpen} showInstructions={true}
                                          iconName={`image_picture`}handleShowInstructions={handleShowInstructions}
                                           counts={editReview.modeCounts.imageNewCount}/>
                                  */}
                              </div>
                          }
                      <div className={styles.moreLeft}>
                          <div className={opened ? styles.labelChoice : styles.hidden}>
                              <a onClick={toggleLabels}>
                                  {isShowingLabels ? <L p={p} t={`hide labels`}/> : <L p={p} t={`show labels`}/>}
                              </a>
                          </div>
                          <div className={styles.row}>
                              <a onClick={() => {setEditOptionTools(`SearchTextTool`); toggleOpen()}}>
                                  <Icon pathName={`magnifier`} premium={true} className={opened ? styles.image : styles.hidden}/>
                              </a>
                              {isShowingLabels &&
                                  <a className={opened ? styles.label : styles.hidden} onClick={() => {setEditOptionTools(`SearchTextTool`); toggleOpen()}}>
                                      <L p={p} t={`Search text`}/>
                                  </a>
                              }
                          </div>
                          <div className={styles.row}>
                              <a onClick={() => {setEditOptionTools(`BookmarkTool`); toggleOpen()}}>
                                  <Icon pathName={`bookmark2`} premium={true} className={opened ? styles.image : styles.hidden}/>
                              </a>
                              {isShowingLabels &&
                                  <a className={opened ? styles.label : styles.hidden}  onClick={() => {setEditOptionTools(`BookmarkTool`); toggleOpen()}}>
                                      <L p={p} t={`Bookmark text`}/>
                                  </a>
                              }
                          </div>
                          {workSummary.chapterOptions && workSummary.chapterOptions.length > 1 &&
                              <div className={styles.row}>
                                  <a onClick={() => {handleSectionChangeOpen(); toggleOpen()}}>
                                      <Icon pathName={`sections`}  className={opened ? styles.image : styles.hidden}/>
                                  </a>
                                  {isShowingLabels &&
                                      <a className={opened ? styles.label : styles.hidden} onClick={handleSectionChangeOpen}>
                                          <L p={p} t={`Change sections/chapters`}/>
                                      </a>
                                  }
                              </div>
                          }
                          {workSummary.authorPersonId === personId &&
                              <div className={styles.row}>
                                  <Link to={"/splitChapter"}>
                                      <Icon pathName={`splitter`}  className={opened ? styles.image : styles.hidden}/>
                                  </Link>
                                  {isShowingLabels &&
                                      <Link className={opened ? styles.label : styles.hidden} to={"/splitChapter"}>
                                          <L p={p} t={`Split text into sections`}/>
                                      </Link>
                                  }
                              </div>
                          }
                          {workSummary.authorPersonId === personId &&
                              <div className={styles.row}>
                                  <Link className={styles.lastLinkStyle} to={"/workSettings"}>
                                      <Icon pathName={`cog`} premium={true} className={opened ? styles.image : styles.hidden}/>
                                  </Link>
                                  {isShowingLabels &&
                                      <Link className={opened ? styles.label : styles.hidden} to={"/workSettings"}>
                                          <L p={p} t={`Document settings`}/>
                                      </Link>
                                  }
                              </div>
                          }
                          </div>
                      </div>
                      {isShowingSectionChange &&
                        <SectionChangeModal handleClose={handleSectionChangeClose} heading={<L p={p} t={`Change to another Section/Chapter?`}/>}
                           onClick={handleSectionChangeClose} sections={workSummary.chapterOptions} currentSection={workSummary.chapterId_current}
                           changeToSection={handleSectionChange} personId={personId}/>
                      }
                  </div>
              </div>
          )
}
export default MenuPopup
