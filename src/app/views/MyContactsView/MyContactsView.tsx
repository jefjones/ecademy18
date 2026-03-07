import { Link } from 'react-router-dom'
import * as styles from './MyContactsView.css'
const p = 'MyContactsView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import ContactFilter from '../../components/ContactFilter'
import ContactSummary from '../../components/ContactSummary'
import InvitesPending from '../../components/InvitesPending'
import Icon from '../../components/Icon'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

export default ({personId, contactFilter=[], className="", updateFilterByField, clearFilters, setContactCurrentSelected, contactSummaries=[],
                    workSummary, editorInvitePending, deleteInvite, acceptInvite, resendInvite, filterScratch, savedFilterIdCurrent, contactFilterOptions,
                    updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch}) => {

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`My Contacts`}/>
            </div>
            <Accordion noShowExpandAll={true}>
                <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={contactFilterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                        updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                        updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={personId}
                        clearFilters={clearFilters}>
                    <ContactFilter personId={personId} contactFilter={filterScratch} className={styles.contactFilter} updateFilterByField={updateFilterByField}
                        clearFilters={clearFilters} showAccessIcon={false} saveNewSavedSearch={saveNewSavedSearch} savedSearchOptions={contactFilterOptions}/>
                </AccordionItem>
            </Accordion>
            <hr />
            <div>
								<div className={classes(styles.row, styles.moreLeft, styles.newEditor)}>
										<Icon pathName={'user'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon} fillColor={'black'}/>
										<Link to={'/editorInviteNameEmail'} className={styles.link}><L p={p} t={`Invite a new editor`}/></Link>
								</div>
                {editorInvitePending && editorInvitePending.length > 0 &&
                    <InvitesPending invites={editorInvitePending} personId={personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                        resendInvite={resendInvite}/>
                }
            </div>
            <hr />
            {!contactSummaries || contactSummaries.length === 0 ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
            {contactSummaries && contactSummaries.length > 0 &&
                <Accordion allowMultiple={true}>
                    {contactSummaries.map( (contactSummary, i) => {
                        return (
                            <AccordionItem contactSummary={contactSummary} expanded={false} key={i} className={styles.accordionTitle} onTitleClick={() => {}}
                                    showAssignWorkToEditor={false} onContactClick={setContactCurrentSelected} personId={personId}>
                                <ContactSummary key={i*100} summary={contactSummary} className={styles.contactSummary} showAccessIcon={true}
                                    userPersonId={contactSummary.personId} noShowTitle={true}/>
                            </AccordionItem>
                        )
                    }
                )}
                </Accordion>
              }
              <OneFJefFooter />
        </div>
    )
}
