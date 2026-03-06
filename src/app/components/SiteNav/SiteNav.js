import styles from './SiteNav.css';
import classNames from 'classnames';
import MainMenu from '../MainMenu/MainMenu.js';
import MenuPopup from '../MenuPopup/MenuPopup.js';
import ProfileMenu from '../ProfileMenu/ProfileMenu.js';
import SiteNavItem from '../SiteNavItem/SiteNavItem.js';

export default ({logoutClick, links=[], className=""}) => (
    <div>
        <div className={styles.menuExpanded}>
            <nav className={classNames(styles.nav, className)}>
                {links.map( ({text, count, newCount, href}, i) => (
                    <SiteNavItem
                        key={i}
                        href={href}
                        text={text}
                        count={count}
                        newCount={newCount}
                    />
                ))}
                <div className={styles.menuPopup}>
                    <MenuPopup
                        className=""
                        label=""
                        icon="profilePerson"
                        iconSize={`16px`}
                    >
                        <ProfileMenu className={styles.dropdownMenu} logoutClick={logoutClick} />
                    </MenuPopup>
                </div>
            </nav>
        </div>
        <div className={styles.menuCollapsed}>
            <MainMenu
                links={links}
                logoutClick={logoutClick}
            />
        </div>
    </div>
);
