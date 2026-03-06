import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import {apiHost} from '../../api_host'
import styles from './FinanceTransferAddView.css'
const p = 'FinanceTransferAddView'
import L from '../../components/PageLanguage'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
import formatNumber from '../../utils/numberFormat'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import Checkbox from '../../components/Checkbox'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'

function FinanceTransferAddView(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedObservers, setSelectedObservers] = useState([])
  const [fromPersonId, setFromPersonId] = useState(props.fromPersonId)
  const [toPersonId, setToPersonId] = useState(props.toPersonId)
  const [errors, setErrors] = useState({})
  const [isInit, setIsInit] = useState(undefined)
  const [financeTransferId, setFinanceTransferId] = useState(undefined)
  const [fromAccountType, setFromAccountType] = useState(undefined)
  const [toAccountType, setToAccountType] = useState(undefined)
  const [amount, setAmount] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [clearStudent, setClearStudent] = useState(undefined)
  const [clearGuardian, setClearGuardian] = useState(undefined)
  const [clearTeacher, setClearTeacher] = useState(undefined)
  const [fromAmount, setFromAmount] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {fromPersonId, toPersonId, financeAccountSummaries} = props
    			
    			if (!isInit && fromPersonId && financeAccountSummaries && financeAccountSummaries.length > 0) { //don't check for toPersonId since that one can be blank.
    					handleChange(null, 'fromPersonId', fromPersonId)
    					toPersonId && handleChange(null, 'toPersonId', toPersonId)
    					setIsInit(true)
    			}
    	
  }, [])

  const processForm = () => {
    
          const {personId, addFinanceTransfer, getFinanceAccountSummaries} = props
    			
    			let financeTransferId = financeTransferId
    			let errors = Object.assign({}, errors)
    			let data = new FormData()
    			data.append('file', selectedFile)
    			let missingInfoMessage = []
    
    			if (!fromPersonId && fromPersonId !== guidEmpty) {
    					errors.fromPersonId = <L p={p} t={`A From person is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From person`}/></div>
    			}
    
    			if (!toPersonId && toPersonId !== guidEmpty) {
    					errors.toPersonId = <L p={p} t={`A To person is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To person`}/></div>
    			}
    
    			if (!fromAccountType) {
    					errors.fromAccountType = <L p={p} t={`A From Account Type is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From Account Type`}/></div>
    			}
    
    			if (!toAccountType) {
    					errors.toAccountType = <L p={p} t={`A From Account Type is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From Account Type`}/></div>
    			}
    
    			if (!amount) {
    					errors.amount = <L p={p} t={`An amount is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Amount`}/></div>
    			}
    
    			if (amount > fromAmount) {
    					errors.fromAmount = <L p={p} t={`The entry amount is more than the 'from' account chosen.`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Entry amount is too much`}/></div>
    			}
    
          if (missingInfoMessage && missingInfoMessage.length > 0) {
    					handleMissingInfoOpen(missingInfoMessage)
    					setErrors(errors)
    			} else if (!selectedFile) {
    					let financeTransfer = {
    							financeTransferId,
    							fromPersonId,
    							toPersonId,
    							fromAccountType,
    							toAccountType,
    							amount,
    							description,
    					}
    					addFinanceTransfer(personId, financeTransfer)
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The transfer entry has been saved.`}/></div>)
    					reset()
    					getFinanceAccountSummaries(personId)
    			} else {
    
    					let url = `${apiHost}ebi/financeTransfer/fileUpload/${personId}/${financeTransferId || guidEmpty}`
    
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
    							.catch(function (error) {
    								//Show error here.
    							})
    							.then(response => {
    									if (!financeTransferId || financeTransferId === guidEmpty) {
    											financeTransferId = response.data.financeTransferId
    									}
    									let financeTransfer = {
    											financeTransferId,
    											fromPersonId,
    											toPersonId,
    											fromAccountType,
    											toAccountType,
    											amount,
    											description,
    									}
    									addFinanceTransfer(personId, financeTransfer)
    									props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The transfer entry has been saved.`}/></div>)
    									reset()
    									getFinanceAccountSummaries(personId)
    							})
          }
      
  }

  const reset = () => {
    
    			setFileUrl(''); setSelectedStudents([]); setFinanceTransferId(guidEmpty); setFromPersonId(''); setToPersonId(''); setFromAccountType(''); setToAccountType(''); setAmount(''); setDescription(''); setErrors({})
    	
  }

  const handleChange = (event, incomingField, incomingValue) => {
    
    			const {financeAccountSummaries} = props
    			let newState = Object.assign({}, state)
    			let field = incomingField ? incomingField : event.target.name
    			let value = incomingValue ? incomingValue : event.target.value
    			newState[field] = value
    			if (field === 'fromPersonId') {
    					let summary = financeAccountSummaries.filter(m => m.personId === value)[0]
    					if (summary && summary.personId) {
    							newState.fromLunchAmount = summary.lunchAccount
    							newState.fromCreditAmount = summary.creditAccount
    					}
    			} else if (field === 'toPersonId') {
    					let summary = financeAccountSummaries.filter(m => m.personId === value)[0]
    					if (summary && summary.personId) {
    							newState.toLunchAmount = summary.lunchAccount
    							newState.toCreditAmount = summary.creditAccount
    					}
    			}
    
    			setState(newState)
    	
  }

  const changeDate = (field, {target}) => {
    
    			let newState = Object.assign({}, state)
    			newState[field] = target.value
    			setState(newState)
    	
  }

  const handleDeleteOpen = () => {
    return setIsShowingModal_delete(true)
  }

  const handleDeleteClose = () => {
    return setIsShowingModal_delete(false)
  }

  const handleDelete = () => {
    
    			const {removeFinanceTransfer, personId, financeTransferId} = props
    			removeFinanceTransfer(personId, financeTransferId)
    			handleDeleteClose()
    			navigate('/firstNav')
    	
  }

  const handleImageViewerOpen = (fileUrl) => {
    return setIsShowingModal(true); setFileUrl(fileUrl)
  }

  const handleImageViewerClose = () => {
    return setIsShowingModal(false); setFileUrl('')
    	handleInputFile = (file) => setSelectedFile(file)
  }

  const handleInputFile = (file) => {
    return setSelectedFile(file)
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    	handleMissingInfoClose = () => setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	resetClearTextValue = () => {
    			setClearStudent(false); setClearGuardian(false); setClearTeacher(false)
  }

  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    	resetClearTextValue = () => {
    			setClearStudent(false); setClearGuardian(false); setClearTeacher(false)
  }

  const resetClearTextValue = () => {
    
    			setClearStudent(false); setClearGuardian(false); setClearTeacher(false)
    	
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

  const {personId, financeAccountSummaries, myFrequentPlaces, setMyFrequentPlace} = props
  		
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Add New Transfer`}/>
  						</div>
  						<div className={styles.rowWrap}>
  								<div className={styles.boldLabel}>FROM:</div>
  								<div className={classes(styles.moreBottom, styles.littleTop)}>
  										<SelectSingleDropDown
  												id={`fromPersonId`}
  												name={`fromPersonId`}
  												label={<L p={p} t={`Student`}/>}
  												value={fromPersonId || ''}
  												options={financeAccountSummaries}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}
  												required={true}
  												whenFilled={fromPersonId}
  												errors={errors.fromPersonId}/>
  								</div>
  								{fromPersonId && fromPersonId !== guidEmpty &&
  										<div className={styles.checkbox}>
  												<Checkbox
  														id={'fromLunchAccount'}
  														label={<div className={styles.row}>
  																			<div className={styles.label}><L p={p} t={`Lunch:`}/></div>
  																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(fromLunchAmount, true, false, 2)}`}</div>
  																	 </div>
  														}
  														labelClass={styles.checkboxLabel}
  														checked={fromAccountType === 'LUNCH' || false}
  														onClick={() => setFromAccountType('LUNCH'); setAmount(fromLunchAmount); setFromAmount(fromLunchAmount)}
  														className={styles.button}/>
  										</div>
  								}
  								{fromPersonId && fromPersonId !== guidEmpty &&
  										<div className={styles.checkbox}>
  												<Checkbox
  														id={'fromCreditAccount'}
  														label={<div className={styles.row}>
  																			<div className={styles.label}><L p={p} t={`Credit:`}/></div>
  																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(fromCreditAmount, true, false, 2)}`}</div>
  																	 </div>
  														}
  														labelClass={styles.checkboxLabel}
  														checked={fromAccountType === 'CREDIT' || false}
  														onClick={() => setFromAccountType('CREDIT'); setAmount(fromCreditAmount); setFromAmount(fromCreditAmount)}
  														className={styles.button}/>
  										</div>
  								}
  						</div>
  						<hr/>
  						<div className={classes(styles.rowWrap, styles.sectionLeft)}>
  								<div className={styles.boldLabel}>TO:</div>
  								<div className={classes(styles.moreBottom, styles.littleTop)}>
  										<SelectSingleDropDown
  												id={`toPersonId`}
  												name={`toPersonId`}
  												label={<L p={p} t={`Student`}/>}
  												value={toPersonId || ''}
  												options={financeAccountSummaries}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}
  												required={true}
  												whenFilled={toPersonId}
  												errors={errors.toPersonId}/>
  								</div>
  								{toPersonId && toPersonId !== guidEmpty &&
  										<div className={styles.checkbox}>
  												<Checkbox
  														id={'toLunchAccount'}
  														label={<div className={styles.row}>
  																			<div className={styles.label}><L p={p} t={`Lunch:`}/></div>
  																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(toLunchAmount, true, false, 2)}`}</div>
  																	 </div>
  														}
  														labelClass={styles.checkboxLabel}
  														checked={toAccountType === 'LUNCH' || false}
  														onClick={() => setToAccountType('LUNCH')}
  														className={styles.button}/>
  										</div>
  								}
  								{toPersonId && toPersonId !== guidEmpty &&
  										<div className={styles.checkbox}>
  												<Checkbox
  														id={'toCreditAccount'}
  														label={<div className={styles.row}>
  																			<div className={styles.label}><L p={p} t={`Credit:`}/></div>
  																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(toCreditAmount, true, false, 2)}`}</div>
  																	 </div>
  														}
  														labelClass={styles.checkboxLabel}
  														checked={toAccountType === 'CREDIT' || false}
  														onClick={() => setToAccountType('CREDIT')}
  														className={styles.button}/>
  										</div>
  								}
  						</div>
  						<div className={styles.rowWrap}>
  								<InputText
  										label={<L p={p} t={`Amount`}/>}
  										id={`amount`}
  										name={`amount`}
  										size={"short"}
  										numberOnly={true}
  										value={amount || ''}
  										onChange={handleChange}/>
  								<div className={styles.moreRight}>
  										<InputTextArea
  												label={<L p={p} t={`Description`}/>}
  												name={'description'}
  												value={description || ''}
  												autoComplete={'dontdoit'}
  												inputClassName={styles.moreRight}
  												boldText={true}
  												onChange={handleChange}/>
  								</div>
  								<div className={styles.moreSpace}>
  										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={handleInputFile} isResize={true}/>
  								</div>
  						</div>
  						<div className={classes(styles.muchLeft, styles.row)}>
  								<a className={styles.cancelLink} onClick={() => navigate('/financeTransferList')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  						</div>
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Transfer`}/>} path={'financeTransferAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceTransferAddView)
