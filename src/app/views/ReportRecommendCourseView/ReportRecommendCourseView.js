import React, {Component} from 'react';
import styles from './ReportRecommendCourseView.css';
const p = 'ReportRecommendCourseView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import Loading from '../../components/Loading';
import classes from 'classnames';
import ExcelRecommendCourseCount from '../../components/ExcelRecommendCourseCount';
import ExcelRecommendByTeacher from '../../components/ExcelRecommendByTeacher';
import ExcelRecommendByStudent from '../../components/ExcelRecommendByStudent';

export default class ReportRecommendCourseView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
	    }
  }

render() {
    const {reportRecommendCourseName, reportRecommendByTeacher, reportRecommendByStudent} = this.props;

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Reports for Course Recommendations`}/>
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<L p={p} t={`Course Name with Student Count`}/>
								<Loading isLoading={!reportRecommendCourseName || reportRecommendCourseName.length === 0} />
								{reportRecommendCourseName && reportRecommendCourseName.length > 0 &&
										<ExcelRecommendCourseCount report={reportRecommendCourseName}/>
								}
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<L p={p} t={`Recommendations by Teachers`}/>
								<Loading isLoading={!reportRecommendByTeacher || reportRecommendByTeacher.length === 0} />
								{reportRecommendByTeacher && reportRecommendByTeacher.length > 0 &&
										<ExcelRecommendByTeacher report={reportRecommendByTeacher}/>
								}
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<L p={p} t={`Recommendations for Students`}/>
								<Loading isLoading={!reportRecommendByStudent || reportRecommendByStudent.length === 0} />
								{reportRecommendByStudent && reportRecommendByStudent.length > 0 &&
										<ExcelRecommendByStudent report={reportRecommendByStudent}/>
								}
						</div>
						<OneFJefFooter />
      	</div>
    );
  }
}
