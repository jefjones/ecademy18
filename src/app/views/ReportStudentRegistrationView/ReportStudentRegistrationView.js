import React, {Component} from 'react';
import styles from './ReportStudentRegistrationView.css';
const p = 'ReportStudentRegistrationView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import Loading from '../../components/Loading';
import classes from 'classnames';
import ExcelStudentRegistration from '../../components/ExcelStudentRegistration';
import ExcelCourseSeatStatus from '../../components/ExcelCourseSeatStatus';
import ExcelStudentCourseAssign from '../../components/ExcelStudentCourseAssign';

export default class ReportStudentRegistrationView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
	    }
  }

	render() {
    const {reportStudentRegistration, reportCourseSeatStatus, reportStudentCourseAssign} = this.props;

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Reports for Student Registration`}/>
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<L p={p} t={`Student Registration in Progress`}/>
								<Loading isLoading={!reportStudentRegistration || reportStudentRegistration.length === 0} />
								{reportStudentRegistration && reportStudentRegistration.length > 0 &&
										<ExcelStudentRegistration report={reportStudentRegistration}/>
								}
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<L p={p} t={`Course Seat Status`}/>
								<Loading isLoading={!reportCourseSeatStatus || reportCourseSeatStatus.length === 0} />
								{reportCourseSeatStatus && reportCourseSeatStatus.length > 0 &&
										<ExcelCourseSeatStatus report={reportCourseSeatStatus}/>
								}
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<L p={p} t={`Student Course Assignments`}/>
								<Loading isLoading={!reportStudentCourseAssign || reportStudentCourseAssign.length === 0} />
								{reportStudentCourseAssign && reportStudentCourseAssign.length > 0 &&
										<ExcelStudentCourseAssign report={reportStudentCourseAssign}/>
								}
						</div>
						<OneFJefFooter />
      	</div>
    );
  }
}
