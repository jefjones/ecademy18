import { useState } from 'react';  //PropTypes
import * as styles from './FinanceCourseFeeStudentModal.css'
import * as globalStyles from '../../utils/globalStyles.css'
import ButtonWithIcon from '../ButtonWithIcon'
import TextDisplay from '../TextDisplay'
import Icon from '../Icon'
import {formatNumber} from '../../utils/numberFormat'
import SelectSingleDropDown from '../SelectSingleDropDown'
import DateMoment from '../DateMoment'
import MessageModal from '../MessageModal'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
const p = 'component'
import L from '../../components/PageLanguage'

function FinanceCourseFeeStudentModal(props) {
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [allRefundPercent, setAllRefundPercent] = useState(target.value)
  const [financeRefundOrRemoves, setFinanceRefundOrRemoves] = useState(undefined)

  
  				let refundPercentages = []
  				for(let i = 100; i >= 0; i -= 5) {
  						let option = {id: i, label: i}
  						refundPercentages = refundPercentages && refundPercentages.length > 0 ? refundPercentages.concat(option) : [option]
  				}
  
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
                    <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
  											<div className={styles.autoWidth}>
  			                    <div className={styles.dialogHeader}>{`Cancel Class from Schedule`}</div>
  													<div>
  															<SelectSingleDropDown
  																	id={'allRefundPercent'}
  																	name={'allRefundPercent'}
  																	label={<L p={p} t={`Set All Refund %`}/>}
  																	value={allRefundPercent || -1}
  																	firstValue={-1}
  																	options={refundPercentages}
  																	className={styles.dropdown}
  																	onChange={handleSetAllRefundPercent}/>
  													</div>
  													<hr/>
  													{financeBillings && financeBillings.length > 0 && financeBillings.map((m, i) =>
  															<div key={i} className={styles.maxWidth}>
  																	<div className={styles.rowWrap}>
  																			<div>
  																					<SelectSingleDropDown
  																							id={'refundPercent'}
  																							name={'refundPercent'}
  																							label={<L p={p} t={`Refund %`}/>}
  																							value={hasRefundPercent(m.financeBillingId)}
  																							firstValue={-1}
  																							options={refundPercentages}
  																							className={styles.dropdown}
  																							onChange={(event) => handleRefundPercent(m.financeBillingId, event)}
  																							error={errors[m.financeBillingId]}/>
  																			</div>
  																			<TextDisplay label={<L p={p} t={`Fee type`}/>} text={m.financeFeeTypeName}/>
  																			<TextDisplay label={<L p={p} t={`Student`}/>} text={m.creditPersonName}/>
  																			<TextDisplay label={<L p={p} t={`Amount`}/>} text={`$${formatNumber(m.amount, true, false, 2)}`}/>
  																			{m.fileUploads && m.fileUploads.length > 0 &&
  																					<TextDisplay label={<L p={p} t={`File(s)`}/>} text={m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
  																									<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
  																							)} />
  																			}
  																			<TextDisplay label={<L p={p} t={`GL code`}/>} text={m.financeGlcodeName}/>
  																			<TextDisplay label={<L p={p} t={`Refund type`}/>} text={m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}/>
  																			<TextDisplay label={<L p={p} t={`Income waiver`}/>} text={m.financeLowIncomeWaiverName}/>
  																			<TextDisplay label={<L p={p} t={`Mandatory?`}/>} text={m.mandatoryOrOptional}/>
  																			<TextDisplay label={<L p={p} t={`Due date`}/>} text={<DateMoment date={m.dueDate}/>}/>
  																			{m.financeGroupTableName && <TextDisplay label={<L p={p} t={`Group`}/>} text={m.financeGroupTableName}/>}
  																			<TextDisplay label={<L p={p} t={`Description`}/>} text={m.description}/>
  																			<TextDisplay label={<L p={p} t={`Entry`}/>} text={<DateMoment date={m.entryDate}/>}/>
  																			<TextDisplay label={<L p={p} t={`Entered by`}/>} text={m.entryPersonName}/>
  																	</div>
  																	<hr/>
  															</div>
  													)}
  													<div className={globalStyles.centered}>
  															<div className={styles.row}>
  																	<a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Close`}/></a>
  																	<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  															</div>
  													</div>
  											</div>
  											{isShowingModal_missingInfo &&
  													<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  														 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  											}
                    </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default FinanceCourseFeeStudentModal
