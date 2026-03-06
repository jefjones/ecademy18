import styles from './Button.css'
import classes from 'classnames'

export default ({label="", id, disabled=false, onClick, replaceClassName, addClassName, keyIndex, changeRed}) => {
    return (
        <button id={id} name={name} key={keyIndex} disabled={disabled}
								className={classes(addClassName, (replaceClassName ? replaceClassName : styles.button), (changeRed ? styles.redButton : ''), (disabled ? styles.opacityLow : ''))}
								onClick={disabled ? () => {} : onClick}>
						{label}
				</button>
    )
}
