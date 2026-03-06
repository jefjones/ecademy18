import React, {Component} from 'react';  //PropTypes
import {browserHistory} from 'react-router';
import styles from './VolunteerHoursPending.css';
import EditTable from '../EditTable';
import DateMoment from '../DateMoment';
import MessageModal from '../MessageModal';
import Icon from '../Icon';
import {doSort} from '../../utils/sort.js';
const p = 'component';
import L from '../../components/PageLanguage';

//If there is only one student, then the studentSchedule will be sent in and print it below the one student.
class VolunteerHoursPending extends Component {
		constructor(props) {
				super(props);

				this.state = {
						isShowingModal_delete: false,
				}
		}

		send = (volunteerEventId) => {
				browserHistory.push(`/volunteerCheckInOut/${volunteerEventId}`)
		}

		handleDeleteOpen = (volunteerEventId) => this.setState({ isShowingModal_delete: true, volunteerEventId });
		handleDeleteClose = () => this.setState({ isShowingModal_delete: false,volunteerEventId: '' });
		handleDelete = () => {
				const {personId, removeVolunteerHours, getVolunteerEvents} = this.props;
				const {volunteerEventId} = this.state;
				removeVolunteerHours(personId, volunteerEventId);
				this.handleDeleteClose();
				getVolunteerEvents(personId);
		}

    render() {
			const {personId, volunteerEvents, isFetchingRecord} = this.props;
        const {isShowingModal_delete} = this.state;

				let localVolunteer = volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.filter(m => m.volunteerPersonId === personId && (!m.confirmCheckIn || !m.checkOut));
				localVolunteer = doSort(localVolunteer, { sortField: 'checkIn', isAsc: true, isNumber: false })

				let headings = [{},
						{label: <L p={p} t={`Event type`}/>, tightText: true},
						{label: <L p={p} t={`Check-in`}/>, tightText: true},
						{label: <L p={p} t={`Confirmed Check-in`}/>, tightText: true},
						{label: <L p={p} t={`Volunteer note`}/>, tightText: true},
						{label: <L p={p} t={`Admin name`}/>, tightText: true},
						{label: <L p={p} t={`Admin Note`}/>, tightText: true},
						{label: <L p={p} t={`Check in date`}/>, tightText: true},
				];

				let data = localVolunteer && localVolunteer.length > 0 && localVolunteer.map(m => ([
						{value: <a onClick={() => this.handleDeleteOpen(m.volunteerEventId)}><Icon pathName={'trash2'} premium={true}/></a>},
						{value: m.volunteerTypeName, clickFunction: () => this.send(m.volunteerEventId)},
						{value: <DateMoment date={m.checkIn} minusHours={6}/>, clickFunction: () => this.send(m.volunteerEventId)},
						{value: <DateMoment date={m.confirmCheckIn} minusHours={6}/>, clickFunction: () => this.send(m.volunteerEventId)},
						{value: m.volunteerNote, clickFunction: () => this.send(m.volunteerEventId)},
						{value: m.checkInAdminName, clickFunction: () => this.send(m.volunteerEventId)},
						{value: m.checkInAdminNote, clickFunction: () => this.send(m.volunteerEventId)},
						{value: <i>No check out time</i>}
				]));

        return !localVolunteer || localVolunteer.length === 0
						? null
	          : <div className={styles.container}>
									<div className={styles.headerLabel}>{`Incomplete volunteer hours`}</div>
									<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={isFetchingRecord}/>
									{isShowingModal_delete &&
											<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this volunteer record?`}/>}
												 explainJSX={<L p={p} t={`Are you sure you want to remove this volunteer record?`}/>} isConfirmType={true}
												 onClick={this.handleDelete} />
									}
	            </div>
    }
}

export default VolunteerHoursPending;
