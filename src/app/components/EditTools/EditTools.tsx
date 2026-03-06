import { useEffect, useState } from 'react'
import styles from './EditTools.css'
import MenuEditModes from '../MenuEditModes'
import MenuInline from '../MenuInline'
import classes from 'classnames'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import TextareaModal from '../TextareaModal'
import Media from "react-media"
const p = 'component'
import L from '../../components/PageLanguage'

function EditTools(props) {
  const [isShowingSubMenu, setIsShowingSubMenu] = useState(false)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(false)
  const [isShowingModal_sentence, setIsShowingModal_sentence] = useState(false)
  const [isShowingModal_erase, setIsShowingModal_erase] = useState(false)
  const [isShowingModal_deleteEdit, setIsShowingModal_deleteEdit] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener('keyup', checkEscapeKey)
            document.body.addEventListener('click', closeSubMenu); //, true
        
    return () => {
      
              document.body.removeEventListener('keyup', checkEscapeKey)
              document.body.removeEventListener('click', closeSubMenu)
          
    }
  }, [])

  const {className, setEditOptionTools, setEditMode, editReview, showInstructions, personId, workSummary, deleteWork,
                  deleteChapter, setWorkCurrentSelected, setAddInstructions, editMode, toggleLeftSidePanelOpen, sentenceChosen, isDraftView,
                  tabsData, draftComparison, editorTabChosen, counts={}, handleShowInstructions, currentSentence, authorPersonId} = props
          
  
          // let isSentenceEditable = false;
          // if (sentenceChosen) {
          //     if (isDraftView) {
          //         isSentenceEditable = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false;
          //     } else {
          //         isSentenceEditable = true;
          //     }
          // }
          let isDraftCurrentTab = true
          if (isDraftView) {
              isDraftCurrentTab = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false
          }
  
          return (
              <div className={classes(className, styles.container, styles.row)}>
                  <div className={styles.row}>
                      <div className={styles.row} data-rh={`Left side panel shows editors' edits`}>
                          <a onClick={toggleLeftSidePanelOpen}>
                              <Icon pathName={`left_panel`} premium={true} className={classes(styles.imageLeftSide, styles.bitSmaller)}/>
                          </a>
                          <span className={styles.sentenceEditCount}>{counts.sentenceEdits}</span>
                      </div>
                      <div data-rh={`Enter a comment for a sentence.`}>
                          <a onClick={sentenceChosen ? handleCommentOpen : handleSentenceOpen}>
                              <Icon pathName={`comment_text`} premium={true} className={classes(styles.imageLeftSide, (sentenceChosen ? '' : styles.grayedOut), (isDraftCurrentTab ? '' : styles.hidden))} />
                          </a>
                          {isShowingModal_comment && sentenceChosen &&
                              <TextareaModal key={'all'} handleClose={handleCommentClose} heading={``} explain={``} placeholder={<L p={p} t={`Comment?`}/>}
                                  onClick={handleCommentSave} sentenceChosen={sentenceChosen} currentSentenceText={currentSentence}
                                  commentText={editReview.hrefCommentByMe}/>
                          }
                      </div>
                      {!editReview.isTranslation &&
                          <div data-custom={`Erase the chosen sentence.`}>
                              <a onClick={sentenceChosen ? handleEraseConfirmOpen : handleSentenceOpen}>
                                  <Icon pathName={`eraser`} premium={true} className={classes(styles.imageScissors, styles.bitBigger, (sentenceChosen ? '' : styles.grayedOut), (isDraftCurrentTab ? '' : styles.hidden))}/>
                              </a>
                          </div>
                      }
                      <div className={styles.row}  data-rh={'Search for text'}>
                          <a onClick={() => setEditOptionTools(`SearchTextTool`)}>
                              <Icon pathName={`magnifier`} premium={true} className={styles.imageScissors}/>
                          </a>
                      </div>
                      <div className={styles.row} data-rh={'Bookmark sentences'}>
                          <a onClick={() => setEditOptionTools(`BookmarkTool`)}>
                              <Icon pathName={`bookmark2`} premium={true} className={styles.imageScissors}/>
                          </a>
                      </div>
                  </div>
                  {editMode === 'breakNew' &&
                      <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                          <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                          <L p={p} t={`STEPS`}/>
                      </button>
                  }
                  {editMode === 'breakDelete' &&
                      <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                          <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                          <L p={p} t={`STEPS`}/>
                      </button>
                  }
                  {editMode === 'sentenceMove' &&
                      <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                          <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                          <L p={p} t={`STEPS`}/>
                      </button>
                  }
                  {editMode === 'imageNew' &&
                      <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                          <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                          <L p={p} t={`STEPS`}/>
                      </button>
                  }
  
                  {!showInstructions && personId !== authorPersonId &&
                      <Media query="(max-width: 799px)">
                        {matches =>
                          matches || workSummary.authorPersonId === personId ? (
                              <MenuEditModes opened={isShowingSubMenu} toggleOpen={handleToggleSubMenu} setEditOptionTools={setEditOptionTools}
                                  className={styles.subMenu} personId={personId} workSummary={workSummary} infoShow={handleToolLegendOpen}
                                  deleteWork={deleteWork} deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected}
                                  editReview={editReview} setEditMode={setEditMode} handleShowInstructions={handleShowInstructions}
                                  tooltipDirection='right'/>
                          ) : (
                              <MenuInline setEditOptionTools={setEditOptionTools}
                                  className={styles.inlineMenu} personId={personId} workSummary={workSummary} infoShow={handleToolLegendOpen}
                                  deleteWork={deleteWork} deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected}
                                  editReview={editReview} setEditMode={setEditMode} handleShowInstructions={handleShowInstructions}
                                  tooltipDirection='bottom'/>
                          )
                        }
                      </Media>
                   }
                   {isShowingModal_sentence &&
                      <MessageModal handleClose={handleSentenceClose} heading={<L p={p} t={`Choose a sentence`}/>}
                          explainJSX={<L p={p} t={`You must first choose a sentence before choosing this option.`}/>}
                          onClick={handleSentenceClose}/>
                    }
                    {isShowingModal_erase &&
                      <MessageModal handleClose={handleEraseConfirmClose} heading={<L p={p} t={`Erase this Sentence?`}/>}
                         explainJSX={<L p={p} t={`Are you sure you want to erase this sentence?`}/>} isConfirmType={true}
                         currentSentenceText={currentSentence} onClick={handleEraseSentence} />
                    }
            </div>
          )
}
export default EditTools
