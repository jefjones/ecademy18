import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './FinanceAccountListView.css'
const p = 'FinanceAccountListView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import {guidEmpty} from '../../utils/guidValidate'
import {formatNumber} from '../../utils/numberformat'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import InputText from '../../components/InputText'
import RadioGroup from '../../components/RadioGroup'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import { withAlert } from 'react-alert'

function FinanceAccountListView(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [financeGroupTableId, setFinanceGroupTableId] = useState('')
  const [errors, setErrors] = useState({})
  const [clearStudent, setClearStudent] = useState(false)
  const [clearGuardian, setClearGuardian] = useState(false)
  const [clearTeacher, setClearTeacher] = useState(false)
  const [partialNameText, setPartialNameText] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  const {personId, students, myFrequentPlaces, setMyFrequentPlace, financeAccountSummaries, fetchingRecord, financeGroups, accessRoles={},
  							viewOptions} = props
  			
  
  			let filteredAccounts = financeAccountSummaries
  
  			if (partialNameText) {
  					let cutBackTextFilter = partialNameText.toLowerCase()
  					filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1)
  								|| (m.label && m.label.toLowerCase().indexOf(cutBackTextFilter) > -1)
  								|| (String(m.billingAccount) && String(m.billingAccount).indexOf(cutBackTextFilter) > -1)
  								|| (String(m.lunchAccount) && String(m.lunchAccount).indexOf(cutBackTextFilter) > -1)
  								|| (String(m.creditAccount) && String(m.creditAccount).indexOf(cutBackTextFilter) > -1))
  			}
  
  			if (selectedStudents && selectedStudents.length > 0) {
  					filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => {
  							let found = false
  							selectedStudents.forEach(s => {
  									if (s.id === m.personId) found = true
  							})
  							return found
  					})
  			}
  
  			if (viewOption && viewOption !== 'All') {
  					filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => {
  							let found = false
  
  							if (viewOption === 'BillingDue') {
  									if (m.billingAccount > 0) found = true
  							}
  							if (viewOption === 'LunchDue') {
  									if (m.lunchAccount < 0) found = true
  							}
  							if (viewOption === 'LunchCredit') {
  									if (m.lunchAccount > 0) found = true
  							}
  							if (viewOption === 'CreditPositive') {
  									if (m.creditAccount > 0) found = true
  							}
  							return found
  					})
  			}
  
  			if (financeGroupTableId && financeGroupTableId !== '0' && financeGroupTableId !== guidEmpty) {
  					let financeGroup = financeGroups && financeGroups.length > 0 && financeGroups.filter(m => m.financeGroupTableId === financeGroupTableId)[0]
  					if (financeGroup && financeGroup.studentPersonIds && financeGroup.studentPersonIds.length > 0) {
  							filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => {
  									let found = false
  									if (financeGroup.studentPersonIds.indexOf(m.personId) > -1) found = true
  									return found
  							})
  					}
  			}
  
  			if (fromAmount && toAmount) {
  					filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => (fromAmount <= m.billingAccount && toAmount >= m.billingAccount) || (fromAmount <= m.lunchAccount && toAmount >= m.lunchAccount) || (fromAmount <= m.creditAccount && toAmount >= m.creditAccount))
  			} else if (fromAmount) {
  					filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => fromAmount <= m.billingAccount || fromAmount <= m.lunchAccount || fromAmount <= m.creditAccount)
  			} else if (toAmount) {
  					filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.filter(m => toAmount >= m.billingAccount || toAmount >= m.lunchAccount || toAmount >= m.creditAccount)
  			}
  
  			filteredAccounts = filteredAccounts && filteredAccounts.length > 0 && filteredAccounts.map((m, i) => {
  					m.personName = <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}>
  														{m.label}
  												 </div>
  					m.gradeLevel = <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}>
  			 											{m.gradeLevelName}
  			 									 </div>
  					m.billing = m.billingAccount
                            ? <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}>
        													{`$${formatNumber(m.billingAccount, true, false, 2)}`}
        											</div>
                            : <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}></div>
  
  				  m.lunch = m.lunchAccount
                          ? <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}>
        												{`$${formatNumber(m.lunchAccount, true, false, 2)}`}
        										</div>
                          : <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}></div>
  					m.credit = m.creditAccount
                          ? <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}>
        												{`$${formatNumber(m.creditAccount, true, false, 2)}`}
        									  </div>
                          : <div className={classes(globalStyles.cellText, (m.personId === paramPersonId ? globalStyles.highlight : ''))} onClick={() => chooseRecord(m.personId)}></div>
  					return m
  			})
  
  			let columns = [
  				{
  					width: 160,
  					label: '',
  					dataKey: 'personName',
  				},
  				{
  					width: 60,
  					label: <L p={p} t={`Grade`}/>,
  					dataKey: 'gradeLevel',
  				},
  				{
  					width: 80,
  					label: <L p={p} t={`Billing`}/>,
  					dataKey: 'billing',
  				},
  				{
  					width: 80,
  					label: <L p={p} t={`Lunch`}/>,
  					dataKey: 'lunch',
  				},
  				{
  					width: 80,
  					label: <L p={p} t={`Credit`}/>,
  					dataKey: 'credit',
  				},
  		]
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Account Summaries`}/>
  						</div>
              {(accessRoles.admin || accessRoles.frontDesk) &&
                  <div>
      								<div className={styles.rowWrap}>
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
      											<div className={classes(styles.moreBottom, styles.littleTop)}>
      													<SelectSingleDropDown
      															id={`financeGroupTableId`}
      															name={`financeGroupTableId`}
      															label={<L p={p} t={`or Group`}/>}
      															value={financeGroupTableId || ''}
      															options={financeGroups}
      															className={styles.moreBottomMargin}
      															height={`medium`}
      															onChange={handleChange}
      															errors={errors.financeGroupTableId}/>
      											</div>
      											<div className={styles.muchTop}>
      													<InputText
      															label={<L p={p} t={`From amount`}/>}
      															size={"short"}
      															name={'fromAmount'}
      															value={fromAmount || ''}
      															numberOnly={true}
      															maxLength={6}
      															onChange={handleChange}/>
      											</div>
      											<div className={styles.muchTop}>
      													<InputText
      															label={<L p={p} t={`To amount`}/>}
      															size={"short"}
      															name={'toAmount'}
      															value={toAmount || ''}
      															numberOnly={true}
      															maxLength={6}
      															onChange={handleChange}/>
      											</div>
      									</div>
      									<div>
      											<RadioGroup
      												label={<L p={p} t={`View options`}/>}
      												data={viewOptions}
      												name={`viewOption`}
      												horizontal={true}
      												className={styles.radio}
      												initialValue={viewOption || 'All'}
      												onClick={handleViewOption}/>
      									</div>
      									<hr/>
      							</div>
                }
  							<div>
  									<div className={classes(styles.rowWrap, styles.moreTop)}>
  											<div className={styles.columns}>
  													<Link to={paramPersonId ? `/financeBillingList/person/${paramPersonId}` : `/financeBillingList`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Billing History`}/></Link>
  													{(accessRoles.admin || accessRoles.frontDesk) &&
  															<Link to={paramPersonId ? `/financeBillingAdd/person/${paramPersonId}` : `/financeBillingAdd`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Billing`}/></Link>
  													}
  											</div>
  											<div className={styles.columns}>
  													<Link to={paramPersonId ? `/financeCreditList/person/${paramPersonId}` : `/financeCreditList`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Credits History`}/></Link>
  													{(accessRoles.admin || accessRoles.frontDesk) &&
  															<Link to={paramPersonId ? `/financeCreditAdd/person/${paramPersonId}` : `/financeCreditAdd`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Credit`}/></Link>
  													}
  											</div>
  											<div className={styles.columns}>
  													<Link to={paramPersonId ? `/financeLunchList/person/${paramPersonId}` : `/financeLunchList`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Lunch History`}/></Link>
  													{(accessRoles.admin || accessRoles.frontDesk) &&
  															<Link to={paramPersonId ? `/financeBillingAdd/lunch/addLunchBilling/person/${paramPersonId}` : `/financeBillingAdd/lunch/addLunchBilling`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Lunch Billing`}/></Link>
  													}
  													<Link to={paramPersonId ? `/financePaymentAdd/lunch/addNewLunchPayment/person/${paramPersonId}` : `/financePaymentAdd/lunch/addNewLunchPayment`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Lunch Credit`}/></Link>
  											</div>
  											<div className={styles.columns}>
  													<Link to={paramPersonId ? `/financePaymentList/person/${paramPersonId}` : `/financePaymentList`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Payment History`}/></Link>
  													<Link to={`/financePaymentReceipt`} className={classes(globalStyles.link, styles.moreBottom)}>{`Payment Receipt`}</Link>
  													<Link to={paramPersonId ? `/financePaymentAdd/person/${paramPersonId}` : `/financePaymentAdd`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Payment`}/></Link>
  											</div>
  											<div className={styles.columns}>
  													<Link to={paramPersonId ? `/financeRefundList/person/${paramPersonId}` : `/financeRefundList`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Refund History`}/></Link>
  													{(accessRoles.admin || accessRoles.frontDesk) &&
  															<Link to={paramPersonId ? `/financeRefundAdd/person/${paramPersonId}` : `/financeRefundAdd`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Refund`}/></Link>
  													}
  											</div>
  											<div className={styles.columns}>
  													<Link to={paramPersonId ? `/financeTransferList/person/${paramPersonId}` : `/financeTransferList`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Transfer History`}/></Link>
  													<Link to={paramPersonId ? `/financeTransferAdd/new/person/${paramPersonId}` : `/financeTransferAdd`} className={classes(globalStyles.link, styles.moreBottom)}><L p={p} t={`Add New Transfer`}/></Link>
  											</div>
  									</div>
  							</div>
  							<div className={styles.widthStop}>
  									<Loading isLoading={fetchingRecord.financeAccountSummaries} />
  									<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
  											<TableVirtualFast rowCount={(filteredAccounts && filteredAccounts.length) || 0}
  													rowGetter={({ index }) => (filteredAccounts && filteredAccounts.length > 0 && filteredAccounts[index]) || ''}
  													columns={columns} />
  									</Paper>
  							</div>
  							{isShowingModal &&
  									<div className={globalStyles.fullWidth}>
  											<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  									</div>
  							}
  							{isShowingModal_description &&
  									<MessageModal handleClose={handleDescriptionClose} heading={studentName} explain={description} onClick={handleDescriptionClose} />
  							}
  					<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Payment History`}/>} path={'financePaymentList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  					<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceAccountListView)
