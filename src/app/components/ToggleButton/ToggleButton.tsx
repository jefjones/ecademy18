import * as styles from './ToggleButton.css'
import classes from 'classnames'

export default ({label="", toggledOn=false, caret=false, onClick, className=""}) => {
    return (
        <div className={classes(styles.button, className, (toggledOn ? styles.toggledOn : styles.toggledOff))} onClick={onClick}>
            {label}
            <b className={classes((caret ? styles.caret : ''))}></b>
        </div>
    )
}
