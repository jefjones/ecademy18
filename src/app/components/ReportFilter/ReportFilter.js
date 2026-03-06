import React, {Component} from 'react';
import styles from './ReportFilter.css';
//import DateTimePicker from '../DateTimePicker';
import MultiSelect from '../MultiSelect';
import SelectSingleDropDown from '../SelectSingleDropDown';
import RadioGroup from '../RadioGroup';
import InputText from '../InputText';
import Icon from '../Icon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

//The repoir filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the reportFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
//  or to name the current search.  However, that means that a "scratch" record needs to be kept at all times.  We'll keep track of that
//  with a flag called ScratchFlag. That record will probably never have a name associated with it and it won't be included in the savedSearch
//  list.  When a record is chosen, however, it will be overwritten so that that Scratch record can be used to update an existing savedSearch
//  but keep that original savedSearch in tact until the user wants to update criteria, rename it or even delete it.
//The savedSearch list will be kept track of locally.
//There is the option for one of the savedSearch-es to be the default search when the page comes up for the first time.
export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          savedSearchName: '',
          errorSearchName: '',
          checkedDefault: false,
          searchText: '',
          savedFilterIdCurrent: 0,  //We only use the savedFilterIdCurrent in the componentDidUpdate function when this id doesn't match the savedFilterIdCurrent being sent in.
                                    //  so that we can update the multiSelect Ids without going into an infinite loop of updating.
          groupChosen: '',
          selectedWorkIds: [],
          selectedNativeLanguageIds: [],
          selectedTranslateLanguageIds: [],
          selectedEditorIds: [],
          selectedSectionIds: [],
      }
  }

  sendBackRerouteReport = (selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds) => {
      const {handleRerouteReport} = this.props;
      handleRerouteReport(selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds);
  }

  handleClearFilter = () => {
      const {reportFilter, clearFilters} = this.props;
      this.setState({
          selectedWorkIds: [],
          selectedNativeLanguageIds: [],
          selectedTranslateLanguageIds: [],
          selectedEditorIds: [],
          selectedSectionIds: [],
      });
      clearFilters(reportFilter.personId);
  }

  avoidDupicateSearchName = () => {
      const {savedSearchName} = this.state;
      const {savedSearchOptions} = this.props;
      let noDuplicate = true;

      if (!savedSearchName) return true;

      savedSearchOptions && savedSearchOptions.length > 0 && savedSearchOptions.forEach(m => {
          if (m.label.toLowerCase() === savedSearchName.toLowerCase()) {
              noDuplicate = false;
              this.setState({errorSearchName: <L p={p} t={`Duplicate name.`}/>})
          }
      })
      return noDuplicate;
  }

  handleSearchTitleEnterKey = (event) => {
      event.key === "Enter" && this.handleSearchTextSubmit();
  }

  handleSaveSearchEnterKey = (event) => {
      if (event.key === "Enter" && this.avoidDupicateSearchName()) {
          this.handleSearchNameSubmit();
      }
  }

  //In order to avoid very slow performance of the multiSelect component, it was essential to keep a local state on the selected Ids,
  //    and then (with the code placed in the MultiSelect's dropDown control when it collapses ), then we save off the accumulated
  //    selected Ids.
  handleGroupSelected = (event) => {
      this.setState({groupChosen: event.target.value });
  }

  handleWorkSelected = (selectedWorkIds) => {
      const {updateFilterByField, personId} = this.props;
      const {selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds} = this.state;
      this.setState({selectedWorkIds});
      updateFilterByField(personId, "workIds", selectedWorkIds);
      this.sendBackRerouteReport(selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds);
  }

  handleNativeLanguageSelected = (selectedNativeLanguageIds) => {
      const {updateFilterByField, personId} = this.props;
      this.setState({selectedNativeLanguageIds});
      updateFilterByField(personId, "nativeLanguageIds", selectedNativeLanguageIds);
  }

  handleTranslateLanguageSelected = (selectedTranslateLanguageIds) => {
      const {updateFilterByField, personId} = this.props;
      this.setState({selectedTranslateLanguageIds});
      updateFilterByField(personId, "translateLanguageIds", selectedTranslateLanguageIds);
  }

  handleEditorSelected = (selectedEditorIds) => {
      const {updateFilterByField, personId} = this.props;
      const {selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedSectionIds} = this.state;
      this.setState({selectedEditorIds});
      updateFilterByField(personId, "editorIds", selectedEditorIds);
      this.sendBackRerouteReport(selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds);
  }

  handleSectionSelected = (selectedSectionIds) => {
      const {updateFilterByField, personId} = this.props;
      this.setState({selectedSectionIds});
      updateFilterByField(personId, "sectionIds", selectedSectionIds);
  }

  getJustCollapsed_work = () => {
      const {personId, updateFilterByField} = this.props;
      const {selectedWorkIds} = this.state;
      updateFilterByField(personId, "workIds", selectedWorkIds);
  }

  getJustCollapsed_group = () => {
      const {personId, updateFilterByField} = this.props;
      const {selectedGroupIds} = this.state;
      updateFilterByField(personId, "groupIds", selectedGroupIds);
  }

  getJustCollapsed_nativeLanguage = () => {
      const {personId, updateFilterByField} = this.props;
      const {selectedNativeLanguageIds} = this.state;
      updateFilterByField(personId, "nativeLanguageIds", selectedNativeLanguageIds);
  }

  getJustCollapsed_translateLanguage = () => {
      const {personId, updateFilterByField} = this.props;
      const {selectedTranslateLanguageIds} = this.state;
      updateFilterByField(personId, "translateLanguageIds", selectedTranslateLanguageIds);
  }

  getJustCollapsed_editor = () => {
      const {personId, updateFilterByField} = this.props;
      const {selectedEditorIds} = this.state;
      updateFilterByField(personId, "editorIds", selectedEditorIds);
  }

  getJustCollapsed_section = () => {
      const {personId, updateFilterByField} = this.props;
      const {selectedSectionIds} = this.state;
      updateFilterByField(personId, "sectionIds", selectedSectionIds);
  }

  componentDidUpdate() {
      const {reportFilter} = this.props;
      const {savedFilterIdCurrent} = this.state;

      document.getElementById('searchText').value = this.props.reportFilter.searchText
      if (savedFilterIdCurrent !== reportFilter.savedFilterIdCurrent || this.props.incomingParams !== this.state.incomingParams) {
          this.setState({
              savedFilterIdCurrent: reportFilter.savedFilterIdCurrent,
              selectedWorkIds: reportFilter.workIds,
              selectedNativeLanguageIds: reportFilter.nativeLanguageIds,
              selectedTranslateLanguageIds: reportFilter.translateLanguageIds,
              selectedEditorIds: reportFilter.editorIds,
              selectedSectionIds: reportFilter.sectionIds,
              incomingParams: this.props.incomingParams,
          });
      }
  }

  handleSearchNameChange = (event) => {
      this.setState({ savedSearchName: event.target.value, errorSearchName: '' });
  }

  handleSearchTextChange = (event) => {
      this.setState({ searchText: document.getElementById('searchText').value });
  }

  handleSearchNameSubmit = () => {
      const {savedSearchName} = this.state;
      const {saveNewSavedSearch, personId} = this.props;

      if (savedSearchName && this.avoidDupicateSearchName()) {
          saveNewSavedSearch(personId, savedSearchName)
          this.setState({ savedSearchName: '' });
      } else if (!savedSearchName) {
          this.setState({ errorSearchName: <L p={p} t={`Search name is missing.`}/>})
      }
  }

  handleSearchTextSubmit = () => {
      const {searchText} = this.state;
      const {updateFilterByField, personId} = this.props;

      updateFilterByField(personId, "searchText", searchText);
  }

  workValueRenderer = (selected, options) => {
      if (options.length === 0)
          return <L p={p} t={`No documents match the criteria`}/>

      if (selected.length === 0)
          return <L p={p} t={`Select documents...`}/>

      // if (selected.length === options.length)
      //     return "All documents are selected";

      return <L p={p} t={`Documents:  ${selected.length} of ${options.length}`}/>;
  }

  nativeLanguageValueRenderer = (selected, options) => {
      if (options.length === 0)
          return <L p={p} t={`No native languages match the criteria`}/>

      if (selected.length === 0)
          return <L p={p} t={`Select native language...`}/>;

      // if (selected.length === options.length)
      //     return "All native languages are selected";

      if (selected.length < 5) {
          let comma = "";
          let languageNames = "";
          selected && selected.length > 0 && selected.forEach(value => {
              languageNames += comma + options.filter(o => o.value === value)[0].label;
              comma = ", ";
          });
          languageNames = languageNames === 'en' ? 'English' : languageNames;
          if (selected.length === 1) {
              return <L p={p} t={`Native language:  ${languageNames}`}/>;
          } else {
              return <L p={p} t={`Native languages:  ${languageNames}`}/>;
          }
      } else {
          return <L p={p} t={`Native language:  ${selected.length} of ${options.length}`}/>;
      }
  }

  translateLanguageValueRenderer = (selected, options) => {
      if (options.length === 0)
          return <L p={p} t={`No translate languages match the criteria`}/>

      if (selected.length === 0)
          return <L p={p} t={`Select language to translate...`}/>;

      // if (selected.length === options.length)
      //     return "All languages to translate are selected";

      if (selected.length < 5) {
          let comma = "";
          let languageNames = "";
          selected && selected.length > 0 && selected.forEach(value => {
              languageNames += comma + options.filter(o => o.value === value)[0].label;
              comma = ", ";
          });
          languageNames = languageNames === 'en' ? 'English' : languageNames;
          if (selected.length === 1) {
              return <L p={p} t={`Language to translate:  ${languageNames}`}/>;
          } else {
              return <L p={p} t={`Languages to translate:  ${languageNames}`}/>;
          }
      } else {
          return <L p={p} t={`Languages to translate:  ${selected.length} of ${options.length}`}/>;
      }
  }

  editorValueRenderer = (selected, options) => {
      if (options.length === 0)
          return <L p={p} t={`No editors match the criteria`}/>

      if (selected.length === 0)
          return <L p={p} t={`Select editors...`}/>;

      // if (selected.length === options.length)
      //     return "All editors are selected";

      return <L p={p} t={`Editors:  ${selected.length} of ${options.length}`}/>;
  }

  sectionValueRenderer = (selected, options) => {
      if (options.length === 0)
          return <L p={p} t={`No sections/chapters match the criteria`}/>

      if (selected.length === 0)
          return <L p={p} t={`Select sections/chapters...`}/>;

      // if (selected.length === options.length)
      //     return "All sections/chapters are selected";

      return <L p={p} t={`Sections/chapters:  ${selected.length} of ${options.length}`}/>;
  }

  render() {

    const {workOptions, nativeLanguageOptions, translateLanguageOptions, editorOptions, sectionOptions, personId} = this.props;
    const {savedSearchName, errorSearchName, searchText, selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds,
             selectedEditorIds, selectedSectionIds, groupChosen} = this.state;

     let groupOptions = [{
         label: 'No group chosen',
         id: 0,
     }];

     let EditOrTranslateOptions = [
         {
             label: "Native language edits",
             id: "editNative"
         },
         {
             label: "Language translations",
             id: "translationLanguages"
         },
     ];


    return (
        <div className={styles.container}>
            <div>
                <RadioGroup
                    data={EditOrTranslateOptions}
                    name={`sourceFilter`}
                    horizontal={true}
                    className={styles.radio}
                    labelClass={styles.radioLabels}
                    radioClass={styles.radioClass}
                    initialValue={'editNative'}
                    onClick={(event) => this.handleOwnerType(event)}
                    personId={personId}/>
            </div>
            <hr />
            <div>
                <div className={styles.multiSelect}>
                    <SelectSingleDropDown
                        id={`groups`}
                        label={<L p={p} t={`Group`}/>}
                        value={groupChosen}
                        options={groupOptions}
                        noBlank={true}
                        height={`medium`}
                        onChange={this.handleGroupSelected} />
                </div>
                {workOptions && workOptions.length > 0 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={workOptions}
                            onSelectedChanged={this.handleWorkSelected}
                            getJustCollapsed={this.handleWorkSelected}
                            valueRenderer={this.workValueRenderer}
                            selected={selectedWorkIds}/>
                    </div>
                }
                {nativeLanguageOptions && nativeLanguageOptions.length > 1 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={nativeLanguageOptions}
                            onSelectedChanged={this.handleNativeLanguageSelected}
                            getJustCollapsed={this.handleNativeLanguageSelected}
                            valueRenderer={this.nativeLanguageValueRenderer}
                            selected={selectedNativeLanguageIds}/>
                    </div>
                }
                {translateLanguageOptions && translateLanguageOptions.length > 0 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={translateLanguageOptions}
                            onSelectedChanged={this.handleTranslateLanguageSelected}
                            getJustCollapsed={this.handleTranslateLanguageSelected}
                            valueRenderer={this.translateLanguageValueRenderer}
                            selected={selectedTranslateLanguageIds}/>
                    </div>
                }
                {editorOptions && editorOptions.length > 0 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={editorOptions}
                            onSelectedChanged={this.handleEditorSelected}
                            getJustCollapsed={this.handleEditorSelected}
                            valueRenderer={this.editorValueRenderer}
                            selected={selectedEditorIds}/>
                    </div>
                }
                {sectionOptions && sectionOptions.length > 1 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={sectionOptions}
                            onSelectedChanged={this.handleSectionSelected}
                            getJustCollapsed={this.handleSectionSelected}
                            valueRenderer={this.sectionValueRenderer}
                            selected={selectedSectionIds}/>
                    </div>
                }
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <span className={styles.textSave}><L p={p} t={`Search title`}/></span>
                    <InputText
                        size={"medium"}
                        name={"searchText"}
                        value={searchText ? searchText : ''}
                        onChange={this.handleSearchTextChange}
                        inputClassName={styles.inputClassName}
                        onEnterKey={this.handleSearchTitleEnterKey} />
                    <a onClick={this.handleSearchTextSubmit} className={styles.linkStyle}>
                        <Icon pathName={`checkmark`} className={styles.image}/>
                    </a>
                </div>
                <hr/>
                <div className={styles.row}>
                    <span className={styles.textSave}><L p={p} t={`Save search`}/></span>
                    <InputText
                        size={"medium"}
                        name={"name"}
                        value={savedSearchName ? savedSearchName : ''}
                        onChange={this.handleSearchNameChange}
                        inputClassName={styles.inputClassName}
                        onEnterKey={this.handleSaveSearchEnterKey}
                        labelClass={styles.labelClass}
                        error={errorSearchName} />
                    <a onClick={this.handleSearchNameSubmit} className={styles.linkStyle}>
                        <Icon pathName={`plus`} className={styles.image}/>
                    </a>
                    <a onClick={this.handleClearFilter} className={classes(styles.linkStyle, styles.marginLeft)}>
                        <Icon pathName={`document_refresh`} className={styles.image}/>
                    </a>
                </div>
            </div>
        </div>
    )
}};
