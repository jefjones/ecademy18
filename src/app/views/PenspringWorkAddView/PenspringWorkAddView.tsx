import { useState } from 'react'
import { Link } from 'react-router-dom'
import {penspringHost} from '../../penspring_host'
import styles from './PenspringWorkAddView.css'
const p = 'PenspringWorkAddView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import Icon from '../../components/Icon'
import penspringSmall from '../../assets/Penspring_small.png'
import classes from 'classnames'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateTimePicker from '../../components/DateTimePicker'

function PenspringWorkAddView(props) {
  const [isFileUpload, setIsFileUpload] = useState(false)
  const [isShowingSectionInfo, setIsShowingSectionInfo] = useState(false)
  const [isShowingChooseEntry, setIsShowingChooseEntry] = useState(false)
  const [data, setData] = useState({
								workName: props.presetName || '',
								languageId: 1,
								dueDate: '',
								description: '',
						})
  const [workName, setWorkName] = useState(props.presetName || '')
  const [languageId, setLanguageId] = useState(1)
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [localShowMoreInfo, setLocalShowMoreInfo] = useState(undefined)
  const [errorWorkName, setErrorWorkName] = useState(undefined)
  const [errorLanguageId, setErrorLanguageId] = useState(undefined)
  const [runVerifyForm, setRunVerifyForm] = useState(undefined)

  const toggleShowMoreInfo = () => {
    return setLocalShowMoreInfo(!localShowMoreInfo)
    
  }

  const handleSectionInfoClose = () => {
    return setIsShowingSectionInfo(false)
  }

  const handleSectionInfoOpen = () => {
    return setIsShowingSectionInfo(true)
  }

  const handleChooseEntryClose = () => {
    return setIsShowingChooseEntry(false)
  }

  const handleChooseEntryOpen = () => {
    return setIsShowingChooseEntry(true)
  }

  const changeData = (event) => {
    
    				let field = event.target.name
    				data[field] = event.target.value
    				setData(data)
    		
  }

  const processForm = (isFileUpload) => {
    
    	      const {personId, createWorkAndPenspringTransfer, accessRoles, studentPersonId, course, assignmentId, recallInitRecords, isDistributableAssignment,
    								companyConfig}  = props
    	      let data = data
    	      let hasError = false
    				//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.
    
    				if (!data.workName) {
    	          hasError = true
    	          setErrorWorkName('A document name is required')
    	      }
    
    				if (!data.languageId) {
    	          hasError = true
    	          setErrorLanguageId('A language is required')
    	      }
    
    	      if (!hasError) {
    						data.isDistributableAssignment = isDistributableAssignment
    						data.personId = personId
    						//data.transferCode = isFileUpload ? 'FILEUPLOAD' : 'STARTWRITING';
    						data.transferCode = 'STARTWRITING'
    						data.ownerPersonId = studentPersonId || personId
    						data.editorPersonId = isDistributableAssignment ? '' : course.facilitatorPersonId
    						data.studentPersonId = isDistributableAssignment ? '' : studentPersonId
    						data.assignmentId = assignmentId
    						data.companyId = companyConfig.companyId
    						data.schoolYearId = course.schoolYearId
    						data.intervalId = course.intervalId
    						data.courseEntryId  = course.courseEntryId
    						data.courseScheduledId = course.courseScheduledId
    						data.isTeacher = accessRoles.facilitator
    						data.courseEntryId = course.courseEntryId
    
    	          createWorkAndPenspringTransfer(personId, data, recallInitRecords)
    	      }
    	  
  }

  const unsetRunVerifyForm = () => {
    
            setRunVerifyForm(false)
        
  }

  const submitOuterPage = (workRecord) => {
    
            const {addOrUpdateDocument} = props
            
            addOrUpdateDocument(workRecord, isFileUpload)
        
  }

  
            return (
              <div className={styles.container}>
                  <div className={globalStyles.pageTitle}>
                      {isNewUser
  												? <L p={p} t={`Add Your First Document`}/>
  												: groupChosen
  														? <L p={p} t={`Add New Assignment`}/>
  														: <div className={styles.row}><L p={p} t={`Add a new `}/><img className={classes(styles.penspringLogo, styles.pointer)} src={penspringSmall} alt="penspring"/><L p={p} t={`file`}/></div>
  										}
                  </div>
  								<div className={styles.row}>
  										<InputText
  												value={data.workName}
  												size={"medium-long"}
  												name={"workName"}
  												maxLength={225}
  												label={<L p={p} t={`Document name`}/>}
  												inputClassName={styles.input}
  												onChange={changeData}/>
  								</div>
  								<div className={styles.errorName}>{errorWorkName}</div>
  								{showMoreInfo &&
  										<div className={classes(styles.showMore, styles.rowTight)} onClick={toggleShowMoreInfo}>
  												{localShowMoreInfo ? <L p={p} t={`Show less info`}/> : <L p={p} t={`Show more info`}/>}
  												<div className={classes(styles.moreLeftMargin, styles.jef_caret, localShowMoreInfo ? styles.jefCaretUp : styles.jefCaretDown)}/>
  										</div>
  								}
  								{localShowMoreInfo &&
  										<div>
  												<div>
  														<SelectSingleDropDown
  																label={<L p={p} t={`Native Text Language`}/>}
  																value={data.languageId}
  																options={languageList || []}
  																error={''}
  																height={`medium`}
  																className={styles.singleDropDown}
  																id={`languageId`}
  																onChange={changeData} />
  												</div>
  												<div className={styles.errorLanguage}>{errorLanguageId}</div>
  												<div className={styles.dueDate}>
  														<span className={styles.labelHigher}><L p={p} t={`Due date`}/></span>
  														<DateTimePicker id={'dueDate'} value={data.dueDate} onChange={changeData}/>
  												</div>
  												<div className={styles.column}>
  														<span className={styles.labelHigher}><L p={p} t={`Description (optional)`}/></span>
  														<textarea rows={5} cols={42} value={data.description || ''} id={`description`} className={styles.messageBox}
  																onChange={changeData}></textarea>
  												</div>
  										</div>
  								}
                  {showMoreInfo && <hr />}
                  <div className={styles.row}>
  										{/*<Link to={`${penspringHost}/lms/${personId}`}
  														onClick={data && data.workName && data.languageId ? () => processForm(true) : (event) => event.preventDefault()}
  															className={styles.button} target={'_penspring'}>
  												{`Upload File...`}
  										</Link>*/}
                      <Link to={`${penspringHost}/lms/${personId}`}
  														onClick={data && data.workName && data.languageId ? () => processForm(false) : (event) => event.preventDefault()}
  															className={styles.button} target={'_penspring'}>
  												<L p={p} t={`Start Writing`}/>
  										</Link>
                  </div>
                  {!hideSectionMessage &&
  										<a onClick={handleSectionInfoOpen} className={styles.explanation}>
  		                    <L p={p} t={`Do you have sections or chapters?`}/>
  		                    <Icon pathName={`info`} className={styles.image}/>
  		                </a>
  								}
                  {isShowingSectionInfo &&
                      <MessageModal handleClose={handleSectionInfoClose} heading={<L p={p} t={`Do you have Sections or Chapters?`}/>} showSectionInfo={true}
                          explainJSX={<div><L p={p} t={`You can either load your entire document and then choose to split it up by section.`}/>&nbsp
                          <L p={p} t={`Or, you can upload your first section/chapter here and add additional sections or chapters with the section menu options.`}/>&nbsp
                          <L p={p} t={`You can always reorder the sequence of your sections and chapters.`}/></div>}
                          onClick={handleSectionInfoClose}/>
                  }
                  {isShowingChooseEntry &&
                      <MessageModal handleClose={handleChooseEntryClose} heading={<L p={p} t={`Choose Entry Type`}/>}
                          explainJSX={<L p={p} t={`Please choose how you want to enter your data. You can choose to start writing or you can upload a file.`}/>}
                          onClick={handleChooseEntryClose}/>
                  }
              </div>
          )
}

//    djsConfig={djsConfig} />
export default PenspringWorkAddView
