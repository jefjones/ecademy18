import React from 'react';
import styles from './SiteHeader.css';
import SiteNav from '../SiteNav/SiteNav.js';

export default ({logoutClick, links = [], className="", setMenuSelected}) => {
    return (
        <SiteNav className={styles.nav} links={links} logoutClick={logoutClick} setMenuSelected={setMenuSelected}/>
)};
