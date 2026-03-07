import { useState } from 'react'
import * as styles from './OpenCommunitySubmitted.css'
import classes from 'classnames'
import MessageModal from '../../components/MessageModal'
import WorkSummary from '../../components/WorkSummary'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenCommunitySubmitted(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(0)

  const handleAlertClose = () => {
    return setIsShowingModal(false)
    

  }
  const handleAlertOpen = (deleteIndex) => {
    return setIsShowingModal(true); setDeleteIndex(deleteIndex)
    

  let {personId, setWorkCurrentSelected, updateChapterComment, openCommunityFull,
              setToModifyRecord} = props
        
  
        let localOpenCommunity = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.personId === personId)
  
        return (
          <div className={styles.container}>
              {!localOpenCommunity || localOpenCommunity.length === 0 ? <span className={styles.noListMessage}>{`empty list`}<br/><br/></span> : ''}
              {localOpenCommunity && localOpenCommunity.length > 0 &&
                  <Accordion allowMultiple={true}>
                      {localOpenCommunity.map((s, i) => {
                          return (
                            <AccordionItem title={s.title} isCurrentTitle={s.isCurrentWork} expanded={s.isExpanded} key={i}
                                    className={styles.accordionTitle}
                                    onTitleClick={() => setWorkCurrentSelected(personId, s.workId, s.chapterId_current, s.languageId_current, 'editReview')}
                                    removeOpenCommunity={() => handleAlertOpen(i)} modifyOpenCommunity={() => setToModifyRecord(s.openCommunityEntryId)}>
                                <WorkSummary summary={s} className={styles.workSummary} showIcons={true} personId={personId}
                                    setWorkCurrentSelected={setWorkCurrentSelected} showTitle={false} noShowCurrent={true}
                                    labelCurrentClass={styles.labelCurrentClass} indexKey={i} updateChapterComment={updateChapterComment}/>
                                {isShowingModal && deleteIndex === i &&
                                  <MessageModal key={i*1000} handleClose={handleAlertClose} heading={<L p={p} t={`Remove this Open Community Entry?`}/>}
                                     explainJSX={<L p={p} t={`Are you sure you want to remove this open community entry?  You will not lose the edits or translations that have been completed.`}/>}
                                     isConfirmType={true} onClick={() => handleRemoveSubmitted(s.workId, s.openCommunityEntryId)} />
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
export default OpenCommunitySubmitted
