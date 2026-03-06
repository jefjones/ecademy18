import React, {Component} from 'react';
import styles from './OpenCommunityFilter.css';
import classes from 'classnames';
import DateTimePicker from '../DateTimePicker';
import MultiSelect from '../MultiSelect';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputText from '../InputText';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

//The open community filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the openCommunityFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
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
          selectedNativeLanguageIds: [],
          selectedTranslateLanguageIds: [],
          selectedGenreIds: [],
          selectedEditSeverityIds: [],
      }

      this.handleSearchNameChange = this.handleSearchNameChange.bind(this);
      this.handleSearchNameSubmit = this.handleSearchNameSubmit.bind(this);
      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
      this.handleSearchTextSubmit = this.handleSearchTextSubmit.bind(this);
      this.getJustCollapsed_nativeLanguage = this.getJustCollapsed_nativeLanguage.bind(this);
      this.handleNativeLanguageSelected = this.handleNativeLanguageSelected.bind(this);
      this.getJustCollapsed_translateLanguage = this.getJustCollapsed_translateLanguage.bind(this);
      this.handleTranslateLanguageSelected = this.handleTranslateLanguageSelected.bind(this);
      this.getJustCollapsed_genre = this.getJustCollapsed_genre.bind(this);
      this.handleGenreSelected = this.handleGenreSelected.bind(this);
      this.getJustCollapsed_editSeverity = this.getJustCollapsed_editSeverity.bind(this);
      this.handleEditSeveritySelected = this.handleEditSeveritySelected.bind(this);
      this.handleSearchTitleEnterKey = this.handleSearchTitleEnterKey.bind(this);
      this.handleSaveSearchEnterKey = this.handleSaveSearchEnterKey.bind(this);
      this.avoidDupicateSearchName = this.avoidDupicateSearchName.bind(this);
      this.handleClearFilter = this.handleClearFilter.bind(this);
  }

  handleClearFilter() {
      const {openCommunityFilter, clearFilters} = this.props;
      this.setState({
          selectedNativeLanguageIds: [],
          selectedTranslateLanguageIds: [],
          selectedGenreIds: [],
          selectedEditSeverityIds: []
      });
      clearFilters(openCommunityFilter.personId);
  }

  avoidDupicateSearchName() {
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

  handleSearchTitleEnterKey(event) {
      event.key === "Enter" && this.handleSearchTextSubmit();
  }

  handleSaveSearchEnterKey(event) {
      if (event.key === "Enter" && this.avoidDupicateSearchName()) {
          this.handleSearchNameSubmit();
      }
  }

  //In order to avoid very slow performance of the multiSelect component, it was essential to keep a local state on the selected Ids,
  //    and then (with the code placed in the MultiSelect's dropDown control when it collapses ), then we save off the accumulated
  //    selected Ids.
  handleNativeLanguageSelected(selectedNativeLanguageIds) {
      this.setState({selectedNativeLanguageIds});
  }

  handleTranslateLanguageSelected(selectedTranslateLanguageIds) {
      this.setState({selectedTranslateLanguageIds});
  }

  handleGenreSelected(selectedGenreIds) {
      this.setState({selectedGenreIds});
  }

  handleEditSeveritySelected(selectedEditSeverityIds) {
      this.setState({selectedEditSeverityIds});
  }

  getJustCollapsed_nativeLanguage() {
      const {personId, updateFilterByField} = this.props;
      const {selectedNativeLanguageIds} = this.state;
      updateFilterByField(personId, "nativeLanguageIds", selectedNativeLanguageIds);
  }

  getJustCollapsed_translateLanguage() {
      const {personId, updateFilterByField} = this.props;
      const {selectedTranslateLanguageIds} = this.state;
      updateFilterByField(personId, "translateLanguageIds", selectedTranslateLanguageIds);
  }

  getJustCollapsed_genre() {
      const {personId, updateFilterByField} = this.props;
      const {selectedGenreIds} = this.state;
      updateFilterByField(personId, "genreIds", selectedGenreIds);
  }

  getJustCollapsed_editSeverity() {
      const {personId, updateFilterByField} = this.props;
      const {selectedEditSeverityIds} = this.state;
      updateFilterByField(personId, "editSeverityIds", selectedEditSeverityIds);
  }

  componentDidUpdate() {
      const {openCommunityFilter} = this.props;
      const {savedFilterIdCurrent} = this.state;

      document.getElementById('searchText').value = this.props.openCommunityFilter.searchText
      if (savedFilterIdCurrent !== openCommunityFilter.savedFilterIdCurrent) {
          this.setState({
              savedFilterIdCurrent: openCommunityFilter.savedFilterIdCurrent,
              selectedNativeLanguageIds: openCommunityFilter.nativeLanguageIds,
              selectedTranslateLanguageIds: openCommunityFilter.translateLanguageIds,
              selectedGenreIds: openCommunityFilter.genreIds,
              selectedEditSeverityIds: openCommunityFilter.editSeverityIds,
          });
      }
  }

  handleSearchNameChange(event) {
      this.setState({ savedSearchName: event.target.value, errorSearchName: '' });
  }

  handleSearchTextChange(event) {
      this.setState({ searchText: document.getElementById('searchText').value });
  }

  handleSearchNameSubmit() {
      const {savedSearchName} = this.state;
      const {saveNewSavedSearch, personId} = this.props;

      if (savedSearchName && this.avoidDupicateSearchName()) {
          saveNewSavedSearch(personId, savedSearchName)
          this.setState({ savedSearchName: '' });
      } else if (!savedSearchName) {
          this.setState({ errorSearchName: <L p={p} t={`Search name is missing.`}/>})
      }
  }

  handleSearchTextSubmit() {
      const {searchText} = this.state;
      const {updateFilterByField, personId} = this.props;

      updateFilterByField(personId, "searchText", searchText);
  }

  nativeLanguageValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select native language...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All native languages are selected`}/>;
      }

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

  translateLanguageValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select language to translate...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All languages to translate are selected`}/>;
      }

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

  genreValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select genres...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All genres are selected`}/>;
      }

      return <L p={p} t={`Genres:  ${selected.length} of ${options.length}`}/>;
  }

  editSeverityValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select edit intensity...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All edit intensities are selected`}/>;
      }

      let comma = "";
      let editSeverityNames = "";
      selected && selected.length > 0 && selected.forEach(value => {
          editSeverityNames += comma + options.filter(o => o.value === value)[0].label;
          comma = ", ";
      });
      if (selected.length === 1) {
          return <L p={p} t={`Edit severity:  ${editSeverityNames}`}/>;
      } else {
          return <L p={p} t={`Edit severities:  ${editSeverityNames}`}/>;
      }
  }


  render() {

    let orderByOptions = [
        {
            label: "Due date",
            id: "chapterDueDate"
        },
        {
            label: "Title",
            id: "title"
        },
        {
            label: "Modified Most Recently",
            id: "lastUpdate"
        },
        {
            label: "Project",
            id: "project"
        },
    ];
    let orderSortOptions = [
        {
            label: "Ascending",
            id: "asc"
        },
        {
            label: "Descending",
            id: "desc"
        },
    ];

    const {openCommunityFilter, updateFilterByField, editSeverityOptions, wordCountOptions, genreOptions, languageOptions} = this.props;
    const {savedSearchName, errorSearchName, searchText, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedGenreIds,
            selectedEditSeverityIds} = this.state;

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.row}>
                    <span className={styles.textSave}><L p={p} t={`Save search`}/></span>
                    <InputText
                        size={"medium"}
                        name={"name"}
                        value={savedSearchName ? savedSearchName : ''}
                        onChange={this.handleSearchNameChange}
                        onEnterKey={this.handleSaveSearchEnterKey}
                        error={errorSearchName} />
                    <a onClick={this.handleSearchNameSubmit} className={styles.linkStyle}>
                        <Icon pathName={`plus`} className={styles.image}/>
                    </a>
                    <a onClick={this.handleClearFilter} className={classes(styles.linkStyle, styles.marginLeft)}>
                        <Icon pathName={`document_refresh`} className={styles.image}/>
                    </a>
                </div>
                <hr/>
                <div className={styles.multiSelect}>
                    <MultiSelect
                        options={languageOptions}
                        onSelectedChanged={this.handleNativeLanguageSelected}
                        getJustCollapsed={this.getJustCollapsed_nativeLanguage}
                        valueRenderer={this.nativeLanguageValueRenderer}
                        selected={selectedNativeLanguageIds}/>
                </div>
                <div className={styles.multiSelect}>
                    <MultiSelect
                        options={languageOptions}
                        onSelectedChanged={this.handleTranslateLanguageSelected}
                        getJustCollapsed={this.getJustCollapsed_translateLanguage}
                        valueRenderer={this.translateLanguageValueRenderer}
                        selected={selectedTranslateLanguageIds}/>
                </div>
                <div className={styles.multiSelect}>
                    <MultiSelect
                        options={genreOptions}
                        onSelectedChanged={this.handleGenreSelected}
                        getJustCollapsed={this.getJustCollapsed_genre}
                        valueRenderer={this.genreValueRenderer}
                        selected={selectedGenreIds}/>
                </div>
                <hr />
                <div className={styles.row}>
                    <span className={styles.text}><L p={p} t={`Due date`}/></span>
                    <div>
                        <div className={styles.dateRow}>
                            <span className={styles.text}><L p={p} t={`from:`}/></span>
                            <DateTimePicker id={`dueDateFrom`} value={openCommunityFilter.dueDateFrom}
                                onChange={(event) => updateFilterByField(openCommunityFilter.personId, "dueDateFrom", event.target.value)}/>
                        </div>
                        <div className={styles.dateRow}>
                            <span className={styles.text}><L p={p} t={`to:`}/></span>
                            <DateTimePicker id={`dueDateTo`} value={openCommunityFilter.dueDateTo} minDate={openCommunityFilter.dueDateFrom ? openCommunityFilter.dueDateFrom : ''}
                                onChange={(event) => updateFilterByField(openCommunityFilter.personId, "dueDateTo", event.target.value)}/>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <span className={styles.text}><L p={p} t={`Word Count`}/></span>
                    <div className={styles.row}>
                        <div className={styles.dateRow}>
                            <SelectSingleDropDown
                                value={openCommunityFilter.wordCountFrom ? openCommunityFilter.wordCountFrom : ''}
                                options={wordCountOptions}
                                error={''}
                                label={<L p={p} t={`From`}/>}
                                height={`short`}
                                noBlank={true}
                                labelClass={styles.text}
                                selectClass={styles.selectListClass}
                                onChange={(event) => updateFilterByField(openCommunityFilter.personId, "wordCountFrom", event.target.value)} />
                        </div>
                        <div className={classes(styles.dateRow, styles.leftMargin)}>
                            <SelectSingleDropDown
                                value={openCommunityFilter.wordCountTo ? openCommunityFilter.wordCountTo : ''}
                                options={wordCountOptions}
                                error={''}
                                label={<L p={p} t={`To`}/>}
                                height={`short`}
                                noBlank={true}
                                labelClass={styles.text}
                                selectClass={styles.selectListClass}
                                onChange={(event) => updateFilterByField(openCommunityFilter.personId, "wordCountTo", event.target.value)} />
                        </div>
                    </div>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <span className={styles.textSave}><L p={p} t={`Search title`}/></span>
                    <InputText
                        size={"medium"}
                        name={"searchText"}
                        value={searchText ? searchText : ''}
                        onChange={this.handleSearchTextChange}
                        inputClassName={styles.inputClassName}
                        onEnterKey={this.handleSearchTitleEnterKey}
                        labelClass={styles.labelClass} />
                    <a onClick={this.handleSearchTextSubmit} className={styles.linkStyle}>
                        <Icon pathName={`checkmark`} className={styles.image}/>
                    </a>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.multiSelect}>
                    <MultiSelect
                        options={editSeverityOptions}
                        onSelectedChanged={this.handleEditSeveritySelected}
                        getJustCollapsed={this.getJustCollapsed_editSeverity}
                        valueRenderer={this.editSeverityValueRenderer}
                        selected={selectedEditSeverityIds}/>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <div>
                        <SelectSingleDropDown
                            value={openCommunityFilter.orderByChosen ? openCommunityFilter.orderByChosen : ''}
                            options={orderByOptions}
                            label={<L p={p} t={`Order by`}/>}
                            error={''}
                            height={`medium`}
                            noBlank={true}
                            className={styles.singleDropDown}
                            onChange={(event) => updateFilterByField(openCommunityFilter.personId, "orderByChosen", event.target.value)} />
                    </div>
                    <div>
                        <SelectSingleDropDown
                            value={openCommunityFilter.orderSortChosen ? openCommunityFilter.orderSortChosen : ''}
                            options={orderSortOptions}
                            label={<L p={p} t={`Sort direction`}/>}
                            error={''}
                            noBlank={true}
                            height={`medium`}
                            className={styles.singleDropDown}
                            onChange={(event) => updateFilterByField(openCommunityFilter.personId, "orderSortChosen", event.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
}};
