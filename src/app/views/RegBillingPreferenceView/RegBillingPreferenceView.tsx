import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './RegBillingPreferenceView.css'
const p = 'RegBillingPreferenceView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import RadioGroup from '../../components/RadioGroup'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import checkWithroutingCode from '../../assets/CheckWithRoutingCode.png'
import {wait} from '../../utils/wait'

function RegBillingPreferenceView(props) {
  const [isShowingModal_error, setIsShowingModal_error] = useState(false)
  const [errorBillingYearly, setErrorBillingYearly] = useState('')
  const [errorResponsiblePerson, setErrorResponsiblePerson] = useState('')
  const [errorPaymentType, setErrorPaymentType] = useState('')
  const [errorRouting, setErrorRouting] = useState('')
  const [errorBankAccount, setErrorBankAccount] = useState('')
  const [errorNameOnCard, setErrorNameOnCard] = useState('')
  const [errorCardNumber, setErrorCardNumber] = useState('')
  const [errorExpiration, setErrorExpiration] = useState('')
  const [errorSecurityCode, setErrorSecurityCode] = useState('')
  const [errorCountry, setErrorCountry] = useState('')
  const [errorStreetAddress, setErrorStreetAddress] = useState('')
  const [errorCity, setErrorCity] = useState('')
  const [errorPostalCode, setErrorPostalCode] = useState('')
  const [billing, setBilling] = useState({
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
						})
  const [command, setCommand] = useState("")
  const [amount, setAmount] = useState("")
  const [billingType, setBillingType] = useState(billingIncoming.billingType)
  const [billingFrequency, setBillingFrequency] = useState(billingIncoming.billingFrequency)
  const [creditcard, setCreditcard] = useState({
										avs_street: billingIncoming.address1, //"1234 Main St.",
										avs_zip: billingIncoming.postalCode, //"12345",
										cardholder: billingIncoming.nameOnCard, //"John Doe",
										cvv: '', //"123",
										expiration: billingIncoming.expiration, //"0919",
										number: billingIncoming.cardNumber, //"4000100011112224"
								})
  const [avs_street, setAvs_street] = useState(billingIncoming.address1)
  const [avs_zip, setAvs_zip] = useState(billingIncoming.postalCode)
  const [cardholder, setCardholder] = useState(billingIncoming.nameOnCard)
  const [cvv, setCvv] = useState('')
  const [expiration, setExpiration] = useState(billingIncoming.expiration)
  const [number, setNumber] = useState(billingIncoming.cardNumber)
  const [check, setCheck] = useState({
						        accountholder: billingIncoming.accountholder, //"John Doe",
						        account: billingIncoming.account, //"324523524",
						        routing: billingIncoming.routing, //"123456789"
										accountType: billingIncoming.accountType,
						    })
  const [accountholder, setAccountholder] = useState(billingIncoming.accountholder)
  const [account, setAccount] = useState(billingIncoming.account)
  const [routing, setRouting] = useState(billingIncoming.routing)
  const [accountType, setAccountType] = useState(billingIncoming.accountType)
  const [countryId, setCountryId] = useState(251)
  const [responsiblePersonId, setResponsiblePersonId] = useState(billingIncoming.responsiblePersonId)
  const [address1, setAddress1] = useState(billingIncoming.address1)
  const [address2, setAddress2] = useState(billingIncoming.address2)
  const [city, setCity] = useState(billingIncoming.city)
  const [uSStateId, setUSStateId] = useState(billingIncoming.usstateId)
  const [p, setP] = useState(undefined)
  const [errorResponsibleFirstName, setErrorResponsibleFirstName] = useState(<L p={p} t={`Please and 'other' responsible person first name`}/>)
  const [errorResponsibleLastName, setErrorResponsibleLastName] = useState(<L p={p} t={`Please and 'other' responsible person last name`}/>)
  const [errorBankAccountType, setErrorBankAccountType] = useState(<L p={p} t={`An account type is required`}/>)

  useEffect(() => {
    return () => {
      
      				props.clearPaymentProcessingResponse()
      		
    }
  }, [])

  const {countries, usStates, guardians, paymentProcessResponse, companyConfig={}} = props
  
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
  														onClick={(value) => handleRadio('billingFrequency', value)}/>
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
  																onClick={(value) => handleRadio('responsiblePersonId', value)}/>
  														<span className={styles.error}>{errorResponsiblePerson}</span>
  												</div>
  												{billing.responsiblePersonId === 'OTHER' &&
  														<InputText
  																id={`responsibleFirstName`}
  																name={`responsibleFirstName`}
  																size={"medium"}
  																label={<L p={p} t={`Responsible person first name`}/>}
  																value={billing.responsibleFirstName || ''}
  																onChange={changeBilling}
  																onEnterKey={handleEnterKey}
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
  																onChange={changeBilling}
  																onEnterKey={handleEnterKey}
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
                          onChange={changeBilling}
                          onEnterKey={handleEnterKey}
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
  																onChange={changeCreditCard}
  																onEnterKey={handleEnterKey}
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
  																onChange={changeBankAccount}
  																onEnterKey={handleEnterKey}
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
  																onChange={changeBankAccount}
  																onEnterKey={handleEnterKey}
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
  																onChange={changeBankAccount}
  																onEnterKey={handleEnterKey}
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
  																onClick={(value) => handleRadioCheckAccount('accountType', value)}/>
  														<span className={styles.error}>{errorBankAccountType}</span>
  												</div>
  										}
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

export default RegBillingPreferenceView
