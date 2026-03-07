
import { useNavigate } from 'react-router-dom'
import styles from './MyGroupsReportView.css'
const p = 'MyGroupsReportView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import OneFJefFooter from '../../components/OneFJefFooter'

function MyGroupsReportView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
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
