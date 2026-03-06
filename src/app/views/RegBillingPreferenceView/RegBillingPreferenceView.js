import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './RegBillingPreferenceView.css';
const p = 'RegBillingPreferenceView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import RadioGroup from '../../components/RadioGroup';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import checkWithroutingCode from '../../assets/CheckWithRoutingCode.png';
import {wait} from '../../utils/wait.js';

class RegBillingPreferenceView extends Component {
    constructor(props) {
	      super(props);

				let billingIncoming = props.billing || {};

	      this.state = {
						isShowingModal_error: false,
						errorBillingYearly: '',
						errorResponsiblePerson: '',
						errorPaymentType: '',
		        errorRouting: '',
		        errorBankAccount: '',
		        errorNameOnCard: '',
						errorCardNumber: '',
						errorExpiration: '',
						errorSecurityCode: '',
						errorCountry: '',
						errorStreetAddress: '',
						errorCity: '',
						errorPostalCode: '',
						billing: {
								command: "",
						    amount: "",
								billingType: billingIncoming.billingType,
								billingFrequency: billingIncoming.billingFrequency,
			          creditcard: {
										avs_street: billingIncoming.address1, //"1234 Main St.",
										avs_zip: billingIncoming.postalCode, //"12345",
										cardholder: billingIncoming.nameOnCard, //"John Doe",
										cvv: '', //"123",
										expiration: billingIncoming.expiration, //"0919",
										number: billingIncoming.cardNumber, //"4000100011112224"
								},
								check: {
						        accountholder: billingIncoming.accountholder, //"John Doe",
						        account: billingIncoming.account, //"324523524",
						        routing: billingIncoming.routing, //"123456789"
										accountType: billingIncoming.accountType,
						    },
								countryId: 251,
								responsiblePersonId: billingIncoming.responsiblePersonId,
								address1: billingIncoming.address1,
								address2: billingIncoming.address2,
								city: billingIncoming.city,
								uSStateId: billingIncoming.usstateId,
						}
	      }
    }

		// componentDidUpdate(prevProps) {
		// 		if (prevProps !== this.props) {
		// 				this.props.billing && this.setState({ billing: this.props.billing });
		// 		}
		// }

		componentWillUnmount() {
				this.props.clearPaymentProcessingResponse();
		}

    changeBilling = ({target}) => {
				if (target.name === 'billingType') {
						//let billingAmount = 0;  //HELP to do
						this.setState({
								billing: {
										...this.state.billing,
										billingType: target.value,
										command: target.value === 'BANKACCOUNT' ? 'check:sale' : 'cc:authonly',
									 	amount:  target.value === 'BANKACCOUNT' ? '0.05' : '0.05'
								}
						});
				} else {
						this.setState({ billing: {...this.state.billing, [target.name]: target.value} });
				}
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

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm("STAY");
    }

