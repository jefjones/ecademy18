import * as styles from './TimePicker.css'
import Required from '../Required'
import classes from 'classnames'
import * as globalStyles from '../../utils/globalStyles.css'

export default ({id, className="", onChange=() => {}, value, error, onBlur=() => {}, required=false, whenFilled, label, labelClass, boldText}) => {
		value = value && value.indexOf('T') > -1 ? value.substring(value.indexOf('T')+1) : value

    return (
        <div className={classes(className, styles.dateComponent)}>
						<div className={styles.row}>
								{label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
								<Required setIf={required} setWhen={whenFilled}/>
						</div>
						<input type="time" id={id} name={id} onChange={onChange} onBlur={onBlur} value={value || ''}
								className={classes(styles.timePicker, (boldText ? styles.bold : ''))}/>
            {error && <div className={globalStyles.errorText}>{error}</div>}
        </div>
    )
}
