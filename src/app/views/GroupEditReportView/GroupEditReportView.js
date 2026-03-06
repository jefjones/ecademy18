import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './GroupEditReportView.css';
const p = 'GroupEditReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import ReportFilter from '../../components/ReportFilter';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
// import TabPage from '../../components/TabPage';
// import Icon from '../../components/Icon';
import OneFJefFooter from '../../components/OneFJefFooter';
//import EditorEditList from '../../components/EditorEditList';

export default class GroupEditReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.handlePathLink = this.handlePathLink.bind(this);
    this.handleReportChange = this.handleReportChange.bind(this);
    this.handleEditTypeChange = this.handleEditTypeChange.bind(this);
  }

  handleEditTypeChange(event) {
      let pathName = this.props.location.pathname;
      pathName = pathName.indexOf('/editCount') > -1 ? pathName.substring(0, pathName.indexOf('/editCount')) : pathName;
      browserHistory.push(pathName + '/editCount/' + event.target.value);
  }

  handleReportChange(event) {
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

  handlePathLink(pathLink) {
      pathLink && browserHistory.push(pathLink);
  }

  render() {
    const {personId, updateFilterByField, clearFilters, filterScratch, savedFilterIdCurrent,
           updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch, workOptions,
           nativeLanguageOptions, translateLanguageOptions, editorOptions, sectionOptions, filterOptions,
           editTypeOptions} = this.props;
    const {editTypeCount} = this.props.params;
    let {reportTable} = this.props;

    // reportTable.data = [
    //     [{ value: "Anna Lopez" }, { value: 112, }, { value: 33, }, { value: 7, },{ value: 0,},{ value: 40,},{ value: 12,},{ value: 0,},{ value: 67,},{ value: 12,}],
    //     [{ value: "Larry Jenson" }, { value: 57, }, { value: 5, }, { value: 3, },{ value: 2,},{ value: 13,},{ value: 2,},{ value: 0,},{ value: 32,},{ value: 20,}],
    //     [{ value: "Eric Johansson" }, { value: 49, }, { value: 12, }, { value: 1, },{ value: 1,},{ value: 5,},{ value: 0,},{ value: 0,},{ value: 10,},{ value: 27,}],
    //     [{ value: "Peter Liljegren" }, { value: 16, }, { value: 0, }, { value: 5, },{ value: 5,},{ value: 2,},{ value: 6,},{ value: 0,},{ value: 5,},{ value: 11,}],
    //     [{ value: "Julia Roberts" }, { value: 2, }, { value: 0, }, { value: 0, },{ value: 0,},{ value: 0,},{ value: 0,},{ value: 0,},{ value: 0,},{ value: 2,}],
    // ];

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Group Edit Report`}/>
            </div>
            <Accordion noShowExpandAll={true}>
                <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={filterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                        updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                        updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={personId}
                        clearFilters={clearFilters}>
                    <ReportFilter personId={personId} reportFilter={filterScratch} updateFilterByField={updateFilterByField}
                        clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} workOptions={workOptions}
                        nativeLanguageOptions={nativeLanguageOptions} translateLanguageOptions={translateLanguageOptions}
                        editorOptions={editorOptions} sectionOptions={sectionOptions} savedSearchOptions={filterOptions}/>
                </AccordionItem>
            </Accordion>
            {editTypeOptions && editTypeOptions.length > 0 &&
                <div>
                    <SelectSingleDropDown
                        value={editTypeCount}
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
