import React, {Component} from 'react';  //PropTypes
import styles from './ConfirmDateAndNote.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import DateTimePicker from '../DateTimePicker';
import ButtonWithIcon from '../ButtonWithIcon';
import TimePicker from '../TimePicker';
import InputTextArea from '../InputTextArea';
const p = 'component';
import L from '../../components/PageLanguage';

export default class ConfirmDateAndNote extends Component {
    constructor(props) {
        super(props);

        this.state = {
						confirmDate: props.date.indexOf('T') > -1 ? props.date.substring(0, props.date.indexOf('T')) : props.date,
            confirmTime: props.date.indexOf('T') > -1 ? props.date.substring(props.date.indexOf('T')+1,props.date.indexOf('T')+6) : props.time,
						comment: '',
        }
    }

		// componentDidUpdate() {
		// 		const {date, time} = this.props;
		// 		const {confirmDate} = this.state;
		// 		if (date && !confirmDate) {
		// 				let dateOnly = date.indexOf('T') > -1 ? date.substring(0, date.indexOf('T')) : date;
		// 				let timeOnly = date.indexOf('T') > -1 ? date.substring(date.indexOf('T')+1,date.indexOf('T')+6) : time;
		// 				this.setState({ confirmDate: dateOnly, confirmTime: timeOnly });
		// 		}
		// }

    handleChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
				let field = event.target.name;
				let newState = Object.assign({}, this.state);
				newState[field] = event.target.value
        this.setState(newState);
    }

		changeDate = (field, event) => {
				let newState = Object.assign({}, this.state);
				newState[field] = event.target.value
        this.setState(newState);
		}

		processForm = () => {
				const {onClick} = this.props;
				const {confirmDate, confirmTime, comment} = this.state;
				let hasError = false;

				if (!confirmDate) {
					hasError = true;
					this.setState({ errorConfirmDate: <L p={p} t={`Please choose or enter a date`}/> });
				}

				if (!confirmTime) {
					hasError = true;
					this.setState({ errorConfirmTime: <L p={p} t={`Please enter a time`}/> });
				}

				if (!hasError) {
						onClick(confirmDate + ' ' + confirmTime, comment);
				}
		}

    render() {
        const {onDelete, handleClose, className, headerClass, explainClass, heading, explain} = this.props;
        const {confirmDate, confirmTime, comment, errorConfirmDate, errorCheckInTime} = this.state;

        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={classes(styles.dialogHeader, headerClass)}>
                        	{!heading && <L p={p} t={`Confirm Date`}/>}
                        	{heading}
                        </div>
												<div className={classes(styles.dialogExplain, explainClass)}>{explain || ''}</div>
												<DateTimePicker id={`confirmDate`} value={confirmDate} label={<L p={p} t={`Confirm date`}/>} required={true} whenFilled={confirmDate}
														onChange={(event) => this.changeDate('confirmDate', event)} error={errorConfirmDate}/>
												<TimePicker id={`checkInTime`} label={<L p={p} t={`Start time`}/>} value={confirmTime || ''} onChange={this.handleChange} className={styles.notBold}
														error={errorCheckInTime} boldText={true}/>
												<InputTextArea label={<L p={p} t={`Note (optional)`}/>} rows={5} cols={45} value={comment} onChange={this.handleChange} id={'comment'} name={'comment'}
                            className={styles.commentBox}/>
                        <div className={styles.dialogButtons}>
                            {onDelete && <a className={styles.noButton} onClick={onDelete}><L p={p} t={`Delete`}/></a>}
                            <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
