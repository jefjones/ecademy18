import * as styles from './GiveAccessToWorksView.css'
const p = 'GiveAccessToWorksView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import WorkFilter from '../../components/WorkFilter'
import ContactSummary from '../../components/ContactSummary'
import WorkSummary from '../../components/WorkSummary'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import InvitesPending from '../../components/InvitesPending'
import { Link } from 'react-router-dom'
import OneFJefFooter from '../../components/OneFJefFooter'

export default ({personId, owner_personId, languageId, workSummary, contactSummary, className="",
                    setSourceFilter, setStatusFilter, updateFilterByField, clearFilters, setWorkCurrentSelected,
                    deleteWork, deleteChapter, workSummaries=[], languageOptions=[], setEditorAssign, setContactCurrentSelected,
                    updateChapterDueDate, updateChapterComment, editorInvitePending, deleteInvite, acceptInvite, resendInvite, filterScratch, savedFilterIdCurrent,
                    workFilterOptions,updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch,
                    updatePersonConfig, personConfig}) => {
    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Give Access to Documents`}/>
            </div>
            <Accordion allowMultiple={true} noShowExpandAll={true}>
                <AccordionItem contactSummary={contactSummary} expanded={false} className={styles.accordionTitle} onTitleClick={() => {}}
                        showAssignWorkToEditor={false} personId={personId}>
                    <ContactSummary summary={contactSummary} showAccessIcon={true} userPersonId={contactSummary.personId} noShowTitle={true}/>
                </AccordionItem>
            </Accordion>
            <Accordion noShowExpandAll={true}>
                <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={workFilterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                        updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                        updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={personId}
                        clearFilters={clearFilters} >
                    <WorkFilter personId={personId} workFilter={filterScratch} className={styles.workFilter} updateFilterByField={updateFilterByField}
                        clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} hideSourceStatus={true} savedSearchOptions={workFilterOptions}/>
                </AccordionItem>
            </Accordion>
            <hr />
            <div className={styles.menuItem}>
                <Link to={'/workAddNew'} className={styles.newWork}><L p={p} t={`Add new document`}/></Link><br />
            </div>
            <div className={styles.menuItem}>
                <Link to={'/editorInviteNameEmail'} className={styles.newEditor}><L p={p} t={`Invite a new editor`}/></Link>
                {editorInvitePending && editorInvitePending.length > 0 &&
                    <InvitesPending invites={editorInvitePending} personId={owner_personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                        resendInvite={resendInvite}/>
                }
            </div>
            <hr />
            <ul className={styles.unorderedList}>
                {!workSummaries || workSummaries.length === 0 ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
                {workSummaries && workSummaries.length > 0 &&
                    <Accordion allowMultiple={true}>
                        {workSummaries.map((w, i) => {
                            let chaptersChosen = w.editorAssign && w.editorAssign.length > 0 &&
                                w.editorAssign.filter(m => m.editorPersonId === personId)
                                    .reduce((acc, assign) =>
                                        acc
                                            ? acc.includes(assign.chapterId)
                                                ? acc
                                                : acc.concat(assign.chapterId)
                                            : [assign.chapterId]
                                        , [])

                            let languagesChosen = w.editorAssign && w.editorAssign.length > 0 &&
                                w.editorAssign.filter(m => m.editorPersonId === personId)
                                    .reduce((acc, assign) =>
                                        acc
                                            ? acc.includes(assign.languageId)
                                                ? acc
                                                : acc.concat(assign.languageId)
                                            : [assign.languageId]
                                        , [])

                            return (
                              <AccordionItem title={w.title} isCurrentTitle={w.isCurrentWork} expanded={w.isExpanded} key={i}
                                      className={classes(styles.accordionTitle, w.isCurrentWork ? styles.isCurrentWork : '')}
                                      onTitleClick={() => {}} showAssignWorkToEditor={true}
                                      editorAssign={w.editorAssign && w.editorAssign.length > 0 && w.editorAssign.filter(m => m.editorPersonId === personId)}
                                      personId={personId} owner_personId={owner_personId} languageId={languageId} chapterOptions={w.chapterOptions}
                                      languageOptions={languageOptions} setEditorAssign={setEditorAssign} chaptersChosen={chaptersChosen}
                                      languagesChosen={languagesChosen} workId={w.workId} updatePersonConfig={updatePersonConfig} personConfig={personConfig}
                                      editorPersonId={contactSummary.personId}>
                                  <WorkSummary key={i*100} summary={w} className={styles.workSummary} showIcons={true} personId={filterScratch.personId}
                                      setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} showTitle={false}
                                      labelCurrentClass={styles.labelCurrentClass} deleteChapter={deleteChapter}
                                      updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                                      updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                              </AccordionItem>
                            )
                        })}
                    </Accordion>
                }
            </ul>
            <OneFJefFooter />
        </div>
    )
}
