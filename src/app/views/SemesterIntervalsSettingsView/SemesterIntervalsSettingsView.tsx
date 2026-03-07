import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './SemesterIntervalsSettingsView.css'
const p = 'SemesterIntervalsSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

function SemesterIntervalsSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [intervalId, setIntervalId] = useState('')
  const [interval, setInterval] = useState({
        name: '',
				fromDay: '',
				fromMonth: '',
				toDay: '',
				toMonth: '',
        sequence: props.intervals && props.intervals.length + 1,
        companyId: props.companyConfig.companyId,
      })
  const [name, setName] = useState('')
  const [fromDay, setFromDay] = useState('')
  const [fromMonth, setFromMonth] = useState('')
  const [toDay, setToDay] = useState('')
  const [toMonth, setToMonth] = useState('')
  const [sequence, setSequence] = useState(props.intervals && props.intervals.length + 1)
  const [companyId, setCompanyId] = useState(props.companyConfig.companyId)
  const [errors, setErrors] = useState({
				name: '',
        sequence: '',
      })
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(true)
  const [listUsedIn, setListUsedIn] = useState([])
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        	if (props.intervals !== prevProps.intervals) {
    					setInterval({...interval, sequence: props.intervals && props.intervals.length + 1 })
    			}
      
  }, [])

  const {intervals, sequences, days, months, fetchingRecord} = props
      
  
  		//We are not going to disable after all.  Let the user change the range any time they want.  It affects the courses created from that point on
  		//		as well as the attendance and calendar ranges.
  		let isDisabled = false; //coursesScheduled && coursesScheduled.length > 0;
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`From day`}/>, tightText: true},
  			{label: <L p={p} t={`From month`}/>, tightText: true},
  			{label: <L p={p} t={`To day`}/>, tightText: true},
  			{label: <L p={p} t={`To month`}/>, tightText: true},
  			{label: <L p={p} t={`Sequence`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true, reactHint: 'How many times this semester interval is used with a record'}]
  
      let data = []
  
      if (intervals && intervals.length > 0) {
          data = intervals.map(m => {
              return ([
  							{value: isDisabled ? '' : <a onClick={() => handleEdit(m.intervalId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: isDisabled ? '' : <a onClick={() => handleRemoveItemOpen(m.intervalId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.fromDay},
  							{value: (m.fromMonth || m.fromMonth === 0) && months && months.length > 0 && months[m.fromMonth] && months[m.fromMonth].label},
  							{value: m.toDay},
  							{value: (m.toMonth || m.toMonth === 0) && months && months.length > 0 && months[m.toMonth] && months[m.toMonth].label},
  							{value: m.sequence},
                {value: m.usedIn && m.usedIn.length, clickFunction: () => handleShowUsedInOpen(m.usedIn), reactHint: 'How many times this semester interval is used with a record'},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Semester or Quarter Interval Settings`}/>
              </div>
  						{isDisabled &&
  								<div className={globalStyles.instructionsBig}>
  										<L p={p} t={`At least one course has been created so that these intervals cannot be changed.`}/>
  								</div>
  						}
  						{isDisabled
  								? ''
  								: <InputText
  											id={`name`}
  											name={`name`}
  											size={"medium"}
  											label={<L p={p} t={`Name`}/>}
  											value={interval.name || ''}
  											onChange={handleChange}
  											required={true}
  											whenFilled={interval.name}
  											error={errors.name} />
  						}
  						{isDisabled
  								? ''
  								: <div>
  											<SelectSingleDropDown
  													id={'sequence'}
  													label={<L p={p} t={`Sequence (for list display)`}/>}
  													value={interval.sequence || ''}
  													noBlank={true}
  													options={sequences}
  													className={styles.dropdown}
  													disabled={isDisabled}
  													onChange={handleChange}/>
  									</div>
  						}
  						<div className={styles.background}>
  								<div className={styles.headerLabel}><L p={p} t={`General date range`}/></div>
  								<div className={globalStyles.instructionsBigger}>
  										<L p={p} t={`The attendance days will be displayed according to this date range. The calendar will show the schedule accordingly.`}/>
  								</div>
  								<div className={styles.row}>
  										<div>
  												<SelectSingleDropDown
  														id={'fromDay'}
  														label={<L p={p} t={`From day`}/>}
  														value={interval.fromDay || ''}
  														options={days}
  														height={'medium'}
  														className={styles.dropdown}
  														required={true}
  														whenFilled={interval.fromDay}
  														onChange={handleChange}/>
  										</div>
  										<div className={styles.moreRight}>
  												<SelectSingleDropDown
  														id={'fromMonth'}
  														label={<L p={p} t={`From month`}/>}
  														value={interval.fromMonth === 0 ? 0 : interval.fromMonth ? interval.fromMonth : ''}
  														options={months}
  														firstValue={-1}
  														height={'medium'}
  														className={styles.dropdown}
  														required={true}
  														whenFilled={interval.fromMonth}
  														onChange={handleChange}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={'toDay'}
  														label={<L p={p} t={`To day`}/>}
  														value={interval.toDay || ''}
  														options={days}
  														height={'medium'}
  														className={styles.dropdown}
  														required={true}
  														whenFilled={interval.toDay}
  														onChange={handleChange}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={'toMonth'}
  														label={<L p={p} t={`To month`}/>}
  														value={interval.toMonth === 0 ? 0 : interval.toMonth ? interval.toMonth : ''}
  														options={months}
  														firstValue={-1}
  														height={'medium'}
  														className={styles.dropdown}
  														required={true}
  														whenFilled={interval.toMonth}
  														onChange={handleChange}/>
  										</div>
  								</div>
  								<div className={globalStyles.errorText}>{errors.fromDate} {errors.toDate}</div>
  						</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink} isFetchingRecord={fetchingRecord.intervalsSettings}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this interval?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this interval?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Discipline is used in these Courses`}/>}
  										explainJSX={<L p={p} t={`In order to delete this discipline, please reassign the following courses with a different discipline setting:<br/><br/>`}/> + listUsedIn}
  										onClick={handleShowUsedInClose}/>
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJXS={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
        </div>
      )
}
export default SemesterIntervalsSettingsView
