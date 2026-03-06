import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './EditorEditList.css'
import classes from 'classnames'
import EditFilterModal from '../../components/EditFilterModal'
import TextareaModal from '../TextareaModal'
import MessageModal from '../../components/MessageModal'
import EditModal from '../EditModal'
import DateMoment from '../../components/DateMoment'
//import Diff from 'react-stylable-diff';
import Icon from '../../components/Icon'
const p = 'component'
import L from '../../components/PageLanguage'

/*
    ToDo:
    1. getOriginalSentence(personId, chapterId, hrefId)
        It's very possible that the originalText in the EditDetail record will not be accurate.  There is the UpdatedAuthorText which
            should be found in the EditDetail record, however.
    2. We will need to get the EditDetail record, too.
*/

function EditorEditList(props) {
  const [acceptedEditDetailId, setAcceptedEditDetailId] = useState(0)
  const [isAuthorAcceptedEdit, setIsAuthorAcceptedEdit] = useState(false)
  const [editDifferenceView, setEditDifferenceView] = useState(false)
  const [isShowingModal_single, setIsShowingModal_single] = useState(false)
  const [isShowingModal_acceptAll, setIsShowingModal_acceptAll] = useState(false)
  const [isShowingModal_deleteAll, setIsShowingModal_deleteAll] = useState(false)
  const [isShowingModal_filter, setIsShowingModal_filter] = useState(false)
  const [isShowingModal_info, setIsShowingModal_info] = useState(false)
  const [infoIndex, setInfoIndex] = useState(0)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(false)
  const [commentIndex, setCommentIndex] = useState(0)
  const [isShowingModal_edit, setIsShowingModal_edit] = useState(false)
  const [editIndex, setEditIndex] = useState(0)
  const [currentHrefId, setCurrentHrefId] = useState(0)
  const [currentAuthorSentence, setCurrentAuthorSentence] = useState('')
  const [newEditText, setNewEditText] = useState(undefined)

  const handleSave = (hrefId) => {
    return (isComment) => (editText) => {
            const {personId, workId, chapterId, languageId, setEditDetail, editDetailsPerson} = props
  }

  const handleCommentClose = () => {
    return setIsShowingModal_comment(false)

  }
  }
  const handleCommentOpen = (commentIndex) => {
    return setIsShowingModal_comment(true); setCommentIndex(commentIndex)

  }
  const handleCommentSave = (commentText) => {
    
            props.saveEditOrComment(true)(commentText)(null, false)
            setIsShowingModal_comment(false)
        
  }

  const handleSingleDeleteClose = () => {
    return setIsShowingModal_single(false)
  }

  const handleSingleDeleteOpen = () => {
    return setIsShowingModal_single(true)
  }

  const handleAllDeleteClose = () => {
    return setIsShowingModal_deleteAll(false)
  }

  const handleAllDeleteOpen = () => {
    return setIsShowingModal_deleteAll(true)
  }

  const handleAllAcceptClose = () => {
    return setIsShowingModal_acceptAll(false)
  }

  const handleAllAcceptOpen = () => {
    return setIsShowingModal_acceptAll(true)
  }

  const handleFilterClose = () => {
    return setIsShowingModal_filter(false)
  }

  const handleFilterOpen = () => {
    return setIsShowingModal_filter(true)
  }

  const handleInfoClose = () => {
    return setIsShowingModal_info(false)
  }

  const handleInfoOpen = (infoIndex) => {
    return setIsShowingModal_info(true); setInfoIndex(infoIndex)
  }

  const handleEditClose = () => {
    return setIsShowingModal_edit(false)
  }

  const handleEditOpen = (editIndex, hrefId, hrefSentence) => {
    return setIsShowingModal_edit(true); setEditIndex(editIndex); setCurrentHrefId(hrefId); setCurrentAuthorSentence(hrefSentence)
  }

  const {editDetailsPerson, personId, authorPersonId, originalSentence, returnToSummary, updateFilter, localFilter} = props
          
  
          let editPendingCount = editDetailsPerson && editDetailsPerson.length > 0 ? editDetailsPerson.filter(m => m.pendingFlag).length : 0
          let editHistoryCount = editDetailsPerson && editDetailsPerson.length > 0 ? editDetailsPerson.filter(m => !m.pendingFlag).length : 0
          let editorFullName = editDetailsPerson && editDetailsPerson.length > 0 && editDetailsPerson[0].personName
          let isCommentSave = true
  
          return (
              <div className={styles.container}>
                  <div className={styles.topInfo}>
                      <a className={styles.returnText} onClick={returnToSummary}>
                          <Icon pathName={`left_arrow`}/>
                          <span className={styles.backToSummary}><L p={p} t={`back to summary`}/></span>
                      </a>
                      <div className={styles.editCount}>
                          <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                          <div className={classes(styles.row, styles.editsHistory)}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                      </div>
                      <a className={styles.filterLink} onClick={handleFilterOpen}>{`filter`}</a>
                      <b className={styles.caret}/>
                  </div>
                  <span className={styles.editorName}>{editorFullName}</span>
                  <div className={styles.buttonRow}>
                      {personId === authorPersonId && editDetailsPerson && editDetailsPerson.length > 0 &&
                          <a className={styles.acceptAllButton} onClick={handleAllAcceptOpen}><L p={p} t={`Accept All`}/></a>
                      }
                      {personId === authorPersonId && editDetailsPerson && editDetailsPerson.length > 0 &&
                          <a className={styles.deleteAllButton} onClick={handleAllDeleteOpen}><L p={p} t={`Delete All`}/></a>
                      }
                  </div>
                  <div className={styles.editDetails}>
                      {editDetailsPerson && editDetailsPerson.length > 0 &&
                          editDetailsPerson.filter(m => m.personId === localFilter.personId).map((m, i) => {
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
  
                              let differenceOriginalSentence = originalSentence;  //eslint-disable-line
                              let differenceEditText = m.editText;    //eslint-disable-line
                              if (editDifferenceView) {
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
                                  <div className={styles.toolOptions}>
                                      {!m.pendingFlag &&
                                          <a className={styles.restoreButton} onClick={() => handleRestore(m.editDetailId)}>Restore</a>
                                      }
                                      {m.pendingFlag &&
                                          <a onClick={() => handleEditOpen(i, m.hrefId, m.updatedAuthorText ? m.updatedAuthorText : m.authorText)}>
                                              <Icon pathName={`pencil`} className={styles.choiceIcons_less}/>
                                          </a>
                                      }
                                      {isShowingModal_edit && editIndex === i &&
                                          <EditModal key={i} handleClose={() => handleEditClose(editIndex)}
                                              originalText={m.updatedAuthorText ? m.updatedAuthorText : m.authorText} saveEdit={handleSave(!isCommentSave)}
                                              editText={getMeHrefText(m.hrefId, m.editText ? m.editText : m.updatedAuthorText ? m.updatedAuthorText : m.authorText)} />
                                      }
                                      {m.pendingFlag && (m.personId !== personId || !m.isComment) &&
                                          <a onClick={() => handleCommentOpen(i)}>
                                              <Icon pathName={`comment_text`} premium={true} className={styles.choiceIcons_less}/>
                                          </a>
                                      }
                                      {isShowingModal_comment && commentIndex === i &&
                                          <TextareaModal key={i} handleClose={handleCommentClose} heading={``} explain={``}
                                              onClick={handleSave(m.hrefId)(isCommentSave)} placeholder={`Comment?`}
                                              currentSentenceText={m.updatedAuthorText ? m.updatedAuthorText : m.authorText} commentText={getMeHrefComment(m.hrefId)}/>
                                      }
                                      {m.pendingFlag && m.personId !== personId &&
                                          <span>
                                              <a onClick={acceptFunction}>
                                                  <Icon pathName={`checkmark`} className={styles.choiceIcons_less}/>
                                              </a>
                                              <span className={styles.voteCount}>{m.agreeCount}</span>
                                          </span>
                                      }
                                      {m.pendingFlag && m.personId !== personId &&
                                          <span>
                                              <a onClick={() => handleVote(m.editDetailId, 'DISAGREE')}>
                                                  <Icon pathName={`cross`} className={styles.choiceIcons}/>
                                              </a>
                                              <span className={styles.voteCount}>{m.disagreeCount}</span>
                                          </span>
                                      }
                                      {m.pendingFlag && m.personId !== personId &&
                                          <span>
                                              <a onClick={() => handleVote(m.editDetailId, 'TROLL')}>
                                                  <Icon pathName={`blocked`} className={styles.choiceIcons}/>
                                              </a>
                                              <span className={styles.voteCount}>{m.trollCount}</span>
                                          </span>
                                      }
                                      {!m.pendingFlag &&
                                          <span>
                                              <Icon pathName={`checkmark`} className={styles.historyChoiceIcons}/>
                                              <span className={styles.voteCount}>{m.agreeCount}</span>
                                          </span>
                                      }
                                      {!m.pendingFlag &&
                                          <span>
                                              <Icon pathName={`cross`} className={styles.historyChoiceIcons}/>
                                              <span className={styles.voteCount}>{m.disagreeCount}</span>
                                          </span>
                                      }
                                      {!m.pendingFlag &&
                                          <span>
                                              <Icon pathName={`blocked`} className={styles.historyChoiceIcons}/>
                                              <span className={styles.voteCount}>{m.trollCount}</span>
                                          </span>
                                      }
                                      {m.pendingFlag && (m.personId === personId || personId === authorPersonId) &&
                                          <a onClick={handleSingleDeleteOpen}>
                                              <Icon pathName={`garbage_bin`} className={styles.choiceIcons}/>
                                          </a>
                                      }
                                      {isShowingModal_single &&
                                        <MessageModal key={i} handleClose={handleSingleDeleteClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                                           explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                                           onClick={() => handleSingleDelete(m.editDetailId)} />
                                      }
                                      {m.personId !== personId &&
                                          <a onClick={() => handleFullVersionView(m.personId, m.hrefId)}>
                                              <Icon pathName={`docs_compare`} className={styles.choiceIcons_less}/>
                                          </a>
                                      }
                                      <a onClick={() => handleInfoOpen(i)}>
                                          <Icon pathName={`info`} className={styles.choiceIcons}/>
                                      </a>
                                      {isShowingModal_info && infoIndex === i &&
                                        <MessageModal key={i} handleClose={handleInfoClose} heading={``} explainJSX={tooltipText} onClick={handleInfoClose} />
                                      }
                                  </div>
                              </div>
                              )}
                          )
                      }
                  </div>
                  {isShowingModal_filter &&
                      <EditFilterModal handleClose={handleFilterClose} editFilter={localFilter} updateFilter={updateFilter} setFilters={handleSetAllFilter}/>
                  }
                  {isShowingModal_deleteAll &&
                    <MessageModal key={'delelteAll'} handleClose={handleAllDeleteClose} heading={<L p={p} t={`Delete All Edits and Comments?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to delete all of the edits and comments for this sentence?`}/>} isConfirmType={true}
                       onClick={handleAllDeletes} />
                  }
                  {isShowingModal_acceptAll &&
                    <MessageModal key={'acceptAll'} handleClose={handleAllAcceptClose} heading={<L p={p} t={`Accept All Edits and Comments?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to accept all of the edits and comments for this editor?`}/>} isConfirmType={true}
                       onClick={handleAllAccepts} />
                  }
              </div>
          )
}


//                                {editDifferenceView && !m.isComment
                                //     ? <Diff inputA={differenceOriginalSentence} 
                                //         inputB={differenceEditText}
                                //         className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                //         type="words" />
                                //     : <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                //         id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
                                // }
export default EditorEditList
