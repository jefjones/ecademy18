import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './FinancePaymentReceiptView.css'
const p = 'FinancePaymentReceiptView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import formatNumber from '../../utils/numberFormat'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import ReactToPrint from "react-to-print"

function FinancePaymentReceiptView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [financePaymentTableId, setFinancePaymentTableId] = useState('')
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [description, setDescription] = useState('')

  const {personId, financeBillings=[], financePayments=[], financePayment={}, companyConfig={}, myFrequentPlaces, setMyFrequentPlace, fetchingRecord } = props
  			
  
  			let localBillings = financeBillings
  
  			localBillings = localBillings && localBillings.length > 0 && localBillings.map((m, i) => {
  					m.fee = <div className={styles.cellText}>
  											{m.financeFeeTypeName}
  									 </div>
  					m.name = <div className={styles.cellText}>
  											{m.billedPersonName}
  									 </div>
  					m.billingAmount = <div className={styles.cellText}>
  																{`$${formatNumber(m.amount, true, false, 2)}`}
  														 </div>
  					m.desc = <div className={styles.cellText}>
  												{m.description}
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
  					width: 320,
  					label: <L p={p} t={`Description`}/>,
  					dataKey: 'desc',
  				},
  		]
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreBottomMarginl)}>
                    	<L p={p} t={`Payment Receipt`}/>
                  </div>
  								<div className={styles.row}>
  										<div>
  												<SelectSingleDropDown
  														id={`financePaymentTableId`}
  														name={`financePaymentTableId`}
  														label={<L p={p} t={`Payments`}/>}
  														value={financePaymentTableId || ''}
  														options={financePayments}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  											</div>
  											<div className={styles.printPosition}>
  													<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  											</div>
  											<div className={styles.printPosition}>
  													<Link to={'/financePaymentList'} className={globalStyles.link}><L p={p} t={`Go to Payment History`}/></Link>
  											</div>
  								</div>
  								<div ref={el => (componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
  										<div className={styles.widthStop}>
  												{companyConfig.logoFileUrl &&
  														<img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
  												}
  												<div className={styles.header}>
  				                  	{`Payment Receipt`}
  				                </div>
  										</div>
  										<div>
  												<div className={classes(styles.moreLeft, styles.muchBottom)}>
  														<div className={styles.row}>
  																<div className={styles.labelWidth}><L p={p} t={`Person:`}/></div>
  																<div className={styles.textBold}>{financePayment.personName}</div>
  														</div>
  														<div className={styles.row}>
  																<div className={styles.labelWidth}><L p={p} t={`Date:`}/></div>
  																<div className={styles.textBold}>
  																		<DateMoment date={financePayment.entryDate} minusHours={6} labelClass={styles.textBold}/>
  																</div>
  														</div>
  														<div className={styles.row}>
  																<div className={styles.labelWidth}><L p={p} t={`Amount:`}/></div>
  																<div className={styles.textBold}>{formatNumber(financePayment.totalAmount, false, true, 2)}</div>
  														</div>
  														<div className={styles.row}>
  																<div className={styles.labelWidth}><L p={p} t={`Reference:`}/></div>
  																<div className={styles.textBold}>{financePayment.referenceCode && financePayment.referenceCode.toUpperCase()}</div>
  														</div>
  												</div>
  												<Loading isLoading={fetchingRecord.financePaymentBillings} />
  												<Paper style={{ height: 400, width: companyConfig.urlcode === 'Liahona' ? '700px' : '1260px', marginTop: '8px' }}>
  														<TableVirtualFast rowCount={(localBillings && localBillings.length) || 0}
  																rowGetter={({ index }) => (localBillings && localBillings.length > 0 && localBillings[index]) || ''}
  																columns={columns} />
  												</Paper>
  										</div>
  								</div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Billing History`}/>} path={'financeBillings'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
          		<OneFJefFooter />
          </div>
      )
}

export default withAlert(FinancePaymentReceiptView)
