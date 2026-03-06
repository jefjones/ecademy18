import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './GradeReportView.css';
const p = 'GradeReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateMoment from '../../components/DateMoment';
import Icon from '../../components/Icon';
import Checkbox from '../../components/Checkbox';
import InputDataList from '../../components/InputDataList';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import AdvancEDLogo from '../../assets/AdvancEd.png';
import ReactToPrint from "react-to-print";
import {guidEmpty} from '../../utils/guidValidate.js';

class GradeReportView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
						intervalList: '',
            schoolYearId: props.personConfig.schoolYearId,
	      }
    }

		componentDidMount() {
				//document.getElementById('studentPersonId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
		}

		componentDidUpdate(prevProps) {
        const {studentPersonId, students} = this.props;
				const {isInit, isInitStudent} = this.state;
				if (!isInitStudent && !(this.state.studentPersonId && this.state.studentPersonId !== guidEmpty && this.state.studentPersonId != 0) //eslint-disable-line
								&& studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
						let student = students.filter(m => m.id === studentPersonId)[0]
						this.setState({ student, studentPersonId, isInitStudent: true });
				}

				if (!isInit && this.props.studentPersonId && (this.state.studentPersonId !== this.props.studentPersonId || prevProps.students !== this.props.students)){
						this.setState({ studentPersonId: this.props.studentPersonId, isInit: true });
				}
		}

		changeStudent = (student) => {
      	const {personId, getGradeReport, setStudentChosenSession} = this.props;
				const {schoolYearId} = this.state;
				this.setState({ studentPersonId: student && student.id ? student.id : '', student: student && student.id ? student : {} });
				browserHistory.push(`/gradeReport/${student.id}`);
				getGradeReport(personId, student.id, schoolYearId);
				setStudentChosenSession(student.id);
		}

		changeInterval = (event) => {
				let interval = this.state.interval;
				interval = event.target.value;
				this.setState({ interval });
		}

		toggleInterval = (intervalId) => {
				let intervalList = Object.assign([], this.state.intervalList);
				intervalList = intervalList && intervalList.length > 0 && intervalList.indexOf(intervalId) > -1
						? intervalList.filter(id => id !== intervalId)
						: intervalList && intervalList.length > 0
								? intervalList.concat(intervalId)
								: [intervalId];
				this.setState({ intervalList });
		}

		handleUpdateSchoolYear = ({target}) => {
        const {personId, updatePersonConfig, getStudents, studentPersonId, getGradeReport} = this.props;
				this.setState({ courseScheduledschoolYearId: target.value });
				updatePersonConfig(personId, 'SchoolYearId', target.value, () => getStudents(personId));
				browserHistory.push(`/gradeReport/${studentPersonId}`);
				getGradeReport(personId, studentPersonId, target.value);
		}

		toggleCheckbox = (setting) => {
        const {setPersonConfigChoice, personId} = this.props;
        let newState = Object.assign({}, this.state);
        newState[setting] = !newState[setting];
        this.setState(newState);
        setPersonConfigChoice(personId, setting, newState[setting] ? 'checked' : '');
    }

    toggleShowDeleteIcons = () => this.setState({ showDeleteIcons: !this.state.showDeleteIcons})

    deleteStudentGradeFinal = (courseScheduledId, intervalId) => {
        const {personId, removeStudentGradeFinal} = this.props;
        const {studentPersonId} = this.state;
        removeStudentGradeFinal(personId, studentPersonId, courseScheduledId, intervalId);
    }

    handleRemoveStudentGradeFinalOpen = (courseScheduledId, intervalId) => this.setState({isShowingModal_remove: true, courseScheduledId, intervalId})
	  handleRemoveStudentGradeFinalClose = () => this.setState({isShowingModal_remove: false})
	  handleRemoveStudentGradeFinal = () => {
        const {removeStudentGradeFinal, personId, gradeReport} = this.props;
	      const {courseScheduledId, intervalId} = this.state;
	      removeStudentGradeFinal(personId, gradeReport.studentPersonId, courseScheduledId, intervalId);
	      this.handleRemoveStudentGradeFinalClose();
	  }

    showIntervalGPAs = () => {
        const {gradeReport={}, intervals} = this.props;
        const {intervalList} = this.state;

        if (intervalList && intervalList.length > 0) {
            return <div className={styles.row}>
                      {intervalList.map((intervalId, i) => {
                          let interval = intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === intervalId)[0];
                          return interval && interval.name
                              ? <div key={i} className={styles.spaceRight}>{interval.name} GPA: <strong>{gradeReport.gpaIntervals && gradeReport.gpaIntervals[intervalId]}</strong></div>
                              : ''
                      })}
                   </div>
        } else if (intervals && intervals.length > 0) {
            return <div className={styles.row}>
                      {intervals.map((m, i) => {
                          return <div key={i} className={styles.spaceRight}>{m.name} GPA: <strong>{gradeReport.gpaIntervals && gradeReport.gpaIntervals[m.intervalId]}</strong></div>
                      })}
                   </div>
        }
    }

    twoDecimals = (gpa) => {
        if (!gpa) return '';
        let frontPart = gpa && gpa.length > 0 ? gpa.substring(0, gpa.indexOf('.')) : '';
        let decimalPart = gpa && gpa.length > 0 ? gpa.substring(gpa.indexOf('.')+1) : '';
        if (decimalPart && decimalPart.length === 1) decimalPart = '.' + decimalPart + '0';
        else return gpa;
        return frontPart + decimalPart;

    }

    render() {
      let {gradeReport} = this.props;
      const {personId, students, fetchingRecord, intervals, schoolYears, personConfig, companyConfig={}, accessRoles={}, myFrequentPlaces,
							setMyFrequentPlace} = this.props;
      const {studentPersonId, student, intervalList, schoolYearId, principalSignatureShow, showDeleteIcons, isShowingModal_remove,
              teacherSignature, parentSignature, principalDate, hideTotalSchoolYearGPA} = this.state;

			let courseGrades = gradeReport.courseGrades;
			if (intervalList && intervalList.length > 0)
					courseGrades = gradeReport.courseGrades && gradeReport.courseGrades.length > 0 && gradeReport.courseGrades.filter(m => intervalList.indexOf(m.intervalId) > -1);

			let currentCourseName = ''; //eslint-disable-line
			let totalCredits = 0;

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
										<L p={p} t={`Student Grade Report`}/>
								</div>
								<div className={classes(styles.row, styles.moreBottom)}>
										<div>
												<SelectSingleDropDown
														id={`schoolYearId`}
														label={<L p={p} t={`School year`}/>}
														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
														options={schoolYears}
														height={`medium`}
														onChange={this.handleUpdateSchoolYear}/>
										</div>
										<div>
												<InputDataList
														name={`studentPersonId`}
														label={<L p={p} t={`Student`}/>}
														value={student}
														options={students}
														height={`medium`}
														className={styles.inputPosition}
														onChange={this.changeStudent}/>
										</div>
										<div className={styles.printPosition}>
												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
										</div>
                    <div className={classes(styles.moreRight, styles.moreTop)}>
												<Checkbox
														label={<L p={p} t={`Include the shool year total GPA`}/>}
														checked={hideTotalSchoolYearGPA || personConfig["gradeReport_hideTotalSchoolYearGPA"] || false}
														onClick={() => this.toggleCheckbox('hideTotalSchoolYearGPA')}
														labelClass={styles.labelCheckbox}
														checkboxClass={styles.checkbox} />
										</div>
                    {accessRoles.admin &&
    										<div className={classes(styles.moreRight, styles.moreTop)}>
    												<Checkbox
    														label={<L p={p} t={`Include the principal's siguature`}/>}
    														checked={principalSignatureShow || personConfig["gradeReport_principalSignatureShow"] || false}
    														onClick={() => this.toggleCheckbox('principalSignatureShow')}
    														labelClass={styles.labelCheckbox}
    														checkboxClass={styles.checkbox} />
    										</div>
                    }
                    {principalSignatureShow &&
                        <div className={classes(styles.moreRight, styles.moreTop)}>
    												<Checkbox
    														label={<L p={p} t={`Include date (principal)`}/>}
    														checked={principalDate || personConfig["gradeReport_principalDate"] || false}
    														onClick={() => this.toggleCheckbox('principalDate')}
    														labelClass={styles.labelCheckbox}
    														checkboxClass={styles.checkbox} />
    										</div>
                    }
                    <div className={classes(styles.moreRight, styles.moreTop)}>
												<Checkbox
														label={<L p={p} t={`Include the teacher's siguature`}/>}
														checked={teacherSignature || personConfig["gradeReport_teacherSignature"] || false}
														onClick={() => this.toggleCheckbox('teacherSignature')}
														labelClass={styles.labelCheckbox}
														checkboxClass={styles.checkbox} />
										</div>
                    <div className={classes(styles.moreRight, styles.moreTop)}>
												<Checkbox
														label={<L p={p} t={`Include the parent's siguature`}/>}
														checked={parentSignature || personConfig["gradeReport_parentSignature"] || false}
														onClick={() => this.toggleCheckbox('parentSignature')}
														labelClass={styles.labelCheckbox}
														checkboxClass={styles.checkbox} />
										</div>
                    {accessRoles.admin &&
                        <div className={classes(styles.moreRight, styles.moreTop)}>
    												<Checkbox
    														label={<L p={p} t={`Remove one or more entries`}/>}
    														checked={showDeleteIcons || false}
    														onClick={this.toggleShowDeleteIcons}
    														labelClass={styles.labelCheckbox}
    														checkboxClass={styles.checkbox} />
    										</div>
                    }
								</div>
								<div className={styles.rowWrap}>
										{intervals && intervals.length > 0 && intervals.map((m, i) =>
												<Checkbox
														key={i}
														id={m.id}
														label={m.label}
														checked={(intervalList && intervalList.length > 0 && (intervalList.indexOf(m.id) > -1 || intervalList.indexOf(String(m.id)) > -1)) || ''}
														onClick={() => this.toggleInterval(m.id)}
														labelClass={styles.labelCheckbox}
														checkboxClass={styles.checkbox} />
										)}
								</div>
								<hr/>
								<Loading isLoading={studentPersonId && fetchingRecord && fetchingRecord.gradeReport} />
								{gradeReport && gradeReport.studentPersonId &&
										<div ref={el => (this.componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
												{companyConfig.logoFileUrl &&
														<img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
												}
				                <div className={classes(styles.header,globalStyles.centered)}>
				                  	<div className={classes(styles.header,styles.row)}>
                                <L p={p} t={`Student Grade Report`}/>
                                <div className={styles.littleLeft}>
                                    {gradeReport.schoolYearName ? gradeReport.schoolYearName : ''}
                                </div>
                            </div>
				                </div>
												<div className={classes(styles.row, styles.header, styles.center)}>
				                  	<div><L p={p} t={`Name: `}/><strong>{gradeReport.studentFullName}</strong>  <div className={styles.moreLeft}><L p={p} t={`Grade Level:`}/> <strong>{gradeReport.gradeLevelName}</strong></div></div>
				                </div>
												<div className={accessRoles.admin ? styles.tableHeight : ''}>
														<table className={styles.centerTable}>
																<tbody>
																		<tr>
                                        {showDeleteIcons && <th></th>}
																				<th className={styles.upperHeaderLeft}><L p={p} t={`Courses`}/></th>
																				<th className={styles.upperHeader}><L p={p} t={`Semester`}/></th>
																				{((!isNaN(gradeReport.gradeLevelName) && Number(gradeReport.gradeLevelName) >= 8) || companyConfig.urlcode.indexOf('Caritas') > -1) &&
																						<th className={styles.upperHeader}><L p={p} t={`Credits`}/></th>
																				}
																				<th className={styles.upperHeader} colSpan={2}>Grade</th>
																		</tr>

      															{courseGrades && courseGrades.length > 0
      																	? courseGrades.map((m, i) => {
                                            if (!m.letterGrade) return null;

  																					// totalCredits += (m.gradePointAverage >= 0.1 || m.letterGrade === 'P') && m.courseAssignAccredited && gradeReport.studentAccredited
  																					// 		? !isNaN(m.credits) && (m.courseAssignAccredited || companyConfig.urlcode.indexOf('Caritas') > -1)
  																					// 				? m.credits
  																					// 				: 0
  																					// 		: 0;
                                            totalCredits = m.credits;

									                           let row =
  																							<tr key={i}>
                                                    {showDeleteIcons &&
                                                        <td className={styles.data} onClick={() => this.handleRemoveStudentGradeFinalOpen(m.courseScheduledId, m.intervalId)}>
                                                            <Icon pathName={'trash2'} premium={true} className={styles.icon}/>
                                                        </td>
                                                    }
  																									<td className={styles.data}>{m.courseName}</td>
  																									<td className={styles.data}>{ m.intervalName}</td>
  																									{((!isNaN(gradeReport.gradeLevelName) && Number(gradeReport.gradeLevelName) >= 8) || companyConfig.urlcode.indexOf('Caritas') > -1) &&
  																											<td align={'center'} className={classes(styles.data, styles.fromLeft)}>
  																													 {  (m.gradePointAverage >= 0.1 || m.letterGrade === 'P') ? m.credits : 0.0 }
                                                             {/*  (gradeReport.studentAccredited && m.courseAssignAccredited) || companyConfig.urlcode.indexOf('Caritas') > -1
   																															? (m.gradePointAverage >= 0.1 || m.letterGrade === 'P') && m.courseAssignAccredited
   																																	? m.credits
   																																	: 0.0
   																															: <div className={styles.gray}>{`N/A`}</div>
   																													 */}
  																										  </td>
  																									}
  																									<td className={classes(styles.data, styles.serif)}>{m.letterGrade}</td>
  																									<td className={styles.data}>{m.gradePointAverage === 0 ? 0 : this.twoDecimals(m.gradePointAverage)}</td>
  																							</tr>;
  																					currentCourseName = m.coursename;
  																					return row;
  																			})
																		: <tr colSpan={5}><td><div className={styles.noRecords}>{fetchingRecord && !fetchingRecord.gradeReport ? 'no grade report found' : ''}</div></td></tr>
																}
																{((!isNaN(gradeReport.gradeLevelName) && Number(gradeReport.gradeLevelName) >= 8) || companyConfig.urlcode.indexOf('Caritas') > -1) &&
																		<tr>
																				<td></td>
																				<td className={styles.data} align={'right'}><L p={p} t={`Total credits`}/></td>
																				<td className={styles.data} align={'center'} >{totalCredits}</td>
																		</tr>
																}
																</tbody>
														</table>
												</div>
												<div className={classes(styles.center, styles.row, styles.text)}>
                            {this.showIntervalGPAs()}
														{!hideTotalSchoolYearGPA && <div><L p={p} t={`School Year GPA: `}/><strong>{gradeReport.schoolYearGPA}</strong></div>}
				                </div>
												<div>
                            {principalSignatureShow &&
																<div className={classes(styles.signatureLine)}>
																			<div className={classes(styles.center, styles.text)}>
																					{companyConfig.signatureFileUrl &&
																							<img src={companyConfig.signatureFileUrl} alt={<L p={p} t={`Signature`}/>} />
																					}
																					{!companyConfig.signatureFileUrl &&
																							<span>____________________________________,</span>
																					}
																			</div>
																			<div className={classes(styles.row, styles.center)}>
																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Principal Signature`}/></div>
																					{principalDate && <DateMoment date={new Date()} format={'D MMM YYYY'} className={styles.moreLeft}/>}
																			</div>
								                </div>
                            }
                            {teacherSignature &&
																<div className={classes(styles.signatureLine)}>
																			<div className={classes(styles.center, styles.text)}>
																					<span>____________________________________,</span>
																			</div>
																			<div className={classes(styles.row, styles.center)}>
																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Teacher Signature`}/></div>
																			</div>
								                </div>
                            }
                            {parentSignature &&
																<div className={classes(styles.signatureLine)}>
																			<div className={classes(styles.center, styles.text)}>
																					<span>____________________________________,</span>
																			</div>
																			<div className={classes(styles.row, styles.center)}>
																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Parent Signature`}/></div>
																			</div>
								                </div>
                            }
														{companyConfig.urlcode === 'Liahona' &&
																<div className={styles.centeredFooter}>
								                  	Liahona Preparatory Academy is fully accredited by AdvancED
								                </div>
														}
														{companyConfig.urlcode === 'Liahona' &&
																<div className={classes(styles.centeredFooter, styles.row)}>
								                  	<div>Principal: {companyConfig.principalName}</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																		<div className={styles.moreLeft}>Administrator: Jordan Long</div>
								                </div>
														}
														{companyConfig.urlcode === 'Liahona' &&
																<div className={styles.centeredFooter}>
								                  	2464 West 450 South &nbsp;&nbsp; Pleasant Grove, UT 84062 &nbsp;&nbsp;  Office: (801) 785-7850 &nbsp;&nbsp;  Fax: (801) 406-0071
								                </div>
														}
														{companyConfig.urlcode === 'Liahona' &&
																<img src={AdvancEDLogo} className={styles.logoBottom} alt={`AdvancED`} />
														}
												</div>
										</div>
								}
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Grade Report`}/>} path={'gradeReport'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						{!accessRoles.admin &&
								<OneFJefFooter />
						}
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveStudentGradeFinalClose} heading={<L p={p} t={`Remove this final grade?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this final grade?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveStudentGradeFinal} />
            }
        </div>
    )};
}

export default GradeReportView;