    processForm = () => { //, event
	      const {addOrUpdateBilling, personId, schoolYearId } = this.props;
	      let {billing} = this.state;
	      // prevent default action. in this case, action is the form submission event
	      //event && event.preventDefault();
	      let hasError = false;

				if (!billing.billingFrequency) {
	          hasError = true;
	          this.setState({errorBillingYearly: <L p={p} t={`Please choose between monthly and yearly billing`}/> });
	      }

				if (billing.responsiblePersonId === 'OTHER' && (!billing.responsibleFirstName || billing.responsibleFirstName.trim() === 0)) {
	          hasError = true;
	          this.setState({errorResponsibleFirstName: <L p={p} t={`Please and 'other' responsible person first name`}/> });
	      }
				if (billing.responsiblePersonId === 'OTHER' && (!billing.responsibleLastName || billing.responsibleLastName.trim() === 0)) {
	          hasError = true;
	          this.setState({errorResponsibleLastName: <L p={p} t={`Please and 'other' responsible person last name`}/> });
	      }
				if (!billing.countryId) {
	          hasError = true;
	          this.setState({errorCountry: <L p={p} t={`Please choose a country`}/> });
	      }
				if (!billing.creditcard || !billing.creditcard.avs_street || billing.creditcard.avs_street.length < 8) {
	          hasError = true;
	          this.setState({errorStreetAddress: <L p={p} t={`Please enter a street address`}/> });
	      }
				if (!billing.city || billing.city.length < 3) {
	          hasError = true;
	          this.setState({errorCity: <L p={p} t={`Please enter a city`}/> });
	      }
				if (!billing.creditcard || !billing.creditcard.avs_zip || billing.creditcard.avs_zip.length < 5) {
	          hasError = true;
	          this.setState({errorPostalCode: <L p={p} t={`Please enter a postal code`}/> });
	      }

				if (billing.billingType === 'BANKACCOUNT') {
						if (!billing.check || !billing.check.accountholder || billing.check.accountholder.length < 6) {
								hasError = true;
								this.setState({errorNameOnCard: <L p={p} t={`An account holder name is required`}/> });
						}
			      if (!billing.check || !billing.check.routing || billing.check.routing.length < 6) {
			          hasError = true;
			          this.setState({errorRouting: <L p={p} t={`A routing code is required`}/> });
			      }
						if (!billing.check || !billing.check.account || billing.check.account < 4) {
			          hasError = true;
			          this.setState({errorBankAccount: <L p={p} t={`An account number is required`}/> });
			      }
						if (!billing.check || !billing.check.accountType) {
			          hasError = true;
			          this.setState({errorBankAccountType: <L p={p} t={`An account type is required`}/> });
			      }

				}

				if (billing.billingType === 'CREDITCARD') {
						if (!billing.creditcard || !billing.creditcard.cardholder || billing.creditcard.cardholder.length < 6) {
								hasError = true;
								this.setState({errorNameOnCard: <L p={p} t={`A name on card is required`}/> });
						}
						if (!billing.creditcard || !billing.creditcard.number || billing.creditcard.number.length < 15) {
								hasError = true;
								this.setState({errorCardNumber: <L p={p} t={`A card number is required`}/> });
						}
						if (!billing.creditcard || !billing.creditcard.expiration || billing.creditcard.expiration.length < 4) {
			          hasError = true;
			          this.setState({errorExpiration: <L p={p} t={`An expiration date is required`}/> });
			      }
						if (!billing.creditcard || !billing.creditcard.cvv || billing.creditcard.cvv.length < 3) {
			          hasError = true;
			          this.setState({errorSecurityCode: <L p={p} t={`Please enter a security code`}/> });
			      }
				}

	      if (!hasError) {
						addOrUpdateBilling(personId, billing, schoolYearId);
						wait(2000);
						this.handleMessageOpen();
	      }
    }

		toggleCheckbox = (field) => {
        let person = this.state.person;
				person[field] = !person[field];
        this.setState({ person });
    }

		handleRadio = (field, value) => {
				let billing = {...this.state.billing};
				billing[field] = value;
				if (field === 'responsiblePersonId') {
						billing = this.setAddressFields(value);
				}
				this.setState({ billing });
		}

		setAddressFields = (responsiblePersonId) => {
				const {registration} = this.props;

				let guardian = {};
				if (registration && registration.guardianContacts && registration.guardianContacts) {
						guardian = registration.guardianContacts.primaryGuardians && registration.guardianContacts.primaryGuardians.length > 0
								&& registration.guardianContacts.primaryGuardians.filter(m => m.personId === responsiblePersonId)[0];

						if (!(guardian && guardian.fname)) {
								guardian = registration.guardianContacts.secondaryGuardians && registration.guardianContacts.secondaryGuardians.length > 0
										&& registration.guardianContacts.secondaryGuardians.filter(m => m.personId === responsiblePersonId)[0];

								if (!(guardian && guardian.fname)) {
										guardian = registration.guardianContacts.emergencyContacts && registration.guardianContacts.emergencyContacts.length > 0
												&& registration.guardianContacts.emergencyContacts.filter(m => m.personId === responsiblePersonId)[0]
								}
						}
				}

				let billing = this.state.billing;
				let creditcard = billing && billing.creditcard;
				billing.responsiblePersonId = responsiblePersonId;
				if (responsiblePersonId !== 'OTHER') {
						billing.responsibleFirstName = guardian.fname;
						billing.responsibleLastName = guardian.lname;
				}
				creditcard.avs_street = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.address1;
				billing.address1 = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.address1;
				billing.address2 = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.address2;
				billing.city = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.city;
				creditcard.city = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.city;
				creditcard.avs_city = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.city;
				creditcard.avs_zip = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.postalCode;
				billing.uSStateId = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? '' : guardian.usstateId;
				billing.countryId = !(guardian && guardian.fname) || responsiblePersonId === 'OTHER' ? 251 : guardian.countryId; //USA by default/
				billing.creditcard = creditcard;
				return billing;
		}

