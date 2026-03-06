/* See https://github.com/balloob/react-sidebar - this page was cloned to create this local component*/
import { useEffect, useState } from 'react'
import styles from './SidePanelDockable.css'
import classes from 'classnames'
import ReactTooltip from 'react-tooltip'
import ConfigModal from '../../components/ConfigModal'
import MessageModal from '../../components/MessageModal'
import DateMoment from '../../components/DateMoment'
import Icon from '../../components/Icon'
const p = 'component'
import L from '../../components/PageLanguage'
//import Diff from 'react-stylable-diff';

const CANCEL_DISTANCE_ON_SCROLL = 20

const defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
    width: 320,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-in-out, right .3s ease-in-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-in-out, visibility .3s ease-in-out',
    backgroundColor: 'rgba(0,0,0,.3)',
    width: 320,
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
}

function SidePanelDockable(props) {
  const [sidebarWidth, setSidebarWidth] = useState(props.defaultSidebarWidth)
  const [touchIdentifier, setTouchIdentifier] = useState(null)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [touchCurrentX, setTouchCurrentX] = useState(null)
  const [touchCurrentY, setTouchCurrentY] = useState(null)
  const [dragSupported, setDragSupported] = useState(false)
  const [newEditText, setNewEditText] = useState('')
  const [acceptedEditDetailId, setAcceptedEditDetailId] = useState(0)
  const [isShowingModal_single, setIsShowingModal_single] = useState(false)
  const [isShowingModal_all, setIsShowingModal_all] = useState(false)
  const [isShowingModal_blank, setIsShowingModal_blank] = useState(false)
  const [isShowingModal_config, setIsShowingModal_config] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(0)
  const [keepHistoryOn, setKeepHistoryOn] = useState(undefined)
  const [keepAutoNextOn, setKeepAutoNextOn] = useState(undefined)
  const [keepEditDifferenceOn, setKeepEditDifferenceOn] = useState(undefined)

  useEffect(() => {
    
        //document.getElementById('singleEditor').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        singleEditor.addEventListener('keyup', checkForKeypress)
    
        setDragSupported(typeof window === 'object' && 'ontouchstart' in window)
        saveSidebarWidth()
        checkMediaQuerySize()
    
        //Merged details from the old EditsLeftSideOver
        const {editDetailsByHrefId, personId, originalSentence, personConfig, isTranslation, translatedSentence} = props
        //document.body.addEventListener("click", handleClosed);
        //We are taking away the button reaction since we needed the real estate at the bottom of the screen and above the tool bar.  Double clicking on a sentence will open up the left pane.
        //button.addEventListener("click", handleDisplay);  //We don't want to have a click here since it is so close to the options buttons below it.
        cancelButton.addEventListener("click", handleClosed)
        closeButton.addEventListener("click", handleClosed)
        if (isTranslation) {
            resetButton.addEventListener("click", handleResetToClear)
        } else {
            resetButton.addEventListener("click", handleResetToOriginal)
        }
    
        let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
        //If this isTranslation and the user doesn't have an edit that they have provided, then set thisUserText to blank
        //  so the user can either choose a translation helper below (from bing or google) or start typing on their own.
        let thisUserText = hasUserEdit
            ? hasUserEdit.editText
            : (isTranslation
                ? (personConfig.translateInsertSuggestion
                    ? translatedSentence
                    : '')
                : originalSentence)
    
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
      
            const {editDetailsByHrefId, personId, originalSentence, isTranslation} = props
            //document.body.removeEventListener("click", handleClosed);
            let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
            let thisUserText = hasUserEdit ? hasUserEdit.editText : (isTranslation ? '' : originalSentence)
            setNewEditText(thisUserText)
        
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        // filter out the updates when we're touching
        if (!isTouching()) {
          saveSidebarWidth()
        }
        checkMediaQuerySize()
      
  }, [])

  const handleSingleDeleteClose = () => {
    return setIsShowingModal_single(false)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleSingleDeleteOpen = (deleteIndex) => {
    return setIsShowingModal_single(true); setDeleteIndex(deleteIndex)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleAllDeleteClose = () => {
    return setIsShowingModal_all(false)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleAllDeleteOpen = () => {
    return setIsShowingModal_all(true)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleBlankClose = () => {
    return setIsShowingModal_blank(false)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleBlankOpen = () => {
    return setIsShowingModal_blank(true)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleConfigClose = () => {
    return setIsShowingModal_config(false)
    
      //******************END Of functions from EditsLeftSideOver
    

  const handleConfigOpen = () => {
    return setIsShowingModal_config(true)
    
      //******************END Of functions from EditsLeftSideOver
    

  const dragHandle = (
          <div style={dragHandleStyle}
               onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove}
               onTouchEnd={this.onTouchEnd} onTouchCancel={this.onTouchEnd} />) => {
    return 
  }

  const sidebarStyle = {...defaultStyles.sidebar, ...props.styles.sidebar}
      const contentStyle = {...defaultStyles.content, ...props.styles.content}
      const overlayStyle = {...defaultStyles.overlay, ...props.styles.overlay}
      const useTouch = dragSupported && props.touch
      const isTouching = isTouching()
      const rootProps = {
        className: props.rootClassName,
        style: {...defaultStyles.root, ...props.styles.root},
        role: "navigation",
      }
      let dragHandle
  
      // sidebarStyle right/left
      if (props.pullRight) {
        sidebarStyle.right = 0
        sidebarStyle.transform = 'translateX(100%)'
        sidebarStyle.WebkitTransform = 'translateX(100%)'
        if (props.shadow) {
          sidebarStyle.boxShadow = '-2px 2px 4px rgba(0, 0, 0, 0.15)'
        }
      } else {
        sidebarStyle.left = 0
        sidebarStyle.transform = 'translateX(-100%)'
        sidebarStyle.WebkitTransform = 'translateX(-100%)'
        if (props.shadow) {
          sidebarStyle.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.15)'
        }
      }
  
      if (isTouching) {
        const percentage = touchSidebarWidth() / sidebarWidth
  
        // slide open to what we dragged
        if (props.pullRight) {
          sidebarStyle.transform = `translateX(${(1 - percentage) * 100}%)`
          sidebarStyle.WebkitTransform = `translateX(${(1 - percentage) * 100}%)`
        } else {
          sidebarStyle.transform = `translateX(-${(1 - percentage) * 100}%)`
          sidebarStyle.WebkitTransform = `translateX(-${(1 - percentage) * 100}%)`
        }
  
        // fade overlay to match distance of drag
        overlayStyle.opacity = percentage
        overlayStyle.visibility = 'visible'
      } else if (props.docked) {
        // show sidebar
        if (sidebarWidth !== 0) {
          sidebarStyle.transform = `translateX(0%)`
          sidebarStyle.WebkitTransform = `translateX(0%)`
        }
  
        // make space on the left/right side of the content for the sidebar
        if (props.pullRight) {
          contentStyle.right = `${sidebarWidth}px`
        } else {
          contentStyle.left = `${sidebarWidth}px`
        }
      } else if (props.open) {
        // slide open sidebar
        sidebarStyle.transform = `translateX(0%)`
        sidebarStyle.WebkitTransform = `translateX(0%)`
  
        // show overlay
        overlayStyle.opacity = 1
        overlayStyle.visibility = 'visible'
      }
  
      if (isTouching || !props.transitions) {
        sidebarStyle.transition = 'none'
        sidebarStyle.WebkitTransition = 'none'
        contentStyle.transition = 'none'
        overlayStyle.transition = 'none'
      }
  
      if (useTouch) {
        if (props.open) {
          rootProps.onTouchStart = onTouchStart
          rootProps.onTouchMove = onTouchMove
          rootProps.onTouchEnd = onTouchEnd
          rootProps.onTouchCancel = onTouchEnd
          rootProps.onScroll = onScroll
        } else {
          const dragHandleStyle = {...defaultStyles.dragHandle, ...props.styles.dragHandle}
          dragHandleStyle.width = props.touchHandleWidth
  
          // dragHandleStyle right/left
          if (props.pullRight) {
            dragHandleStyle.right = 0
          } else {
            dragHandleStyle.left = 0
          }
  
          dragHandle = (
            <div style={dragHandleStyle}
                 onTouchStart={onTouchStart} onTouchMove={onTouchMove}
                 onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd} />)
        }
      }
  
      //Constants and variables from EditsLeftSideOver
      const {labelClass, editDetailsByHrefId, personId, authorPersonId, leftSidePanelOpen, originalSentence, personConfig,
                  updatePersonConfig, setNextHrefId, isTranslation, translatedSentence} = props
      
  
      let editPendingCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => m.pendingFlag).length : 0
      let editHistoryCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => !m.pendingFlag).length : 0
      let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0]
      let thisUserText = hasUserEdit
          ? hasUserEdit.editText
          : (isTranslation
              ? (personConfig.translateInsertSuggestion
                  ? translatedSentence
                  : '')
              : originalSentence)
  
  
      let originalSentenceText = originalSentence
      originalSentenceText = originalSentenceText && originalSentenceText
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .trim()
  
      return (
        <div {...rootProps}>
          <div className={props.sidebarClassName} style={sidebarStyle} ref={saveSidebarRef} id="saveSidebarRef">
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
                          <a className={styles.resetButton} ref={(ref) => (resetButton = ref)}><L p={p} t={`Reset`}/></a>
                      </div>
                      <div className={styles.outerBorder}>
                          <span className={styles.myEdit}><L p={p} t={`my edit:`}/></span>
                          <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: thisUserText}}
                              id="singleEditor" ref={ref => {singleEditor = ref}} onChange={handleTextChange}/>
                      </div>
                      <div className={styles.buttonRow}>
                          {personId === authorPersonId && editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                              <a className={styles.deleteAllButton} onClick={handleAllDeleteOpen}>Delete All</a>
                          }
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
                          <a className={styles.cancelButton} ref={(ref) => (cancelButton = ref)}><L p={p} t={`Cancel`}/></a>
                          <button className={styles.saveButton} onClick={handleSave}><L p={p} t={`Save`}/></button>
                          {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.prevButton} onClick={() => setNextHrefId('PREV')}><L p={p} t={`Prev`}/></a>}
                          {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.nextButton} onClick={handleNextButton}><L p={p} t={`Next`}/></a>}
  
                          <a onClick={handleConfigOpen}>
                              <Icon pathName={`sound_board`} className={styles.launchButton}/>
                          </a>
  
                          {isShowingModal_config &&
                              <ConfigModal personId={personId} personConfig={personConfig} updatePersonConfig={updatePersonConfig}
                                  handleClose={handleConfigClose} heading={``} explain={``} isTranslation={isTranslation}/>
                          }
                      </div>
  
                      {isTranslation &&
                          <div className={styles.editDisplay}>
                              <span className={styles.translateTitle}><L p={p} t={`Machine translation (not perfect)`}/></span>
                              <span className={styles.editText} dangerouslySetInnerHTML={{__html: translatedSentence}}/>
                              <span>
                                  <a onClick={handleAcceptTranslation}>
                                      <Icon pathName={`checkmark`} className={styles.choiceIcons}/>
                                  </a>
                              </span>
                          </div>
                      }
  
                      <div className={styles.editDetails}>
                          {editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                              editDetailsByHrefId.map((m, i) => {
                                  let tooltipText = ""
                                  if (m.pendingFlag) {
                                      tooltipText += !m.isComment && m.personId !== personId ? <div><strong><L p={p} t={`Accept and choose this edit.`}/></strong>  <L p={p} t={`You can edit it further.  This will score this edit favorably.`}/></div> : ""
                                      tooltipText += personId === authorPersonId ? <L p={p} t={`All other edits which haven't been deleted (rejected) will be scored minimally for effort.`}/> : ""
                                      tooltipText += m.personId !== personId  ? <div><strong><L p={p} t={`Disagree with this edit.`}/></strong> <L p={p} t={`But use this sparingly since this decreases the user's score.  Please, be courteous.`}/></div> : ""
                                      tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`Troll!`}/></strong> <L p={p} t={`Use this tool to mark the entry as obnoxious or destructive.  The author ought to take away access for this editor.`}/></div> : ""
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
                                          {m.isComment && <span className={styles.isComment}> <L p={p} t={`Comment`}/> </span>}
                                          {!m.pendingFlag && m.authorAccepted && <span className={styles.isAccepted}> <L p={p} t={`Accepted`}/> </span>}
                                          {!m.pendingFlag && !m.authorAccepted && <span className={styles.isProcessed}> <L p={p} t={`Processed`}/> </span>}
                                      </span>
                                          <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                              id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
                                      {m.pendingFlag &&
                                          <div className={styles.toolOptions}>
                                              {!m.isComment && m.personId !== personId &&
                                                  <span className={styles.iconRow}>
                                                      <a onClick={acceptFunction}>
                                                          <Icon pathName={`checkmark`} className={styles.choiceIcons}/>
                                                      </a>
                                                      <span className={classes(styles.voteCount, styles.checkmarkCount)}>{m.agreeCount}</span>
                                                  </span>
                                              }
                                              {m.personId !== personId &&
                                                  <span className={styles.iconRow}>
                                                      <a onClick={personId === authorPersonId ? () => handleSingleDeleteOpen(i) : () => handleVote(m.editDetailId, 'DISAGREE')}>
                                                          <Icon pathName={`cross`} className={classes(styles.choiceIcons, styles.smaller)}/>
                                                      </a>
                                                      <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                  </span>
                                              }
                                              {m.personId !== personId &&
                                                  <span className={styles.iconRow}>
                                                      <a onClick={() => handleVote(m.editDetailId, 'TROLL')}>
                                                          <Icon pathName={`blocked`} className={classes(styles.choiceIcons, styles.bitSmaller)}/>
                                                      </a>
                                                      <span className={styles.voteCount}>{m.trollCount}</span>
                                                  </span>
                                              }
                                              {m.personId === personId &&
                                                  <a onClick={() => handleSingleDeleteOpen(i)}>
                                                      <Icon pathName={`garbage_bin`} className={styles.choiceIcons}/>
                                                  </a>
                                              }
                                              {isShowingModal_single && deleteIndex === i &&
                                                <MessageModal key={i} handleClose={handleSingleDeleteClose} heading={<L p={p} t={`Delete this Edit?`}/>}
                                                   explainJSX={<L p={p} t={`Are you sure you want to delete this edit?`}/>} isConfirmType={true}
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
                                              <a className={styles.restoreButton} onClick={() => handleRestore(m.editDetailId)}><L p={p} t={`Restore`}/></a>
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
          </div>
          <div className={props.overlayClassName}
               style={overlayStyle}
               role="presentation"
               tabIndex="0"
               onClick={overlayClicked}
            />
          <div className={props.contentClassName} style={contentStyle}>
            {dragHandle}
            {props.children}
          </div>
        </div>
      )
}

export default SidePanelDockable
