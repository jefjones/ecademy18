import { useEffect, useState } from 'react'
import * as styles from './SentenceEdits.css'
import classes from 'classnames'
import ConfigModal from '../../components/ConfigModal'
import MessageModal from '../../components/MessageModal'
import DateMoment from '../../components/DateMoment'
import TextareaModal from '../../components/TextareaModal'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import DiffWord from '../../components/DiffWord'
const p = 'component'
import L from '../../components/PageLanguage'

function SentenceEdits(props) {
  const [newEditText, setNewEditText] = useState('')
  const [acceptedEditDetailId, setAcceptedEditDetailId] = useState(0)
  const [isShowingModal_single, setIsShowingModal_single] = useState(false)
  const [isShowingModal_all, setIsShowingModal_all] = useState(false)
  const [isShowingModal_blank, setIsShowingModal_blank] = useState(false)
  const [isShowingModal_config, setIsShowingModal_config] = useState(false)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(false)
  const [isShowingModal_erase, setIsShowingModal_erase] = useState(false)
  const [isShowingLegend, setIsShowingLegend] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(0)
  const [caretClassName, setCaretClassName] = useState(classes(styles.jef_caret, styles.jefCaretDown))
  const [keepHistoryOn, setKeepHistoryOn] = useState(undefined)
  const [keepAutoNextOn, setKeepAutoNextOn] = useState(undefined)
  const [keepEditDifferenceOn, setKeepEditDifferenceOn] = useState(undefined)
  const [origTextExpanded, setOrigTextExpanded] = useState(undefined)

  useEffect(() => {
    
    	    //document.getElementById('singleEditor').focus();  Don't do this since it will cause the keyboard to come up immediately when that might not be what the user wants by default.
    	    singleEditor.addEventListener('keyup', checkForKeypress)
    
    	    const { personConfig, isTranslation} = props
    	    //document.body.addEventListener("click", handleClosed);
    	    //We are taking away the button reaction since we needed the real estate at the bottom of the screen and above the tool bar.  Double clicking on a sentence will open up the left pane.
    	    cancelButton.addEventListener("click", handleClosed)
    	    closeButton.addEventListener("click", handleClosed)
    	    if (isTranslation) {
    	        resetButton && resetButton.addEventListener("click", handleResetToClear)
    	    } else {
    	        resetButton && resetButton.addEventListener("click", handleResetToOriginal)
    	    }
    
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
      
            const {editDetailsByHrefId, personId, originalSentence, isTranslation} = props
            //document.body.removeEventListener("click", handleClosed);
            let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
            let thisUserText = hasUserEdit ? hasUserEdit.editText : (isTranslation ? '' : originalSentence)
            setNewEditText(thisUserText)
        
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          //singleEditor.focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
      
  }, [])

  const handleUpdatePersonConfig = (personId, configOption, value) => {
    
          const {updatePersonConfig} = props
    
          if (configOption === `HistorySentenceViewKeepOn`) {
              setKeepHistoryOn(value)
    
          } else if (configOption === `NextSentenceAutoKeepOn`) {
              setKeepAutoNextOn(value)
    
          } else if (configOption === `EditDifferenceViewKeepOn`) {
              setKeepEditDifferenceOn(value)
          }
    
          updatePersonConfig(personId, configOption, value)
      
  }

  const handleNextButton = () => {
    
          document.getElementById('singleEditor').innerHTML = ""; //That's in case there isn't another sentence to pick up.
          props.setNextHrefId()
      
  }

  const checkForKeypress = (evt) => {
    
          evt.key === 'Escape' && props.leftSidePanelOpen && props.toggleLeftSidePanelOpen()
      
  }

  const handleClosed = () => {
    
          let {toggleLeftSidePanelOpen, personConfig} = props
          toggleLeftSidePanelOpen()
          personConfig && !personConfig.historySentenceView && setKeepHistoryOn(false)
          personConfig && !personConfig.nextSentenceAuto && setKeepAutoNextOn(false)
          personConfig && !personConfig.editDifferenceView && setKeepEditDifferenceOn(false)
      
  }

  const handleAcceptTranslation = () => {
    
          document.getElementById('singleEditor').innerHTML = props.translatedSentence
          //We do not save the editDetail record proactively here since this accepted translation is machine translation which cannot be depended on for blind accuracy.
      
  }

  const handleResetToOriginal = () => {
    
          document.getElementById('singleEditor').innerHTML = props.originalSentence
      
  }

  const handleResetToClear = () => {
    
          document.getElementById('singleEditor').innerHTML = ''
      
  }

  const handleAcceptEdit = (editDetailId) => {
    
          //The accepting of an edit will commit Me to taking that editText into the editor window.  They can still make an edit to the edit.
          //But overall this implies that they consider the edit a favorable option so that they will be scored well for it.
          //When the author accepts it, it is higher than if it is just another editor.  So ... only one acceptedEditDetailId per sentence for this page.
          const {editDetailsByHrefId, personId, authorPersonId, saveEdit} = props
          let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId && !m.isComment)[0] || []
          if (editDetail) {
              if (editDetail.editText === "[<i>erased</i>]") {
                  document.getElementById('singleEditor').innerHTML = ""
                  //Save it proactively so that the user doesn't really have to hit Save on the left panel, so this is saved in case they leave by closing the panel.
                  saveEdit(false)("[<i>erased</i>]")(editDetailId, personId === authorPersonId)
              } else {
                  document.getElementById('singleEditor').innerHTML = editDetail.editText
                  //Save it proactively so that the user doesn't really have to hit Save on the left panel, so this is saved in case they leave by closing the panel.
                  saveEdit(false)(editDetail.editText)(editDetailId, personId === authorPersonId)
              }
              setAcceptedEditDetailId(editDetail.editDetailId)
          }
      
  }

  const handleSave = () => {
    
          const {saveEdit, acceptedEditDetailId, toggleLeftSidePanelOpen, personConfig, personId, authorPersonId, setNextHrefId, isTranslation} = props
          //I was having trouble getting the newEditText to have any data in it, so I went right to the source and pulled it from the ContentEditable editorDiv
          if (isTranslation && document.getElementById(`singleEditor`).innerText === "") {
              handleBlankOpen()
          } else {
            saveEdit(false)(document.getElementById(`singleEditor`).innerHTML)(acceptedEditDetailId, personId === authorPersonId)
            isTranslation || personConfig.nextSentenceAuto ? setNextHrefId() : toggleLeftSidePanelOpen()
            document.getElementById(`singleEditor`).innerHTML = ""
          }
      
  }

  const handleVote = (editDetailId, voteType) => {
    
          const {editDetailsByHrefId, saveEditVote, saveEdit, personId, authorPersonId} = props
          let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || []
          if (voteType === "AGREE" && editDetail && !editDetail.isComment) {
              document.getElementById('singleEditor').innerHTML = editDetail.editText
              //Save the edit proactively so that the user doesn't really have to hit Save on this left panel, so this is saved in case they leave by closing this panel.
              saveEdit(false)(editDetail.editText)(editDetailId, personId === authorPersonId)
          }
          if (editDetail) {
              saveEditVote(editDetail.editDetailId, voteType, editDetail.personId, editDetail.editText, "", editDetail.isComment, false)
          }
      
  }

  const handleSingleDelete = (editDetailId) => {
    
          const {deleteEditOrComment, editDetailsByHrefId} = props
          setIsShowingModal_single(false)
          let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || []
          if (editDetail) {
              //We are going to have to handle the Paragraph details, too.  For now we will just consider the editDetailId
              //The paragraph has two different IDs:  one for existing and one for new.  Maybe they can be combined.
              //ToDo: Maybe (most likely?) implement a voter comment about their choice for troll or disagree.  See VoteComment in position 4
              //isParagraph is the last position (set as false by default for now.)
              deleteEditOrComment(editDetail.editDetailId)
          }
      
  }

  const handleRestore = (editDetailId, voteType) => {
    
          const {restoreEditOrComment, editDetailsByHrefId} = props
          let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || []
          if (editDetail) {
              restoreEditOrComment(editDetail.editDetailId)
          }
      
  }

  const handleAllDeletes = () => {
    
          const {deleteEditOrComment, editDetailsByHrefId} = props
          setIsShowingModal_all(false)
          editDetailsByHrefId.forEach(m => {
              deleteEditOrComment(m.editDetailId)
          })
      
  }

  const handleTextChange = (e) => {
    
          setNewEditText(e.target.value)
      
  }

  const handleFullVersionView = (tabPersonId) => {
    
          props.setTabSelected(tabPersonId, true); //force the full version view so that the tabs are displayed in the tool area above automatically.
          props.toggleLeftSidePanelOpen()
      
  }

  const handleSingleDeleteClose = () => {
    
          setIsShowingModal_single(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleSingleDeleteOpen = (deleteIndex) => {
    
          setIsShowingModal_single(true); setDeleteIndex(deleteIndex)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleAllDeleteClose = () => {
    
          setIsShowingModal_all(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleAllDeleteOpen = () => {
    
          setIsShowingModal_all(true)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleBlankClose = () => {
    
          setIsShowingModal_blank(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleBlankOpen = () => {
    
          setIsShowingModal_blank(true)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleConfigClose = () => {
    
          setIsShowingModal_config(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleConfigOpen = () => {
    
          setIsShowingModal_config(true)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleCommentSave = (commentText) => {
    
          props.saveEditOrComment(true)(commentText)(null, false)
          setIsShowingModal_comment(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleCommentClose = () => {
    
          setIsShowingModal_comment(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleCommentOpen = () => {
    
          setIsShowingModal_comment(true)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleEraseConfirmClose = () => {
    
          setIsShowingModal_erase(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleEraseConfirmOpen = () => {
    
          setIsShowingModal_erase(true)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleEraseSentence = () => {
    
          const {saveEditOrComment} = props
          saveEditOrComment(false)("[<i>erased</i>]")(null, false)
          setIsShowingModal_erase(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleEditIconLegendClose = () => {
    
          setIsShowingLegend(false)
          props.toggleLeftSidePanelOpen()
      
  }

  const handleEditIconLegendOpen = () => {
    
          props.toggleLeftSidePanelOpen()
          setIsShowingLegend(true)
      
  }

  const handleToggle = (ev) => {
    
          ev.preventDefault()
          
          origTextExpanded ? handleCollapse() : handleExpand()
      
  }

  const handleExpand = () => {
    
          setOrigTextExpanded(true); setCaretClassName(classes(styles.jef_caret, styles.jefCaretUp))
      
  }

  const handleCollapse = () => {
    
          setOrigTextExpanded(false); setCaretClassName(classes(styles.jef_caret, styles.jefCaretDown))
      
  }

  const {labelClass, editDetailsByHrefId, personId, authorPersonId, leftSidePanelOpen, originalSentence, personConfig, editorColors,
                  setNextHrefId, isTranslation, translatedSentence, editReview, editText, workSummary} = props
      
  
      let editPendingCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => m.pendingFlag).length : 0
      let editHistoryCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => !m.pendingFlag).length : 0
      //let thisUserText = editText;
      let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
      let thisUserText = hasUserEdit
          ? hasUserEdit.editText
          : (isTranslation
              ? (personConfig.translateInsertSuggestion
                  ? translatedSentence
                  : '')
              : originalSentence)
  
      let regex = "/<(.|\n)*?>/"
      let originalSentenceText = originalSentence
      originalSentenceText = originalSentenceText && originalSentenceText.replace(regex, "")
              .replace(/<br>/g, "")
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .trim()
  
      while (originalSentenceText.indexOf('&nbsp;') > -1) originalSentenceText = originalSentenceText.replace('&nbsp;', ' ')
  
      return (
          <div className={styles.container}>
              <div className={classes(labelClass, styles.editCount)} ref={(ref) => (button = ref)}>
                  <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                  <div className={styles.row}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                  <a className={styles.closeButton} ref={(ref) => (closeButton = ref)}><L p={p} t={`Close`}/></a>
              </div>
              <div className={classes(styles.children, (leftSidePanelOpen && styles.opened))}>
                  <div>
                      <div className={styles.row}>
                          <span className={styles.authorDateLine}><L p={p} t={`Original Text`}/></span>
                          {workSummary && workSummary.languageId_current === workSummary.nativeLanguageId &&
  														<a onClick={handleToggle} className={styles.link}>
  		                            {origTextExpanded ? <L p={p} t={`(hide)`}/> : <L p={p} t={`(show)`}/>}
  		                        </a>
  												}
  												<div className={styles.languageName}>{workSummary.languageName}</div>
                      </div>
                      {(origTextExpanded || (workSummary && workSummary.languageId_current !== workSummary.nativeLanguageId)) &&
                          <span className={styles.authorSentence} ref={(ref) => (authorSentence = ref)} id="authorSentence">
                              {originalSentenceText}
                          </span>
                      }
                  </div>
                  {(origTextExpanded || (workSummary && workSummary.languageId_current !== workSummary.nativeLanguageId)) &&
                      <div className={styles.resetDiv}>
                          <a className={styles.resetButton} onClick={isTranslation ? handleResetToClear : handleResetToOriginal}><L p={p} t={`Reset`}/></a>
                      </div>
                  }
                  <div className={styles.outerBorder}>
                      <span className={styles.myEdit}><L p={p} t={`my edit:`}/></span>
                      <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: thisUserText}}
                          id="singleEditor" ref={ref => {singleEditor = ref}} onChange={handleTextChange}/>
                  </div>
                  <div className={styles.rowSpread}>
                      <div className={classes(styles.row, styles.topMargin)}>
                          <div>
                              <a onClick={handleCommentOpen}>
                                  <Icon pathName={`comment_text`} premium={true} className={styles.lessMarginLeft} />
                              </a>
                              {isShowingModal_comment &&
                                  <TextareaModal key={'all'} handleClose={handleCommentClose} heading={``} explain={``} placeholder={`Comment?`}
                                      onClick={handleCommentSave} sentenceChosen={originalSentenceText} currentSentenceText={thisUserText}
                                      commentText={editReview.hrefCommentByMe}/>
                              }
                          </div>
                          {!editReview.isTranslation &&
                              <div>
                                  <a onClick={handleEraseConfirmOpen}>
                                      <Icon pathName={`eraser`} premium={true} className={styles.sentenceDelete}/>
                                  </a>
                              </div>
                          }
                      </div>
                      <div className={styles.buttonRow}>
                          {isShowingModal_all &&
                            <MessageModal key={'all'} handleClose={handleAllDeleteClose} heading={<L p={p} t={`Delete All Edits and Comments?`}/>}
                               explainJSX={<L p={p} t={`Are you sure you want to delete all of the edits and comments for this sentence?`}/>} isConfirmType={true}
                               onClick={handleAllDeletes} />
                          }
                          {isShowingModal_blank &&
                            <MessageModal key={'empty'} handleClose={handleBlankClose} heading={<L p={p} t={`Translation is blank or empty?`}/>}
                               explainJSX={<L p={p} t={`It is not allowed to save a blank translation of a sentence.  Please check your entry and try again.`}/>} isConfirmType={false}
                               onClick={handleBlankClose} />
                          }
                          <a className={styles.cancelButton} ref={(ref) => (cancelButton = ref)}><L p={p} t={`Close`}/></a>
                          <button className={styles.saveButton} onClick={handleSave}><L p={p} t={`Save`}/></button>
                          {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.prevButton} onClick={() => setNextHrefId('PREV')}><L p={p} t={`Prev`}/></a>}
                          {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.nextButton} onClick={handleNextButton}><L p={p} t={`Next`}/></a>}
  
                          <a onClick={handleConfigOpen}>
                              <Icon pathName={`cog`} premium={true} className={styles.launchButton}/>
                          </a>
  
                          {isShowingModal_config &&
                              <ConfigModal personId={personId} personConfig={personConfig} updatePersonConfig={handleUpdatePersonConfig}
                                  handleClose={handleConfigClose} heading={``} explain={``} isTranslation={isTranslation}/>
                          }
                      </div>
                  </div>
  								<div className={styles.row}>
  										{personId === authorPersonId && editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
  												<a className={styles.deleteAllButton} onClick={handleAllDeleteOpen}><L p={p} t={`Delete All`}/></a>
  										}
  										<Checkbox
  												id={`editDifferenceView`}
  												label={<L p={p} t={`Show changes`}/>}
  												labelClass={styles.labelCheckbox}
  												checked={personConfig.editDifferenceView}
  												checkboxClass={styles.checkbox}
  												onClick={() => {
  														handleUpdatePersonConfig(personId, `EditDifferenceView`, !personConfig.editDifferenceView)
  														//handleUpdatePersonConfig(personId, `EditDifferenceViewKeepOn`, !personConfig.editDifferenceView) //Notice that this is not the KeepOn version but the main editDifferenceView
  												}}/>
  								</div>
  
                  {isTranslation &&
                      <div className={styles.editDisplay}>
                          <span className={styles.translateTitle}><L p={p} t={`Machine translation (not perfect)`}/></span>
                          <span className={styles.editText} dangerouslySetInnerHTML={{__html: translatedSentence}}/>
                          <span>
                              <a onClick={handleAcceptTranslation}>
                                  <Icon pathName={`thumbs_up0`} premium={true} className={styles.choiceIcons}/>
                              </a>
                          </span>
                      </div>
                  }
  
                  <div className={styles.editDetails}>
                      {editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                          editDetailsByHrefId.map((m, i) => {
                              let differenceEditText = m.editText;  //eslint-disable-line
                              const regex = "/<(.|\n)*?>/"
                              differenceEditText = differenceEditText && differenceEditText.replace(regex, "")
                                     .replace(/<br>/g, "")
                                     .replace(/<[^>]*>/g, ' ')
                                     .replace(/\s{2,}/g, ' ')
                                     .trim()
  
                              while (differenceEditText.indexOf('&nbsp;') > -1) {
                                  differenceEditText = differenceEditText.replace('&nbsp;', '')
                              }
  
                              let acceptFunction = personId === authorPersonId
                                      ? () => handleAcceptEdit(m.editDetailId)
                                      : () => handleVote(m.editDetailId, 'AGREE')
  
                          return (
                              <div className={styles.editDisplay} key={i}>
                                  <span className={styles.authorDateLine}>
                                      {editorColors && <div className={styles.colorBox} style={{backgroundColor: editorColors[m.personId]}} />}
                                      {m.personName + ` - `}
                                      <DateMoment date={m.entryDate} />
                                      {m.isComment && <span className={styles.isComment}> <L p={p} t={`Comment`}/> </span>}
                                      {!m.pendingFlag && m.authorAccepted && <span className={styles.isAccepted}> <L p={p} t={`Accepted`}/> </span>}
                                      {!m.pendingFlag && !m.authorAccepted && <span className={styles.isProcessed}> <L p={p} t={`Processed`}/> </span>}
                                  </span>
                                  <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))} id={m.personId}>
                                      {m.editText.indexOf('<svg id="erased') > -1
                                          ? '[erased]'
                                          : !m.isComment && personConfig.editDifferenceView && originalSentenceText && differenceEditText
                                              ? <DiffWord inputA={originalSentenceText} inputB={differenceEditText} />
                                              : differenceEditText}
                                  </span>
                                  {m.pendingFlag &&
                                      <div className={styles.toolOptions}>
                                          {!m.isComment && m.personId !== personId &&
                                              <span className={styles.iconRow}>
                                                  <a onClick={acceptFunction}>
                                                      <Icon pathName={`thumbs_up0`} premium={true} className={styles.choiceIcons}/>
                                                  </a>
                                                  <span className={styles.voteCount}>{m.agreeCount}</span>
                                              </span>
                                          }
                                          {m.personId !== personId &&
                                              <span className={styles.iconRow}>
                                                  <a onClick={personId === authorPersonId ? () => handleSingleDelete(m.editDetailId) : () => handleVote(m.editDetailId, 'DISAGREE')}>
                                                      <Icon pathName={`thumbs_down0`} premium={true} className={styles.choiceIcons}/>
                                                  </a>
                                                  <span className={styles.voteCount}>{m.disagreeCount}</span>
                                              </span>
                                          }
                                          {m.personId !== personId &&
                                              <span className={styles.row}>
                                                  <a onClick={() => handleVote(m.editDetailId, 'TROLL')} className={classes(styles.row, styles.moreLeft)}>
                                                      <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                                      <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                                                  </a>
                                                  <span className={styles.trollCount}>{m.trollCount}</span>
                                              </span>
                                          }
                                          {m.personId === personId &&
                                              <a onClick={() => handleSingleDeleteOpen(i)}>
                                                  <Icon pathName={`undo2`} premium={true} className={styles.choiceIcons}/>
                                              </a>
                                          }
                                          {isShowingModal_single && deleteIndex === i &&
                                            <MessageModal key={i} handleClose={handleSingleDeleteClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                                               explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                                               onClick={() => handleSingleDelete(m.editDetailId)} />
                                          }
  
                                          {m.personId !== personId &&
                                              <a onClick={() => handleFullVersionView(m.personId)} className={styles.iconRow}>
                                                  <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                                                  <Icon pathName={`magnifier`} premium={true} className={styles.imageMagnifier}/>
                                              </a>
                                          }
                                          <span onClick={handleEditIconLegendOpen}>
                                              <Icon pathName={`info`} className={styles.choiceIcons}/>
                                          </span>
                                      </div>
                                  }
                                  {!m.pendingFlag &&
                                      <div className={styles.toolOptions}>
                                          <a className={styles.restoreButton} onClick={() => handleRestore(m.editDetailId)}><L p={p} t={`Restore`}/></a>
                                          {!m.isComment && m.personId !== personId &&
                                              <span>
                                                  <Icon pathName={`thumbs_up0`} premium={true} className={styles.historyChoiceIcons}/>
                                                  <span className={styles.voteCount}>{m.agreeCount}</span>
                                              </span>
                                          }
                                          {m.personId !== personId &&
                                              <span>
                                                  <Icon pathName={`thumbs_down0`} premium={true} className={styles.historyChoiceIcons}/>
                                                  <span className={styles.voteCount}>{m.disagreeCount}</span>
                                              </span>
                                          }
                                          {m.personId !== personId &&
                                              <span className={styles.row}>
                                                  <div className={classes(styles.row, styles.moreLeft)}>
                                                      <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                                      <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                                                  </div>
                                                  <span className={styles.trollCount}>{m.trollCount}</span>
                                              </span>
                                          }
                                          <span onClick={handleEditIconLegendOpen}>
                                              <Icon pathName={`info`} className={styles.choiceIcons}/>
                                          </span>
                                      </div>
                                  }
                              </div>
                              )}
                          )
                      }
                  </div>
              </div>
              {isShowingModal_erase &&
                <MessageModal handleClose={handleEraseConfirmClose} heading={<L p={p} t={`Erase this Sentence?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to erase this sentence?`}/>} isConfirmType={true}
                   currentSentenceText={thisUserText} onClick={handleEraseSentence} />
              }
              {isShowingLegend &&
                  <MessageModal handleClose={handleEditIconLegendClose} heading={<L p={p} t={`Edit Icon Options`}/>} showEditIconLegend={true}
                      onClick={handleEditIconLegendClose} isAuthor={authorPersonId === personId}/>
              }
          </div>
      )
}

export default SentenceEdits


//  dangerouslySetInnerHTML={{__html: m.editText}}>
