import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './CarpoolsMine.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import InputText from '../InputText';
import DateTimePicker from '../DateTimePicker';
import CheckboxGroup from '../CheckboxGroup';
import DateMoment from '../DateMoment';
import WeekdayDisplay from '../WeekdayDisplay';
import EditTable from '../EditTable';
import ButtonWithIcon from '../ButtonWithIcon';
import Icon from '../Icon';
import MessageModal from '../MessageModal';
import Checkbox from '../Checkbox';
import TimePicker from '../TimePicker';
import TimeDisplay from '../TimeDisplay';
import FlexColumn from '../FlexColumn';
import TextDisplay from '../TextDisplay';
import CarpoolMemberStudentsModal from '../CarpoolMemberStudentsModal';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';
const p = 'component';
import L from '../../components/PageLanguage';

class CarpoolsMine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
			isShowingModal_myStudents: false,
			isShowingModal_removePickUpTime: false,
			isShowingModal_removeDropOffTime: false,
			newPickUp: {},
			newDropOff: {},
      myCarpool: {
				carpoolId: '',
				name: '',
				destination: props.companyConfig.name,
        comment: '',
				pickUpTimes: [],
				dropOffTimes: [],
      },
			errorCarpoolName: '',
			errorDestination: '',
    }
  }

	componentDidUpdate() {
			const {carpool} = this.props;
			if (!this.state.isInit && carpool && carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0].myStudentsAll && carpool.myCarpools[0].myStudentsAll.length > 0) {
					let studentsIncluded = carpool.myCarpools[0].myStudentsAll.filter(m => m.isIncluded).reduce((acc, m) => acc = acc && acc.length ? acc.concat(m.id) : [m.id], []);
					this.setState({
							studentsIncluded,
							myStudentsAll: carpool.myCarpools[0].myStudentsAll,
							isInit: true });
			}
	}

  handleCarpool = (event) => {
	    const field = event.target.name;
	    let myCarpool = Object.assign({}, this.state.myCarpool);
	    let errors = Object.assign({}, this.state.errors);
	    myCarpool[field] = event.target.value;
			if (field === 'areaName') myCarpool.carpoolAreaId = guidEmpty;
	    this.setState({ myCarpool, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateCarpool, personId} = this.props;
      const {myCarpool, allowAddress} = this.state;
      let hasError = false;
			let missingInfoMessage = [];

      if (!myCarpool.name) {
          hasError = true;
          this.setState({ errorCarpoolName: <L p={p} t={`Carpool name is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Carpool name`}/></div>
      }
			if (!myCarpool.destination) {
          hasError = true;
          this.setState({errorDestination: <L p={p} t={`Destination is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Destination`}/></div>
      }
			if (!(myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0)) {
          hasError = true;
          this.setState({ errorCarpoolTime: <L p={p} t={`At least one carpool time is required`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one carpool time`}/></div>
      }
			if (!allowAddress) {
          hasError = true;
          this.setState({ errorAllowAddress: <L p={p} t={`A carpool member needs to consider your location in order to make a decision to carpool with you.`}/> });
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Your location`}/></div>
      }

      if (!hasError) {
          addOrUpdateCarpool(personId, myCarpool);
					this.clearMyCarpool();
					this.handleExpansionChange(true)(null, false);
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
  }

	clearMyCarpool = () => {
			this.setState({
					carpoolId: '',
					newDropOff: {},
					newPickUp: {},
					myCarpool: {
							carpoolId: '',
							name: '',
							destination: '',
							comment: '',
							dropOffTimes: [],
							pickUpTimes: [],
					},
					errorCarpoolName: '',
					errorDestination: '',
					errorCarpoolTime: '',
			});
	}

	handleShowUsedInOpen = (requests) => {
			let listUsedIn = requests && requests.length > 0 && requests.join("<br/>");
			this.setState({isShowingModal_requests: true, listUsedIn });
	}
  handleShowUsedInClose = () => this.setState({isShowingModal_requests: false, listUsedIn: [] })

	handleMyStudentsChangeOpen = (thisStudentCarpool) => this.setState({isShowingModal_myStudents: true, thisStudentCarpool});
	handleMyStudentsChangeClose = () => this.setState({isShowingModal_myStudents: false, carpool: {} });

	handleRemoveItemOpen = (carpoolId) => {
			this.setState({isShowingModal_remove: true, carpoolId })
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false, carpoolId: '' })
  handleRemoveItem = () => {
      const {removeCarpool, personId} = this.props;
      const {carpoolId} = this.state;
      removeCarpool(personId, carpoolId);
      this.handleRemoveItemClose();
  }

	handleEdit = (myCarpool) => {
			this.handleExpansionChange(true)(null, true);
			let editCarpool = Object.assign({}, myCarpool);
			let dropOffTimes = Object.assign([], myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff'));
			let pickUpTimes = Object.assign([], myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup'));
			editCarpool.dropOffTimes = dropOffTimes;
			editCarpool.pickUpTimes = pickUpTimes;
			this.setState({ myCarpool: editCarpool, allowAddress: true });
	}

	handleDaysOfWeekDropOff = (daysOfWeek) => {
      let newDropOff = Object.assign({}, this.state.newDropOff);
      newDropOff.daysOfWeek = daysOfWeek;
      this.setState({ newDropOff });
  }

	handleDaysICanDriveDropOff = (daysICanDrive) => {
      let newDropOff = Object.assign({}, this.state.newDropOff);
      newDropOff.daysICanDrive = daysICanDrive;
      this.setState({ newDropOff });
  }

	handleDaysOfWeekPickUp = (daysOfWeek) => {
      let newPickUp = Object.assign({}, this.state.newPickUp);
      newPickUp.daysOfWeek = daysOfWeek;
      this.setState({ newPickUp });
  }

	handleDaysICanDrivePickUp = (daysICanDrive) => {
      let newPickUp = Object.assign({}, this.state.newPickUp);
      newPickUp.daysICanDrive = daysICanDrive;
      this.setState({ newPickUp });
  }

	handleExpansionChange = panel => (event, expandedInternal) => {
			const {toggleOpenAddNewCarpool} = this.props;
			toggleOpenAddNewCarpool(expandedInternal ? panel : false);
	};

	handleExpansionChangeStudentIncluded = panel => (event, expandedStudentIncluded) => {
			this.setState({ expandedStudentIncluded: !this.state.expandedStudentIncluded });
	};



	translateShortDayText = (days) => {
			let result = [];
			let dash = <span></span>;
			days && days.length > 0 && days.forEach(m => {
					if (m === 'sunday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`Su`}/>;
							dash = <span>-</span>;
					}
					if (m === 'monday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`M`}/>;
							dash = <span>-</span>;
					}
					if (m === 'tuesday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`T`}/>;
							dash = <span>-</span>;
					}
					if (m === 'wednesday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`W`}/>;
							dash = <span>-</span>;
					}
					if (m === 'thursday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`Th`}/>;
							dash = <span>-</span>;
					}
					if (m === 'friday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`F`}/>;
							dash = <span>-</span>;
					}
					if (m === 'saturday') {
							result[result.length] = dash;
              result[result.length] = <L p={p} t={`Sa`}/>;
							dash = <span>-</span>;
					}
			})
			return result;
	}

	toggleSendEmailFilter = () => {
			const {addOrUpdateCarpoolSearchFilter, personId} = this.props;
			const {filterCarpoolAreas, checkedSendEmail} = this.state;
			this.setState({ checkedSendEmail: !checkedSendEmail });
			addOrUpdateCarpoolSearchFilter(personId, filterCarpoolAreas, !checkedSendEmail);
	}

	handleDescriptionOpen = (carpoolName, carpoolComment) => this.setState({isShowingModal_description: true, carpoolName, carpoolComment })
	handleDescriptionClose = () => this.setState({isShowingModal_description: false, carpoolName: '', carpoolComment: '' })

	changeFromToDates = (field, event) => {
			const myCarpool = this.state.myCarpool;
			myCarpool[field] = event.target.value;
			this.setState({ myCarpool });
	}

	prepForURL = (text) => {
			return text.replace(' ', '+').replace('%20','+');
	}

	toggleAllowAddress = () => {
			this.setState({ allowAddress: !this.state.allowAddress });
	}

	handleDropOffChange = (event) => {
			let newDropOff = Object.assign({}, this.state.newDropOff);
			newDropOff[event.target.name] = event.target.value;
			this.setState({ newDropOff });
	}

	handlePickUpChange = (event) => {
			let newPickUp = Object.assign({}, this.state.newPickUp);
			newPickUp[event.target.name] = event.target.value;
			this.setState({ newPickUp });
	}

	addDropOffTime = () => {
			const {newDropOff} = this.state;
			newDropOff.dropOffOrPickUp = 'dropoff';

      let hasError = false;
			let missingInfoMessage = ``;

      if (!newDropOff.time) {
          hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Time`}/></div>
      }
			if (!newDropOff.fromDate) {
          hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From date`}/></div>
      }
			if (!newDropOff.toDate) {
          hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To date`}/></div>
      }
			if (!(newDropOff.daysOfWeek && newDropOff.daysOfWeek.length > 0)) {
          hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one day of the week`}/></div>
      }

      if (!hasError) {
					let myCarpool = Object.assign({}, this.state.myCarpool);
					let carpoolTimes = myCarpool.carpoolTimes;
					if (newDropOff && newDropOff.carpoolTimeId) {
							carpoolTimes = carpoolTimes && carpoolTimes.length > 0 && carpoolTimes.filter(m => m.carpoolTimeId !== newDropOff.carpoolTimeId)
					} else {
							carpoolTimes = carpoolTimes && carpoolTimes.length > 0 && carpoolTimes.filter(m => m.time !== newDropOff.origTime)
					}
					carpoolTimes = carpoolTimes && carpoolTimes.length > 0 ? carpoolTimes.concat(newDropOff) : [newDropOff];
					myCarpool.carpoolTimes = carpoolTimes;
					this.setState({ myCarpool, newDropOff: {} })
      } else {
					this.handleMissingInfoOpen(missingInfoMessage);
			}
	}

	addPickUpTime = () => {
			const {newPickUp} = this.state;
			newPickUp.dropOffOrPickUp = 'pickup';

			let hasError = false;
			let missingInfoMessage = ``;

			if (!newPickUp.time) {
					hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Time`}/></div>
			}
			if (!newPickUp.fromDate) {
					hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From date`}/></div>
			}
			if (!newPickUp.toDate) {
					hasError = true;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To date`}/></div>
			}

			if (!hasError) {
					let myCarpool = Object.assign({}, this.state.myCarpool);
					let carpoolTimes = myCarpool.carpoolTimes;
					if (newPickUp && newPickUp.carpoolTimeId) {
							carpoolTimes = carpoolTimes && carpoolTimes.length > 0 && carpoolTimes.filter(m => m.carpoolTimeId !== newPickUp.carpoolTimeId)
					} else {
							carpoolTimes = carpoolTimes && carpoolTimes.length > 0 && carpoolTimes.filter(m => m.time !== newPickUp.origTime)
					}
					carpoolTimes = carpoolTimes && carpoolTimes.length > 0 ? carpoolTimes.concat(newPickUp) : [newPickUp];
					myCarpool.carpoolTimes = carpoolTimes;
					this.setState({ myCarpool, newPickUp: {} })
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
			}
	}

	removePickUpTime = (pickUpTime) => {
			let myCarpool = Object.assign({}, this.state.myCarpool);
			myCarpool.pickUpTimes = myCarpool.pickUpTimes && myCarpool.pickUpTimes.filter(time => time !== pickUpTime);
			this.setState({ myCarpool, pickUpTime: '' });
	}

	handleRemovePickUpTimeOpen = (pickUpTimeIndex) => this.setState({isShowingModal_removePickUpTime: true, pickUpTimeIndex })
	handleRemovePickUpTimeClose = () => this.setState({isShowingModal_removePickUpTime: false, pickUpTimeIndex: ''})
	handleRemovePickUpTime = () => {
			const {pickUpTimeIndex} = this.state;
			let myCarpool = Object.assign({}, this.state.myCarpool);
			let dropOffCarpoolTimes = myCarpool.carpoolTimes && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff');
			myCarpool.carpoolTimes = myCarpool.carpoolTimes && myCarpool.carpoolTimes.filter(m => m.pickUpOrPickUp === 'pickup');
			delete myCarpool.carpoolTimes[pickUpTimeIndex];
			myCarpool.carpoolTimes = myCarpool.carpoolTimes.concat(dropOffCarpoolTimes);
			this.setState({ myCarpool, pickUpTime: '' });
			this.handleRemovePickUpTimeClose();
	}

	handleRemoveDropOffTimeOpen = (carpoolTimeId) => this.setState({isShowingModal_removeDropOffTime: true, carpoolTimeId })
	handleRemoveDropOffTimeClose = () => this.setState({isShowingModal_removeDropOffTime: false, v: ''})
	handleRemoveDropOffTime = () => {
			const {carpoolTimeId} = this.state;
			let myCarpool = Object.assign({}, this.state.myCarpool);
			// let pickUpCarpoolTimes = myCarpool.carpoolTimes && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup');
			// myCarpool.carpoolTimes = myCarpool.carpoolTimes && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff');
			myCarpool.carpoolTimes = myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.carpoolTimeId !== carpoolTimeId);
			//myCarpool.carpoolTimes = myCarpool.carpoolTimes.concat(pickUpCarpoolTimes);
			this.setState({ myCarpool, dropOffTime: '' });
			this.handleRemoveDropOffTimeClose();
	}

	handleEditDropOff = (newDropOff) => {
			newDropOff.isEdit = true;
			newDropOff.origTime = newDropOff.time;
			this.setState({ newDropOff });
	}

	handleEditPickUp = (newPickUp) => {
			newPickUp.isEdit = true;
			newPickUp.origTime = newPickUp.time;
			this.setState({ newPickUp });
	}

	timeAssign = (carpoolId, studentPersonId, carpoolTimeId, rightOrLeft, currentIndex, dayOfWeek, dropOffOrPickUp, carpoolTimes) => {
			const {personId, setCarpoolTimeStudentAssign} = this.props;
			//Determine the time slot that this user should be sent to - including "notassigned"
			carpoolTimeId = rightOrLeft === 'left'
					? currentIndex === 0
							? '' //unassigned
							: carpoolTimes[--currentIndex].carpoolTimeId
					: !carpoolTimeId
							? carpoolTimes && carpoolTimes.length > 0 && carpoolTimes[0].carpoolTimeId
							: carpoolTimes[++currentIndex].carpoolTimeId

			setCarpoolTimeStudentAssign(personId, carpoolId, studentPersonId, carpoolTimeId, dayOfWeek, dropOffOrPickUp);
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleResetDropOffEdit = () => this.setState({ newDropOff: {} })
	handleResetPickUpEdit = () => this.setState({ newPickUp: {} })

	handleStudentsSelected = (studentsIncluded, studentPersonId) => {
			const {personId, toggleStudentIncluded, carpool} = this.props;
			this.setState({ studentsIncluded });
			let carpoolId = carpool && carpool.myCarpools[0].carpoolId;
			toggleStudentIncluded(personId, carpoolId, studentPersonId);
	}

  render() {
		//Notice that this ExpansionPanel is different since it gets its expanded state from the parent page, CarpoolView, so that
		//	other tab links or actions can open up the new carpool remotely.
    const {personId, carpool={}, daysOfWeekAll, expanded, setMemberStudentsInCarpool} = this.props;
    const {myCarpool, thisStudentCarpool, isShowingModal_remove, isShowingModal_requests, errorCarpoolName, errorDestination, isShowingModal_description,
						carpoolName, carpoolComment, isShowingModal_myStudents, errorAllowAddress, allowAddress, isShowingModal_removePickUpTime, errorCarpoolTime,
						isShowingModal_removeDropOffTime, newDropOff={}, newPickUp={}, isShowingModal_missingInfo, messageInfoIncomplete, studentsIncluded,
						myStudentsAll, expandedStudentIncluded} = this.state;

		//Notice that this ExpansionPanel is different since it gets its expanded state from the parent page, CarpoolView, so that
		//	other tab links or actions can open up the new carpool remotely.
		let headingsCarpoolTimesDropOff = [
				{label: '', tightText: true},
				{label: '', tightText: true},
				{label: <L p={p} t={`Time`}/>, tightText: true},
				{label: <L p={p} t={`From date`}/>, tightText: true},
				{label: <L p={p} t={`To date`}/>, tightText: true},
				{label: <L p={p} t={`Carpool days`}/>, tightText: true},
				{label: <L p={p} t={`Days I can drive (generally)`}/>, tightText: true}
		];

		let dataCarpoolTimesDropOff = []
		myCarpool && myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff').forEach((m, i) => {
				dataCarpoolTimesDropOff.push([
						{value: <a onClick={() => this.handleEditDropOff(m)}>
												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: <a onClick={() => this.handleRemoveDropOffTimeOpen(m.carpoolTimeId)}>
												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: <TimeDisplay time={m.time}/>, boldText: true},
						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
						{value: <WeekdayDisplay days={m.daysICanDrive}/>, boldText: true},
				]);
		});
		if (!(dataCarpoolTimesDropOff && dataCarpoolTimesDropOff.length > 0))  dataCarpoolTimesDropOff = [[{},{},{value: <i><L p={p} t={`No drop off times entered`}/></i>, colSpan: 5}]]

		let headingsDropOff = [
				{label: <L p={p} t={`Drop-off`}/>, tightText: true},
				{label: <L p={p} t={`From date`}/>, tightText: true},
				{label: <L p={p} t={`To date`}/>, tightText: true},
				{label: <L p={p} t={`Days`}/>, tightText: true},
		];

		let dataDropOff = []
		carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0].carpoolTimes && carpool.myCarpools[0].carpoolTimes.length > 0
						&& carpool.myCarpools[0].carpoolTimes.filter(m => m.dropOffOrPickUp === 'dropoff').forEach((m, i) => {
				dataDropOff.push([
						{value: <TimeDisplay time={m.time}/>, boldText: true},
						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
				]);
		});

		//Pick up
		let headingsCarpoolTimesPickUp = [
				{label: '', tightText: true},
				{label: '', tightText: true},
				{label: <L p={p} t={`Time`}/>, tightText: true},
				{label: <L p={p} t={`From date`}/>, tightText: true},
				{label: <L p={p} t={`To date`}/>, tightText: true},
				{label: <L p={p} t={`Carpool days`}/>, tightText: true},
				{label: <L p={p} t={`Days I can drive (generally)`}/>, tightText: true}
		];

		let dataCarpoolTimesPickUp = []
		myCarpool && myCarpool.carpoolTimes && myCarpool.carpoolTimes.length > 0 && myCarpool.carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').forEach((m, i) => {
				dataCarpoolTimesPickUp.push([
						{value: <a onClick={() => this.handleEditPickUp(m)}>
												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: <a onClick={() => this.handleRemovePickUpTimeOpen(i)}>
												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: <TimeDisplay time={m.time}/>, boldText: true},
						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
						{value: <WeekdayDisplay days={m.daysICanDrive}/>, boldText: true},
				]);
		});
		if (!(dataCarpoolTimesPickUp && dataCarpoolTimesPickUp.length > 0))  dataCarpoolTimesPickUp = [[{},{},{value: <i><L p={p} t={`No pick up times entered`}/></i>, colSpan: 5}]]

		let headingsPickUp = [
				{label: <L p={p} t={`Pick-up`}/>, tightText: true},
				{label: <L p={p} t={`From date`}/>, tightText: true},
				{label: <L p={p} t={`To date`}/>, tightText: true},
				{label: <L p={p} t={`Days`}/>, tightText: true},
		];

		let dataPickUp = []
		carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0].carpoolTimes && carpool.myCarpools[0].carpoolTimes.length > 0
						&& carpool.myCarpools[0].carpoolTimes.filter(m => m.dropOffOrPickUp === 'pickup').forEach((m, i) => {
				dataPickUp.push([
						{value: <TimeDisplay time={m.time}/>, boldText: true},
						{value: <DateMoment date={m.fromDate} includeTime={false}/>, boldText: true},
						{value: <DateMoment date={m.toDate} includeTime={false}/>, boldText: true},
						{value: <WeekdayDisplay days={m.daysOfWeek}/>, boldText: true},
				]);
		});

		let carpoolDaysOfWeekDropOff = [];
		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(m => {
				if (newDropOff && newDropOff.daysOfWeek && newDropOff.daysOfWeek.length > 0 && newDropOff.daysOfWeek.indexOf(m.id) > -1) carpoolDaysOfWeekDropOff.push(m)
		})

		let carpoolDaysOfWeekPickUp = [];
		daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.forEach(m => {
				if (newPickUp && newPickUp.daysOfWeek && newPickUp.daysOfWeek.length > 0 && newPickUp.daysOfWeek.indexOf(m.id) > -1) carpoolDaysOfWeekPickUp.push(m)
		})

		//**************************************************
		// Student to carpool daily assignment
		// 1. If there are carpoolTimes, loop through daysOfWeekAll
		// 2. Get the dropOff times separately.
		// 3. Get the pickUp times separately.
		// 4. If there are dropOffs or pickUps for the current dayOfWeek, show the day of the week.
		// 5. If there are drop offs for the current dayOfWeek
		// 		a. Loop through the students who are included by the carpool member (owner)
		// 		b. Place the student in the column of unassigned or the carpool time assigned.
		// 		c. Provide the student names with the left and right arrows to move between columns
		// 6. Do the same for pickUps as #5 above.
		let theCarpool = carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools[0] && carpool.myCarpools[0];

    return (
        <div className={styles.container}>
						{(myCarpool.carpoolId || !(theCarpool && theCarpool.carpoolId)) &&
								<ExpansionPanel expanded={!!expanded} onChange={this.handleExpansionChange(true)}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
												<div className={styles.row}>
														<Icon pathName={'plus'} premium={false} className={styles.icon} fillColor={'green'}/>
														<span className={globalStyles.link}><L p={p} t={`Add a new carpool?`}/></span>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div>
								            <div>
																<InputText
																		id={`name`}
																		name={`name`}
																		label={<L p={p} t={`Carpool name`}/>}
																		value={myCarpool.name || ''}
																		size={"medium"}
																		onChange={this.handleCarpool}
																		error={errorCarpoolName}
																		required={true}
																		whenFilled={myCarpool.name}/>
								            </div>
														<div>
																<InputText
																		id={`destination`}
																		name={`destination`}
																		label={<L p={p} t={`Destination`}/>}
																		value={myCarpool.destination || ''}
																		size={`medium`}
																		onChange={this.handleCarpool}
																		required={true}
																		whenFilled={myCarpool.destination}
																		error={errorDestination}/>
								            </div>
														<div className={styles.littleTop}>
																<InputText
																		id={'comment'}
																		name={'comment'}
																		value={myCarpool.comment}
																		label={<L p={p} t={`Comment (optional)`}/>}
																		size={"long"}
																		onChange={this.handleCarpool}/>
								            </div>
														<div className={classes(globalStyles.alertText, styles.moreTop)}>{errorCarpoolTime}</div>
														<div className={classes(styles.classification, styles.classificationDropOff)}><L p={p} t={`Drop-Off`}/></div>
														<div className={styles.rowWrap}>
																<TimePicker id={`time`} label={'Drop-off time'} value={newDropOff.time || ''} onChange={this.handleDropOffChange} className={styles.dateTime}
																		required={true} whenFilled={newDropOff.time} boldText={true}/>
																<div className={styles.dateRow}>
						                        <div className={classes(styles.dateColumn, styles.moreLeft)}>
						                            <DateTimePicker id={`fromDate`} value={newDropOff.fromDate} label={'From date'} required={true} whenFilled={newDropOff.fromDate}
						                                maxDate={newDropOff.toDate ? newDropOff.toDate : ''} onChange={this.handleDropOffChange}/>
						                        </div>
						                        <div className={styles.dateColumn}>
						                            <DateTimePicker id={`toDate`} value={newDropOff.toDate}  label={'To date'} required={true} whenFilled={newDropOff.toDate}
						                                minDate={newDropOff.fromDate ? newDropOff.fromDate : ''} onChange={this.handleDropOffChange}/>
						                        </div>
						                    </div>
																<div className={classes(globalStyles.multiSelect)}>
																		<CheckboxGroup
																				name={'daysOfWeek'}
																				options={daysOfWeekAll || []}
																				horizontal={true}
		 																		onSelectedChanged={this.handleDaysOfWeekDropOff}
																				label={<L p={p} t={`Carpool days of the week`}/>}
																				labelClass={styles.text}
																				selected={newDropOff.daysOfWeek}
																				required={true}
																				whenFilled={newDropOff.daysOfWeek}/>
																</div>
																<div className={classes(globalStyles.multiSelect, styles.lower)}>
																		<CheckboxGroup
																				name={'daysICanDrive'}
																				options={carpoolDaysOfWeekDropOff || []}
																				horizontal={true}
		 																		onSelectedChanged={this.handleDaysICanDriveDropOff}
																				label={<L p={p} t={`Days I can drive (generally)`}/>}
																				labelClass={styles.text}
																				selected={newDropOff.daysICanDrive}/>
																</div>
																<div className={styles.row}>
																		<ButtonWithIcon label={newDropOff.isEdit ? <L p={p} t={`Update Drop-off`}/> : <L p={p} t={`Save Drop-off`}/>} icon={'plus_circle'} onClick={this.addDropOffTime}/>
																		{newDropOff.isEdit &&
																				<div className={classes(globalStyles.link, styles.resetPosition)} onClick={this.handleResetDropOffEdit}>Reset</div>
																		}
																</div>
														</div>
														<EditTable headings={headingsCarpoolTimesDropOff} data={dataCarpoolTimesDropOff} />
														<div className={styles.classification}><L p={p} t={`Pick-up`}/></div>
														<div className={styles.rowWrap}>
																<TimePicker id={`time`} label={<L p={p} t={`Pick-up time`}/>} value={newPickUp.time || ''} onChange={this.handlePickUpChange} className={styles.dateTime}
																		required={true} whenFilled={newPickUp.time} boldText={true}/>
																<div className={styles.dateRow}>
																		<div className={classes(styles.dateColumn, styles.moreLeft)}>
																				<DateTimePicker id={`fromDate`} value={newPickUp.fromDate} label={<L p={p} t={`From date`}/>} required={true} whenFilled={newPickUp.fromDate}
																						maxDate={newPickUp.toDate ? newPickUp.toDate : ''} onChange={this.handlePickUpChange}/>
																		</div>
																		<div className={styles.dateColumn}>
																				<DateTimePicker id={`toDate`} value={newPickUp.toDate}  label={<L p={p} t={`To date`}/>} required={true} whenFilled={newPickUp.toDate}
																						minDate={newPickUp.fromDate ? newPickUp.fromDate : ''} onChange={this.handlePickUpChange}/>
																		</div>
																</div>
																<div className={classes(globalStyles.multiSelect, styles.littleTop)}>
																		<CheckboxGroup
																				name={'daysOfWeek'}
																				options={daysOfWeekAll || []}
																				horizontal={true}
																				onSelectedChanged={this.handleDaysOfWeekPickUp}
																				label={<L p={p} t={`Days I can drive (generally)`}/>}
																				labelClass={styles.text}
																				selected={newPickUp.daysOfWeek}/>
																</div>
																<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
																		<CheckboxGroup
																				name={'daysICanDrive'}
																				options={carpoolDaysOfWeekPickUp || []}
																				horizontal={true}
		 																		onSelectedChanged={this.handleDaysICanDrivePickUp}
																				label={<L p={p} t={`Days I can drive (generally)`}/>}
																				labelClass={styles.text}
																				selected={newPickUp.daysICanDrive}/>
																</div>
																<div className={styles.row}>
																		<ButtonWithIcon label={newPickUp.isEdit ? <L p={p} t={`Update Pick-up`}/> : <L p={p} t={`Save Pick-up`}/>} icon={'plus_circle'} onClick={this.addPickUpTime}/>
																		{newPickUp.isEdit &&
																				<div className={classes(globalStyles.link, styles.resetPosition)} onClick={this.handleResetPickUpEdit}><L p={p} t={`Reset`}/></div>
																		}
																</div>
														</div>
														<EditTable headings={headingsCarpoolTimesPickUp} data={dataCarpoolTimesPickUp} />
														<hr/>
														<div className={styles.checkboxPosition}>
																<Checkbox
																		id={`allowAddress`}
																		label={<L p={p} t={`Allow my address to be shown in a Google Maps link`}/>}
																		checked={allowAddress}
																		onClick={this.toggleAllowAddress}
																		labelClass={styles.filterList}
																		className={styles.checkbox}
																		required={true}
																		whenFilled={allowAddress}
																		error={errorAllowAddress} />
														</div>
								            <div className={styles.rowRight}>
																	<div className={classes(globalStyles.link, styles.closePosition)} onClick={() => {this.handleExpansionChange(false); this.clearMyCarpool();}}><L p={p} t={`Close`}/></div>
									                <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
									            </div>
													</div>
											</ExpansionPanelDetails>
									</ExpansionPanel>
							}
							{carpool && carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools.map((m,i) => {
									return (
											<div key={i}>
													<div className={classes(styles.moreTop, styles.rowWrap)}>
															<FlexColumn heading={``} data={m.entryPersonId === personId && <div onClick={() => this.handleEdit(m)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></div>}/>
															<FlexColumn heading={``}
																data={m.entryPersonId === personId && //m.carpoolMembers && m.carpoolMembers.length <= 2 &&
																				<div onClick={() => this.handleRemoveItemOpen(m.carpoolId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div>
																		 }/>
															<FlexColumn heading={<L p={p} t={`Carpool name`}/>} data={m.name} />
															<FlexColumn heading={<L p={p} t={`Name`}/>} data={m.personName} />
															<FlexColumn heading={<L p={p} t={`Destination`}/>} data={m.destination} />
															<FlexColumn heading={<L p={p} t={`Members`}/>}
																	data={m.carpoolMembers && m.carpoolMembers.length > 0 && m.carpoolMembers.map((b, i) =>
																				<a key={i} href={`http://maps.google.com/?q=${b.streetAddress}, ${b.city}, ${b.usStateName}`} className={globalStyles.link} target={'_blank'}>
																						{i > 0 ? ', ' : ''}{b.firstName + ' ' + b.lastName}
																				</a>
																		)} />
															<FlexColumn heading={`Comment`}
																	data={m.comment && m.comment.length > 50
																						? <div onClick={() => this.handleDescriptionOpen(m.name, m.comment)} className={globalStyles.link}>{m.comment.substring(0,50) + '...'}</div>
																						: m.comment
																								? m.comment
																								: '- -'
																				} />
												</div>
												{!expanded &&
														<div>
																<div className={styles.dropOffBackground}>
																		<EditTable headings={headingsDropOff} data={dataDropOff} />
																</div>
																<div className={styles.pickUpBackground}>
																		<EditTable headings={headingsPickUp} data={dataPickUp} />
																</div>
														</div>
												}
												<ExpansionPanel expanded={!!expandedStudentIncluded} onChange={this.handleExpansionChangeStudentIncluded(true)}>
														<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
																<div className={styles.row}>
																		<span className={globalStyles.link}>{<L p={p} t={`Students Included  (${studentsIncluded && studentsIncluded.length} out of ${myStudentsAll && myStudentsAll.length})`}/>}</span>
																</div>
														</ExpansionPanelSummary>
														<ExpansionPanelDetails>
																<div className={classes(globalStyles.multiSelect)}>
																		<CheckboxGroup
																				name={'studentsIncluded'}
																				options={myStudentsAll || []}
																				horizontal={true}
		 																		onSelectedChanged={this.handleStudentsSelected}
																				label={<L p={p} t={`Students included in this carpool`}/>}
																				labelClass={styles.text}
																				selected={studentsIncluded}
																				required={true}
																				whenFilled={studentsIncluded}/>
																</div>
														</ExpansionPanelDetails>
												</ExpansionPanel>
												<div>
														<div className={classes(globalStyles.headerLabel, styles.moreTop)}><L p={p} t={`Assign students to carpool (generally)`}/></div>
														<div className={globalStyles.instructionsBigger}><L p={p} t={`In the daily schedule, you can move your student(s) due to changes in your schedule.`}/></div>
														<div className={styles.moreLeft}>
																{theCarpool && theCarpool.carpoolTimes && theCarpool.carpoolTimes.length > 0 && daysOfWeekAll && daysOfWeekAll.length > 0 && daysOfWeekAll.map((day, index) => {
																		let dropOffs = theCarpool.carpoolTimes.filter(f => f.dropOffOrPickUp === 'dropoff' && f.daysOfWeek.indexOf(day.id) > -1);
																		let pickUps = theCarpool.carpoolTimes.filter(f => f.dropOffOrPickUp === 'pickup' && f.daysOfWeek.indexOf(day.id) > -1);
																		return (
																				<div key={index}>
																						{((dropOffs && dropOffs.length > 0) || (pickUps && pickUps.length > 0)) &&
																								<div className={styles.classification}>{day.id.charAt(0).toUpperCase() + day.id.slice(1)}</div>
																						}
																						{!(dropOffs && dropOffs.length > 0) ? '' :
																								<div>
																										<div>{day.dayOfWeek && day.dayOfWeek.length > 0 && (day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1))}</div>
																												{dropOffs && dropOffs.length > 0 &&
																														<div className={classes(styles.dropOffBackground, styles.moreBottom)}>
																																<div className={globalStyles.headerLabel}><L p={p} t={`Drop-off`}/></div>
																																<div className={styles.row}>
																																		<div>
																																				<div className={classes(styles.sectionLabel, styles.moreBottom)}><L p={p} t={`Unassigned`}/></div>
																																				{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
																																						let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
																																								.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.dayOfWeek === day.id)[0];

																																						return studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty
																																							 ? null
																																							 : <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
																																											<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
																																													{s.firstName}
																																											</div>
																																											<div onClick={() => this.timeAssign(m.carpoolId, s.studentPersonId, '', 'right', -1, day.id, 'dropoff', dropOffs)}>
																																													<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
																																											</div>
																																									</div>
																																				})}
																																		</div>
																																		{dropOffs.map((c, timeIndex) => {
																																				return (
																																						<div key={timeIndex}>
																																								<TextDisplay label={''} text={<TimeDisplay time={c.time || ''}/>} className={styles.sectionLabel}/>
																																								{theCarpool.myStudentsAll && theCarpool.myStudentsAll.length > 0 && theCarpool.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
																																										let studentTimeAssign = theCarpool.timeStudentAssigns && theCarpool.timeStudentAssigns.length > 0 && theCarpool.timeStudentAssigns
																																												.filter(a => a.dropOffOrPickUp === 'dropoff' && a.studentPersonId === s.studentPersonId && a.carpoolTimeId === c.carpoolTimeId && a.dayOfWeek === day.id)[0];

																																										return !(studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty)
																																												? null
																																												: <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
																																															{timeIndex >= 0 &&
																																																	<div onClick={() => this.timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'left', timeIndex, day.id, 'dropoff', dropOffs)}>
																																																			<Icon pathName={'arrow_left0'} premium={true} fillColor={'blue'} className={styles.arrowLeft}/>
																																																	</div>
																																															}
																																															<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
																																																	{s.firstName}
																																															</div>
																																															{timeIndex < parseInt(dropOffs.length)-parseInt(1) &&  //eslint-disable-line
																																																	<div onClick={() => this.timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'right', timeIndex, day.id, 'dropoff', dropOffs)}>
																																																			<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
																																																	</div>
																																															}
																																													</div>
																																								})}
																																						</div>
																																				)
																																		})}
																																</div>
																														</div>
																												}
																										</div>
																								}
																								{!(pickUps && pickUps.length > 0) ? '' :
																										<div key={index+100}>
																												<div>{day.dayOfWeek && day.dayOfWeek.length > 0 && (day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1))}</div>
																														{pickUps && pickUps.length > 0 &&
																																<div className={classes(styles.pickUpBackground, styles.moreBottom)}>
																																		<div className={globalStyles.headerLabel}><L p={p} t={`Pick-up`}/></div>
																																		<div className={styles.row}>
																																				<div>
																																						<div className={classes(styles.sectionLabel, styles.moreBottom)}><L p={p} t={`Unassigned`}/></div>
																																						{theCarpool.myStudentsAll && m.myStudentsAll.length > 0 && m.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
																																								let studentTimeAssign = m.timeStudentAssigns && m.timeStudentAssigns.length > 0 && m.timeStudentAssigns
																																										.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.dayOfWeek === day.id)[0];

																																								return studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty
																																									 ? null
																																									 : <div key={studentIndex} className={classes(styles.text, styles.moreBottom, styles.row)}>
																																													<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
																																															{s.firstName}
																																													</div>
																																													<div onClick={() => this.timeAssign(m.carpoolId, s.studentPersonId, '', 'right', -1, day.id, 'pickup', pickUps)}>
																																															<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
																																													</div>
																																											</div>
																																						})}
																																				</div>
																																				{pickUps.map((c, timeIndex) => {
																																						return (
																																								<div key={timeIndex+100}>
																																										<TextDisplay label={''} text={<TimeDisplay time={c.time || ''}/>} className={styles.sectionLabel}/>
																																										{theCarpool.myStudentsAll && m.myStudentsAll.length > 0 && m.myStudentsAll.filter(s => s.isIncluded && (s.memberPersonId === personId || theCarpool.entryPersonId === personId)).map((s, studentIndex) => {
																																												let studentTimeAssign = m.timeStudentAssigns && m.timeStudentAssigns.length > 0 && m.timeStudentAssigns
																																														.filter(a => a.dropOffOrPickUp === 'pickup' && a.studentPersonId === s.studentPersonId && a.carpoolTimeId === c.carpoolTimeId && a.dayOfWeek === day.id)[0];

																																												return !(studentTimeAssign && studentTimeAssign.carpoolTimeId && studentTimeAssign.carpoolTimeId !== guidEmpty)
																																														? null
																																														: <div key={studentIndex+200} className={classes(styles.text, styles.moreBottom, styles.row)}>
																																																	{timeIndex >= 0 &&
																																																			<div onClick={() => this.timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'left', timeIndex, day.id, 'pickup', pickUps)}>
																																																					<Icon pathName={'arrow_left0'} premium={true} fillColor={'blue'} className={styles.arrowLeft}/>
																																																			</div>
																																																	}
																																																	<div className={classes(styles.text, styles.littleLeft, styles.moreBottom)}>
																																																			{s.firstName}
																																																	</div>
																																																	{timeIndex < parseInt(pickUps.length)-parseInt(1) &&  //eslint-disable-line
																																																			<div onClick={() => this.timeAssign(m.carpoolId, s.studentPersonId, c.carpoolTimeId, 'right', timeIndex, day.id, 'pickup', pickUps)}>
																																																					<Icon pathName={'arrow_right0'} premium={true} fillColor={'blue'} className={styles.arrowRight}/>
																																																			</div>
																																																	}
																																															</div>
																																										})}
																																								</div>
																																						)
																																				})}
																																		</div>
																																</div>
																														}
																												</div>
																										}
																								</div>
																			)
																})}
														</div>
												</div>
										<hr />
										</div>
								)}
							)}
	            {isShowingModal_remove &&
	                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this carpool?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this carpool?  You will lose any setup you have entered such as carpool members, assigned drivers, and past history, if any.`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveItem} />
	            }
							{isShowingModal_requests &&
	                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Carpool Area has Requests`}/>}
											explainJSX={<L p={p} t={`This carpool area has requests pending from other drivers.  This carpool area cannot be deleted until the requests have been deleted or answered.`}/>}
											onClick={this.handleShowUsedInClose}/>
	            }
							{isShowingModal_description &&
	                <MessageModal handleClose={this.handleDescriptionClose} heading={carpoolName}
	                   explain={carpoolComment} onClick={this.handleDescriptionClose} />
	            }
							{isShowingModal_myStudents &&
									<CarpoolMemberStudentsModal handleClose={this.handleMyStudentsChangeClose} personId={personId} carpool={thisStudentCarpool}
											setMemberStudentsInCarpool={setMemberStudentsInCarpool} isShowing={isShowingModal_myStudents}/>
							}
							{isShowingModal_removePickUpTime &&
	                <MessageModal handleClose={this.handleRemovePickUpTimeClose} heading={<L p={p} t={`Remove Pick-up Time?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to remove this pick-up time?`}/>} isConfirmType={true}
	                   onClick={this.handleRemovePickUpTime} />
	            }
							{isShowingModal_removeDropOffTime &&
	                <MessageModal handleClose={this.handleRemoveDropOffTimeClose} heading={<L p={p} t={`Remove Drop-off Time?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to remove this drop-off time?`}/>} isConfirmType={true}
	                   onClick={this.handleRemoveDropOffTime} />
	            }
							{isShowingModal_missingInfo &&
									<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
										 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
							}
	      </div>
    );
  }
}

export default withAlert(CarpoolsMine)


// <FlexColumn heading={`My students`}
// 		data={<div onClick={() => this.handleMyStudentsChangeOpen(m)}>
// 							{m.myStudentsInCarpool && m.myStudentsInCarpool.length > 0 && m.myStudentsInCarpool.reduce((acc, s) => acc && acc.length >= 1 ? acc.concat(`, ${s.firstName}`) : [s.firstName], [])}
// 					</div>} />
