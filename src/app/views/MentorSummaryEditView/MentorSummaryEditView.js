import React, {Component} from 'react';
import styles from './MentorSummaryEditView.css';
const p = 'MentorSummaryEditView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import { browserHistory, Link } from 'react-router';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import TextDisplay from '../../components/TextDisplay';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import moment from 'moment';
import {doSort} from '../../utils/sort.js';

class MentorSummaryEditView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isShowingModal_remove: false,
          isShowingModal_message: false,
					pathwayComments: [],
					studentPersonId: '',
					mentorCommentId: '', //This is just for removing an entry, but keep in mind that each learningPathwayId has a mentorCommentId separate from each other.
					entries: [{
							mentorCommentId: '',
							learningPathWayId: '',
							learningPathWayName: '',
							comment: '',
					}]
      }
    }

		componentDidUpdate(prevProps, prevState) {
				if (prevProps.entries !== this.props.entries && prevState.entries !== this.props.entries) {
						this.setState({ entries: this.sortEntries(this.props.entries) });
				}
		}

		sortEntries = (entries) => {
				let sortByHeadings = {
						sortField: 'learningPathWayName',
						isAsc: true,
						isNumber: false
				}
				return doSort(entries, sortByHeadings);
		}

    handleLearnerChange = (event) => {
				const {getLearnerPathways, personId, getMentorComments} = this.props;
        this.setState({ studentPersonId: event.target.value });
				getLearnerPathways(personId, event.target.value);
				getMentorComments(personId, event.target.value);
    }

    handleRemove = () => {
				const {removeMentorComment, personId } = this.props;
				const {mentorCommentId} = this.state;
        removeMentorComment(personId, mentorCommentId);
        this.setState({ mentorCommentId: '' });
    }

    processForm = (stayOrFinish) => {
				//This page saves the textarea entries every time the user leaves it.
				//So, the save button here really just clears the controls.  If it is "finish" it will reroute back to dashboard.
        this.setState({
						isShowingModal_remove: false,
	          isShowingModal_message: false,
						pathwayComments: [],
						studentPersonId: '',
						mentorCommentId: '', //This is just for removing an entry, but keep in mind that each learningPathwayId has a mentorCommentId separate from each other.
						entries: [{
								mentorCommentId: '',
								learningPathWayId: '',
								learningPathWayName: '',
								comment: '',
						}]
        });
				if (stayOrFinish === "FINISH") {
            browserHistory.push(`/firstNav`)
        }
    }

		changeComment = (event, learningPathwayId) => {
				let entries = [...this.state.entries];
				entries = entries && entries.length > 0 && entries.map(m => {
						if (m.learningPathwayId === learningPathwayId) {
								m.comment = event.target.value;
								m.studentPersonId = this.state.studentPersonId;
						}
						return m
				});
				this.setState({ entries });
		}

		onBlurComment = (learningPathwayId) => {
				const {addOrUpdateMentorComment, personId, getMentorComments} = this.props;
				const {entries, studentPersonId} = this.state;
				let entry = entries && entries.length > 0 && entries.filter(m => m.learningPathwayId === learningPathwayId)[0]
				if (entry && entry.learningPathwayId) {
						addOrUpdateMentorComment(personId, entry);
						getMentorComments(personId, studentPersonId);
				}
		}

		handleRemoveClose = () => this.setState({isShowingModal_remove: false})
    handleRemoveOpen = (mentorCommentId) => this.setState({isShowingModal_remove: true, mentorCommentId })
    handleRemove = () => {
				const {removeMentorComment, personId} = this.props;
				const {mentorCommentId} = this.state;
				removeMentorComment(personId, mentorCommentId);
				this.handleRemoveClose();
    }

		handleMessageClose = () => this.setState({isShowingModal_message: false})
		handleMessageOpen = (mentorCommentId) => {
				const {pathwayComments} = this.props;
				let entry = pathwayComments & pathwayComments.length > 0 && pathwayComments.filter(m => m.mentorCommentId === mentorCommentId);
				let learningPathwayName = entry && entry.learningPathwayName;
				let commment = entry && entry.comment;
				this.setState({isShowingModal_message: true, mentorCommentId, learningPathwayName, commment })
		}

		handleEditSet = (mentorCommentId) => {
				//Get all of the comments made on the same day and fill them into the learning Pathways' edit controls.
				//1. get the date from the record with the mentorCommentId.
				//2. go through all of the records and set the edit controls by document.getElementById that match the learningPathwayId
				//		 which match the same date.
				//btw:  We will need to cut out the time of the date and take the date that equals by the string format itself
				//3. Replace the entries records with each pathwayComments that matches for the learningPathwayId
				const {pathwayComments} = this.props;
				let entries = [...this.state.entries];
				let comment = pathwayComments && pathwayComments.filter(m => m.mentorCommentId === mentorCommentId)[0]
				if (comment && comment.mentorCommentId) {
						let theDate = moment(comment.entryDate).format('D MMM YYYY');
						pathwayComments.forEach(m => {
								if (m.entryDate && moment(m.entryDate).format('D MMM YYYY') === theDate) {
										entries = entries.filter(e => e.learningPathwayId !== m.learningPathwayId);
										entries = entries ? entries.concat(m) : [m];
								}
						})
						entries = this.sortEntries(entries);
						this.setState({ entries });
				}
		}

    render() {
      const {learners, pathwayComments} = this.props;
      const { entries, isShowingModal_remove, isShowingModal_message, studentPersonId, learningPathwayName, comment } = this.state;

      let headings = [{}, {}, {label: 'Date', tightText: true}, {label: 'Pathway', tightText: true}, {label: 'Read By', tightText: true}, {label: 'Comment', tightText: true}];
			let data = pathwayComments && pathwayComments.length > 0
          ? pathwayComments.map((m, i) => {
                return [
										{ value: <a onClick={() => this.handleRemoveOpen(m.mentorCommentId)} className={styles.remove}>remove</a>},
                    { value: <a onClick={() => this.handleEditSet(m.mentorCommentId)} className={styles.editLink}>edit</a>},
										{ id: m.personId, value: <a onClick={() => this.handleCommentViewOpen(m.mentorCommentId)} className={styles.link}>{moment(m.entryDate).format('D MMM YYYY')}</a>},
										{ id: m.personId, value: <a onClick={() => this.handleCommentViewOpen(m.mentorCommentId)} className={classes(styles.link, styles.linkBold)}>{m.learningPathwayName}</a>},
										{ id: m.personId, value: <a onClick={() => this.handleReadByOpen(m.mentorCommentId)} className={classes(styles.link, styles.linkBold)}>{m.readBy && m.readBy.length}</a>},
										{ id: m.personId, value: <a onClick={() => this.handleCommentViewOpen(m.mentorCommentId)} className={styles.link}>{m.comment.length> 50 ? m.comment.substring(0,50) + '...' : m.comment}</a>},
                ]})
          : [[{},{},{value: 'No comments found', colspan: true}]]


      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    {`Enter Mentor Comments`}
                </div>
                <div>
                    <SelectSingleDropDown
                        id={`studentPersonId`}
                        label={`Learner`}
                        value={studentPersonId}
                        options={learners}
                        className={styles.singleSelect}
                        height={`medium`}
                        onChange={this.handleLearnerChange}/>
                </div>
								<hr />
								<TextDisplay label={'Entry Date'} text={entries && entries.length > 0 && entries[0].entryDate ? moment(entries[0].entryDate).format('D MMM YYYY') : moment(new Date()).format('D MMM YYYY')}/>
								{studentPersonId && entries && entries.length > 0 && entries.map((m, i) =>
										<div key={i} className={styles.textareaDiv}>
												<span className={styles.inputText}>{m.learningPathwayName}</span><br/>
												<textarea rows={5} cols={45}
																id={m.mentorCommentId}
																name={m.mentorCommentId}
																value={m.comment || ''}
																onChange={(event) => this.changeComment(event, m.learningPathwayId)}
																onBlur={() => this.onBlurComment(m.learningPathwayId)}
																className={styles.commentTextarea}>
												</textarea>
										</div>
								)}
								<hr />
                {studentPersonId &&
										<div className={classes(styles.rowCenter)}>
												<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
		                </div>
								}
								<hr />
								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
            </div>
            <OneFJefFooter />
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this comment?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this comment?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_message &&
								<MessageModal handleClose={this.handleMessageClose} heading={`Learning Coach Comment`}
									 explain={learningPathwayName + ' - ' + comment} onClick={this.handleRemove} />
            }
        </div>
    )};
}

export default MentorSummaryEditView;
