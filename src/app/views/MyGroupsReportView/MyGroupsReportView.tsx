
import { navigate, navigateReplace, goBack } from './'
import styles from './MyGroupsReportView.css'
const p = 'MyGroupsReportView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import OneFJefFooter from '../../components/OneFJefFooter'

function MyGroupsReportView(props) {
  const { headings, data } = props
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`My Groups`}/>
              </div>
              <EditTable labelClass={styles.tableLabelClass} headings={headings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <br/>
              <br/>
              <OneFJefFooter />
        </div>
      )
}
export default MyGroupsReportView
