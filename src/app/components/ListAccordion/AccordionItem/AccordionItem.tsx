import cx from 'classnames'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import uuid from 'uuid'
import styles from './styles.css'
import AccordionItemBody from '../AccordionItemBody'
import AccordionItemTitle from '../AccordionItemTitle'

function AccordionItem(props) {
  const [maxHeight, setMaxHeight] = useState(props.expanded ? 'none' : 0)
  const [overflow, setOverflow] = useState(props.expanded ? 'visible' : 'hidden')
  const [caretClassName, setCaretClassName] = useState(cx((props.isOpenCommunity ? styles.white_caret : styles.jef_caret), (props.expanded ? styles.jefCaretUp : styles.jefCaretDown)))

  useEffect(() => {
    
        setMaxHeight(false)
      
    return () => {
      
          clearTimeout(timeout)
        
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        const { children, disabled, expanded } = props
    
        if (prevProps.expanded !== expanded) {
          if (disabled) return
    
          if (expanded) {
            handleExpand()
          } else {
            handleCollapse()
          }
        } else if (prevProps.children !== children) {
          setMaxHeight(false)
        }
      
  }, [])

  const {
        isImplemented,
        bodyClassName,
        contactSummary,
        workSummary,
        showDelete,
        setWorkCurrentSelected,
        deleteWork,
        deleteChapter,
        bodyTag,
        children,
        disabled,
        duration,
        easing,
        onClick,
        rootTag: Root,
        title,
  			icon,
  			iconBigger,
        isCurrentTitle,
        onTitleClick,
        onContactClick,
        titleClassName,
        titleTag,
        isNewInvite,
        editorAssign,
        workId,
        personId,
        owner_personId,
        editorPersonId,
        languageId,
        chapterOptions,
        languageOptions,
        setEditorAssign,
        chaptersChosen,
        languagesChosen,
        indexKey,
        filterScratch,
        savedFilterIdCurrent,
        filterOptions,
        updateSavedSearch,
        deleteSavedSearch,
        chooseSavedSearch,
        clearFilters,
        updateFilterByField,
        updateFilterDefaultFlag,
        modifyOpenCommunity,
        removeOpenCommunity,
        undiscontinueOpenCommunity,
        commitOpenCommunityEntry,
        uncommitOpenCommunityEntry,
        openCommLanguageOptions,
        openCommChapterOptions,
        openCommunityEntry,
        showCommitted,
        showNotifyMe,
        isOpenCommunity,
        count,
        updatePersonConfig,
        personConfig,
      } = props
  
      let {caretClassName} = state
  
      
  
      return (
        <Root {...getProps()} ref="item">
          <AccordionItemTitle
            isImplemented={isImplemented}
            className={titleClassName}
            contactSummary={contactSummary}
            onContactClick={onContactClick}
            workSummary={workSummary}
            showDelete={showDelete}
            setWorkCurrentSelected={setWorkCurrentSelected}
            deleteWork={deleteWork}
            deleteChapter={deleteChapter}
            caretClassName={caretClassName}
            onClick={disabled ? null : onClick}
            rootTag={titleTag}
  					title={title}
  					icon={icon}
            iconBigger={iconBigger}
            isCurrentTitle={isCurrentTitle}
            onTitleClick={onTitleClick === 'SameAsOnClick' ? onClick : onTitleClick}
            uuid={uuid}
            isNewInvite={isNewInvite}
            editorAssign={editorAssign}
            workId={workId}
            personId={personId}
            owner_personId={owner_personId}
            editorPersonId={editorPersonId}
            languageId={languageId}
            chapterOptions={chapterOptions}
            languageOptions={languageOptions}
            setEditorAssign={setEditorAssign}
            chaptersChosen={chaptersChosen}
            languagesChosen={languagesChosen}
            filterScratch={filterScratch}
            savedFilterIdCurrent={savedFilterIdCurrent}
            filterOptions={filterOptions}
            updateSavedSearch={updateSavedSearch}
            deleteSavedSearch={deleteSavedSearch}
            chooseSavedSearch={chooseSavedSearch}
            clearFilters={clearFilters}
            updateFilterByField={updateFilterByField}
            updateFilterDefaultFlag={updateFilterDefaultFlag}
            modifyOpenCommunity={modifyOpenCommunity}
            removeOpenCommunity={removeOpenCommunity}
            undiscontinueOpenCommunity={undiscontinueOpenCommunity}
            commitOpenCommunityEntry={commitOpenCommunityEntry}
            uncommitOpenCommunityEntry={uncommitOpenCommunityEntry}
            openCommLanguageOptions={openCommLanguageOptions}
            openCommChapterOptions={openCommChapterOptions}
            openCommunityEntry={openCommunityEntry}
            showCommitted={showCommitted}
            showNotifyMe={showNotifyMe}
            isOpenCommunity={isOpenCommunity}
            count={count}
            updatePersonConfig={updatePersonConfig}
            personConfig={personConfig}/>
        <hr className={styles.line}/>
  
          <AccordionItemBody
            key={indexKey*100}
            className={bodyClassName}
            duration={duration}
            easing={easing}
            maxHeight={maxHeight}
            overflow={overflow}
            ref="body"
            rootTag={bodyTag}
            uuid={uuid}
          >
            {children}
          </AccordionItemBody>
        </Root>
      )
}

AccordionItem.defaultProps = {
  rootTag: 'div',
  titleTag: 'h3',
  bodyTag: 'div'
}

export default AccordionItem
