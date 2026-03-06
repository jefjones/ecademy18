import React, {Component} from 'react';
import styles from './ReportCourseWaitListView.css';
const p = 'ReportCourseWaitListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import Loading from '../../components/Loading';
import MessageModal from '../../components/MessageModal';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import classes from 'classnames';
import ExcelCourseWaitList from '../../components/ExcelCourseWaitList';
import Paper from '@material-ui/core/Paper';
import InputText from '../../components/InputText';
import TableVirtualFast from '../../components/TableVirtualFast';
import {doSort} from '../../utils/sort.js';

export default class ReportCourseWaitListView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
	    }
  }

isDoNotAddCourse = (courseEntryId) => {
		const {doNotAddCourses} = this.props;
		let isDoNotAddCourse = false;
		if (doNotAddCourses && doNotAddCourses.length > 0) {
				let doNotAddCourse = doNotAddCourses.filter(m => m.courseEntryId === courseEntryId)[0];
				if (doNotAddCourse && doNotAddCourse.courseEntryId) isDoNotAddCourse = true;
		}
		return isDoNotAddCourse
}

handleDescriptionOpen = (courseName, description) => this.setState({isShowingModal_description: true, courseName, description })
handleDescriptionClose = () => this.setState({isShowingModal_description: false })

changeItem = ({target}) => {
		//const {updatePersonConfig, personId} = this.props;
		let newState = Object.assign({}, this.state);
		let field = target.name;
		newState[field] = target.value === "0" ? "" : target.value;
		this.setState(newState);
}

toggleShowOnlyMarked = () => this.setState({ showOnlyMarked: !this.state.showOnlyMarked })

toggleDoNotAddCourse = (courseEntryId) => {
		const {personId, toggleDoNotAddCourse} = this.props;
		toggleDoNotAddCourse(personId, courseEntryId);
}

render() {
    const {reportExcelCourseWaitList, coursesBase} = this.props;
		const {isShowingModal_description, courseName, description, partialNameText, showOnlyMarked} = this.state;

		let localScheduledCourses = coursesBase;
		if (localScheduledCourses && localScheduledCourses.length > 0 ) {
				if (partialNameText) {
						let cutBackTextFilter = partialNameText.toLowerCase();
						//cutBackTextFilter = cutBackTextFilter && cutBackTextFilter.length > 15 ? cutBackTextFilter.substring(0,15) : cutBackTextFilter;
						localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1));
				}
				if (showOnlyMarked) {
						localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.filter(m => this.isDoNotAddCourse(m.courseEntryId));
				}
		}
		localScheduledCourses = doSort(localScheduledCourses, { sortField: 'courseName', isAsc: true, isNumber: false })

		localScheduledCourses = localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses.map(m => {
				m.choose = <div className={classes(styles.cellText, (m.intervals && m.intervals.length > 0 && (m.intervals[0].name.indexOf("MP1") > -1 || m.intervals[0].name.indexOf("MP2") > -1) ? styles.backMaroon : styles.backGray))}>
												<div onClick={() => this.toggleDoNotAddCourse(m.courseEntryId)} className={styles.cellText}>
															<Icon pathName={this.isDoNotAddCourse(m.courseEntryId) ? 'checkmark' : 'square_empty'} premium={!this.isDoNotAddCourse(m.courseEntryId)}
																	className={classes(styles.iconSquare, styles.backWhite)} fillColor={this.isDoNotAddCourse(m.courseEntryId) ? 'green' : 'black'}/>
												</div>
										</div>;
				m.courseId = m.externalId;
				m.course = <div onClick={!m.description ? () => {} : () => this.handleDescriptionOpen(m.courseName, m.description)} className={classes(styles.wrap, (m.description ? styles.link : ''))}>
											{m.courseName}
									 </div>;
				m.creditCount = <div className={styles.cellText}>{m.credits}</div>
				return m;
		});

		let columns = [
				{
					width: 50,
					label: '',
					dataKey: 'choose',
				},
				{
					width: 60,
					label: <L p={p} t={`Id`}/>,
					dataKey: 'courseId',
				},
				{
					width: 220,
					label: <L p={p} t={`Course`}/>,
					dataKey: 'course',
				},
				{
					width: 40,
					label: <L p={p} t={`Credits`}/>,
					dataKey: 'creditCount',
					numeric: true,
				},
		];

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Course Wait List Count`}/>
						</div>
						<div className={classes(styles.row, styles.label, styles.moreTop)}>
								<Loading isLoading={!reportExcelCourseWaitList || reportExcelCourseWaitList.length === 0} loadingText={<L p={p} t={`Please wait`}/>} />
								{reportExcelCourseWaitList && reportExcelCourseWaitList.length > 0 &&
										<ExcelCourseWaitList report={reportExcelCourseWaitList}/>
								}
						</div>
						<hr/>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Do Not Allow Wait List Requests to Courses`}/>
						</div>
						<div className={globalStyles.instructionsBig}>
								<L p={p} t={`Place a checkmark before any courses that will not have new sections added.`}/>
						</div>
						<InputText
								id={"partialNameText"}
								name={"partialNameText"}
								size={"medium"}
								label={<L p={p} t={`Name search`}/>}
								value={partialNameText || ''}
								onChange={this.changeItem}/>

						<div className={styles.checkbox}>
								<Checkbox
										id={'showOnlyMarked'}
										label={<L p={p} t={`Show only the classes which are marked`}/>}
										labelClass={styles.checkboxLabel}
										checked={showOnlyMarked || false}
										onClick={this.toggleShowOnlyMarked}
										className={styles.button}/>
						</div>

						<Paper style={{ height: 400, width: '90%' }}>
								<TableVirtualFast rowCount={(localScheduledCourses && localScheduledCourses.length) || 0}
										rowGetter={({ index }) => (localScheduledCourses && localScheduledCourses.length > 0 && localScheduledCourses[index]) || ''}
										columns={columns} />
						</Paper>
						<OneFJefFooter />
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionClose} heading={courseName}
                   explain={description}  onClick={this.handleDescriptionClose} />
            }
      	</div>
    );
  }
}
