import React from 'react';
import styles from './Checkbox.css';
import classes from 'classnames';
import Icon from '../Icon';
import Required from '../Required';

export default ({label="", id, disabled=false, position="before", checked=false, onClick, checkboxClass="", labelClass="",
                  className="", defaultValue, readOnly, error, dataRH, required=false, whenFilled}) => {
    return (
				<div data-rh={dataRH ? dataRH : null}>
		        <div className={classes(styles.container, className)}>
		            {position === "before"
										? readOnly
												? checked
														? <Icon pathName={'checkmark0'} premium={true} className={styles.icon} />
														: ''
		                		: <input type="checkbox" id={id} name={id} checked={checked} disabled={disabled} onChange={() => {}} defaultValue={defaultValue}
		                    		className={classes(styles.checkboxLeft, checkboxClass)} onClick={onClick}/>
										: ''
		            }
		            <a className={classes(styles.label, labelClass, (disabled ? styles.lowOpacity : styles.labelHover))} onClick={disabled ? ()=>{} : onClick}>{label}</a>
		            {position !== "before"
										? readOnly
												? checked
														? <Icon pathName={'checkmark0'} premium={true} className={styles.icon} />
														: ''
		                		: <input type="checkbox" id={id} name={id} checked={checked} disabled={disabled} onChange={() => {}} defaultValue={defaultValue}
		                    		className={classes(styles.checkboxRight, checkboxClass)} onClick={onClick}/>
										: ''
		            }
								<div className={styles.requiredPosition}>
										<Required setIf={required} setWhen={whenFilled}/>
								</div>
		        </div>
						{error && <div className={styles.alertMessage}>{error}</div>}
				</div>
    )
};
