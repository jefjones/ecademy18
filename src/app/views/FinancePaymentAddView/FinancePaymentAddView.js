import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import styles from './FinancePaymentAddView.css';
const p = 'FinancePaymentAddView';
import L from '../../components/PageLanguage';
import InputFile from '../../components/InputFile';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
import {formatNumber} from '../../utils/numberformat';
import {guidEmpty} from '../../utils/guidValidate';
import Checkbox from '../../components/Checkbox';
import InputTextArea from '../../components/InputTextArea';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import DateMoment from '../../components/DateMoment';
import DateTimePicker from '../../components/DateTimePicker';
import InputText from '../../components/InputText';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import Icon from '../../components/Icon';
import RadioGroup from '../../components/RadioGroup';
import EditTable from '../../components/EditTable';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import checkWithroutingCode from '../../assets/CheckWithRoutingCode.png';
import { withAlert } from 'react-alert';

class FinancePaymentAddView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					isShowingModal: false,
					fileUrl: '',
					isShowingModal_missingInfo: false,
					filter: {},
					financePayment: {
              personId: props.accessRoles.learner ? props.personId : '',
          },
					studentsAndAmounts: [],
					errors: {},
	    }
  }

	componentDidUpdate() {
			const {addNewLunchPayment, paramPersonId, students} = this.props;
			const {isInit, isInitPerson} = this.state;
			if (!isInit && addNewLunchPayment === 'addNewLunchPayment') {
					this.setState({ isInit: true, financePayment: {...this.state.financePayment, applyFundsTo: 'Lunch' }});
			} else if (!isInitPerson && paramPersonId && students && students.length > 0) {
					let paramPerson = students.filter(m => m.id === paramPersonId)[0];
					if (paramPerson && paramPerson.id) this.setState({ isInitPerson: true, financePayment: {...this.state.financePayment, personId: paramPerson.id }});
			}
	}

  processForm = (creditBalance) => {
      const {personId, addOrUpdateFinancePayment, accessRoles, financePaymentTypes} = this.props;
			const {selectedFinanceBillingIds, billing={}, financePayment={}, selectedFile} = this.state;
			let errors = {};
			let data = new FormData();
			data.append('file', selectedFile)
			let missingInfoMessage = [];

      //Don't allow the credit account to have the payment amount applied if this is a Credit Transfer payment type.
      if (financePayment.applyFundsTo === 'Credit') {
          let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePayment.financePaymentTypeId)[0];
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
							errors.nameOnCardAccount = <L p={p} t={`An account holder name is required`}/>;
					}
					if (!billing.routing || billing.routing.length < 6) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Routing code`}/></div>
							errors.routing = <L p={p} t={`A routing code is required`}/>;
					}
					if (!billing.bankAccount || billing.bankAccount < 4) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Account number`}/></div>
							errors.bankAccountNumber = <L p={p} t={`An account number is required`}/>;
					}
					if (!billing.accountType) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Account type`}/></div>
							errors.bankAccountType = <L p={p} t={`An account type is required`}/>;
					}

			}

			if (financePayment && financePayment.financePaymentTypeName && (financePayment.financePaymentTypeName === 'Credit Card' || financePayment.financePaymentTypeName === 'Debit Card')) {
					if (!billing.nameOnCardAccount || billing.nameOnCardAccount.length < 6) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Name on card`}/></div>
							errors.nameOnCardAccount = <L p={p} t={`A name on card is required`}/>;
					}
					if (!billing.creditCardNumber || billing.creditCardNumber.length < 15) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Card number`}/></div>
							errors.cardNumber = <L p={p} t={`A card number is required`}/>;
					}
					if (!billing.expiration || billing.expiration.length < 4) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`An expiration date is required`}/></div>
							errors.expiration = <L p={p} t={`An expiration date is required`}/>;
					}
					if (!billing.securityCode || billing.securityCode.length < 3) {
							missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please enter a security code`}/></div>
							errors.securityCode = <L p={p} t={`Please enter a security code`}/>;
					}
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
					this.setState({ errors });
			} else {
          const {getFinanceBillings} = this.props;
					const {selectedFinanceBillingIds, studentsAndAmounts, billing} = this.state;
					let financePayment = Object.assign({}, this.state.financePayment);
					financePayment.billing = billing;
					financePayment.financeBillingIds = selectedFinanceBillingIds;
					financePayment.studentsAndAmounts = studentsAndAmounts;
					financePayment.personId = accessRoles.admin ? financePayment.personId : personId;
          financePayment.fromCreditBalance = creditBalance;
          if (financePayment.financePaymentTypeName && financePayment.financePaymentTypeName.toLowerCase() === 'credit transfer' && creditBalance < financePayment.totalAmount) {
              financePayment.totalAmount = creditBalance;
          }

					if (!selectedFile) {
							addOrUpdateFinancePayment(personId, financePayment, () => getFinanceBillings(personId));
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
													financePayment.financePaymentTableId = response.data.financePaymentTableId;
											}
											addOrUpdateFinancePayment(personId, financePayment, () => getFinanceBillings(personId));
									})
					}
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The payment entry has been saved.`}/></div>)
					this.reset();
      }
  }

  checkCreditBalanceToPayment = (creditBalance, totalPaymentAmount) => {
      const {financePaymentTypes} = this.props;
      const {financePayment} = this.state;
      let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePayment.financePaymentTypeId)[0];
      return financePaymentType && financePaymentType.financePaymentTypeName && financePaymentType.financePaymentTypeName.length > 0
            && financePaymentType.financePaymentTypeName.toLowerCase() === 'credit transfer'
            && creditBalance < totalPaymentAmount
                ? true
                : false;
  }

	reset = () => {
			this.setState({
					fileUrl: '',
					filter: {},
					studentsAndAmounts: [],
					selectedFinanceBillingIds: [],
          financePayment: {
              personId: this.props.accessRoles.learner ? this.props.personId : '',
          },
					billing: {},
					errors: {},
					selectedFile: '',
			})
	}

	handleFilter = ({target}) => {
			let filter = Object.assign({}, this.state.filter);
			let field = target.name;
			filter[field] = target.value;
			this.setState({ filter });
	}

	handleChange = ({target}) => {
			let financePayment = Object.assign({}, this.state.financePayment);
			let field = target.name;
			if (field === 'studentPersonId' || field === 'guardianPersonId') {
					financePayment['personId'] = target.value;
			} else {
					financePayment[field] = target.value;
			}
			if (field === 'financePaymentTypeId') {
					const {financePaymentTypes} = this.props;
					let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePayment[field])[0];
					if (financePaymentType && financePaymentType.financePaymentTypeId) financePayment['financePaymentTypeName'] = financePaymentType.name;
			}
			this.setState({financePayment});
	}

	changeDate = (field, {target}) => {
			let filter = Object.assign({}, this.state.filter);
			filter[field] = target.value;
			this.setState({filter});
	}

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})
	handleInputFile = (file) => this.setState({ selectedFile: file });

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	resetClearTextValue = () => {
			this.setState({ clearStudent: false, clearGuardian: false, clearTeacher: false });
	}

	handleSelectedStudents = selectedStudents => this.setState({ filter: {...this.state.filter, selectedStudents }});
	handleSelectedFinanceFeeTypes = (selectedFinanceFeeTypes) => this.setState({ filter: {...this.state.filter, selectedFinanceFeeTypes }});


	includeSiblings = (event) => {
			const {students} = this.props;
			const {filter} = this.state;
			let studentPersonId = filter.selectedStudents && filter.selectedStudents.length > 0 && filter.selectedStudents[0].id;
			let student = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0];
			let primaryGuardianPersonId = student && student.primaryGuardianPersonId ? student.primaryGuardianPersonId : '';
			if (primaryGuardianPersonId) {
					let selectedStudents = students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === primaryGuardianPersonId);
					let noSiblingsFound = selectedStudents && selectedStudents.length === 1;
					this.setState({ filter: {...this.state.filter, selectedStudents, noSiblingsFound }});
			}
	}

	getSelectedBilling = (financeBillingId) => {
			const {selectedFinanceBillingIds} = this.state;
			return (selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0 && selectedFinanceBillingIds.indexOf(financeBillingId) > -1) || ''
	}

	toggleSelectedBilling = (financeBillingId) => {
			const {financeBillings} = this.props;
			let selectedFinanceBillingIds = Object.assign([], this.state.selectedFinanceBillingIds);
			if (selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0 && selectedFinanceBillingIds.indexOf(financeBillingId) > -1) {
					selectedFinanceBillingIds = selectedFinanceBillingIds.filter(id => id !== financeBillingId);
			} else {
					selectedFinanceBillingIds = selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0
							? selectedFinanceBillingIds.concat(financeBillingId)
							: [financeBillingId]
			}
			let totalAmount = 0;
			selectedFinanceBillingIds && selectedFinanceBillingIds.length > 0 && selectedFinanceBillingIds.forEach(id => {
					let financeBilling = financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.financeBillingId === id)[0];
					if (financeBilling && financeBilling.amount) totalAmount += isNaN(financeBilling.amount) ? 0 : financeBilling.amount*1;
			})
			this.setState({ financePayment: {...this.state.financePayment, totalAmount}, selectedFinanceBillingIds });
	}

	chooseRecord = (financeBillingId) => this.setState({ financeBillingId });
	handleApplyFundsTo = (applyFundsTo) => this.setState({ financePayment: {...this.state.financePayment, applyFundsTo }});

	handleMandatory = (value) => {
      let newState = Object.assign({}, this.state);
      newState['mandatoryOrOptional'] = value;
      this.setState(newState);
  }

	handleRadioCheckAccount = (field, value) => {
			let billing = {...this.state.billing};
			billing.check = {...this.state.billing.check, [field]: value };
			this.setState({ billing });
	}

	changeCreditCard = ({target}) => {
			let billing = this.state.billing;
			let creditcard = billing.creditcard || {};
			creditcard[target.name] = target.value;
			this.setState({ billing: {...this.state.billing, creditcard } });
	}

	changeBankAccount = ({target}) => {
			let billing = this.state.billing;
			let check = billing.check || {};
			check[target.name] = target.value;
			this.setState({ billing: {...this.state.billing, check } });
	}

 	handleCreditAmount = (studentPersonId, {target}) => {
			let studentsAndAmounts = Object.assign([], this.state.studentsAndAmounts);
			//If the studentPersonId already exists in studentsAndAmounts, then update the amount.  Otherwise, add a new one.
			let found = false;
			if (studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.indexOf(studentPersonId) > -1) found = true;
			studentsAndAmounts = studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.map(m => {
					if (m.id === studentPersonId) {
							m.sum = target.value;
							found = true;
					}
					return m;
			})
			if (!found) {
					let option = {
						id: studentPersonId,
						sum: target.value
					}
					studentsAndAmounts = studentsAndAmounts && studentsAndAmounts.length > 0 ? studentsAndAmounts.concat(option) : [option];
			}
			let totalAmount = 0;
			studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.forEach(m => {
					totalAmount += isNaN(m.sum) ? 0 : m.sum*1;
			})
			this.setState({ financePayment: {...this.state.financePayment, totalAmount}, studentsAndAmounts });
	}

	getStudentAmount = (studentPersonId) => {
			const {studentsAndAmounts} = this.state;
			let studentsAndAmount = studentsAndAmounts && studentsAndAmounts.length > 0 && studentsAndAmounts.filter(m => m.id === studentPersonId)[0];
			return studentsAndAmount && studentsAndAmount.sum ? studentsAndAmount.sum : '';
	}

	handleDescriptionOpen = (studentName, description) => this.setState({ isShowingModal_description: true, studentName, description });
	handleDescriptionClose = () => this.setState({ isShowingModal_description: false, studentName: '', description: '' });

  handleCreditLackingBalanceOpen = (creditBalance) => this.setState({ isShowingModal_lackingCredit: true, creditBalance })
  handleCreditLackingBalanceClose = () => this.setState({ isShowingModal_lackingCredit: false, creditBalance: '' })
  handleCreditLackingBalance = () => {
      const {creditBalance} = this.state;
      this.processForm(creditBalance);
      this.handleCreditLackingBalanceClose();
  }

  render() {
	    const {personId, students, myFrequentPlaces, setMyFrequentPlace, financeBillings, fetchingRecord, financeFeeTypes, financePaymentTypes,
							accessRoles, guardians, financeAccountSummaries} = this.props;
			const {errors, isShowingModal, fileUrl, messageInfoIncomplete, isShowingModal_missingInfo, financeBillingId, fromDate, toDate, mandatoryOrOptional,
							billing={}, financePayment={}, filter={}, isShowingModal_description, studentName, description, isShowingModal_lackingCredit} = this.state;

			let filteredBillings = financeBillings; // && financeBillings.length > 0 && financeBillings.filter(m => m.isPaid);

			if (filter.partialNameText) {
					let cutBackTextFilter = filter.partialNameText.toLowerCase();
					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.billedPersonName && m.billedPersonName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1));
			}

			if (filter.selectedStudents && filter.selectedStudents.length > 0) {
					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => {
							let found = false;
							filter.selectedStudents.forEach(s => {
									if (s.id === m.personId) found = true;
							})
							return found;
					});
			}

			if (filter.selectedFinanceFeeTypes && filter.selectedFinanceFeeTypes.length > 0) {
					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => {
							let found = false;
							filter.selectedFinanceFeeTypes.forEach(s => {
									if (s.id === m.financeFeeTypeId) found = true;
							})
							return found;
					});
			}

			if (fromDate && toDate) {
					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')) && toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (fromDate) {
					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => fromDate <= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			} else if (toDate) {
					filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.filter(m => toDate >= m.entryDate.substring(0, m.entryDate.indexOf('T')));
			}

			filteredBillings = filteredBillings && filteredBillings.length > 0 && filteredBillings.map((m, i) => {
					m.icons = <div className={classes(globalStyles.cellText, styles.moreTop)}>
												<Checkbox
														id={`billing${m.financeBillingId}`}
														name={`billing${m.financeBillingId}`}
														label={''}
														checked={this.getSelectedBilling(m.financeBillingId)}
														onClick={() => this.toggleSelectedBilling(m.financeBillingId)}/>
										</div>;

					m.fee = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
											{m.financeFeeTypeName}
									 </div>;
					m.name = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
											{m.billedPersonName}
									 </div>;
					m.billingAmount = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
																{`$${formatNumber(m.amount, true, false, 2)}`}
														 </div>;
				 m.files = <div className={classes(globalStyles.cellText, styles.row, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))}>
												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
														<a key={i} href={f.url} target={m.financeBillingId}><Icon pathName={'document0'} premium={true}/></a>
												)}
									 </div>;
				 m.glcodeName = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
														{m.financeGlcodeName}
												</div>;
				 m.refund = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
												{m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}
										</div>;
				 m.lowIncomeWaiverName = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
																{m.financeLowIncomeWaiverName}
														 </div>;
				 m.mandatory = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
																{m.mandatoryOrOptional}
														 </div>;
				 m.due = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
																<DateMoment date={m.dueDate}/>
														 </div>;
					m.group = <div onClick={() => this.chooseRecord(m.financeBillingId)} className={classes(globalStyles.cellText, styles.link, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))}>
												{m.financeGroupTableName}
										</div>;
					m.desc = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => {this.handleDescriptionOpen(m.billedPersonName, m.description); this.chooseRecord(m.financeBillingId);}}>
												{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
										</div>;
					m.entry = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
												<DateMoment date={m.entryDate}/>
										</div>;
					m.entryPerson = <div className={classes(globalStyles.cellText, (m.financeBillingId === financeBillingId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m.financeBillingId)}>
															{m.entryPersonName}
													</div>;

					return m;
			});

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
		];

    //Credit payments
    //Only show the CreditTransfer optin in the Payment Type list if the student chosen (not the parent) has a credit balance to apply . And show that credit balance.
    let financePaymentTypesLocal = Object.assign([], financePaymentTypes);
    let creditBalance = 0;
    let accountSummary = financePayment.personId && financeAccountSummaries && financeAccountSummaries.length > 0 && financeAccountSummaries.filter(m => m.personId === financePayment.personId)[0];
    if (accountSummary && accountSummary.creditAccount) creditBalance = accountSummary.creditAccount;
    if (!creditBalance) financePaymentTypesLocal = financePaymentTypesLocal && financePaymentTypesLocal.length > 0 && financePaymentTypesLocal.filter(m => m.label.toLowerCase() !== 'credit transfer');

    //ApllyFundsTo option should not show the credit account option if the Credit Transfer is chosen.  That is a transfer option in the transfer view.  Puls we wouldn't want someone to transfer credits to thei rown account and increase it with their own credit.
    let applyFundsToLocal = [
        { label: 'Billing', id: 'Billing' },
        { label: 'Lunch account', id: 'Lunch' },
    ]
    let financePaymentType = financePaymentTypesLocal && financePaymentTypesLocal.length > 0 && financePaymentTypesLocal.filter(m => m.financePaymentTypeId === financePayment.financePaymentTypeId)[0];
    if (!(financePaymentType && financePaymentType.name.toLowerCase() === 'credit transfer')) applyFundsToLocal = applyFundsToLocal.concat({ label: 'Credit account', id: 'Credit' });

		let headings = [{label: <L p={p} t={`Student`}/>},{label: <L p={p} t={`Grade level`}/>}, {label: <L p={p} t={`Amount`}/>}];

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
													//value={this.getFinanceCreditAmount(m.id)}
													value={this.getStudentAmount(m.id) || ''}
													onChange={(event) => this.handleCreditAmount(m.id, event)}/>
						},
				]
		);

		data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}><L p={p} t={`Please choose at least one student`}/></div>, colSpan: 4}]];


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
														onChange={this.handleChange}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={`guardianPersonId`}
														name={`guardianPersonId`}
														label={<L p={p} t={`Paid by guardian/parent`}/>}
														height={'medium'}
														value={financePayment.personId || ''}
														options={guardians}
														onChange={this.handleChange}/>
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
								onClick={this.handleApplyFundsTo}/>
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
    										onChange={this.handleChange}/>
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
												onChange={this.changeCreditCard}
												onEnterKey={this.handleEnterKey}
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
												onChange={this.changeCreditCard}
												onEnterKey={this.handleEnterKey}
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
												onChange={this.changeCreditCard}
												onEnterKey={this.handleEnterKey}
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
												onChange={this.changeCreditCard}
												onEnterKey={this.handleEnterKey}
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
														onChange={this.changeBankAccount}
														onEnterKey={this.handleEnterKey}
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
														onChange={this.changeBankAccount}
														onEnterKey={this.handleEnterKey}
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
														onChange={this.changeBankAccount}
														onEnterKey={this.handleEnterKey}
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
														onClick={(value) => this.handleRadioCheckAccount('accountType', value)}/>
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
												onChange={this.handleChange}/>
								</div>
								<div className={styles.moreSpace}>
										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
								</div>
						</div>
						<div className={classes(styles.muchLeft, styles.row)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.push('/financePaymentList')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={() => {this.checkCreditBalanceToPayment(creditBalance, financePayment.totalAmount) ? this.handleCreditLackingBalanceOpen(creditBalance) : this.processForm(creditBalance)}}/>
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
    												onChange={this.handleSelectedStudents}
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
    																onChange={this.handleFilter}/>
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
    																onChange={this.handleSelectedFinanceFeeTypes}/>
    												</div>
    												{filter.selectedStudents && filter.selectedStudents.length === 1 &&
    														<div className={classes(styles.siblingPosition, styles.smallWidth, styles.row, styles.moreRight)}>
    																<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={this.includeSiblings} addClassName={styles.smallButton}/>
    																<div className={classes(styles.label, styles.labelPosition)}>{filter.noSiblingsFound ? <L p={p} t={`No siblings found`}/> : <L p={p} t={`Include siblings`}/>}</div>
    														</div>
    												}
    												<div className={classes(styles.moreRight, styles.row, styles.dateRow)}>
    														<div className={styles.moreRight}>
    																<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={filter.fromDate} maxDate={filter.toDate}
    																		onChange={(event) => this.changeDate('fromDate', event)}/>
    														</div>
    														<div className={styles.muchRight}>
    																<DateTimePicker id={`toDate`} value={filter.toDate} label={<L p={p} t={`To date`}/>} minDate={filter.fromDate ? filter.fromDate : ''}
    																		onChange={(event) => this.changeDate('toDate', event)}/>
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
    															onClick={this.handleMandatory}/>
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
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
						{isShowingModal_description &&
								<MessageModal handleClose={this.handleDescriptionClose} heading={studentName} explain={description} onClick={this.handleDescriptionClose} />
						}
            {isShowingModal_lackingCredit &&
								<MessageModal handleClose={this.handleCreditLackingBalanceClose} heading={<L p={p} t={`Credit Balance less then Payment Total`}/>} isConfirmType={true}
                    explainJSX={<L p={p} t={`The credit balance for this Credit Transfer is less than the total payment amount.  Do you want the credit amount to be applied as much as possible and then return to this page again to pay the rest with another payment method?`}/>}
                    onClick={this.handleCreditLackingBalance} />
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Payment`}/>} path={'financePaymentAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinancePaymentAddView);
