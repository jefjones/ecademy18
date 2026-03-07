import { useEffect, useState } from 'react'
import * as styles from './FinanceRefundListView.css'
const p = 'FinanceRefundListView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
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

function FinanceRefundListView(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedObservers, setSelectedObservers] = useState([])
  const [financeRefund, setFinanceRefund] = useState({
					})
  const [errors, setErrors] = useState({})
  const [isInit, setIsInit] = useState(true)
  const [selectedFile, setSelectedFile] = useState(file)
  const [clearStudent, setClearStudent] = useState(false)
  const [clearGuardian, setClearGuardian] = useState(false)
  const [clearTeacher, setClearTeacher] = useState(false)
  const [isShowingModal_financeBilling, setIsShowingModal_financeBilling] = useState(true)
  const [financeBillingDisplay, setFinanceBillingDisplay] = useState('')
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [description, setDescription] = useState('')
  const [partialNameText, setPartialNameText] = useState('')
  const [selectedFinanceFeeTypes, setSelectedFinanceFeeTypes] = useState([])
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

  const {personId, students, myFrequentPlaces, setMyFrequentPlace, financeRefunds, fetchingRecord, financeFeeTypes} = props
  			
  
  			let filteredRefunds = financeRefunds
  
  			if (partialNameText) {
  					let cutBackTextFilter = partialNameText.toLowerCase()
  					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.creditPersonName && m.creditPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1))
  			}
  
  			if (selectedStudents && selectedStudents.length > 0) {
  					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => {
  							let found = false
  							selectedStudents.forEach(s => {
  									if (s.id === m.personId) found = true
  							})
  							return found
  					})
  			}
  
  			if (selectedFinanceFeeTypes && selectedFinanceFeeTypes.length > 0) {
  					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => {
  							let found = false
  							selectedFinanceFeeTypes.forEach(s => {
  									if (s.id === m.financeFeeTypeId) found = true
  							})
  							return found
  					})
  			}
  
  			if (fromDate && toDate) {
  					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (fromDate) {
  					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (toDate) {
  					filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			}
  
  			filteredRefunds = filteredRefunds && filteredRefunds.length > 0 && filteredRefunds.map((m, i) => {
  					m.fee = <div className={classes(globalStyles.link, globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => {handleFinanceBillingOpen(m.financeBillingId); chooseRecord(m.financeRefundId)}}>
  											{m.financeFeeTypeName}
  									 </div>
  					m.name = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeRefundId)}>
  											{m.creditPersonName}
  									 </div>
  					m.billingAmount = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeRefundId)}>
  																{`$${formatNumber(m.amount, true, false, 2)}`}
  														 </div>
  				  m.files = <div className={classes(globalStyles.cellText, styles.row, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))}>
  												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  														<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
  												)}
  									  </div>
  					m.desc = <div className={classes(globalStyles.link, globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.studentName, m.description); chooseRecord(m.financeRefundId);}}>
  												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
  										</div>
  					m.entry = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeRefundId)}>
  												<DateMoment date={m.entryDate}/>
  										</div>
  					m.entryPerson = <div className={classes(globalStyles.cellText, (m.financeRefundId === financeRefundId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeRefundId)}>
  															{m.entryPersonName}
  													</div>
  
  					return m
  			})
  
  			let columns = [
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
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Refund History`}/>
  						</div>
  						<div className={styles.rowWrap}>
  							<div className={styles.row}>
  									<div>
  											<div className={globalStyles.filterLabel}><L p={p} t={`FILTERS:`}/></div>
  											<div onClick={resetFilters} className={globalStyles.clearLink}><L p={p} t={`clear`}/></div>
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
  													label={<L p={p} t={`Fee type(s)`}/>}
  													id={'financeFeeTypes'}
  													name={'financeFeeTypes'}
  													options={financeFeeTypes}
  													value={selectedFinanceFeeTypes || []}
  													multiple={true}
  													height={`medium`}
  													className={styles.moreSpace}
  													onChange={handleSelectedFinanceFeeTypes}/>
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
  								<Loading isLoading={fetchingRecord.financeRefunds} />
  								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(filteredRefunds && filteredRefunds.length) || 0}
  												rowGetter={({ index }) => (filteredRefunds && filteredRefunds.length > 0 && filteredRefunds[index]) || ''}
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
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Refund History`}/>} path={'financeRefundList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceRefundListView)
