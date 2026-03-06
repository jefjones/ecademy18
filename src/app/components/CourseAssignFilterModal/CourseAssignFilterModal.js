import React, {Component} from 'react';  //PropTypes
import styles from './CourseAssignFilterModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputText from '../InputText';
import Icon from '../Icon';
import Checkbox from '../../components/Checkbox';
import RadioGroup from '../../components/RadioGroup';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class CourseAssignFilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: '',
        }
    }

    render() {
        const {changeItem, companyConfig, departments, intervals, classPeriods, learningPathways, alerts, teachers, partialNameText, filterIntervalId,
								learningPathwayId, departmentId, classPeriodId, facilitatorName, showAlertsOnly, showOpenCoursesOnly, onlineOrTraditionalOnly,
								toggleShowAlertsOnly, clearFilters, toggleShowOpenCoursesOnly, handleRadio, onClick, handleClose, hideRegistrationOptions,
                bypassGradeRestriction, toggleBypassGradeRestriction, me} = this.props;

        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.columns}>
														<div className={styles.row}>
																<div className={styles.filterLabel}><L p={p} t={`Search Courses`}/></div>
																<a onClick={clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight)}>
																		<L p={p} t={`Clear filters`}/>
																</a>
														</div>
														<InputText
																id={"partialNameText"}
																name={"partialNameText"}
																size={"medium"}
																label={<L p={p} t={`Name search`}/>}
																value={partialNameText || ''}
																onChange={changeItem}/>
														<div>
																<SelectSingleDropDown
																		id={`departmentId`}
																		label={<L p={p} t={`Department`}/>}
																		value={Number(departmentId) || ''}
																		options={departments}
																		height={`medium`}
																		onChange={changeItem}/>
														</div>
														<div>
																<SelectSingleDropDown
																		id={`filterIntervalId`}
																		label={companyConfig.urlcode === 'Manheim' ? `Marking Periods` : <L p={p} t={`Class Periods`}/>}
																		value={filterIntervalId || ''}
																		options={intervals}
																		height={`medium`}
																		onChange={changeItem}/>
														</div>
														<div>
																<SelectSingleDropDown
																		id={`classPeriodId`}
																		label={companyConfig.urlcode === `Manheim` ? `Block` : <L p={p} t={`Period`}/>}
																		value={classPeriodId || ''}
																		options={classPeriods}
																		height={`medium`}
																		onChange={changeItem}/>
														</div>
														{companyConfig.urlcode !== 'Manheim' &&
																<div>
																		<SelectSingleDropDown
																				id={`facilitatorName`}
																				label={<L p={p} t={`Teachers`}/>}
																				value={facilitatorName || ''}
																				options={teachers}
																				height={`medium`}
																				onChange={changeItem}/>
																</div>
														}
														<div>
																<SelectSingleDropDown
																		id={`learningPathwayId`}
																		label={<L p={p} t={`Graduation requirement`}/>}
																		value={learningPathwayId || ''}
																		options={learningPathways}
																		height={`medium`}
																		onChange={changeItem}/>
														</div>
														{!hideRegistrationOptions &&
																<div className={classes(styles.moreTop, styles.row, styles.lowHeight, styles.moreRight)}>
																		<Checkbox
																				id={`showAlertsOnly`}
																				label={<L p={p} t={`Only show courses with alerts`}/>}
																				checked={showAlertsOnly}
																				labelClass={styles.text}
																				onClick={toggleShowAlertsOnly} />
																		{alerts && alerts.length > 0 ? <div className={classes(styles.row, styles.text, styles.littleLeft)}><div>(</div><div className={styles.boldText}>{alerts.length}</div><div>)</div></div> : null}
																		<Icon pathName={'antennae'} premium={true} className={classes(styles.littleLeft, styles.iconTight)}/>
																</div>
														}
														{!hideRegistrationOptions &&
																<div className={classes(styles.moreTop, styles.row)}>
																		<Checkbox
																				id={`showOpenCoursesOnly`}
																				label={<L p={p} t={`Show courses with open seats only`}/>}
																				checked={showOpenCoursesOnly}
																				labelClass={styles.text}
																				onClick={toggleShowOpenCoursesOnly} />
																</div>
														}
														<div className={classes(styles.moreTop, styles.lessLeft, styles.row)}>
																<RadioGroup
																		label={<L p={p} t={`Show class format`}/>}
																		data={[{ label: <L p={p} t={`All`}/>, id: "all" }, { label: <L p={p} t={`Traditional only`}/>, id: "traditional" }, { label: <L p={p} t={`Online only`}/>, id: "online" }]}
																		name={`onlineOrTraditionalOnly`}
																		horizontal={true}
																		className={styles.radio}
																		initialValue={onlineOrTraditionalOnly}
																		onClick={(value) => handleRadio('onlineOrTraditionalOnly', value)}/>
														</div>
                            {me.salta &&
																<div className={classes(styles.moreTop, styles.row)}>
																		<Checkbox
																				id={`bypassGradeRestriction`}
																				label={<L p={p} t={`Bypass grade restriction`}/>}
																				checked={bypassGradeRestriction}
																				labelClass={styles.text}
																				onClick={toggleBypassGradeRestriction} />
																</div>
														}
                        </div>
                        <div className={styles.dialogButtons}>
														<ButtonWithIcon label={<L p={p} t={`Done`}/>} icon={'checkmark_circle'} onClick={onClick}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
