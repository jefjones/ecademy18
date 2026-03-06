import { useEffect, useState } from 'react'
import styles from './ScheduleCourseDayTime.css'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../SelectSingleDropDown'
import Checkbox from '../Checkbox'
import moment from 'moment'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function ScheduleCourseDayTime(props) {
  const [daysScheduled, setDaysScheduled] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {daysScheduled} = props
    				
    				if (!isInitialized && daysScheduled && daysScheduled.length > 0 && !!daysScheduled[0].dayOfTheWeek) {
    						setIsInitialized(true); setDaysScheduled(daysScheduled)
    				}
    		
  }, [])

  const setReoccurringByClassPeriod = (dayOfTheWeek, classPeriodId) => {
    
    				const {classPeriods} = props
    				let daysScheduled = Object.assign([], daysScheduled)
    				let classPeriod = classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodId == classPeriodId)[0]; //eslint-disable-line
    
    				if (classPeriod && classPeriod.startTime) {
    						const {setDaySchedule} = props
    						let startTime = moment(classPeriod.startTime).format("HH:mm")
    						let startMinutes = (Number(moment(classPeriod.startTime).format("HH")) * 60) + Number(moment(classPeriod.startTime).format("mm"))
    						let endMinutes = (Number(moment(classPeriod.endTime).format("HH")) * 60) + Number(moment(classPeriod.endTime).format("mm"))
    						let duration = endMinutes - startMinutes
    						duration = Math.ceil(duration/5)*5
    
    						let daySchedule = daysScheduled.filter(m => m.dayOfTheWeek === dayOfTheWeek)[0]
    						if (daySchedule && daySchedule.dayOfTheWeek) {
    								if (!daySchedule.startTime || daySchedule.dayOfTheWeek === dayOfTheWeek) daySchedule['startTime'] = startTime
    								if (!daySchedule.duration || daySchedule.dayOfTheWeek === dayOfTheWeek) daySchedule['duration'] = duration
    								daySchedule['classPeriodId'] = classPeriodId
    								daysScheduled = daysScheduled.filter(m => m.dayOfTheWeek !== dayOfTheWeek)
    								daysScheduled = daysScheduled ? daysScheduled.concat(daySchedule) : [daySchedule]
    								//Now update any other dayOfTheWeek entries which don't have the class period or start time set yet.
    								daysScheduled.forEach(m => {
    										if (m.dayOfTheWeek !== daySchedule.dayOfTheWeek && !m.classPeriodId && !m.startTime && !m.duration) {
    												let option = {
    														dayOfTheWeek: m.dayOfTheWeek,
    														classPeriodId: daySchedule.classPeriodId,
    														startTime: daySchedule.startTime,
    														duration: daySchedule.duration,
    												}
    												daysScheduled = daysScheduled.filter(f => f.dayOfTheWeek !== m.dayOfTheWeek)
    												daysScheduled = daysScheduled.concat(option)
    										}
    								})
    								setDaysScheduled(daysScheduled)
    								setDaySchedule(daysScheduled)
    						}
    				}
    		
  }

  const handleDaySchedule = (dayOfTheWeek, field, value) => {
    
    				const {setDaySchedule} = props
    				let daysScheduled = Object.assign([], daysScheduled)
    				let daySchedule = daysScheduled.filter(m => m.dayOfTheWeek === dayOfTheWeek)[0] || {dayOfTheWeek}
    				daySchedule[field] = value
    				daysScheduled = daysScheduled.filter(m => m.dayOfTheWeek !== dayOfTheWeek)
    				daysScheduled = daysScheduled ? daysScheduled.concat(daySchedule) : [daySchedule]
    				setDaysScheduled(daysScheduled)
    				setDaySchedule(daysScheduled)
    		
  }

  const toggleCheckbox = (dayOfTheWeek) => {
    
    				const {setDaySchedule} = props
    				let daysScheduled = Object.assign([], daysScheduled)
    				let daySchedule = daysScheduled.filter(m => m.dayOfTheWeek === dayOfTheWeek)[0]
    				if (!daySchedule || !daySchedule.dayOfTheWeek) {
    						daySchedule = {dayOfTheWeek}
    						daysScheduled = daysScheduled && daysScheduled.length > 0 ? daysScheduled.concat(daySchedule) : [daySchedule]
    						//Now update any other dayOfTheWeek entries which don't have the class period or start time set yet.
    						let alreadySet = daysScheduled.filter(m => m.classPeriodId && m.startTime && m.duration)[0] || {}
    						if (alreadySet && alreadySet.dayOfTheWeek) {
    								daysScheduled.forEach(m => {
    										if (m.dayOfTheWeek !== alreadySet.dayOfTheWeek && !m.classPeriodId && !m.startTime && !m.duration) {
    												let option = {
    														dayOfTheWeek: m.dayOfTheWeek,
    														classPeriodId: alreadySet.classPeriodId,
    														startTime: alreadySet.startTime,
    														duration: alreadySet.duration,
    												}
    												daysScheduled = daysScheduled.filter(f => f.dayOfTheWeek !== m.dayOfTheWeek)
    												daysScheduled = daysScheduled.concat(option)
    										}
    								})
    						}
    				} else {
    						daysScheduled = daysScheduled.filter(m => m.dayOfTheWeek !== dayOfTheWeek)
    				}
    				setDaysScheduled(daysScheduled)
    				setDaySchedule(daysScheduled)
    		
  }

  const isChecked = (dayOfTheWeek) => {
    
    				
    				let isChecked = false
    				daysScheduled && daysScheduled.length > 0 && daysScheduled.forEach(m => {
    						if (m.dayOfTheWeek === dayOfTheWeek) isChecked = true
    				})
    				return isChecked
    		
  }

  const handleSetAll = (schoolDays) => {
    
            const {setDaySchedule} = props
            let daysScheduled = []
            schoolDays && schoolDays.length > 0 && schoolDays.forEach(m => {
                let option = {dayOfTheWeek: m.label}
                daysScheduled = daysScheduled && daysScheduled.length > 0 ? daysScheduled.concat(option) : [option]
        				setDaySchedule(daysScheduled)
            })
            setDaysScheduled(daysScheduled)
        
  }

  const {companyConfig={}, classPeriods, durationOptions} = props
  				
  
  				let schoolDays = []
  				if (companyConfig.monday) {
  						let option = {name: 'Monday', label: `monday`}
  						schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  				if (companyConfig.tuesday) {
  					let option = {name: 'Tuesday', label: `tuesday`}
  					schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  				if (companyConfig.wednesday) {
  					let option = {name: 'Wednesday', label: `wednesday`}
  					schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  				if (companyConfig.thursday) {
  					let option = {name: 'Thursday', label: `thursday`}
  					schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  				if (companyConfig.friday) {
  					let option = {name: 'Friday', label: `friday`}
  					schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  				if (companyConfig.saturday) {
  					let option = {name: 'Saturday', label: `saturday`}
  					schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  				if (companyConfig.sunday) {
  					let option = {name: 'Sunday', label: `sunday`}
  					schoolDays = schoolDays ? schoolDays.concat(option) : [option]
  				}
  
    			return (
  						<div className={styles.container}>
                  {daysScheduled && daysScheduled.length === 0 &&
                      <a onClick={() => handleSetAll(schoolDays)} className={classes(styles.row, globalStyles.link, styles.setAllSpace)}>
                          - set all -
                      </a>
                  }
  								{schoolDays && schoolDays.length > 0 && schoolDays.map((m,i) => {
  										let daySchedule = daysScheduled.filter(d => d.dayOfTheWeek === m.label)[0] || {}
  										return (
  												<div key={i} className={classes(styles.rowNowrap, (i % 2 === 0 ? styles.lightGray : ''))}>
  														<div className={styles.checkboxPosition}>
  																<Checkbox
  										                id={m.label}
  										                label={m.name}
  										                checked={isChecked(m.label) || ''}
  										                onClick={() => toggleCheckbox(m.label)}
  										                labelClass={styles.labelCheckbox}
  										                checkboxClass={styles.checkbox} />
  														</div>
  														{isChecked(m.label) &&
  																<div className={styles.rowWrap}>
  																		<div>
  																				<SelectSingleDropDown
  																						id={`classPeriodId`}
  																						name={`classPeriodId`}
  																						label={<L p={p} t={`Class Period`}/>}
  																						value={daySchedule.classPeriodId || ''}
  																						options={classPeriods || []}
  																						className={styles.moreLeft}
  																						height={`medium-short`}
  																						onChange={(event) => setReoccurringByClassPeriod(m.label, event.target.value)}/>
  																		</div>
  																		<div className={styles.dateColumn}>
  																				<span className={styles.label}><L p={p} t={`Start time`}/></span>
  																				<input type="time" onChange={(event) => handleDaySchedule(m.label, 'startTime', event.target.value)}
  																						className={styles.timePicker}
  																						value={daySchedule.startTime
  																										? daySchedule.startTime === '00:00'
  																												? ''
  																												: daySchedule.startTime.indexOf('T') > -1
  																														? daySchedule.startTime.substring(daySchedule.startTime.indexOf('T')+1)
  																														: daySchedule.startTime
  																										: ''} />
  																		</div>
  																		<div className={styles.duration}>
  																				<SelectSingleDropDown
  																						id={`duration`}
  																						name={`duration`}
  																						label={<L p={p} t={`Duration`}/>}
  																						value={daySchedule.duration || ''}
  																						options={durationOptions}
  																						height={`medium`}
  																						onChange={(event) => handleDaySchedule(m.label, 'duration', event.target.value)} />
  																		</div>
  																</div>
  														}
  												</div>
  										)
  								})}
  						</div>
    		)
}
export default ScheduleCourseDayTime
