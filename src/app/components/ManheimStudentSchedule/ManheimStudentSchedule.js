import React, {Component} from 'react';
import styles from './ManheimStudentSchedule.css';
const p = 'component';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../MessageModal';
import Icon from '../Icon';
import Required from '../Required';
import DateMoment from '../DateMoment';
import Loading from '../Loading';
import classes from 'classnames';

//For Manneim Central High School:
//0. Show the count down until this student-self-directed choice option expires.  (They can return in three days to make changes...?  Or should that be just a cut off date for everyhone?)
//1. Show the semester classes split up between Fall and Spring
//	   a. If less than four credits chosen so far, show the orange count of the status, such as 2 or 4 chosen (text and an icon in burnt orange)
//		 b. If 4 are chosen, show a green checkmark an the text in green.
//	   c. If more than 4, show the warning in red that there are more than 4:  5 of 4 chosen classes
//2. There are four blocks (periods)
//3. Show a slot for a fifth optional extra credit on-line-only course to be chosen
//4. Show the errors related to the specific chosen classes
//		 a. This class has a pre-requirement that you don't have.
//	   b. There are two classes chosen for the block #2 (for example)
//5. Finalize: Allow for submit after the class choices are complete.

class ManheimStudentSchedule extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
		        isShowingModal_remove: false,
						isShowingModal_description: false,
	      }
    }

		// componentDidMount() {
		// 		this.setPendingFields();
		// }

    handleRemoveOpen = (courseScheduledId) => this.setState({isShowingModal_remove: true, courseScheduledId })
		handleRemoveClose = () => this.setState({isShowingModal_remove: false})
    handleRemove = () => {
				const {removeStudentCourseAssign, personId} = this.props;
				const {courseScheduledId} = this.state;
				removeStudentCourseAssign(personId, personId, courseScheduledId);
				//this.setPendingFields();
        this.handleRemoveClose();
    }

		hasClass = (semester, block, firstMP, secondMP) => {
				const {studentSchedule} = this.props;
				let result = false;
				if (studentSchedule && studentSchedule.length > 0) {
						studentSchedule.forEach(m => {
								m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
										if ((m.classPeriodName === block || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf(block) > -1)) && t.code && (t.code.indexOf(firstMP) > -1 || t.code.indexOf(secondMP) > -1)) {
												result = true;
										}
								});
						})
				}
				return result;
		}

		hasTooManyCredits = (block, firstMP, secondMP) => {
      	let localSchedule = Object.assign([], this.props.studentSchedule);
        let count = 0;
        localSchedule = localSchedule && localSchedule.length > 0 && localSchedule.filter(m => {
            let isFound = false;
            m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
                if (m.classPeriodName === block && t.code && (t.code.indexOf(firstMP) > -1 || t.code.indexOf(secondMP) > -1)) {
                    isFound = true;
                    count++;
                }
            });
            return isFound;
        });
        let credits = localSchedule && localSchedule.length > 0 && localSchedule.reduce((acc, m) => acc = acc += m.credits, 0);
				return count === 1 ? false : credits > 1;  //If this is a semester class with 2 credits, then the 1 credits applies to this single semester.
		}

		isOneCredit = (block, firstMP, secondMP) => {
				const {studentSchedule} = this.props;
				let firstMPCredits = 0;
				let secondMPCredits = 0;
				if (studentSchedule && studentSchedule.length > 0) {
						studentSchedule.forEach(m => {
								if (m.classPeriodName && m.classPeriodName.indexOf(block) > -1) {
										m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
												if (t.code && t.code.indexOf(firstMP) > -1)
														firstMPCredits = m.isCombinedManheimClass ? ++firstMPCredits : Number(firstMPCredits) + Number(m.credits);
												if (t.code && t.code.indexOf(secondMP) > -1)
														secondMPCredits = m.isCombinedManheimClass ? ++secondMPCredits : Number(secondMPCredits) + Number(m.credits);
										});
								}
						})
				}
				return firstMPCredits === 1 && secondMPCredits === 1;
		}

		hasMissingMarkingPeriod = (block, firstMP, secondMP) => {
				const {studentSchedule} = this.props;
				let firstMPCredits = 0;
				let secondMPCredits = 0;
				if (studentSchedule && studentSchedule.length > 0) {
						studentSchedule.forEach(m => {
								if (m.classPeriodName && m.classPeriodName.indexOf(block) > -1) {
										m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
												if (t.code && t.code.indexOf(firstMP) > -1)
														firstMPCredits += m.credits;
												if (t.code && t.code.indexOf(secondMP) > -1)
														secondMPCredits += m.credits;
										});
								}
						})
				}
				if (!firstMPCredits && !secondMPCredits) return '';
				if (!firstMPCredits) return 'Missing Marking Period: ' + firstMP;
				if (!secondMPCredits) return 'Missing Marking Period: ' + secondMP;
				return '';
		}

		setClassView = (course, semesterBlock, keyIndex) => {
				const {me, isFinalizeConfirm, openRegistration} = this.props;
        let intervalNames = course && course.intervals && course.intervals.length > 0 && course.intervals.reduce((acc, m) => acc && acc.length > 0 ? acc + ', ' + m.code : m.code, '');
				return (
				 	<div className={classes(styles.row, styles.data)} key={keyIndex}>
							{(me.salta || (openRegistration && openRegistration.isOpen)) && !isFinalizeConfirm
								 	? <div className={classes(styles.cells, globalStyles.remove)} onClick={() => this.handleRemoveOpen(course.courseScheduledId || course.manheimMusicCombinedCoursesId || course.manheimLearningSupportCombinedCoursesId)} >
												remove
										</div>
									: <div className={styles.space}>&nbsp;</div>
							}
							{!course.description ? course.courseName : <div onClick={() => this.handleDescriptionOpen(course.courseName, course.description)} className={styles.link}>{course.courseName}</div>}
							{course.courseScheduledId <= 100000 && <div className={classes(styles.moreLeft, styles.cells)}>{`(Cr: ${course.credits})`}</div>}
							{course.courseScheduledId <= 100000 && <div className={classes(styles.moreLeft, styles.cells)}>{`Block ${course.classPeriodName}`}</div>}
							<div className={styles.cells}><DateMoment date={course.startTime} timeOnly={true}/></div>
              <div className={styles.cells}>{`(cr. ${course.credits})`}</div>
							{/*<div className={styles.cells}>{course.facilitatorName}</div>*/}
              <div className={styles.cells}>{course.onlineName ? course.onlineName : course.online ? 'Online' : 'T'}</div>
							<div className={styles.cells}>{intervalNames}</div>
							{/*<div className={styles.cells}>{course.weekdaysText}</div>*/}
							{/*<div className={styles.cells}>{`${course.duration} min`}</div>*/}
							<div className={styles.cells}>{course.code}</div>
							{course.section && <div className={styles.cells}>{`(Sct ${course.section})`}</div>}
					</div>)
		}

		handleDescriptionOpen = (courseName, description) => this.setState({isShowingModal_description: true, courseName, description })
    handleDescriptionClose = () => this.setState({isShowingModal_description: false })

    render() {
			const {studentSchedule, isFinalizeConfirm, fetchingRecord} = this.props;
      const {isShowingModal_remove, isShowingModal_description, courseName, description } = this.state;

      let fall1 = this.hasClass('fall1', '1', 'M1', 'M2') || (this.hasClass('fall1', '1A', 'M1', 'M2') && this.hasClass('fall1', '1B', 'M1', 'M2')) || (this.isOneCredit('1A', 'M1', 'M2') && this.hasClass('fall1', '1A', 'M1', 'M2')) || (this.isOneCredit('1B', 'M1', 'M2') && this.hasClass('fall1', '1B', 'M1', 'M2'));
			let fall2 = this.hasClass('fall2', '2', 'M1', 'M2');
			let fall3 = this.hasClass('fall3', '3', 'M1', 'M2');
			let fall4 = this.hasClass('fall4', '4', 'M1', 'M2');
			let spring1 = this.hasClass('spring1', '1', 'M3', 'M4') || (this.hasClass('spring1', '1A', 'M3', 'M4') && this.hasClass('spring1', '1B', 'M3', 'M4')) || (this.isOneCredit('1A', 'M3', 'M4') && this.hasClass('spring1', '1A', 'M3', 'M4')) || (this.isOneCredit('1B', 'M3', 'M4') && this.hasClass('spring1', '1B', 'M3', 'M4'));
			let spring2 = this.hasClass('spring2', '2', 'M3', 'M4');
			let spring3 = this.hasClass('spring3', '3', 'M3', 'M4');
			let spring4 = this.hasClass('spring4', '4', 'M3', 'M4');

			let overCreditsFall1 = this.hasTooManyCredits('1', 'M1', 'M2');
			let overCreditsFall2 = this.hasTooManyCredits('2', 'M1', 'M2');
			let overCreditsFall3 = this.hasTooManyCredits('3', 'M1', 'M2');
      let overCreditsFall4 = this.hasTooManyCredits('4', 'M1', 'M2');
			let overCreditsFall5 = this.hasTooManyCredits('5', 'M1', 'M2');
			let overCreditsSpring1 = this.hasTooManyCredits('1', 'M3', 'M4');
			let overCreditsSpring2 = this.hasTooManyCredits('2', 'M3', 'M4');
			let overCreditsSpring3 = this.hasTooManyCredits('3', 'M3', 'M4');
      let overCreditsSpring4 = this.hasTooManyCredits('4', 'M3', 'M4');
			let overCreditsSpring5 = this.hasTooManyCredits('5', 'M3', 'M4');

			let missingMPFall1 = this.hasMissingMarkingPeriod('1', 'M1', 'M2');
			let missingMPFall2 = this.hasMissingMarkingPeriod('2', 'M1', 'M2');
			let missingMPFall3 = this.hasMissingMarkingPeriod('3', 'M1', 'M2');
			let missingMPFall4 = this.hasMissingMarkingPeriod('4', 'M1', 'M2');
			let missingMPSpring1 = this.hasMissingMarkingPeriod('1', 'M3', 'M4');
			let missingMPSpring2 = this.hasMissingMarkingPeriod('2', 'M3', 'M4');
			let missingMPSpring3 = this.hasMissingMarkingPeriod('3', 'M3', 'M4');
			let missingMPSpring4 = this.hasMissingMarkingPeriod('4', 'M3', 'M4');

      return (
        <div className={styles.container}>
						<Loading isLoading={fetchingRecord && fetchingRecord.studentSchedule}/>
						<div className={classes(styles.classification, styles.fallSchedule)}>FALL SCHEDULE</div>
						<div className={styles.row}>
								<div className={styles.label}>{`Block 1`}</div>
								<Required setIf={!isFinalizeConfirm && (!fall1 || overCreditsFall1 || missingMPFall1)} className={styles.required}/>
								<div>
										{overCreditsFall1 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPFall1 && <div className={styles.error}>{missingMPFall1}</div>}
								</div>
								{!isFinalizeConfirm && fall1 && !overCreditsFall1 && !missingMPFall1 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!fall1 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName && m.classPeriodName.indexOf("1") > -1) || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("1") > -1))) {
																isFound = true;
														}
												});
												return isFound;
										})
									  .map((m, i) => this.setClassView(m, "fall1", i))
						}
						<div className={styles.row}>
								<div className={styles.label}>{`Block 2`}</div>
								<Required setIf={!isFinalizeConfirm && (!fall2 || overCreditsFall2 || missingMPFall2)} className={styles.required}/>
								<div>
										{overCreditsFall2 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPFall2 && <div className={styles.error}>{missingMPFall2}</div>}
								</div>
								{!isFinalizeConfirm && fall2 && !overCreditsFall2  && !missingMPFall2 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!fall2 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName === "2") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("2") > -1))) isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "fall2", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Block 3`}</div>
								<Required setIf={!isFinalizeConfirm && (!fall3 || overCreditsFall3 || missingMPFall3)} className={styles.required}/>
								<div>
										{overCreditsFall3 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPFall3 && <div className={styles.error}>{missingMPFall3}</div>}
								</div>
								{!isFinalizeConfirm && fall3 && !overCreditsFall3 && !missingMPFall3 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!fall3 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName === "3") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("3") > -1))) isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "fall3", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Block 4`}</div>
								<Required setIf={!isFinalizeConfirm && (!fall4 || overCreditsFall4 || missingMPFall4)} className={styles.required}/>
								<div>
										{overCreditsFall4 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPFall4 && <div className={styles.error}>{missingMPFall4}</div>}
								</div>
								{!isFinalizeConfirm && fall4 && !overCreditsFall4 && !missingMPFall4 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!fall4 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName === "4") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("4") > -1))) isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "fall4", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Extra Credit (optional)`}</div>
								<Required setIf={overCreditsFall5} className={styles.required}/>
								{overCreditsFall5 && <div className={styles.error}>{`Too many credits chosen`}</div>}
						</div>
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && m.classPeriodName === "5") isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "fall5", i))
						}


						<div className={classes(styles.classification, styles.springSchedule)}>SPRING SCHEDULE</div>
						<div className={styles.row}>
								<div className={styles.label}>{`Block 1`}</div>
								<Required setIf={!isFinalizeConfirm && (!spring1 || overCreditsSpring1 || missingMPSpring1)} className={styles.required}/>
								<div>
										{overCreditsSpring1 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPSpring1 && <div className={styles.error}>{missingMPSpring1}</div>}
								</div>
								{!isFinalizeConfirm && spring1 && !overCreditsSpring1 && !missingMPSpring1 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!spring1 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName && m.classPeriodName.indexOf("1") > -1) || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("1") > -1))) isFound = true;
												});
												return isFound;
										})
									  .map((m,i) => this.setClassView(m, "spring1", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Block 2`}</div>
								<Required setIf={!isFinalizeConfirm && (!spring2 || overCreditsSpring2 || missingMPSpring2)} className={styles.required}/>
								<div>
										{overCreditsSpring2 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPSpring2 && <div className={styles.error}>{missingMPSpring2}</div>}
								</div>
								{!isFinalizeConfirm && spring2 && !overCreditsSpring2 && !missingMPSpring2 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!spring2 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName === "2") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("2") > -1))) isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "spring2", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Block 3`}</div>
								<Required setIf={!isFinalizeConfirm && (!spring3 || overCreditsSpring3 || missingMPSpring3)} className={styles.required}/>
								<div>
										{overCreditsSpring3 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPSpring3 && <div className={styles.error}>{missingMPSpring3}</div>}
								</div>
								{!isFinalizeConfirm && spring3 && !overCreditsSpring3 && !missingMPSpring3 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!spring3 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName === "3") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("3") > -1))) isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "spring3", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Block 4`}</div>
								<Required setIf={!isFinalizeConfirm && (!spring4 || overCreditsSpring4 || missingMPSpring4)} className={styles.required}/>
								<div>
										{overCreditsSpring4 && <div className={styles.error}>{`Too many credits chosen`}</div>}
										{missingMPSpring4 && <div className={styles.error}>{missingMPSpring4}</div>}
								</div>
								{!isFinalizeConfirm && spring4 && !overCreditsSpring4 && !missingMPSpring4 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
						</div>
						{!spring4 && <div className={styles.classNotChosen}>{`- -`}</div>}
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName === "4") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("4") > -1))) isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "spring4", i))
						}

						<div className={styles.row}>
								<div className={styles.label}>{`Extra Credit (optional)`}</div>
								<Required setIf={overCreditsSpring5} className={styles.required}/>
								{overCreditsSpring5 && <div className={styles.error}>{`Too many credits chosen`}</div>}
						</div>
						{studentSchedule && studentSchedule.length > 0
								&& studentSchedule.filter(m => {
												let isFound = false;
												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && m.classPeriodName === "5") isFound = true;
												});
												return isFound;
										})
										.map((m,i) => this.setClassView(m, "spring5", i))
						}

						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={`Remove this course?`}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionClose} heading={courseName}
                   explain={description}  onClick={this.handleDescriptionClose} />
            }
        </div>
    )};
}

export default ManheimStudentSchedule;
