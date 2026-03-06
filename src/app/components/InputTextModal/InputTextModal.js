import React, {Component} from 'react';  //PropTypes
import styles from './InputTextModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import InputText from '../InputText';
import ButtonWithIcon from '../ButtonWithIcon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class InputTextModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
						chosenOption: this.props.defaultValue,
        }

    }

    handleChange = (event) => {
        this.setState({ chosenOption: event.target.value });
    }

    render() {
        const {onClick, handleClose, className, headerClass, explainClass, heading, explain, defaultValue=0, label=<L p={p} t={`Choose option`}/>} = this.props;
        const {chosenOption} = this.state;

        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={classes(styles.dialogHeader, headerClass)}>{heading}</div>
												<div className={classes(styles.dialogExplain, explainClass)}>{explain}</div>
												<div className={styles.centered}>
														<InputText
																id={"chosenOption"}
																name={"chosenOption"}
																size={"super-short"}
																label={label}
																value={chosenOption === 0
																	 				? 0
																					: chosenOption
																							? chosenOption
																							:	defaultValue === 0
																										? 0
																										: defaultValue
																												? defaultValue
																												: ''
																			}
																inputClassName={styles.inputText}
																onChange={this.handleChange}/>
												</div>
                        <div className={styles.dialogButtons}>
                            <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(chosenOption)}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
