import * as styles from './SearchText.css'
import Icon from '../Icon/Icon'
import classes from 'classnames'

export default ({icon='search', justify="right", placeholder="", className="", onChange, value=""}) => {
    return (
        <div className={classes(className, (justify === 'right' ? styles.containerRight : styles.containerLeft))}>
            <input placeholder={placeholder} id={`searchInput`} className={styles.inputBox} value={value}
                onChange={(event) => onChange(event)}/>
            <span className={styles.addon}>
                <Icon pathName={icon} className={styles.icon}/>
            </span>
        </div>
    )
}
