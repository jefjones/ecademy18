import { useState } from 'react'
import styles from './InputTextArea.css'
import classes from 'classnames'
import MessageModal from '../MessageModal'
import Required from '../Required'
const p = 'component'
import L from '../../components/PageLanguage'

function InputTextArea(props) {
  const [isShowingModal_greaterThan, setIsShowingModal_greaterThan] = useState(true)

  const {name, label, placeholder, value, defaultValue, error, rows=5, columns=40, maxLength=1500, inputClassName="", labelClass="", onEnterKey,
  							instructions, instructionsBelow, required=false, whenFilled, autoFocus, onBlur, autoComplete='dontdoit', boldText, textareaClass} = props
  			
  
  		  return (
  		    <div className={classes(styles.container, inputClassName)}>
  		        <div className={styles.row}>
  		            {label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
  		            <Required setIf={required} setWhen={whenFilled}/>
  		        </div>
  						<div className={instructionsBelow ? styles.column : styles.row}>
  								<textarea
  												id={name}
  												name={name}
  												value={value}
  				                defaultValue={defaultValue}
  												rows={rows}
  												cols={columns}
  												onChange={isTextLengthLimit}
  												autoFocus={autoFocus}
  				                placeholder={placeholder}
  												onBlur={onBlur}
  												onKeyPress={onEnterKey}
  				                maxLength={maxLength || 100}
  												className={classes(styles.commentTextarea, textareaClass, (boldText ? styles.bold : ''))}
  												autoComplete={autoComplete}>
  								</textarea>
  		            <span className={styles.instructions}>{instructions}</span>
  		        </div>
  		        {error && <div className={styles.alertMessage}>{error}</div>}
  						{isShowingModal_greaterThan &&
  								<MessageModal handleClose={handleGreaterThanMaxClose} heading={<L p={p} t={`Text length limit`}/>}
  									 explainJSX={<L p={p} t={`The text you entered is longer than the maximum allowed.`}/>} onClick={handleGreaterThanMaxClose} />
  	          }
  		    </div>
  		  )
}
export default InputTextArea
