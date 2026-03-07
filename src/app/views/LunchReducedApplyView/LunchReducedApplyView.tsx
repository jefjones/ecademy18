import { useState } from 'react'
import * as styles from './LunchReducedApplyView.css'
const p = 'LunchReducedApplyView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import {formatNumber} from '../../utils/numberFormat'
import {guidEmpty} from '../../utils/guidValidate'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import DateMoment from '../../components/DateMoment'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function LunchReducedApplyView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [student, setStudent] = useState({
  				firstName: '',
          middleName: '',
          lastName: '',
      })
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [errors, setErrors] = useState({
          firstName: '',
          middleName: '',
          lastName: '',
      })
  const [mainRecord, setMainRecord] = useState(lunchReducedApply)
  const [adult, setAdult] = useState(undefined)
  const [isShowingModal_removeStudent, setIsShowingModal_removeStudent] = useState(true)
  const [lunchReducedApplyStudentId, setLunchReducedApplyStudentId] = useState('')
  const [isShowingModal_removeAdult, setIsShowingModal_removeAdult] = useState(true)
  const [lunchReducedApplyAdultId, setLunchReducedApplyAdultId] = useState('')
  const [isEditMainMode, setIsEditMainMode] = useState(true)
  const [streetAddress, setStreetAddress] = useState(<L p={p} t={`Street address`}/>)
  const [p, setP] = useState(undefined)
  const [city, setCity] = useState(<L p={p} t={`City`}/>)
  const [usStateId, setUsStateId] = useState(<L p={p} t={`US State`}/>)
  const [postalCode, setPostalCode] = useState(<L p={p} t={`Postal code`}/>)
  const [phone, setPhone] = useState(<L p={p} t={`Phone`}/>)
  const [emailAddress, setEmailAddress] = useState(<L p={p} t={`Email address`}/>)
  const [totalChildIncome, setTotalChildIncome] = useState(<L p={p} t={`Total child income`}/>)
  const [totalChildIncomeFrequencyId, setTotalChildIncomeFrequencyId] = useState(<L p={p} t={`Child income frequency`}/>)
  const [primaryWageEarnerSsn, setPrimaryWageEarnerSsn] = useState(<L p={p} t={`Primary wage earner SSN`}/>)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [isShowingModal_addOrUpdate, setIsShowingModal_addOrUpdate] = useState(true)
  const [addOrUpdateFunction, setAddOrUpdateFunction] = useState(this.handleAddOrUpdateStudent)
  const [closeFunction, setCloseFunction] = useState(this.handleAddOrUpdateStudentClose)
  const [addOrUpdateType, setAddOrUpdateType] = useState(lunchReducedApplyStudentId ? 'Update a Student' : 'Add a New Student')

  const {lunchReducedApply={}, fetchingRecord, uSStates} = props
  
      //Student table
      let headingsStudent = [{}, {},
          {label: <L p={p} t={`First name`}/>, tightText: true},
          {label: <L p={p} t={`Middle name`}/>, tightText: true},
          {label: <L p={p} t={`Last name`}/>, tightText: true},
          {label: <L p={p} t={`Student?`}/>, tightText: true},
          {label: <L p={p} t={`Foster child?`}/>, tightText: true},
          {label: <L p={p} t={`Homeles, runaway, or migrant`}/>, tightText: true},
          {label: <L p={p} t={`Hispanic or Latino`}/>, tightText: true},
          {label: <L p={p} t={`Race`}/>, tightText: true},
      ]
  
      let dataStudent = []
  
      if (lunchReducedApply.students && lunchReducedApply.students.length > 0) {
          dataStudent = lunchReducedApply.students.map(m => {
              return ([
                {value: <a onClick={() => handleAddOrUpdateStudentOpen(m.lunchReducedApplyStudentId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
  							{value: <a onClick={() => handleRemoveStudentOpen(m.lunchReducedApplyStudentId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
                {value: m.firstName, clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.middleName, clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.lastName, clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.isStudent ? 'Yes' : '', clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.fosterChild ? 'Yes' : '', clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.homelessRunawayMigrant ? 'Yes' : '', clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.hispanicOrLatino ? 'Yes' : '', clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
                {value: m.raceName, clickFunction: () => chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              ])
          })
      }
  
      //Adult table
      let headingsAdult = [{}, {},
          {label: <L p={p} t={`First name`}/>, tightText: true},
          {label: <L p={p} t={`Last name`}/>, tightText: true},
          {label: <L p={p} t={`Earnings`}/>, tightText: true},
          {label: <L p={p} t={`Earnings frequency`}/>, tightText: true },
          {label: <L p={p} t={`Public assist, child support, or alimony`}/>, tightText: true },
          {label: <L p={p} t={`Public assist, child support, or alimony frequency`}/>, tightText: true },
          {label: <L p={p} t={`Pension, retiremenr, or other`}/>, tightText: true },
          {label: <L p={p} t={`Pension, retiremenr, or other frequency`}/>, tightText: true },
      ]
  
      let dataAdult = []
  
      if (lunchReducedApply.adults && lunchReducedApply.adults.length > 0 ) {
          dataAdult =  lunchReducedApply.adults.map(m => {
              return ([
                  {value: <a onClick={() => handleAddOrUpdateAdultOpen(m.lunchReducedApplyAdultId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
    							{value: <a onClick={() => handleRemoveAdultOpen(m.lunchReducedApplyAdultId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
                  {value: m.firstName, clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: m.lastName, clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: formatNumber(m.earnings, true, false, 2), clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: m.earningsFrequencyName, clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: formatNumber(m.publicAssistChildSupportAlimony, true, false, 2), clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: m.publicAssistChildSupportAlimonyFrequencyName, clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: formatNumber(m.pensionsRetirementOther, true, false, 2), clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                  {value: m.pensionsRetirementOtherFrequencyName, clickFunction: () => chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Reduced Lunch Application'}
              </div>
              {!isEditMainMode &&
                  <div className={styles.rowWrap}>
                      <div onClick={handleEditMainRecord}>
                          <Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
                      </div>
                      <TextDisplay label={<L p={p} t={`Applicant`}/>} text={lunchReducedApply.personName} />
                      <TextDisplay label={<L p={p} t={`Street address`}/>} text={lunchReducedApply.streetAddress} />
                      <TextDisplay label={<L p={p} t={`City`}/>} text={lunchReducedApply.city} />
                      <TextDisplay label={<L p={p} t={`US State`}/>} text={lunchReducedApply.usStateName} />
                      <TextDisplay label={<L p={p} t={`Postal code`}/>} text={lunchReducedApply.postalCode} />
                      <TextDisplay label={<L p={p} t={`Phone`}/>} text={lunchReducedApply.phone} />
                      <TextDisplay label={<L p={p} t={`Email address`}/>} text={lunchReducedApply.emailAddress} />
                      <TextDisplay label={<L p={p} t={`SNAP`}/>} text={lunchReducedApply.snap ? lunchReducedApply.snapCaseNumber : '--'} />
                      <TextDisplay label={<L p={p} t={`TNAF`}/>} text={lunchReducedApply.tanf ? lunchReducedApply.tanfCaseNumber : '--'} />
                      <TextDisplay label={<L p={p} t={`FDPIR`}/>} text={lunchReducedApply.fdpir ? lunchReducedApply.fdpirCaseNumber : '--'} />
                      <TextDisplay label={<L p={p} t={`Total child income`}/>} text={formatNumber(lunchReducedApply.totalChildIncome, true, false, 2)} />
                      <TextDisplay label={<L p={p} t={`Child income frequency`}/>} text={lunchReducedApply.totalChildIncomeFrequencyName} />
                      <TextDisplay label={<L p={p} t={`Primary wage earner SSN`}/>} text={lunchReducedApply.primaryWageEarnerSsn} />
                      {lunchReducedApply.noSsn && <TextDisplay label={<L p={p} t={`No SSN`}/>} text={<L p={p} t={`No social security number`}/>} />}
                      <TextDisplay label={<L p={p} t={`Confirm complete?`}/>} text={lunchReducedApply.confirmComplete ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
                      <TextDisplay label={<L p={p} t={`Entry date`}/>} text={<DateMoment date={lunchReducedApply.entryDate} minusHours={6} />} />
                  </div>
              }
              {isEditMainMode &&
                  <div>
                      <TextDisplay label={'Applicant'} text={mainRecord.personName} />
                      <div className={styles.muchLeft}>
                          <InputText
                              label={<L p={p} t={`Street address`}/>}
                              name={'streetAddress'}
                              value={mainRecord.streetAddress || ''}
                              maxLength={75}
                              size={'medium'}
                              onChange={handleMainChange}
                              required={true}
                              whenFilled={mainRecord.streetAddress}
                              error={errors.streetAddress}/>
                          <InputText
                              label={<L p={p} t={`City`}/>}
                              name={'city'}
                              value={mainRecord.city || ''}
                              maxLength={75}
                              size={'medium'}
                              onChange={handleMainChange}
                              required={true}
                              whenFilled={mainRecord.city}
                              error={errors.city}/>
                          <div>
                              <SelectSingleDropDown
                                  label={<L p={p} t={`US State`}/>}
                                  id={'usStateId'}
                                  value={mainRecord.usStateId}
                                  options={uSStates}
                                  height={`medium`}
                                  onChange={handleMainChange}
              										required={true}
              										whenFilled={mainRecord.usStateId}
                                  error={errors.usStateId}/>
                          </div>
                          <InputText
                              label={<L p={p} t={`Postal code`}/>}
                              name={'postalCode'}
                              value={mainRecord.postalCode || ''}
                              maxLength={75}
                              size={'medium'}
                              onChange={handleMainChange}
                              required={true}
                              whenFilled={mainRecord.postalCode}
                              error={errors.postalCode}/>
                          <InputText
                              label={<L p={p} t={`Phone`}/>}
                              name={'phone'}
                              value={mainRecord.phone || ''}
                              maxLength={75}
                              size={'medium'}
                              onChange={handleMainChange}
                              required={true}
                              whenFilled={mainRecord.phone}
                              error={errors.phone}/>
                          <InputText
                              label={<L p={p} t={`Email address`}/>}
                              name={'emailAddress'}
                              value={mainRecord.emailAddress || ''}
                              maxLength={75}
                              size={'medium'}
                              onChange={handleMainChange}
                              required={true}
                              whenFilled={mainRecord.emailAddress}
                              error={errors.emailAddress}/>
                      </div>
                      <div className={styles.muchLeft}>
                          <div className={styles.row}>
                              <Checkbox
                                  id={'snap'}
                                  name={'snap'}
                                  label={<L p={p} t={`SNAP?`}/>}
                                  checked={mainRecord.snap || false}
                                  className={styles.checkbox}
                                  onClick={(event) => toggleCheckboxMain('snap', event)}/>
                              {mainRecord.snap &&
                                  <InputText
                                      name={'snapCaseNumber'}
                                      value={mainRecord.snapCaseNumber || ''}
                                      label={<L p={p} t={`SNAP case number`}/>}
                                      maxLength={25}
                                      size={'medium-short'}
                                      onChange={handleMainChange}/>
                              }
                          </div>
                          <div className={styles.row}>
                              <Checkbox
                                  id={'tanf'}
                                  name={'tanf'}
                                  label={<L p={p} t={`TANF?`}/>}
                                  checked={mainRecord.tanf || false}
                                  className={styles.checkbox}
                                  onClick={(event) => toggleCheckboxMain('tanf', event)}/>
                              {mainRecord.tanf &&
                                  <InputText
                                      name={'tanfCaseNumber'}
                                      value={mainRecord.tanfCaseNumber || ''}
                                      label={<L p={p} t={`TANF case number`}/>}
                                      maxLength={25}
                                      size={'medium-short'}
                                      onChange={handleMainChange}/>
                              }
                          </div>
                          <div className={styles.row}>
                              <Checkbox
                                  id={'fdpir'}
                                  name={'fdpir'}
                                  label={<L p={p} t={`FDPIR?`}/>}
                                  checked={mainRecord.fdpir || false}
                                  className={styles.checkbox}
                                  onClick={(event) => toggleCheckboxMain('fdpir', event)}/>
                              {mainRecord.fdpir &&
                                  <InputText
                                      name={'fdpirCaseNumber'}
                                      value={mainRecord.fdpirCaseNumber || ''}
                                      label={<L p={p} t={`FDPIR case number`}/>}
                                      maxLength={25}
                                      size={'medium-short'}
                                      onChange={handleMainChange}/>
                              }
                          </div>
                          <InputText
                              label={<L p={p} t={`Total child income`}/>}
                              name={'totalChildIncome'}
                              value={mainRecord.totalChildIncome || ''}
                              numberOnly={true}
                              maxLength={9}
                              size={'short'}
                              onChange={handleMainChange}/>
  
                          <div>
                              <SelectSingleDropDown
                                  label={<L p={p} t={`Child income frequency`}/>}
                                  id={'totalChildIncomeFrequencyId'}
                                  value={mainRecord.totalChildIncomeFrequencyId}
                                  options={lunchReducedApply.frequencies}
                                  height={`medium`}
                                  className={styles.singleDropDown}
                                  onChange={handleMainChange}
              										required={true}
              										whenFilled={mainRecord.totalChildIncomeFrequencyId}
                                  error={errors.totalChildIncomeFrequencyId}/>
                          </div>
                          <InputText
                              name={'primaryWageEarnerSsn'}
                              value={mainRecord.primaryWageEarnerSsn || ''}
                              label={<L p={p} t={`Primary wage earner SSN (last four only)`}/>}
                              maxLength={4}
                              size={'short'}
                              onChange={handleMainChange}/>
                          <Checkbox
                              label={<L p={p} t={`No social security number`}/>}
                              id={'noSsn'}
                              name={'noSsn'}
                              checked={mainRecord.noSsn || false}
                              className={styles.checkbox}
                              onClick={handleMainChange}/>
                          <Checkbox
                              label={<L p={p} t={`Confirm complete?`}/>}
                              id={'confirmComplete'}
                              name={'confirmComplete'}
                              checked={mainRecord.confirmComplete || false}
                              className={styles.checkbox}
                              onClick={handleMainChange}/>
                      </div>
                      <div className={styles.rowRight}>
          								<div className={globalStyles.cancelLink} onClick={() => setIsEditMainMode(false)}><L p={p} t={`Close`}/></div>
          								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                      </div>
                  </div>
              }
  
              <div className={globalStyles.classification}><L p={p} t={`Students`}/></div>
              <div className={classes(styles.row, globalStyles.link)} onClick={() => handleAddOrUpdateStudentOpen()}>
                  <Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
                  <L p={p} t={`Add a new student`}/>
              </div>
              <EditTable labelClass={styles.tableLabelClass} headings={headingsStudent} isFetchingRecord={fetchingRecord.lunchReducedApply} data={dataStudent} />
  
              <div className={globalStyles.classification}><L p={p} t={`Adults`}/></div>
              <div className={classes(styles.row, globalStyles.link)} onClick={() => handleAddOrUpdateAdultOpen()}>
                  <Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
                  <L p={p} t={`Add a new adult`}/>
              </div>
              <EditTable labelClass={styles.tableLabelClass} headings={headingsAdult} isFetchingRecord={fetchingRecord.lunchReducedApply} data={dataAdult} />
              <hr />
              <OneFJefFooter />
              {isShowingModal_removeStudent &&
                  <MessageModal handleClose={handleRemoveStudentClose} heading={<L p={p} t={`Remove this Student?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this student from the list?`}/>} isConfirmType={true}
                     onClick={handleRemoveStudent} />
              }
              {isShowingModal_removeAdult &&
                  <MessageModal handleClose={handleRemoveAdultClose} heading={<L p={p} t={`Remove this Adult?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this adult from the list?`}/>} isConfirmType={true}
                     onClick={handleRemoveAdult} />
              }
              {isShowingModal_missingInfo &&
                  <MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
                     explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
              }
              {isShowingModal_addOrUpdate &&
                  <MessageModal handleClose={closeFunction} heading={addOrUpdateType} explainJSX={explainJSX} onClick={addOrUpdateFunction} isConfirmType={true}/>
              }
        </div>
      )
}
export default LunchReducedApplyView
