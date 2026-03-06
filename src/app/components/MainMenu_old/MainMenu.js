import React from 'react';
import {Component} from 'react'
import styles from './MainMenu.css';
const p = 'StudentScheduleView';
import L from '../../components/PageLanguage';
import { browserHistory } from 'react-router';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }
    }

    componentDidMount() {
        //  document.body.addEventListener("click", this.handleClosed);
        // this.dropdown.addEventListener("click", this.handleDisplay);
        this.menuThing.addEventListener("click", this.handleDisplay);
        // this.grayArea.addEventListener("click", this.handleDisplay);
        //document.body.addEventListener('keyup', this.checkForKeypress);
    }

    componentWillUnmount() {
        document.body.removeEventListener("click", this.handleClosed);
    }

    checkForKeypress = (evt) => {
        evt.key === 'Escape' && this.state.opened && this.setState({ opened: false });
    }

    handleDisplay = (ev, preventAction) => {
        ev.stopPropagation();
        this.setState({opened: !this.state.opened});
				browserHistory.getCurrentLocation().pathname.indexOf('firstNav') > -1
						? this.props.alert.info(<div className={styles.alertText}><L p={p} t={`You are already on the main menu.`}/></div>)
						: browserHistory.push('/firstNav')
        this.handleClosed();
    }

    handleClosed = () => {
        this.setState({opened: false});
    }

    render() {
        const {opened} = this.state;

        return (
            <div className={classes(styles.container, styles.row)} ref={(ref) => (this.menuThing = ref)}>
                <input type="checkbox" className={styles.check} id="checked" checked={opened} ref={(ref) => (this.dropdown = ref)}/>
								{/*<div className={classes(globalStyles.link, styles.whiteMenu)}>MENU</div>*/}
								<div>
		                <label className={styles.menuBtn}>
		                    <span className={classes(styles.bar, styles.top)}></span>
		                    <span className={classes(styles.bar, styles.middle)}></span>
		                    <span className={classes(styles.bar, styles.bottom)}></span>
		                </label>
								</div>
            </div>
        )
    }
}
export default withAlert(MainMenu);

//<li><Link to={`/bidRequests`} className={styles.menuItem}>Bid Requests</Link></li>
