import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import styles from './CourseAssignByAdminListView.css';
const p = 'CourseAssignByAdminListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import Loading from '../../components/Loading';
import InputText from '../../components/InputText';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import InputDataList from '../../components/InputDataList';
import Paper from '@material-ui/core/Paper';
import TableVirtualFast from '../../components/TableVirtualFast';
import classes from 'classnames';
import {withAlert} from 'react-alert';

class CourseAssignByAdminListView extends Component {

    constructor(props) {
      super(props);

      this.state = {
	        isShowingModal_remove: false,
					isShowingModal_description: false,
					courseName: '',
					description: '',
      }
    }

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				let field = target.name;
				newState[field] = target.value === "0" ? "" : target.value;
				this.setState(newState);
		}

		handleDescriptionOpen = (courseName, description) => this.setState({isShowingModal_description: true, courseName, description })
    handleDescriptionClose = () => this.setState({isShowingModal_description: false })

		clearFilters = () => {
				this.setState({
						partialNameText: '',
						studentIdList: [],
						selectedGradeLevels: [],
				});
		}

		handleRemoveOpen = (courseAssignByAdminId) => this.setState({ isShowingModal_remove: true, courseAssignByAdminId });
		handleRemoveClose = () => this.setState({ isShowingModal_remove: false, courseAssignByAdminId: '' });
		handleRemove = () => {
				const {personId, removeCourseAssignByAdmin} = this.props;
				const {courseAssignByAdminId} = this.state;
				removeCourseAssignByAdmin(personId, courseAssignByAdminId);
				this.handleRemoveClose();
		}

		dataListChange = (field, studentIdList) => {
				this.setState({ studentIdList })
		}

		toggleGradeLevel = (gradeLevelId) => {
				let selectedGradeLevels = Object.assign([], this.state.selectedGradeLevels);
				selectedGradeLevels = selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(gradeLevelId) > -1
						? selectedGradeLevels.filter(id => id !== gradeLevelId)
						: selectedGradeLevels && selectedGradeLevels.length > 0
								? selectedGradeLevels.concat(gradeLevelId)
								: [gradeLevelId];
				this.setState({ selectedGradeLevels, studentIdList: [] });
		}

		clearFilters = () => {
				this.setState({
						partialNameText: '',
						studentIdList: [],
						selectedGradeLevels: [],
				});
		}

	  toggleNoConfirmDelete = () => this.setState({ noConfirmDelete: !this.state.noConfirmDelete });

    render() {
      const {personId, courseAssignByAdmins, fetchingRecord, students, gradeLevels, removeCourseAssignByAdmin } = this.props;
      const {isShowingModal_remove, partialNameText, isShowingModal_description, courseName, description, studentIdList, selectedGradeLevels,
							noConfirmDelete} = this.state;

			let localList = courseAssignByAdmins;
			if (localList && localList.length > 0 ) {
					if (partialNameText) {
							let cutBackTextFilter = partialNameText.toLowerCase();
							localList = localList && localList.length > 0 && localList.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1));
					}
					if (studentIdList && studentIdList.length > 0) {
							localList = localList && localList.length > 0 && localList.filter(w => studentIdList.indexOf(w.studentPersonId) > -1);
					}
					if (selectedGradeLevels && selectedGradeLevels.length > 0) {
							localList = localList && localList.length > 0 && localList.filter(w => selectedGradeLevels.indexOf(w.gradeLevelId) > -1);
					}
			}

			localList = localList && localList.length > 0 && localList.map(m => {
					m.remove = <div className={classes(styles.cellText, globalStyles.remove)} onClick={noConfirmDelete ? () => removeCourseAssignByAdmin(personId, m.courseAssignByAdminId) : () => this.handleRemoveOpen(m.courseAssignByAdminId)}>remove</div>
					m.requiredOrSuggested = <div className={styles.cellText}>
																			{m.suggestionOnly ? 'Suggested' : 'Required'}
																	</div>
					m.courseId = <div className={styles.cellText}>{m.externalId}</div>;
					m.course = <div onClick={!m.description ? () => {} : () => this.handleDescriptionOpen(m.courseName, m.description)} className={classes(styles.cellText, styles.wrap, (m.description ? styles.link : ''))}>
												{m.courseName}
										 </div>;
					m.creditCount = <div className={styles.cellText}>{m.credits}</div>
					m.gradeLevel = <div className={styles.cellText}>{m.gradeLevelName}</div>
					m.student = <div className={styles.cellText}>{m.studentName}</div>
					return m;
			});

			let columns = [
				{
					width: 50,
					label: '',
					dataKey: 'remove',
				},
				{
					width: 90,
					label: <L p={p} t={`Required`}/>,
					dataKey: 'requiredOrSuggested',
				},
				{
					width: 70,
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
				},
				{
					width: 70,
					label: <L p={p} t={`Grade`}/>,
					dataKey: 'gradeLevel',
				},
				{
					width: 160,
					label: <L p={p} t={`Student`}/>,
					dataKey: 'student',
				},
			];

      return (
        <div className={styles.container} id={'topContainer'}>
						<div>
		            <div className={styles.marginLeft}>
		                <div className={globalStyles.pageTitle}>
		                  	<L p={p} t={`Assign Courses by Admin`}/>
		                </div>
										<div className={classes(styles.bold, styles.text)}>
												<L p={p} t={`Filters:`}/>
										</div>
										<div className={styles.rowWrap}>
												<InputText
														id={"partialNameText"}
														name={"partialNameText"}
														size={"medium"}
														label={<L p={p} t={`Name search`}/>}
														value={partialNameText || ''}
														onChange={this.changeItem}/>

												<div className={styles.moreTop}>
														<InputDataList
																label={<L p={p} t={`Student(s)`}/>}
																name={'studentIdList'}
																options={students}
																value={studentIdList || []}
																multiple={true}
																height={`medium`}
																className={styles.moreSpace}
																labelClass={styles.checkboxLabel}
																onChange={(values) => this.dataListChange('studentIdList', values)}
																removeFunction={this.removeStudent}/>
												</div>

												<div className={classes(styles.moreTop, styles.moreLeft, styles.moreBottom)}>
														<span className={styles.textRating}><L p={p} t={`Grade level(s)`}/></span>
														<div className={styles.row}>
																{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label.length <= 2).map((m, i) =>
																		<Checkbox
																				key={i}
																				id={m.id}
																				label={m.label}
																				checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && (selectedGradeLevels.indexOf(m.id) > -1 || selectedGradeLevels.indexOf(String(m.id)) > -1)) || ''}
																				onClick={() => this.toggleGradeLevel(m.id)}
																				labelClass={styles.labelCheckbox}
																				checkboxClass={styles.checkbox} />
																)}
														</div>
												</div>

												<a onClick={this.clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
														<L p={p} t={`Clear filters`}/>
												</a>
										</div>
								</div>
								<Loading isLoading={fetchingRecord.courseAssignByAdmin} />
								<Paper style={{ height: 400, width: '100%', marginTop: '8px' }}>
										<TableVirtualFast rowCount={(localList && localList.length) || 0}
												rowGetter={({ index }) => (localList && localList.length > 0 && localList[index]) || ''}
												columns={columns} />
								</Paper>
								<div className={classes(styles.moreLeft, styles.moreTop)}>
										<Checkbox
												id={'noConfirmDelete'}
												label={<L p={p} t={`Do not confirm on delete`}/>}
												checked={noConfirmDelete || false}
												onClick={this.toggleNoConfirmDelete}
												labelClass={styles.labelNoConfirm}
												checkboxClass={styles.checkbox} />
								</div>
								<hr/>
								<div className={classes(styles.row, styles.moreLeft)} onClick={() => browserHistory.push('/courseAssignByAdminAdd')}>
										<Icon pathName={'plus'} className={styles.iconTeacher} fillColor={'green'}/>
										<Link to={`/courseAssignByAdminAdd`} className={styles.menuItem}><L p={p} t={`Add another course assignment`}/></Link>
								</div>
						</div>
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this Assignment?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this assignment?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionClose} heading={courseName}
                   explain={description}  onClick={this.handleDescriptionClose} />
            }
        </div>
    )};
}

export default withAlert(CourseAssignByAdminListView);
