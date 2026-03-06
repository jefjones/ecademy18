import { useEffect, useState } from 'react'
import globalStyles from '../../utils/globalStyles.css'
import styles from './InputDataList.css'
import classes from 'classnames'
import Required from '../Required'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

//If multiple and buttonLabel is filled in, that is a subtle distinction between the use of a one-entry-only control and a multiple record entry
//	In multiple entry case, there is the add button as well as the table display below as well as the clear-control function onBlur or on click of Add.
//	Notice that the click of the Add button doesn't do anything since it is just the action of onBlur that does the saving of the record.

function InputDataList(props) {
  const [textValue, setTextValue] = useState('')
  const [localValue, setLocalValue] = useState(props.value)
  const [isInit, setIsInit] = useState(true)

  useEffect(() => {
    
    	 		input.addEventListener("change", getValue)
    	
    return () => {
      
      	 		input.removeEventListener("change", getValue)
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {value, clearTextValue, resetClearTextValue} = props
          
    			if (!isInit && value && value.length > 0)  setIsInit(true); setTextValue(value.label); setLocalValue(value)
    			if (clearTextValue) {
    					setTextValue(''); setLocalValue('')
    					resetClearTextValue()
    			}
    	
  }, [])

  const {value, multiple, className, options, name, id, labelLeft, labelClass, required, label, whenFilled, disabled, error, height, selectClass,
  							maxwidth, buttonLabel, buttonIcon, listAbove } = props
  			
  
  		  return (
  		    <div className={classes(styles.container, className)}>
  						<div className={styles.row}>
  								<div>
  										<div className={styles.row}>
  						        		<label htmlFor={name} className={classes(labelLeft ? styles.labelLeft : styles.labelTop, labelClass, required ? styles.lower : '')}>
  														{label}
  												</label>
  												<Required setIf={required} setWhen={whenFilled}/>
  										</div>
                      {multiple && listAbove &&
          								<div className={styles.moreBottom}>
          										{value && value.length > 0 && value.map((m, i) =>
          												<div key={i} className={classes(styles.text, styles.row)} onClick={() => handleRemove(m.id)}>
          														<div className={classes(globalStyles.remove, styles.removePosition)}>remove</div>
          													 	<div className={styles.listTextPosition}>{m.label}</div>
          											  </div>
          										)}
          								</div>
          						}
  										<input type="text"
  												ref={(ref) => (input = ref)}
  												list={name || id}
  												value={textValue || ''}
  												onChange={handleTextChange}
  												autoComplete={'dontdoit'}
  												className={classes(styles.editControl, styles[`size${height}`], selectClass, styles[`maxwidth${maxwidth}`])}
  												disabled={disabled}/>
  										<datalist id={name || id} name={name || id} ref={(ref) => (menuThing = ref)} autoComplete={'dontdoit'} className={styles.maxWidth}>
  												{options && options.length > 0 && options.map((m, i) =>
  														<option key={i} id={m.id} value={m.label} className={styles.maxWidth}/>
  												)}
  										</datalist>
  										{error && <div className={styles.alertMessage}>{error}</div>}
  						    </div>
  								{textValue && <Icon pathName={'cross'} fillColor={'maroon'} className={required ? styles.iconCrossTop : styles.iconCross} onClick={clearTextValue}/>}
  								{multiple && buttonLabel &&
  										<div className={classes(globalStyles.link, styles.row, styles.topPosition)}>
  												{buttonIcon && <Icon pathName={buttonIcon} className={styles.iconSmall} fillColor={'#105815'}/>}
  												<div>{buttonLabel}</div>
  										</div>
  								}
  						</div>
  						{multiple && !listAbove &&
  								<div className={styles.moreBottom}>
  										{value && value.length > 0 && value.map((m, i) =>
  												<div key={i} className={classes(styles.text, styles.row)} onClick={() => handleRemove(m.id)}>
  														<div className={classes(globalStyles.remove, styles.removePosition)}><L p={p} t={`remove`}/></div>
  													 	<div className={styles.listTextPosition}>{m.label}</div>
  											  </div>
  										)}
  								</div>
  						}
  				</div>
  		  )
}
export default InputDataList
