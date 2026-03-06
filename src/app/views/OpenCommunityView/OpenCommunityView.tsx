import { useState } from 'react'
import globalStyles from '../../utils/globalStyles.css'
import styles from './OpenCommunityView.css'
const p = 'OpenCommunityView'
import L from '../../components/PageLanguage'
import OpenCommunityToSubmit from '../../components/OpenCommunityToSubmit'
import OpenCommunitySubmitted from '../../components/OpenCommunitySubmitted'
import OpenCommunityToVolunteer from '../../components/OpenCommunityToVolunteer'
import OpenCommunityCommitted from '../../components/OpenCommunityCommitted'
import OneFJefFooter from '../../components/OneFJefFooter'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'

function OpenCommunityView(props) {
  const [modifyOpenCommunityEntryId, setModifyOpenCommunityEntryId] = useState(0)
  const [tabsData, setTabsData] = useState({
                chosenTab: "ToVolunteer",
                tabs: this.props.tabs,
            })
  const [chosenTab, setChosenTab] = useState("ToVolunteer")
  const [tabs, setTabs] = useState(this.props.tabs)

  const {personId, workOptions, workList, saveOpenCommunityEntry, modifyEntry, declineIdleOptions, genreOptions, languageOptions,
                  editSeverityOptions, workSummaries, editorsCountOptions, openCommunityToVol, openCommunityFull, removeOpenCommunityEntry, tabEntryCounts,
                  commitOpenCommunityEntry, uncommitOpenCommunityEntry, updateChapterComment, wordCountOptions, setWorkCurrentSelected,
                  //work filter related functions
                  updateFilterByField_work, updateFilterDefaultFlag_work, clearFilters_work, saveNewSavedSearch_work,
                  updateSavedSearch_work, deleteSavedSearch_work, chooseSavedSearch_work,
                  workFilterScratch, savedWorkFilterIdCurrent, workFilterOptions,
                  //open community filter related functions
                  updateFilterByField_openCommunity, updateFilterDefaultFlag_openCommunity, clearFilters_openCommunity,
                  saveNewSavedSearch_openCommunity, updateSavedSearch_openCommunity, deleteSavedSearch_openCommunity,
                  chooseSavedSearch_openCommunity, openCommunityFilterScratch, savedOpenCommunityFilterIdCurrent,
                  openCommunityFilterOptions, } = props
          
  //personConfig,
  
          return (
              <section className={styles.container}>
                  <div className={styles.titleLine}>
                      <span className={globalStyles.pageTitle}>
                          <L p={p} t={`Open Community`}/>
                      </span>
                  </div>
                  <Accordion noShowExpandAll={true}>
                      <AccordionItem title={<L p={p} t={`To Volunteer`}/>} count={tabEntryCounts[0]} isOpenCommunity={true}>
                          <OpenCommunityToVolunteer personId={personId} openCommunityToVol={openCommunityToVol} updateFilterByField={updateFilterByField_openCommunity}
                              clearFilters={clearFilters_openCommunity} filterScratch={openCommunityFilterScratch} savedFilterIdCurrent={savedOpenCommunityFilterIdCurrent}
                              openCommunityFilterOptions={openCommunityFilterOptions} updateSavedSearch={updateSavedSearch_openCommunity}
                              updateFilterDefaultFlag={updateFilterDefaultFlag_openCommunity} deleteSavedSearch={deleteSavedSearch_openCommunity}
                              chooseSavedSearch={chooseSavedSearch_openCommunity} saveNewSavedSearch={saveNewSavedSearch_openCommunity}
                              uncommitOpenCommunityEntry={uncommitOpenCommunityEntry} commitOpenCommunityEntry={commitOpenCommunityEntry}
                              genreOptions={genreOptions} languageOptions={languageOptions}
                              wordCountOptions={wordCountOptions} editSeverityOptions={editSeverityOptions}/>
                      </AccordionItem >
                      <AccordionItem title={<L p={p} t={`Committed`}/>} count={tabEntryCounts[1]} isOpenCommunity={true}>
                          <OpenCommunityCommitted personId={personId} showCommitted={true} openCommunityFull={openCommunityFull}
                              uncommitOpenCommunityEntry={uncommitOpenCommunityEntry} updateChapterComment={updateChapterComment}
                              setWorkCurrentSelected={setWorkCurrentSelected}/>
                      </AccordionItem >
                      <AccordionItem title={<L p={p} t={`To Submit`}/>} count={tabEntryCounts[2]} isOpenCommunity={true}>
                          <OpenCommunityToSubmit workOptions={workOptions} workList={workList} saveOpenCommunityEntry={saveOpenCommunityEntry}
                              modifyEntry={modifyEntry} declineIdleOptions={declineIdleOptions} genreOptions={genreOptions} personId={personId}
                              languageOptions={languageOptions} workSummaries={workSummaries}
                              editSeverityOptions={editSeverityOptions} editorsCountOptions={editorsCountOptions} openCommunityFull={openCommunityFull}
                              onSubmitTabChange={() => handleTabChange('Submitted')} modifyOpenCommunityEntryId={modifyOpenCommunityEntryId}
                              updateChapterComment={updateChapterComment} updateFilterByField_work={updateFilterByField_work}
                              updateFilterDefaultFlag_work={updateFilterDefaultFlag_work} clearFilters_work={clearFilters_work}
                              saveNewSavedSearch_work={saveNewSavedSearch_work} updateSavedSearch_work={updateSavedSearch_work}
                              deleteSavedSearch_work={deleteSavedSearch_work} chooseSavedSearch_work={chooseSavedSearch_work}
                              workFilterScratch={workFilterScratch} savedWorkFilterIdCurrent={savedWorkFilterIdCurrent}
                              workFilterOptions={workFilterOptions} />
                      </AccordionItem >
                      <AccordionItem title={<L p={p} t={`Submitted`}/>} count={tabEntryCounts[3]} isOpenCommunity={true}>
                          <OpenCommunitySubmitted personId={personId} openCommunityFull={openCommunityFull} removeOpenCommunityEntry={removeOpenCommunityEntry}
                              setToModifyRecord={handleSetToModifyRecord} updateChapterComment={updateChapterComment}/>
                      </AccordionItem >
                  </Accordion>
                  <OneFJefFooter />
              </section>
          )
}

//                <TabPage tabsData={tabsData} counts={tabEntryCounts} onClick={this.handleTabChange} className={styles.tabPageMargin} showZeroCount={true}/>
export default OpenCommunityView
