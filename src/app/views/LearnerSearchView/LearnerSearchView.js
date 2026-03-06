import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './LearnerSearchView.css';
const p = 'LearnerSearchView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import DateTimePicker from '../../components/DateTimePicker';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import RadioGroup from '../../components/RadioGroup';
import DateMoment from '../../components/DateMoment';
import StudentChoiceMenu from '../../components/StudentChoiceMenu';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import moment from 'moment';
import { withAlert } from 'react-alert';
import {doSort} from '../../utils/sort.js';

class LearnerSearchView extends Component {
    constructor(props) {
        super(props);

        this.state = {
						valueClipboardTab: 0,
						students: [],
						hideSearch: false,
						hideMoreOptions: true,
						nameEntry: '',
						filters: {
								birthDateFrom: '',
								birthDateTo: '',
								partialNameText: '',
								courseScheduledId: '',
								facilitatorPersonId: '',
								selectedGradeLevels: [],
								selectedCredits: [],
								guardianPersonId: '',
								studentType: 'all',
								counselorGroup: 'all',
								accredited: 'all',
						},
						sortByHeadings: {
								sortField: '',
								isAsc: '',
								isNumber: ''
						}
        }
    }

		componentWillUnmount() {
				const {saveStudentSearch, personId} = this.props;
				const {filters} = this.state;
				saveStudentSearch(personId, filters)
		}

		clearFilters = (personId) => {
				let filters = {
						birthDateFrom: '',
						birthDateTo: '',
						partialNameText: '',
						courseScheduledId: '',
						facilitatorPersonId: '',
						selectedGradeLevels: [],
						selectedCredits: [],
						guardianPersonId: '',
						studentType: 'all',
						counselorGroup: 'all',
						accredited: 'all',
				}

				this.setState({ filters, partialNameText: '' });
		}

		changeFilters = (event) => {
        const {getStudentCoursesAssigns, personId} = this.props;
				let field = event.target.name;
				let filters = this.state.filters;
				filters[field] = event.target.value;
				this.setState({ filters });
        if (field === 'courseScheduledId') getStudentCoursesAssigns(personId, event.target.value)
		}

		handlePartialNameText = ({target}) => {
				this.setState({ partialNameText: target.value });
				//this.filterStudents(filters);  //This is done now with the Go> button.
		}

		handleRadioChoice = (field, value) => {
				let filters = this.state.filters;
				filters[field] = value;
				this.setState({ filters });
				//this.filterStudents(filters);
		}

		filterStudents = () => {
				const {students, guardians, studentCourseAssigns} = this.props;
				const {filters} = this.state;
				let localStudents = students;
				if (localStudents && localStudents.length > 0) {
						if (filters.birthDateFrom && filters.birthDateTo) {
				        localStudents = localStudents.filter(w => w.birthDate >= filters.birthDateFrom && w.birthDate <= filters.birthDateTo);
				    } else if (filters.birthDateFrom) {
				        localStudents = localStudents.filter(w => w.birthDate >= filters.birthDateFrom);
				    } else if (filters.birthDateTo) {
				        localStudents = localStudents.filter(w => w.birthDate <= filters.birthDateTo);
				    }
						if (filters.birthMonth) {
								localStudents = localStudents.filter(w => moment(w.birthDate).month() === filters.birthMonth - 1);
						}
						if (filters.partialNameText && filters.partialNameText.length > 0) {
								localStudents = localStudents.filter(w => w.firstName.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1 || w.lastName.toLowerCase().indexOf(filters.partialNameText.toLowerCase()) > -1);
				    }
						if (filters.courseScheduledId && filters.courseScheduledId !== "0" && studentCourseAssigns && studentCourseAssigns.length > 0) {
								localStudents = localStudents && localStudents.length > 0 && localStudents.filter(w => {
                    let found = false;
                    studentCourseAssigns.forEach(s => { if (s.id === w.id) found = true; });
                    return found;
                });
				    }
				    if (filters.facilitatorPersonId && filters.facilitatorPersonId !== guidEmpty && filters.facilitatorPersonId !== "0") {
				        localStudents = localStudents && localStudents.length > 0 && localStudents.filter(w => w.facilitatorPersonIdList && w.facilitatorPersonIdList.length > 0 && w.facilitatorPersonIdList.indexOf(filters.facilitatorPersonId) > -1);
				    }
						//If the parent/guardian is chosen, find the studentPersonIdList and filter the localStudents by Id.
						if (filters.guardianPersonId && filters.guardianPersonId !== "0") {
								let guardian = guardians && guardians.length > 0 && guardians.filter(m => m.personId === filters.guardianPersonId)[0];
								if (guardian && guardian.studentPersonIdList && guardian.studentPersonIdList.length > 0) {
										localStudents = localStudents && localStudents.length > 0 && localStudents.length > 0 && localStudents.filter(w => guardian.studentPersonIdList.indexOf(w.personId) > -1);
								}
				    }
						if (filters.selectedGradeLevels && filters.selectedGradeLevels.length > 0) {
								localStudents = localStudents.filter(w => filters.selectedGradeLevels.indexOf(w.gradeLevelId) > -1 || filters.selectedGradeLevels.indexOf(String(w.gradeLevelId)) > -1);
						}
						if (filters.selectedCredits && filters.selectedCredits.length > 0) {
								localStudents = localStudents.filter(w => filters.selectedCredits.indexOf(Math.floor(w.credits)) > -1 || filters.selectedCredits.indexOf(Math.floor(String(w.credits))) > -1);
						}
						if (filters.studentType !== 'all') {
								localStudents = localStudents.filter(w => w.studentType === filters.studentType);
						}
						if (filters.accredited !== 'all') {
								localStudents = localStudents.filter(w => (w.accredited && filters.accredited === 'accredited') || (!w.accredited && filters.accredited === 'nonAccredited'));
						}
						if (filters.counselorGroup !== 'all') {
								if (filters.counselorGroup === 'A_HAU')
										localStudents = localStudents.filter(w => w.lastName <= 'Hau');
								else if (filters.counselorGroup === 'HAV_PATR')
										localStudents = localStudents.filter(w => w.lastName >= 'Hav' && w.lastName <= 'Patr');
								else if (filters.counselorGroup === 'PATT_Z')
										localStudents = localStudents.filter(w => w.lastName >= 'Patt');
						}
				}
				return localStudents;
		}

