import * as styles from './SiteSearch.css'
import Icon from '../Icon/Icon'
import classes from 'classnames'

export default ({text, icon='search', justify="right", placeholder="Find Individuals and Pages", className="", pageTab, onChange, value}) => {
    return (
        <form>
        <div className={classes(className, (justify === 'right' ? styles.containerRight : styles.containerLeft))}>
            <input placeholder={placeholder} id={`searchInput`} className={styles.inputBox} value={value}
                onChange={(event) => onChange(pageTab, event)}/>
            <span className={styles.addon}>
                <Icon pathName={icon} className={styles.icon}/>
            </span>
        </div>
        </form>
    )
}
