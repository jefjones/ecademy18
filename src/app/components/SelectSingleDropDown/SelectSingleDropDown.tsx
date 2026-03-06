import styles from './SelectSingleDropDown.css'
import classes from 'classnames'
import Required from '../Required'

export default ({label, id, onChange, onBlur, value, error, options, optgroups, height, className="", labelClass="", selectClass="",
                    noBlank=false, indexName, zeroethLabel, disabled, labelLeft, required, whenFilled, maxwidth, firstValue=0}) => {

  return (
    <div className={classes(styles.container, labelLeft ? styles.row : styles.column, className)}>
				<div className={styles.row}>
        		<label htmlFor={id} className={classes(labelLeft ? styles.labelLeft : styles.labelTop, labelClass, required ? styles.lower : '')}>
								{label}
						</label>
						<Required setIf={required} setWhen={whenFilled}/>
				</div>
        <div>
            <select
                id={id}
                name={id}
                value={value || ''}
                disabled={disabled}
                onChange={(event) => onChange(event)}
								onBlur={onBlur}
                className={classes(styles.editControl, styles[`size${height}`], selectClass, styles[`maxwidth${maxwidth}`] )}>

                {!noBlank && <option key={-1} value={firstValue}>{zeroethLabel ? zeroethLabel : "- -"}</option>}
                {!optgroups && options && options.length > 0 &&
                    options.map((option, index) => {
                        let tabSpace = ""
                        for(let i=0; i < option.levelDown; i++) {
                            tabSpace += "&nbsp;&nbsp;&nbsp;&nbsp;"
                        }
                        return <option key={index} value={option.id} dangerouslySetInnerHTML={{__html: tabSpace + option.label}}></option>
                    })
                }
                {optgroups && optgroups.length > 0 &&
                    optgroups.map((optgroup, index) => {
                        //The optgroup is the parent of the options that belong to that group.
                        //As soon as that optgroup changes, write the end optgroup tag and start the next one.
                        let tabSpace = ''; //"&nbsp;&nbsp;&nbsp;&nbsp;";
                        return (
                            <optgroup key={index} label={optgroup.label}>
                            {optgroup.options && optgroup.options.length > 0 && optgroup.options.map((opt, optIndex) =>
                                <option key={optIndex+9999} value={opt.id} dangerouslySetInnerHTML={{__html: tabSpace + opt.label}}></option>
                            )}
                            </optgroup>
                        )
                    })
                }
            </select>
        </div>
        {error && <div className={styles.alertMessage}>{error}</div>}
    </div>
)}
