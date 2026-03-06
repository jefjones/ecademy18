import React, {Component} from 'react';  //PropTypes
import {Link} from 'react-router';
import styles from './StudentListModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import EditTable from '../EditTable';
import Loading from '../Loading';
import ButtonWithIcon from '../ButtonWithIcon';
import Icon from '../Icon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class StudentListModal extends Component {
    render() {
        const {handleClose, okText=<L p={p} t={`OK`}/>, course, students, studentList=[], discussionEntry, courseScheduledId} = this.props;
        let headings = [{}, {label: <L p={p} t={`Student`}/>, tightText: true}];
        let data = [];

        if (students && students.length > 0) {
            data = students.reduce((acc, m) => {
                acc = studentList.indexOf(m.personId || m.id) > -1
                    ? acc.concat([[
												{value:
														<div className={styles.row}>
																{courseScheduledId &&
																		<Link to={'/studentAssignments/' + courseScheduledId + '/' + m.personId || m.id}  className={styles.Aplus}>
																				<Icon pathName={'medal_empty'} premium={true} className={styles.iconBig}/>
																		</Link>
																}
																<Link to={'/studentSchedule/' + m.personId || m.id}>
																		<Icon pathName={'clock3'} premium={true} className={styles.icon}/>
																</Link>
														</div>
												},
												{id: m.personId || m.id, value: <Link to={'/studentProfile/' + m.personId || m.id} className={styles.link}>{m.label}</Link>}, ]])
                    : acc;
                return acc;
            }, []);
        } else {
            data = [[{value: ''}, {value: <i><L p={p} t={`No students listed`}/></i> }]]
        }

        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
                  <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
                    <div className={classes(styles.dialogHeader, styles.row)}>{discussionEntry ? <L p={p} t={`Participants: `}/> : <L p={p} t={`Students Enrolled: `}/>}<span>{data.length}</span></div>
                    <div className={styles.dialogExplain}>
												<span className={styles.column}>{course.name}</span>
												<span className={styles.column}>{course.intervalName}</span>
												<span className={styles.column}>{course.classPeriodName}</span>
												<span className={styles.column}>{course.facilitatorName}</span>
												<span className={styles.column}>{course.weekdaysText}</span>
												<span className={styles.column}>{course.startTimeTex}</span>
												<span className={styles.column}>{course.durationText}</span>
                    </div>
                    <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
                    <Loading isLoading={!(studentList && studentList.length > 0)} />
                    <div className={styles.dialogButtons}>
												<ButtonWithIcon label={okText} icon={'checkmark_circle'} onClick={handleClose}/>
                    </div>
                  </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
