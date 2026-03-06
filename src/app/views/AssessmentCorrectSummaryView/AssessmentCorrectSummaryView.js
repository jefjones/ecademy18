import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './AssessmentCorrectSummaryView.css';
const p = 'AssessmentCorrectSummaryView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTableFreezeLeft from '../../components/EditTableFreezeLeft';
import Icon from '../../components/Icon';
import TextDisplay from '../../components/TextDisplay';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class AssessmentCorrectSummaryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

		sendToStudentSchedule = (studentPersonId) => {
				browserHistory.push('/studentSchedule/' + studentPersonId);
		}

		handlePathLink = (path) => path && browserHistory.push(path);

		render() {
      const {assignmentId, assessmentId, correctSummary, correctDetails={}, assessmentQuestions, students} = this.props;

	 		let headings = [{label: '', tightText: true}];
			assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.forEach(m =>
					headings.push({ label: m.sequence, pathLink: `/assessmentCorrectSameAll/${assignmentId}/${assessmentId}/${m.assessmentQuestionId}`, tightText: true })
			)

			let data = [];

			students && students.length > 0 && students.forEach(m => {
					let row = [{value: <div className={styles.rowSpace}>
										 <div className={styles.row}>
												 <Link to={'/studentProfile/' + m.id}><Icon pathName={'info'} className={styles.icon}/></Link>
												 <Link to={'/studentSchedule/' + m.id}><Icon pathName={'clock3'} premium={true} className={styles.icon}/></Link>
												 <div onClick={() => this.sendToStudentSchedule(m.id)} className={classes(styles.link, styles.row)}>
														{m.label}
												</div>
												<div className={styles.moreLeft}>{m.sum}</div>
										 </div>
								 </div>
				  }];
					assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.forEach(a => {
							let score = correctDetails && correctDetails.length > 0 && correctDetails.filter(c => c.assessmentQuestionId === a.assessmentQuestionId && a.personId === m.id)[0];
							score = score && score.score ? score.score : '';
							row.push({ value: score ? score : <L p={p} t={`pending`}/>, pathLink: `/assessmentCorrect/${assignmentId}/${assessmentId}/${a.personId}`});
					});
					data.push(row);
			});

      return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
              	<L p={p} t={`Assessment Correction Summary`}/>
            </div>
						<div className={styles.row}>
								<TextDisplay label={<L p={p} t={`Course`}/>} text={correctSummary.courseName}/>
								<TextDisplay label={<L p={p} t={`Assignment`}/>} text={correctSummary.assignmentTitle}/>
						</div>
            <div className={styles.tableMargin} ref={el => (this.componentRef = el)}>
								<EditTableFreezeLeft labelClass={styles.tableLabelClass} headings={headings} data={data}
										firstColumnClass={styles.firstColumnClass} sendToReport={this.handlePathLink}/>
            </div>
            <OneFJefFooter />
        </div>
    )}
}

export default withAlert(AssessmentCorrectSummaryView);


//<Loading loadingText={`Loading`} isLoading={fetchingRecord && fetchingRecord.gradebook} />
