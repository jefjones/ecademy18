import styles from './SiteHeader.css'
import SiteNav from '../SiteNav/SiteNav'

export default ({logoutClick, links = [], className="", setMenuSelected}) => {
    return (
        <SiteNav className={styles.nav} links={links} logoutClick={logoutClick} setMenuSelected={setMenuSelected}/>
)}
