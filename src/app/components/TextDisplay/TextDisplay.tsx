import { Link } from 'react-router-dom'
import * as styles from './TextDisplay.css'
import classes from 'classnames'

export default ({text, label, className, textClassName, labelClass, hideIfEmpty, linkTo, clickFunction, salta, leftLabel, topLabel}) => {
		clickFunction = salta ? salta : clickFunction

    return !text && hideIfEmpty ? null :
        <div className={classes(styles.container, className, (leftLabel ? styles.leftLabel : styles.topLabel))}>
						<span className={classes(styles.label, labelClass)}>{label}</span>
						{linkTo && <Link to={linkTo} className={styles.link}>{text}</Link>}
						{clickFunction && <a onClick={clickFunction} className={styles.link}>{text}</a>}
            {!linkTo && !clickFunction && <span className={classes(styles.text, (textClassName ? textClassName : ''))}>{text}</span>}
        </div>
}
