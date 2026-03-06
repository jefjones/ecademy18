import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import {apiHost} from '../../api_host'
import styles from './FinanceBillingAddView.css'
const p = 'FinanceBillingAddView'
import L from '../../components/PageLanguage'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import DateTimePicker from '../../components/DateTimePicker'
import RadioGroup from '../../components/RadioGroup'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'

function FinanceBillingAddView(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState(null)
  const [selectedObservers, setSelectedObservers] = useState([])
  const [financeBilling, setFinanceBilling] = useState({
					})
  const [errors, setErrors] = useState({})
  const [isInit, setIsInit] = useState(undefined)
  const [isInitLunchBilling, setIsInitLunchBilling] = useState(undefined)
  const [financeFeeTypeId, setFinanceFeeTypeId] = useState(undefined)
  const [isInitPerson, setIsInitPerson] = useState(undefined)
  const [clearStudent, setClearStudent] = useState(undefined)
  const [financeBillingId, setFinanceBillingId] = useState(undefined)
  const [financeGlcodeId, setFinanceGlcodeId] = useState(undefined)
  const [financeGroupTableId, setFinanceGroupTableId] = useState(undefined)
  const [refundType, setRefundType] = useState(undefined)
  const [financeWaiverScheduleId, setFinanceWaiverScheduleId] = useState(undefined)
  const [financeLowIncomeWaiverId, setFinanceLowIncomeWaiverId] = useState(undefined)
  const [amount, setAmount] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [mandatoryOrOptional, setMandatoryOrOptional] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [clearGuardian, setClearGuardian] = useState(undefined)
  const [clearTeacher, setClearTeacher] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {financeBilling, financeBillingId, students, financeFeeTypeId, paramPersonId} = props
    			
    			if (!isInit && financeBillingId && financeBilling && financeBilling.financeBillingId) {
    					let student = students && students.length > 0 && students.filter(m => m.id === financeBilling.personId)[0]
    					let selectedStudents = [student]
    					setFinanceBilling(financeBilling); setIsInit(true); setSelectedStudents(selectedStudents)
    			} else if (!isInitLunchBilling && financeFeeTypeId && financeFeeTypeId !== guidEmpty) {
    					setIsInitLunchBilling(true); setFinanceBilling({...financeBilling, financeFeeTypeId})
    			} else if (!isInitPerson && paramPersonId && students && students.length > 0) {
    					let paramPerson = students.filter(m => m.id === paramPersonId)[0]
    					if (paramPerson && paramPerson.id) setIsInitPerson(true); setSelectedStudents([paramPerson])
    			}
    	
  }, [])

  const processForm = () => {
    
          const {personId, getFinanceBillings} = props
    			
    			let data = new FormData()
    			data.append('file', selectedFile)
    			let missingInfoMessage = []
    
    			if (!(selectedStudents && selectedStudents.length > 0) && !financeBilling.financeGroupTableId && financeBilling.financeGroupTableId !== guidEmpty) {
    					errors.billedPersonId = <L p={p} t={`A student or group is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`(s) or Group`}/></div>
    			}
    
    			if (!financeBilling.financeFeeTypeId) {
    					errors.financeFeeTypeId = <L p={p} t={`Fee type is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Billing type`}/></div>
    			}
    
    			if (!financeBilling || !financeBilling.amount) {
    					errors.amount = <L p={p} t={`Amount is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Amount`}/></div>
    			}
    
    			if (!financeBilling || !financeBilling.refundType) {
    					errors.refundType = <L p={p} t={`Refund Option is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Refund Option`}/></div>
    			}
    
    			if (!financeBilling || !financeBilling.mandatoryOrOptional) {
    					errors.mandatoryOrOptional = <L p={p} t={`Mandatory or Optional is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Mandatory or Optional`}/></div>
    			}
    
          if (missingInfoMessage && missingInfoMessage.length > 0) {
    					handleMissingInfoOpen(missingInfoMessage)
    					setErrors(errors)
    			} else {
    					let studentIds = selectedStudents && selectedStudents.length > 0 && selectedStudents.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], [])
    					studentIds = studentIds && studentIds.length > 0 ? studentIds.join('^') : 'EMPTY'
    
    					let url = `${apiHost}ebi/financeBilling/${personId}` +
    							`/${financeBilling.financeBillingId || guidEmpty}` +
    							`/${financeBilling.financeFeeTypeId}` +
    							`/${financeBilling.amount}` +
    							`/${studentIds || 'EMPTY'}` +
    							`/${financeBilling.financeGroupTableId || guidEmpty}` +
    							`/${financeBilling.financeGlcodeId || guidEmpty}` +
    							`/${financeBilling.refundType || 'EMPTY'}` +
    							`/${financeBilling.financeWaiverScheduleId || guidEmpty}` +
    							`/${financeBilling.financeLowIncomeWaiverId || guidEmpty}` +
    							`/${financeBilling.courseScheduleId || guidEmpty}` +
    							`/${financeBilling.mandatoryOrOptional}` +
    							`/${financeBilling.dueDate || 'EMPTY'}` +
    							`/${encodeURIComponent(financeBilling.description || 'EMPTY')}`
    
    					axios.post(url, data,
    							{
    								headers: {
    									'Accept': 'application/json',
    									'Content-Type': 'application/json',
    									'Access-Control-Allow-Credentials' : 'true',
    									"Access-Control-Allow-Origin": "*",
    									"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
    									"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
    									"Authorization": "Bearer " + localStorage.getItem("authToken"),
    							}})
    							.then(getFinanceBillings(personId))
    
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The billing entry has been saved.`}/></div>)
    					reset()
          }
      
  }

  const reset = () => {
    
    			setFileUrl(''); setSelectedStudents(null); setClearStudent(true); setFinanceBilling({
    							financeBillingId: '',
    							financeFeeTypeId: '',
    							financeGlcodeId: '',
    							financeGroupTableId: '',
    							refundType: '',
    							financeWaiverScheduleId: '',
    							financeLowIncomeWaiverId: '',
    							amount: '',
    							description: '',
    							mandatoryOrOptional: '',
    					}); setErrors({})
    	
  }

  const resetClearTextValue = () => {
    return setClearStudent(false)
    

  }
  const handleChange = ({target}) => {
    
    			const {financeFeeTypes} = props
    			if (target.name === 'financeGroupTableId') {
    					setFinanceBilling(financeBilling); setSelectedStudents([]); //Blank out the selectedStudents if a financeGroupTableId is chosen
    			} else if (target.name === 'financeFeeTypeId') {
    					let financeFeeType = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.financeFeeTypeId === target.value)[0]
    					if (financeFeeType && financeFeeType.financeFeeTypeId) {
    							if (financeFeeType && financeFeeType.financeGlcodeId !== guidEmpty) financeBilling.financeGlcodeId = financeFeeType.financeGlcodeId
    							if (financeFeeType.financeLowIncomeWaiverId && financeFeeType.financeLowIncomeWaiverId !== guidEmpty) financeBilling.financeLowIncomeWaiverId = financeFeeType.financeLowIncomeWaiverId
    							if (financeFeeType.refundType) financeBilling.refundType = financeFeeType.refundType
    					}
    					setFinanceBilling(financeBilling); setFinanceFeeTypeId('');  //financeFeeTypeId might come from the addLunchBilling call.  Set it to blank so that it doesn't continue to force this list to Lunch.
    			} else {
    					setFinanceBilling(financeBilling)
    			}
    	
  }

  const changeDate = (field, {target}) => {
    
  }

  const handleDeleteOpen = () => {
    return setIsShowingModal_delete(true)
  }

  const handleDeleteClose = () => {
    return setIsShowingModal_delete(false)
  }

  const handleDelete = () => {
    
    			const {removeVolunteerHours, personId, financeBillingId} = props
    			removeVolunteerHours(personId, financeBillingId)
    			handleDeleteClose()
    			navigate('/firstNav')
    	
  }

  const handleImageViewerOpen = (fileUrl) => {
    return setIsShowingModal(true); setFileUrl(fileUrl)
  }

  const handleImageViewerClose = () => {
    return setIsShowingModal(false); setFileUrl('')
  }

  const handleInputFile = (file) => {
    return setSelectedFile(file)
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    

  }
  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    

  }
  const includeSiblings = (event) => {
    
    			const {students} = props
    			
    			let studentPersonId = selectedStudents && selectedStudents.length > 0 && selectedStudents[0].id
    			let student = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]
    			let primaryGuardianPersonId = student && student.primaryGuardianPersonId ? student.primaryGuardianPersonId : ''
    			if (primaryGuardianPersonId) {
    					let selectedStudents = students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === primaryGuardianPersonId)
    					let noSiblingsFound = selectedStudents && selectedStudents.length === 1
    					setSelectedStudents(selectedStudents); setNoSiblingsFound(noSiblingsFound)
    			}
    	
  }

  const handleMandatory = (value) => {
    
          let financeBilling = Object.assign({}, financeBilling)
          financeBilling['mandatoryOrOptional'] = value
          setFinanceBilling(financeBilling)
      
  }

  const handleRadioChoice = (value) => {
    
  }

  const {personId, financeFeeTypes, students, myFrequentPlaces, setMyFrequentPlace, financeGroups, refundOptions, financeGLCodes,
  						financeLowIncomeWaivers} = props
  		
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								{financeBillingId ? <L p={p} t={`Update Billing Entry`}/> : <L p={p} t={`Add New Billing`}/>}
  						</div>
  						<div className={globalStyles.instructionsBigger}>
  								<L p={p} t={`Choose a group or at least one student`}/>
  						</div>
  						<div className={styles.rowWrap}>
  								<div className={styles.row}>
  										<div>
  												<InputDataList
  														label={<L p={p} t={`Student(s)`}/>}
  														name={'students'}
  														options={students}
  														value={selectedStudents}
  														multiple={true}
  														height={`medium`}
                              onChange={handleSelectedStudents}
  														className={styles.moreSpace}
                              clearTextValue={clearStudent}
                              resetClearTextValue={resetClearTextValue}
  														error={errors.studentsOrGroup}/>
  										</div>
  										{selectedStudents && selectedStudents.length === 1 &&
  												<div className={classes(styles.siblingPosition, styles.smallWidth, styles.row, styles.moreRight)}>
  														<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={includeSiblings} addClassName={styles.smallButton}/>
  														<div className={classes(styles.label, styles.labelPosition)}>{noSiblingsFound ? <L p={p} t={`No siblings found`}/> : <L p={p} t={`Include siblings`}/>}</div>
  												</div>
  										}
  								</div>
  								<div className={classes(styles.moreBottom, styles.littleTop)}>
  										<SelectSingleDropDown
  												id={`financeGroupTableId`}
  												name={`financeGroupTableId`}
  												label={<L p={p} t={`or Group`}/>}
  												value={financeBilling.financeGroupTableId || ''}
  												options={financeGroups}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}
  												errors={errors.financeGroupTableId}/>
  								</div>
  						</div>
  						<hr/>
  						<div className={styles.rowWrap}>
  								<div className={styles.moreBottom}>
  										<SelectSingleDropDown
  												id={`financeFeeTypeId`}
  												name={`financeFeeTypeId`}
  												label={<L p={p} t={`Fee type`}/>}
  												value={financeFeeTypeId || financeBilling.financeFeeTypeId || ''}
  												options={financeFeeTypes}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}
  												required={true}
  												whenFilled={financeBilling.financeFeeTypeId}
  												errors={errors.financeFeeTypeId}/>
  								</div>
  								<InputText
  										id={'amount'}
  										name={'amount'}
  										size={'short'}
                      height={'medium'}
  										numberOnly={true}
  										label={<L p={p} t={`Amount`}/>}
  										value={financeBilling.amount || ''}
  										onChange={handleChange}
  										required={true}
  										whenFilled={financeBilling.amount}
  										error={errors.amount}/>
  								<div className={classes(styles.moreTop, styles.moreRight)}>
  										<DateTimePicker label={'Due date (optional)'} id={`dueDate`} value={financeBilling.dueDate} onChange={handleChange}/>
  								</div>
  								<div className={styles.moreRight}>
  										<InputTextArea
  												label={<L p={p} t={`Description`}/>}
  												name={'description'}
  												value={financeBilling.description || ''}
  												autoComplete={'dontdoit'}
  												inputClassName={styles.moreRight}
  												boldText={true}
  												onChange={handleChange}/>
  								</div>
  								<div className={styles.moreSpace}>
  										<InputFile label={'Include a picture'} isCamera={true} onChange={handleInputFile} isResize={true}/>
  								</div>
  								<div className={styles.moreTop}>
  										<RadioGroup
  												label={<L p={p} t={`Refund option`}/>}
  												data={refundOptions}
  												name={`refundType`}
  												horizontal={false}
  												className={styles.radio}
  												initialValue={financeBilling.refundType}
  												onClick={handleRadioChoice}
  												required={true}
  												whenFilled={financeBilling.refundType}
  												error={errors.refundType}/>
  								</div>
  								<div>
  										<SelectSingleDropDown
  												id={`financeGlcodeId`}
  												name={`financeGlcodeId`}
  												label={<L p={p} t={`GL code`}/>}
  												value={financeBilling.financeGlcodeId || ''}
  												options={financeGLCodes}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}/>
  								</div>
  								<div>
  										<SelectSingleDropDown
  												id={`financeLowIncomeWaiverId`}
  												name={`financeLowIncomeWaiverId`}
  												label={<L p={p} t={`Low income waiver`}/>}
  												value={financeBilling.financeLowIncomeWaiverId || ''}
  												options={financeLowIncomeWaivers}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}/>
  								</div>
  								<div className={styles.moreTop}>
  										<RadioGroup
  											label={<L p={p} t={`Is this fee mandatory?`}/>}
  											data={[{ label: 'Mandatory', id: 'Mandatory' }, { label: 'Optional', id: 'Optional' }, ]}
  											name={`answerTrueFalse`}
  											horizontal={true}
  											className={styles.radio}
  											initialValue={financeBilling.mandatoryOrOptional}
  											required={true}
  											whenFilled={financeBilling.mandatoryOrOptional}
  											onClick={handleMandatory}
  											error={errors.mandatoryOrOptional}/>
  								</div>
  						</div>
  						<div className={classes(styles.muchLeft, styles.row)}>
  								<a className={styles.cancelLink} onClick={() => navigate('/financeBillingList')}>Close</a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  						</div>
  						{isShowingModal_delete &&
  								<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this billing record?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this billing record?`}/>} isConfirmType={true}
  									 onClick={handleDelete} />
  						}
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Billing`}/>} path={'financeBillingAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceBillingAddView)
