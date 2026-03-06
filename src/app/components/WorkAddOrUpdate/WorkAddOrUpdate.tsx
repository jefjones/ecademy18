import { useEffect, useState } from 'react'
import styles from './WorkAddOrUpdate.css'
import classes from 'classnames'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateTimePicker from '../../components/DateTimePicker'
import TextDisplay from '../../components/TextDisplay'
import {formatDayShortMonthYear} from '../../utils/dateFormat'
const p = 'component'
import L from '../../components/PageLanguage'

function WorkAddOrUpdate(props) {
  const [isLocalNotEditMode, setIsLocalNotEditMode] = useState(false)
  const [workName, setWorkName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [internalId, setInternalId] = useState('')
  const [description, setDescription] = useState('')
  const [languageChosen, setLanguageChosen] = useState(1)
  const [groupId, setGroupId] = useState('')
  const [workNameError, setWorkNameError] = useState('')
  const [languageError, setLanguageError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [localShowMoreInfo, setLocalShowMoreInfo] = useState(false)
  const [isCleared, setIsCleared] = useState(undefined)
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
            const {groupChosen, workSummary, isNotEditMode, showMoreInfo} = props
            if (!isNotEditMode) {
                //document.getElementById('workName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
                document.getElementById('workName').addEventListener('keydown', checkForKeypress)
            }
            setGroupId(groupChosen); setIsLocalNotEditMode(isNotEditMode)
            if (workSummary) {
                setWorkName(workSummary.title); setDueDate(formatDayShortMonthYear(workSummary.chapterDueDate, true)); setInternalId(workSummary.internalId); setDescription(workSummary.description); setLanguageChosen(workSummary.nativeLanguageId)
            }
            if (showMoreInfo || (workSummary && (workSummary.description || workSummary.chapterDueDate))) {
                setLocalShowMoreInfo(showMoreInfo)
            }
    
            let baseDueDate = workSummary && workSummary.chapterDueDate
            if (baseDueDate && baseDueDate.indexOf('T') > -1) {
                baseDueDate = baseDueDate.substring(0, baseDueDate.indexOf('T'))
            }
            setDueDate(baseDueDate)
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            if (!isVerified && props.runVerifyForm) {
                setIsVerified(true)
                handleExternalSubmit()
            }
            if (!isCleared && props.runClearForm) {
                setIsCleared(true)
                handleClearForm()
            }
        
  }, [])

  const toggleShowMoreInfo = () => {
    
            setLocalShowMoreInfo(!localShowMoreInfo)
        
  }

  const changeEditMode = () => {
    
            setIsLocalNotEditMode(false)
        
  }

  const handleGroupChange = (event) => {
    
            setGroupId(event.target.value)
        
  }

  const handleDueDateChange = (event) => {
    
            setDueDate(event.target.value)
        
  }

  const handleInternalIdChange = (event) => {
    
            setInternalId(event.target.value)
        
  }

  const handleDescriptionChange = (event) => {
    
            setDescription(event.target.value)
        
  }

  const checkForKeypress = (evt) => {
    
            if (evt.key === 'Enter') {
                evt.stopPropagation()
                evt.preventDefault()
                handleChooseEntryOpen()
                return false
            }
        
  }

  const handleNameUpdate = (event) => {
    
            setWorkName(event.target.value); setWorkNameError(''); setIsVerified(false)
            props.unsetRunVerifyForm()
        
  }

  const handleLanguageChange = (event) => {
    
            setLanguageChosen(event.target.value); setLanguageError(''); setIsVerified(false)
            props.unsetRunVerifyForm()
        
  }

  const handleInternalSubmit = () => {
    
            const {addOrUpdateDocument} = props
            let workRecord = verifyForm()
            if (workRecord) {
                addOrUpdateDocument(workRecord, "STAY")
                setIsLocalNotEditMode(true)
            }
        
  }

  const handleExternalSubmit = () => {
    
            const {submitOuterPage} = props
            let workRecord = verifyForm()
            workRecord && submitOuterPage(workRecord)
        
  }

  const handleClearForm = () => {
    
            setWorkName(''); setDueDate(''); setInternalId(''); setDescription(''); setLanguageChosen(1)
            //document.getElementById('workName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        
  }

  const verifyForm = () => {
    
            const {workId, personId} = props
            
    
            if (!workName) {
                setWorkNameError(<L p={p} t={`Please enter a document name`}/>)
                return false
            }
    
            if (!languageChosen || languageChosen === '- -') {
                setLanguageError(<L p={p} t={`Please choose a native text language`}/>)
                return false
            }
            return {
                personId,
                workId,
                workName,
                languageId: languageChosen,
                groupId: groupId === 'undefined' ? null : groupId,
                description,
                dueDate,
                internalId,
            }
        
  }

  //the showButton and the isNotEditMOde is used in workSettings.  the handleSubmit is used in
            const {languageList, groupList, showButton} = props
            
            let languageIdChosen = languageList && languageList.length > 0 && languageList.filter(m => m.id === languageChosen)[0]
            let languageName = !!languageIdChosen ? languageIdChosen.label : ''
  
            let groupIdChosen = groupList && groupList.length > 0 && groupList.filter(m => m.groupId === groupId)[0]
            let groupName = !!groupIdChosen ? groupIdChosen.label : ''
  
            return (
              <div className={styles.inputControls}>
                  {!isLocalNotEditMode &&
                      <div>
                          <div className={styles.row}>
                              <div>
                                  <InputText
                                      value={workName}
                                      size={"medium-long"}
                                      name={"workName"}
                                      label={<L p={p} t={`Document name`}/>}
                                      inputClassName={styles.input}
                                      onChange={handleNameUpdate}/>
                              </div>
                              {showButton && <button className={styles.editButton} onClick={handleInternalSubmit}>Save</button>}
                          </div>
                          <div className={styles.errorName}>{workNameError}</div>
                          <div>
                              <SelectSingleDropDown
                                  label={<L p={p} t={`Native Text Language`}/>}
                                  value={languageChosen}
                                  options={languageList || []}
                                  error={''}
                                  height={`medium`}
                                  className={styles.singleDropDown}
                                  id={`languageId`}
                                  onChange={handleLanguageChange} />
                          </div>
                          <div className={styles.errorLanguage}>{languageError}</div>
                          {groupList && groupList.length > 1 &&
                              <div>
                                  <SelectSingleDropDown
                                      label={<L p={p} t={`Group`}/>}
                                      value={groupId}
                                      options={groupList || []}
                                      error={''}
                                      height={`medium`}
                                      className={styles.singleDropDown}
                                      id={`groupId`}
                                      onChange={handleGroupChange} />
                              </div>
                          }
                          {groupId &&
                              <div>
                                  <InputText
                                      value={internalId || ''}
                                      size={"medium"}
                                      name={"internalId"}
                                      label={<L p={p} t={`Internal id`}/>}
                                      inputClassName={styles.input}
                                      onChange={handleInternalIdChange}/>
                              </div>
                          }
                          <div className={classes(styles.showMore, styles.rowTight)} onClick={toggleShowMoreInfo}>
                              {localShowMoreInfo ? <L p={p} t={`Show less info`}/> : <L p={p} t={`Show more info`}/>}
                              <div className={classes(styles.moreLeftMargin, styles.jef_caret, localShowMoreInfo ? styles.jefCaretUp : styles.jefCaretDown)}/>
                          </div>
                          {localShowMoreInfo &&
                              <div>
                                  <div className={styles.dueDate}>
                                      <span className={styles.labelHigher}><L p={p} t={`Due date`}/></span>
                                      <DateTimePicker value={dueDate} onChange={handleDueDateChange}/>
                                  </div>
                                  <div className={styles.column}>
                                      <span className={styles.labelHigher}>Description (optional)</span>
                                      <textarea rows={5} cols={42} value={description || ''} id={`description`} className={styles.messageBox}
                                          onChange={(event) => handleDescriptionChange(event)}></textarea>
                                  </div>
                              </div>
                          }
                      </div>
                  }
                  {isLocalNotEditMode &&
                      <div>
                          <div className={styles.row}>
                              <TextDisplay label={<L p={p} t={`Document name`}/>} text={workName} />
                              <button className={styles.editButton} onClick={changeEditMode}><L p={p} t={`Edit`}/></button>
                          </div>
                          <TextDisplay label={<L p={p} t={`Due date`}/>} text={formatDayShortMonthYear(dueDate, true) || '- -'} />
                          <TextDisplay label={<L p={p} t={`Description`}/>} text={description || '- -'} />
                          <TextDisplay label={<L p={p} t={`Native text language`}/>}
                              text={languageName || '- -'} />
                          {groupList && <TextDisplay label={<L p={p} t={`Group`}/>}
                              text={groupName || '- -'} />
                          }
                          {groupName && <TextDisplay label={<L p={p} t={`Internal id`}/>}
                              text={internalId || '- -'} />
                          }
                      </div>
                  }
              </div>
          )
}
export default WorkAddOrUpdate
