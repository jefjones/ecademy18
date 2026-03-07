import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LunchMenuMonthView.css'
const p = 'LunchMenuMonthView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import WeekdayPicker from '../../components/WeekdayPicker'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import moment from 'moment'

function LunchMenuMonthView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [monthChoice, setMonthChoice] = useState('')
  const [weekdays, setWeekdays] = useState({
						monday: true,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: true,
				})
  const [monday, setMonday] = useState(true)
  const [tuesday, setTuesday] = useState(true)
  const [wednesday, setWednesday] = useState(true)
  const [thursday, setThursday] = useState(true)
  const [friday, setFriday] = useState(true)

  const {personId, lunchMenuMonth, months, daysOfWeek, lunchMenuOptions, setLunchMenuDay} = props
  		
  
  		let dayPointer = new Date(2019, monthChoice, 1)
  		let days = []
  
  		while(dayPointer.getMonth() === Number(monthChoice)) {
  				if (weekdays[daysOfWeek[dayPointer.getDay()]])
  						days = days.concat({
  								id: moment(dayPointer).format('YYYY-MM-DD'),
  								label: moment(dayPointer).format("MMM D - dddd")
  						})
  				dayPointer.setDate(dayPointer.getDate() + 1)
  		}
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Lunch Menu Month`}/>
              </div>
  						<div>
  								<SelectSingleDropDown
  										id={`monthChoice`}
  										name={`monthChoice`}
  										label={<L p={p} t={`Month`}/>}
  										value={monthChoice || ''}
  										options={months}
  										className={styles.moreBottomMargin}
  										height={`medium`}
  										onChange={handleMonth}/>
  						</div>
  						{false && <WeekdayPicker picker={weekdays} onClick={handleWeekdayPicker}/>}
  						<hr/>
  						{days && days.length > 0 && days.map((m,i) => {
  							let lunchMenuDay = lunchMenuMonth && lunchMenuMonth.length > 0 && lunchMenuMonth.filter(f => f.day.substring(0, f.day.indexOf('T')) === m.id)[0]
  
  							return (
  								<div key={i} className={styles.row}>
  										<div className={styles.headerLabel}>{m.label}</div>
  										<div>
  												<SelectSingleDropDown
  														id={`lunchMenuOptionId`}
  														name={`lunchMenuOptionId`}
  														label={``}
  														value={(lunchMenuDay && lunchMenuDay.lunchMenuOptionId) || ''}
  														options={lunchMenuOptions}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={(event) => setLunchMenuDay(personId, m.id, event.target.value)}/>
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
export default LunchMenuMonthView
