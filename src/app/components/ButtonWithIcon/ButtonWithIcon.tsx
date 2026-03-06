import styles from './ButtonWithIcon.css'
import classes from 'classnames'
import Icon from '../Icon'

export default ({label="", id, disabled=false, onClick, replaceClassName, addClassName, keyIndex, changeRed, icon, isPremium=true, iconColor='white', dataRh=null}) => {
    return (
				<div key={keyIndex}  data-rh={dataRh}>
						<button id={id} name={id} disabled={disabled} type={'button'}
										className={classes(addClassName, styles.rowNowrap, (replaceClassName ? replaceClassName : styles.button), (changeRed ? styles.redButton : ''), (disabled ? styles.opacityLow : ''))}
										onClick={disabled ? () => {} : onClick}>
								<Icon pathName={icon} premium={isPremium} className={styles.iconButton} fillColor={iconColor}/>
								<div className={styles.buttonText}>{label}</div>
						</button>
				</div>
    )
}
