import * as styles from './ProfileMenu.css'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Icon from '../Icon/Icon'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({className="", logoutClick}) => {
    return (
        <div className={classNames(styles.profileContainer, className)}>
            <div className={styles.innerContainer}><Link to={`/myprofile`} className={styles.link}><Icon pathName={`profile`} className={styles.icon}/><L p={p} t={`my profile`}/></Link></div>
            <div className={styles.innerContainer}><hr className={styles.line} /></div>
            <div className={styles.innerContainer}><Link to={`/mypreferences`} className={styles.link}><Icon pathName={`notification`} className={styles.icon}/><L p={p} t={`preferences`}/></Link></div>
            <div className={styles.innerContainer}><hr className={styles.line} /></div>
            <div className={styles.innerContainer}><Link onClick={logoutClick} className={styles.link}><Icon pathName={`key2`} className={styles.icon}/><L p={p} t={`logout`}/></Link></div>
        </div>
    )
}
