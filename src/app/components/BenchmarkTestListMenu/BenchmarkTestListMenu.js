import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import * as globalStyles from '../../utils/globalStyles.css';
import styles from './BenchmarkTestListMenu.css';
import classes from 'classnames';
import Icon from '../Icon';
import { withAlert } from 'react-alert';
import MessageModal from '../../components/MessageModal';
import MultiSelect from '../../components/MultiSelect';
import {guidEmpty} from '../../utils/guidValidate';
const p = 'component';
import L from '../../components/PageLanguage';

class BenchmarkTestListMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

		componentDidUpdate() {
				const {benchmarkTest={}} = this.props;
				const {benchmarkTestId} = this.state;
				if (benchmarkTest.benchmarkTestId && benchmarkTestId !== benchmarkTest.benchmarkTestId) {
						let selectedSharedTeachers = benchmarkTest.sharedTeachers && benchmarkTest.sharedTeachers.length > 0 && benchmarkTest.sharedTeachers.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
						this.setState({ isInit: true, selectedSharedTeachers, benchmarkTestId: benchmarkTest.benchmarkTestId });

				}
		}

		chooseBenchmarkTest = () => {
				this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Choose a benchmarkTest from the list. Then, choose an action.`}/></div>)
		}

		handleDeleteOpen = () => this.setState({ isShowingModal_delete: true, localModalOpen: true });
		handleDeleteClose = () => this.setState({ isShowingModal_delete: false, localModalOpen: false });
		handleDelete = () => {
				const {removeBenchmarkTest, personId, benchmarkTest} = this.props;
				removeBenchmarkTest(personId, benchmarkTest.benchmarkTestId);
				this.handleDeleteClose();
		}

		handleBenchmarkShareOpen = () => this.setState({ isShowingModal_share: true, localModalOpen: true });
		handleBenchmarkShareClose = () => this.setState({ isShowingModal_share: false, localModalOpen: false });
		handleBenchmarkShare = (teacherIdList) => {
				const {shareBenchmarkTest, personId, benchmarkTest} = this.props;
				shareBenchmarkTest(personId, benchmarkTest.benchmarkTestId, teacherIdList);
				this.handleBenchmarkShareClose();
		}

		handleSelectedSharedTeachers = (selectedSharedTeachers) => {
				const {sharedTeachersBenchmarkTest, personId, benchmarkTest} = this.props;
				this.setState({selectedSharedTeachers})
				sharedTeachersBenchmarkTest(personId, benchmarkTest.benchmarkTestId, selectedSharedTeachers);
		}

		facilitatorsValueRenderer = (selected, options) => {
        return <div className={styles.bold}>{`Shared with teachers:  ${selected.length} of ${options.length}`}</div>;
    }

		handleRateTestOpen = () => this.setState({ isShowingModal_rateTest: true, localModalOpen: true });
		handleRateTestClose = () => this.setState({ isShowingModal_rateTest: false, localModalOpen: false });
		handleRateTest = (rating) => {
				const {rateBenchmarkTest, personId, benchmarkTest} = this.props;
				rateBenchmarkTest(personId, benchmarkTest.benchmarkTestId, rating)
				this.handleRateTestClose();
		}

    render() {
        const {personId, className="", benchmarkTest={}, facilitators, addOrUpdateBenchmarkTestOpen, ownerPersonId, assessmentId,
								modalOpen} = this.props;
				const {isShowingModal_delete, selectedSharedTeachers, localModalOpen} = this.state;

				let benchmarkTestId = benchmarkTest.benchmarkTestId;
				let hasRecordChosen = benchmarkTestId && benchmarkTestId !== guidEmpty ? true : false;

        return (
            <div className={classes(styles.container, className)}>
								{personId === ownerPersonId &&
										<a onClick={!hasRecordChosen ? this.chooseBenchmarkTest : () => browserHistory.push(`/assessmentQuestions/${assessmentId}`)}
														data-rh={'Add or modify the test questions'}>
												<Icon pathName={'list3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
										</a>
								}
								{personId !== ownerPersonId &&
										<a onClick={!hasRecordChosen ? this.chooseBenchmarkTest : () => this.handleRateTestOpen(benchmarkTestId)}
														data-rh={'Rate the chosen benchmark test'}>
												<Icon pathName={'medal_first'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
										</a>
								}
								<a onClick={!hasRecordChosen ? this.chooseBenchmarkTest : () => addOrUpdateBenchmarkTestOpen('edit')}
												data-rh={'Edit benchmark test'}>
										<Icon pathName={'pencil0'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={() => addOrUpdateBenchmarkTestOpen('add')} data-rh={'Add a benchmark test'}>
										<Icon pathName={'plus'} fillColor={'green'} className={classes(styles.image, styles.moreTopMargin)}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseBenchmarkTest : () => browserHistory.push(`/benchmarkTestLibrary`)}
												data-rh={'Choose a benchmark test from the library'}>
										<Icon pathName={'books_library'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseBenchmarkTest : () => browserHistory.push(`/benchmarkTestClassComparison/${benchmarkTestId}`)}
												data-rh={'Compare benchmark tests between classes'}>
										<Icon pathName={'equalizer'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
								</a>
								<a onClick={!hasRecordChosen ? this.chooseBenchmarkTest : this.handleDeleteOpen} data-rh={'Delete this benchmarkTest'}>
										<Icon pathName={'trash2'} premium={true} fillColor={hasRecordChosen ? 'maroon' : ''}
												className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
								</a>
								{hasRecordChosen && !modalOpen && !localModalOpen &&
										<div className={styles.multiSelect} data-rh={'Share this test with one or more teachers'}>
												<MultiSelect
														name={'selectedSharedTeachers'}
														options={facilitators || []}
														onSelectedChanged={this.handleSelectedSharedTeachers}
														valueRenderer={this.facilitatorsValueRenderer}
														getJustCollapsed={() => {}}
														selected={selectedSharedTeachers || []}/>
										</div>
								}
								{isShowingModal_delete &&
		                <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this benchmarkTest?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to remove this benchmarkTest? Access to any homeowrk and grades turned in for this homework will be lost.`}/>} isConfirmType={true}
		                   onClick={this.handleDelete} />
		            }
            </div>
        )
    }
};

export default withAlert(BenchmarkTestListMenu);
