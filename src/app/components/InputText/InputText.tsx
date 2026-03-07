import { useState } from 'react'
import * as styles from './InputText.css'
import classes from 'classnames'
import MessageModal from '../MessageModal'
import Required from '../Required'
const p = 'component'
import L from '../../components/PageLanguage'

function InputText(props) {
  const [isShowingModal_numberOnly, setIsShowingModal_numberOnly] = useState(false)
  const [isShowingModal_greaterThan, setIsShowingModal_greaterThan] = useState(false)

  const {name, label, placeholder, value, defaultValue, error, isPasswordType=false, size, height, maxLength=100, inputClassName="",
              	labelClass="", onEnterKey, noShadow, instructions, instructionsBelow, required=false, whenFilled, autoFocus, onBlur,
              	onChange, autoComplete, onDoubleClick,
  		} = props

  const isNumbersOnly = (e) => {
    if (/^\d*$/.test(e.target.value)) {
      if (onChange) onChange(e)
    } else {
      setIsShowingModal_numberOnly(true)
    }
  }

  const handleNumberOnlyClose = () => setIsShowingModal_numberOnly(false)
  const handleGreaterThanMaxClose = () => setIsShowingModal_greaterThan(false)

  		  return (
  		    <div className={classes(styles.container, inputClassName)}>
  		        <div className={styles.row}>
  		            {label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
  		            <Required setIf={required} setWhen={whenFilled}/>
  		        </div>
  						<div className={instructionsBelow ? styles.column : styles.row}>
  		            <input
  		                onChange={isNumbersOnly}
  		                onKeyPress={onEnterKey}
  		                type={isPasswordType ? `password` : `text`}
  		                id={name}
  		                name={name}
  		                autoFocus={autoFocus}
  		                placeholder={placeholder}
  										onBlur={onBlur}
  										autoComplete={autoComplete}
  										onDoubleClick={onDoubleClick}
  		                maxLength={maxLength || 100}
  		                className={classes(styles[`size${height}`], noShadow ? styles.noShadow : '',
  		                   size === `medium-left` ? styles.cutRight : '',
  		                   size === `medium-right` ? styles.cutLeft : '',
  		                   size === `long` || size === `bigtext`
  											 		? styles.input_long
  													: size === `medium`
  															? styles.input_medium
  															: (size === `medium-short`  || size === `medium-left` || size === `medium-right`)
  																	? styles.input_mediumShort
  																	: size === `medium-long`
  																			? styles.input_mediumLong
  																			: size === `super-short`
  																					? styles.input_superShort
  																					: styles.input_short)
  										}
  		                value={value}
  		                defaultValue={defaultValue}/>
  		            <span className={styles.instructions}>{instructions}</span>
  		        </div>
  		        {error && <div className={styles.alertMessage}>{error}</div>}
  						{isShowingModal_numberOnly &&
  	                <MessageModal handleClose={handleNumberOnlyClose} heading={<L p={p} t={`Numbers Only`}/>}
  	                   explainJSX={<L p={p} t={`Please enter numbers only.`}/>} onClick={handleNumberOnlyClose} />
  	          }
  						{isShowingModal_greaterThan &&
  	                <MessageModal handleClose={handleGreaterThanMaxClose} heading={<L p={p} t={`Number is Over the Limit`}/>}
  	                   explainJSX={<L p={p} t={`The number you entered is greater than the maximum allowed.`}/>} onClick={handleGreaterThanMaxClose} />
  	          }
  		    </div>
  		  )
}
export default InputText
