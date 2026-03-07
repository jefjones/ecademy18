import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as styles from './CourseWeightedScoreView.css'
const p = 'CourseWeightedScoreView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import TextDisplay from '../../components/TextDisplay'
import InputText from '../../components/InputText'
import EditTable from '../../components/EditTable'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

function CourseWeightedScoreView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [weightedScores, setWeightedScores] = useState([])
  const [hasPercentUpdated, setHasPercentUpdated] = useState(hasPercent)
  const [hasBlankRecord, setHasBlankRecord] = useState((!hasPercent && !this.state.hasBlankRecord))

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {weightedScores} = props
    			let hasPercent = false
    			weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {if (m.scorePercent) hasPercent = true})
    			if ((hasPercent && !hasPercentUpdated) || (!hasPercent && !hasBlankRecord)) {
    					setWeightedScores(weightedScores); setHasPercentUpdated(hasPercent); setHasBlankRecord((!hasPercent && !hasBlankRecord))
    			}
    	
  }, [])

  const {course, companyConfig, fetchingRecord} = props
      
  
  		let headings = [{label: <L p={p} t={`Content Category`}/>, tightText: true}, {label: <L p={p} t={`Weight %`}/>, tightText: true}]
      let data = []
  
      if (weightedScores && weightedScores.length > 0) {
          data = weightedScores.map(m => {
              return ([
                {value: m.contentTypeName},
                {value: <InputText numberOnly={true} id={m.contentTypeId} size={"super-short"} value={m.scorePercent || ''} onChange={(event) => changePercent(m.contentTypeId, event)} />},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Course Weighted Scores`}/>
              </div>
  						<TextDisplay label={<L p={p} t={`Course`}/>} text={course && course.courseName} />
  						<div className={styles.instruction}><L p={p} t={`If you choose not to use a course content type, leave the percent blank or set it to zero.  This will cause that content type not to show up in the list when creating a new assignment.`}/></div>
  						<hr />
  						<EditTable labelClass={styles.tableLabelClass} headings={headings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink} isFetchingRecord={fetchingRecord.courseWeightedScore}/>
              <div className={styles.rowFromLeft}>
  								<Link to={'/firstNav'} className={styles.cancelLink} ><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
              <OneFJefFooter />
              {isShowingModal &&
                  <MessageModal handleClose={handle100PercentClose} heading={<L p={p} t={`Entries need to equal 100%`}/>}
                     explainJSX={<L p={p} t={`The entries do not equal 100%.  Please check your entry and try again.`}/>}
                     onClick={handle100PercentClose} />
              }
        </div>
      )
}
export default CourseWeightedScoreView
