import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './StudentListOnly.css';
import DateMoment from '../DateMoment';
import EditTable from '../EditTable';
import { withAlert } from 'react-alert';
const p = 'component';
import L from '../../components/PageLanguage';

class StudentListOnly extends Component {
    constructor(props) {
        super(props);

        this.state = {
						isShowingModal_duplicate: false,
						isShowingModal_hasSchedule: false,
        };
    }

		// componentDidUpdate() {
		// 		const {students} = this.props;
		// 		const {studentPersonId, isInit} = this.state;
		// 		if (!isInit && (!studentPersonId || studentPersonId === guidEmpty) && students && students.length > 0)  {
		// 				this.setState({
    //             isInit: true,
    //             studentPersonId: students[0].personId,
    //             studentFirstName: students[0].firstName,
    //             studentLastName: students[0].lastName
    //         })
		// 		}
		// }

		chooseRecord = (studentPersonId, studentType) => {
        this.setState({ studentPersonId, studentType });
        this.sendToStudentSchedule(studentPersonId);
    }

    sendToStudentSchedule = (studentPersonId) => {
				const {getStudentSchedule, personId, schoolYearId, setStudentChosenSession, getTheStudent} = this.props;
				browserHistory.push('/studentSchedule/' + studentPersonId);
				getStudentSchedule(personId, studentPersonId, schoolYearId);
        setStudentChosenSession(studentPersonId);
        getTheStudent(personId, studentPersonId);
		}

    render() {
        const {students, gradeLevels} = this.props;
				const {studentPersonId} = this.state;

				var headings = [
						{label: <L p={p} t={`Student`}/>, tightText: true, },
						{label: <L p={p} t={`Grade`}/>, tightText: true, },
						{label: <L p={p} t={`Last Login`}/>, tightText: true, },
				];

				let data = students && students.length > 0 && students.map((m, i) => {
						return [
								{ value: m.label,
										clickFunction: () => this.chooseRecord(m.personId, m.studentType),
										cellColor: m.personId === studentPersonId ? 'highlight' : '',
                    boldText: true,
								},
								{ value: gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(g => g.id === m.gradeLevelId)[0] && gradeLevels.filter(g => g.id === m.gradeLevelId)[0].label,
										cellColor: m.personId === studentPersonId ? 'highlight' : ''
								},
								{ value: m.lastLoginDate > '2010-01-01'
										 		? <DateMoment date={m.lastLoginDate}  format={'D MMM YYYY  h:mm a'} minusHours={6} className={styles.entryDate}/>
												: '',
										cellColor: m.personId === studentPersonId ? 'highlight' : ''
								}
						];
				})

        return (
						<div className={styles.container}>
								<EditTable headings={headings} data={data} noColorStripe={true}/>
						</div>
        )
    }
};

export default withAlert(StudentListOnly);
