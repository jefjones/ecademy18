import { useState } from 'react'
import styles from './OpenCommunityCommitted.css'
import MessageModal from '../../components/MessageModal'
import WorkSummary from '../../components/WorkSummary'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenCommunityCommitted(props) {
  const [isShowingModal_uncommit, setIsShowingModal_uncommit] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(0)
  const [selectedLanguages, setSelectedLanguages] = useState(undefined)
  const [nativeLanguageEdit, setNativeLanguageEdit] = useState(undefined)

  const handleUncommitAlertClose = () => {
    return setIsShowingModal_uncommit(false)
    

  }
  const handleUncommitAlertOpen = () => {
    return setIsShowingModal_uncommit(true)
    

  let {personId, setWorkCurrentSelected, updateChapterComment, openCommunityFull, uncommitOpenCommunityEntry} = props
        
        let localOpenCommunity = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.hasCommittedOpenCommunity)
  
        return (
          <div className={styles.container}>
              {!localOpenCommunity || localOpenCommunity.length === 0 ? <span className={styles.noListMessage}>{`empty list`}<br/><br/></span> : ''}
              {localOpenCommunity && localOpenCommunity.length > 0 &&
                  <Accordion allowMultiple={true}>
                      {localOpenCommunity.map((s, i) => {
                          return (
                            <AccordionItem title={s.title} isCurrentTitle={s.isCurrentWork} expanded={s.isExpanded} key={i} showCommitted={true}
                                    className={styles.accordionTitle} uncommitOpenCommunityEntry={uncommitOpenCommunityEntry} openCommunityEntry={s}
                                    onTitleClick={() => setWorkCurrentSelected(personId, s.workId, s.chapterId_current, s.languageId_current, 'editReview')}>
                                <WorkSummary summary={s} className={styles.workSummary} showIcons={true} personId={personId}
                                    setWorkCurrentSelected={setWorkCurrentSelected} showTitle={false} noShowCurrent={true}
                                    labelCurrentClass={styles.labelCurrentClass} indexKey={i}
                                    updateChapterComment={updateChapterComment}/>
                                {isShowingModal_uncommit && deleteIndex === i &&
                                    <MessageModal key={i*1000} handleClose={handleUncommitAlertClose} heading={<L p={p} t={`Discontinue Editing this Document?`}/>}
                                        explainJSX={<L p={p} t={`Are you sure you want to discontinue editing this document?`}/>} isConfirmType={true}
                                        onClick={handleUncommitClick}/>
                                }
                            </AccordionItem>
                          )
                      })}
                  </Accordion>
              }
          </div>
        )
}
}
export default OpenCommunityCommitted
