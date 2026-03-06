import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './ContributorReportView.css';
const p = 'ContributorReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import ReportFilter from '../../components/ReportFilter';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
//import EditorEditList from '../../components/EditorEditList';

export default class ContributorReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
        tabsData: {
            chosenTab: "edit",
            tabs: this.props.tabs,
            reportChoice: 'editWorksEditors',
        }
    }
  }

  handleRerouteReport = (workIds, nativeLanguageIds, translateLanguageIds, editorIds, sectionIds) => {
      let pathName = this.props.location.pathname;
      let editOrTranslate = pathName && pathName.indexOf('report/e') > -1 ? 'edit' : 'translate';
      workIds = workIds ? workIds : [];
      editorIds = editorIds ? editorIds : [];
      nativeLanguageIds = nativeLanguageIds ? nativeLanguageIds : [];
      translateLanguageIds = translateLanguageIds ? translateLanguageIds : [];
      sectionIds = sectionIds ? sectionIds : [];

      if (editOrTranslate === 'edit') {
          if ((workIds.length === 0 || workIds.length > 1) && (editorIds.length === 0 || editorIds.length > 1)) {
              browserHistory.push('/report/e/edit/works/editors');
          } else if ((workIds.length === 0 || workIds.length > 1) && editorIds.length === 1) {
              browserHistory.push('/report/e/edit/works/' + editorIds[0]);
          } else if (workIds.length === 1 && (editorIds.length === 0 || editorIds.length > 1)) {
              browserHistory.push('/report/e/edit/' + workIds[0] + '/editors');
          } else if (workIds.length === 1 && editorIds.length === 1 && (sectionIds.length === 0 || sectionIds.length > 1)) {
              browserHistory.push('/report/e/edit/' + workIds[0] + '/' + editorIds[0] + '/sections');
          } else if ((workIds.length === 0 || workIds.length > 1)) {
              browserHistory.push('/report/e/edit/works');
          } else if (workIds.length === 1) {
              browserHistory.push('/report/e/edit/' + workIds[0]);
          } else {
              browserHistory.push('/report/e/edit');
          }
      } else { //Or it is translation.
          //fill in the translation reports here.

      }
  }

  handleReportReturnIcon = () => {
      const {reportOptGroup} = this.props;
      const {reportChoice} = this.state;
      let choice = reportChoice ? reportChoice : 'editWorksEditors';

      let pathLink = '';
      reportOptGroup && reportOptGroup.length > 0 && reportOptGroup.forEach(r => {
          r.options && r.options.length > 0 && r.options.forEach(o => {
              if (o.id === choice) {
                  pathLink = o.pathLink;
              }
          })
      })
      if (pathLink) {
          browserHistory.push(`/report/` + pathLink);
      }
  }

  handleReportChange = (event) => {
      const {reportOptGroup} = this.props;
      const {tabsData} = this.state;
      this.setState({ reportChoice: event.target.value})

      let pathLink = '';
      reportOptGroup && reportOptGroup.length > 0 && reportOptGroup.forEach(r => {
          r.options && r.options.length > 0 && r.options.forEach(o => {
              if (o.id === event.target.value) {
                  pathLink = o.pathLink;
                  this.setState({tabsData: {...tabsData, chosenTab: r.editOrTranslate}})
              }
          })
      })
      if (pathLink) {
          browserHistory.push(`/report/` + pathLink);
      }
  }

  handleEditTypeChange = (event) => {
      let pathName = this.props.location.pathname;
      pathName = pathName.indexOf('/editCount') > -1 ? pathName.substring(0, pathName.indexOf('/editCount')) : pathName;
      browserHistory.push(pathName + '/editCount/' + event.target.value);
  }

  handlePathLink = (pathLink) => {
      pathLink && browserHistory.push(pathLink);
  }

  render() {
    const {personId, reportTable, updateFilterByField, clearFilters, filterScratch, savedFilterIdCurrent,
           updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch, workOptions,
           nativeLanguageOptions, translateLanguageOptions, editorOptions, sectionOptions, filterOptions, editTypeOptions } = this.props;
    const {editTypeCount} = this.props.params;
    const {tabsData} = this.state;

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
                        incomingParams={this.props.params} handleRerouteReport={this.handleRerouteReport}
                        nativeLanguageOptions={nativeLanguageOptions} translateLanguageOptions={translateLanguageOptions}
                        editorOptions={editorOptions} sectionOptions={sectionOptions} savedSearchOptions={filterOptions}/>
                    </AccordionItem>
                    :
                    <ReportFilter personId={personId} reportFilter={filterScratch} updateFilterByField={updateFilterByField}
                        clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} workOptions={workOptions}
                        incomingParams={this.props.params} handleRerouteReport={this.handleRerouteReport}
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
                        onChange={this.handleEditTypeChange} />
                </div>
            }
            {(!editTypeOptions || editTypeOptions.length === 0) &&
                <div className={styles.marginSpace}>
                </div>
            }
            <EditTable labelClass={styles.tableLabelClass} headings={reportTable.headings}
                data={reportTable.data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <br/>
            <br/>
            <OneFJefFooter />
      </div>
    );
  }
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
