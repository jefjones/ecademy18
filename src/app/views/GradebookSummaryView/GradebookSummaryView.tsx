import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './GradebookSummaryView.css'
const p = 'GradebookSummaryView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function GradebookSummaryView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [origGradebook, setOrigGradebook] = useState({})
  const [gradebook, setGradebook] = useState({})
  const [courseScheduledId, setCourseScheduledId] = useState('')
  const [contentTypeId, setContentTypeId] = useState('')
  const [singleAssignmentId, setSingleAssignmentId] = useState('')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [contentTypeCode, setContentTypeCode] = useState('')

  useEffect(() => {
    
    				//document.getElementById('courseScheduledId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    		
  }, [])

  const recallPage = (event) => {
    
    				const {getGradebookSummary, personId} = props
            const {courseScheduledId} = props
    				let id = event && event.target && event.target.value ? event.target.value : courseScheduledId
    				navigate('/gradebookSummary/' + id)
            getGradebookSummary(personId, id)
            setCourseScheduledId(id)
        
  }

  const {personId, myFrequentPlaces, setMyFrequentPlace, courses, fetchingRecord, gradebookSummary } = props
        
  
  	 		let headings = [{label: ''}]
  			let data = []
  
  			gradebookSummary && gradebookSummary.contentTypes && gradebookSummary.contentTypes.length > 0 && gradebookSummary.contentTypes.forEach(m => {
  					headings.push({ verticalText: true, label: m.label })
  			})
  
  			gradebookSummary && gradebookSummary.studentSummaries && gradebookSummary.studentSummaries.length > 0 && gradebookSummary.studentSummaries.forEach(m => {
  					let row = [{
  						value: <div className={styles.rowSpace}>
  											 <div className={styles.row}>
  													 <Link to={'/studentProfile/' + m.studentPersonId}><Icon pathName={'info'} className={styles.icon}/></Link>
  													 <Link to={'/studentSchedule/' + m.studentPersonId}><Icon pathName={'clock3'} premium={true} className={styles.icon}/></Link>
  													 <Link to={'/studentSchedule/' + m.studentPersonId} className={styles.link}>{m.studentFirstName + ' ' + m.studentLastName}</Link>
  											 </div>
  											 <div className={styles.text}>{m.overallGrade}</div>
  									 </div>
  								 }]
  
  					m.contentSummaryGrade && m.contentSummaryGrade.length > 0 && m.contentSummaryGrade.forEach(c => {
  							row.push({
  									value: c.percentGrade
  									 // value: <Link to={`/gradebookEntry/${gradebookSummary.courseScheduledId}/${m.studentPersonId}/contentType/${c.contentTypeId}`} className={styles.link}>
   										// 				{c.percentGrade}
   										// 		 </Link>
  							})
  
  					})
  					data.push(row)
  			})
  
        return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                	<L p={p} t={`Gradebook Summary`}/>
              </div>
              <div className={styles.formLeft}>
  								<div>
  		                <SelectSingleDropDown
  		                    id={`courseScheduledId`}
  		                    name={`courseScheduledId`}
  		                    label={<L p={p} t={`Course`}/>}
  		                    value={courseScheduledId || ''}
  		                    options={courses}
  		                    className={classes(styles.singleDropDown, styles.moreBottomMargin)}
  		                    height={`medium`}
  		                    noBlank={false}
  		                    onChange={recallPage} />
  								</div>
                  <div className={styles.topMargin}>
  										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}
  												firstColumnClass={styles.firstColumnClass} isFetchingRecord={fetchingRecord.gradebookSummary}/>
                  </div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Gradebook Summary`}/>} path={'gradebookSummary'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
          </div>
      )
}

export default GradebookSummaryView
