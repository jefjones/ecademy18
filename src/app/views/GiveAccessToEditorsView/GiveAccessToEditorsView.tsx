import { Link } from 'react-router-dom'
import styles from './GiveAccessToEditorsView.css'
const p = 'GiveAccessToEditorsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import ContactFilter from '../../components/ContactFilter'
import ContactSummary from '../../components/ContactSummary'
import WorkSummary from '../../components/WorkSummary'
import InvitesPending from '../../components/InvitesPending'
import Icon from '../../components/Icon'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import classes from 'classnames'
import OneFJefFooter from '../../components/OneFJefFooter'

export default ({workId, owner_personId, languageId, workSummary, contactFilter=[], className="",  updateFilterByField, clearFilters,
                    setContactCurrentSelected, contactSummaries=[], chapterOptions=[], languageOptions=[], setEditorAssign, setWorkCurrentSelected,
                    deleteWork, deleteChapter, updateChapterDueDate, updateChapterComment, editorInvitePending, deleteInvite, acceptInvite, resendInvite,
                    filterScratch, savedFilterIdCurrent, contactFilterOptions, updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch,
                    chooseSavedSearch, saveNewSavedSearch, updatePersonConfig, personConfig }) => {

    return (
        <div className={styles.container}>
            <div className={styles.titleLine}>
                <span className={globalStyles.pageTitle}><L p={p} t={`Give Access to Editors`}/></span>
            </div>
            <Accordion allowMultiple={true} noShowExpandAll={true}>
                <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false} className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                        showAssignWorkToEditor={false} personId={owner_personId} workSummary={workSummary} setWorkCurrentSelected={setWorkCurrentSelected}
                        deleteWork={deleteWork} deleteChapter={deleteChapter} updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                    <WorkSummary summary={workSummary} className={styles.workSummary} personId={owner_personId} isHeaderDisplay={false} showTitle={false}
                        setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                        updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                        updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                </AccordionItem>
            </Accordion>
            <hr />
            <div>
								<div className={classes(styles.row, styles.moreLeft, styles.newEditor)}>
										<Icon pathName={'user'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon} fillColor={'black'}/>
                		<Link to={'/editorInviteNameEmail'} className={styles.link}><L p={p} t={`Invite a new editor`}/></Link>
								</div>
                {editorInvitePending && editorInvitePending.length > 0 &&
                    <InvitesPending invites={editorInvitePending} personId={owner_personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                            resendInvite={resendInvite}/>
                }
            </div>
            <hr />
            <Accordion noShowExpandAll={true}>
                <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={contactFilterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                        updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                        updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={owner_personId}
                        clearFilters={clearFilters}>
                    <ContactFilter personId={owner_personId} contactFilter={filterScratch} className={styles.contactFilter} updateFilterByField={updateFilterByField}
                        clearFilters={clearFilters} showAccessIcon={false} saveNewSavedSearch={saveNewSavedSearch} savedSearchOptions={contactFilterOptions}/>
                </AccordionItem>
            </Accordion>
            <hr />
            <ul className={styles.unorderedList}>
                {!contactSummaries || contactSummaries.length === 0 ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
                {contactSummaries && contactSummaries.length > 0 &&
                    <Accordion allowMultiple={true}>
                        {contactSummaries.map((c, i) => {
                            let chaptersChosen = c.editorAssign && c.editorAssign.length > 0 &&
                                c.editorAssign.filter(e => e.workId === workId)
                                    .reduce((acc, assign) =>
                                        acc
                                            ? acc.includes(assign.chapterId)
                                                ? acc
                                                : acc.concat(assign.chapterId)
                                            : [assign.chapterId]
                                        , [])

                            let languagesChosen = c.editorAssign && c.editorAssign.length > 0 &&
                                c.editorAssign.filter(e => e.workId === workId)
                                    .reduce((acc, assign) =>
                                        acc
                                            ? acc.includes(assign.languageId)
                                                ? acc
                                                : acc.concat(assign.languageId)
                                            : [assign.languageId]
                                        , [])

                            languagesChosen = languagesChosen ? languagesChosen : [1];  //English by default;

                            return (
                              <AccordionItem contactSummary={c} expanded={false} key={i} className={styles.accordionTitle}
                                      onTitleClick={() => {}} showAssignWorkToEditor={true} editorAssign={c.editorAssign}
                                      editorPersonId={c.personId} owner_personId={owner_personId} languageId={languageId} chapterOptions={chapterOptions}
                                      languageOptions={languageOptions} setEditorAssign={setEditorAssign} chaptersChosen={chaptersChosen}
                                      languagesChosen={languagesChosen} workId={workId}>
                                  <ContactSummary key={i*100} summary={c} className={styles.contactSummary} showAccessIcon={false}
                                      personId={c.personId} noShowTitle={true}/>
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
