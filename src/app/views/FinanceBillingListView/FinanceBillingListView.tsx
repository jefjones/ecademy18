import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FinanceBillingListView.css'
const p = 'FinanceBillingListView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import MessageModal from '../../components/MessageModal'
import InputDataList from '../../components/InputDataList'
import Icon from '../../components/Icon'
import InputText from '../../components/InputText'
import DateMoment from '../../components/DateMoment'
import DateTimePicker from '../../components/DateTimePicker'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'
import {formatNumber} from '../../utils/numberFormat'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function FinanceBillingListView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [financeBillingId, setFinanceBillingId] = useState('')
  const [onlyBillingDue, setOnlyBillingDue] = useState(props.onlyBillingDue === 'onlyBillingDue')
  const [isInit, setIsInit] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState([paramPerson])
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [billedPersonName, setBilledPersonName] = useState('')
  const [description, setDescription] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(true)
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

  const {personId, financeBillings, companyConfig={}, accessRoles, students, financeFeeTypes, myFrequentPlaces, setMyFrequentPlace,
  							fetchingRecord } = props
        
  
  			let filteredBillings = financeBillings
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
  
  			if (onlyBillingDue) filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => !m.isPaid)
  
  			filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.map((m, i) => {
  					m.icons = !m.isPaid
  												? accessRoles.admin
                                ? <div className={classes(styles.cellText, styles.littleTop, styles.row)} onClick={() => chooseRecord(m.financeBillingId)}>
        															<div onClick={() => navigate(`/financeBillingAdd/${m.financeBillingId}`)} className={globalStyles.link}>
        																	<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
        															</div>
        															<div onClick={() => handleRemoveOpen(m.financeBillingId)} className={globalStyles.link}>
        																	<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
        															</div>
        													</div>
                                : ''
  												: <div className={classes(styles.cellText, styles.grayItalic)}>paid</div>
  					m.fee = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  											{m.financeFeeTypeName}
  									 </div>
  					m.name = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  											{m.billedPersonName}
  									 </div>
  					m.billingAmount = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{`$${formatNumber(m.amount, true, false, 2)}`}
  														 </div>
  				 m.files = <div className={classes(styles.cellText, styles.row, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))}>
  		 										{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  											 			<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
  												)}
  									 </div>
  				 m.glcodeName = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  														{m.financeGlcodeName}
  												</div>
  				 m.refund = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  												{m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}
  										</div>
  				 m.lowIncomeWaiverName = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{m.financeLowIncomeWaiverName}
  														 </div>
  				 m.mandatory = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{m.mandatoryOrOptional}
  														 </div>
  				 m.due = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																<DateMoment date={m.dueDate}/>
  														 </div>
  					m.group = <div onClick={() => chooseRecord(m.financeBillingId)} className={classes(styles.cellText, styles.link, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))}>
  												{m.financeGroupTableName}
  										</div>
  					m.desc = <div className={classes(styles.cellText, globalStyles.link, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.billedPersonName, m.description); chooseRecord(m.financeBillingId);}}>
  												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
  										</div>
            m.partial = m.partialPayment
                            ? <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  																{`$${formatNumber(m.partialPayment, true, false, 2)}`}
  														</div>
                            : ''
           m.partialDesc = <div className={classes(styles.cellText, globalStyles.link, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.billedPersonName, m.partialPaymentComment); chooseRecord(m.financeBillingId);}}>
  												{m.partialPaymentComment && m.partialPaymentComment.length > 50 ? m.partialPaymentComment.substring(0,50) + '...' : m.partialPaymentComment}
  										</div>
  					m.entry = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
  												<DateMoment date={m.entryDate}/>
  										</div>
  					m.entryPerson = <div className={classes(styles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeBillingId)}>
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
  					width: 140,
  					label: <L p={p} t={`Fee`}/>,
  					dataKey: 'fee',
  				},
  				{
  					width: 160,
  					label: <L p={p} t={`Name`}/>,
  					dataKey: 'name',
  				},
  				{
  					width: 90,
  					label: <L p={p} t={`Amount`}/>,
  					dataKey: 'billingAmount',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`File(s)`}/>,
  					dataKey: 'files',
  				},
  				{
  					width: 120,
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
  					width: 105,
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
  					width: 90,
  					label: <L p={p} t={`Part Payment`}/>,
  					dataKey: 'partial',
  				},
          {
  					width: 160,
  					label: <L p={p} t={`Partial payment comment`}/>,
  					dataKey: 'partialDesc',
  				},
  				{
  					width: 120,
  					label: <L p={p} t={`Entry date`}/>,
  					dataKey: 'entry',
  				},
  				{
  					width: 160,
  					label: <L p={p} t={`Entered by`}/>,
  					dataKey: 'entryPerson',
  				}
  		]
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreBottomMarginl, styles.row)}>
                    	{onlyBillingDue ? `Billing Due` : `Billing History`}
  										<div className={styles.checkbox}>
  												<Checkbox
  														id={'onlyBillingDue'}
  														label={<L p={p} t={`Show only amounts due`}/>}
  														labelClass={styles.checkboxLabel}
  														checked={onlyBillingDue || false}
  														onClick={toggleCheckbox}/>
  										</div>
                  </div>
  								<div className={styles.rowWrap}>
  										<div>
  												<div className={globalStyles.filterLabel}>FILTERS:</div>
  												<div onClick={resetFilters} className={globalStyles.clearLink}>clear</div>
  										</div>
  										<div className={styles.littleLeft}>
  												<InputText
  														id={"partialNameText"}
  														name={"partialNameText"}
  														size={"medium"}
  														label={<L p={p} t={`Text search`}/>}
  														value={partialNameText || ''}
  														onChange={changeItem}/>
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
  														onChange={handleSelectedStudents}/>
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
  										<Loading isLoading={fetchingRecord.financeBillings} />
  										<Paper style={{ height: 400, width: '1460px', marginTop: '8px' }}>
  												<TableVirtualFast rowCount={(filteredBillings && filteredBillings.length) || 0}
  														rowGetter={({ index }) => (filteredBillings && filteredBillings.length > 0 && filteredBillings[index]) || ''}
  														columns={columns} />
  										</Paper>
  								</div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Billing History`}/>} path={'financeBillings'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
          		<OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this billing entry?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this billing entry?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_description &&
                  <MessageModal handleClose={handleDescriptionOpenClose} heading={billedPersonName} explain={description} onClick={handleDescriptionOpenClose} />
              }
          </div>
      )
}

export default withAlert(FinanceBillingListView)