		handleRadioCheckAccount = (field, value) => {
				let billing = {...this.state.billing};
				billing.check = {...this.state.billing.check, [field]: value };
				this.setState({ billing });
		}

		handleMessageOpen = () => this.setState({ isShowingModal_error: true });
		handleMessageClose = () => {
				const {paymentProcessResponse} = this.props;
				this.setState({ isShowingModal_error: false });
				if (!paymentProcessResponse.error) {
						browserHistory.push(`/firstNav`);
						this.props.clearPaymentProcessingResponse();
				}
		}

    render() {
      const {countries, usStates, guardians, paymentProcessResponse, companyConfig={}} = this.props;
      const {billing={}, errorBillingYearly, errorPaymentType, errorRouting, errorBankAccount, errorNameOnCard, isShowingModal_error, errorResponsiblePerson,
							errorCardNumber, errorExpiration, errorSecurityCode, errorCountry, errorStreetAddress, errorCity, errorPostalCode,
							errorBankAccountType, errorResponsibleFirstName, errorResponsibleLastName} = this.state;

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  	<L p={p} t={`Billing Preference`}/>
                </div>
								<div className={classes(styles.instructions, styles.moreBottom)}>
										<L p={p} t={`Enrollments after July 25th will be billed on the date that the enrollment is accepted by Liahona.`}/>
								</div>
								<hr />
                <div className={classes(styles.formLeft, styles.moreBottom)}>
										<div className={styles.moreBottom}>
												<RadioGroup
														label={<L p={p} t={`Payment frequency`}/>}
														data={[{ label: <L p={p} t={`Monthly`}/>, id: "Monthly" }, { label: <L p={p} t={`Yearly`}/>, id: "Yearly" }]}
														name={`billingFrequency`}
														horizontal={true}
														className={styles.radio}
														initialValue={billing.billingFrequency}
														required={true}
														whenFilled={billing.billingFrequency}
														onClick={(value) => this.handleRadio('billingFrequency', value)}/>
												<span className={styles.error}>{errorBillingYearly}</span>
												{billing.billingFrequency === 'Monthly' && companyConfig.urlcode === 'Liahona' &&
														<div className={styles.instructions}>
																<L p={p} t={`Academy Payments will be drawn each month on the 25th for a period of 12 months (July to June).`}/>
																<L p={p} t={`Distance Education payments will be drawn each month on the 25th for a period of 9 months (August to April).`}/>
														</div>
												}
												{billing.billingFrequency === 'Yearly' && companyConfig.urlcode === 'Liahona' &&
														<div className={styles.instructions}>
																<L p={p} t={`* A single payment will be drafted on July 25th for the school year.`}/>
														</div>
												}
										</div>
										<hr />
										<div className={styles.moreBottom}>
												<div className={styles.classification}>Billing Address</div>
												<div className={styles.moreBottom}>
														<RadioGroup
																label={<L p={p} t={`Person Responsible For Payment`}/>}
																data={guardians.concat([{ id: 'OTHER', label: 'Other'}])}
																name={`responsiblePersonId`}
																horizontal={false}
																className={styles.radio}
																initialValue={billing.responsiblePersonId}
																required={true}
																whenFilled={billing.responsiblePersonId}
																onClick={(value) => this.handleRadio('responsiblePersonId', value)}/>
														<span className={styles.error}>{errorResponsiblePerson}</span>
												</div>
												{billing.responsiblePersonId === 'OTHER' &&
														<InputText
																id={`responsibleFirstName`}
																name={`responsibleFirstName`}
																size={"medium"}
																label={<L p={p} t={`Responsible person first name`}/>}
																value={billing.responsibleFirstName || ''}
																onChange={this.changeBilling}
																onEnterKey={this.handleEnterKey}
																required={true}
																whenFilled={billing.responsibleFirstName}
																error={errorResponsibleFirstName} />
												}
												{billing.responsiblePersonId === 'OTHER' &&
														<InputText
																id={`responsibleLastName`}
																name={`responsibleLastName`}
																size={"medium"}
																label={<L p={p} t={`Responsible person last name`}/>}
																value={billing.responsibleLastName || ''}
																onChange={this.changeBilling}
																onEnterKey={this.handleEnterKey}
																required={true}
																whenFilled={billing.responsibleLastName}
																error={errorResponsibleLastName} />
												}
												<InputText
														id={`avs_street`}
														name={`avs_street`}
														size={"medium"}
														label={<L p={p} t={`Address (line 1)`}/>}
														value={(billing.creditcard && billing.creditcard.avs_street) || ''}
														onChange={this.changeCreditCard}
														onEnterKey={this.handleEnterKey}
														required={true}
														whenFilled={billing.creditcard && billing.creditcard.avs_street}
														error={errorStreetAddress} />
												<InputText
														id={`address2`}
														name={`address2`}
														size={"medium"}
														label={<L p={p} t={`Address (line 2)`}/>}
														value={billing.address2 || ''}
														onChange={this.changeBilling}
														onEnterKey={this.handleEnterKey} />
												<InputText
														id={`city`}
														name={`city`}
														size={"medium"}
														label={<L p={p} t={`City`}/>}
														value={billing.city || ''}
														onChange={this.changeBilling}
														onEnterKey={this.handleEnterKey}
														required={true}
														whenFilled={billing.city}
														error={errorCity} />
												<SelectSingleDropDown
														id={`uSStateId`}
														name={`uSStateId`}
														label={<L p={p} t={`US State`}/>}
														value={Number(billing.uSStateId) || ''}
														options={usStates}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={this.changeBilling}
														onEnterKey={this.handleEnterKey} />
												<InputText
														id={`avs_zip`}
														name={`avs_zip`}
														size={"medium"}
														label={<L p={p} t={`Postal code`}/>}
														value={(billing.creditcard && billing.creditcard.avs_zip) || ''}
														onChange={this.changeCreditCard}
														onEnterKey={this.handleEnterKey}
														required={true}
														whenFilled={billing.creditcard && billing.creditcard.avs_zip}
														error={errorPostalCode} />
												<div>
														<SelectSingleDropDown
																id={`countryId`}
																name={`countryId`}
																label={<L p={p} t={`Country`}/>}
																value={billing.countryId || ''}
																options={countries}
																className={styles.moreBottomMargin}
																height={`medium`}
																onChange={this.changeBilling}
																onEnterKey={this.handleEnterKey}
																required={true}
																whenFilled={billing.countryId}
																error={errorCountry} />
												</div>
										</div>
										<div className={styles.classification}><L p={p} t={`Payment Preference`}/></div>
										{paymentProcessResponse.error && <div className={styles.processingError}>{`Error: ${paymentProcessResponse.error}`}</div>}
                    <div className={globalStyles.instructionsBigger}>
                        Your payment information is not saved by the school.  It is sent over a secure connection to the payment processing company to keep your information safe.
                    </div>
										<SelectSingleDropDown
                        id={`billingType`}
                        name={`billingType`}
                        label={<L p={p} t={`Payment type`}/>}
                        value={billing.billingType || ''}
                        options={[{id: 'BANKACCOUNT', label: `Bank Account`}, {id: 'CREDITCARD', label: `Credit Card*`}]}
                        className={styles.moreBottomMargin}
                        height={`medium`}
                        onChange={this.changeBilling}
                        onEnterKey={this.handleEnterKey}
												required={true}
												whenFilled={billing.billingType}
                        error={errorPaymentType} />

										{billing.billingType === 'CREDITCARD' &&
												<div>
														<InputText
																id={`cardholder`}
																name={`cardholder`}
																size={"medium"}
																label={<L p={p} t={`Name on card`}/>}
																value={(billing.creditcard && billing.creditcard.cardholder) || ''}
																onChange={this.changeCreditCard}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.creditcard && billing.creditcard.cardholder}
																error={errorNameOnCard}/>
														<InputText
																id={`number`}
																name={`number`}
																size={"medium"}
																label={<L p={p} t={`Card number`}/>}
																value={(billing.creditcard && billing.creditcard.number) || ''}
																onChange={this.changeCreditCard}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.creditcard && billing.creditcard.number}
																error={errorCardNumber}/>
														<InputText
																id={`expiration`}
																name={`expiration`}
																size={"medium"}
																label={<L p={p} t={`Expiration`}/>}
																value={(billing.creditcard && billing.creditcard.expiration) || ''}
																onChange={this.changeCreditCard}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.creditcard && billing.creditcard.expiration}
																error={errorExpiration}/>
														<InputText
																id={`cvv`}
																name={`cvv`}
																size={"medium"}
																label={<L p={p} t={`Security code`}/>}
																value={(billing.creditcard && billing.creditcard.cvv) || ''}
																onChange={this.changeCreditCard}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.creditcard && billing.creditcard.cvv}
																error={errorSecurityCode}/>
														<span className={styles.labelCredit}><L p={p} t={`*Credit card payments will be charged an additional 3% to cover credit card transaction expenses.`}/></span>
												</div>
										}

										{billing.billingType === 'BANKACCOUNT' &&
												<div>
														<img className={styles.checkWithroutingCode} src={checkWithroutingCode} alt={<L p={p} t={`Check example with routing code`}/>}/>
														<InputText
																id={`accountholder`}
																name={`accountholder`}
																size={"medium"}
																label={<L p={p} t={`Account holder's name`}/>}
																value={(billing.check && billing.check.accountholder) || ''}
																onChange={this.changeBankAccount}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.check && billing.check.accountholder}
																error={errorNameOnCard}/>
														<InputText
																id={`routing`}
																name={`routing`}
																size={"medium"}
																label={<L p={p} t={`Routing`}/>}
																value={(billing.check && billing.check.routing) || ''}
																onChange={this.changeBankAccount}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.check && billing.check.routing}
																error={errorRouting}/>
														<InputText
																id={`account`}
																name={`account`}
																size={"medium"}
																label={<L p={p} t={`Bank account`}/>}
																value={(billing.check && billing.check.account) || ''}
																onChange={this.changeBankAccount}
																onEnterKey={this.handleEnterKey}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.check && billing.check.account}
																error={errorBankAccount}/>
														<RadioGroup
																data={[{ label: "Checking", id: "checking" }, { label: "Savings", id: "savings" }, ]}
																name={`accountType`}
																label={<L p={p} t={`Account type`}/>}
																horizontal={true}
																initialValue={(billing.check && billing.check.accountType) || ''}
																autoComplete={'dontdoit'}
																required={true}
																whenFilled={billing.check && billing.check.accountType}
																onClick={(value) => this.handleRadioCheckAccount('accountType', value)}/>
														<span className={styles.error}>{errorBankAccountType}</span>
												</div>
										}
										{paymentProcessResponse.error && <div className={styles.processingError}>{`Error: ${paymentProcessResponse.error}`}</div>}
		                <div className={styles.centerRowRight}>
												<ButtonWithIcon label={<L p={p} t={`Finish`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("FINISH", event)}/>
		                </div>
								</div>
            </div>
            <OneFJefFooter />
						{isShowingModal_error &&
								<MessageModal handleClose={this.handleMessageClose} heading={<L p={p} t={`Payment Information Response`}/>}
									 explainJSX={paymentProcessResponse.error
										 	? <L p={p} t={`Unable to process this request.  Something is wrong with the billing information.  Please check your entry and try again`}/>
											: <L p={p} t={`The school has been notified of your completed registration.  You will receive an email for each student after the review process is complete.  You will then be given additional instructions.`}/>
									 }
									 onClick={this.handleMessageClose} />
						}
        </div>
    )};
}

export default RegBillingPreferenceView;
