import styles from './SiteNavItem.css';
import { Link } from 'react-router';
import DocumentPopupMenu from '../DocumentPopupMenu/DocumentPopupMenu.js';
import MenuAll from '../MenuAll/MenuAll.js';
import classNames from 'classnames';

export default ({className="", href, text, count, newCount}) => (
    <div className={classNames(styles.linkContainer, className)}>
        {text === `documents`
            ?
            <div className={classNames(styles.innerContainer, styles.link)}>
                <Link className={styles.link} to={href}>{text}</Link>
                <div className={styles.lessMargin}>
                    <DocumentPopupMenu
                        className={styles.smallIcon}
                        label=""
                        iconSize={`12px`}
                        icon="circle_down"
                    >
                        <MenuAll className={styles.dropdownMenu}  />
                    </DocumentPopupMenu>
                </div>
                {count !== undefined ?
                    newCount === true ?
                        <span className={styles.textHighlight}>{count}</span>
                        :
                        <span className={styles.navCount}>{count}</span>
                    :
                    <span></span>
                }
            </div>

            :

            <div className={classNames(styles.innerContainer, styles.link)}>
                <Link className={styles.link} to={href}>{text}
                    {count !== undefined ?
                        newCount === true ?
                            <span className={styles.textHighlight}>{count}</span>
                            :
                            <span className={styles.navCount}>{count}</span>
                        :
                        <span></span>
                    }
                </Link>
            </div>
        }
    </div>
);
