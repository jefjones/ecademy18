import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './ClassPeriodsSettingsView.css'
const p = 'ClassPeriodsSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import TimeDisplay from '../../components/TimeDisplay'
import Icon from '../../components/Icon'
import InputText from '../../components/InputText'
import Required from '../../components/Required'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function ClassPeriodsSettingsView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [classPeriodId, setClassPeriodId] = useState('')
  const [classPeriod, setClassPeriod] = useState({
				classPeriodId: 0,
        periodNumber: '',
        startTime: '',
        endTime: '',
      })
  const [periodNumber, setPeriodNumber] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [errors, setErrors] = useState({
        periodNumber: '',
        startTime: '',
        endTime: ''
      })
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(undefined)
  const [listUsedIn, setListUsedIn] = useState(undefined)

  useEffect(() => {
    
        //document.getElementById('periodNumber').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
      
  }, [])

  const changePeriod = (event) => {
    
    	    const field = event.target.name
    	    let classPeriod = Object.assign({}, classPeriod)
    	    let errors = Object.assign({}, errors)
    	    classPeriod[field] = event.target.value
    	    errors[field] = ''
    
    	    setClassPeriod(classPeriod); setErrors(errors)
      
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateClassPeriod, personId} = props
          
          let hasError = false
    			let errors = Object.assign({}, errors)
    
          if (!classPeriod.periodNumber) {
              hasError = true
              errors.periodNumber = <L p={p} t={`Period number is required`}/>
          }
          if (!classPeriod.startTime) {
              hasError = true
              errors.startTime = <L p={p} t={`Start time is required`}/>
          }
          if (!classPeriod.endTime) {
              hasError = true
              errors.endTime = <L p={p} t={`End time is required`}/>
          }
    
          if (hasError) {
    					setErrors(errors)
    			} else {
              addOrUpdateClassPeriod(personId, classPeriod)
              setClassPeriod({
    									classPeriodId: 0,
                      periodNumber: '',
                      startTime: '',
                      endTime: '',
                  })
    					if (stayOrFinish === "FINISH") {
    		          navigate(`/schoolSettings`)
    		      }
          }
      
  }

  const handleShowUsedInOpen = (usedIn) => {
    
          let listUsedIn = []
          listUsedIn[listUsedIn.length] = <L p={p} t={`In order to delete this class period, please reassign the following courses with a different class period setting:`}/>
          listUsedIn[listUsedIn.length] = <br/>
          listUsedIn[listUsedIn.length] = <br/>
    
    			usedIn && usedIn.length > 0 && usedIn.forEach(m => {
              listUsedIn[listUsedIn.length] = m
              listUsedIn[listUsedIn.length] = <br/>
          })
    			setIsShowingModal_usedIn(true); setListUsedIn(listUsedIn)
    	
  }

  const handleShowUsedInClose = () => {
    return setIsShowingModal_usedIn(false); setListUsedIn([])
    
    	handleRemoveItemOpen = (classPeriodId, usedIn) => {
    			if (usedIn && usedIn.length > 0) {
    					handleShowUsedInOpen(usedIn)
  }

  const handleRemoveItemOpen = (classPeriodId, usedIn) => {
    
    			if (usedIn && usedIn.length > 0) {
    					handleShowUsedInOpen(usedIn)
    			} else {
    					setIsShowingModal_remove(true); setClassPeriodId(classPeriodId)
    			}
    	
  }

  const handleRemoveItemClose = () => {
    return setIsShowingModal_remove(false)
      handleRemoveItem = () => {
          const {removeClassPeriod, personId} = props
  }

  const handleRemoveItem = () => {
    
          const {removeClassPeriod, personId} = props
          
          removeClassPeriod(personId, classPeriodId)
          handleRemoveItemClose()
      
  }

  const handleEdit = (classPeriodId) => {
    
    			const {classPeriods} = props
    			let classPeriod = classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodId === classPeriodId)[0]
    			if (classPeriod && classPeriod.periodNumber) {
    					classPeriod.startTime = classPeriod.startTime.indexOf('T') > -1 ? classPeriod.startTime.substring(classPeriod.startTime.indexOf('T') + 1) : classPeriod.startTime
    					classPeriod.endTime = classPeriod.endTime.indexOf('T') > -1 ? classPeriod.endTime.substring(classPeriod.endTime.indexOf('T') + 1) : classPeriod.endTime
    					setClassPeriod(classPeriod)
    			}
    	
  }

  const {classPeriods, periodsList, fetchingRecord} = props
      
  
      let headings = [{}, {},
  				{label: <L p={p} t={`Period`}/>, tightText: true},
  				{label: <L p={p} t={`Start Time`}/>, tightText: true},
  				{label: <L p={p} t={`End Time`}/>, tightText: true},
  				{label: <L p={p} t={`Used `}/>, tightText: true}]
  
      let data = []
  
      if (classPeriods && classPeriods.length > 0) {
          data = classPeriods.map((m, i) => {
              return ([
  							{value: <a key={i} onClick={() => handleEdit(m.classPeriodId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {id: m.classPeriodId, value: <a key={i} onClick={() => handleRemoveItemOpen(m.classPeriodId, m.usedIn)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
                {id: m.classPeriodId, value: m.periodNumber + ' ' + (m.descriptor || '')},
                {id: m.classPeriodId, value: <TimeDisplay key={i} time={m.startTime} className={styles.cellSpacing}/>},
                {id: m.classPeriodId, value: <TimeDisplay key={i} time={m.endTime} className={styles.cellSpacing}/>},
  							{value: m.usedIn && m.usedIn.length, clickFunction: () => handleShowUsedInOpen(m.usedIn)},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Class Period Settings`}/>
              </div>
              <div>
                  <SelectSingleDropDown
                      id={'periodNumber'}
                      value={classPeriod.periodNumber}
                      label={<L p={p} t={`Period`}/>}
                      options={periodsList}
                      height={`medium`}
                      className={styles.singleDropDown}
                      onChange={changePeriod}
  										required={true}
  										whenFilled={classPeriod.periodNumber}
                      error={errors.periodNumber}/>
              </div>
  						<div className={classes(styles.row, styles.littleLeft, styles.littleTop)}>
  								<InputText
  										name={'descriptor'}
  										value={classPeriod.descriptor || ''}
  										label={<L p={p} t={`Descriptor (optional)`}/>}
  										maxLength={25}
  										size={'medium-short'}
  										onChange={changePeriod}/>
  								<div className={classes(styles.muchTop, globalStyles.instructions)}><L p={p} t={`To indicate the difference if using the same period number.`}/></div>
  						</div>
              <div className={styles.dateColumn}>
  								<div className={styles.row}>
  		                <span className={styles.label}><L p={p} t={`Start time`}/></span>
  										<Required setIf={true} setWhen={classPeriod.startTime}/>
  								</div>
                  <input type="time" name={'startTime'} onChange={changePeriod} value={classPeriod.startTime || ''} className={styles.timePicker}/>
              </div>
  						<div className={classes(styles.errorPosition, globalStyles.errorText)}>{errors.startTime}</div>
              <div className={styles.dateColumn}>
  								<div className={styles.row}>
  		                <span className={styles.label}><L p={p} t={`End time`}/></span>
  										<Required setIf={true} setWhen={classPeriod.endTime}/>
  								</div>
                  <input type="time" name={'endTime'} onChange={changePeriod} value={classPeriod.endTime || ''} className={styles.timePicker}/>
              </div>
  						<div className={classes(styles.errorPosition, globalStyles.errorText)}>{errors.endTime}</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.classPeriodsSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this class period?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this class period?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Class Period is used in these Courses`}/>}
  										explainJSX={listUsedIn}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default ClassPeriodsSettingsView
