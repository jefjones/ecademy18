
import * as styles from './RegSelfServiceCourseCountView.css'
const p = 'RegSelfServiceCourseCountView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import OneFJefFooter from '../../components/OneFJefFooter'

function RegSelfServiceCourseCountView(props) {
  const {counts, fetchingRecord} = props
      let headings = [
    			{label: <L p={p} t={`Grade`}/>, tightText: true},
    			{label: <L p={p} t={`Classes`}/>, tightText: true},
      ]
      let data = []
  
      if (counts && counts.length > 0) {
          data = counts.map(m => {
              return ([
  							{value: m.grade},
  							{value: m.classes},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Student Course Signup Count`}/>
              </div>
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                isFetchingRecord={fetchingRecord.regSelfServiceCourseCount}/>
              <hr />
              <OneFJefFooter />
        </div>
      )
}
export default RegSelfServiceCourseCountView
