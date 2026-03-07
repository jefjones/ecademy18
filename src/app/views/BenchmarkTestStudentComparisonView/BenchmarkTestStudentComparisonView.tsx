import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './BenchmarkTestStudentComparisonView.css'
const p = 'BenchmarkTestStudentComparisonView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import StandardsAssignmentResult from '../../components/StandardsAssignmentResult'
import MultiSelect from '../../components/MultiSelect'
import GradingRatingLegend from '../../components/GradingRatingLegend'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function BenchmarkTestStudentComparisonView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [benchmarkTestId, setBenchmarkTestId] = useState(props.benchmarkTestId)
  const [isShowingModal_standard, setIsShowingModal_standard] = useState(undefined)
  const [standardCode, setStandardCode] = useState(undefined)
  const [standardName, setStandardName] = useState(undefined)

  const handleSelectedClasses = (selectedClasses) => {
    return setSelectedClasses(selectedClasses)
    	classesValueRenderer = (selected, options) => <div className={styles.boldText}><L p={p} t={`Classes:  ${selected.length} of ${options.length}`}/></div>
    

  const classesValueRenderer = (selected, options) => {
    return <div className={styles.boldText}><L p={p} t={`Classes:  ${selected.length} of ${options.length}`}/></div>
    

  }
  }
  const handleChange = ({target}) => {
    
    			const {getBenchmarkTestStudentComparison, personId} = props
    			if (target.value && target.value !== '0') {
    					getBenchmarkTestStudentComparison(personId, target.value)
    					navigate(`/benchmarkTestStudentComparison/${target.value}`)
    			}
    			setBenchmarkTestId(target.value)
    	
  }

  const handleStandardInfoOpen = (standardCode, standardName) => {
    return setIsShowingModal_standard(true); setStandardCode(standardCode); setStandardName(standardName)
    

  }
  const handleStandardInfoClose = () => {
    return setIsShowingModal_standard(false); setStandardCode(''); setStandardName('')
    

  const {personId, benchmarkTestStudentComparison=[], standardsRatings, benchmarkTests, fetchingRecord, standardsRatingTableId, accessRoles} = props
  	    
  			let countArray = [<L p={p} t={`First`}/>, <L p={p} t={`Second`}/>, <L p={p} t={`Third`}/>, <L p={p} t={`Fourth`}/>, <L p={p} t={`Fifth`}/>, <L p={p} t={`Sixth`}/>, <L p={p} t={`Seventh`}/>, <L p={p} t={`Eighth`}/>, <L p={p} t={`Ninth`}/>]
  			let headings = [{label: <L p={p} t={`Class`}/>, tightText: true}, {label: <L p={p} t={`Student`}/>, tightText: true}]
  
  			let localClasses = benchmarkTestStudentComparison
  			//If this is a teacher user, then only give them the classes in which they teach.
  
  			if (accessRoles.facilitator) {
  					localClasses = localClasses && localClasses.length > 0 && localClasses.filter(m => {
  							let isTeacher = false
  							m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
  									if (t.id === personId) isTeacher = true
  							})
  							return isTeacher
  					})
  			}
  			if (selectedClasses && selectedClasses.length > 0) {
  					localClasses = localClasses && localClasses.length > 0 && localClasses.filter(m => selectedClasses.indexOf(m.courseScheduledId) > -1)
  			}
  
  			let maxCount = localClasses && localClasses.length > 0 && localClasses[0].testCount
  			let standards = localClasses && localClasses.length > 0 && localClasses[0].standards
  
  			for(let i = 0; i < maxCount; i++) {
  					headings.push({label: countArray[i], tightText: true})
  			}
  
  			//The difference between the class comparison and the student comparison report is right HERE:  We will split out the various students into their own list of tests taken
  			//	from the TestAssign's ScoredAnswer.  So the class comparison (and the incoming data structure here are the same)
  			//			Class
  			//			   testAssign
  			//						ScoredAnswers (which goes to the StandardsAssignmentResult component for standards circle display)
  			//
  			//  which comes in here as:
  			//			Class
  			//			   StudentTest
  			//			   		TestAssign (in order to list the scored answers to the first test taking, second test taking, third test taking, .... to the last attempt)
  			//								ScoredAnswers (which goes to the StandardsAssignmentResult component for standards circle display)
  
  	    let data = []
  
  			if (localClasses && localClasses.length > 0) {
  					localClasses.forEach(m => {
  							let className = m.courseName
  			    		data =  m.students && m.students.length > 0 && m.students.map(t => {
  									let row = [{value: className}, {value: t.studentName}]
  									t.testAssigns && t.testAssigns.length > 0 && t.testAssigns.forEach((s, i) =>
  											row = row.concat([
  													{value:  <div className={styles.row} key={i}>
  																			<StandardsAssignmentResult scores={s.scoredAnswers}
  																					standards={s.scoredAnswers && s.scoredAnswers.length > 0 && s.scoredAnswers[0].standards}
  																					standardsRatings={standardsRatings} showTopPercent={true}/>
  																	 </div>
  													}
  											])
  									)
  			            return row
  			        })
  					})
  	    } else {
  	        data = [[{value: ''}, {value: <i>No students found.</i> }]]
  	    }
  
  			return (
  	        <div className={styles.container}>
  	            <div className={globalStyles.pageTitle}>
  	                <L p={p} t={`Benchmark Test Student Comparison`}/>
  	            </div>
  							<div className={styles.rowWrap}>
  									<div>
  											<SelectSingleDropDown
  													id={`benchmarkTestId`}
  													name={`benchmarkTestId`}
  													label={<L p={p} t={`Benchmark test`}/>}
  													value={benchmarkTestId || ''}
  													options={benchmarkTests}
  													className={styles.moreBottomMargin}
  													height={`medium`}
  													onChange={handleChange}
  													required={true}
  													whenFilled={benchmarkTestId} />
  									</div>
  									<div className={styles.multiSelect} data-rh={'Share this test with one or more teachers'}>
  											<div className={styles.text}>Filter classes</div>
  											<MultiSelect
  													name={'selectedClasses'}
  													options={benchmarkTestStudentComparison || []}
  													onSelectedChanged={handleSelectedClasses}
  													valueRenderer={classesValueRenderer}
  													getJustCollapsed={() => {}}
  													selected={selectedClasses || []}/>
  									</div>
  									<div>
  											<div className={classes(styles.text, styles.moreBottomMargin)}><L p={p} t={`Standards (in order)`}/></div>
  											{standards && standards.length > 0 && standards.map((m, i) =>
  													<div className={classes(styles.row, styles.moreLeft)} key={i}>
  															<div className={styles.boldText}>{`${i+1*1} - ${m.code}`}</div>
  															<div onClick={() => handleStandardInfoOpen(m.code, m.name)}>
  																	<Icon pathName={'info'} className={styles.iconPosition}/>
  															</div>
  													</div>
  											)}
  											<GradingRatingLegend standardsRatings={standardsRatings} gradingType={'STANDARDSRATING'}
  													standardsRatingTableId={standardsRatingTableId}/>
  									</div>
  							</div>
  							<div className={styles.moreTop}>
  									<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.benchmarkTestStudentComparison} />
  							</div>
  							{isShowingModal_standard &&
  									<MessageModal handleClose={handleStandardInfoClose} heading={<L p={p} t={`Standard: ${standardCode}`}/>}
  										 explain={standardName}
  										 onClick={handleStandardInfoClose} />
  							}
  							<OneFJefFooter />
  					</div>
  			)
}
}
export default BenchmarkTestStudentComparisonView
