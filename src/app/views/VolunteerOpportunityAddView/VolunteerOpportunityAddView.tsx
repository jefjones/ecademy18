import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './VolunteerOpportunityAddView.css'
import DateTimePicker from '../../components/DateTimePicker'
import TimePicker from '../../components/TimePicker'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputTextArea from '../../components/InputTextArea'
import InputText from '../../components/InputText'
import Required from '../../components/Required'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Icon from '../../components/Icon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function VolunteerOpportunityAddView(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [localOpportunity, setLocalOpportunity] = useState(volunteerOpportunity)
  const [errorName, setErrorName] = useState(<L p={p} t={`Please enter a name`}/>)
  const [p, setP] = useState(undefined)
  const [errorVolunteerTypeId, setErrorVolunteerTypeId] = useState(<L p={p} t={`Please choose an event type`}/>)
  const [errorVolunteersNeeded, setErrorVolunteersNeeded] = useState(<L p={p} t={`Please enter the volunteers needed`}/>)
  const [errorDateTime, setErrorDateTime] = useState(<L p={p} t={`Please enter at least one date and time`}/>)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {volunteerOpportunity} = props
    			
    			if (volunteerOpportunity && volunteerOpportunity.name && volunteerOpportunity !== localOpportunity) {
    					setLocalOpportunity(volunteerOpportunity)
    			} else if (!localOpportunity || !localOpportunity.startEndTimes || localOpportunity.startEndTimes.length === 0) {
    					let localOpportunity = {
    							name: '',
    							volunteerTypeId: '',
    							note: '',
    							volunteersNeeded: '',
    							startEndTimes: [{
    									date: '',
    									startTime: '',
    									endTime: ''
    							}]
    					}
    					setLocalOpportunity(localOpportunity)
    			}
    	
  }, [])

  const {personId, myFrequentPlaces, setMyFrequentPlace, volunteerTypes} = props
      const {localOpportunity={}, errorCheckInTime, errorName, errorVolunteersNeeded, errorVolunteerTypeId, errorDateTime} = state
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								<L p={p} t={`Volunteer Opportunity`}/>
  						</div>
  						<div>
  								<InputText
  										id={`name`}
  										name={`name`}
  										size={"medium"}
  										label={<L p={p} t={`Name`}/>}
  										value={localOpportunity.name || ''}
  										required={true}
  										whenFilled={localOpportunity.name}
  										onChange={handleChange}
  										error={errorName}/>
  								<div className={styles.moreBottom}>
  										<SelectSingleDropDown
  												id={`volunteerTypeId`}
  												name={`volunteerTypeId`}
  												label={<L p={p} t={`Event type`}/>}
  												value={localOpportunity.volunteerTypeId || ''}
  												options={volunteerTypes}
  												className={styles.notBold}
  												height={`medium`}
  												required={true}
  												whenFilled={localOpportunity.volunteerTypeId}
  												onChange={handleChange}
  												error={errorVolunteerTypeId}/>
  								</div>
  								<InputText
  										id={`volunteersNeeded`}
  										name={`volunteersNeeded`}
  										size={"super-short"}
  										onEnterKey={handleEnterKey}
  										numberOnly={true}
  										label={<L p={p} t={`Volunteers needed`}/>}
  										value={localOpportunity.volunteersNeeded || ''}
  										required={true}
  										whenFilled={localOpportunity.volunteersNeeded}
  										onChange={handleChange}
  										error={errorVolunteersNeeded}/>
  
  								<InputTextArea label={<L p={p} t={`Note (optional)`}/>} name={'note'} value={localOpportunity.note} onChange={handleChange} />
  
  								<div className={classes(styles.littleBottom, globalStyles.classification)}>
  										<L p={p} t={`Date(s)`}/>
  								</div>
  
  								{localOpportunity.startEndTimes && localOpportunity.startEndTimes.length > 0 && localOpportunity.startEndTimes.map((m, i) => {
  										//let date = m.startTime ? m.startTime.indexOf('T') > -1 ? m.startTime.substring(m.startTime.indexOf('T')) : m.startTime : '';
  										return (
  												<div key={i} className={styles.rowWrap}>
  														<DateTimePicker label={<L p={p} t={`Date`}/>} value={m.date || ''} onChange={(event) => handleDate(i, event)}
  															className={styles.dateTime}/>
  														<TimePicker label={<L p={p} t={`Start time`}/>} value={m.startTime || ''} onChange={(event) => handleTime('startTime', i, event)} className={styles.dateTime}
  																error={errorCheckInTime}/>
  														<TimePicker label={<L p={p} t={`End time`}/>} value={m.endTime || ''} onChange={(event) => handleTime('endTime', i, event)} className={styles.dateTime}
  																error={errorCheckInTime}/>
                              <Required setIf={true} setWhen={localOpportunity && localOpportunity.startEndTimes && localOpportunity.startEndTimes.length > 0
                                  && localOpportunity.startEndTimes[0].date && localOpportunity.startEndTimes[0].startTime && localOpportunity.startEndTimes[0].endTime}
                                  className={styles.requiredPosition}/>
  												</div>
  										)
  								})}
  								<div className={globalStyles.errorText}>{errorDateTime}</div>
  								<div className={classes(styles.headerLabel,styles.row)}>
  										<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
  										<a onClick={addAnotherDate} className={globalStyles.link}><L p={p} t={`Add another date and time`}/></a>
  								</div>
  								<div className={classes(styles.muchLeft, styles.row)}>
  										<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}>Close</a>
  										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  								</div>
  						</div>
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Volunteer Opportunity Add`}/>} path={'volunteerOpportunityAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(VolunteerOpportunityAddView)
