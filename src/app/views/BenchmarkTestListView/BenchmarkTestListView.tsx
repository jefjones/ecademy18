import { useState } from 'react'
import * as styles from './BenchmarkTestListView.css'
const p = 'BenchmarkTestListView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import Checkbox from '../../components/Checkbox'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import BenchmarkTestListMenu from '../../components/BenchmarkTestListMenu'
import BenchmarkTestAddModal from '../../components/BenchmarkTestAddModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import {doSort} from '../../utils/sort'

function BenchmarkTestListView(props) {
  const [scores, setScores] = useState([])
  const [isShowingModal_display, setIsShowingModal_display] = useState(false)
  const [hideSearch, setHideSearch] = useState(true)
  const [filters, setFilters] = useState({
					})
  const [isParamBenchmarkTest, setIsParamBenchmarkTest] = useState(true)
  const [modalDisplay, setModalDisplay] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('Description')
  const [isShowingModal_addOrUpdate, setIsShowingModal_addOrUpdate] = useState(true)
  const [benchmarkTest, setBenchmarkTest] = useState('')

  const {fetchingRecord, personId, course={}, benchmarkTests, accessRoles={}, personConfig, companyConfig, sequences, removeBenchmarkTest,
  						facilitators, myFrequentPlaces, setMyFrequentPlace, sharedTeachersBenchmarkTest} = props
  		let testListFiltered = benchmarkTests
  		let benchmarkTestId = benchmarkTest.benchmarkTestId
  
  		if (filters.partialNameText) testListFiltered = testListFiltered.filter(m => m.title.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1)
  		if (filters.dueDateFrom || filters.dueDateTo) {
  				if (filters.dueDateFrom && filters.dueDateTo) {
  						testListFiltered = testListFiltered.filter(m => m.dueDate >= filters.dueDateFrom && m.dueDate <= filters.dueDateTo)
  				} else if (filters.dueDateFrom) {
  						testListFiltered = testListFiltered.filter(m => m.dueDate >= filters.dueDateFrom)
  				} else if (filters.dueDateTo) {
  						testListFiltered = testListFiltered.filter(m => m.dueDate <= filters.dueDateTo)
  				}
  		}
  		if (filters.contentTypes && filters.contentTypes.length > 0) testListFiltered = testListFiltered.filter(m => filters.contentTypes.indexOf(m.contentTypeId) > -1)
  
      let headings = [{},
  				{label: <L p={p} t={`Sort order`}/>, tightText: true},
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: <L p={p} t={`Grade level`}/>, tightText: true},
  				{label: <L p={p} t={`Possible score`}/>, tightText: true},
  				{label: <L p={p} t={`Questions`}/>, tightText: true},
  				{label: <L p={p} t={`Description`}/>, tightText: true},
  				{label: <L p={p} t={`Standards`}/>, tightText: true},
  				{label: <L p={p} t={`Shared`}/>, tightText: true},
  				{label: <L p={p} t={`Rating`}/>, tightText: true},
  				{label: <L p={p} t={`Classes completed`}/>, tightText: true},
  				{label: <L p={p} t={`Students taken`}/>, tightText: true},
  				{label: <L p={p} t={`Public copies`}/>, tightText: true},
  				{label: <L p={p} t={`Entry Person`}/>, tightText: true},
  				{label: <L p={p} t={`Entry date`}/>, tightText: true},
  		]
  
      let data = testListFiltered && testListFiltered.length > 0 && testListFiltered.map((m, i) => {
  				let testGradeLevels = doSort(m.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true })
  				let fromGradeLevelName = testGradeLevels && testGradeLevels.length > 0 && testGradeLevels[0].name
  				let toGradeLevelName = testGradeLevels && testGradeLevels.length > 0 && testGradeLevels[testGradeLevels.length-1*1].name
  
  				let ratingAverage = 0
  
  				return ([
  						{value: <div className={styles.smallWidth}>
  												<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={() => chooseRecord(m)} addClassName={styles.smallButton}/>
  										</div>
  						},
  						{value: <div className={styles.lessTop}>
  												<SelectSingleDropDown
  														id={m.benchmarkTestId}
  														label={``}
  														value={m.sequence}
  														noBlank={true}
  														options={sequences}
  														onChange={(event) => reorderSequence(m.benchmarkTestId, event)}/>
  										</div>,
  								clickFunction: () => chooseRecord(m),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: <div onClick={() => chooseRecord(m)} className={classes(styles.link, styles.row)}
  													data-rh={!m.assessmentQuestionCount
  															? <L p={p} t={`This is not an automated test until questions are entered. Click on the name link to add questions, if necessary.`}/>
  															: m.isPublished
  																	? <L p={p} t={`This test is published`}/>
  																	: <L p={p} t={`This test is not published`}/>
  											 		}>
  											{m.name}
  											{m.assessmentQuestionCount
  													? <Icon pathName={'earth'} premium={true} className={styles.iconQuiz} fillColor={m.isPublished ? 'green' : 'red'} />
  													: <div className={styles.row}>
  																<div className={styles.questionMark}>?</div><Icon pathName={'prohibited'} fillColor={'red'} premium={true} className={styles.iconOverlap}/>
  														</div>
  											}
  									 </div>,
  							clickFunction: () => chooseRecord(m),
  							cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: fromGradeLevelName === toGradeLevelName ? fromGradeLevelName : `${fromGradeLevelName} - ${toGradeLevelName}`,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.pointsPossible ? m.pointsPossible : '0',
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.assessmentQuestionCount,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.description && m.description.length > 35 ? m.description.substring(0,35) + '...' : m.description,
  								clickFunction: () => { chooseRecord(m); m.description && m.description.length > 35 && handleDescriptionOpen(m.description)},
  								notShowLink: m.description && m.description.length < 35,
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.standards && m.standards.length ? m.standards.length : '0',
  								clickFunction: () => { chooseRecord(m); m.standards && m.standards.length && handleShowListOpen(<L p={p} t={`Standards`}/>, m.standards);},
  								notShowLink: !(m.standards && m.standards.length),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.sharedTeachers && m.sharedTeachers.length ? m.sharedTeachers.length : '0',
  								clickFunction: () => {chooseRecord(m); m.sharedTeachers && m.sharedTeachers.length && handleShowListOpen(<L p={p} t={`Shared with Teachers`}/>, m.sharedTeachers)},
  								notShowLink: !(m.sharedTeachers && m.sharedTeachers.length),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: ratingAverage,
  								clickFunction: () => {chooseRecord(m); m.classesCompleted && m.classesCompleted.length && handleShowListOpen(<L p={p} t={`Ratings`}/>, m.ratings)},
  								notShowLink: !(m.ratings && m.ratings.length),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.classesCompleted && m.classesCompleted.length ? m.classesCompleted.length : '0',
  								clickFunction: () => {chooseRecord(m); m.classesCompleted && m.classesCompleted.length && handleShowListOpen(<L p={p} t={`Classes Completed`}/>, m.classesCompleted)},
  								notShowLink: !(m.classesCompleted && m.classesCompleted.length),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.studentsCompleted && m.studentsCompleted.length ? m.studentsCompleted.length : '0',
  								clickFunction: () => {chooseRecord(m); m.studentsCompleted && m.studentsCompleted.length && handleShowListOpen(<L p={p} t={`Students Completed`}/>, m.studentsCompleted)},
  								notShowLink: !(m.studentsCompleted && m.studentsCompleted.length),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.publicCopies && m.publicCopies.length ? m.publicCopies.length : '0',
  								clickFunction: () => {chooseRecord(m); m.publicCopies && m.publicCopies.length && handleShowListOpen(<L p={p} t={`Public Copies`}/>, m.publicCopies)},
  								notShowLink: !(m.publicCopies && m.publicCopies.length),
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: m.entryPersonName,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
  						{value: <DateMoment date={m.entryDate} format={'D MMM'}/>,
  								clickFunction: () => chooseRecord(m),
  								notShowLink: true,
  								cellColor: m.benchmarkTestId === benchmarkTestId ? 'highlight' : ''
  						},
          ])
  		})
  
      if ((!data || data.length === 0) && fetchingRecord && !fetchingRecord.benchmarkTests) {
          data = [[{value: ''},
  				{value: <div className={styles.noRecords}><L p={p} t={`No benchmark tests found`}/></div>, colSpan: true }]]
      }
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Benchmark Tests`}/>
  						</div>
  						<div className={styles.rowWrap}>
  								<div>
  										<TextDisplay text={course.courseName} className={styles.moreTop} />
  										<div className={styles.moreLeft}>
  												<a onClick={toggleHideSearch} className={classes(styles.row, styles.link, styles.moreLeft)}>
  														<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  														{hideSearch ? <L p={p} t={`Show search controls`}/> : <L p={p} t={`Hide search controls`}/>}
  												</a>
  										</div>
  								</div>
  						</div>
  
  						{!hideSearch &&
  								<div className={styles.filters}>
  										<div className={styles.row}>
  												<InputText
  														id={"partialNameText"}
  														name={"partialNameText"}
  														size={"medium"}
  														label={<L p={p} t={`Name search`}/>}
  														value={filters.partialNameText || ''}
  														onChange={changeFilter}
  														inputClassName={styles.partialText}
  														onEnterKey={handlePartialNameEnterKey}/>
  												<a onClick={handlePartialNameTextSubmit} className={styles.nameLinkStyle}>
  														<Icon pathName={`plus`} fillColor={'green'} className={styles.image}/>
  												</a>
  										</div>
  										<div>
  												<hr />
  												<span className={classes(styles.textGradeLevel, styles.moreTop)}>Grade Level</span>
  												<div className={classes(styles.rowWrap, styles.moreBottom)}>
  														{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
  																<Checkbox
  																		key={i}
  																		id={m.gradeLevelId}
  																		label={m.name}
  																		checked={(filters.selectedGradeLevels && filters.selectedGradeLevels.length > 0 && (filters.selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || filters.selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
  																		onClick={() => toggleGradeLevel(m.gradeLevelId)}
  																		labelClass={styles.labelCheckbox}
  																		checkboxClass={styles.checkbox} />
  														)}
  												</div>
  										</div>
  								</div>
  						}
  						<BenchmarkTestListMenu personId={personId} facilitators={facilitators} benchmarkTest={benchmarkTest} ownerPersonId={benchmarkTest.entryPersonId}
  								accessRoles={accessRoles} removeBenchmarkTest={removeBenchmarkTest} sharedTeachersBenchmarkTest={sharedTeachersBenchmarkTest}
  								addOrUpdateBenchmarkTestOpen={handleAddOrUpdateBenchmarkTestOpen} companyConfig={companyConfig}
  								assessmentId={benchmarkTest.assessmentId} modalOpen={modalOpen} />
  						<div onClick={handleAddOrUpdateBenchmarkTestOpen} className={classes(styles.row, styles.link, styles.moreLeft, styles.moreTop)}>
  								<Icon pathName={'plus'} fillColor={'green'} className={styles.iconSmaller}/>
  								<L p={p} t={`Add a benchmark test`}/>
  						</div>
  						<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  								isFetchingRecord={fetchingRecord.benchmarkTests}/>
  						{testListFiltered && testListFiltered.length > 9 && !(fetchingRecord && fetchingRecord.benchmarkTests) &&
  								<div onClick={handleAddOrUpdateBenchmarkTestOpen} className={classes(styles.row, styles.link, styles.moreLeft)}>
  										<Icon pathName={'plus'} fillColor={'green'} className={styles.iconSmaller}/>
  										<L p={p} t={`Add a benchmark test`}/>
  								</div>
  						}
  						<OneFJefFooter />
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Benchmark Test List`}/>} path={'benchmarkTestList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						{isShowingModal_removeCourseDoc &&
                  <MessageModal handleClose={handleRemoveCourseDoc} heading={<L p={p} t={`Remove this Benchmark Test?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this benchmark test?`}/>} isConfirmType={true}
                     onClick={handleRemoveCourseDoc} />
              }
  						{isShowingModal_display &&
  								<MessageModal handleClose={handleDisplayClose} heading={modalTitle} explainJSX={modalDisplay} onClick={handleDisplayClose} />
  						}
  						{isShowingModal_addOrUpdate &&
                  <BenchmarkTestAddModal handleClose={handleAddOrUpdateBenchmarkTestClose} handleSubmit={handleAddOrUpdateBenchmarkTest}
                      personId={personId} companyConfig={companyConfig} benchmarkTest={benchmarkTest} accessRoles={accessRoles}
  										personConfig={personConfig} sequences={sequences} changeBenchmarkTest={changeBenchmarkTest}/>
              }
        	</div>
      )
}
export default withAlert(BenchmarkTestListView)
