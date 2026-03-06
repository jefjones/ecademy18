import React, {Component} from 'react';  //PropTypes
import styles from './CourseRecommendation.css';
import EditTable from '../EditTable';
import MessageModal from '../MessageModal';
import Icon from '../Icon';
import { withAlert } from 'react-alert';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

class CourseRecommendation extends Component {
		constructor(props) {
				super(props);

				this.state = {
						isShowingModal_remove: false,
						sortByHeadings: {
								sortField: '',
								isAsc: '',
								isNumber: ''
						}
				}
		}

		handleRemoveRecommendationOpen = (studentPersonId, courseEntryId) => this.setState({ isShowingModal_remove: true, studentPersonId, courseEntryId });
		handleRemoveRecommendationClose = () => this.setState({ isShowingModal_remove: false, courseEntryId: '' });
		handleRemoveRecommendation = () => {
				const {removeCourseRecommendation, personId, byType} = this.props;
				const {studentPersonId, courseEntryId} = this.state;
				removeCourseRecommendation(personId, studentPersonId, courseEntryId, byType);
				this.handleRemoveRecommendationClose();
		}

		setNameFilter = (partialNameText) => {
				this.props.setStudentCourseAssignNameSearch(partialNameText)
		}

    render() {
        const {emptyMessage, baseCourses, showStudentName, recommendations, byType, isFetchingRecord } = this.props;
				const {isShowingModal_remove} = this.state;

				let headings1 = [
						{label: ''},
						{label: showStudentName ? <L p={p} t={`Student`}/> : '', tightText: true},
						{label: <L p={p} t={`Course name`}/>, tightText: true},
						//{label: <L p={p} t={`Credits`}/>, tightText: true},
				]

				let headings2 = [
						{label: 'Response', tightText: true},
						{label: 'Course name', tightText: true},
						//{label: 'Credits', tightText: true},
				]

				let filtered = recommendations && recommendations.length > 0 && recommendations.filter(m => !m.responseType);
				let data1 = filtered && filtered.length > 0 && filtered.map(m => {
						let row = [
								{value: <a onClick={() => this.handleRemoveRecommendationOpen(m.personId, m.courseEntryId)} className={styles.remove}><L p={p} t={`remove`}/></a> },
								{value: showStudentName ?  <div>{m.studentName}</div> : '' },
								{value: <a onClick={() => this.setNameFilter(m.courseName)} className={classes(styles.link, styles.row)}>
														{m.responseType === 'Scheduled' &&
																<Icon pathName={'checkmark'} fillColor={'green'} className={styles.icon}/>
														}
														{m.courseName}
												</a>
								},
								//{value: m.credits},
						];

						return row;
				});

				data1 = data1 && data1.length > 0
						? data1
						: [[
									{value: ''},
									{value: <i>{emptyMessage}</i>, colSpan: 4}
							]];

				let filtered2 = recommendations && recommendations.length > 0 && recommendations.filter(m => !!m.responseType)
				let data2 = filtered2 && filtered2.length > 0 && filtered2.map(m => {
						let course = (baseCourses && baseCourses.length > 0 && baseCourses.filter(s => s.externalId == m.externalId)[0]) || {} //eslint-disable-line
						let row = [
								{value: m.responseType },
								{value: <div className={styles.row	}>
														{m.responseType === 'Scheduled' &&
																<Icon pathName={'checkmark'} fillColor={'green'} className={styles.icon}/>
														}
														{m.courseName}
												</div>},
								//{value: course.credits},
						];

						return row;
				});

        return (
            <div className={styles.container}>
								<EditTable labelClass={styles.tableLabelClass} headings={headings1} data={data1} noColorStripe={true} isFetchingRecord={isFetchingRecord}/>
								{byType === 'Student' && data2 && data2.length > 0 &&
										<div className={styles.responseTable}>
												<EditTable className={styles.responseTable} labelClass={styles.tableLabelClass} headings={headings2} data={data2} noColorStripe={true}/>
										</div>
								}
								{isShowingModal_remove &&
		                <MessageModal handleClose={this.handleRemoveRecommendationClose} heading={<L p={p} t={`Remove this Recommendation?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to remove this recommendation?`}/>}  isConfirmType={true}
											 onClick={this.handleRemoveRecommendation} />
		            }
            </div>
        )
    }
}

export default withAlert(CourseRecommendation);
