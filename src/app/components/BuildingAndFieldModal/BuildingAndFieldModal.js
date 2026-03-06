import React, {Component} from 'react';
import styles from './BuildingAndFieldModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import InputText from '../InputText';
import Checkbox from '../Checkbox';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputTextArea from '../InputTextArea';
import ButtonWithIcon from '../ButtonWithIcon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class BuildingAndFieldModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const {onClick, onDelete, handleClose, className, record, recordType, handleChange, toggleCheckbox, mapDirections, levelEntrances=[]} = this.props;
				let heading = recordType === 'BuildingAndField'
						? <L p={p} t={`Building or Field`}/>
						: recordType === 'BuildingAndFieldLevel'
								? <L p={p} t={`Building or Field Level`}/>
								: recordType === 'LevelEntrance'
										? <L p={p} t={`Level Entrance`}/>
										: recordType === 'Room'
												? <L p={p} t={`Room in the Building`}/>
												: '';

				let entrances = levelEntrances && levelEntrances.length > 0 && levelEntrances.map(m => ({
						...levelEntrances,
						id: m.levelEntranceId,
						label: m.name
				}));

        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.dialogHeader}>{heading}</div>
												<InputText
														id={"name"}
														name={"name"}
														size={"medium"}
														label={<L p={p} t={`Name`}/>}
														value={record.name || ''}
														inputClassName={styles.inputText}
														onChange={handleChange}/>
												<InputText
														id={"gpsLink"}
														name={"gpsLink"}
														size={"medium"}
														label={<L p={p} t={`GPS link`}/>}
														value={record.gpsLink || ''}
														inputClassName={styles.inputText}
														onChange={handleChange}/>
												<InputTextArea label={<L p={p} t={`Note`}/>} rows={5} cols={45} value={record.note} onChange={handleChange} id={'note'} name={'note'}
                            className={styles.commentBox} boldText={true}/>
												{recordType === 'LevelEntrance' &&
														<div className={styles.checkbox}>
																<Checkbox
																		id={'isLockedDuringDay'}
																		label={<L p={p} t={`This door is locked during the day`}/>}
																		labelClass={styles.checkboxLabel}
																		checked={record.isLockedDuringDay || false}
																		onClick={() => toggleCheckbox('isLockedDuringDay')}
																		className={styles.button}/>
														</div>
												}
												{(recordType === 'LevelEntrance' || recordType === 'Room') &&
														<div>
																<SelectSingleDropDown
																		id={`mapDirectionId`}
																		name={`mapDirectionId`}
																		label={<L p={p} t={`Map direction`}/>}
																		value={record.mapDirectionId || ''}
																		options={mapDirections}
																		className={styles.moreBottomMargin}
																		height={`medium`}
																		onChange={handleChange}/>
														</div>
												}
												{recordType === 'Room' &&
														<div>
																<div>
																		<SelectSingleDropDown
																				id={`levelEntranceId`}
																				name={`levelEntranceId`}
																				label={<L p={p} t={`Closest entrance`}/>}
																				value={record.levelEntranceId || ''}
																				options={entrances}
																				className={styles.moreBottomMargin}
																				height={`medium`}
																				onChange={handleChange}/>
																</div>
																<InputText
																		id={"numberOfDoorsAwayFromEntrance"}
																		name={"numberOfDoorsAwayFromEntrance"}
																		size={"super-short"}
																		numberOnly={true}
																		label={<L p={p} t={`Number of doors away from entrance`}/>}
																		value={record.numberOfDoorsAwayFromEntrance || ''}
																		inputClassName={styles.inputText}
																		onChange={handleChange}/>
																<div>
																		<SelectSingleDropDown
																				id={`sideOfHallwayFromEntrance`}
																				name={`sideOfHallwayFromEntrance`}
																				label={<L p={p} t={`Side of hallway from entrance`}/>}
																				value={record.sideOfHallwayFromEntrance || ''}
																				options={[{id: 'left', label: 'Left'}, {id: 'right', label: 'Right'}]}
																				className={styles.moreBottomMargin}
																				height={`medium`}
																				onChange={handleChange}/>
																</div>
																<InputText
																		id={"occupantCapacity"}
																		name={"occupantCapacity"}
																		size={"super-short"}
																		numberOnly={true}
																		label={<L p={p} t={`Occupant capacity`}/>}
																		value={record.occupantCapacity || ''}
																		inputClassName={styles.inputText}
																		onChange={handleChange}/>
														</div>
												}
                        <div className={styles.dialogButtons}>
                            {onDelete && <a className={styles.noButton} onClick={onDelete}>Delete</a>}
                            <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick()}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
