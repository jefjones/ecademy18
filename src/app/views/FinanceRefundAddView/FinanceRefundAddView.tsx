import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import * as styles from './FinanceRefundAddView.css'
const p = 'FinanceRefundAddView'
import L from '../../components/PageLanguage'
import InputFile from '../../components/InputFile'
import {formatNumber} from '../../utils/numberFormat'
import axios from 'axios'
import * as globalStyles from '../../utils/globalStyles.css'
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
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import { withAlert } from 'react-alert'

function FinanceRefundAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
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
  const [description, setDescription] = useState('')
  const [selectedFinanceBillingIds, setSelectedFinanceBillingIds] = useState([])
  const [selectedFile, setSelectedFile] = useState(file)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [clearStudent, setClearStudent] = useState(false)
  const [clearGuardian, setClearGuardian] = useState(false)
  const [clearTeacher, setClearTeacher] = useState(false)
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

  const {personId, students, myFrequentPlaces, setMyFrequentPlace, financeBillings, fetchingRecord, financeFeeTypes} = props
  			
  
  			let filteredBillings = financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.isPaid)
  
  			if (partialNameText) {
  					let cutBackTextFilter = partialNameText.toLowerCase()
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.billedPersonName && m.billedPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1))
  			}
  
  			if (selectedStudents && selectedStudents.length > 0) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => {
  							let found = false
  							selectedStudents.forEach(s => {
  									if (s.id === m.personId) found = true
  							})
  							return found
  					})
  			}
  
  			if (selectedFinanceFeeTypes && selectedFinanceFeeTypes.length > 0) {
  					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => {
  							let found = false
  							selectedFinanceFeeTypes.forEach(s => {
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
  					m.desc = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.studentName, m.description); chooseRecord(m.financeBillingId);}}>
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
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Add New Refund`}/>
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
  						<hr/>
  						<div className={styles.rowWrap}>
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
  								<a className={styles.cancelLink} onClick={() => navigate('/financeRefundList')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  						</div>
  						<hr/>
  						<div className={styles.widthStop}>
  								<Loading isLoading={fetchingRecord.financeBillings} />
  								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(filteredBillings && filteredBillings.length) || 0}
  												rowGetter={({ index }) => (filteredBillings && filteredBillings.length > 0 && filteredBillings[index]) || ''}
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
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Refund`}/>} path={'financeRefundAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceRefundAddView)
