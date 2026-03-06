import styles from './RadioGroup.css'
import classes from 'classnames'
import tapOrClick from 'react-tap-or-click'
import Required from '../Required'

//to do: Make the radio label a link to set the value of this radio group choice.
export default ({data=[], name, horizontal=false, position="before", onClick, className="", radioClass="", labelClass="", initialValue, pageTab,
			personId, title, label, required=false, whenFilled, titleClass, error, noHoverLink }) => {

    if (!name && !data) {
        name = data.replace(/ /g, "")
    }

    return (
				<div className={className}>
						{(title || label) &&
								<div className={styles.row}>
										{(title || label) &&
												<span htmlFor={name} className={classes(styles.titleClass, titleClass, required ? styles.lower : '')}>
														{title || label}
												</span>
										}
										<div className={styles.leftDown}>
												<Required setIf={required} setWhen={whenFilled}/>
										</div>
								</div>
						}
		        <div className={(horizontal ? styles.horizontal : styles.radio)}>
		            {data.map((d, index) => {
									return (
		                <div key={index} className={classes(styles.row, className, (horizontal ? styles.spaceBetween : styles.spaceBelow))}>
		                    {position === "before"
		                        ? <input type="radio" name={name} id={name} value={d.id} checked={initialValue === d.id ? true : false}
		                            className={radioClass} {...tapOrClick(() => onClick(d.id, personId))} onChange={() => {}}/>
		                        : ''}
		                    <div className={classes((noHoverLink ? styles.labelNoLink : styles.label), (labelClass ? labelClass : ''), (d.correction === 'wrong' ? styles.wrong : d.correction === 'correct' ? styles.correct : ''))} onClick={() => onClick(d.id, personId)}>{d.label}</div>
		                    {position !== "before"
		                        ? <input type="radio" name={name} id={name} value={d.id} checked={initialValue === d.id ? true : false}
		                            className={radioClass} {...tapOrClick(() => onClick(d.id, personId))} onChange={() => {}}/>
		                        : ''}
		                </div>
		            )})}
		        </div>
						{error && <div className={styles.alertMessage}>{error}</div>}
				</div>
    )
}
