import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './FinanceWaiverSchedulesView.css'
const p = 'FinanceWaiverSchedulesView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function FinanceWaiverSchedulesView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [financeWaiverScheduleId, setFinanceWaiverScheduleId] = useState('')
  const [financeWaiverSchedule, setFinanceWaiverSchedule] = useState({
				dateMonth: '',
        dateDay: '',
				percentWaived: '',
      })
  const [dateMonth, setDateMonth] = useState('')
  const [dateDay, setDateDay] = useState('')
  const [percentWaived, setPercentWaived] = useState('')
  const [errors, setErrors] = useState({
				dateMonth: '',
        dateDay: '',
				percentWaived: '',
      })
  const [dateDayMonth, setDateDayMonth] = useState(<L p={p} t={`Date Month is required`}/>)
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedCount, setIsShowingModal_usedCount] = useState(true)

  const {financeWaiverSchedules, fetchingRecord, days, months} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Date month`}/>, tightText: true},
  			{label: <L p={p} t={`Date day`}/>, tightText: true},
  			{label: <L p={p} t={`% Waived`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (financeWaiverSchedules && financeWaiverSchedules.length > 0) {
          data = financeWaiverSchedules.map(m => {
              return ([
  							{value: m.dateMonth && <a onClick={() => handleEdit(m.financeWaiverScheduleId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.dateMonth && <a onClick={() => handleRemoveItemOpen(m.financeWaiverScheduleId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: (m.dateMonth || m.dateMonth === 0) && months && months.length > 0 && months[m.dateMonth].label},
  							{value: m.dateDay},
  							{value: m.percentWaived === 0 ? '0' : m.percentWaived },
                {value: m.usedCount},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Finance Waiver Schedules`}/>
              </div>
  						<div className={styles.row}>
  								<div>
  										<SelectSingleDropDown
  												id={'dateDay'}
  												label={<L p={p} t={`Date day`}/>}
  												value={financeWaiverSchedule.dateDay || ''}
  												options={days}
  												height={'medium'}
  												className={styles.dropdown}
  												required={true}
  												whenFilled={financeWaiverSchedule.dateDay}
  												onChange={handleChange}/>
  								</div>
  								<div className={styles.moreRight}>
  										<SelectSingleDropDown
  												id={'dateMonth'}
  												label={<L p={p} t={`Date month`}/>}
  												value={financeWaiverSchedule.dateMonth === 0 ? 0 : financeWaiverSchedule.dateMonth ? financeWaiverSchedule.dateMonth : ''}
  												options={months}
  												firstValue={-1}
  												height={'medium'}
  												className={styles.dropdown}
  												required={true}
  												whenFilled={financeWaiverSchedule.dateMonth}
  												onChange={handleChange}/>
  								</div>
  								<div className={globalStyles.errorText}>{errors.dateDayMonth}</div>
  						</div>
  						<InputText
  								id={`percentWaived`}
  								name={`percentWaived`}
  								size={"super-short"}
  								numberOnly={true}
  								maxNumber={100}
  								label={<L p={p} t={`% Waived`}/>}
  								value={financeWaiverSchedule.percentWaived || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeWaiverSchedule.percentWaived}
  								error={errors.percentWaived} />
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={reset}><L p={p} t={`Reset`}/></div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeWaiverScheduleSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this finance waiver schedule?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this finance waiver schedule?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedCount &&
                  <MessageModal handleClose={handleShowUsedCountClose} heading={<L p={p} t={`This Finance Waiver Schedule is in Use`}/>}
  										explainJSX={<L p={p} t={`A finance waiver schedule cannot be deleted once it has been used`}/>}
  										onClick={handleShowUsedCountClose}/>
              }
        </div>
      )
}
export default FinanceWaiverSchedulesView
