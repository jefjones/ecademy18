import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './BaseCourseMenu.css';
import MessageModal from '../MessageModal';
import TextareaModal from '../../components/TextareaModal';
import classes from 'classnames';
import Icon from '../Icon';
import { withAlert } from 'react-alert';
const p = 'component';
import L from '../../components/PageLanguage';

class BaseCourseMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_deleteEdit: false,
						isShowingModal_duplicate: false,
						isShowingModal_hasSchedule: false,
        };
    }

		//We need to check to see if a base course is being deleted and if there are any scheduled courses depending on that base course
		validateDelete = () => {
				const {actionType, scheduledCourses, courseEntryId} = this.props;
				let hasSchedule = scheduledCourses && scheduledCourses.length > 0 && scheduledCourses.filter(m => m.courseEntryId === courseEntryId)[0]
				if (actionType === "BASECOURSE" && hasSchedule && hasSchedule.courseEntryId) {
						this.handleHasScheduledCourseOpen();
				} else {
						this.handleDeleteOpen();
				}
		}

		handleHasScheduledCourseOpen = () =>  this.setState({isShowingModal_hasSchedule: true})
		handleHasScheduledCourseClose = () =>  this.setState({isShowingModal_hasSchedule: false})

    handleDelete = () => {
        const {removeRecord, personId, id} = this.props;
				removeRecord(personId, id);
				this.handleDeleteClose();
    }

    handleDeleteClose = () => {
				this.setState({isShowingModal_deleteEdit: false});
		}
    handleDeleteOpen = () =>  this.setState({isShowingModal_deleteEdit: true})

		handleDuplicateClose = () => {
				this.setState({isShowingModal_duplicate: false});
		}
    handleDuplicateOpen = (courseEntryId, courseName) => this.setState({isShowingModal_duplicate: true, courseName})

		handleCourseDuplicate = (courseName) => {
				const {courseDuplicate} = this.props;
				courseDuplicate(courseName);
				this.handleDuplicateClose();
		}

		sendToCourseEdit = () => {
				const {actionType, courseEntryId, courseScheduledId} = this.props;
				browserHistory.push(actionType === 'BASECOURSE' ? '/courseEntry/' + courseEntryId : '/courseToSchedule/edit/' + courseScheduledId)
		}

		chooseCourse = () => {
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`Choose a course from the list. Then, choose an action.`}/></div>)
		}

    render() {
        const {className="", courseEntryId, courseScheduledId, courseName, actionType, isAdmin, addToClipboard, courseClipboard,
			 					singleRemoveCourseClipboard, companyConfig} = this.props;
        const {isShowingModal_deleteEdit, isShowingModal_duplicate, isShowingModal_hasSchedule} = this.state;

				let hasRecordChosen = !courseEntryId && !courseScheduledId ? false : true;

        return (
            <div className={classes(styles.container, className)}>
                {actionType !== 'BASECOURSE' &&
                    <a onClick={!hasRecordChosen ? this.chooseCourse : () => browserHistory.push('/courseToSchedule')}
                            data-rh={`Schedule a new course section`} className={classes(styles.moveRight, styles.row)}>
                        <Icon pathName={`group_work`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                        <Icon pathName={`plus`} fillColor={'green'} className={classes(styles.plusIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                    </a>
                }
								{actionType === 'BASECOURSE' &&
										<a onClick={!hasRecordChosen ? this.chooseCourse : () => browserHistory.push(actionType === 'BASECOURSE' ? '/courseToSchedule/new/' + courseEntryId : '/learnerCourseAssign/set/course/' + courseScheduledId)}
														data-rh={actionType === 'BASECOURSE' ? `Schedule this course` : `Assign this course to a student`} className={classes(styles.moveRight, styles.row)}>
												<Icon pathName={`clock3`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
												<Icon pathName={`plus`} fillColor={'green'} className={classes(styles.plusIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
										</a>
								}
								{actionType !== 'BASECOURSE' && (!courseClipboard || !courseClipboard.courseList || !courseClipboard.courseList.length
												|| (courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length > 0 && courseClipboard.courseList.indexOf(courseScheduledId) === -1))
										? <a onClick={!hasRecordChosen ? this.chooseCourse : () => addToClipboard(courseScheduledId)} data-rh={'Add course to clipboard'} className={styles.positionRight}>
													<Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true}
															superScriptClass={classes(styles.superScriptAdd, (!hasRecordChosen ? styles.opacityLow : ''))}
															className={classes(styles.iconSuperAdd, styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
											</a>
										: companyConfig.urlcode === 'Manheim'
												? <a onClick={!hasRecordChosen ? this.chooseCourse : () => singleRemoveCourseClipboard(courseScheduledId)} data-rh={'Remove course from clipboard'} className={styles.positionRight}>
															<Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#ff0000'} premium={true}
																	superScriptClass={classes(styles.superScriptAdd, (!hasRecordChosen ? styles.opacityLow : ''))}
																	className={classes(styles.iconSuperAdd, styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
													</a>
												: ''
								}
                {isAdmin &&
										<a onClick={!hasRecordChosen ? this.chooseCourse : this.sendToCourseEdit} data-rh={'Edit the course setup'}>
		                    <Icon pathName={`pencil0`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
		                </a>
								}
                <a onClick={!hasRecordChosen ? this.chooseCourse : () => browserHistory.push('/gradebookEntry/' + courseScheduledId)}  data-rh={'Gradebook'}>
                    <Icon pathName={`medal_empty`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                </a>
                <a onClick={!hasRecordChosen ? this.chooseCourse : () => browserHistory.push('/assignmentList/' + courseEntryId)} data-rh={'Manage assignments'}>
                    <Icon pathName={`list3`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                </a>
                <a onClick={!hasRecordChosen ? this.chooseCourse : () => browserHistory.push('/courseWeightedScore/' + courseEntryId)} data-rh={'Weighted Scores'}>
                    <Icon pathName={`scale`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                </a>
                {/*isAdmin &&
										<a onClick={!hasRecordChosen ? this.chooseCourse : this.handleDuplicateOpen} data-rh={'Duplicate this course to create another'}>
		                    <Icon pathName={`compare_docs`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
		                </a>
								*/}
                <a onClick={!hasRecordChosen ? this.chooseCourse : () => browserHistory.push('/discussionClass/' + courseEntryId)} data-rh={'View the class discussion'}>
                    <Icon pathName={`chat_bubbles`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                </a>
								{isAdmin &&
										<a onClick={!hasRecordChosen ? this.chooseCourse : this.validateDelete} data-rh={`Delete this course`}>
												<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
		                </a>
								}
								{isShowingModal_hasSchedule &&
                    <MessageModal handleClose={this.handleHasScheduledCourseClose} heading={<L p={p} t={`This base course has scheduled courses?`}/>}
                       explainJSX={<L p={p} t={`This base course has one or more currently scheduled courses.  In order to delete this base course, the scheduled courses that use this base course need to be deleted first.`}/>}
											 onClick={this.handleHasScheduledCourseClose} />
                }
                {isShowingModal_deleteEdit &&
                    <MessageModal handleClose={this.handleDeleteClose} heading={actionType === 'BASECOURSE' ? <L p={p} t={`Delete this course?`}/> : <L p={p} t={`Remove this course from the schedule?`}/>}
                       explainJSX={actionType === 'BASECOURSE' ? <L p={p} t={`Are you sure you want to delete this course?`}/> : <L p={p} t={`Are you sure you want to remove this course from the schedule?`}/>}
											 isConfirmType={true} onClick={this.handleDelete} />
                }
								{isShowingModal_duplicate &&
										<TextareaModal key={'all'} handleClose={this.handleDuplicateClose} heading={``} explain={``}
											 onClick={this.handleCourseDuplicate} currentSentenceText={courseName} placeholder={<L p={p} t={`Make a copy of this course?`}/>}/>
								}
            </div>
        )
    }
};

export default withAlert(BaseCourseMenu);
