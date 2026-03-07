import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './EditorInviteWorkView.css'
const p = 'EditorInviteWorkView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import WorkFilter from '../../components/WorkFilter'
import WorkSummary from '../../components/WorkSummary'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import InvitesPending from '../../components/InvitesPending'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'

function EditorInviteWorkView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isSending, setIsSending] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)

  const {personId, owner_personId, languageId, updateFilterByField, clearFilters, setWorkCurrentSelected,
              deleteWork, workSummaries, languageOptions, setWorkAssign,  editorInviteName, editorInviteWorkAssign,
              deleteChapter, updateChapterDueDate, updateChapterComment, editorInvitePending, deleteInvite, acceptInvite, resendInvite,
              filterScratch, savedFilterIdCurrent, workFilterOptions, updateSavedSearch, updateFilterDefaultFlag,
              deleteSavedSearch, chooseSavedSearch, updateWorkFilterByField, saveNewSavedSearch, updatePersonConfig,
              personConfig} = props
  
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Invite New Editor to Documents`}/>
              </div>
              {editorInvitePending && editorInvitePending.length > 0 &&
                  <InvitesPending invites={editorInvitePending} personId={owner_personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                      resendInvite={resendInvite}/>
              }
              <hr />
              <div className={styles.contact}>
                  <div>
                      <div>
                          {editorInviteName.firstName + ` ` + editorInviteName.lastName}
                      </div>
                      <div>
                          {editorInviteName.emailAddress}
                      </div>
                      <div>
                          {editorInviteName.phone}
                      </div>
                  </div>
                  <div>
                      {!isSending && <ButtonWithIcon label={<L p={p} t={`Send`}/>} icon={'checkmark_circle'} className={styles.submitButton} onClick={handleSend}/>}
                      {isSending && <span className={styles.sendingLabel}><L p={p} t={`Sending...`}/></span>}
                  </div>
              </div>
              <Accordion noShowExpandAll={true}>
                  <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={workFilterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                          updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                          updateFilterByField={updateWorkFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={owner_personId}
                          clearFilters={clearFilters} >
                      <WorkFilter personId={personId} workFilter={filterScratch} className={styles.workFilter} updateFilterByField={updateFilterByField}
                          clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} hideSourceStatus={true} savedSearchOptions={workFilterOptions}/>
                  </AccordionItem>
              </Accordion>
  
              <hr />
              <ul className={styles.unorderedList}>
                  {workSummaries &&
                      <Accordion allowMultiple={true}>
                          {workSummaries.map((w, i) => {
                              let chaptersChosen = []
                              let languagesChosen = []
                              let workAssign = editorInviteWorkAssign && editorInviteWorkAssign.length > 0 && editorInviteWorkAssign.filter(m => m && m.workId === w.workId)[0]
                              if (workAssign) {
                                  chaptersChosen = workAssign.chapterIdList
                                  languagesChosen = workAssign.languageIdList
                              }
  
                              return (
                                  <AccordionItem title={w.title} isCurrentTitle={w.isCurrentWork} expanded={w.isExpanded} key={i}
                                          className={classes(styles.accordionTitle, w.isCurrentWork ? styles.isCurrentWork : '')}
                                          editorAssign={workAssign} onTitleClick={() => {}} workId={w && w.workId}
                                          personId={personId} owner_personId={owner_personId} languageId={languageId} chapterOptions={w.chapterOptions}
                                          languageOptions={languageOptions} setEditorAssign={setWorkAssign} chaptersChosen={chaptersChosen}
                                          languagesChosen={languagesChosen} isNewInvite={true} showAssignWorkToEditor={true}
                                          updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                                      <WorkSummary summary={w} className={styles.workSummary} showIcons={true} personId={personId}
                                          setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} showTitle={false} isHeaderDisplay={false}
                                          labelCurrentClass={styles.labelCurrentClass} deleteChapter={deleteChapter}
                                          updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                                          updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                                  </AccordionItem>
                              )
                          })}
                      </Accordion>
                  }
              </ul>
              {isShowingModal &&
                  <MessageModal handleClose={handleConfirmClose} heading={<L p={p} t={`Send Invitation without Giving Access?`}/>}
                      explainJSX={<L p={p} t={`It appears that you have not granted access to one or more documents? Are you sure you want to send this invitation without giving them an assignment to a document?`}/>}
                      isConfirmType={true} onClick={submitSend}/>
              }
              <OneFJefFooter />
          </div>
      )
}
export default EditorInviteWorkView
