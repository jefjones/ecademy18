import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './ContextCourseAction.css';
import MessageModal from '../MessageModal';
import TextareaModal from '../../components/TextareaModal';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class ContextCourseAction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_deleteEdit: false,
						isShowingModal_duplicate: false,
						isShowingModal_hasSchedule: false,
        };
    }

    componentDidMount() {
        document.body.addEventListener('click', this.props.hideContextCourseActionMenu);
    }

		componentWillUnmount() {
        document.body.removeEventListener('click', this.props.hideContextCourseActionMenu);
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
				this.props.hideMenu();
		}
    handleDeleteOpen = () =>  this.setState({isShowingModal_deleteEdit: true})

		handleDuplicateClose = () => {
				this.setState({isShowingModal_duplicate: false});
				this.props.hideMenu();
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

    render() {
        const {className="", courseEntryId, courseScheduledId, courseName, actionType, showVertical } = this.props;
        const {isShowingModal_deleteEdit, isShowingModal_duplicate, isShowingModal_hasSchedule} = this.state;

        return (
            <div className={classes(styles.container, (showVertical ? '' : styles.row), className)}>
                <div className={styles.multipleContainer}>
										<div className={classes(styles.row, styles.moreRight)} data-rh={actionType === 'BASECOURSE' ? <L p={p} t={`Schedule this course`}/> : <L p={p} t={`Assign this course to a student`}/>}>
												<a onClick={() => browserHistory.push(actionType === 'BASECOURSE' ? '/courseToSchedule/new/' + courseEntryId : '/learnerCourseAssign/set/course/' + courseScheduledId)}>
														<Icon pathName={`calendar_31`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
												</a>
										</div>
                    <div className={classes(styles.row, styles.moreRight)} data-rh={'Gradebook'}>
                        <a onClick={() => browserHistory.push('/gradebookEntry/' + courseScheduledId)}>
                            <Icon pathName={`medal_empty`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
                    <div className={classes(styles.row, styles.moreRight)} data-rh={'Manage assignments'}>
                        <a onClick={() => browserHistory.push('/assignmentList/' + courseEntryId)}>
                            <Icon pathName={`list3`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={'Weighted Scores'}>
                        <a onClick={() => browserHistory.push('/courseWeightedScore/' + courseEntryId)}>
                            <Icon pathName={`scale`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
										{/*<div className={classes(styles.row, styles.moreRight)} data-rh={'Duplicate this course to create another'}>
                        <a onClick={this.handleDuplicateOpen}>
                            <Icon pathName={`compare_docs`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>*/}
										<div className={classes(styles.row, styles.moreRight)} data-rh={'View the class discussion'}>
                        <a onClick={() => browserHistory.push('/discussionClass/' + courseEntryId)}>
                            <Icon pathName={`chat_bubbles`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={'Edit the course setup'}>
                        <a onClick={this.sendToCourseEdit}>
                            <Icon pathName={`pencil0`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
                    <div className={classes(styles.row, styles.moreRight)} data-rh={`Delete this course`}>
                        <a onClick={this.validateDelete}>
														<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
                </div>
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
