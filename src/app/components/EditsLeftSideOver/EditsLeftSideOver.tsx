import { useEffect, useState } from 'react'
import * as styles from './EditsLeftSideOver.css'
import classes from 'classnames'
import ReactTooltip from 'react-tooltip'
import ConfigModal from '../../components/ConfigModal'
import MessageModal from '../../components/MessageModal'
import DateMoment from '../../components/DateMoment'
import Icon from '../../components/Icon'
const p = 'component'
import L from '../../components/PageLanguage'
//import Diff from 'react-stylable-diff';

function EditsLeftSideOver(props) {
  const [newEditText, setNewEditText] = useState('')
  const [acceptedEditDetailId, setAcceptedEditDetailId] = useState(0)
  const [isAuthorAcceptedEdit, setIsAuthorAcceptedEdit] = useState(false)
  const [isShowingModal_single, setIsShowingModal_single] = useState(false)
  const [isShowingModal_all, setIsShowingModal_all] = useState(false)
  const [isShowingModal_config, setIsShowingModal_config] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(0)
  const [keepHistoryOn, setKeepHistoryOn] = useState(undefined)
  const [keepAutoNextOn, setKeepAutoNextOn] = useState(undefined)
  const [keepEditDifferenceOn, setKeepEditDifferenceOn] = useState(undefined)

  useEffect(() => {
    
            const {editDetailsByHrefId, personId, originalSentence, personConfig} = props
            //document.body.addEventListener("click", handleClosed);
            //We are taking away the button reaction since we needed the real estate at the bottom of the screen and above the tool bar.  Double clicking on a sentence will open up the left pane.
            //button.addEventListener("click", handleDisplay);  //We don't want to have a click here since it is so close to the options buttons below it.
            cancelButton.addEventListener("click", handleClosed)
            closeButton.addEventListener("click", handleClosed)
            resetButton.addEventListener("click", handleResetToOriginal)
    
            let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
            let thisUserText = hasUserEdit ? hasUserEdit.editText : originalSentence
            setNewEditText(thisUserText)
            setKeepHistoryOn(personConfig.historySentenceView)
            setKeepAutoNextOn(personConfig.nextSentenceAuto)
            setKeepEditDifferenceOn(personConfig.editDifferenceView)
    
            if (personConfig.historySentenceView) {
                setKeepHistoryOn(true)
            }
            if (personConfig.nextSentenceAuto) {
                setKeepAutoNextOn(true)
            }
            if (personConfig.editDifferenceView) {
                setKeepEditDifferenceOn(true)
            }
        
    return () => {
      
              const {editDetailsByHrefId, personId, originalSentence} = props
              //document.body.removeEventListener("click", handleClosed);
              let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
              let thisUserText = hasUserEdit ? hasUserEdit.editText : originalSentence
              setNewEditText(thisUserText)
          
    }
  }, [])

  const handleSingleDeleteClose = () => {
    return setIsShowingModal_single(false)
    

  }
  const handleSingleDeleteOpen = (deleteIndex) => {
    return setIsShowingModal_single(true); setDeleteIndex(deleteIndex)
    

  }
  const handleAllDeleteClose = () => {
    return setIsShowingModal_all(false)
    

  }
  const handleAllDeleteOpen = () => {
    return setIsShowingModal_all(true)
    

  }
  const handleConfigClose = () => {
    return setIsShowingModal_config(false)
    

  }
  const handleConfigOpen = () => {
    return setIsShowingModal_config(true)
    

  const {labelClass, editDetailsByHrefId, personId, authorPersonId, leftSidePanelOpen, originalSentence, personConfig,
                      updatePersonConfig, setNextHrefId} = props
          
  
          let editPendingCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => m.pendingFlag).length : 0
          let editHistoryCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => !m.pendingFlag).length : 0
          let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
          let thisUserText = hasUserEdit ? hasUserEdit.editText : originalSentence
  
          let originalSentenceText = originalSentence
          originalSentenceText = originalSentenceText && originalSentenceText
              .replace(/<[^>]*>/g, ' ')
             .replace(/\s{2,}/g, ' ')
             .trim()
          return (
              <div className={styles.container}>
                  <div className={classes(labelClass, styles.editCount)} ref={(ref) => (button = ref)}>
                      <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                      <div className={styles.row}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                  </div>
                  <div className={classes(styles.children, (leftSidePanelOpen && styles.opened))}>
                      <a className={styles.closeButton} ref={(ref) => (closeButton = ref)}>X</a>
                      <span className={styles.authorDateLine}><L p={p} t={`Original Text`}/></span>
                      <span className={styles.authorSentence} ref={(ref) => (authorSentence = ref)}
                          id="authorSentence">{originalSentenceText}</span>
                      <div className={styles.resetDiv}>
                          <a className={styles.resetButton} ref={(ref) => (resetButton = ref)}>Reset</a>
                      </div>
                      <div className={styles.outerBorder}>
                          <span className={styles.myEdit}><L p={p} t={`my edit:`}/></span>
                          <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: thisUserText}}
                              id="singleEditor" ref={ref => {singleEditor = ref}} onChange={handleTextChange}/>
                      </div>
                      <div className={styles.buttonRow}>
                          {personId === authorPersonId && editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                              <a className={styles.deleteAllButton} onClick={handleAllDeleteOpen}><L p={p} t={`Delete All`}/></a>
                          }
                          {isShowingModal_all &&
                            <MessageModal key={'all'} handleClose={handleAllDeleteClose} heading={<L p={p} t={`Delete All Edits and Comments?`}/>}
                               explainJSX={<L p={p} t={`Are you sure you want to delete all of the edits and comments for this sentence?`}/>} isConfirmType={true}
                               onClick={handleAllDeletes} />
                          }
                          <a className={styles.cancelButton} ref={(ref) => (cancelButton = ref)}>Cancel</a>
                          <button className={styles.saveButton} onClick={handleSave}><L p={p} t={`Save`}/></button>
                          {personConfig.nextSentenceAuto && <a className={styles.prevButton} onClick={() => setNextHrefId('PREV')}><L p={p} t={`Prev`}/></a>}
                          {personConfig.nextSentenceAuto && <a className={styles.nextButton} onClick={setNextHrefId}><L p={p} t={`Next`}/></a>}
  
                          <a onClick={handleConfigOpen}>
                              <Icon pathName={`gearSettings`} className={styles.launchButton}/>
                          </a>
  
                          {isShowingModal_config &&
                              <ConfigModal personId={personId} personConfig={personConfig} updatePersonConfig={updatePersonConfig}
                                  handleClose={handleConfigClose} heading={``} explain={``}/>}
                      </div>
  
                      <div className={styles.editDetails}>
                          {editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                              editDetailsByHrefId.map((m, i) => {
                                  let tooltipText = ""
                                  if (m.pendingFlag) {
                                      tooltipText += !m.isComment && m.personId !== personId ? <div><strong><L p={p} t={`Accept and choose this edit.`}/></strong>  <L p={p} t={`You can edit it further.  This will score this edit favorably.`}/></div> : ""
                                      tooltipText += personId === authorPersonId ? <L p={p} t={`All other edits which haven't been deleted (rejected) will be scored minimally for effort.`}/> : ""
                                      tooltipText += m.personId !== personId  ? <div><strong><L p={p} t={`Disagree with this edit.`}/></strong> <L p={p} t={`But use this sparingly since this decreases the user's score.  Please, be courteous.`}/></div> : ""
                                      tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`Troll!`}/></strong><L p={p} t={`Use this tool to mark the entry as obnoxious or destructive.  The author ought to take away access for this editor.`}/></div> : ""
                                      tooltipText += (m.personId === personId || personId === authorPersonId) ? <div><strong><L p={p} t={`Delete.`}/></strong>  <L p={p} t={`You can delete your own edits or, if you are the author, you can delete others' edits.`}/></div> : ""
                                      tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`See this editor's full version.`}/></strong> <L p={p} t={`This will return you to the main screen and automatically choose the tab where you can read their full version with their edits marked.`}/></div> : ""
                                  } else {
                                      tooltipText += <div><strong><L p={p} t={`Restore`}/></strong>  <L p={p} t={`This is a processed edit.  It is showing up because your settings indicate that you want to view this sentence's history.  You can click on 'restore' in order to have a chance to accept it or edit it further.`}/></div>
                                  }
  
                                  let differenceOriginalSentence = originalSentence  //eslint-disable-line
                                  let differenceEditText = m.editText;  //eslint-disable-line
                                  if (personConfig.editDifferenceView) {
                                      differenceOriginalSentence = differenceOriginalSentence && differenceOriginalSentence
                                          .replace(/<[^>]*>/g, ' ')
                                         .replace(/\s{2,}/g, ' ')
                                         .trim()
                                      differenceEditText = differenceEditText && differenceEditText
                                          .replace(/<[^>]*>/g, ' ')
                                         .replace(/\s{2,}/g, ' ')
                                         .trim()
                                  }
  
                                  let acceptFunction = personId === authorPersonId
                                          ? () => handleAcceptEdit(m.editDetailId)
                                          : () => handleVote(m.editDetailId, 'AGREE')
  
                              return (
                                  <div className={styles.editDisplay} key={i}>
                                      <span className={styles.authorDateLine}>
                                          {m.personName + ` - `}
                                          <DateMoment date={m.entryDate} className={styles.authorDateLine}/>
                                          {m.isComment && <span className={styles.isComment}> Comment </span>}
                                          {!m.pendingFlag && m.authorAccepted && <span className={styles.isAccepted}> Accepted </span>}
                                          {!m.pendingFlag && !m.authorAccepted && <span className={styles.isProcessed}> Processed </span>}
                                      </span>
                                          <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                              id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
                                      {m.pendingFlag &&
                                          <div className={styles.toolOptions}>
                                              {!m.isComment && m.personId !== personId &&
                                                  <span>
                                                      <a onClick={acceptFunction}>
                                                          <Icon pathName={`checkmark`} className={styles.choiceIcons}/>
                                                      </a>
                                                      <span className={styles.voteCount}>{m.agreeCount}</span>
                                                  </span>
                                              }
                                              {m.personId !== personId &&
                                                  <span>
                                                      <a onClick={() => handleVote(m.editDetailId, 'DISAGREE')}>
                                                          <Icon pathName={`cross`} className={styles.choiceIcons}/>
                                                      </a>
                                                      <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                  </span>
                                              }
                                              {m.personId !== personId &&
                                                  <span>
                                                      <a onClick={() => handleVote(m.editDetailId, 'TROLL')}>
                                                          <Icon pathName={`blocked`} className={styles.choiceIcons}/>
                                                      </a>
                                                      <span className={styles.voteCount}>{m.trollCount}</span>
                                                  </span>
                                              }
                                              {(m.personId === personId || personId === authorPersonId) &&
                                                  <a onClick={() => handleSingleDeleteOpen(i)}>
                                                      <Icon pathName={`garbage_bin`} className={styles.choiceIcons}/>
                                                  </a>
                                              }
                                              {isShowingModal_single && deleteIndex === i &&
                                                <MessageModal key={i} handleClose={handleSingleDeleteClose} heading={`Delete this Edit?`}
                                                   explain={`Are you sure you want to delete this edit?`} isConfirmType={true}
                                                   onClick={() => handleSingleDelete(m.editDetailId)} />
                                              }
  
                                              {m.personId !== personId &&
                                                  <a onClick={() => handleFullVersionView(m.personId)}>
                                                      <Icon pathName={`docs_compare`} className={styles.choiceIcons}/>
                                                  </a>
                                              }
                                              <span data-html={true} data-tip={tooltipText}>
                                                  <Icon pathName={`info`} className={styles.choiceIcons}/>
                                                  <ReactTooltip place="left" type="light" effect="solid" className={styles.tooltip} event={`click`}/>
                                              </span>
                                          </div>
                                      }
                                      {!m.pendingFlag &&
                                          <div className={styles.toolOptions}>
                                              <a className={styles.restoreButton} onClick={() => handleRestore(m.editDetailId)}>Restore</a>
                                              {!m.isComment && m.personId !== personId &&
                                                  <span>
                                                      <Icon pathName={`checkmark`} className={styles.historyChoiceIcons}/>
                                                      <span className={styles.voteCount}>{m.agreeCount}</span>
                                                  </span>
                                              }
                                              {m.personId !== personId &&
                                                  <span>
                                                      <Icon pathName={`cross`} className={styles.historyChoiceIcons}/>
                                                      <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                  </span>
                                              }
                                              {m.personId !== personId &&
                                                  <span>
                                                      <Icon pathName={`blocked`} className={styles.historyChoiceIcons}/>
                                                      <span className={styles.voteCount}>{m.trollCount}</span>
                                                  </span>
                                              }
                                              <span data-html={true} data-tip={tooltipText}>
                                                  <Icon pathName={`info`} className={styles.choiceIcons}/>
                                                  <ReactTooltip place="left" type="light" effect="solid" className={styles.tooltip} event={`click`}/>
                                              </span>
                                          </div>
                                      }
                                  </div>
                                  )}
                              )
                          }
                      </div>
                  </div>
              </div>
          )
}


// {personConfig.editDifferenceView && !m.isComment
//     ? <Diff inputA={differenceOriginalSentence} 
//         inputB={differenceEditText}
//         className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
//         type="words" />
//     : <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
//         id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
// }
export default EditsLeftSideOver
