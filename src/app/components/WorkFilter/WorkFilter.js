import React, {Component} from 'react';
import classes from 'classnames';
import styles from './WorkFilter.css';
import RadioGroup from '../RadioGroup';
import DateTimePicker from '../DateTimePicker';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputText from '../InputText';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

//The work filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the workFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
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
      }

      this.handleOwnerType = this.handleOwnerType.bind(this);
      this.handleStatus = this.handleStatus.bind(this);
      this.handleSearchNameChange = this.handleSearchNameChange.bind(this);
      this.handleSearchNameSubmit = this.handleSearchNameSubmit.bind(this);
      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
      this.handleSearchTextSubmit = this.handleSearchTextSubmit.bind(this);
      this.handleSearchTitleEnterKey = this.handleSearchTitleEnterKey.bind(this);
      this.handleSaveSearchEnterKey = this.handleSaveSearchEnterKey.bind(this);
      this.avoidDupicateSearchName = this.avoidDupicateSearchName.bind(this);
  }

  componentDidUpdate() {
      document.getElementById('searchText').value = this.props.workFilter.searchText
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

  handleOwnerType(value) {
      const {updateFilterByField, personId} = this.props;
      updateFilterByField(personId, "sourceChosen", value);
      if (value === "all") {
          updateFilterByField(personId, "mine", true);
          updateFilterByField(personId, "others", true);
      } else if (value === "mine") {
          updateFilterByField(personId, "mine", true);
          updateFilterByField(personId, "others", false);
      } else if (value === "others") {
          updateFilterByField(personId, "mine", false);
          updateFilterByField(personId, "others", true);
      }
  }

  handleStatus(value) {
    const {updateFilterByField, personId} = this.props;
    updateFilterByField(personId, "statusChosen", value);
    if (value === "all") {
        updateFilterByField(personId, "active", true);
        updateFilterByField(personId, "completed", true);
    } else if (value === "active") {
        updateFilterByField(personId, "active", true);
        updateFilterByField(personId, "completed", false);
    } else if (value === "completed") {
        updateFilterByField(personId, "active", false);
        updateFilterByField(personId, "completed", true);
    }
  }

  render() {

    let sourceOptions = [
        {
            label: "All",
            id: "all"
        },
        {
            label: "Mine",
            id: "mine"
        },
        {
            label: "Others'",
            id: "others"
        },
    ];
    let statusOptions = [
        {
            label: "All",
            id: "all"
        },
        {
            label: "Active",
            id: "active"
        },
        {
            label: "Completed",
            id: "completed"
        },
    ];
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

    const {workFilter, hideSourceStatus, updateFilterByField} = this.props;
    const {savedSearchName, errorSearchName, searchText} = this.state;
    const wf = workFilter;

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.row}>
                    <span className={styles.textSave}><L p={p} t={`Save search`}/></span>
                    <InputText
                        size={"medium"}
                        name={"name"}
                        value={savedSearchName}
                        onChange={this.handleSearchNameChange}
                        onEnterKey={this.handleSaveSearchEnterKey}
                        error={errorSearchName} />
                    <a onClick={this.handleSearchNameSubmit} className={styles.linkStyle}>
                        <Icon pathName={`plus`} className={styles.image}/>
                    </a>
                </div>
                <hr/>
                <div className={!hideSourceStatus ? styles.row : styles.hidden}>
                    <span className={styles.text}><L p={p} t={`Owner-type`}/></span>
                    <RadioGroup
                        data={sourceOptions}
                        name={`sourceFilter`}
                        horizontal={true}
                        className={classes(styles.radio, (hideSourceStatus ? styles.hidden : ''))}
                        labelClass={styles.radioLabels}
                        radioClass={styles.radioClass}
                        initialValue={wf.sourceChosen ? wf.sourceChosen : ''}
                        onClick={(event) => this.handleOwnerType(event)}
                        personId={wf.personId}/>
                </div>
                <hr className={!hideSourceStatus ? styles.divider : styles.hidden}/>
                <div className={!hideSourceStatus ? styles.row : styles.hidden}>
                    <span className={styles.text}><L p={p} t={`Status`}/></span>
                    <RadioGroup
                        data={statusOptions}
                        name={`statusFilter`}
                        horizontal={true}
                        className={classes(styles.radio, (hideSourceStatus ? styles.hidden : ''))}
                        labelClass={styles.radioLabels}
                        radioClass={styles.radioClass}
                        initialValue={wf.statusChosen ? wf.statusChosen : ''}
                        onClick={(event) => this.handleStatus(event)}
                        personId={wf.personId}/>
                </div>
                <hr className={!hideSourceStatus ? styles.divider : styles.hidden}/>
                <div className={styles.row}>
                    <span className={styles.text}><L p={p} t={`Due date`}/></span>
                    <div>
                        <div className={styles.dateRow}>
                            <span className={styles.text}><L p={p} t={`from:`}/></span>
                            <DateTimePicker id={`dueDateFrom`} value={wf.dueDateFrom} maxDate={wf.dueDateTo}
                                onChange={(event) => updateFilterByField(wf.personId, "dueDateFrom", event.target.value)}/>
                        </div>
                        <div className={styles.dateRow}>
                            <span className={styles.text}><L p={p} t={`to:`}/></span>
                            <DateTimePicker id={`dueDateTo`} value={wf.dueDateTo} minDate={wf.dueDateFrom ? wf.dueDateFrom : ''}
                                onChange={(event) => updateFilterByField(wf.personId, "dueDateTo", event.target.value)}/>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <span className={styles.textSave}><L p={p} t={`Search title`}/></span>
                    <InputText
                        size={"medium"}
                        name={"searchText"}
                        value={searchText}
                        onChange={this.handleSearchTextChange}
                        onEnterKey={this.handleSearchTitleEnterKey}
                        inputClassName={styles.inputClassName}
                        labelClass={styles.labelClass} />
                    <a onClick={this.handleSearchTextSubmit} className={styles.linkStyle}>
                        <Icon pathName={`checkmark`} className={styles.image}/>
                    </a>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <div>
                        <SelectSingleDropDown
                            value={wf.orderByChosen ? wf.orderByChosen : ''}
                            options={orderByOptions}
                            label={<L p={p} t={`Order by`}/>}
                            error={''}
                            height={`medium`}
                            noBlank={true}
                            className={styles.singleDropDown}
                            onChange={(event) => updateFilterByField(wf.personId, "orderByChosen", event.target.value)} />
                    </div>
                    <div>
                        <SelectSingleDropDown
                            value={wf.orderSortChosen ? wf.orderSortChosen : ''}
                            options={orderSortOptions}
                            label={<L p={p} t={`Sort direction`}/>}
                            error={''}
                            noBlank={true}
                            height={`medium`}
                            className={styles.singleDropDown}
                            onChange={(event) => updateFilterByField(wf.personId, "orderSortChosen", event.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
}};


// <Checkbox
//     id={`filterDefault`}
//     label={`Default`}
//     labelClass={styles.labelCheckbox}
//     position={`before`}
//     defaultValue={workFilter && workFilter.defaultFlag}
//     checked={workFilter && workFilter.defaultFlag}
//     {...tapOrClick(() => updateFilterByField(personId, "defaultFlag", event.target.value))}
//     className={styles.checkbox} />
