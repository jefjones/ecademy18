import { useEffect, useState } from 'react'
import styles from './ChapterSplitterView.css'
const p = 'ChapterSplitterView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SplitterOptionsBar from '../../components/SplitterOptionsBar'
import SearchTextTool from '../../components/SearchTextTool'
import SplitterPanelDockable from '../../components/SplitterPanelDockable'
import TextareaModal from '../../components/TextareaModal'
import {doSort} from '../../utils/sort'
import classes from 'classnames'

const colorHasNewSection = "#e6f4ff"
const colorCurrentFocus = "yellow"

function ChapterSplitterView(props) {
  const [newSections, setNewSections] = useState([])
  const [currentHrefId, setCurrentHrefId] = useState('')
  const [currentSentence, setCurrentSentence] = useState('')
  const [prevHrefId, setPrevHrefId] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [sequenceOptions, setSequenceOptions] = useState([])
  const [errors, setErrors] = useState({})
  const [stopKeypress, setStopKeypress] = useState(false)
  const [pointerSearchText, setPointerSearchText] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [arraySearchTextFound, setArraySearchTextFound] = useState([])
  const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
  const [isShowingMissingBookmarkModal, setIsShowingMissingBookmarkModal] = useState(false)
  const [pointer, setPointer] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [prevSentence, setPrevSentence] = useState(undefined)

  useEffect(() => {
    
            //document.getElementById("editorDiv").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
            editorDiv.addEventListener('click', sentenceClick)
            window.scrollTo(0, 1)
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            checkMediaQuerySize()
        
  }, [])

  const jumpToEdit = (strNextOrPrev) => {
    
            //Find which node you are on now.
            //Loop through all of the span tags and look at those which have an Id like "~!"
            //  Look specifically for the next one that has a background color assigned to it.
            const spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN')
            let reachedCurrentHrefId = false
            let currentHrefId = prevHrefId
            let indexCount = strNextOrPrev === "NEXT" ? 0 : spans.length
            function indexCheck(indexValue) {
                return  strNextOrPrev === "NEXT" ? indexValue < spans.length : indexValue > 0
            }
            // function indexIncrement(indexValue) {
            //     return  strNextOrPrev === "NEXT" ? indexValue++ : indexValue--;
            // }
    
            for(indexCount; indexCheck(indexCount); strNextOrPrev === "NEXT" ? indexCount++ : indexCount--) {
                if (spans[indexCount] && String(spans[indexCount].id).indexOf('~!') > -1
                        && (!currentHrefId || reachedCurrentHrefId || (currentHrefId === spans[indexCount].id))) {
    
                    reachedCurrentHrefId = true
                    if (currentHrefId === spans[indexCount].id) continue; //Go one more to get past this one before looking for the next in the code below.
    
                    if (spans[indexCount].style.backgroundColor) {
                        //document.getElementById(spans[indexCount].id).focus();
                        if (document.getElementById(currentHrefId)) document.getElementById(currentHrefId).style.backgroundColor = colorHasNewSection;   //Set the previous one back to its edit background color instead of yellow highlighted
                        document.getElementById(spans[indexCount].id).style.backgroundColor = colorCurrentFocus
                        const toHrefId = document.getElementById(spans[indexCount].id)
                        let topPos = toHrefId.offsetTop
                        topPos -= 70
                        topPos = topPos < 0 ? 0 : topPos
                        document.getElementById('editorDiv').scrollTop = topPos
                        currentHrefId = spans[indexCount].id
                        break
                    }
                }
            }
            setPrevHrefId(currentHrefId); setCurrentHrefId(currentHrefId)
            setJumpCounts(null, null, currentHrefId)
        
  }

  const openLeftSidePanel = (e) => {
    
            e.preventDefault()
            let {toggleLeftSidePanelOpen} = props
            if (!prevHrefId) return
            let element = e.target
            let count = 0
            while (element && String(element.id).indexOf("~!") === -1 && count < 10) {
                element = element.parentNode
                count++
            }
            toggleLeftSidePanelOpen()
            if (document.getElementById(prevHrefId)) {
                document.getElementById(prevHrefId).style.backgroundColor = colorCurrentFocus
            }
        
  }

  const sentenceClick = (e) => {
    
            //On click of a sentence
            //1. Get the currentHrefId
            //2. Get the text of the current HrefId
            //3. If the prevHrefId exists, then color code it if it has a current newSection record.  Otherwise it will go back to white background.
            //4. Set the prevHrefId to the currentHrefId
            //5. Open the TextAreaModal with the existing new section name or the current sentence
            //6. Put a yellow highlight on the selected sentence throughout the process until Me clicks off to another sentence.
            let element = e.target
            let count = 0
    
            //Don't propagate this action if the left side panel is open.
            if (props.leftSidePanelOpen) return
    
            while (element && String(element.id).indexOf("~!") === -1 && count < 10) {
                element = element.parentNode
                count++
            }
    
            if (element && element.id && element.nodeName === 'SPAN') {
                //3. If the prevHrefId exists, then color code it if it has a current newSection record.  Otherwise it will go back to white background.
                if (document.getElementById(prevHrefId) && prevHrefId !== element.id) {
                    let hasNewSection = false
                    for(let i = 0; i < newSections.length; i++) {
                        if (newSections[i].hrefId === prevHrefId) {
                            hasNewSection = true
                        }
                    }
                    document.getElementById(prevHrefId).style.backgroundColor = hasNewSection ? colorHasNewSection : ""
                }
    
                //1. Get the currentHrefId
                //2. Get the text of the current HrefId (currentSentence)
                //4. Set the prevHrefId to the currentHrefId
                //6. Put a yellow highlight on the selected sentence throughout the process until Me clicks off to another sentence.
                let cleanSentence = document.getElementById(element.id).innerHTML
                const regex = "/<(.|\n)*?>/"
                cleanSentence.replace(regex, "")
                    .replace(/<br>/g, "")
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s{2,}/g, ' ')
                    .trim()
                cleanSentence = cleanSentence.replace(/&nbsp;/g, " ")
    
                setCurrentHrefId(element.id); setPrevHrefId(element.id); setCurrentSentence(cleanSentence)
                document.getElementById(element.id).style.backgroundColor = colorCurrentFocus
                //5. Open the TextAreaModal with the existing new section name or the current sentence
                handleNewSectionOpen()
            }
            setJumpCounts(null, null, element.id)
        
  }

  const submitSearchText = (value) => {
    
            setSearchText(value)
            let arrFound = searchForMatchingText(value)
            jumpToSearch('FIRST', arrFound)
        
  }

  const handleNewSectionClose = () => {
    return setIsShowingModal(false)

  }
  const handleNewSectionOpen = () => {
    return setIsShowingModal(true)

  }
  const handleNewSectionSave = (newSectionName) => {
    
            //1. Update the section if it already exists in newSections.  Otherwise save it new.
            //2. Check the order by considering the index location of the hrefId so that the sections are in strict order.
            //      If not, saving and splitting text of more than one section that is out of order would have ovelapping and duplicate text.
            let newSections = newSections
            let exists = false
            for(let i = 0; i < newSections.length; i++) {
                if (newSections[i].hrefId === currentHrefId) {
                    newSections[i].sectionName = newSectionName
                    exists = true
                }
            }
            let chapterText = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML
            newSections = !exists
                ? newSections.concat({
                        name: newSectionName,
                        hrefId: currentHrefId,
                        sequence: newSections.length + 1,
                        locationIndex: chapterText.indexOf(currentHrefId),
                    })
                : newSections
    
            newSections = doSort(newSections, {sortField: 'locationIndex', isAsc: true, isNumber: true})
            //Cut out the extra locationIndex so that it isn't sent to the webAPI (which is essential in this case since a flat array is sent due to object model problems on the back end)
            //  By the way, you can't depend on the hrefId-s being in consecutive order due to editing that can create new sentence HefId-s at any time.
            //newSections = newSections.map(m => {delete m.locationIndex; return m});
            //But we are going to have to wait until we are about to send off to the webAPI before we do that.  We need the locationIndex preserved while we keep saving new sections.
            setNewSections(newSections)
            handleNewSectionClose()
            setJumpCounts(null, newSections)
    
        
  }

  const handleNewSectionDelete = () => {
    
            let newSections = newSections
            for(let i = 0; i < newSections.length; i++) {
                if (newSections[i].hrefId === currentHrefId) {
                    newSections.splice(i)
                }
            }
            setNewSections(newSections)
            handleNewSectionClose()
            setJumpCounts(null, newSections)
        
  }

  const handleNewSectionDeleteByName = (sectionName) => {
    
            let newSections = []
            for(let i = 0; i < newSections.length; i++) {
                if (newSections[i].name !== sectionName) {
                    newSections = newSections ? newSections.concat(newSections[i]) : [newSections[i]]
                }
            }
            setNewSections(newSections)
            handleNewSectionClose()
            setJumpCounts(null, newSections)
        
  }

  const {chapterText, workSummary, personId, leftSidePanelOpen, toggleLeftSidePanelOpen, setJumpCounts} = props
          
  
          return (
              <div>
                  <SplitterPanelDockable
                          open={sidePanel_open || leftSidePanelOpen}
                          docked={sidePanel_docked}
                          mediaQuery={props.mediaQuery}
                          onSetOpen={toggleLeftSidePanelOpen}
                          defaultSidebarWidth={360}
                          personId={personId}
                          leftSidePanelOpen={leftSidePanelOpen}
                          currentHrefId={currentHrefId}
                          newSections={newSections}
                          splitChapter={handleSubmit}
                          deleteSectionByName={handleNewSectionDeleteByName}
                          workSummary={workSummary}
                          toggleLeftSidePanelOpen={toggleLeftSidePanelOpen}>
  
                      <div className={styles.container}>
                          <div className={classes(globalStyles.pageTitle, styles.pageTitle)}>
                              <L p={p} t={`Split Section into Two or More`}/>
                          </div>
                          <div className={styles.toolSection}>
                              <SplitterOptionsBar className={leftSidePanelOpen ? styles.hidden : ''}
                                  toggleLeftSidePanelOpen={toggleLeftSidePanelOpen} jumpToEdit={jumpToEdit}
                                  setJumpCounts={setJumpCounts} pointer={pointer} totalCount={totalCount}
                                  handleAuthorProcessText={handleAuthorProcessText}/>
                              <SearchTextTool hideLeftArrow={true} className={styles.marginLeft}
                                  pointer={arraySearchTextFound && arraySearchTextFound.length > 0 ? pointerSearchText + 1 : 0}
                                  totalCount={arraySearchTextFound && arraySearchTextFound.length > 0 && arraySearchTextFound.length}
                                  jumpToSearch={jumpToSearch} searchText={searchText} submitSearchText={submitSearchText}/>
                          </div>
                          <div className={styles.editorDiv} contentEditable={false} dangerouslySetInnerHTML={{__html: chapterText}}
                              id="editorDiv" ref={ref => {editorDiv = ref}}/>
                      </div>
                      {isShowingModal &&
                          <TextareaModal key={'all'} handleClose={handleNewSectionClose} heading={<L p={p} t={`New Section Name`}/>}
                              explain={<L p={p} t={`The section name is initially set as the text you clicked on.  You can change the name here, as needed.`}/>}
                              placeholder={<L p={p} t={`Section name?`}/>} onClick={handleNewSectionSave}
                              onDelete={handleNewSectionDelete}
                              commentText={newSections.filter(m=>m.hrefId===currentHrefId)[0]
                                  ? newSections.filter(m=>m.hrefId===currentHrefId)[0].name
                                  : currentSentence}/>
                      }
                  </SplitterPanelDockable>
              </div>
          )
}
export default ChapterSplitterView
