import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './RegBillingPreferenceView_simple.css'
const p = 'RegBillingPreferenceView_simple'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {wait} from '../../utils/wait'

function RegBillingPreferenceView_simple(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_error, setIsShowingModal_error] = useState(false)
  const [errorNameOnCard, setErrorNameOnCard] = useState('')
  const [errorCardNumber, setErrorCardNumber] = useState('')
  const [errorExpiration, setErrorExpiration] = useState('')
  const [errorSecurityCode, setErrorSecurityCode] = useState('')
  const [errorCountry, setErrorCountry] = useState('')
  const [errorStreetAddress, setErrorStreetAddress] = useState('')
  const [errorCity, setErrorCity] = useState('')
  const [errorPostalCode, setErrorPostalCode] = useState('')
  const [billing, setBilling] = useState({
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
						})
  const [amount, setAmount] = useState("")
  const [avs_street, setAvs_street] = useState(billingIncoming.address1)
  const [avs_zip, setAvs_zip] = useState(billingIncoming.postalCode)
  const [cardholder, setCardholder] = useState(billingIncoming.nameOnCard)
  const [cvv, setCvv] = useState('')
  const [expiration, setExpiration] = useState(billingIncoming.expiration)
  const [number, setNumber] = useState(billingIncoming.cardNumber)
  const [countryId, setCountryId] = useState(251)
  const [billingType, setBillingType] = useState(undefined)
  const [command, setCommand] = useState(undefined)
  const [p, setP] = useState(undefined)

  useEffect(() => {
    return () => {
      
      				props.clearPaymentProcessingResponse()
      		
    }
  }, [])

  const ZiftPost = (url, body, clientCallBack) => {
    
            const script = document.createElement('script')
            document.getElementsByTagName('head')[0].appendChild(script)
            script.setAttribute('type', 'text/javascript')
            ZiftHttpPost(url, body, script, clientCallBack)
        
  }

  const ZiftFormRequest = (CCNumber, clientCallBack) => {
    
            const url = "https://sandbox-secure.zift.io/services/proxynization?"
            const body = "accountNumber="+CCNumber+"&callback=clientCallBack&password=" + props.proxynizationTempPassword
            ZiftPost(url, body, clientCallBack)
        
  }

  const ZiftProcess = (accountNumber, clientCallBack) => {
    
            if (accountNumber == null || typeof accountNumber == "undefined" || accountNumber == '') //eslint-disable-line
            {
                eval(callbackName)('V01','accountNumber is required parameter','null'); return; //eslint-disable-line
            }
    
            if (accountNumber.charAt(0) == '#') //eslint-disable-line
            {
                const accountNumberName = accountNumber.slice(1,accountNumber.length)
                let accountValue = ZiftEscapeHtml(document.getElementById(accountNumberName).value)
                document.getElementById(accountNumberName).value = ZiftGetAccountNumberMask(accountValue)
            }
            else
            {
                const accountValue = ZiftEscapeHtml(accountNumber); //eslint-disable-line
            }
    
            try {
                ZiftFormRequest(accountValue, clientCallBack)
            } catch (ex) {
                callbackName('E02','Communication error','null')
            }
        
  }

  const ZiftGetAccountNumberMask = (accountNumber) => {
    
            let maskedAccountNumber
            if(!accountNumber) { return accountNumber; }
    
            maskedAccountNumber = accountNumber.substring(0,accountNumber.length-4).replace(/./g,"*").concat(accountNumber.substring(accountNumber.length-4)); return maskedAccountNumber
        
  }

  const ZiftEscapeHtml = (unsafe) => {
    
            if(typeof unsafe === "string" ) {
                return ('' + unsafe).replace(/&/g, "&").replace(/"/g, '""').replace(/'/g, "'"); } else { return ('' + unsafe)
            }
        
  }

  const ZiftHttpPost = (theUrl, data, script, clientCallback) => {
    
            const xhr = new XMLHttpRequest()
            xhr.open('POST', theUrl, true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            xhr.send(data)
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {  //eslint-disable-line
                    let result = xhr.response
                    let responseCode = result.substring(result.indexOf('responseCode'))
                    responseCode = responseCode.substring(14, responseCode.indexOf("',"))
                    let responseMessage = result.substring(result.indexOf('responseMessage'))
                    responseMessage = responseMessage.substring(17, responseMessage.indexOf("',"))
                    let proxyNumber = result.substring(result.indexOf('accountNumber'))
                    proxyNumber = proxyNumber.substring(15, proxyNumber.indexOf("')"))
    
                    clientCallback(responseCode, responseMessage, proxyNumber)
                }
            }
        
  }

  const changeBilling = ({target}) => {
    
    				if (target.name === 'billingType') {
    						//let billingAmount = 0;  //HELP to do
    						setBilling({
    										...billing,
    										billingType: target.value,
    										command: target.value === 'BANKACCOUNT' ? 'check:sale' : 'cc:authonly',
    									 	amount:  target.value === 'BANKACCOUNT' ? '0.05' : '0.05'
    								})
    				} else {
    						setBilling({...billing, [target.name]: target.value})
    				}
        
  }

  const changeCreditCard = ({target}) => {
    
    				let creditcard = billing.creditcard || {}
    				creditcard[target.name] = target.value
    	      setBilling({...billing, creditcard })
        
  }

  const handleEnterKey = (event) => {
    
            event.key === "Enter" && processForm("STAY")
        
  }

  const clientCallback = (responseCode, responseMessage, proxyNumber) => {
    // TODO: handle payment callback response
  }

  const processForm = () => {
     //, event
    	      // prevent default action. in this case, action is the form submission event
    	      //event && event.preventDefault();
    	      let hasError = false
    
    				if (!billing.countryId) {
    	          hasError = true
    	          setErrorCountry(<L p={p} t={`Please choose a country`}/>)
    	      }
    				if (!billing.creditcard || !billing.creditcard.avs_street || billing.creditcard.avs_street.length < 8) {
    	          hasError = true
    	          setErrorStreetAddress(<L p={p} t={`Please enter a street address`}/>)
    	      }
    				if (!billing.city || billing.city.length < 3) {
    	          hasError = true
    	          setErrorCity(<L p={p} t={`Please enter a city`}/>)
    	      }
    				if (!billing.creditcard || !billing.creditcard.avs_zip || billing.creditcard.avs_zip.length < 5) {
    	          hasError = true
    	          setErrorPostalCode(<L p={p} t={`Please enter a postal code`}/>)
    	      }
    
    				if (!billing.creditcard || !billing.creditcard.cardholder || billing.creditcard.cardholder.length < 6) {
    						hasError = true
    						setErrorNameOnCard(<L p={p} t={`A name on card is required`}/>)
    				}
    				if (!billing.creditcard || !billing.creditcard.number || billing.creditcard.number.length < 15) {
    						hasError = true
    						setErrorCardNumber(<L p={p} t={`A card number is required`}/>)
    				}
    				if (!billing.creditcard || !billing.creditcard.expiration || billing.creditcard.expiration.length < 4) {
    	          hasError = true
    	          setErrorExpiration(<L p={p} t={`An expiration date is required`}/>)
    	      }
    				if (!billing.creditcard || !billing.creditcard.cvv || billing.creditcard.cvv.length < 3) {
    	          hasError = true
    	          setErrorSecurityCode(<L p={p} t={`Please enter a security code`}/>)
    	      }
    
    	      if (!hasError) {
                ZiftProcess(billing.creditcard.number, clientCallback)
    	      }
        
  }

  const handleMessageOpen = () => {
    return setIsShowingModal_error(true)
  }

  const handleMessageClose = () => {
    
    				const {paymentProcessResponse} = props
    				setIsShowingModal_error(false)
    				if (!paymentProcessResponse.error) {
    						navigate(`/firstNav`)
    						props.clearPaymentProcessingResponse()
    				}
    		
  }

  
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
                          onChange={changeCreditCard}
                          onEnterKey={handleEnterKey}
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
  														onChange={changeCreditCard}
  														onEnterKey={handleEnterKey}
  														required={true}
  														whenFilled={billing.creditcard && billing.creditcard.avs_street}
  														error={errorStreetAddress} />
  												<InputText
  														id={`address2`}
  														name={`address2`}
  														size={"medium"}
  														label={<L p={p} t={`Address (line 2)`}/>}
  														value={billing.address2 || ''}
  														onChange={changeBilling}
  														onEnterKey={handleEnterKey} />
  												<InputText
  														id={`city`}
  														name={`city`}
  														size={"medium"}
  														label={<L p={p} t={`City`}/>}
  														value={billing.city || ''}
  														onChange={changeBilling}
  														onEnterKey={handleEnterKey}
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
  														onChange={changeBilling}
  														onEnterKey={handleEnterKey} />
  												<InputText
  														id={`avs_zip`}
  														name={`avs_zip`}
  														size={"medium"}
  														label={<L p={p} t={`Postal code`}/>}
  														value={(billing.creditcard && billing.creditcard.avs_zip) || ''}
  														onChange={changeCreditCard}
  														onEnterKey={handleEnterKey}
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
  																onChange={changeBilling}
  																onEnterKey={handleEnterKey}
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
  														onChange={changeCreditCard}
  														onEnterKey={handleEnterKey}
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
  														onChange={changeCreditCard}
  														onEnterKey={handleEnterKey}
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
  														onChange={changeCreditCard}
  														onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={billing.creditcard && billing.creditcard.cvv}
  														error={errorSecurityCode}/>
  										</div>
  										{paymentProcessResponse.error && <div className={styles.processingError}>{`Error: ${paymentProcessResponse.error}`}</div>}
  		                <div className={styles.centerRowRight}>
  												<ButtonWithIcon label={<L p={p} t={`Finish`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("FINISH", event)}/>
  		                </div>
  								</div>
              </div>
              <OneFJefFooter />
  						{isShowingModal_error &&
  								<MessageModal handleClose={handleMessageClose} heading={<L p={p} t={`Payment Information Response`}/>}
  									 explainJSX={paymentProcessResponse.error
  										 	? <L p={p} t={`Unable to process this request.  Something is wrong with the billing information.  Please check your entry and try again`}/>
  											: <L p={p} t={`The school has been notified of your completed registration.  You will receive an email for each student after the review process is complete.  You will then be given additional instructions.`}/>
  									 }
  									 onClick={handleMessageClose} />
  						}
          </div>
      )
}

export default RegBillingPreferenceView_simple
