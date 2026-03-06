import React, {Component} from 'react';
import styles from './StudentScheduleFinalizeView.css';
const p = 'StudentScheduleFinalizeView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import ManheimStudentSchedule from '../../components/ManheimStudentSchedule';
import Icon from '../../components/Icon';
import TextDisplay from '../../components/TextDisplay';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Loading from '../../components/Loading';
import StudentClipboard from '../../components/StudentClipboard';
import classes from 'classnames';
import ReactToPrint from "react-to-print";

class StudentScheduleFinalizeView extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
	      }
    }

		sendToMultStudentSchedule = () => {
				const {getMultStudentSchedules, personId, clipboardStudents, personConfig} = this.props;
				if (clipboardStudents && clipboardStudents.length > 0) {
						let studentPersonIds = clipboardStudents.reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.personId) : [m.personId], []);
						getMultStudentSchedules(personId, studentPersonIds, personConfig.schoolYearId);
						this.setState({ isSubmitted: true })
				}
		}

    render() {
      const {me, personId, studentPersonId, studentSchedule, gradeLevelName, studentName, clipboardStudents, studentAssignmentsInit, personConfig,
							companyConfig, gradeLevels, setStudentsSelected, removeAllUserPersonClipboard, courseDocumentsInit, openRegistration} = this.props;
			let {multStudentSchedules=[]} = this.props;
			const {isSubmitted} = this.state;

			if (!!studentPersonId && studentSchedule && studentSchedule.length > 0)
					multStudentSchedules = [{studentPersonId, gradeLevelName, studentName, studentSchedule}];

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
										<L p={p} t={`Finalize Student Schedule`}/>
								</div>
								{!studentPersonId && (!studentSchedule || studentSchedule.length === 0) &&
										<div>
												<div className={styles.heading}>Students chosen</div>
												<StudentClipboard students={clipboardStudents} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
														setStudentsSelected={setStudentsSelected} getStudentSchedule={this.props.getStudentSchedule}
														personId={personId} studentAssignmentsInit={studentAssignmentsInit} emptyMessage={<L p={p} t={`No students chosen`}/>}
														includeRemoveClipboardIcon={true} singleRemoveFromClipboard={this.handleRemoveSingleFromClipboard}
														courseDocumentsInit={courseDocumentsInit} removeAllUserPersonClipboard={removeAllUserPersonClipboard}/>
												{!isSubmitted &&
														<ButtonWithIcon label={<L p={p} t={`Show Schedules`}/>} icon={'checkmark_circle'} onClick={this.sendToMultStudentSchedule}/>
												}
												<Loading loadingText={`Loading`} isLoading={isSubmitted && (!multStudentSchedules || multStudentSchedules.length === 0)} />
												<hr />
										</div>
								}
								<div className={styles.row}>
										<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}>
										<Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => this.componentRef}/>
								</div>
								<hr/>
								<div ref={el => (this.componentRef = el)} className={classes(styles.componentPrint, styles.maxWidth)}>
										{multStudentSchedules && multStudentSchedules.length > 0 && multStudentSchedules.map((m, i) => {
												if (m.studentSchedule && m.studentSchedule.length > 0) {
														return (
																<div key={i} className={styles.marginSpace}>
																		<div className={styles.row}>
																				<TextDisplay label={<L p={p} t={`Schedule for`}/>} text={m.studentName}/>
																				<TextDisplay label={<L p={p} t={`School year`}/>} text={personConfig.schoolYearRange}/>
																				<TextDisplay label={<L p={p} t={`Grade level`}/>} text={m.gradeLevelName}/>
																		</div>
																		<ManheimStudentSchedule studentSchedule={m.studentSchedule} personId={m.studentPersonId} isFinalizeConfirm={true}
																				openRegistration={openRegistration} me={me}/>
																		<div className={styles.pageBreak}/>
																</div>
														)
												}
												return null;
										})}
								</div>
						</div>
        </div>
    )};
}

export default StudentScheduleFinalizeView;
