import React from 'react';
import {Link} from 'react-router';
import styles from './MyGroupsView.css';
const p = 'MyGroupsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
//import WorkFilter from '../../components/WorkFilter';
import Loading from '../../components/Loading';
import GroupSummary from '../../components/GroupSummary';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import OneFJefFooter from '../../components/OneFJefFooter';

export default ({personId, className="", updateFilterByField, clearFilters, setGroupCurrentSelected, deleteGroup, removeMember,
                    groupSummaries=[], filterScratch, savedFilterIdCurrent, workFilterOptions, updateSavedSearch, deletePeerGroup,
                    updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch, fetchingRecord,
                    setWorkCurrentSelected, deleteWork, deleteChapter, updateChapterDueDate, updateChapterComment, groupInit}) => {

    return (
        <div className={styles.container}>
            <div className={styles.titleLine}>
                <span className={globalStyles.pageTitle}><L p={p} t={`My Groups`}/></span>
            </div>
            <hr />
            <div>
                <Link to={'/groupTypeChoice'} className={styles.newWork}><L p={p} t={`Create new group`}/></Link>
            </div>
            <hr />
            <Loading isLoading={fetchingRecord && fetchingRecord.groups} />
            {!fetchingRecord.groups && (!groupSummaries || groupSummaries.length === 0) ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
            {groupSummaries && groupSummaries.length > 0 &&
                <Accordion allowMultiple={true}>
                    {groupSummaries.map((s, i) => {
                        return (
                          <AccordionItem title={s.groupName} isCurrentTitle={s.isCurrentGroup} expanded={s.isExpanded} key={i}
                                  className={classes(styles.accordionTitle, s.isCurrentGroup ? styles.isCurrentGroup : '')}
                                  onTitleClick={() => setGroupCurrentSelected(personId, s.groupId, s.masterWorkId, s.memberWorkId, 'assignmentDashboard/' + s.groupId)}>
                              <GroupSummary summary={s} className={styles.summary} showIcons={true} personId={personId} groupInit={groupInit}
                                  setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup} showTitle={false}
                                  noShowCurrent={true} labelCurrentClass={styles.labelCurrentClass} indexKey={i}
                                  setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                                  updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                                  removeMember={removeMember} deletePeerGroup={deletePeerGroup} currentGroupTool={'clipboard_text'}/>
                          </AccordionItem>
                        );
                    })}
                </Accordion>
            }
            <OneFJefFooter />
        </div>
    )
};


// <Accordion noShowExpandAll={true}>
//     <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={workFilterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
//             updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
//             updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={personId}
//             clearFilters={clearFilters}>
//         <WorkFilter personId={personId} workFilter={filterScratch} className={styles.workFilter} updateFilterByField={updateFilterByField}
//             clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} savedSearchOptions={workFilterOptions}/>
//     </AccordionItem>
// </Accordion>
// <hr />
