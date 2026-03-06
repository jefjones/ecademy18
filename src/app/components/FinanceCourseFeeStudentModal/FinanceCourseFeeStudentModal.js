import React, {Component} from 'react';  //PropTypes
import styles from './FinanceCourseFeeStudentModal.css';
import globalStyles from '../../utils/globalStyles.css';
import ButtonWithIcon from '../ButtonWithIcon';
import TextDisplay from '../TextDisplay';
import Icon from '../Icon';
import {formatNumber} from '../../utils/numberFormat';
import SelectSingleDropDown from '../SelectSingleDropDown';
import DateMoment from '../DateMoment';
import MessageModal from '../MessageModal';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class FinanceCourseFeeStudentModal extends Component {
	  constructor(props) {
		    super(props);
		    this.state = {}
		}

		handleEnterKey = (event) => {
				event.key === "Enter" && this.props.onClick();
				event.preventDefault();
				event.stopPropagation();
		}

		processForm = () => {
				const {financeBillings, onSubmit} = this.props;
				const {financeRefundOrRemoves} = this.state;
				let errors = {};
				let missingInfoMessage = ``;

				//Loop through the financeBillings records to see if all of the FinanceBillingIds have a response in financeRefundOrRemoves
				financeBillings && financeBillings.length > 0 && financeBillings.forEach((m, i) => {
						let found = false;
						financeRefundOrRemoves && financeRefundOrRemoves.length > 0 && financeRefundOrRemoves.forEach(f => {
								if (f.id === m.financeBillingId && (f.sum || f.sum === 0)) found=true;
						})
						if (!found) {
								errors = {...errors, [m.financeBillingId]: <L p={p} t={`% is required. 0 is acceptable.`}/>};
								missingInfoMessage += `<br/>&nbsp;&nbsp;&nbsp;&nbsp; #${i+1*1} ${m.financeFeeTypeName} ${m.dueDate ? ' - due ' + m.dueDate : ''}`;
						}
				})

				if (missingInfoMessage && missingInfoMessage.length > 0) {
						this.handleMissingInfoOpen(missingInfoMessage);
						this.setState ({errors});
				} else {
						onSubmit(financeRefundOrRemoves);
				}
		}

		hasRefundPercent = (financeBillingId) => {
				const {financeRefundOrRemoves} = this.state;
				let refundOrRemove = financeBillingId && financeRefundOrRemoves && financeRefundOrRemoves.length > 0 && financeRefundOrRemoves.filter(m => m.id === financeBillingId)[0];
				return refundOrRemove && (refundOrRemove.sum || refundOrRemove.sum === 0) ? refundOrRemove.sum : '';
		}

		handleRefundPercent = (financeBillingId, {target}) => {
				let financeRefundOrRemoves = Object.assign([], this.state.financeRefundOrRemoves);
				let refundOrRemove = financeBillingId && financeRefundOrRemoves && financeRefundOrRemoves.length > 0 && financeRefundOrRemoves.filter(m => m.id === financeBillingId)[0];
				if (refundOrRemove && refundOrRemove.id) {
						refundOrRemove.sum = target.value;
						financeRefundOrRemoves = financeRefundOrRemoves && financeRefundOrRemoves.length > 0 && financeRefundOrRemoves.filter(m => m.id !== financeBillingId);
				} else {
						refundOrRemove = { id: financeBillingId, sum: target.value };
				}
				financeRefundOrRemoves = financeRefundOrRemoves && financeRefundOrRemoves.length > 0 ? financeRefundOrRemoves.concat(refundOrRemove) : [refundOrRemove];
				this.setState({ financeRefundOrRemoves });
		}

		handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
		handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

		handleSetAllRefundPercent = ({target}) => {
				const {financeBillings} = this.props;
				let financeRefundOrRemoves = Object.assign([], this.state.financeRefundOrRemoves)
				financeBillings && financeBillings.length > 0 && financeBillings.forEach(m => {
						let refundOrRemove = financeRefundOrRemoves && financeRefundOrRemoves.length > 0 && financeRefundOrRemoves.filter(f => f.id === m.financeBillingId)[0];
						if (refundOrRemove && refundOrRemove.id) {
								refundOrRemove.sum = target.value;
								financeRefundOrRemoves = financeRefundOrRemoves && financeRefundOrRemoves.length > 0 && financeRefundOrRemoves.filter(f => f.id !== m.financeBillingId);
						} else {
								refundOrRemove = { id: m.financeBillingId, sum: target.value };
						}
						financeRefundOrRemoves = financeRefundOrRemoves && financeRefundOrRemoves.length > 0 ? financeRefundOrRemoves.concat(refundOrRemove) : [refundOrRemove];
				})
				this.setState({ financeRefundOrRemoves, allRefundPercent: target.value });
		}

    render() {
        const {handleClose, financeBillings} = this.props;
				const {messageInfoIncomplete, isShowingModal_missingInfo, errors={}, allRefundPercent} = this.state;

				let refundPercentages = [];
				for(let i = 100; i >= 0; i -= 5) {
						let option = {id: i, label: i};
						refundPercentages = refundPercentages && refundPercentages.length > 0 ? refundPercentages.concat(option) : [option];
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
																	onChange={this.handleSetAllRefundPercent}/>
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
																							value={this.hasRefundPercent(m.financeBillingId)}
																							firstValue={-1}
																							options={refundPercentages}
																							className={styles.dropdown}
																							onChange={(event) => this.handleRefundPercent(m.financeBillingId, event)}
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
																	<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
															</div>
													</div>
											</div>
											{isShowingModal_missingInfo &&
													<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
														 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
											}
                  </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
