import React, {Component} from 'react';
import CarpoolView from '../views/CarpoolView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCarpool from '../actions/carpool';
import * as actionAnnouncement from '../actions/announcements.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';

import { selectMe, selectMyFrequentPlaces, selectCarpool, selectCompanyConfig, selectMessageFullThread, selectFetchingRecord } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let companyConfig = selectCompanyConfig(state);
		let daysOfWeek = []
		companyConfig.sunday && daysOfWeek.push({ id: 'sunday', label: 'Su' });
		companyConfig.monday && daysOfWeek.push({ id: 'monday', label: 'M' });
		companyConfig.tuesday && daysOfWeek.push({ id: 'tuesday', label: 'Tu' });
		companyConfig.wednesday && daysOfWeek.push({ id: 'wednesday', label: 'W' });
		companyConfig.thursday && daysOfWeek.push({ id: 'thursday', label: 'Th' });
		companyConfig.friday && daysOfWeek.push({ id: 'friday', label: 'F' });
		companyConfig.saturday && daysOfWeek.push({ id: 'saturday', label: 'Sa' });

		let daysOfWeekAll = [
				{ id: 'sunday', label: 'Su' },
				{ id: 'monday', label: 'M' },
				{ id: 'tuesday', label: 'Tu' },
				{ id: 'wednesday', label: 'W' },
				{ id: 'thursday', label: 'Th' },
				{ id: 'friday', label: 'F' },
				{ id: 'saturday', label: 'Sa' },
		];

		let carpool = selectCarpool(state);

		let arrivalOptions = [{id: 'early', label: 'Coming early'}, {id: 'ontime', label: 'On time'}, {id: 'late', label: 'Running late'}, {id: 'nogo', label: `Urgent! I can't make it!`}]
		let arrivalMinuteOptions = [];
		for(let i = 1; i <= 30; i++) {
				let option = {id: i, label: i + (i === 1 ? ' minute' : ' minutes')};
				arrivalMinuteOptions = arrivalMinuteOptions ? arrivalMinuteOptions.concat(option) : [option];
		}

    return {
				loginData: me,
				langCode: me.langCode,
        personId: me.personId,
        carpool,
				companyConfig,
				daysOfWeek,
				daysOfWeekAll,
				messageFullThread: selectMessageFullThread(state),
				arrivalOptions,
				arrivalMinuteOptions,
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    carpoolInit: (personId) => dispatch(actionCarpool.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addOrUpdateCarpoolRequest: (personId, carpoolRequest) => dispatch(actionCarpool.addOrUpdateCarpoolRequest(personId, carpoolRequest)),
		removeCarpoolRequest: (personId, carpoolRequestId) => dispatch(actionCarpool.removeCarpoolRequest(personId, carpoolRequestId)),
		addOrUpdateCarpoolSearchFilter: (personId, filterCarpoolAreas, checkedSendEmail) => dispatch(actionCarpool.addOrUpdateCarpoolSearchFilter(personId, filterCarpoolAreas, checkedSendEmail)),
		addOrUpdateCarpool: (personId, myCarpool) => dispatch(actionCarpool.addOrUpdateCarpool(personId, myCarpool)),
		removeCarpool: (personId, carpoolId) => dispatch(actionCarpool.removeCarpool(personId, carpoolId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		getMessageSingleFullThread: (personId) => dispatch(actionAnnouncement.getMessageSingleFullThread(personId)),
		addCarpoolRequestResponse: (personId, carpoolRequestResponse) => dispatch(actionCarpool.addCarpoolRequestResponse(personId, carpoolRequestResponse)),
		removeCarpoolRequestResponse: (personId, carpoolRequestResponseId) => dispatch(actionCarpool.removeCarpoolRequestResponse(personId, carpoolRequestResponseId)),
		setCarpoolMember: (personId, acceptOrDecline, carpoolRequestResponseId, memberPersonId) => dispatch(actionCarpool.setCarpoolMember(personId, acceptOrDecline, carpoolRequestResponseId, memberPersonId)),
		setMemberStudentsInCarpool: (personId, carpoolId, selectedStudents) => dispatch(actionCarpool.setMemberStudentsInCarpool(personId, carpoolId, selectedStudents)),
		updateCarpoolDate: (personId, carpoolDate) => dispatch(actionCarpool.updateCarpoolDate(personId, carpoolDate)),
		setCarpoolDateStudent: (personId, carpoolDateStudent) => dispatch(actionCarpool.setCarpoolDateStudent(personId, carpoolDateStudent)),
		setCarpoolDateInCarPickUp: (personId, carpoolDateStudent) => dispatch(actionCarpool.setCarpoolDateInCarPickUp(personId, carpoolDateStudent)),
		setArrivalNotice: (personId, dropOffOrPickUp, carpoolDateId, arrivalNotice) => dispatch(actionCarpool.setArrivalNotice(personId, dropOffOrPickUp, carpoolDateId, arrivalNotice)),
		setCarpoolTimeStudentAssign: (personId, carpoolId, studentPersonId, carpoolTimeId, dayOfWeek, dropOffOrPickUp) => dispatch(actionCarpool.setCarpoolTimeStudentAssign(personId, carpoolId, studentPersonId, carpoolTimeId, dayOfWeek, dropOffOrPickUp)),
		setCarpoolTimeStudentAssignDayChange: (personId, carpoolId, carpoolTimeId, dropOffOrPickUp, studentPersonId, dayOfWeek, dateChange) => dispatch(actionCarpool.setCarpoolTimeStudentAssignDayChange(personId, carpoolId, carpoolTimeId, dropOffOrPickUp, studentPersonId, dayOfWeek, dateChange)),
		addDirectRequest: (personId, carpoolRequestDirectId) => dispatch(actionCarpool.addDirectRequest(personId, carpoolRequestDirectId)),
		acceptDirectRequest: (personId, carpoolRequestDirect) => dispatch(actionCarpool.acceptDirectRequest(personId, carpoolRequestDirect)),
		declineDirectRequest: (personId, carpoolRequestDirectId) => dispatch(actionCarpool.declineDirectRequest(personId, carpoolRequestDirectId)),
		removeDirectRequest: (personId, carpoolRequestDirectId) => dispatch(actionCarpool.removeDirectRequest(personId, carpoolRequestDirectId)),
		toggleStudentIncluded: (personId, carpoolId, studentPersonId) => dispatch(actionCarpool.toggleStudentIncluded(personId, carpoolId, studentPersonId)),
		toggleCarpoolRequestDirectCanDoDay: (personId, carpoolTimeId, driveDay) => dispatch(actionCarpool.toggleCarpoolRequestDirectCanDoDay(personId, carpoolTimeId, driveDay)),
		toggleCarpoolRequestFinalCanDoDay: (personId, carpoolTimeId, driveDay) => dispatch(actionCarpool.toggleCarpoolRequestFinalCanDoDay(personId, carpoolTimeId, driveDay)),
		setDriverTimeDate: (personId, driverPersonId, carpoolTimeId, driverDate, repeatWeeks) => dispatch(actionCarpool.setDriverTimeDate(personId, driverPersonId, carpoolTimeId, driverDate, repeatWeeks)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, carpoolInit, personId} = this.props;
        getPageLangs(personId, langCode, 'CarpoolView');
        carpoolInit(personId);
    }

    render() {
        return <CarpoolView {...this.props} />;
    }
}

export default storeConnector(Container);
