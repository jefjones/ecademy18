import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as styles from './ContributorReportView.css'
const p = 'ContributorReportView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import ReportFilter from '../../components/ReportFilter'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'
//import EditorEditList from '../../components/EditorEditList';

function ContributorReportView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const params = useParams()
  const [chosenTab, setChosenTab] = useState("edit")
  const [reportChoice, setReportChoice] = useState('editWorksEditors')

  const {personId, reportTable, updateFilterByField, clearFilters, filterScratch, savedFilterIdCurrent,
             updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch, workOptions,
             nativeLanguageOptions, translateLanguageOptions, editorOptions, sectionOptions, filterOptions, editTypeOptions } = props
      const {editTypeCount} = params
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Editor Report`}/>
              </div>
              <Accordion noShowExpandAll={true}>
                  {filterOptions && filterOptions.length > 0
                      ?
                      <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={filterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                          updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                          updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={personId}
                          clearFilters={clearFilters}>
                      <ReportFilter personId={personId} reportFilter={filterScratch} updateFilterByField={updateFilterByField}
                          clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} workOptions={workOptions}
                          incomingParams={params} handleRerouteReport={handleRerouteReport}
                          nativeLanguageOptions={nativeLanguageOptions} translateLanguageOptions={translateLanguageOptions}
                          editorOptions={editorOptions} sectionOptions={sectionOptions} savedSearchOptions={filterOptions}/>
                      </AccordionItem>
                      :
                      <ReportFilter personId={personId} reportFilter={filterScratch} updateFilterByField={updateFilterByField}
                          clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} workOptions={workOptions}
                          incomingParams={params} handleRerouteReport={handleRerouteReport}
                          nativeLanguageOptions={nativeLanguageOptions} translateLanguageOptions={translateLanguageOptions}
                          editorOptions={editorOptions} sectionOptions={sectionOptions} savedSearchOptions={filterOptions}/>
                  }
              </Accordion>
              {editTypeOptions && editTypeOptions.length > 0 &&
                  <div>
                      <SelectSingleDropDown
                          value={editTypeCount ? editTypeCount : tabsData.chosenTab === 'edit' ? 'edits' : 'transCompletePercent'}
                          label={<L p={p} t={`Edit Type Count`}/>}
                          options={editTypeOptions}
                          height={`medium`}
                          noBlank={true}
                          className={styles.singleDropDown}
                          onChange={handleEditTypeChange} />
                  </div>
              }
              {(!editTypeOptions || editTypeOptions.length === 0) &&
                  <div className={styles.marginSpace}>
                  </div>
              }
              <EditTable labelClass={styles.tableLabelClass} headings={reportTable.headings}
                  data={reportTable.data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <br/>
              <br/>
              <OneFJefFooter />
        </div>
      )
}

// <EditorEditList returnToSummary={this.handleFlip}
//                              personId={personId}
//                              workId={workSummary.workId}
//                              chapterId={workSummary.chapterId_current}
//                              languageId={workSummary.languageId}
//                              authorPersonId={authorPersonId}
//                              editDetailsPerson={editDetailsPerson}
//                              editDetails={editDetails}
//                              setEditDetail={setEditDetail}
//                              setAcceptedEdit={setAcceptedEdit}
//                              setEditVoteBack={this.setEditVoteBack}
//                              deleteEditDetail={deleteEditDetail}
//                              restoreEditDetail={restoreEditDetail}
//                              getOriginalSentence={getOriginalSentence}
//                              updateFilter={this.handleFilterKeyValue}
//                              localFilter={localFilter}
//                              setEditorTabSelected={setEditorTabSelected}
//                              setVisitedHrefId={setVisitedHrefId}
//                              getTabsEditors={getTabsEditors}/>
export default ContributorReportView
