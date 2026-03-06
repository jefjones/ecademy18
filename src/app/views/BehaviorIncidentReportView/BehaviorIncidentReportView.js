import React, {Component} from 'react';
import styles from './BehaviorIncidentReportView.css';
const p = 'BehaviorIncidentReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {guidEmpty} from '../../utils/guidValidate';
import {doSort} from '../../utils/sort';
import InputDataList from '../../components/InputDataList';
import CheckboxGroup from '../../components/CheckboxGroup';
import DateTimePicker from '../../components/DateTimePicker';
import RadioGroup from '../../components/RadioGroup';
import FilterGroupsSaved from '../../components/FilterGroupsSaved';
import Loading from '../../components/Loading';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import ReportBarChart from '../../components/ReportBarChart';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';


class BehaviorIncidentReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let filter = this.state.filter;
	    filter[field] = event.target.value;

	    this.setState({ filter });
  }

  handleIncidentTypes = selectedIncidentTypes => {
      this.setState({ filter: {...this.state.filter, selectedIncidentTypes } });
  }
  handleAccusedStudents = accusedStudents => this.setState({ filter: {...this.state.filter, accusedStudents } });
	handleOtherStudents = otherStudents => this.setState({ filter: {...this.state.filter, otherStudents }});
	handleStaffInvolved = staffInvolved => this.setState({ filter: {...this.state.filter, staffInvolved }});

  changeFilter = (event, filterName) => {
			let filter = Object.assign({}, this.state.filter);
			let field = filterName ? filterName : event.target.name;
			filter[field] = event.target.value;
			this.setState({ filter });
	}

  handleRadioChoice = (value, field) => {
			let filter = Object.assign({}, this.state.filter);
			filter[field] = value;
			this.setState({ filter });
	}

  handleCheckboxGroup = (choices, field) => {
      let filter = Object.assign({}, this.state.filter);
      filter[field] = choices;
      this.setState({ filter });
  }

  setFilterGroup = (event) => {
      const {filterGroups} = this.props;
      let filter = Object.assign({}, this.state.filter);

      if (!event.target.value || event.target.value === "0") {
          filter.behaviorIncidentFilterGroupId = event.target.value;
          filter.selectedGradeLevels = [];
          filter.selectedIncidentTypes = [];
          filter.accusedStudents = [];
          filter.otherStudents = [];
          filter.staffInvolved = [];
          //filter.incidentLevels = [];
          filter.incidentDateFrom = '';
          filter.incidentDateTo = '';
          filter.reportType = '';
          filter.summaryType = '';
          filter.stackedOrSideBySide = '';
      } else {
          let filterGroup = filterGroups && filterGroups.length > 0 && filterGroups.filter(m => m.behaviorIncidentFilterGroupId === event.target.value)[0]
          if (filterGroup && filterGroup.behaviorIncidentFilterGroupId) {
              filter.behaviorIncidentFilterGroupId = event.target.value;
              filter.selectedGradeLevels = !filterGroup.selectedGradeLevels ? [] : filterGroup.selectedGradeLevels.split(',');
              filter.selectedIncidentTypes = !filterGroup.selectedIncidentTypes ? [] : filterGroup.selectedIncidentTypes.split(',');
              filter.accusedStudents = !filterGroup.accusedStudents ? [] : filterGroup.accusedStudents.split(',');
              filter.otherStudents = !filterGroup.otherStudents ? [] : filterGroup.otherStudents.split(',');
              filter.staffInvolved = !filterGroup.staffInvolved ? [] : filterGroup.staffInvolved.split(',');
              //filter.incidentLevels = !filterGroup.incidentLevels ? [] : filterGroup.incidentLevels.split(',');
              filter.incidentDateFrom = filterGroup.incidentDateFrom;
              filter.incidentDateTo = filterGroup.incidentDateTo;
              filter.reportType = filterGroup.reportType;
              filter.summaryType = filterGroup.summaryType;
              filter.stackedOrSideBySide = filterGroup.stackedOrSideBySide;
          }
      }
      filter.isUserChangedFilterGroupId = true;
      this.setState({ filter });
  }

  saveOrUpdateFilterGroup = (event, isUpdate) => {
      const {addOrUpdateFilterGroup, personId, filterGroups} = this.props;
      const {behaviorIncidentFilterGroupId, filterGroupName, filter} = this.state;

      let groupName = '';
      if (isUpdate) {
          let filterGroup  = filterGroups && filterGroups.length > 0 && filterGroups.filter(m => m.behaviorIncidentFilterGroupId === behaviorIncidentFilterGroupId)[0];
          if (filterGroup && filterGroup.groupName) groupName = filterGroup.groupName;
          this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your filter group was updated.`}/></div>)

      } else {
          groupName = filterGroupName;
          this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your filter group was added.`}/></div>)
      }

      let filterGroup = {
          behaviorIncidentFilterGroupId: isUpdate ? this.state.behaviorIncidentFilterGroupId : guidEmpty,
          personId: personId,
          groupName,
          selectedGradeLevels: filter.selectedGradeLevels.toString(),
          selectedIncidentTypes: filter.selectedIncidentTypes && filter.selectedIncidentTypes.length > 0 && filter.selectedIncidentTypes.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''),
          accusedStudents: filter.accusedStudents && filter.accusedStudents.length > 0 && filter.accusedStudents.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''),
          otherStudents: filter.otherStudents && filter.otherStudents.length > 0 && filter.otherStudents.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''),
          staffInvolved: filter.staffInvolved && filter.staffInvolved.length > 0 && filter.staffInvolved.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''),
          //incidentLevels: filter.incidentLevels && filter.incidentLevels.length > 0 && filter.incidentLevels.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''),
          incidentDateFrom: filter.incidentDateFrom,
          incidentDateTo: filter.incidentDateTo,
          reportType: filter.reportType,
          summaryType: filter.summaryType,
          stackedOrSideBySide: filter.stackedOrSideBySide,
      }
      addOrUpdateFilterGroup(personId, filterGroup);
      this.setState({ filterGroupName: '' });
  }

  hasFilterChosen = () => {
      let filter = Object.assign({}, this.state.filter);

      if (filter.selectedGradeLevels && filter.selectedGradeLevels.length > 0) return true;
      if (filter.selectedIncidentTypes && filter.selectedIncidentTypes.length > 0) return true;
      if (filter.accusedStudents && filter.accusedStudents.length > 0) return true;
      if (filter.otherStudents && filter.otherStudents.length > 0) return true;
      if (filter.staffInvolved && filter.staffInvolved.length > 0) return true;
      //if (filter.incidentLevels && filter.incidentLevels.length > 0) return true;
      if (filter.incidentDateFrom) return true;
      if (filter.incidentDateTo) return true;
      if (filter.reportType) return true;
      if (filter.summaryType) return true;
      if (filter.stackedOrSideBySide) return true;
  }

  resetFilters = (resetSingleRecipient=true) => {
      this.setState({
          isUserChangedFilterGroupId: true,
          behaviorIncidentFilterGroupId: '',
          selectedGradeLevels: [],
          selectedIncidentTypes: [],
          accusedStudents: [],
          otherStudents: [],
          staffInvolved: [],
          //incidentLevels: [],
          incidentDateFrom: '',
          incidentDateTo: '',
          reportType: '',
          summaryType: '',
          stackedOrSideBySide: '',
      })
      if (resetSingleRecipient) this.setState({ recipient_personId: '' })
      this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`All filters and recipient choices have been reset.`}/></div>)
  }

  changeNewSavedFilterGroupName = (event) => {
      this.setState({ filterGroupName: event.target.value });
  }

  deleteSavedFilterGroup = () => {
      const {removeFilterGroup, personId} = this.props
      const {behaviorIncidentFilterGroupId} = this.state
      removeFilterGroup(personId, behaviorIncidentFilterGroupId)
      this.setState({ behaviorIncidentFilterGroupId: '' })
  }

  handleEnterKeySaveGroupName = (event) => {
      if (event.key === 'Enter') {
          this.saveOrUpdateFilterGroup(event, false)
      }
  }

  filterData = () => {
      const {behaviorIncidents} = this.props;
      const {filter={}} = this.state;
      //incidentLevels: [],

      let incidents = behaviorIncidents;

      if (filter.selectedGradeLevels && filter.selectedGradeLevels.length > 0) {
          incidents = incidents && incidents.length > 0 && incidents.filter(m => {
              let found = false;
              m.accusedStudents && m.accusedStudents.length > 0 && m.accusedStudents.forEach(s => {
                  filter.selectedGradeLevels.forEach(g => {
                      if (s.gradeLevelName === g.label) found = true;
                  })
              })
              return found;
          })
      }

      if (filter.selectedIncidentTypes && filter.selectedIncidentTypes.length > 0) {
          incidents = incidents && incidents.length > 0 && incidents.filter(m => {
              let found = false;
              m.behaviorIncidentTypeChoices && m.behaviorIncidentTypeChoices.length > 0 && m.behaviorIncidentTypeChoices.forEach(s => {
                  filter.selectedIncidentTypes.forEach(g => {
                      if (s.id === g.id) found = true;
                  })
              })
              return found;
          })
      }

      if (filter.accusedStudents && filter.accusedStudents.length > 0) {
          incidents = incidents && incidents.length > 0 && incidents.filter(m => {
              let found = false;
              m.accusedStudents && m.accusedStudents.length > 0 && m.accusedStudents.forEach(s => {
                  filter.accusedStudents.forEach(g => {
                      if (s.id === g.id) found = true;
                  })
              })
              return found;
          })
      }

      if (filter.otherStudents && filter.otherStudents.length > 0) {
          incidents = incidents && incidents.length > 0 && incidents.filter(m => {
              let found = false;
              m.otherStudents && m.otherStudents.length > 0 && m.otherStudents.forEach(s => {
                  filter.otherStudents.forEach(g => {
                      if (s.id === g.id) found = true;
                  })
              })
              return found;
          })
      }

      if (filter.staffInvolved && filter.staffInvolved.length > 0) {
          incidents = incidents && incidents.length > 0 && incidents.filter(m => {
              let found = false;
              m.staffInvolved && m.staffInvolved.length > 0 && m.staffInvolved.forEach(s => {
                  filter.staffInvolved.forEach(g => {
                      if (s.id === g.id) found = true;
                  })
              })
              return found;
          })
      }

      if (filter.incidentDateFrom || filter.incidentDateTo) {
  				if (filter.incidentDateFrom && filter.incidentDateTo) {
  						incidents = incidents.filter(m => m.incidentDate >= filter.incidentDateFrom && m.incidentDate <= filter.incidentDateTo);
  				} else if (filter.incidentDateFrom) {
  						incidents = incidents.filter(m => m.incidentDate >= filter.incidentDateFrom);
  				} else if (filter.incidentDateTo) {
  						incidents = incidents.filter(m => m.incidentDate <= filter.incidentDateTo);
  				}
  		}

      return incidents;
  }

  setData = () => {
      const {behaviorIncidentTypes} = this.props;
      const {filter={}} = this.state;
      let filteredIncidents  = this.filterData();
      if (!filter.summaryType || filter.summaryType === 'Total') {
          //List the incident types by their totals
          let incidentTypes = filteredIncidents && filteredIncidents.length > 0 && filteredIncidents.reduce((acc, m) => {
              m.behaviorIncidentTypeChoices && m.behaviorIncidentTypeChoices.length > 0 && m.behaviorIncidentTypeChoices.forEach(b => {
                  acc = acc && acc.length > 0 ? acc.concat(b.id) : [b.id];
              });
              return acc;
          }, []);

          let uniqueTypes = incidentTypes && incidentTypes.length > 0 ? [...new Set(incidentTypes.map(m => m))] : [];
          let reportData = [['Incidents', 'Subtotal']];
          behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.forEach(m => {
              if (uniqueTypes.indexOf(m.behaviorIncidentTypeId) > -1) {
                  let records = filteredIncidents && filteredIncidents.length > 0 && filteredIncidents.filter(f => {
                      let found = false;
                      f.behaviorIncidentTypeChoices && f.behaviorIncidentTypeChoices.length > 0 && f.behaviorIncidentTypeChoices.forEach(s => {
                          if (s.id === m.id) found = true;
                      })
                      return found;
                  })
                  reportData.push([m.label, (records && records.length) || 0]);
              }
          })
          if (reportData.length === 1) reportData.push([0,0]);
          return reportData;

      } else if (filter.summaryType === 'Monthly') {
          //Group the months in order and provide incident type subtotals
          let uniqueMonths = filteredIncidents && filteredIncidents.length > 0 ? [...new Set(filteredIncidents.map(m => m.month))] : [];
          let reportData = [['Incidents', 'Month']];
          uniqueMonths && uniqueMonths.length > 0 && uniqueMonths.forEach(m => {
              let records = filteredIncidents && filteredIncidents.length > 0 && filteredIncidents.filter(f => f.month === m);
              let label = '';
              if (m === 1) label = `January`;
              if (m === 2) label = `February`;
              if (m === 3) label = `March`;
              if (m === 4) label = `April`;
              if (m === 5) label = `May`;
              if (m === 6) label = `June`;
              if (m === 7) label = `July`;
              if (m === 8) label = `August`;
              if (m === 9) label = `September`;
              if (m === 10) label = `October`;
              if (m === 11) label = `Novembe`;
              if (m === 12) label = `December`;

              reportData.push([label, (records && records.length) || 0]);
          })
          if (reportData.length === 1) reportData.push([0,0]);
          return reportData;

      } else if (filter.summaryType === 'Weekly') {
          //Group the weeks in order and provide incident type subtotals
          let uniqueWeeks = filteredIncidents && filteredIncidents.length > 0 ? [...new Set(filteredIncidents.map(m => m.weekMondayDate))] : [];
          let reportData = [['Incidents', 'Week']];
          uniqueWeeks = doSort(uniqueWeeks, { sortField: 'week', isAsc: true, isNumber: true });
          uniqueWeeks && uniqueWeeks.length > 0 && uniqueWeeks.forEach(m => {
              let records = filteredIncidents && filteredIncidents.length > 0 && filteredIncidents.filter(f => f.weekMondayDate === m);
              reportData.push([m, (records && records.length) || 0]);
          })
          if (reportData.length === 1) reportData.push([0,0]);
          return reportData;

      } else if (filter.summaryType === 'Hourly') {
        //Group the hours in order and provide incident type subtotals
        let uniqueHours = filteredIncidents && filteredIncidents.length > 0 ? [...new Set(filteredIncidents.map(m => m.hour))] : [];
        let reportData = [['Incidents', 'Hour']];
        uniqueHours = doSort(uniqueHours, { sortField: 'hour', isAsc: true, isNumber: true });
        uniqueHours && uniqueHours.length > 0 && uniqueHours.forEach(m => {
            let records = filteredIncidents && filteredIncidents.length > 0 && filteredIncidents.filter(f => f.hour === m);
            let label = m;
            if (label > 12) {
                label -= 12;
                label += ':00 pm';
            } else {
                label += ':00 am';
            }
            reportData.push([label, (records && records.length) || 0]);
        })
        if (reportData.length === 1) reportData.push([0,0]);
        return reportData;

      }
  }

  render() {
    const {personId, filterGroups, behaviorIncidentTypes, myFrequentPlaces, setMyFrequentPlace, gradeLevels, facilitators, students} = this.props;
    const {filter={}, behaviorIncidentFilterGroupId, filterGroupName} = this.state;
    let reportData = this.setData();

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Behavior Incident Report`}/>
            </div>
            <FilterGroupsSaved filterGroups={filterGroups} filterGroupSavedId={behaviorIncidentFilterGroupId} filterGroupName={filterGroupName}
                setFilterGroup={this.setFilterGroup} saveOrUpdateGroup={this.saveOrUpdateFilterGroup} hasFilterChosen={this.hasFilterChosen}
                changeNewSavedGroupName={this.changeNewSavedFilterGroupName} deleteSavedGroup={this.deleteSavedFilterGroup} resetFilters={this.resetFilters}
                handleEnterKeySaveGroupName={this.handleEnterKeySaveGroupName}/>
            <hr />
            <div className={classes(styles.doubleLeft, styles.moreBottomMargin, styles.rowWrap)}>
                <CheckboxGroup
                    label={<L p={p} t={`Grade level(s)`}/>}
                    name={'selectedGradeLevels'}
                    options={gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label.length <= 2)}
                    horizontal={true}
                    onSelectedChanged={(values) => this.handleCheckboxGroup(values, 'selectedGradeLevels')}
                    labelClass={styles.text}
                    selected={filter.selectedGradeLevels}/>
            </div>
            <div className={classes(styles.row, styles.moreBottom)}>
                <div className={styles.muchMoreRight}>
                    <InputDataList
                        label={<L p={p} t={`Incident types`}/>}
                        name={'incidentTypes'}
                        options={behaviorIncidentTypes}
                        value={filter.selectedIncidentTypes}
                        listAbove={true}
                        multiple={true}
                        height={`medium`}
                        className={styles.moreSpace}
                        onChange={this.handleIncidentTypes}/>
                </div>
                {/*<div className={globalStyles.multiSelect}>
                    <CheckboxGroup
                        label={<L p={p} t={`Incident level(s)`}/>}
                        name={'incidentLevels'}
                        options={[{id: 1, label: 1}, {id: 2, label: 2}, {id: 3, label: 3}]}
                        horizontal={true}
                        onSelectedChanged={(values) => this.handleCheckboxGroup(values, 'incidentLevels')}
                        labelClass={styles.text}
                        selected={filter.incidentLevels}/>
                </div>*/}
            </div>
            <div className={styles.row}>
                <div>
                    <InputDataList
                        label={<L p={p} t={`Student(s) accused`}/>}
                        name={'accusedStudents'}
                        options={students}
                        value={filter.accusedStudents}
                        listAbove={true}
                        multiple={true}
                        height={`medium`}
                        className={styles.moreSpace}
                        onChange={this.handleAccusedStudents}/>
                </div>
                <div>
                    <InputDataList
                        label={<L p={p} t={`Other students (innocent)`}/>}
                        name={'otherStudents'}
                        options={students}
                        value={filter.otherStudents}
                        listAbove={true}
                        multiple={true}
                        height={`medium`}
                        className={styles.moreSpace}
                        onChange={this.handleOtherStudents}/>
                </div>
                <div>
                    <InputDataList
                        label={<L p={p} t={`Staff involved`}/>}
                        name={'staffInvolved'}
                        options={facilitators}
                        value={filter.staffInvolved}
                        listAbove={true}
                        multiple={true}
                        height={`medium`}
                        className={styles.moreSpace}
                        onChange={this.handleStaffInvolved}/>
                </div>
            </div>
            <div className={classes(styles.row, styles.moreTop)}>
                <div>
                    <DateTimePicker label={<L p={p} t={`Date from:`}/>} id={`incidentDateFrom`} value={filter.incidentDateFrom}
                        onChange={(event) => this.changeFilter(event, 'incidentDateFrom')}/>
                </div>
                <div className={styles.leftSpace}>
                    <DateTimePicker label={<L p={p} t={`To:`}/>} id={`incidentDateTo`} value={filter.incidentDateTo} minDate={filter.incidentDateFrom ? filter.incidentDateFrom : ''}
                        onChange={(event) => this.changeFilter(event, 'incidentDateTo')}/>
                </div>
            </div>
            <div className={styles.settingsBackground}>
                <div className={classes(globalStyles.classification, styles.littleBottom)}><L p={p} t={`Report Settings`}/></div>
                <div>
                    <RadioGroup
                        label={<L p={p} t={`Summary type`}/>}
                        data={[
                            { label: <L p={p} t={`Total`}/>, id: 'Total' },
                            { label: <L p={p} t={`Monthly`}/>, id: 'Monthly' },
                            { label: <L p={p} t={`Weekly`}/>, id: 'Weekly' },
                            { label: <L p={p} t={`Hourly`}/>, id: 'Hourly' },
                        ]}
                        name={`summaryType`}
                        horizontal={true}
                        className={styles.radio}
                        initialValue={filter.summaryType}
                        onClick={(event) => this.handleRadioChoice(event, 'summaryType')}/>
                </div>
                <div>
                    <RadioGroup
                        label={<L p={p} t={`Report type`}/>}
                        data={[
                            { label: <L p={p} t={`Bar horizontal`}/>, id: 'BarChart' },
                            { label: <L p={p} t={`Bar vertical`}/>, id: 'Bar' },
                        ]}
                        name={`reportType`}
                        horizontal={true}
                        className={styles.radio}
                        initialValue={filter.reportType}
                        onClick={(event) => this.handleRadioChoice(event, 'reportType')}/>
                </div>
                {filter.reportType === 'BarChart' &&
                    <div>
                        <RadioGroup
                            label={<L p={p} t={`Bar graph display`}/>}
                            data={[
                                { label: <L p={p} t={`Side-by-side bars`}/>, id: 'SideBySide' },
                                { label: <L p={p} t={`Stacked bars`}/>, id: 'Stacked' },
                            ]}
                            name={`stackedOrSideBySide`}
                            horizontal={true}
                            className={styles.radio}
                            initialValue={filter.stackedOrSideBySide}
                            onClick={(event) => this.handleRadioChoice(event, 'stackedOrSideBySide')}/>
                    </div>
                }
            </div>
            <ReportBarChart title={`Behavior Incident Report`} data={reportData} subtitle={filter.summaryType} chartType={filter.reportType}
                isStacked={filter.stackedOrSideBySide === 'Stacked' ? true : false} width={'500px'}
                loader={<Loading isLoading={!(reportData && reportData.length > 0)}/>} />
            <MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Behavior Incident Add`}/>} path={'behaviorIncidentAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
        </div>
    );
  }
}

export default withAlert(BehaviorIncidentReportView);
