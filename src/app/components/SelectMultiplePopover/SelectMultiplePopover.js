import React from 'react';
import {Component} from 'react'
import styles from './SelectMultiplePopover.css';
import classes from 'classnames';

export default class SelectMultiplePopover extends Component {
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
        if (!this.props.disabled) {
            this.dropdown.addEventListener("click", this.handleDisplay);
        }
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
        const {label, children, className="", disabled=false} = this.props;
        const {opened} = this.state;
        return (
            <div className={classes(className, styles.container)}>
                <div className={classes(styles.button, className, (opened ? styles.toggledOn : styles.toggledOff), (disabled ? styles.disabled : ''))} ref={(ref) => (disabled ? '' : this.dropdown = ref)}>
                    {label}
                    <b className={styles.caret}></b>
                </div>
                {!disabled && <div className={classes(styles.dropdown, (opened && styles.opened))}>
                    {children}
                </div>}
            </div>
        )
    }
}
