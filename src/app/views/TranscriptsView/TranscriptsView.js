import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import styles from './TranscriptsView.css';
const p = 'TranscriptsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import Loading from '../../components/Loading';
import DateMoment from '../../components/DateMoment';
import Icon from '../../components/Icon';
import Checkbox from '../../components/Checkbox';
import InputDataList from '../../components/InputDataList';
import EditTable from '../../components/EditTable';
import DateTimePicker from '../../components/DateTimePicker';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import AdvancEDLogo from '../../assets/AdvancEd.png';
import ReactToPrint from "react-to-print";
import moment from 'moment';
import {guidEmpty} from '../../utils/guidValidate.js';

class TranscriptsView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
						intervalList: '',
						showSignature: '',
	      }
    }

		componentDidUpdate(prevProps) {
				const {studentPersonId, students} = this.props;
				if ((!this.state.studentPersonId || this.state.studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
						let selectedStudent = students.filter(m => m.id === studentPersonId)[0]
						this.setState({ selectedStudent, studentPersonId });
				}
				if (this.props.studentPersonId && (this.state.studentPersonId !== this.props.studentPersonId || prevProps.students !== this.props.students)){
						this.setState({ studentPersonId: this.props.studentPersonId });
				}
		}

		changeInterval = (event) => {
				let interval = this.state.interval;
				interval = event.target.value;
				this.setState({ interval });
		}

		toggleInterval = (intervalId) => {
				let intervalList = this.state.intervalList;
				intervalList = intervalList && intervalList.length > 0 && intervalList.indexOf(intervalId) > -1
						? intervalList.filter(id => id !== intervalId)
						: intervalList && intervalList.length > 0
								? intervalList.concat(intervalId)
								: [intervalId];
				this.setState({ intervalList });
		}

		handleUpdateSchoolYear = ({target}) => {
				const {personId, updatePersonConfig, getStudents} = this.props;
				this.setState({ courseScheduledschoolYearId: target.value });
				updatePersonConfig(personId, 'SchoolYearId', target.value, () => getStudents(personId));
		}

		handleSelectedStudent = (selectedStudent) => {
				const {personId, getTranscripts, setStudentChosenSession} = this.props;
				this.setState({ selectedStudent });
				selectedStudent && selectedStudent.id && getTranscripts(personId, selectedStudent.id, true);
				browserHistory.push(`/transcripts/${selectedStudent.id}`);
				setStudentChosenSession(selectedStudent.id);
		}

		toggleShowSignature = () => this.setState({ showSignature: !this.state.showSignature})
		toggleOfficialSeal = () => this.setState({ showOfficialSeal: !this.state.showOfficialSeal})

		changeDate = (field, event) => {
				let newState = Object.assign({}, this.state);
				newState[field] = event.target.value
        this.setState(newState);
		}

		handlePrintOpen = () => this.setState({ printOpen: true });
		handlePrintClose = () => this.setState({ printOpen: false });

		handleGraduationDateUpdate = () => {
				const {personId, updateGraduationDate} = this.props;
				const {selectedStudent, graduationDate} = this.state;
				if (graduationDate) updateGraduationDate(personId, selectedStudent.id, graduationDate);
		}

    render() {
      const {personId, students, fetchingRecord, companyConfig={}, accessRoles={}, transcripts=[], gradeScale, myFrequentPlaces,
							setMyFrequentPlace} = this.props;
      const {studentPersonId, showSignature, showOfficialSeal, selectedStudent, printOpen, graduationDate} = this.state;

			let headings = [
					{label: <L p={p} t={`School Year`}/>, tightText: true},
					{label: <L p={p} t={`Grade level`}/>, tightText: true},
					{label: <L p={p} t={`School`}/>, tightText: true},
					{label: <L p={p} t={`Course Description`}/>, tightText: true},
					{label: <L p={p} t={`Interval`}/>, tightText: true},
					{label: <L p={p} t={`Credits`}/>, tightText: true, colSpan: 5},
			];

			let data = [];
			let gradeSummary = [[],[],[],[],[]];

			transcripts && transcripts.courseTranscripts && transcripts.courseTranscripts.length > 0 && transcripts.courseTranscripts.forEach(m => {
					//If the course row already exists, then just add in the interval record to the existing data row and don't add another row.
					let exists = false;
					data && data.length > 0 && data.forEach(d => {
							if (d[0].value === m.schoolYearName && d[1].value === m.gradeLevelName && d[2].value === m.schoolName && d[3].value === m.courseName && Number(d[5].value) === Number(m.credits))
									exists = true;
					});

					if (exists) {
							data && data.length > 0 && data.forEach(d => {
									if (d[0].value === m.schoolYearName
												&& d[1].value === m.gradeLevelName
												&& d[2].value === m.schoolName
												&& d[3].value === m.courseName
												&& Number(d[5].value) === Number(m.credits)) {

											if (m.firstInterval) d[6].value = m.firstInterval;
											if (m.secondInterval) d[7].value = m.secondInterval;
											if (m.thirdInterval) d[8].value = m.thirdInterval;
											if (m.fourthInterval) d[9].value = m.fourthInterval;
									}
							})
					} else {
							let row = [
									{value: m.schoolYearName},
									{value: m.gradeLevelName},
									{value: m.schoolName},
									{value: m.courseName},
									{value: <div className={styles.mixedCase}>{m.intervalType}</div>},
									{value: m.credits},
									{value: m.firstInterval},
									{value: m.secondInterval},
							]
							if (m.intervalType === 'QUARTERS' || m.intervalType === 'TRIMESTERS')  row.push({value: m.thirdInterval})
							if (m.intervalType === 'QUARTERS')  row.push({value: m.fourthInterval})
							data.push(row);
					}

					let scale = gradeScale && gradeScale.length > 0 && gradeScale.filter(g => g.gradeScaleTableId === m.gradeScaleTableId);
					let intervalGPA = 0;
					if (scale && scale.length > 0) {
							//firstInterval
							if (m.firstInterval) {
									intervalGPA = scale.filter(s => s.letter === m.firstInterval)[0];
									if (intervalGPA && intervalGPA.scale40Value) {
											let firstIndex = Number(m.gradeLevelName)-Number(8);
											gradeSummary[firstIndex] = gradeSummary[firstIndex] && gradeSummary[firstIndex].length > 0
                          ? gradeSummary[firstIndex].concat(intervalGPA.scale40Value)
                          : [intervalGPA.scale40Value];
									}
							}
							//secondInterval
							if (m.secondInterval) {
									intervalGPA = scale.filter(s => s.letter === m.secondInterval)[0];
									if (intervalGPA && intervalGPA.scale40Value) {
											let firstIndex = Number(m.gradeLevelName)-Number(8);
                      gradeSummary[firstIndex] = gradeSummary[firstIndex] && gradeSummary[firstIndex].length > 0
                          ? gradeSummary[firstIndex].concat(intervalGPA.scale40Value)
                          : [intervalGPA.scale40Value];
									}
							}
							// //thirdInterval
							if (m.thirdInterval) {
									intervalGPA = scale.filter(s => s.letter === m.thirdInterval)[0];
									if (intervalGPA && intervalGPA.scale40Value) {
											let firstIndex = Number(m.gradeLevelName)-Number(8);
                      gradeSummary[firstIndex] = gradeSummary[firstIndex] && gradeSummary[firstIndex].length > 0
                          ? gradeSummary[firstIndex].concat(intervalGPA.scale40Value)
                          : [intervalGPA.scale40Value];
									}
							}
							// //fourthInterval
							if (m.fourthInterval) {
									intervalGPA = scale.filter(s => s.letter === m.fourthInterval)[0];
									if (intervalGPA && intervalGPA.scale40Value) {
											let firstIndex = Number(m.gradeLevelName)-Number(8);
                      gradeSummary[firstIndex] = gradeSummary[firstIndex] && gradeSummary[firstIndex].length > 0
                          ? gradeSummary[firstIndex].concat(intervalGPA.scale40Value)
                          : [intervalGPA.scale40Value];
									}
							}
					}
			})

			let headingsSummary = [
					{label: <L p={p} t={`TRANSCRIPT SUMMARY`}/>, colSpan: 3}, {label: ''},
			];

			let dataSummary = [];
			let totalSummary = [];
			let calc = 0;
			dataSummary.push([{value: <L p={p} t={`Credits Earned`}/>}, {value: 'GPA'}]); //, colSpan: 2

			//8th grade high school credit
			if (gradeSummary[0].length > 0) {
					calc = gradeSummary[0].reduce((a, b) => a + b, 0) / gradeSummary[0].length;
					totalSummary.push(calc);
					calc = calc.toFixed(2);
					dataSummary.push([{value: 'Grade 8'}, {value: calc}]);
			}

			//9th grade
			calc = '';
			if (gradeSummary[1].length > 0) {
					calc = gradeSummary[1].reduce((a, b) => a + b, 0) / gradeSummary[1].length;
					totalSummary.push(calc);
					calc = calc.toFixed(2);
			}
			dataSummary.push([{value: <L p={p} t={`Grade 9`}/>}, {value: calc}]);

			//10th grade
			calc = '';
			if (gradeSummary[2].length > 0) {
					calc = gradeSummary[2].reduce((a, b) => a + b, 0) / gradeSummary[2].length;
					totalSummary.push(calc);
					calc = calc.toFixed(2);
			}
			dataSummary.push([{value: <L p={p} t={`Grade 10`}/>}, {value: calc}]);

			//11th grade
			calc = '';
			if (gradeSummary[3].length > 0) {
					calc = gradeSummary[3].reduce((a, b) => a + b, 0) / gradeSummary[3].length;
					totalSummary.push(calc);
					calc = calc.toFixed(2);
			}
			dataSummary.push([{value: <L p={p} t={`Grade 11`}/>}, {value: calc}]);

			//12th grade
			calc = '';
			if (gradeSummary[4].length > 0) {
					calc = gradeSummary[4].reduce((a, b) => a + b, 0) / gradeSummary[4].length;
					totalSummary.push(calc);
					calc = calc.toFixed(2);
			}
			dataSummary.push([{value: <L p={p} t={`Grade 12`}/>}, {value: calc}]);

			calc = '';
			if (totalSummary.length > 0) {
					calc = totalSummary.reduce((a, b) => a + b, 0) / totalSummary.length;
					calc = calc.toFixed(2);
			}
			dataSummary.push([{value: <L p={p} t={`TOTAL`}/>, boldText: true}, {value: calc, boldText: true}]);


			let headingsTest = [
					{label: <L p={p} t={`TEST`}/>, tightText: true},
					{label: <L p={p} t={`Date`}/>, tightText: true},
					{label: <L p={p} t={`English`}/>, tightText: true},
					{label: <L p={p} t={`Math`}/>, tightText: true},
					{label: <L p={p} t={`Reading`}/>, tightText: true},
					{label: <L p={p} t={`Science`}/>, tightText: true},
					{label: <L p={p} t={`Composite`}/>, tightText: true},
					{label: <L p={p} t={`English/Writing`}/>, tightText: true},
			];

			let dataTest = [];

			transcripts && transcripts.tests && transcripts.tests.length > 0 && transcripts.tests.forEach(m => {
					let row = [
							{value: m.name},
							{value: <DateMoment date={m.testDate} format={'D MMM YYYY'} minusHours={6}/>},
							{value: m.english},
							{value: m.math},
							{value: m.reading},
							{value: m.science},
							{value: m.composite},
							{value: m.englishWriting},
					]
					dataTest.push(row);
			})

			if (!(dataTest && dataTest.length > 0 && dataTest[0].name)) {
					dataTest = [[{value: <i><L p={p} t={`No tests entered for this student`}/></i>, colSpan: 5}]];
			}

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
										<L p={p} t={`Student's Transcripts`}/>
								</div>
								<div className={classes(styles.row, styles.moreBottom)}>
										<div>
												<InputDataList
														name={`studentPersonId`}
														label={<L p={p} t={`Student`}/>}
														value={selectedStudent}
														options={students}
														height={`medium`}
														className={styles.inputPosition}
														onChange={this.handleSelectedStudent}/>
										</div>
										<div className={styles.printPosition} onMouseOver={this.handlePrintOpen} onMouseOut={this.handlePrintClose}>
												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>}
														content={() => this.componentRef} onBeforePrint={this.handlePrintOpen} onAfterPrint={this.handlePrintClose}/>
										</div>
										<div className={classes(styles.moreRight, styles.moreTop)}>
												<Checkbox
														label={<L p={p} t={`Include the principal's signature`}/>}
														checked={showSignature || false}
														onClick={this.toggleShowSignature}
														labelClass={styles.labelCheckbox}
														checkboxClass={styles.checkbox} />
												<Checkbox
														label={<L p={p} t={`Include the official seal`}/>}
														checked={showOfficialSeal || false}
														onClick={this.toggleOfficialSeal}
														labelClass={styles.labelCheckbox}
														checkboxClass={styles.checkbox} />
										</div>
										<div className={classes(styles.moreRight, styles.moreTop, styles.row)}>
												<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
												<Link to={`/transcriptAdd/${selectedStudent && selectedStudent.id}`} className={styles.link}><L p={p} t={`Add external transcript`}/></Link>
										</div>
										<div className={classes(styles.moreRight, styles.moreTop, styles.row)}>
												<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
												<Link to={`/transcriptTestAdd/${selectedStudent && selectedStudent.id}`} className={styles.link}><L p={p} t={`Add test and scores`}/></Link>
										</div>
								</div>
								<hr/>
								<Loading isLoading={!studentPersonId && fetchingRecord && fetchingRecord.gradeReport} />
								{transcripts && transcripts.studentPersonId &&
										<div ref={el => (this.componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.width)}>
												{companyConfig.logoFileUrl &&
														<img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
												}
				                <div className={styles.header}>
				                  	<L p={p} t={`Student Transcript`}/>
				                </div>
												<div className={styles.flexFormat}>
														<div className={classes(styles.notCenter)}>
																<div className={styles.row}>
																		<div className={styles.displayLabel}><L p={p} t={`Name: `}/></div>
																		<div className={styles.textBold}>{`${transcripts.studentFirstName} ${transcripts.studentLastName}`}</div>
																</div>
																<div className={styles.row}>
																		<div className={styles.displayLabel}><L p={p} t={`Address:`}/></div>
																		<div className={styles.textBold}>
																				<div>{transcripts.streetAddress}</div>
	                  										<div>{`${transcripts.city} ${transcripts.stateAbbrev}  ${transcripts.postalCode}`}</div>
																	  </div>
																</div>
																<div className={styles.row}>
																		<div className={styles.displayLabel}><L p={p} t={`Gender:`}/></div>
																		 <div className={styles.textBold}>{transcripts.genderName}</div>
																 </div>
																 <div className={styles.row}>
 																		<div className={styles.displayLabel}><L p={p} t={`Birth date:`}/></div>
																		<div className={styles.textBold}><DateMoment date={transcripts.birthDate} format={'D MMM YYYY'} minusHours={6}/></div>
																</div>
														</div>
														<div className={classes(styles.header, styles.baseLine, styles.notCenter)}>
																<div className={classes(styles.row, styles.text)}>
																		<div className={styles.text}><L p={p} t={`Graduation date:`}/></div>
																		{
																				!printOpen
																						? <DateTimePicker id={`graduationDate`} value={graduationDate || transcripts.graduationDate} className={styles.datePosition}
																								onChange={(event) => this.changeDate('graduationDate', event)}
																								onBlur={this.handleGraduationDateUpdate}/>
																						: transcripts.graduationDate
																								? <DateMoment date={transcripts.graduationDate} format={'D MMM YYYY'} minusHours={0} labelClass={styles.bold}/>
																								: <strong>- -</strong>
																		}
																</div>
																<div className={styles.row}><div className={styles.text}><L p={p} t={`Transcript date:`}/></div><strong><DateMoment date={moment()} format={'D MMM YYYY'}/></strong></div>
														</div>
												</div>
												<div className={styles.width}>
														<div className={styles.centerTable}>
																<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} lowLineHeight={true}
																		isFetchingRecord={fetchingRecord.transcripts}/>
																<div className={styles.muchMoreLeft}>
																		<EditTable labelClass={styles.tableLabelClass} headings={headingsSummary} data={dataSummary} noCount={true} lowLineHeight={true}/>
																</div>
																<EditTable labelClass={styles.tableLabelClass} headings={headingsTest} data={dataTest} noCount={true} lowLineHeight={true}/>
														</div>
												</div>
												{accessRoles.admin &&
														<div>
																<div className={classes(styles.signatureLine)}>
																			<div className={classes(styles.center, styles.text)}>
																					{companyConfig.signatureFileUrl && showSignature &&
																							<img src={companyConfig.signatureFileUrl} alt={<L p={p} t={`Signature`}/>} />
																					}
																					{(!companyConfig.signatureFileUrl || !showSignature) &&
																							<span>____________________________________,</span>
																					}
																			</div>
																			<div className={classes(styles.row, styles.center)}>
																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Principal Signature`}/></div>
																					<DateMoment date={new Date()} format={'D MMM YYYY'} className={styles.moreLeft}/>
																			</div>
								                </div>
																{companyConfig.urlcode === 'Liahona' &&
																		<div>
																				<div className={styles.centeredFooter}>
												                  	Liahona Preparatory Academy is fully accredited by AdvancED
												                </div>
																				<div className={classes(styles.centeredFooter, styles.row)}>
												                  	<div>Principal: Breanne Dedrickson</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																						<div className={styles.moreLeft}>Administrator: Jordan Long</div>
												                </div>
																				<div className={styles.centeredFooter}>
												                  	2464 West 450 South &nbsp;&nbsp; Pleasant Grove, UT 84062 &nbsp;&nbsp;  Office: (801) 785-7850 &nbsp;&nbsp;  Fax: (801) 406-0071
												                </div>
																				<img src={AdvancEDLogo} className={styles.logoBottom} alt={`AdvancED`} />
																		</div>
																}
														</div>
												}
												{companyConfig.officialSealUrl && showOfficialSeal &&
														<img src={companyConfig.officialSealUrl} alt={<L p={p} t={`Official Seal`}/>} className={styles.fixedPosition}/>
												}
										</div>
								}
								<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Transcripts`}/>} path={'transcripts'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
								{!accessRoles.admin &&
										<OneFJefFooter />
								}
						</div>
        </div>
		)}
}

export default TranscriptsView;
