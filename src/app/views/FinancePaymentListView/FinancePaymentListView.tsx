import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FinancePaymentListView.css'
const p = 'FinancePaymentListView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import {formatNumber} from '../../utils/numberFormat'
import TextDisplay from '../../components/TextDisplay'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import DateMoment from '../../components/DateMoment'
import DateTimePicker from '../../components/DateTimePicker'
import InputText from '../../components/InputText'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import Icon from '../../components/Icon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import { withAlert } from 'react-alert'

function FinancePaymentListView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([])
  const [financePayment, setFinancePayment] = useState({})
  const [errors, setErrors] = useState({})
  const [isInit, setIsInit] = useState(true)
  const [selectedFile, setSelectedFile] = useState(file)
  const [clearStudent, setClearStudent] = useState(false)
  const [isShowingModal_financeBilling, setIsShowingModal_financeBilling] = useState(true)
  const [financeBillingDisplay, setFinanceBillingDisplay] = useState('')
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [description, setDescription] = useState(<div className={styles.noneDesc}>none</div>)
  const [partialNameText, setPartialNameText] = useState('')
  const [selectedFinancePaymentTypes, setSelectedFinancePaymentTypes] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {paramPersonId, students} = props
    			
    			if (!isInit && paramPersonId && students && students.length > 0) {
    					let paramPerson = students.filter(m => m.id === paramPersonId)[0]
    					if (paramPerson && paramPerson.id) setIsInit(true); setSelectedStudents([paramPerson])
    			}
    	
  }, [])

  const {personId, students, myFrequentPlaces, setMyFrequentPlace, financePayments, fetchingRecord, financePaymentTypes,
  							getFinancePaymentBillings} = props
  			
  
  			let filteredPayments = financePayments
  
  			if (partialNameText) {
  					let cutBackTextFilter = partialNameText.toLowerCase()
  					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.personName && m.personName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financePaymentTypeName && m.financePaymentTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.totalAmount && String(m.totalAmount).indexOf(cutBackTextFilter) > -1))
  			}
  
  			if (selectedStudents && selectedStudents.length > 0) {
  					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => {
  							let found = false
  							selectedStudents.forEach(s => {
  									if (s.id === m.personId) found = true
  							})
  							return found
  					})
  			}
  
  			if (selectedFinancePaymentTypes && selectedFinancePaymentTypes.length > 0) {
  					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => {
  							let found = false
  							selectedFinancePaymentTypes.forEach(s => {
  									if (s.id === m.financePaymentTypeId) found = true
  							})
  							return found
  					})
  			}
  
  			if (fromDate && toDate) {
  					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (fromDate) {
  					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (toDate) {
  					filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			}
  
  			filteredPayments = filteredPayments && filteredPayments.length > 0 && filteredPayments.map((m, i) => {
  					m.icons = <div className={classes(globalStyles.cellText, styles.row)} onClick={() => chooseRecord(m.financePaymentTableId)}>
  												<div onClick={() => navigate(`/financePaymentReceipt/${m.financePaymentTableId}`)} className={globalStyles.link}>
  														<Icon pathName={'printer'} premium={true} className={styles.icon}/>
  												</div>
  												<div onClick={() => getFinancePaymentBillings(personId, m.financePaymentTableId, () => handleFinanceBillingOpen())} className={globalStyles.link}>
  														<Icon pathName={'document0'} premium={true} className={styles.icon}/>
  												</div>
  										</div>
  					m.entry = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financePaymentTableId)}>
  												<DateMoment date={m.entryDate}/>
  										</div>
  					m.paymentType = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financePaymentTableId)}>
   											{m.financePaymentTypeName}
   									 </div>
  					m.applyTo = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financePaymentTableId)}>
  											{m.applyFundsTo}
  									 </div>
  					m.name = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financePaymentTableId)}>
  											{m.personName}
  									 </div>
  					m.amount = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financePaymentTableId)}>
  												{`$${formatNumber(m.totalAmount, true, false, 2)}`}
  										 </div>
  				  m.files = <div className={classes(globalStyles.cellText, styles.row, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))}>
  												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  														<a key={i} href={f.url} target={m.financePaymentTableId}><Icon pathName={'document0'} premium={true}/></a>
  												)}
  									  </div>
  					m.desc = <div className={classes(globalStyles.link, globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.personName, m.description); chooseRecord(m.financePaymentTableId);}}>
  												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
  										</div>
  					m.entryPerson = <div className={classes(globalStyles.cellText, (m.financePaymentTableId === financePaymentTableId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financePaymentTableId)}>
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
  					width: 130,
  					label: <L p={p} t={`Entry date`}/>,
  					dataKey: 'entry',
  				},
  				{
  					width: 100,
  					label: <L p={p} t={`Payment type`}/>,
  					dataKey: 'paymentType',
  				},
  				{
  					width: 100,
  					label: <L p={p} t={`Apply funds to`}/>,
  					dataKey: 'applyTo',
  				},
  				{
  					width: 160,
  					label: <L p={p} t={`Name`}/>,
  					dataKey: 'name',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`Amount`}/>,
  					dataKey: 'amount',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`File(s)`}/>,
  					dataKey: 'files',
  				},
  				{
  					width: 320,
  					label: <L p={p} t={`Description`}/>,
  					dataKey: 'desc',
  				},
  				{
  					width: 120,
  					label: <L p={p} t={`Entered by`}/>,
  					dataKey: 'entryPerson',
  				}
  		]
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								{`Payment History`}
  						</div>
  						<div className={styles.rowWrap}>
  							<div className={styles.row}>
  									<div>
  											<div className={globalStyles.filterLabel}>FILTERS:</div>
  											<div onClick={resetFilters} className={globalStyles.clearLink}>clear</div>
  									</div>
  									<div className={styles.littleTop}>
  											<InputText
  													id={"partialNameText"}
  													name={"partialNameText"}
  													size={"medium"}
  													label={<L p={p} t={`Text search`}/>}
  													value={partialNameText || ''}
  													onChange={handleChange}/>
  									</div>
  									<div>
  											<InputDataList
  													label={<L p={p} t={`Payment type(s)`}/>}
  													id={'financePaymentTypes'}
  													name={'financePaymentTypes'}
  													options={financePaymentTypes}
  													value={selectedFinancePaymentTypes || []}
  													multiple={true}
  													height={`medium`}
  													className={styles.moreSpace}
  													onChange={handleSelectedFinancePaymentTypes}/>
  									</div>
  										<div>
  												<InputDataList
  														label={<L p={p} t={`Student(s)`}/>}
  														name={'students'}
  														options={students}
  														value={selectedStudents}
  														multiple={true}
  														height={`medium`}
  														className={styles.moreSpace}
  														onChange={handleSelectedStudents}
  														error={errors.studentsOrGroup}/>
  										</div>
  										{selectedStudents && selectedStudents.length === 1 &&
  												<div className={classes(styles.siblingPosition, styles.smallWidth, styles.row, styles.moreRight)}>
  														<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={includeSiblings} addClassName={styles.smallButton}/>
  														<div className={classes(styles.label, styles.labelPosition)}>{noSiblingsFound ? <L p={p} t={`No siblings found`}/> : <L p={p} t={`Include siblings`}/>}</div>
  												</div>
  										}
  								</div>
  								<div className={classes(styles.moreRight, styles.row, styles.dateRow)}>
  										<div className={styles.moreRight}>
  												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={fromDate} maxDate={toDate}
  														onChange={(event) => changeDate('fromDate', event)}/>
  										</div>
  										<div className={styles.muchRight}>
  												<DateTimePicker id={`toDate`} value={toDate} label={<L p={p} t={`To date`}/>} minDate={fromDate ? fromDate : ''}
  														onChange={(event) => changeDate('toDate', event)}/>
  										</div>
  								</div>
  						</div>
  						<div className={styles.widthStop}>
  								<Loading isLoading={fetchingRecord.financePayments} />
  								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(filteredPayments && filteredPayments.length) || 0}
  												rowGetter={({ index }) => (filteredPayments && filteredPayments.length > 0 && filteredPayments[index]) || ''}
  												columns={columns} />
  								</Paper>
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
  						{isShowingModal_financeBilling &&
  								<MessageModal handleClose={handleFinanceBillingClose} heading={<L p={p} t={`Finance Billing`}/>}
  									 explainJSX={financeBillingDisplay} onClick={handleFinanceBillingClose} />
  						}
  						{isShowingModal_description &&
  								<MessageModal handleClose={handleDescriptionClose} heading={studentName} explain={description} onClick={handleDescriptionClose} />
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Payment History`}/>} path={'financePaymentList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinancePaymentListView)
