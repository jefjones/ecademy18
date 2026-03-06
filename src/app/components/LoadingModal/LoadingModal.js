import React, {Component} from 'react';  //PropTypes
import styles from './LoadingModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';

export default class extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: '',
            indicator: '...',
            timerId: null,
            styleIndex: 0,
            styleArray: [styles.first, styles.second, styles.third, styles.fourth],
            direction: 'increasing',
        };

        this.showProgress = this.showProgress.bind(this);
    }

    componentDidMount() {
        this.setState({ timerId: setInterval(() => this.showProgress(), 1000) });
    }

    componentDidUpdate() {
        const {isLoading, handleClose} = this.props;
        if (!isLoading) {
            clearInterval(this.state.timerId);
            handleClose();
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timerId);
    }

    showProgress() {
        const {styleIndex, direction, styleArray} = this.state;
        let nextIndex = styleIndex;
        nextIndex = direction === 'increasing' ? ++nextIndex : --nextIndex;
        if (nextIndex >= styleArray.length) {
            this.setState({ direction: 'decreasing', styleIndex: styleArray.length });
        } else if (nextIndex <= 0) {
            this.setState({ direction: 'increasing', styleIndex: 0 });
        } else {
            this.setState({ styleIndex: nextIndex });
        }
        this.setState({ indicator: this.state.indicator + '.'})
        if (styleArray && styleArray.length > 0 && styleIndex >= 0 && styleIndex <= styleArray.length && styleArray[styleIndex])
            this.loadingThing.className = styleArray[styleIndex];
    }

    render() {
        const {handleClose, className, loadingText} = this.props;
        const { error, indicator} = this.state;

        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
                  <ModalDialog onClose={handleClose} className={styles.label}>
                      {error && "An Error Occurred"}
                      <span ref={ref => {this.loadingThing = ref}}>
                         {loadingText ? loadingText : 'Loading'}
                      </span>
                      <span>{indicator}</span>
                  </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
