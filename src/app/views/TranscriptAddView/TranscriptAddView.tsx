import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './TranscriptAddView.css'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import OneFJefFooter from '../../components/OneFJefFooter'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import classes from 'classnames'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import EditTable from '../../components/EditTable'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import InputDataList from '../../components/InputDataList'
import Icon from '../../components/Icon'

function TranscriptAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [transcript, setTranscript] = useState({
				transcriptId:'',
				intervalType: '',
				firstInterval: '',
				secondInterval: '',
				thirdInterval: '',
				fourthInterval: '',
				schoolName: '',
				gradeLevelId: '',
				schoolYearId: '',
				courseName: '',
				credits: '',
				note:'',
			})
  const [transcriptId, setTranscriptId] = useState('')
  const [intervalType, setIntervalType] = useState('')
  const [firstInterval, setFirstInterval] = useState('')
  const [secondInterval, setSecondInterval] = useState('')
  const [thirdInterval, setThirdInterval] = useState('')
  const [fourthInterval, setFourthInterval] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [gradeLevelId, setGradeLevelId] = useState('')
  const [schoolYearId, setSchoolYearId] = useState('')
  const [courseName, setCourseName] = useState('')
  const [credits, setCredits] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({
				schoolName: '',
				gradeLevel: '',
				schoolYear: '',
				courseName: '',
				credits: '',
			})
  const [gradeLevel, setGradeLevel] = useState('')
  const [schoolYear, setSchoolYear] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [selectedStudent, setSelectedStudent] = useState(undefined)

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateTranscript, personId} = props
    			
          let hasError = false
    			let missingInfoMessage = []
    
    			if (!selectedStudent) {
    					hasError = true
    					errors.student = <L p={p} t={`Student is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student`}/></div>
    					setErrors(errors)
    			}
    
    			if (!transcript.schoolName) {
    					hasError = true
    					errors.schoolName = <L p={p} t={`School name is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`School name`}/></div>
    					setErrors(errors)
    			}
    
    			if (!transcript.gradeLevelId) {
    					hasError = true
    					errors.gradeLevel = <L p={p} t={`Grade level is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Grade level`}/></div>
    					setErrors(errors)
    			}
    
    			if (!transcript.schoolYearId) {
    					hasError = true
    					errors.schoolYear = <L p={p} t={`School year is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`School year`}/></div>
    					setErrors(errors)
    			}
    
    			if (!transcript.courseName) {
    					hasError = true
    					errors.courseName = <L p={p} t={`Course name is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Course name`}/></div>
    					setErrors(errors)
    			}
    
    			if (!transcript.credits) {
    					hasError = true
    					errors.credits = <L p={p} t={`Credits are required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Credits`}/></div>
    					setErrors(errors)
    			}
    
          if (!hasError) {
    					transcript.studentPersonId = selectedStudent && selectedStudent.id
              addOrUpdateTranscript(personId, transcript)
    
              setTranscript({
    									...transcript,
    									transcriptId:'',
    									//intervalType: '',  let the user enter in more than one until they reset.
    									firstInterval: '',
    									secondInterval: '',
    									thirdInterval: '',
    									fourthInterval: '',
    									//schoolName: '',
    									//gradeLevelId: '',
    									//schoolYearId: '',
    									courseName: '',
    									credits: '',
    									note:'',
    							}); set//selectedStudent(''); setDon't do this since we are probably entering more transcripts for the same student.(Don't do this since we are probably entering more transcripts for the same student.)
    			} else {
    					handleMissingInfoOpen(missingInfoMessage)
          }
      
  }

  const handleChange = (event) => {
    
    				if (event.target.name === 'firstInterval' || event.target.name === 'secondInterval' || event.target.name === 'thirdInterval' || event.target.name === 'fourthInterval')
    						transcript[event.target.name] = event.target.value.toUpperCase()
    				else
    						transcript[event.target.name] = event.target.value
    				setTranscript(transcript)
    		
  }

  const getrecord = (record) => {
    
          	setTranscript(Object.assign({}, record))
        
  }

  const handleRemoveOpen = (transcriptId) => {
    return setIsShowingModal_remove(true); setTranscriptId(transcriptId)

  }
  const handleRemoveClose = () => {
    return setIsShowingModal_remove(false); setTranscriptId('')

  }
  const handleRemove = () => {
    
    				const {personId, removeTranscript} = props
    				
    				removeTranscript(personId, transcriptId)
            handleRemoveClose()
      	
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    

  }
  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    

  }
  const handleSelectedStudent = (selectedStudent) => {
    
    				const {personId, getTranscripts} = props
    				setSelectedStudent(selectedStudent)
    				selectedStudent && selectedStudent.id && getTranscripts(personId, selectedStudent.id)
    		
  }

  const resetAll = () => {
    
    				setTranscript({
    								transcriptId:'',
    								intervalType: '',
    								firstInterval: '',
    								secondInterval: '',
    								thirdInterval: '',
    								fourthInterval: '',
    								schoolName: '',
    								gradeLevelId: '',
    								schoolYearId: '',
    								courseName: '',
    								credits: '',
    								note:'',
    						}); setSelectedStudent('')
    				navigate('/transcriptAdd')
    		
  }

  const editTranscript = (transcript) => {
    return setTranscript(transcript)
  }

  
  			let headings = [{}, {},
  					{label: <L p={p} t={`School year`}/>, tightText: true},
  					{label: <L p={p} t={`School name`}/>, tightText: true},
  					{label: <L p={p} t={`Interval type`}/>, tightText: true},
  					{label: <L p={p} t={`Grade level`}/>, tightText: true},
  					{label: <L p={p} t={`Course name`}/>, tightText: true},
  					{label: <L p={p} t={`Credits`}/>, tightText: true},
  					{label: <L p={p} t={`1st`}/>, tightText: true},
  					{label: <L p={p} t={`2nd`}/>, tightText: true},
  					{label: <L p={p} t={`3rd`}/>, tightText: true},
  					{label: <L p={p} t={`4th`}/>, tightText: true},
  			]
  
  			let data = transcripts && transcripts.courseTranscripts && transcripts.courseTranscripts.map(m => {
  					let row = [
  							{value: <div onClick={() => editTranscript(m)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></div> },
  							{value: <div onClick={() => handleRemoveOpen(m.transcriptId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div> },
  							{value: m.schoolYearName},
  							{value: m.schoolName},
  							{value: m.intervalType},
  							{value: m.gradeLevelName},
  							{value: m.courseName},
  							{value: m.credits},
  							{value: m.firstInterval},
  							{value: m.secondInterval},
  							{value: m.thirdInterval},
  							{value: m.fourthInterval},
  					]
  					return row
  			})
  
  	    return (
  	        <div className={styles.container}>
  							<div className={globalStyles.pageTitle}>{`Transcript Entry`}</div>
  							<div>
  									<InputDataList
  											label={<L p={p} t={`Student`}/>}
  											name={'student'}
  											options={students}
  											value={selectedStudent}
  											height={`medium`}
  											onChange={handleSelectedStudent}
  											required={true}
  											whenFilled={selectedStudent}
  											error={errors.student}/>
  							</div>
  							<InputText
  									id={`schoolName`}
  									name={`schoolName`}
  									size={"medium-long"}
  									label={<L p={p} t={`School name`}/>}
  									value={transcript.schoolName || ''}
  									onChange={handleChange}
  									required={true}
  									whenFilled={transcript.schoolName}
  									error={errors.schoolName} />
  							<div>
  									<SelectSingleDropDown
  											id={`gradeLevelId`}
  											name={`gradeLevelId`}
  											label={<L p={p} t={`Grade Level`}/>}
  											value={transcript.gradeLevelId || ''}
  											options={gradeLevels}
  											className={styles.moreBottomMargin}
  											height={`medium`}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.gradeLevelId}
  											error={errors.gradeLevel}/>
  							</div>
  							<div>
  									<SelectSingleDropDown
  											id={`schoolYearId`}
  											name={`schoolYearId`}
  											label={<L p={p} t={`School year`}/>}
  											value={transcript.schoolYearId || ''}
  											options={schoolYears}
  											className={styles.moreBottomMargin}
  											height={`medium`}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.schoolYearId}
  											error={errors.schoolYear}/>
  							</div>
  							<InputText
  									id={`courseName`}
  									name={`courseName`}
  									size={"medium"}
  									label={<L p={p} t={`Course name`}/>}
  									value={transcript.courseName || ''}
  									onChange={handleChange}
  									required={true}
  									whenFilled={transcript.courseName}
  									error={errors.courseName} />
  							<InputText
  									id={`credits`}
  									name={`credits`}
  									size={"super-short"}
  									numberOnly={true}
  									label={<L p={p} t={`Credits`}/>}
  									value={transcript.credits || ''}
  									onChange={handleChange}
  									required={true}
  									whenFilled={transcript.credits}
  									error={errors.credits} />
  							<div>
  									<SelectSingleDropDown
  											id={`intervalType`}
  											name={`intervalType`}
  											label={<L p={p} t={`Interval type`}/>}
  											value={transcript.intervalType || ''}
  											options={[
  													{id: 'QUARTERS', label: 'Quarters'},
  													{id: 'SEMESTERS', label: 'Semesters'},
  													{id: 'TRIMESTERS', label: 'Trimesters'},
  											]}
  											className={styles.moreBottomMargin}
  											height={`medium`}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.intervalType}
  											error={errors.intervalType}/>
  							</div>
  							{transcript.intervalType &&
  									<InputText
  											id={`firstInterval`}
  											name={`firstInterval`}
  											size={"super-short"}
  											label={<L p={p} t={`First ${transcript.intervalType}`}/>}
  											value={transcript.firstInterval || ''}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.firstInterval}
  											error={errors.firstInterval} />
  							}
  							{transcript.intervalType &&
  									<InputText
  											id={`secondInterval`}
  											name={`secondInterval`}
  											size={"super-short"}
  											label={<L p={p} t={`Second ${transcript.intervalType}`}/>}
  											value={transcript.secondInterval || ''}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.secondInterval}
  											error={errors.secondInterval} />
  							}
  							{(transcript.intervalType === 'QUARTERS' || transcript.intervalType === 'TRIMESTERS') &&
  									<InputText
  											id={`thirdInterval`}
  											name={`thirdInterval`}
  											size={"super-short"}
  											label={<L p={p} t={`Third ${transcript.intervalType}`}/>}
  											value={transcript.thirdInterval || ''}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.thirdInterval}
  											error={errors.thirdInterval} />
  							}
  							{transcript.intervalType === 'QUARTERS' &&
  									<InputText
  											id={`fourthInterval`}
  											name={`fourthInterval`}
  											size={"super-short"}
  											label={<L p={p} t={`Fourth ${transcript.intervalType}`}/>}
  											value={transcript.fourthInterval || ''}
  											onChange={handleChange}
  											required={true}
  											whenFilled={transcript.fourthInterval}
  											error={errors.fourthInterval} />
  							}
  							<InputTextArea
  									label={<L p={p} t={`Note (optional)`}/>}
  									name={'note'}
  									value={transcript.note}
  									onChange={handleChange} />
  							<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
  	                <a className={styles.cancelLink} onClick={() => navigate('/firstNav')}><L p={p} t={`Close`}/></a>
  									<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  									<a className={classes(styles.moreLeft, styles.cancelLink)} onClick={resetAll}><L p={p} t={`Reset`}/></a>
  	            </div>
  							<hr/>
  							{selectedStudent && selectedStudent.label &&
  									<div className={classes(globalStyles.pageTitle, styles.centered, styles.moreBottom)}>
  											<L p={p} t={`Transcripts for {selectedStudent.label}`}/>
  									</div>
  							}
  							<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.transcripts}/>
  							<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Transcript Add`}/>} path={'transcriptAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  							<OneFJefFooter />
  							{isShowingModal_remove &&
  	                <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this record?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to remove this record?`}/>} isConfirmType={true}
  	                   onClick={handleRemove} />
  	            }
  							{isShowingModal_missingInfo &&
  									<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  										 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  							}
  	      	</div>
  	    )
}
export default TranscriptAddView
