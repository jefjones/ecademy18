import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './FinanceTransferListView.css'
const p = 'FinanceTransferListView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import {formatNumber} from '../../utils/numberformat'
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
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function FinanceTransferListView(props) {
  const [financeTransferId, setFinanceTransferId] = useState('')
  const [isInit, setIsInit] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState([paramPerson])
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [description, setDescription] = useState('')
  const [isShowingModal_reverse, setIsShowingModal_reverse] = useState(true)
  const [toPersonId, setToPersonId] = useState('')
  const [fromPersonId, setFromPersonId] = useState('')
  const [partialNameText, setPartialNameText] = useState('')
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

  const {personId, financeTransfers, companyConfig={}, accessRoles, students, myFrequentPlaces, setMyFrequentPlace, fetchingRecord } = props
        
  
  			let filteredTransfers = financeTransfers
  			if (partialNameText) {
  					let cutBackTextFilter = partialNameText.toLowerCase()
  					filteredTransfers = filteredTransfers && filteredTransfers.length > 0 && filteredTransfers.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.fromPersonName && m.fromPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.toPersonName && m.toPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1))
  			}
  
  			if (selectedStudents && selectedStudents.length > 0) {
  					filteredTransfers = filteredTransfers && filteredTransfers.length > 0 && filteredTransfers.filter(m => {
  							let found = false
  							selectedStudents.forEach(s => {
  									if (s.id === m.toPersonId || s.id === m.fromPersonId) found = true
  							})
  							return found
  					})
  			}
  
  			if (fromDate && toDate) {
  					filteredTransfers = filteredTransfers && filteredTransfers.length > 0 && filteredTransfers.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (fromDate) {
  					filteredTransfers = filteredTransfers && filteredTransfers.length > 0 && filteredTransfers.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			} else if (toDate) {
  					filteredTransfers = filteredTransfers && filteredTransfers.length > 0 && filteredTransfers.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')))
  			}
  
  			filteredTransfers = filteredTransfers && filteredTransfers.length > 0 && filteredTransfers.map((m, i) => {
  					m.icons = accessRoles.admin
  												? <div className={classes(styles.cellText, styles.row, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.id)}>
  															<div onClick={() => handleReverseOpen(m.fromPersonId, m.toPersonId)} className={globalStyles.link} data-rh={'Reverse this transactdion'}>
  																	<Icon pathName={'reply_arrow'} premium={true} className={styles.icon}/>
  															</div>
  													</div>
  												: <div></div>
  					m.fromPerson = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
  											{m.fromPersonName}
  									 </div>
  				  m.fromAccount = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
  											{m.fromAccountType}
  									 </div>
  					m.toPerson = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
  											{m.toPersonName}
  									 </div>
   				  m.toAccount = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
  											{m.toAccountType}
  									 </div>
  					m.creditAmount = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
  																{`$${formatNumber(m.amount, true, false, 2)}`}
  														 </div>
  				  m.files = <div className={classes(styles.cellText, styles.row, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))}>
  		 										{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  											 			<a key={i} href={f.url} target={m.financeTransferId}><Icon pathName={'document0'} premium={true}/></a>
  												)}
  									 </div>
  					m.desc = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.studentName, m.description); chooseRecord(m.financeTransferId);}}>
  												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
  										</div>
  					m.entry = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
  												<DateMoment date={m.entryDate}/>
  										</div>
  					m.entryPerson = <div className={classes(styles.cellText, (m.financeTransferId === financeTransferId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.financeTransferId)}>
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
  					width: 160,
  					label: <L p={p} t={`From`}/>,
  					dataKey: 'fromPerson',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`From account`}/>,
  					dataKey: 'fromAccount',
  				},
  				{
  					width: 160,
  					label: <L p={p} t={`To`}/>,
  					dataKey: 'toPerson',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`To account`}/>,
  					dataKey: 'toAccount',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`Amount`}/>,
  					dataKey: 'creditAmount',
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
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreBottomMarginl)}>
                    	<L p={p} t={`Transfers History`}/>
                  </div>
  								<div className={styles.row}>
  										<div>
  												<div className={globalStyles.filterLabel}><L p={p} t={`FILTERS:`}/></div>
  												<div onClick={resetFilters} className={globalStyles.clearLink}><L p={p} t={`clear`}/></div>
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
  										<Loading isLoading={fetchingRecord.financeTransfers} />
  										<Paper style={{ height: 400, width: companyConfig.urlcode === 'Liahona' ? '700px' : '1260px', marginTop: '8px' }}>
  												<TableVirtualFast rowCount={(filteredTransfers && filteredTransfers.length) || 0}
  														rowGetter={({ index }) => (filteredTransfers && filteredTransfers.length > 0 && filteredTransfers[index]) || ''}
  														columns={columns} />
  										</Paper>
  								</div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Transfer History`}/>} path={'financeTransferList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
          		<OneFJefFooter />
  						{isShowingModal_reverse &&
                  <MessageModal handleClose={handleReverseClose} heading={<L p={p} t={`Reverse this transfer?`}/>}
                     explainJSX={<L p={p} t={`In order to reverse this transfer, I'm going to send you to the Add New Transfer.  Credit or Lunch amounts may have changed.  You can make another transfer to return the accounts back to their previous amounts.  Would you like to go to the Add New Transfer page?`}/>} isConfirmType={true}
                     onClick={handleReverse} />
              }
  						{isShowingModal_description &&
                  <MessageModal handleClose={handleDescriptionOpenClose} heading={studentName} explain={description} onClick={handleDescriptionOpenClose} />
              }
          </div>
      )
}

export default withAlert(FinanceTransferListView)
