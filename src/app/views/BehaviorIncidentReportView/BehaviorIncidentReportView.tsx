import { useState } from 'react'
import * as styles from './BehaviorIncidentReportView.css'
const p = 'BehaviorIncidentReportView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import {guidEmpty} from '../../utils/guidValidate'
import {doSort} from '../../utils/sort'
import InputDataList from '../../components/InputDataList'
import CheckboxGroup from '../../components/CheckboxGroup'
import DateTimePicker from '../../components/DateTimePicker'
import RadioGroup from '../../components/RadioGroup'
import FilterGroupsSaved from '../../components/FilterGroupsSaved'
import Loading from '../../components/Loading'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import ReportBarChart from '../../components/ReportBarChart'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'


function BehaviorIncidentReportView(props) {
  const [filter, setFilter] = useState({...this.state.filter, selectedIncidentTypes })
  const [selectedIncidentTypes, setSelectedIncidentTypes] = useState(filter.selectedIncidentTypes && filter.selectedIncidentTypes.length > 0 && filter.selectedIncidentTypes.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''))
  const [accusedStudents, setAccusedStudents] = useState(filter.accusedStudents && filter.accusedStudents.length > 0 && filter.accusedStudents.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''))
  const [otherStudents, setOtherStudents] = useState(filter.otherStudents && filter.otherStudents.length > 0 && filter.otherStudents.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''))
  const [staffInvolved, setStaffInvolved] = useState(filter.staffInvolved && filter.staffInvolved.length > 0 && filter.staffInvolved.reduce((acc, m) => acc && acc.length > 0 ? acc + ',' + m.id : m.id, ''))
  const [filterGroupName, setFilterGroupName] = useState('')
  const [isUserChangedFilterGroupId, setIsUserChangedFilterGroupId] = useState(true)
  const [behaviorIncidentFilterGroupId, setBehaviorIncidentFilterGroupId] = useState(isUpdate ? this.state.behaviorIncidentFilterGroupId : guidEmpty)
  const [selectedGradeLevels, setSelectedGradeLevels] = useState(filter.selectedGradeLevels.toString())
  const [incidentDateFrom, setIncidentDateFrom] = useState(filter.incidentDateFrom)
  const [incidentDateTo, setIncidentDateTo] = useState(filter.incidentDateTo)
  const [reportType, setReportType] = useState(filter.reportType)
  const [summaryType, setSummaryType] = useState(filter.summaryType)
  const [stackedOrSideBySide, setStackedOrSideBySide] = useState(filter.stackedOrSideBySide)
  const [recipient_personId, setRecipient_personId] = useState('')

      let reportData = setData()
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Behavior Incident Report`}/>
              </div>
              <FilterGroupsSaved filterGroups={filterGroups} filterGroupSavedId={behaviorIncidentFilterGroupId} filterGroupName={filterGroupName}
                  setFilterGroup={setFilterGroup} saveOrUpdateGroup={saveOrUpdateFilterGroup} hasFilterChosen={hasFilterChosen}
                  changeNewSavedGroupName={changeNewSavedFilterGroupName} deleteSavedGroup={deleteSavedFilterGroup} resetFilters={resetFilters}
                  handleEnterKeySaveGroupName={handleEnterKeySaveGroupName}/>
              <hr />
              <div className={classes(styles.doubleLeft, styles.moreBottomMargin, styles.rowWrap)}>
                  <CheckboxGroup
                      label={<L p={p} t={`Grade level(s)`}/>}
                      name={'selectedGradeLevels'}
                      options={gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label.length <= 2)}
                      horizontal={true}
                      onSelectedChanged={(values) => handleCheckboxGroup(values, 'selectedGradeLevels')}
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
                          onChange={handleIncidentTypes}/>
                  </div>
                  {/*<div className={globalStyles.multiSelect}>
                      <CheckboxGroup
                          label={<L p={p} t={`Incident level(s)`}/>}
                          name={'incidentLevels'}
                          options={[{id: 1, label: 1}, {id: 2, label: 2}, {id: 3, label: 3}]}
                          horizontal={true}
                          onSelectedChanged={(values) => handleCheckboxGroup(values, 'incidentLevels')}
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
                          onChange={handleAccusedStudents}/>
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
                          onChange={handleOtherStudents}/>
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
                          onChange={handleStaffInvolved}/>
                  </div>
              </div>
              <div className={classes(styles.row, styles.moreTop)}>
                  <div>
                      <DateTimePicker label={<L p={p} t={`Date from:`}/>} id={`incidentDateFrom`} value={filter.incidentDateFrom}
                          onChange={(event) => changeFilter(event, 'incidentDateFrom')}/>
                  </div>
                  <div className={styles.leftSpace}>
                      <DateTimePicker label={<L p={p} t={`To:`}/>} id={`incidentDateTo`} value={filter.incidentDateTo} minDate={filter.incidentDateFrom ? filter.incidentDateFrom : ''}
                          onChange={(event) => changeFilter(event, 'incidentDateTo')}/>
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
                          onClick={(event) => handleRadioChoice(event, 'summaryType')}/>
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
                          onClick={(event) => handleRadioChoice(event, 'reportType')}/>
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
                              onClick={(event) => handleRadioChoice(event, 'stackedOrSideBySide')}/>
                      </div>
                  }
              </div>
              <ReportBarChart title={`Behavior Incident Report`} data={reportData} subtitle={filter.summaryType} chartType={filter.reportType}
                  isStacked={filter.stackedOrSideBySide === 'Stacked' ? true : false} width={'500px'}
                  loader={<Loading isLoading={!(reportData && reportData.length > 0)}/>} />
              <MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Behavior Incident Add`}/>} path={'behaviorIncidentAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
          </div>
      )
}

export default withAlert(BehaviorIncidentReportView)
