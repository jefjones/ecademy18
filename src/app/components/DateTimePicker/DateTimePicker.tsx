import * as styles from './DateTimePicker.css'
import Required from '../Required'
import classes from 'classnames'
import * as globalStyles from '../../utils/globalStyles.css'

export default ({id, className="", onChange, value, error, minDate, onBlur, required=false, whenFilled, label, labelClass}) => {
		value = value && value.length > 0 && value.indexOf('T') > -1 ? value.substring(0, value.indexOf('T')) : value

    return (
        <div className={className}>
						<div className={styles.row}>
								{label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
								<Required setIf={required} setWhen={whenFilled}/>
						</div>
            <input type="date" id={id} name={id}
                value={(!value || value.length > 10 || value === 'NaN' || value === '') ? '' : value}
                className={classes(styles.dateInput, (value ? '' : styles.placeholder))}
                onChange={onChange}
                onBlur={onBlur}
                min={minDate}
            />
            {error && <div className={globalStyles.errorText}>{error}</div>}
        </div>
    )
}
