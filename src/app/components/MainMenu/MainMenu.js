import React from 'react';
import { Link, browserHistory } from 'react-router';
import {Component} from 'react'
import styles from './MainMenu.css';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import Icon from '../Icon';
import DateMoment from '../DateMoment';
const p = 'component';
import L from '../../components/PageLanguage';


export default class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }

        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleClosed = this.handleClosed.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener("click", this.handleClosed);
        this.dropdown.addEventListener("click", this.handleDisplay);
				this.menuLines.addEventListener("click", this.handleDisplay);
        //this.menuText.addEventListener("click", this.handleDisplay);
        this.grayArea.addEventListener("click", this.handleDisplay);
        document.body.addEventListener('keyup', this.checkForKeypress);
    }

    componentWillUnmount() {
				document.body.removeEventListener("click", this.handleClosed);
				this.dropdown.removeEventListener("click", this.handleDisplay);
				this.menuLines.removeEventListener("click", this.handleDisplay);
				//this.menuText.removeEventListener("click", this.handleDisplay);
				this.grayArea.removeEventListener("click", this.handleDisplay);
				document.body.removeEventListener('keyup', this.checkForKeypress);
    }

    checkForKeypress = (evt) => {
        evt.key === 'Escape' && this.state.opened && this.setState({ opened: false });
    }

    handleDisplay = (ev, preventAction) => {
        ev.stopPropagation();
        this.setState({opened: !this.state.opened});
    }

    handleClosed = () => {
        this.setState({opened: false});
    }

    render() {
        const {personName, accessRoles, myFrequentPlaces, myVisitedPages, companyConfig} = this.props;
        const {opened} = this.state;

        return (
            <div className={styles.container}>
                <input type="checkbox" className={styles.check} id="checked" checked={opened} ref={(ref) => (this.dropdown = ref)} onChange={()=>{}}/>
								<div className={classes(globalStyles.link, styles.whiteMenu, styles.muchRight)} onClick={() => browserHistory.push('/firstNav')} ref={(ref) => (this.menuText = ref)}><L p={p} t={`HOME`}/></div>
                <label className={styles.menuBtn}  ref={(ref) => (this.menuLines = ref)}>
                    <span className={classes(styles.bar, styles.top)}></span>
                    <span className={classes(styles.bar, styles.middle)}></span>
                    <span className={classes(styles.bar, styles.bottom)}></span>
                </label>
                <label className={styles.closeMenu} ref={(ref) => (this.grayArea = ref)}></label>
                <nav className={styles.drawerMenu}>
                    <span className={styles.loggedIn}><L p={p} t={`Signed in:`}/></span>
                    <span className={styles.personName}>{personName}</span>
										<Link to={`/firstNav`} className={classes(styles.menuItem, styles.row)}>
												<Icon pathName={'menu_lines'} premium={true} className={styles.icon}/>
												<div className={styles.moreTop}><L p={p} t={`Main Menu (home)`}/></div>
										</Link>
										{accessRoles.admin && <hr />}
										{accessRoles.admin &&
												<Link to={`/schoolSettings`} className={classes(styles.row, styles.menuItem)}>
														<Icon pathName={'cog'} premium={true} className={styles.icon}/>
														<div className={styles.moreTop}><L p={p} t={`School Settings`}/></div>
												</Link>
										}
										<hr />
										{companyConfig.urlcode !== 'Manheim' &&
												<Link to={`/myProfile`} className={classes(styles.menuItem, styles.row)}>
														<Icon pathName={'portrait'} premium={true} className={styles.icon}/>
														<div className={styles.moreTop}><L p={p} t={`My Profile`}/></div>
												</Link>
										}
										<Link to={`/logout`} className={classes(styles.menuItem, styles.row)}>
												<Icon pathName={'stop_circle'} premium={true} className={styles.icon}/>
												<div className={styles.moreTop}><L p={p} t={`Logout`}/></div>
										</Link>
										<hr />
										<div>
												<div className={styles.subHeader}><L p={p} t={`My frequent places`}/></div>
												{myFrequentPlaces && myFrequentPlaces.length > 0 && myFrequentPlaces.map((m, i) =>
														<Link to={`/${m.path}`} key={i} className={styles.menuItem}>
																{m.pageName}
														</Link>
												)}
												{!(myFrequentPlaces && myFrequentPlaces.length > 0) &&
														<div className={classes(globalStyles.instructionsBig, styles.moreLeft)}>
																<L p={p} t={`Most page will have a checkbox at the bottom:  'My frequent place'.  By choosing that, the link to that page will appear here for your convenience.`}/>
														</div>
												}
										</div>
										<hr />
										<div>
												<div className={styles.subHeader}><L p={p} t={`My visited pages`}/></div>
												{myVisitedPages && myVisitedPages.length > 0 && myVisitedPages.map((m, i) =>
														<div key={i}>
																<Link to={`${m.path}`} className={styles.menuItem}>
																		<div className={styles.text}>{m.description}</div>
																</Link>
																<DateMoment date={m.entryDate} minusHours={0} className={styles.positionDate}/>
														</div>
												)}
										</div>
                </nav>
            </div>
        )
    }
}


//<li><Link to={`/bidRequests`} className={styles.menuItem}>Bid Requests</Link></li>
