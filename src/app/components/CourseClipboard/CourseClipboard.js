import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './CourseClipboard.css';
import classes from 'classnames';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import CourseListTable from '../../components/CourseListTable';
const p = 'component';
import L from '../../components/PageLanguage';

class CourseClipboard extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
						isShowingModal: false,
	      }
    }

		handleClearCoursesOpen = () => this.setState({ isShowingModal: true })
		handleClearCoursesClose = () => this.setState({ isShowingModal: false })
		handleClearCourses = () => {
				const {removeAllCourseClipboard, personId, courseListType} = this.props;
				removeAllCourseClipboard(personId, courseListType)
				this.handleClearCoursesClose();
		}

    render() {
	      const {personId, courseListType, courses, companyConfig, setCoursesSelected, singleRemove, hideIcons, isFetchingRecord, accessRoles} = this.props;
				const {isShowingModal} = this.state;

	      return (
						<div className={styles.studentSection}>
								<div className={classes(styles.row, styles.littleLeft)}>
										<div className={styles.countText}>{`Count: ${(courses && courses.length) || 0}`}</div>
										<a onClick={this.handleClearCoursesOpen} className={classes(styles.row, styles.link)}>
												<Icon pathName={'cross_circle'} premium={true} className={styles.iconSmall}/><L p={p} t={`Clear clipboard`}/>
										</a>
										<a onClick={courseListType === 'courseEntry' || (companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor))
																? () => browserHistory.push('/baseCourses')
																: () => browserHistory.push('/scheduledCourses')
														} className={classes(styles.row, styles.link, styles.muchLeft)}>
												<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
												{courses && courses.length > 0 ? <L p={p} t={`Choose more courses`}/> : <L p={p} t={`Choose courses`}/>}
										</a>
								</div>
								<div className={styles.scrollable}>
										<CourseListTable courses={courses} companyConfig={companyConfig} shortVersion={true} courseListType={courseListType}
												setCoursesSelected={setCoursesSelected} personId={personId} emptyMessage={<L p={p} t={`No courses chosen`}/>}
												includeRemoveClipboardIcon={true} singleRemove={singleRemove} accessRoles={accessRoles}
												hideIcons={hideIcons} isFetchingRecord={isFetchingRecord}/>
								</div>
								{isShowingModal &&
                     <MessageModal handleClose={this.handleClearCoursesClose} heading={<L p={p} t={`Clear the Course Clipboard?`}/>}
                        explainJSX={<L p={p} t={`Are you sure you want to clear the course clipboard?`}/>} isConfirmType={true}
                        onClick={this.handleClearCourses} />
                }
						</div>
	    	)
	  };
}

export default CourseClipboard;
