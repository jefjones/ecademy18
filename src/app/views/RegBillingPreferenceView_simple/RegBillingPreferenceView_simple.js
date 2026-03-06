import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './RegBillingPreferenceView_simple.css';
const p = 'RegBillingPreferenceView_simple';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {wait} from '../../utils/wait.js';

class RegBillingPreferenceView_simple extends Component {
    constructor(props) {
	      super(props);

				let billingIncoming = props.billing || {};

	      this.state = {
						isShowingModal_error: false,
		        errorNameOnCard: '',
						errorCardNumber: '',
						errorExpiration: '',
						errorSecurityCode: '',
						errorCountry: '',
						errorStreetAddress: '',
						errorCity: '',
						errorPostalCode: '',
						billing: {
						    amount: "",
			          creditcard: {
										avs_street: billingIncoming.address1, //"1234 Main St.",
										avs_zip: billingIncoming.postalCode, //"12345",
										cardholder: billingIncoming.nameOnCard, //"John Doe",
										cvv: '', //"123",
										expiration: billingIncoming.expiration, //"0919",
										number: billingIncoming.cardNumber, //"4000100011112224"
								},
								countryId: 251,
						}
	      }
    }

		componentWillUnmount() {
				this.props.clearPaymentProcessingResponse();
		}

    //***************** ZIFT BEGIN *****************

    ZiftPost = (url, body, clientCallBack) => {
        var script = document.createElement('script');
        document.getElementsByTagName('head')[0].appendChild(script);
        script.setAttribute('type', 'text/javascript');
        this.ZiftHttpPost(url, body, script, clientCallBack);
    };

    ZiftFormRequest = (CCNumber, clientCallBack) => {
        var url = "https://sandbox-secure.zift.io/services/proxynization?";
        var body = "accountNumber="+CCNumber+"&callback=clientCallBack&password=" + this.props.proxynizationTempPassword;
        this.ZiftPost(url, body, clientCallBack);
    };

    ZiftProcess = (accountNumber, clientCallBack) => {
        if (accountNumber == null || typeof accountNumber == "undefined" || accountNumber == '') //eslint-disable-line
        {
            eval(callbackName)('V01','accountNumber is required parameter','null'); return; //eslint-disable-line
        }

        if (accountNumber.charAt(0) == '#') //eslint-disable-line
        {
            var accountNumberName = accountNumber.slice(1,accountNumber.length);
            var accountValue = this.ZiftEscapeHtml(document.getElementById(accountNumberName).value);
            document.getElementById(accountNumberName).value = this.ZiftGetAccountNumberMask(accountValue);
        }
        else
        {
            var accountValue = this.ZiftEscapeHtml(accountNumber); //eslint-disable-line
        }

        try {
            this.ZiftFormRequest(accountValue, clientCallBack);
        } catch (ex) {
            this.callbackName('E02','Communication error','null');
        }
    };

    ZiftGetAccountNumberMask = (accountNumber) => {
        var maskedAccountNumber;
        if(!accountNumber) { return accountNumber; }

        maskedAccountNumber = accountNumber.substring(0,accountNumber.length-4).replace(/./g,"*").concat(accountNumber.substring(accountNumber.length-4)); return maskedAccountNumber;
    };

    ZiftEscapeHtml = (unsafe) => {
        if(typeof unsafe === "string" ) {
            return ('' + unsafe).replace(/&/g, "&").replace(/"/g, '""').replace(/'/g, "'"); } else { return ('' + unsafe)
        }
    };

    ZiftHttpPost = (theUrl, data, script, clientCallback) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', theUrl, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {  //eslint-disable-line
                let result = xhr.response;
                let responseCode = result.substring(result.indexOf('responseCode'));
                responseCode = responseCode.substring(14, responseCode.indexOf("',"));
                let responseMessage = result.substring(result.indexOf('responseMessage'));
                responseMessage = responseMessage.substring(17, responseMessage.indexOf("',"));
                let proxyNumber = result.substring(result.indexOf('accountNumber'));
                proxyNumber = proxyNumber.substring(15, proxyNumber.indexOf("')"));

                clientCallback(responseCode, responseMessage, proxyNumber);
            }
        };
    }

    //************** Zift END ****************

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

    handleEnterKey = (event) => {
        event.key === "Enter" && this.processForm("STAY");
    }

    clientCallback = (responseCode, responseMessage, proxyNumber) => {
        // const {addOrUpdateBilling, personId, schoolYearId } = this.props;
        // const {billing} = this.state;


        if(responseCode === "A01"){
          alert('The token is ' + proxyNumber)
          console.log('proxyNumber', proxyNumber);
            // billing.creditcard.number = proxyNumber;
            // billing.creditcard.expiration = '';
            // billing.creditcard.cvv = '';
            // addOrUpdateBilling(personId, billing, schoolYearId);
  					// wait(2000);
  					// this.handleMessageOpen();
        } else{
            alert(responseMessage);
            return false;
        }
    }

    processForm = () => { //, event
	      let {billing} = this.state;
	      // prevent default action. in this case, action is the form submission event
	      //event && event.preventDefault();
	      let hasError = false;

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

	      if (!hasError) {
            this.ZiftProcess(billing.creditcard.number, this.clientCallback);
	      }
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
      const {countries, usStates, paymentProcessResponse} = this.props;
      const {billing={}, errorNameOnCard, isShowingModal_error, errorCardNumber, errorExpiration, errorSecurityCode, errorCountry, errorStreetAddress, errorCity, errorPostalCode } = this.state;

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  	<L p={p} t={`Billing`}/>
                </div>
                <div className={classes(styles.formLeft, styles.moreBottom)}>
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
										<div className={styles.moreBottom}>
												<div className={styles.classification}>Billing Address</div>
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
										<div className={styles.moreTop}>
                        <div className={styles.classification}>Credit card</div>
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
										</div>
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

export default RegBillingPreferenceView_simple;
