import {Component} from 'react'
import styles from './SubMenuSideOver.css';
import Icon from '../Icon/Icon.js';
import classNames from 'classnames';
import workMenuIcon from '../../assets/workMenuIcon.png';

export default class SubMenuSideOver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }

        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleClosed = this.handleClosed.bind(this);

    }

    componentDidMount() {
        //document.body.addEventListener("click", this.handleClosed);
        this.button.addEventListener("click", this.handleDisplay);
        this.mainMenuReturn.addEventListener("click", this.handleDisplay);
    }

    componentWillUnmount() {
        document.body.removeEventListener("click", this.handleClosed);
    }

    handleDisplay(ev) {
        ev.stopPropagation();
        this.setState({opened: !this.state.opened});
    }

    handleClosed() {
        this.setState({opened: false});
    }

    render() {
        const {className, children, label, icon, iconSize, id} = this.props;
        const {opened} = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <img src={workMenuIcon} className={styles.menuIcon} ref={(ref) => (this.button = ref)} />
                <div className={classNames(styles.children, (opened && styles.opened))}>
                  <span className={styles.menuReturnIcon} ref={(ref) => (this.mainMenuReturn = ref)}>x</span><br />
                    <div className={styles.whiteText}>
                       {children}
                    </div>
                </div>
            </div>
        )
    }
}
