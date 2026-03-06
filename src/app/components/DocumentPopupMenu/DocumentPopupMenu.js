import React, {Component} from 'react'
import styles from './DocumentPopupMenu.css';
import Icon from '../Icon/Icon.js';
import classNames from 'classnames';


export default class DocumentPopupMenu extends Component {
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
        this.button.addEventListener("click", this.handleDisplay);
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
        const {className, children, label, icon, iconSize} = this.props;
        const {opened} = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.button} ref={(ref) => (this.button = ref)}>
                    <Icon pathName={icon} iconSize={iconSize}/>
                    <span className={styles.label}>{label}</span>
                </div>
                <div className={classNames(styles.children, (opened && styles.opened))}>
                    {children}
                </div>
            </div>
        )
    }
}