		toggleHideSearch = () => {
				this.setState({ hideSearch: !this.state.hideSearch });
		}

		toggleMoreOptions = () => {
				this.setState({ hideMoreOptions: !this.state.hideMoreOptions });
		}

		handleNameEntry = (event) => {
				this.setState({ nameEntry: event.target.value });
		}

		handlePartialNameEnterKey = (event) => {
	      event.key === "Enter" && this.setPartialNameText();
	  }

		setPartialNameText = () => {
				let filters = this.state.filters;
				filters.partialNameText = this.state.partialNameText;
				this.setState({ filters });
		}

		toggleGradeLevel = (gradeLevelId) => {
				let filters = this.state.filters;
				filters.selectedGradeLevels = filters.selectedGradeLevels && filters.selectedGradeLevels.length > 0 && filters.selectedGradeLevels.indexOf(gradeLevelId) > -1
						? filters.selectedGradeLevels.filter(id => id !== gradeLevelId)
						: filters.selectedGradeLevels && filters.selectedGradeLevels.length > 0
								? filters.selectedGradeLevels.concat(gradeLevelId)
								: [gradeLevelId];
				this.setState({ filters });
		}

		toggleCredit = (creditId) => {
				let filters = this.state.filters;
				filters.selectedCredits = filters.selectedCredits && filters.selectedCredits.length > 0 && filters.selectedCredits.indexOf(creditId) > -1
						? filters.selectedCredits.filter(id => Number(id) !== Number(creditId))
						: filters.selectedCredits && filters.selectedCredits.length > 0
								? filters.selectedCredits.concat(creditId)
								: [creditId];
				this.setState({ filters });
		}

		changeBirthDate = (field, event) => {
				const filters = this.state.filters;
		    filters[field] = event.target.value;
		    this.setState({ filters });
	  }

		handlePartialNameEntry = (event) => {
				this.setState({ nameEntry: event.target.value });
		}

