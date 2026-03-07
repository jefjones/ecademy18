import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import styles from './FinancePaymentAddView.css'
const p = 'FinancePaymentAddView'
import L from '../../components/PageLanguage'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
import {formatNumber} from '../../utils/numberFormat'
import {guidEmpty} from '../../utils/guidValidate'
import Checkbox from '../../components/Checkbox'
import InputTextArea from '../../components/InputTextArea'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import DateMoment from '../../components/DateMoment'
import DateTimePicker from '../../components/DateTimePicker'
import InputText from '../../components/InputText'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import Icon from '../../components/Icon'
import RadioGroup from '../../components/RadioGroup'
import EditTable from '../../components/EditTable'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import checkWithroutingCode from '../../assets/CheckWithRoutingCode.png'
import { withAlert } from 'react-alert'

function FinancePaymentAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [filter, setFilter] = useState({})
  const [financePayment, setFinancePayment] = useState({
              personId: props.accessRoles.learner ? props.personId : '',
          })
  const [personId, setPersonId] = useState(props.accessRoles.learner ? props.personId : '')
  const [studentsAndAmounts, setStudentsAndAmounts] = useState([])
  const [errors, setErrors] = useState({})
  const [isInit, setIsInit] = useState(undefined)
  const [applyFundsTo, setApplyFundsTo] = useState(undefined)
  const [isInitPerson, setIsInitPerson] = useState(undefined)
  const [selectedFinanceBillingIds, setSelectedFinanceBillingIds] = useState(undefined)
  const [billing, setBilling] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [clearStudent, setClearStudent] = useState(undefined)
  const [clearGuardian, setClearGuardian] = useState(undefined)
  const [clearTeacher, setClearTeacher] = useState(undefined)
  const [selectedStudents, setSelectedStudents] = useState(undefined)
  const [selectedFinanceFeeTypes, setSelectedFinanceFeeTypes] = useState(undefined)
  const [noSiblingsFound, setNoSiblingsFound] = useState(undefined)
  const [isShowingModal_description, setIsShowingModal_description] = useState(undefined)
  const [studentName, setStudentName] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [isShowingModal_lackingCredit, setIsShowingModal_lackingCredit] = useState(undefined)
  const [creditBalance, setCreditBalance] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {addNewLunchPayment, paramPersonId, students} = props
    			
    			if (!isInit && addNewLunchPayment === 'addNewLunchPayment') {
    					setIsInit(true); setFinancePayment({...financePayment, applyFundsTo: 'Lunch' })
    			} else if (!isInitPerson && paramPersonId && students && students.length > 0) {
    					let paramPerson = students.filter(m => m.id === paramPersonId)[0]
    					if (paramPerson && paramPerson.id) setIsInitPerson(true); setFinancePayment({...financePayment, personId: paramPerson.id })
    			}
    	
  }, [])

  const processForm = (creditBalance) => {
    
    			let data = new FormData()
    			data.append('file', selectedFile)
    			let missingInfoMessage = []
    
          //Don't allow the credit account to have the payment amount applied if this is a Credit Transfer payment type.
          if (financePayment.applyFundsTo === 'Credit') {
              let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePayment.financePaymentTypeId)[0]
              if (financePaymentType && financePaymentType.financePaymentTypeName && financePaymentType.financePaymentTypeName.length > 0 && financePaymentType.financePaymentTypeName.toLowerCase() === 'credit transfer') {
                  missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please choose 'Appy funds to`}/></div>
              }
          }
    
    			if (accessRoles.admin && !financePayment.personId) {
    					errors.studentOrGroup = <L p={p} t={`Please choose a person who is paying`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Person who is paying`}/></div>
    			}
    
    			if (financePayment.applyFundsTo === 'Billing' && !(selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0)) {
    					errors.studentOrGroup = <L p={p} t={`At least one refund choice is required`}/>
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one refund choice is required`}/></div>
    			}
    
    			if (financePayment && financePayment.financePaymentTypeName && financePayment.financePaymentTypeName === 'Bank Account') {
    					if (!billing.nameOnCardAccount || billing.nameOnCardAccount.length < 6) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Account holder name`}/></div>
    							errors.nameOnCardAccount = <L p={p} t={`An account holder name is required`}/>
    					}
    					if (!billing.routing || billing.routing.length < 6) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Routing code`}/></div>
    							errors.routing = <L p={p} t={`A routing code is required`}/>
    					}
    					if (!billing.bankAccount || billing.bankAccount < 4) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Account number`}/></div>
    							errors.bankAccountNumber = <L p={p} t={`An account number is required`}/>
    					}
    					if (!billing.accountType) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Account type`}/></div>
    							errors.bankAccountType = <L p={p} t={`An account type is required`}/>
    					}
    
    			}
    
    			if (financePayment && financePayment.financePaymentTypeName && (financePayment.financePaymentTypeName === 'Credit Card' || financePayment.financePaymentTypeName === 'Debit Card')) {
    					if (!billing.nameOnCardAccount || billing.nameOnCardAccount.length < 6) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Name on card`}/></div>
    							errors.nameOnCardAccount = <L p={p} t={`A name on card is required`}/>
    					}
    					if (!billing.creditCardNumber || billing.creditCardNumber.length < 15) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Card number`}/></div>
    							errors.cardNumber = <L p={p} t={`A card number is required`}/>
    					}
    					if (!billing.expiration || billing.expiration.length < 4) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`An expiration date is required`}/></div>
    							errors.expiration = <L p={p} t={`An expiration date is required`}/>
    					}
    					if (!billing.securityCode || billing.securityCode.length < 3) {
    							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please enter a security code`}/></div>
    							errors.securityCode = <L p={p} t={`Please enter a security code`}/>
    					}
    			}
    
          if (missingInfoMessage && missingInfoMessage.length > 0) {
    					handleMissingInfoOpen(missingInfoMessage)
    					setErrors(errors)
    			} else {
              const {getFinanceBillings} = props
    					
    					let financePayment = Object.assign({}, financePayment)
    					financePayment.billing = billing
    					financePayment.financeBillingIds = selectedFinanceBillingIds
    					financePayment.studentsAndAmounts = studentsAndAmounts
    					financePayment.personId = accessRoles.admin ? financePayment.personId : personId
              financePayment.fromCreditBalance = creditBalance
              if (financePayment.financePaymentTypeName && financePayment.financePaymentTypeName.toLowerCase() === 'credit transfer' && creditBalance < financePayment.totalAmount) {
                  financePayment.totalAmount = creditBalance
              }
    
    					if (!selectedFile) {
    							addOrUpdateFinancePayment(personId, financePayment, () => getFinanceBillings(personId))
    					} else {
    							let url = `${apiHost}ebi/financePayment/fileUpload/${personId}/${financePayment.financePaymentTableId || guidEmpty}`
    
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
    											if (!financePayment || !financePayment.financePaymentTableId || financePayment.financePaymentTableId === guidEmpty) {
    													financePayment.financePaymentTableId = response.data.financePaymentTableId
    											}
    											addOrUpdateFinancePayment(personId, financePayment, () => getFinanceBillings(personId))
    									})
    					}
    					props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The payment entry has been saved.`}/></div>)
    					reset()
          }
      
  }

  const checkCreditBalanceToPayment = (creditBalance, totalPaymentAmount) => {
    
          const {financePaymentTypes} = props
          
          let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePayment.financePaymentTypeId)[0]
          return financePaymentType && financePaymentType.financePaymentTypeName && financePaymentType.financePaymentTypeName.length > 0
                && financePaymentType.financePaymentTypeName.toLowerCase() === 'credit transfer'
                && creditBalance < totalPaymentAmount
                    ? true
                    : false
      
  }

  const reset = () => {
    
    			setFileUrl(''); setFilter({}); setStudentsAndAmounts([]); setSelectedFinanceBillingIds([]); setFinancePayment({
                  personId: props.accessRoles.learner ? props.personId : '',
              }); setBilling({}); setErrors({}); setSelectedFile('')
    	
  }

  const handleFilter = ({target}) => {
    
    			let field = target.name
    			filter[field] = target.value
    			setFilter(filter)
    	
  }

  const handleChange = ({target}) => {
    
    			let field = target.name
    			if (field === 'studentPersonId' || field === 'guardianPersonId') {
    					financePayment['personId'] = target.value
    			} else {
    					financePayment[field] = target.value
    			}
    			if (field === 'financePaymentTypeId') {
    					const {financePaymentTypes} = props
    					let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePayment[field])[0]
    					if (financePaymentType && financePaymentType.financePaymentTypeId) financePayment['financePaymentTypeName'] = financePaymentType.name
    			}
    			setFinancePayment(financePayment)
    	
  }

  const changeDate = (field, {target}) => {
    
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
  const resetClearTextValue = () => {
    
    			setClearStudent(false); setClearGuardian(false); setClearTeacher(false)
    	
  }

  const handleSelectedFinanceFeeTypes = (selectedFinanceFeeTypes) => {
    return setFilter({...filter, selectedFinanceFeeTypes })
  }

  const includeSiblings = (event) => {
    
    			const {students} = props
    			
    			let studentPersonId = filter.selectedStudents && filter.selectedStudents.length > 0 && filter.selectedStudents[0].id
    			let student = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]
    			let primaryGuardianPersonId = student && student.primaryGuardianPersonId ? student.primaryGuardianPersonId : ''
    			if (primaryGuardianPersonId) {
    					let selectedStudents = students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === primaryGuardianPersonId)
    					let noSiblingsFound = selectedStudents && selectedStudents.length === 1
    					setFilter({...filter, selectedStudents, noSiblingsFound })
    			}
    	
  }

  const getSelectedBilling = (financeBillingId) => {
    
    			
    			return (selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0 && selectedFinanceBillingIds.indexOf(financeBillingId) > -1) || ''
    	
  }

  const toggleSelectedBilling = (financeBillingId) => {
    
    			const {financeBillings} = props
    			if (selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0 && selectedFinanceBillingIds.indexOf(financeBillingId) > -1) {
    					selectedFinanceBillingIds = selectedFinanceBillingIds.filter(id => id !== financeBillingId)
    			} else {
    					selectedFinanceBillingIds = selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0
    							? selectedFinanceBillingIds.concat(financeBillingId)
    							: [financeBillingId]
    			}
    			let totalAmount = 0
    			selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0 && selectedFinanceBillingIds.forEach(id => {
    					let financeBilling = financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.financeBillingId === id)[0]
    					if (financeBilling && financeBilling.amount) totalAmount += isNaN(financeBilling.amount) ? 0 : financeBilling.amount*1
    			})
    			setFinancePayment({...financePayment, totalAmount}); setSelectedFinanceBillingIds(selectedFinanceBillingIds)
    	
  }

  const chooseRecord = (financeBillingId) => {
    return setFinanceBillingId(financeBillingId)
  }

  const handleApplyFundsTo = (applyFundsTo) => {
    return setFinancePayment({...financePayment, applyFundsTo })
  }

  const handleMandatory = (value) => {
    
          let newState = Object.assign({}, state)
          newState['mandatoryOrOptional'] = value
          setState(newState)
      
  }

  const handleRadioCheckAccount = (field, value) => {
    
    			billing.check = {...billing.check, [field]: value }
    			setBilling(billing)
    	
  }

  const changeCreditCard = ({target}) => {
    
    			let creditcard = billing.creditcard || {}
    			creditcard[target.name] = target.value
    			setBilling({...billing, creditcard })
    	
  }

  const changeBankAccount = ({target}) => {
    
    			let check = billing.check || {}
    			check[target.name] = target.value
    			setBilling({...billing, check })
    	
  }

  const handleCreditAmount = (studentPersonId, {target}) => {
    
    			let found = false
    			if (studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.indexOf(studentPersonId) > -1) found = true
    			studentsAndAmounts = studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.map(m => {
    					if (m.id === studentPersonId) {
    							m.sum = target.value
    							found = true
    					}
    					return m
    			})
    			if (!found) {
    					let option = {
    						id: studentPersonId,
    						sum: target.value
    					}
    					studentsAndAmounts = studentsAndAmounts && studentsAndAmounts.length > 0 ? studentsAndAmounts.concat(option) : [option]
    			}
    			let totalAmount = 0
    			studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.forEach(m => {
    					totalAmount += isNaN(m.sum) ? 0 : m.sum*1
    			})
    			setFinancePayment({...financePayment, totalAmount}); setStudentsAndAmounts(studentsAndAmounts)
    	
  }

  const getStudentAmount = (studentPersonId) => {
    
    			
    			let studentsAndAmount = studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.filter(m => m.id === studentPersonId)[0]
    			return studentsAndAmount && studentsAndAmount.sum ? studentsAndAmount.sum : ''
    	
  }

  const handleDescriptionOpen = (studentName, description) => {
    return setIsShowingModal_description(true); setStudentName(studentName); setDescription(description)
  }

  const handleDescriptionClose = () => {
    return setIsShowingModal_description(false); setStudentName(''); setDescription('')
  }

  const handleCreditLackingBalanceOpen = (creditBalance) => {
    return setIsShowingModal_lackingCredit(true); setCreditBalance(creditBalance)

  }
  const handleCreditLackingBalanceClose = () => {
    return setIsShowingModal_lackingCredit(false); setCreditBalance('')

  }
  const handleCreditLackingBalance = () => {
    
          
          processForm(creditBalance)
          handleCreditLackingBalanceClose()
      
  }

  const {students, myFrequentPlaces, setMyFrequentPlace, financeBillings, fetchingRecord, financeFeeTypes, financePaymentTypes,
  							accessRoles, guardians, financeAccountSummaries} = props
  
  			let filteredBillings = financeBillings; // && financeBillings.length > 0 && financeBillings.filter(m => m.isPaid);
  
  			if (filter.partialNameText) {
  					let cutBackTextFilter = filter.partialNameText.toLowerCase()
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.billedPersonName && m.billedPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1))
  			}
  
  			if (filter.selectedStudents && filter.selectedStudents.length > 0) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => {
  							let found = false
  							filter.selectedStudents.forEach(s => {
  									if (s.id === m.personId) found = true
  							})
  							return found
  					})
  			}
  
  			if (filter.selectedFinanceFeeTypes && filter.selectedFinanceFeeTypes.length > 0) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => {
  							let found = false
  							filter.selectedFinanceFeeTypes.forEach(s => {
  									if (s.id === m.financeFeeTypeId) found = true
  							})
  							return found
  					})
  			}
  
  			if (fromDate && toDate) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (fromDate) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (toDate) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			}
  
  			filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.map((m, i) => {
  					m.icons = <div className={classes(globalStyles.cellText, styles.moreTop)}>
  												<Checkbox
  														id={`billing${m.financeBillingId}`}
  														name={`billing${m.financeBillingId}`}
  														label={''}
  														checked={getSelectedBilling(m.financeBillingId)}
  														onClick={() => toggleSelectedBilling(m.financeBillingId)}/>
  										</div>
  
  					m.fee = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  											{m.financeFeeTypeName}
  									 </div>
  					m.name = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  											{m.billedPersonName}
  									 </div>
  					m.billingAmount = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{`$${formatNumber(m.amount, true, false, 2)}`}
  														 </div>
  				 m.files = <div className={classes(globalStyles.cellText, styles.row, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))}>
  												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  														<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
  												)}
  									 </div>
  				 m.glcodeName = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  														{m.financeGlcodeName}
  												</div>
  				 m.refund = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  												{m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}
  										</div>
  				 m.lowIncomeWaiverName = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{m.financeLowIncomeWaiverName}
  														 </div>
  				 m.mandatory = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{m.mandatoryOrOptional}
  														 </div>
  				 m.due = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																<DateMoment date={m.dueDate}/>
  														 </div>
  					m.group = <div onClick={() => chooseRecord(m.financeBillingId)} className={classes(globalStyles.cellText, styles.link, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))}>
  												{m.financeGroupTableName}
  										</div>
  					m.desc = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.billedPersonName, m.description); chooseRecord(m.financeBillingId);}}>
  												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
  										</div>
  					m.entry = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  												<DateMoment date={m.entryDate}/>
  										</div>
  					m.entryPerson = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  															{m.entryPersonName}
  													</div>
  
  					return m
  			})
  
  			let columns = [
  				{
  					width: 60,
  					label: '',
  					dataKey: 'icons',
  				},
  				{
  					width: 120,
  					label: <L p={p} t={`Fee`}/>,
  					dataKey: 'fee',
  				},
  				{
  					width: 160,
  					label: <L p={p} t={`Name`}/>,
  					dataKey: 'name',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`Amount`}/>,
  					dataKey: 'billingAmount',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`File(s)`}/>,
  					dataKey: 'files',
  				},
  				{
  					width: 100,
  					label: <L p={p} t={`GL code`}/>,
  					dataKey: 'glcodeName',
  				},
  				{
  					width: 120,
  					label: <L p={p} t={`Refund type`}/>,
  					dataKey: 'refund',
  				},
  				{
  					width: 120,
  					label: <L p={p} t={`Income waiver`}/>,
  					dataKey: 'lowIncomeWaiverName',
  				},
  				{
  					width: 80,
  					label: <L p={p} t={`Mandatory?`}/>,
  					dataKey: 'mandatory',
  				},
  				{
  					width: 100,
  					label: <L p={p} t={`Due date`}/>,
  					dataKey: 'due',
  				},
  				{
  					width: 100,
  					label: <L p={p} t={`Group`}/>,
  					dataKey: 'group',
  				},
  				{
  					width: 320,
  					label: <L p={p} t={`Description`}/>,
  					dataKey: 'desc',
  				},
  				{
  					width: 100,
  					label: <L p={p} t={`Entry date`}/>,
  					dataKey: 'entry',
  				},
  				{
  					width: 120,
  					label: <L p={p} t={`Entered by`}/>,
  					dataKey: 'entryPerson',
  				}
  		]
  
      //Credit payments
      //Only show the CreditTransfer optin in the Payment Type list if the student chosen (not the parent) has a credit balance to apply . And show that credit balance.
      let financePaymentTypesLocal = Object.assign([], financePaymentTypes)
      let accountSummary = financePayment.personId && financeAccountSummaries && financeAccountSummaries.length > 0 && financeAccountSummaries.filter(m => m.personId === financePayment.personId)[0]
      if (accountSummary && accountSummary.creditAccount) creditBalance = accountSummary.creditAccount
      if (!creditBalance) financePaymentTypesLocal = financePaymentTypesLocal && financePaymentTypesLocal.length > 0 && financePaymentTypesLocal.filter(m => m.label.toLowerCase() !== 'credit transfer')
  
      //ApllyFundsTo option should not show the credit account option if the Credit Transfer is chosen.  That is a transfer option in the transfer view.  Puls we wouldn't want someone to transfer credits to thei rown account and increase it with their own credit.
      let applyFundsToLocal = [
          { label: 'Billing', id: 'Billing' },
          { label: 'Lunch account', id: 'Lunch' },
      ]
      let financePaymentType = financePaymentTypesLocal && financePaymentTypesLocal.length > 0 && financePaymentTypesLocal.filter(m => m.financePaymentTypeId === financePayment.financePaymentTypeId)[0]
      if (!(financePaymentType && financePaymentType.name.toLowerCase() === 'credit transfer')) applyFundsToLocal = applyFundsToLocal.concat({ label: 'Credit account', id: 'Credit' })
  
  		let headings = [{label: <L p={p} t={`Student`}/>},{label: <L p={p} t={`Grade level`}/>}, {label: <L p={p} t={`Amount`}/>}]
  
  		let data = filter.selectedStudents && filter.selectedStudents.length > 0 && filter.selectedStudents.map((m, i) =>
  				[
  						{ value: m.label},
  						{ value: m.gradeLevelName},
  						{ value: <InputText
  													id={`amount${m.id}`}
  													name={`amount${m.id}`}
  													size={"short"}
  													numberOnly={true}
  													label={``}
  													//value={getFinanceCreditAmount(m.id)}
  													value={getStudentAmount(m.id) || ''}
  													onChange={(event) => handleCreditAmount(m.id, event)}/>
  						},
  				]
  		)
  
  		data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}><L p={p} t={`Please choose at least one student`}/></div>, colSpan: 4}]]
  
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Add New Payment`}/>
  						</div>
  						{(accessRoles.admin || accessRoles.frontDesk || accessRoles.observer) &&
  								<div className={classes(styles.rowWrap, styles.moreBottom)}>
  										<div>
  												<SelectSingleDropDown
  														id={`studentPersonId`}
  														name={`studentPersonId`}
  														label={<L p={p} t={`Paid by student`}/>}
  														height={'medium'}
  														value={financePayment.personId || ''}
  														options={students}
  														onChange={handleChange}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`guardianPersonId`}
  														name={`guardianPersonId`}
  														label={<L p={p} t={`Paid by guardian/parent`}/>}
  														height={'medium'}
  														value={financePayment.personId || ''}
  														options={guardians}
  														onChange={handleChange}/>
  										</div>
  								</div>
  						}
  						<RadioGroup
  								label={<L p={p} t={`Apply funds to:`}/>}
  								data={applyFundsToLocal}
  								name={`applyFundsTo`}
  								horizontal={true}
  								className={styles.radio}
  								initialValue={financePayment.applyFundsTo || ''}
                  required={true}
                  whenFilled={financePayment.applyFundsTo}
  								onClick={handleApplyFundsTo}/>
              <div className={styles.row}>
      						<div>
      								<SelectSingleDropDown
      										id={`financePaymentTypeId`}
      										name={`financePaymentTypeId`}
      										label={<L p={p} t={`Payment type`}/>}
      										height={'medium'}
      										value={financePayment.financePaymentTypeId || ''}
      										options={financePaymentTypesLocal}
                          required={true}
                          whenFilled={financePayment.financePaymentTypeId}
      										onChange={handleChange}/>
      						</div>
                  {creditBalance ? <div className={classes(styles.muchTop, styles.moreLeft, styles.text)}>{`Credit balance: $${formatNumber(creditBalance, true, false, 2)}`}</div> : ''}
              </div>
  						{financePayment.financePaymentTypeName && (financePayment.financePaymentTypeName === 'Credit Card' || financePayment.financePaymentTypeName === 'Debit Card') &&
  								<div>
  										<hr/>
  										<InputText
  												id={`nameOnCardAccount`}
  												name={`nameOnCardAccount`}
  												size={"medium"}
  												label={<L p={p} t={`Name on card`}/>}
  												value={(billing.nameOnCardAccount) || ''}
  												onChange={changeCreditCard}
  												onEnterKey={handleEnterKey}
  												autoComplete={'dontdoit'}
  												required={true}
  												whenFilled={billing.creditcard && billing.creditcard.cardholder}
  												error={errors.nameOnCardAccount}/>
  										<InputText
  												id={`number`}
  												name={`number`}
  												size={"medium"}
  												label={<L p={p} t={`Card number`}/>}
  												value={(billing.creditCardNumber) || ''}
  												onChange={changeCreditCard}
  												onEnterKey={handleEnterKey}
  												autoComplete={'dontdoit'}
  												required={true}
  												whenFilled={billing.creditcard && billing.creditcard.number}
  												error={errors.cardNumber}/>
  										<InputText
  												id={`expiration`}
  												name={`expiration`}
  												size={"short"}
  												label={<L p={p} t={`Expiration`}/>}
  												value={(billing.expiration) || ''}
  												onChange={changeCreditCard}
  												onEnterKey={handleEnterKey}
  												autoComplete={'dontdoit'}
  												required={true}
  												whenFilled={billing.creditcard && billing.creditcard.expiration}
  												error={errors.expiration}/>
  										<InputText
  												id={`cvv`}
  												name={`cvv`}
  												size={"super-short"}
  												numberOnly={true}
  												label={<L p={p} t={`Security code`}/>}
  												value={(billing.securityCode) || ''}
  												onChange={changeCreditCard}
  												onEnterKey={handleEnterKey}
  												autoComplete={'dontdoit'}
  												required={true}
  												whenFilled={billing.creditcard && billing.creditcard.cvv}
  												error={errors.securityCode}/>
  										<hr/>
  								</div>
  						}
  						{financePayment.financePaymentTypeName && financePayment.financePaymentTypeName === 'Bank Account' &&
  								<div>
  										<hr/>
  										<div>
  												{(accessRoles.learner || accessRoles.observer) &&
  														<img className={styles.checkWithroutingCode} src={checkWithroutingCode} alt="Check example with routing code"/>
  												}
  												<InputText
  														id={`nameOnCardAccount`}
  														name={`nameOnCardAccount`}
  														size={"medium"}
  														label={<L p={p} t={`Account holder's name`}/>}
  														value={(billing.nameOnCardAccount) || ''}
  														onChange={changeBankAccount}
  														onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={billing.check && billing.check.accountholder}
  														error={errors.nameOnCardAccount}/>
  												<InputText
  														id={`routing`}
  														name={`routing`}
  														size={"medium"}
  														label={<L p={p} t={`Routing`}/>}
  														value={(billing.routing) || ''}
  														onChange={changeBankAccount}
  														onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={billing.check && billing.check.routing}
  														error={errors.routing}/>
  												<InputText
  														id={`bankAccount`}
  														name={`bankAccount`}
  														size={"medium"}
  														label={<L p={p} t={`Bank account`}/>}
  														value={(billing.bankAccount) || ''}
  														onChange={changeBankAccount}
  														onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={billing.check && billing.check.account}
  														error={errors.bankAccountNumber}/>
  												<RadioGroup
  														data={[{ label: "Checking", id: "checking" }, { label: "Savings", id: "savings" }, ]}
  														name={`accountType`}
  														label={<L p={p} t={`Account type`}/>}
  														horizontal={true}
  														initialValue={(billing.accountType) || ''}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={billing.check && billing.check.accountType}
  														onClick={(value) => handleRadioCheckAccount('accountType', value)}/>
  												<span className={styles.error}>{errors.bankAccountType}</span>
  										</div>
  										<hr/>
  								</div>
  						}
  						<div className={styles.rowWrap}>
  								<div className={styles.moreRight}>
  										<InputTextArea
  												label={<L p={p} t={`Description`}/>}
  												name={'description'}
  												value={financePayment.description || ''}
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
  								<a className={styles.cancelLink} onClick={() => navigate('/financePaymentList')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={() => {checkCreditBalanceToPayment(creditBalance, financePayment.totalAmount) ? handleCreditLackingBalanceOpen(creditBalance) : processForm(creditBalance)}}/>
  								{financePayment.totalAmount && <div className={classes(styles.totalAmount, styles.row)}><L p={p} t={`Total: $`}/>{formatNumber(financePayment.totalAmount, true, false, 2)}</div>}
  						</div>
  						<hr/>
              {(accessRoles.admin || accessRoles.frontDesk || accessRoles.observer) &&
      						<div className={styles.rowWrap}>
      								<div className={styles.filterLabel}>Filters:</div>
      								<div>
      										<InputDataList
      												label={<L p={p} t={`Student(s)`}/>}
      												name={'students'}
      												options={students}
      												value={filter.selectedStudents}
      												multiple={true}
      												height={`medium`}
      												className={styles.moreSpace}
      												onChange={handleSelectedStudents}
      												error={errors.studentsOrGroup}/>
      								</div>
      								{financePayment.applyFundsTo === 'Billing' &&
      										<div className={styles.rowWrap}>
      												<div className={styles.littleTop}>
      														<InputText
      																id={"partialNameText"}
      																name={"partialNameText"}
      																size={"medium"}
      																label={<L p={p} t={`Text search`}/>}
      																value={filter.partialNameText || ''}
      																onChange={handleFilter}/>
      												</div>
      												<div>
      														<InputDataList
      																label={<L p={p} t={`Fee type(s)`}/>}
      																id={'financeFeeTypes'}
      																name={'financeFeeTypes'}
      																options={financeFeeTypes}
      																value={filter.selectedFinanceFeeTypes || []}
      																multiple={true}
      																height={`medium`}
      																className={styles.moreSpace}
      																onChange={handleSelectedFinanceFeeTypes}/>
      												</div>
      												{filter.selectedStudents && filter.selectedStudents.length === 1 &&
      														<div className={classes(styles.siblingPosition, styles.smallWidth, styles.row, styles.moreRight)}>
      																<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={includeSiblings} addClassName={styles.smallButton}/>
      																<div className={classes(styles.label, styles.labelPosition)}>{filter.noSiblingsFound ? <L p={p} t={`No siblings found`}/> : <L p={p} t={`Include siblings`}/>}</div>
      														</div>
      												}
      												<div className={classes(styles.moreRight, styles.row, styles.dateRow)}>
      														<div className={styles.moreRight}>
      																<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={filter.fromDate} maxDate={filter.toDate}
      																		onChange={(event) => changeDate('fromDate', event)}/>
      														</div>
      														<div className={styles.muchRight}>
      																<DateTimePicker id={`toDate`} value={filter.toDate} label={<L p={p} t={`To date`}/>} minDate={filter.fromDate ? filter.fromDate : ''}
      																		onChange={(event) => changeDate('toDate', event)}/>
      														</div>
      												</div>
      												<div className={styles.moreTop}>
      														<RadioGroup
      															label={<L p={p} t={`Is this fee mandatory?`}/>}
      															data={[{ label: 'Mandatory', id: 'Mandatory' }, { label: 'Optional', id: 'Optional' }, ]}
      															name={`answerTrueFalse`}
      															horizontal={true}
      															className={styles.radio}
      															initialValue={mandatoryOrOptional}
      															onClick={handleMandatory}/>
      												</div>
      										</div>
      								}
      						</div>
              }
  						<hr/>
  						{(financePayment.applyFundsTo === 'Lunch' || financePayment.applyFundsTo === 'Credit') &&
  								<EditTable headings={headings} data={data} />
  						}
  						{financePayment.applyFundsTo === 'Billing' &&
  								<div className={styles.widthStop}>
  										<Loading isLoading={fetchingRecord.financeBillings} />
  										<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
  												<TableVirtualFast rowCount={(filteredBillings && filteredBillings.length) || 0}
  														rowGetter={({ index }) => (filteredBillings && filteredBillings.length > 0 && filteredBillings[index]) || ''}
  														columns={columns} />
  										</Paper>
  								</div>
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
  						{isShowingModal_description &&
  								<MessageModal handleClose={handleDescriptionClose} heading={studentName} explain={description} onClick={handleDescriptionClose} />
  						}
              {isShowingModal_lackingCredit &&
  								<MessageModal handleClose={handleCreditLackingBalanceClose} heading={<L p={p} t={`Credit Balance less then Payment Total`}/>} isConfirmType={true}
                      explainJSX={<L p={p} t={`The credit balance for this Credit Transfer is less than the total payment amount.  Do you want the credit amount to be applied as much as possible and then return to this page again to pay the rest with another payment method?`}/>}
                      onClick={handleCreditLackingBalance} />
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Payment`}/>} path={'financePaymentAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinancePaymentAddView)
