import { useEffect, useState } from 'react'
import styles from './CheckboxGroup.css'
import classes from 'classnames'
import Required from '../Required'
import Checkbox from '../Checkbox'

function CarpoolRequests(props) {
  const [isInit, setIsInit] = useState(false)
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(props.selected)

  useEffect(() => {
    
    			const {selected} = props
    			
    			if (!isInit && selected && selected.length > 0 && selectedCheckboxes !== selected) {
    					setSelectedCheckboxes(selected); setIsInit(true)
    			}
    	
  }, [])

  const {options=[], name, horizontal=false, position='before', selected, className='', checkboxClass='', labelClass='',
  							label, required=false, whenFilled, error } = props
  
    	return (
  				<div className={className}>
  						{label &&
  								<div className={styles.row}>
  										{label &&
  												<span htmlFor={name} className={classes(styles.titleClass, required ? styles.lower : '')}>
  														{label}
  												</span>
  										}
  										<div className={styles.leftDown}>
  												<Required setIf={required} setWhen={whenFilled}/>
  										</div>
  								</div>
  						}
  		        <div className={(horizontal ? styles.horizontal : styles.radio)}>
  		            {options && options.length > 0 && options.map((d, index) => {
  										return (
  												<div key={index}>
  														<Checkbox
  																id={d.id}
  																name={d.id}
  																label={d.label}
  																labelClass={classes(styles.label, labelClass)}
  																className={className}
  																position={position}
  																checked={selected && selected.length > 0 && selected.indexOf(d.id) > -1}
  																onClick={(event) => handleChange(event, d.id, selected)}
  																checkboxClass={classes(styles.moreBottom, checkboxClass)} />
  												</div>
  			            	)}
  								)}
  						</div>
  						{error && <div className={styles.alertMessage}>{error}</div>}
  				</div>
      )
}
export default CarpoolRequests
