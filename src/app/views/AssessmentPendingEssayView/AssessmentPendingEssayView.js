import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {penspringHost} from '../../penspring_host.js';
import styles from './AssessmentPendingEssayView.css';
const p = 'AssessmentPendingEssayView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class AssessmentPendingEssayView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					studentPersonId: '',
					testTypes: 'all',
					isShowingModal_instructions: false,
	    }
  }

	sendToAssessmentCorrect = (pathLink) => {
			browserHistory.push(pathLink);
	}

	handleInstructionsOpen = (assignmentTitle, instructions) => this.setState({ isShowingModal_instructions: true, assignmentTitle, instructions });
	handleInstructionsClose = () => this.setState({ isShowingModal_instructions: false });

	handlePenspringView = (penspringWorkId, assignment) => {
			const {setPenspringTransfer, personId, accessRoles, studentPersonId, course} = this.props;
			let transfer = {
					assignmentId: assignment.assignmentId,
					transferCode: 'STARTWRITING',
					workId: penspringWorkId,
					ownerPersonId: accessRoles.facilitator ? studentPersonId : personId,
					editorPersonId: assignment.facilitatorPersonId,
					isTeacher: accessRoles.facilitator,
					courseEntryId: course.courseEntryId,
			}
			setPenspringTransfer(personId, transfer);
	}

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, assessmentPendingEssay, students, accessRoles={}, fetchingRecord} = this.props;
		const {isShowingModal_instructions, studentPersonId, instructions, assignmentTitle} = this.state;

    let headings = [{},
				{label: <L p={p} t={`Possible score`}/>, tightText: true},
				{label: <L p={p} t={`Score`}/>, tightText: true},
				{label: <L p={p} t={`Assignment`}/>, tightText: true},
				{label: <L p={p} t={`Essay subject`}/>, tightText: true},
				{label: <L p={p} t={`Student`}/>, tightText: true},
				{label: <L p={p} t={`Course`}/>, tightText: true},
				{label: <L p={p} t={`Word count`}/>, tightText: true},
				{label: <L p={p} t={`Entry date`}/>, tightText: true}
		]

    let data = assessmentPendingEssay && assessmentPendingEssay.length > 0 && assessmentPendingEssay.map((m, i) =>
         [
						{value: <a key={i} onClick={() => this.handlePenspringView(m.penspringWorkId, m)}
														href={`${penspringHost}/lms/${personId}`} target={'_penspring'}
														className={m.isTeacherResponse ? styles.teacherResponse : ''}>
												<Icon pathN	ame={'pencil0'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: m.pointsPossible},
						{value: <InputText id={i} tabIndex={i} size={"super-short"} value={this.state.scores[m.assignmentId + '#$' + m.studentPersonId] === 0 ? 0 : this.state.scores[m.assignmentId + '#$' + m.studentPersonId] ? this.state.scores[m.assignmentId + '#$' + m.studentPersonId] : ''}
												numberOnly={true}
												onChange={(event) => this.handleScore(m.assignmentId, event)}
												onBlur={(event) => this.onBlurScore(m.courseScheduledId, m.assignmentId, m.studentPersonId, event)}
												onDoubleClick={(accessRoles.admin || accessRoles.facilitator) ? () => this.handleDocumentOpen(m.assignmentId, null, m) : () => {}}/>},
						{value: m.assignmentTitle},
						{value: m.instructions, clickFunction: () => this.handleInstructionsOpen(m.assignmentTitle, m.instructions) },
						{value: m.studentNameFirst === 'FIRST' ? m.studentFirstName + ' ' + m.studentLastName : m.studentLastName + ', ' + m.studentFirstName},
						{value: m.courseNameTime + ' - ' + m.classPeriodOrTime},
						{value: m.wordCount},
						{value: m.entryDate},
        ]
		);

    return (
        <div className={styles.container}>
				<div className={globalStyles.pageTitle}>
						<L p={p} t={`Pending Essay Reviews from Tests`}/>
				</div>
				{(accessRoles.facilitator || accessRoles.admin || accessRoles.observer) &&
						<div>
								<SelectSingleDropDown
										id={'studentPersonId'}
										value={studentPersonId}
										label={<L p={p} t={`Students with pending essays`}/>}
										options={students}
										height={`medium`}
										noBlank={false}
										className={styles.singleDropDown}
										onChange={this.handleStudentChange}/>
						</div>
				}
				<hr />
				<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={fetchingRecord.assessmentPendingEssay}/>
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Assessment Pending Essay`}/>} path={'assessmentPendingEssay'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
				{isShowingModal_instructions &&
						<MessageModal handleClose={this.handleInstructionsClose} heading={`Quiz: ${assignmentTitle}`}
							 explain={instructions}  onClick={this.handleInstructionsClose} />
				}
      	</div>
    );
  }
}
