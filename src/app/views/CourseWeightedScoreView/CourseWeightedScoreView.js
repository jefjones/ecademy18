import React, {Component} from 'react';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import styles from './CourseWeightedScoreView.css';
const p = 'CourseWeightedScoreView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import TextDisplay from '../../components/TextDisplay';
import InputText from '../../components/InputText';
import EditTable from '../../components/EditTable';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class CourseWeightedScoreView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
	      	isShowingModal: false,
					weightedScores: [],
	    }
  }

	componentDidUpdate() {
			const {weightedScores} = this.props;
			let hasPercent = false;
			weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {if (m.scorePercent) hasPercent = true})
			if ((hasPercent && !this.state.hasPercentUpdated) || (!hasPercent && !this.state.hasBlankRecord)) {
					this.setState({ weightedScores, hasPercentUpdated: hasPercent, hasBlankRecord: (!hasPercent && !this.state.hasBlankRecord) });
			}
	}

	componentWillUnMount() {
			this.props.clearCourseWeightedScores();
	}

	changePercent = (contentTypeId, event) => {
			let weightedScores = this.state.weightedScores;
			weightedScores = weightedScores && weightedScores.length > 0 && weightedScores.map(m => {
					if (m.contentTypeId === contentTypeId) {
							m.scorePercent = event.target.value;
					}
					return m;
			})
			this.setState({ weightedScores });
	}

	is100PercentOrZero = () => {
			const {weightedScores} = this.state;
			let totalPercent = 0;
			weightedScores && weightedScores.length > 0 && weightedScores.forEach(m => {
					totalPercent = Number(totalPercent) + Number(m.scorePercent);
			})
			return totalPercent === 100 || !totalPercent;
	}

  processForm = () => {
      const {updateCourseWeightedScores, personId, courseEntryId} = this.props;
      const {weightedScores} = this.state;
      let hasError = false;

      if (!this.is100PercentOrZero()) {
          hasError = true;
          this.handle100PercentOpen();
      }

      if (!hasError) {
          updateCourseWeightedScores(personId, courseEntryId, weightedScores);
          this.setState({ weightedScores: [] });
          browserHistory.push(`/scheduledCourses`)
      }
  }

  handle100PercentOpen = (classPeriodId) => this.setState({isShowingModal: true})
  handle100PercentClose = () => this.setState({isShowingModal: false })

  render() {
    const {course, companyConfig, fetchingRecord} = this.props;
    const {weightedScores, isShowingModal} = this.state;

		let headings = [{label: <L p={p} t={`Content Category`}/>, tightText: true}, {label: <L p={p} t={`Weight %`}/>, tightText: true}];
    let data = [];

    if (weightedScores && weightedScores.length > 0) {
        data = weightedScores.map(m => {
            return ([
              {value: m.contentTypeName},
              {value: <InputText numberOnly={true} id={m.contentTypeId} size={"super-short"} value={m.scorePercent || ''} onChange={(event) => this.changePercent(m.contentTypeId, event)} />},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Course Weighted Scores`}/>
            </div>
						<TextDisplay label={<L p={p} t={`Course`}/>} text={course && course.courseName} />
						<div className={styles.instruction}><L p={p} t={`If you choose not to use a course content type, leave the percent blank or set it to zero.  This will cause that content type not to show up in the list when creating a new assignment.`}/></div>
						<hr />
						<EditTable labelClass={styles.tableLabelClass} headings={headings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink} isFetchingRecord={fetchingRecord.courseWeightedScore}/>
            <div className={styles.rowFromLeft}>
								<Link to={'/firstNav'} className={styles.cancelLink} ><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
            <OneFJefFooter />
            {isShowingModal &&
                <MessageModal handleClose={this.handle100PercentClose} heading={<L p={p} t={`Entries need to equal 100%`}/>}
                   explainJSX={<L p={p} t={`The entries do not equal 100%.  Please check your entry and try again.`}/>}
                   onClick={this.handle100PercentClose} />
            }
      </div>
    );
  }
}
