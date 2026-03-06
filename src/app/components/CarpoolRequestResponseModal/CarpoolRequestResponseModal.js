import React, {Component} from 'react';  //PropTypes
import styles from './CarpoolRequestResponseModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import InputText from '../InputText';
import TextDisplay from '../TextDisplay';
import RadioGroup from '../RadioGroup';
import ButtonWithIcon from '../ButtonWithIcon';
import {guidEmpty} from '../../utils/guidValidate.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class CarpoolRequestResponseModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
						seatsAvailable: '',
						seatsNeeded: '',
						canDropOffDays: '',
						canPickUpDays: '',
						inviteCarpoolId: '',
						comment: '',
						errorSeats: '',
						errorDropOffOrPickUp: '',
        }
    }

    handleChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
				let field = event.target.name;
				let newState = Object.assign({}, this.state);
				newState[field] = event.target.value
        this.setState(newState);
    }

		handleSelectedCanDropOffDays = (canDropOffDays) => {
	      this.setState({ canDropOffDays });
	  }

		handleSelectedCanPickUpDays = (incomingCanPickUpDays) => {
	      this.setState({ canPickUpDays: incomingCanPickUpDays });
	  }

		processForm = (stayOrFinish) => {
	      const {carpoolRequest,  addCarpoolRequestResponse, personId, handleClose, responseType, carpools} = this.props;
				const {seatsAvailable, seatsNeeded, canDropOffDays, canPickUpDays, comment} = this.state;
				let {inviteCarpoolId} = this.state;
	      let hasError = false;

				// if (!seatsNeeded && !seatsAvailable) {
	      //     hasError = true;
	      //     this.setState({errorSeats: "Enter seats needed and seats vacant" });
	      // }
				// if (!canDropOffDays && !canPickUpDays) {
	      //     hasError = true;
	      //     this.setState({ errorDropOffOrPickUp: "Choose days you can drop off or pick up" });
	      // }
				if (carpools && carpools.length > 1 && !inviteCarpoolId) {
	          hasError = true;
	          this.setState({errorCarpoolId: "Please choose which carpool you would like to invite this member to." });
	      }

	      if (!hasError) {
						if ((!inviteCarpoolId || inviteCarpoolId === guidEmpty) && carpools && carpools.length > 0) inviteCarpoolId = carpools[0].carpoolId;
	          addCarpoolRequestResponse(personId, { carpoolRequestId: carpoolRequest.carpoolRequestId, seatsNeeded, seatsAvailable, canDropOffDays, canPickUpDays, comment, responseType, inviteCarpoolId });
	          this.setState({
								seatsAvailable: '',
								seatsNeeded: '',
								canDropOffDays: '',
								canPickUpDays: '',
								comment: '',
								errorSeats: '',
								errorDropOffOrPickUp: '',
	          });
						handleClose();
	      }
	  }

		handleCarpoolChoice = (inviteCarpoolId) => {
				this.setState({ inviteCarpoolId });
		}

    render() {
        const {handleClose, daysOfWeek, carpoolRequest, carpools} = this.props;
        const {seatsAvailable, seatsNeeded, canDropOffDays, canPickUpDays, comment, errorSeats, errorDropOffOrPickUp, inviteCarpoolId,
								errorCarpoolId} = this.state;

				let carpoolOptions = [];
				carpools && carpools.length > 0 && carpools.forEach(m => {
						carpoolOptions.push({
								id: m.carpoolId,
								label: m.name
						})
				})

        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Request Response`}/>}</div>
												<div className={styles.rowWrap}>
														<TextDisplay label={<L p={p} t={`Area name`}/>} text={carpoolRequest.areaName}/>
														<TextDisplay label={<L p={p} t={`Requester name`}/>} text={carpoolRequest.personName}/>
														<TextDisplay label={<L p={p} t={`Seats vacant`}/>} text={carpoolRequest.seatsAvailable ? carpoolRequest.seatsAvailable : ''}/>
														<TextDisplay label={<L p={p} t={`Seats needed`}/>} text={carpoolRequest.seatsNeeded ? carpoolRequest.seatsNeeded : ''}/>
												</div>
												<div>
														<InputText
																id={'seatsAvailable'}
																name={'seatsAvailable'}
																value={seatsAvailable || ''}
																label={<L p={p} t={`Seats vacant in my car`}/>}
																size={"super-short"}
																numberOnly={true}
																onChange={this.handleChange}
																error={errorSeats}/>
						            </div>
												<div>
														<InputText
																id={'seatsNeeded'}
																name={'seatsNeeded'}
																value={seatsNeeded && seatsNeeded !== 0 ? seatsNeeded : ''}
																label={<L p={p} t={`Number of seats I need for my students when others drive`}/>}
																size={"super-short"}
																numberOnly={true}
																onChange={this.handleChange}/>
						            </div>
												{/*<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
														<CheckboxGroup
																name={'canDropOffDays'}
																options={daysOfWeek || []}
																horizontal={true}
																onSelectedChanged={this.handleSelectedCanDropOffDays}
																label={'I can drop-off on days:'}
																selected={canDropOffDays}
																labelClass={styles.checkboxLabel}
																error={errorDropOffOrPickUp}/>
												</div>
												<div className={globalStyles.multiSelect}>
														<CheckboxGroup
																name={'canPickUpDays'}
																options={daysOfWeek || []}
																horizontal={true}
																onSelectedChanged={this.handleSelectedCanPickUpDays}
																label={'I can pick-up on days:'}
																labelClass={styles.checkboxLabel}
																selected={canPickUpDays}/>
												</div>*/}
												<div className={styles.label}>{`Comment (optional)`}</div>
												<textarea rows={5} cols={35} value={comment} onChange={this.handleChange} id={'comment'} name={'comment'}
                            className={styles.commentBox}/>
												{carpools && carpools.length > 1 &&
														<div className={styles.moreTop}>
																<RadioGroup
																		data={carpoolOptions}
																		name={`carpoolId`}
																		label={<L p={p} t={`To which carpool do you want to invite this member?`}/>}
																		horizontal={false}
																		className={styles.radio}
																		initialValue={inviteCarpoolId || ''}
																		onClick={this.handleCarpoolChoice}
																		error={errorCarpoolId}/>
														</div>
												}
                        <div className={styles.dialogButtons}>
                            <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
