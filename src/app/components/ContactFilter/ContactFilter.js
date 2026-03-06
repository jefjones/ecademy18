import React, {Component} from 'react';
import styles from './ContactFilter.css';
import RadioGroup from '../RadioGroup';
import DateTimePicker from '../DateTimePicker';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputText from '../InputText';
import Icon from '../Icon';
import classes from 'classnames';

//The contact filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the contactFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
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
      this.handleSearchNameEnterKey = this.handleSearchNameEnterKey.bind(this);
      this.handleSaveSearchEnterKey = this.handleSaveSearchEnterKey.bind(this);
      this.avoidDupicateSearchName = this.avoidDupicateSearchName.bind(this);
  }

  avoidDupicateSearchName() {
      const {savedSearchName} = this.state;
      const {savedSearchOptions} = this.props;
      let noDuplicate = true;

      if (!savedSearchName) return true;

      savedSearchOptions && savedSearchOptions.length > 0 && savedSearchOptions.forEach(m => {
          if (m.label.toLowerCase() === savedSearchName.toLowerCase()) {
              noDuplicate = false;
              this.setState({errorSearchName: 'Duplicate name.'})
          }
      })
      return noDuplicate;
  }

  componentDidUpdate() {
      document.getElementById('searchText').value = this.props.contactFilter.searchText
  }

  handleSearchNameEnterKey(event) {
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
          this.setState({ errorSearchName: 'Search name is missing.'})
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
          updateFilterByField(personId, "editors", true);
          updateFilterByField(personId, "notAssigned", true);
      } else if (value === "editors") {
          updateFilterByField(personId, "editors", true);
          updateFilterByField(personId, "notAssigned", false);
      } else if (value === "notAssigned") {
          updateFilterByField(personId, "editors", false);
          updateFilterByField(personId, "notAssigned", true);
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
            label: "Editors",
            id: "editors"
        },
        {
            label: "Not Assigned",
            id: "notAssigned"
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
            label: "Modified Most Recently",
            id: "lastUpdate"
        },
				{
            label: "First Name",
            id: "firstName"
        },
        {
            label: "Project",
            id: "project"
        },
				{
            label: "Title",
            id: "title"
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

    const {contactFilter, updateFilterByField, clearFilters} = this.props;
    const {savedSearchName, errorSearchName, searchText} = this.state;
    const cf = contactFilter;

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.row}>
                    <span className={styles.textSave}>Save search</span>
                    <InputText
                        size={"medium"}
                        name={"name"}
                        value={savedSearchName}
                        onChange={this.handleSearchNameChange}
                        onEnterKey={this.handleSaveSearchEnterKey}
                        inputClassName={styles.inputClassName}
                        labelClass={styles.labelClass}
                        error={errorSearchName} />
                    <a onClick={this.handleSearchNameSubmit} className={styles.linkStyle}>
                        <Icon pathName={`plus`} className={styles.image}/>
                    </a>
                    <a onClick={() => clearFilters(cf.personId)} className={classes(styles.linkStyle, styles.marginLeft)}>
                        <Icon pathName={`document_refresh`} className={styles.image}/>
                    </a>
                </div>
                <hr/>
                <div className={styles.row}>
                    <span className={styles.text}>Owner-type</span>
                    <RadioGroup data={sourceOptions} name={`sourceFilter`} horizontal={true}
                        className={styles.radio}
                        labelClass={styles.radioLabels} radioClass={styles.radioClass}
                        initialValue={cf.sourceChosen ? cf.sourceChosen : ''} onClick={(event) => this.handleOwnerType(event)} personId={cf.personId}/>
                </div>
                <hr />
                <div className={styles.row}>
                    <span className={styles.text}>Status</span>
                    <RadioGroup data={statusOptions} name={`statusFilter`} horizontal={true}
                        className={styles.radio}
                        labelClass={styles.radioLabels} radioClass={styles.radioClass}
                        initialValue={cf.statusChosen ? cf.statusChosen : ''} onClick={(event) => this.handleStatus(event)} personId={cf.personId}/>
                </div>
                <hr/>
                <div className={styles.row}>
                    <span className={styles.text}>Due date</span>
                    <div>
                        <div className={styles.dateRow}>
                            <span className={styles.text}>from:</span>
                            <DateTimePicker id={`dueDateFrom`} value={cf.dueDateFrom}
                                onChange={(event) => updateFilterByField(cf.personId, "dueDateFrom", event.target.value)}/>
                        </div>
                        <div className={styles.dateRow}>
                            <span className={styles.text}>to:</span>
                            <DateTimePicker id={`dueDateTo`} value={cf.dueDateTo} minDate={cf.dueDateFrom ? cf.dueDateFrom : ''}
                                onChange={(event) => updateFilterByField(cf.personId, "dueDateTo", event.target.value)}/>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.row}>
                    <span className={styles.textSave}>Search name</span>
                    <InputText
                        size={"medium"}
                        name={"searchText"}
                        value={searchText}
                        onChange={this.handleSearchTextChange}
                        onEnterKey={this.handleSearchNameEnterKey}
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
                            value={cf.orderByChosen ? cf.orderByChosen : ''}
                            options={orderByOptions}
                            label={`Order by`}
                            error={''}
                            height={`medium`}
                            noBlank={true}
                            className={styles.singleDropDown}
                            onChange={(event) => updateFilterByField(cf.personId, "orderByChosen", event.target.value)} />
                    </div>
                    <div>
                        <SelectSingleDropDown
                            value={cf.orderSortChosen ? cf.orderSortChosen : ''}
                            options={orderSortOptions}
                            label={`Sort direction`}
                            error={''}
                            noBlank={true}
                            height={`medium`}
                            className={styles.singleDropDown}
                            onChange={(event) => updateFilterByField(cf.personId, "orderSortChosen", event.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )}
};
