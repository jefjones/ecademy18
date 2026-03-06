import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './BenchmarkTestClassComparisonView.css';
const p = 'BenchmarkTestClassComparisonView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import StandardsAssignmentResult from '../../components/StandardsAssignmentResult';
import MultiSelect from '../../components/MultiSelect';
import GradingRatingLegend from '../../components/GradingRatingLegend';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class BenchmarkTestClassComparisonView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					benchmarkTestId: props.benchmarkTestId,
	    }
  }

	handleSelectedClasses = (selectedClasses) => this.setState({selectedClasses})
	classesValueRenderer = (selected, options) => <div className={styles.boldText}><L p={p} t={`Classes:  ${selected.length} of ${options.length}`}/></div>

	handleChange = ({target}) => {
			const {getBenchmarkTestClassComparison, personId} = this.props;
			if (target.value && target.value !== '0') {
					getBenchmarkTestClassComparison(personId, target.value);
					browserHistory.push(`/benchmarkTestClassComparison/${target.value}`)
			}
			this.setState({ benchmarkTestId: target.value });
	}

	handleStandardInfoOpen = (standardCode, standardName) => this.setState({ isShowingModal_standard: true, standardCode, standardName})
	handleStandardInfoClose = () => this.setState({ isShowingModal_standard: false, standardCode: '', standardName: ''})

	render() {
	    const {benchmarkTestClassComparison=[], standardsRatings, benchmarkTests, fetchingRecord, standardsRatingTableId} = this.props;
	    const {benchmarkTestId, selectedClasses, isShowingModal_standard, standardCode, standardName} = this.state;
			let countArray = [<L p={p} t={`First`}/>, <L p={p} t={`Second`}/>, <L p={p} t={`Third`}/>, <L p={p} t={`Fourth`}/>, <L p={p} t={`Fifth`}/>, <L p={p} t={`Sixth`}/>, <L p={p} t={`Seventh`}/>, <L p={p} t={`Eighth`}/>, <L p={p} t={`Ninth`}/>];
			let headings = [{label: <L p={p} t={`Class`}/>, tightText: true}]

			let localClasses = benchmarkTestClassComparison;
			if (selectedClasses && selectedClasses.length > 0) {
					localClasses = localClasses && localClasses.length > 0 && localClasses.filter(m => selectedClasses.indexOf(m.courseScheduledId) > -1)
			}

			let maxCount = 0;
			let standards = [];
			localClasses && localClasses.length > 0 && localClasses.forEach(m => {
					if (maxCount < (m.testAssigns && m.testAssigns.length)) {
							maxCount = m.testAssigns.length;
							standards = m.standards;
					}
			})

			for(let i = 0; i < maxCount; i++) {
					headings.push({label: countArray[i], tightText: true})
			}

	    let data = [];

			if (localClasses && localClasses.length > 0) {
	    		data =  localClasses.map(m => {
							let teachers = m.teachers && m.teachers.length > 0 && m.teachers.reduce((acc, t) => acc & acc.length > 0 ? ' ,' + t.label : t.label, '')
							let row = [{value: `${m.courseName} (${teachers})`}];
							m.testAssigns && m.testAssigns.length > 0 && m.testAssigns.map((s, i) =>
									row = row.concat([
											{value:  <div className={styles.row} key={i}>
																	<div className={classes(styles.text, styles.littleRight, styles.muchTop)} data-rh={`Number of students`}>
																			{s.studentCount}
																	</div>
																	<StandardsAssignmentResult scores={s.scoredAnswers}
																			standards={s.scoredAnswers && s.scoredAnswers.length > 0 && s.scoredAnswers[0].standards}
																			standardsRatings={standardsRatings} showTopPercent={true}/>
															 </div>
											}
									])
							)
	            return row;
	        });
	    } else {
	        data = [[{value: ''}, {value: <i><L p={p} t={`No class comparisons found.`}/></i> }]]
	    }

			return (
	        <div className={styles.container}>
	            <div className={globalStyles.pageTitle}>
	                <L p={p} t={`Benchmark Test Class Comparison`}/>
	            </div>
							<div className={styles.rowWrap}>
									<div>
											<SelectSingleDropDown
													id={`benchmarkTestId`}
													name={`benchmarkTestId`}
													label={<L p={p} t={`Benchmark test`}/>}
													value={benchmarkTestId || ''}
													options={benchmarkTests}
													className={styles.moreBottomMargin}
													height={`medium`}
													onChange={this.handleChange}
													required={true}
													whenFilled={benchmarkTestId} />
									</div>
									<div className={styles.multiSelect} data-rh={'Share this test with one or more teachers'}>
											<div className={styles.text}><L p={p} t={`Filter classes`}/></div>
											<MultiSelect
													name={'selectedClasses'}
													options={benchmarkTestClassComparison || []}
													onSelectedChanged={this.handleSelectedClasses}
													valueRenderer={this.classesValueRenderer}
													getJustCollapsed={() => {}}
													selected={selectedClasses || []}/>
									</div>
									<div>
											<div className={classes(styles.text, styles.moreBottomMargin)}><L p={p} t={`Standards (in order)`}/></div>
											{standards && standards.length > 0 && standards.map((m, i) =>
													<div className={classes(styles.row, styles.moreLeft)} key={i}>
															<div className={styles.boldText}>{`${i+1*1} - ${m.code}`}</div>
															<div onClick={() => this.handleStandardInfoOpen(m.code, m.name)}>
																	<Icon pathName={'info'} className={styles.iconPosition}/>
															</div>
													</div>
											)}
											<GradingRatingLegend standardsRatings={standardsRatings} gradingType={'STANDARDSRATING'}
													standardsRatingTableId={standardsRatingTableId}/>
									</div>
							</div>
							<div className={styles.moreTop}>
									<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.benchmarkTestClassComparison} />
							</div>
							{isShowingModal_standard &&
									<MessageModal handleClose={this.handleStandardInfoClose} heading={<L p={p} t={`Standard: ${standardCode}`}/>}
										 explain={standardName}
										 onClick={this.handleStandardInfoClose} />
							}
							<OneFJefFooter />
					</div>
			)
	}
}