		handleResetClipboard = (event, sendTo='') => {
				const {resetUserPersonClipboard, personId} = this.props;
				let students = this.filterStudents();
				resetUserPersonClipboard(personId, this.setUserPersonClipboard(), sendTo);
				if (sendTo) {
						sendTo.indexOf('/') > -1 ?  browserHistory.push(sendTo) : browserHistory.push('/' + sendTo);
				}
				this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The student clipboard was overwritten with ${students.length} records.`}/></div>)
		}

		handleAddToClipboard = () => {
				const {addUserPersonClipboard, personId} = this.props;
				let students = this.filterStudents();
				this.props.alert.info(<div className={styles.alertText}>{students.length === 1 ? <L p={p} t={`The student clipboard had 1 record added.`}/> : <L p={p} t={`The student clipboard had ${students.length} records added.`}/>}</div>)
				addUserPersonClipboard(personId, this.setUserPersonClipboard())
		}

		setUserPersonClipboard = () => {
				const {personId, companyConfig} = this.props;
				let students = this.filterStudents();
				let personList = students && students.length > 0 && students.map(m => m.personId);
				return {
						companyId: companyConfig.companyId,
						userPersonId: personId,
						personList,
						personType: 'STUDENT',
				};
		}

		resort = (field) => {
				let sortByHeadings = this.state.sortByHeadings;
				sortByHeadings.isAsc = sortByHeadings.sortField === field ? !sortByHeadings.isAsc : 'desc';
				sortByHeadings.isNumber = field === 'classPeriodId' ? true : false;
				sortByHeadings.sortField = field;
				this.setState({ sortByHeadings })
		}

		scrollData = () => {
				if (document.getElementById('scrollable').scrollTop !== this.state.scrollTop)
						this.setState({ scrollTop: document.getElementById('scrollable').scrollTop });
		}

		prevSearch = (filters) => {
				this.setState({ filters });
				//this.filterStudents(filters);
		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, updatePersonConfig, getStudents, getCoursesScheduled, getGuardians} = this.props;
				this.setState({ schoolYearId: target.value });
				updatePersonConfig(personId, 'SchoolYearId', target.value, () => {
						getStudents(personId, true);
						getCoursesScheduled(personId);
						getGuardians(personId);
				});
				browserHistory.push('/learnerSearch')
		}

		chooseRecord = (student) => this.setState({ studentPersonId: student.studentPersonId });

		singleRemoveFromClipboard = (studentPersonId) => {
				const {removeStudentUserPersonClipboard, personId} = this.props;
				//this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The student clipboard had 1 record added.`}/></div>)
				removeStudentUserPersonClipboard(personId, studentPersonId, 'STUDENT')
		}

    render() {
      const {personId, facilitators, guardians, coursesScheduled, gradeLevels, companyConfig={}, accessRoles, months, userPersonClipboard,
							credits, resetUserPersonClipboard, prevSearchList, savedStudentSearch, personConfig={}, schoolYears, addUserPersonClipboard,
							removeStudentUserPersonClipboard, getStudentSchedule, students, myFrequentPlaces, setMyFrequentPlace, fetchingRecord} = this.props;
			const {hideSearch, hideMoreOptions, filters, sortByHeadings, schoolYearId, partialNameText, studentPersonId} = this.state;

			let student = studentPersonId && students && students.length > 0 && students.filter(m => m.personId === studentPersonId)[0];

			let localStudents = this.filterStudents();

			if (sortByHeadings && sortByHeadings.sortField) {
					localStudents = doSort(localStudents, sortByHeadings);
			}

			localStudents = localStudents && localStudents.length > 0 && localStudents.map((m, i) => {
					m.icons = userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0 && userPersonClipboard.personList.indexOf(m.id) > -1 &&
									     <a onClick={() => this.singleRemoveFromClipboard(m.id)} data-rh={'Remove student from clipboard'}>
      											<Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#7e1212'} premium={true}
      													superScriptClass={styles.plusPosition} className={styles.image}/>
      								 </a>;
          m.student = <div className={classes(globalStyles.cellText, (m.id === studentPersonId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m)}>
							           {m.label}
                      </div>
					m.gradeLevel = <div className={classes(globalStyles.cellText, (m.id === studentPersonId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m)}>
                            {gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(g => g.id === m.gradeLevelId)[0] && gradeLevels.filter(g => g.id === m.gradeLevelId)[0].label}
                         </div>

					if(companyConfig.urlcode !== 'Manheim') {
              m.type = <div className={classes(globalStyles.cellText, (m.id === studentPersonId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m)}>
                          {m.studentType}
                       </div>
          }

          m.creditCount = <div className={classes(globalStyles.cellText, (m.id === studentPersonId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m)}>
                              {m.credits}
                          </div>
          m.birth = <div className={classes(globalStyles.cellText, (m.id === studentPersonId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m)}>
                        <DateMoment date={m.birthDate} format={`D MMM YYYY`} className={styles.birthDate}/>
                    </div>

          m.login = <div className={classes(globalStyles.cellText, (m.id === studentPersonId ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(m)}>
                        {m.lastLoginDate > '2010-01-01'
                            ? <DateMoment date={m.lastLoginDate} format={`D MMM YYYY`} minusHours={6} className={styles.birthDate}/>
                            : ''
                        }
                    </div>

					return m;
			});

      let columns = [
          {
              width: 90,
              label: '',
              dataKey: 'icons',
          },
          {
              width: 160,
              label: <div onClick={() => this.resort('label')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Student`}/></div>,
              dataKey: 'student',
          },
          {
              width: 60,
              label: <div onClick={() => this.resort('gradeLevelId')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Grade`}/></div>,
              dataKey: 'gradeLevel',
          },
			];

			if (companyConfig.urlcode !== 'Manheim') {
					columns.push(
            {
                width: 90,
                label: <div onClick={() => this.resort('studentType')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Type`}/></div>,
                dataKey: 'type',
            });
			}
			columns.push({
          width: 60,
          label: <div onClick={() => this.resort('credits')} className={classes(globalStyles.link, globalStyles.cellText)}>{companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Credits`}/> : <L p={p} t={`Classes`}/>}</div>,
          dataKey: 'creditCount',
      });
			if (companyConfig.urlcode !== 'Manheim') {
					columns.push({
              width: 110,
              label: <div onClick={() => this.resort('birthDate')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Birth Date`}/></div>,
              dataKey: 'birth',
          });
			}
			columns.push({
          width: 120,
          label: <div onClick={() => this.resort('lastLoginDate')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Last Login`}/></div>,
          dataKey: 'login',
      });

      return (
        <div className={classes(styles.marginLeft, styles.container)}>
            <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                <L p={p} t={`Search for Students`}/>
            </div>
						<div className={styles.rowWrap}>
								<div className={styles.filters}>
										<div className={styles.row}>
												<div className={styles.selectPosition}>
														<SelectSingleDropDown
																id={`schoolYearId`}
																label={<L p={p} t={`School year`}/>}
																value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
																options={schoolYears}
																height={`medium`}
																onChange={this.handleUpdateSchoolYear}/>
												</div>
												<div className={classes(styles.moreLeft, styles.moreBottomMargin)}>
														<a onClick={this.toggleHideSearch} className={classes(styles.row, styles.link, styles.moreLeft)}>
																<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
																{hideSearch ? <L p={p} t={`Show search controls`}/> : <L p={p} t={`Hide search controls`}/>}
														</a>
												</div>
												{savedStudentSearch && savedStudentSearch.length > 0 && <div className={styles.divider}>|</div>}
												{!hideSearch && savedStudentSearch && savedStudentSearch.length > 0 &&
														<div className={classes(styles.moreLeft, styles.moreBottomMargin)}>
																<div className={styles.instructions}>previous searches</div>
																<div className={styles.row}>
																		{savedStudentSearch.map((m, i) =>
																				<div key={i} onClick={() => this.prevSearch(m)} className={classes(styles.link, styles.clickSpace)}>{prevSearchList[i]}</div>
																		)}
																</div>
														</div>
												}
										</div>
										{!hideSearch &&
												<div className={styles.grayBack}>
														<div className={styles.row}>
																<div>
																		<InputText
																				id={"partialNameText"}
																				name={"partialNameText"}
																				size={"medium-short"}
																				label={<L p={p} t={`Name search`}/>}
																				value={partialNameText || ''}
																				onChange={this.handlePartialNameText}
																				onEnterKey={this.handlePartialNameEnterKey}/>
																</div>
																<div className={styles.button}>
																		<Button label={<L p={p} t={`Go >`}/>} onClick={this.setPartialNameText} addClassName={styles.overrideButton}/>
																</div>
																<div onClick={this.clearFilters} className={styles.linkStyle}>
																		<L p={p} t={`Clear filters`}/>
																</div>
														</div>
														<div>
																<SelectSingleDropDown
																		id={`courseScheduledId`}
																		name={`courseScheduledId`}
																		label={<L p={p} t={`Courses`}/>}
																		value={filters.courseScheduledId}
																		options={coursesScheduled}
																		className={styles.moreBottomMargin}
																		maxwidth={`medium`}
																		height={`medium`}
																		onChange={this.changeFilters}
																		onEnterKey={this.handleEnterKey}/>
														</div>
                            <Loading isLoading={fetchingRecord.studentCourseAssign} />
														{!accessRoles.facilitator &&
																<div>
								                    <SelectSingleDropDown
								                        id={`facilitatorPersonId`}
								                        label={<L p={p} t={`Teacher`}/>}
								                        value={filters.facilitatorPersonId}
								                        options={facilitators}
								                        height={`medium`}
								                        onChange={this.changeFilters}/>
																</div>
														}
														{companyConfig.urlcode !== 'Manheim' && (accessRoles.admin || accessRoles.facilitator) &&
																<div>
								                    <SelectSingleDropDown
								                        id={`guardianPersonId`}
								                        label={<L p={p} t={`Parent/Guardian`}/>}
								                        value={filters.guardianPersonId}
								                        options={guardians || []}
								                        height={`medium`}
								                        onChange={this.changeFilters}/>
																</div>
														}
														<div>
																<hr />
																<div className={classes(styles.moreLeft, styles.moreBottomMargin)}>
																		<a onClick={this.toggleMoreOptions} className={classes(styles.row, styles.link, styles.moreLeft)}>
																				<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
																				{hideMoreOptions ? <L p={p} t={`Show more options`}/> : <L p={p} t={`Show fewer options`}/>}
																		</a>
																</div>
														</div>
														{!hideMoreOptions &&
																<div>
																		<div className={classes(styles.littleLeft, styles.row)}>
																			<div className={styles.dateRow}>
																					<span className={styles.text}><L p={p} t={`Birth date - From`}/></span>
																					<DateTimePicker id={`birthDateFrom`} value={filters.birthDateFrom} maxDate={filters.birthDateTo}
																							 onChange={(event) => this.changeBirthDate('birthDateFrom', event)}/>
																			</div>
																			<div className={styles.dateRow}>
																					<span className={styles.text}><L p={p} t={`To`}/></span>
																					<DateTimePicker id={`birthDateTo`} value={filters.birthDateTo} minDate={filters.birthDateFrom ? filters.birthDateFrom : ''}
																							onChange={(event) => this.changeBirthDate('birthDateTo', event)}/>
																			</div>
																	</div>
																	<div className={styles.moreLeft}>
																			<SelectSingleDropDown
																					id={`birthMonth`}
																					name={`birthMonth`}
																					label={<L p={p} t={`Birth month`}/>}
																					value={filters.birthMonth}
																					options={months}
																					className={styles.moreBottomMargin}
																					height={`medium`}
																					onChange={this.changeFilters}
																					onEnterKey={this.handleEnterKey}/>
																		</div>
																		{!companyConfig.isMcl &&
																				<div>
																						<hr />
																						<span className={classes(styles.textRating, styles.moreTop)}><L p={p} t={`Grade Level`}/></span>
																						<div className={styles.rowWrap}>
																								{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
																										<Checkbox
																												key={i}
																												id={m.gradeLevelId}
																												label={m.name}
																												checked={(filters.selectedGradeLevels && filters.selectedGradeLevels.length > 0 && (filters.selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || filters.selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
																												onClick={() => this.toggleGradeLevel(m.gradeLevelId)}
																												labelClass={styles.labelCheckbox}
																												checkboxClass={styles.checkbox} />
																								)}
																						</div>
																				</div>
																		}
																		{companyConfig.urlcode === 'Manheim' &&
																				<div>
																						<hr />
																						<span className={classes(styles.textRating, styles.moreTop)}>Credits</span>
																						<div className={styles.rowWrap}>
																								{credits && credits.length > 0 && credits.map((m, i) =>
																										<Checkbox
																												key={i}
																												id={m.id}
																												label={m.label}
																												checked={(filters.selectedCredits && filters.selectedCredits.length > 0 && (filters.selectedCredits.indexOf(m.id) > -1 || filters.selectedCredits.indexOf(String(m.id)) > -1)) || ''}
																												onClick={() => this.toggleCredit(m.id)}
																												labelClass={styles.labelCheckbox}
																												checkboxClass={styles.checkbox} />
																								)}
																						</div>
																				</div>
																		}
																		{companyConfig.urlcode === 'Liahona' &&
																				<RadioGroup
																						data={[{ label: <L p={p} t={`All`}/>, id: "all" }, { id: "ACADEMY", label: <L p={p} t={`Academy`}/> }, { id: "DE", label: <L p={p} t={`Distance Education`}/> }]}
																						title={<L p={p} t={`Course Type`}/>}
																						id={'studentType'}
																						name={'studentType'}
																						horizontal={true}
																						className={styles.radio}
																						initialValue={filters.studentType}
																						onClick={(value) => this.handleRadioChoice('studentType', value)}/>
																		}
																		{companyConfig.urlcode === 'Liahona' &&
																				<RadioGroup
																						data={[{ label: <L p={p} t={`All`}/>, id: "all" }, { id: 'accredited', label: <L p={p} t={`Accredited`}/> }, { id: 'nonAccredited', label: <L p={p} t={`Non-accredited`}/> }]}
																						title={<L p={p} t={`Accredited`}/>}
																						id={'accredited'}
																						name={'accredited'}
																						horizontal={true}
																						className={styles.radio}
																						initialValue={filters.accredited}
																						onClick={(value) => this.handleRadioChoice('accredited', value)}/>
																		}
																		{companyConfig.urlcode === 'Manheim' &&
																				<RadioGroup
																						data={[{ label: "All", id: "all" }, { label: "A - Hau", id: "A_HAU" }, { label: "Hav - Patr", id: "HAV_PATR" }, { label: "Patt - Z", id: "PATT_Z" }]}
																						title={<L p={p} t={`Counselor Group`}/>}
																						id={'counselorGroup'}
																						name={'counselorGroup'}
																						horizontal={true}
																						className={styles.radio}
																						initialValue={filters.counselorGroup}
																						onClick={(value) => this.handleRadioChoice('counselorGroup', value)}/>
																		}
																</div>
														}
												</div>
										}
										<div className={classes(styles.alotLeft, styles.row)}>
												{companyConfig.urlcode === 'Manheim' && accessRoles.admin &&
														<Link to={'/openRegistration'} className={classes(styles.row, styles.tabChoice)}>
															 	<Icon pathName={'sent'} premium={true} />
																<div className={styles.tabs}> <L p={p} t={`Add open`}/><br/><L p={p} t={`registration `}/></div>
														</Link>
												}
												<Link to={'/learnerCourseAssign'} className={classes(styles.row, styles.tabChoice)}>
														<Icon pathName={'clock3'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuper} superScriptClass={styles.superScript}/>
														{companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)
																? <div className={styles.tabs}><L p={p} t={`Recommend Courses`}/></div>
																: <div className={styles.tabs}><L p={p} t={`Assign Courses`}/></div>
														}
												</Link>
												<Link to={'/announcementEdit'} className={classes(styles.row, styles.tabChoice)}>
														<Icon pathName={'speaker_loud'} premium={true} className={styles.liftIcon}/>
														<div className={styles.tabs}><L p={p} t={`Compose Message`}/></div>
												</Link>
										</div>
										<div className={classes(styles.row, styles.moreLeft, styles.littleTop)}>
												<div className={classes(styles.row, styles.text)}>
                            <L p={p} t={`Students: `}/>
                            <div className={globalStyles.littleLeft}>
                                {localStudents.length || 0}
                            </div>
                        </div>
												<a onClick={this.handleResetClipboard} className={classes(styles.row, styles.link, styles.muchLeft)}>
                            <Icon pathName={'sync'} premium={true} className={styles.iconSmall}/><L p={p} t={`Overwrite clipboard`}/>
												</a>
												<a onClick={this.handleAddToClipboard} className={classes(styles.row, styles.link, styles.muchLeft)}>
														<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/><L p={p} t={`Add all to clipboard`}/>
												</a>
										</div>
								</div>
								<div>
										{localStudents && localStudents.length > 0 &&
												<div className={styles.menuWidth}>
														<StudentChoiceMenu personId={personId} isAdmin={accessRoles.admin} addToClipboard={this.handleSingleAddToClipboard}
																addUserPersonClipboard={addUserPersonClipboard} resetUserPersonClipboard={resetUserPersonClipboard}
																studentPersonId={studentPersonId} studentType={student && student.studentType} personConfig={personConfig}
																userPersonClipboard={userPersonClipboard} companyConfig={companyConfig} getStudentSchedule={getStudentSchedule}
																removeStudentUserPersonClipboard={removeStudentUserPersonClipboard}/>
												</div>
										}
                    <Loading isLoading={fetchingRecord.learnerSearch} />
    								<Paper style={{ height: 400, width: '700px', marginTop: '8px' }}>
    										<TableVirtualFast rowCount={(localStudents && localStudents.length) || 0}
    												rowGetter={({ index }) => (localStudents && localStudents.length > 0 && localStudents[index]) || ''}
    												columns={columns} />
    								</Paper>
								</div>
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Student Search (advanced)`}/>} path={'learnerSearch'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						<OneFJefFooter />
        </div>
    )};
}

export default withAlert(LearnerSearchView);
