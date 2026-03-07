
import { useNavigate } from 'react-router-dom'
import styles from './LunchMenuStudentDayView.css'
const p = 'LunchMenuStudentDayView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import DateMoment from '../../components/DateMoment'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'

function LunchMenuStudentDayView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const {personId, lunchMenuStudentDays, toggleLunchMenuStudentDay} = props
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Lunch Menu Student Days`}/>
              </div>
  						<hr/>
  						{lunchMenuStudentDays && lunchMenuStudentDays.menu && lunchMenuStudentDays.menu.length > 0 && lunchMenuStudentDays.menu.map((m,i) => {
  
  								return (
  										<div key={i} className={styles.row}>
  												<div>
  														<div className={styles.headerLabel}><DateMoment date={m.day} format={'MMM d - dddd'}/></div>
  														<div className={styles.text}>{m.contents}</div>
  												</div>
  												<div className={styles.row}>
  														{lunchMenuStudentDays.students && lunchMenuStudentDays.students.length > 0 && lunchMenuStudentDays.students.map(s =>
  																<Checkbox
  																		checked={m.studentDays.indexOf(s.studentPersonId) > -1}
  																		onClick={() => toggleLunchMenuStudentDay(personId, m.day, s.studentPersonId)}
  																		className={styles.button}/>
  														)}
  												</div>
  										</div>
  								)}
  						)}
              <div className={styles.buttonPosition}>
  								<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={() => navigate('/firstNav')}/>
              </div>
              <OneFJefFooter />
        </div>
      )
}
export default LunchMenuStudentDayView
