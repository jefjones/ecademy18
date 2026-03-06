import React, {Component} from 'react';
import {Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './VolunteerOpportunitiesView.css';
import EditTable from '../../components/EditTable';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateMoment from '../../components/DateMoment';
import MessageModal from '../../components/MessageModal';
import Button from '../../components/Button';
import InputText from '../../components/InputText';
import DateTimePicker from '../../components/DateTimePicker';
import Checkbox from '../../components/Checkbox';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class VolunteerOpportunitiesView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					showSearchControls: true,
					isShowingModal_volunteers: false,
					isShowingModal_deleteOpportunity: false,
					isShowingModal_deleteVolunteer: false,
					timerId: '',
					volunteerTypeId: '',
					partialNameText: '', //This is to gather the text but the search version below is the actual variable to filter the text.
					partialNameSearch: '',
					volunteerPersonId: '',
					showMyCommitments: '',
					fromDate: '',
					toDate: ''
	    }
  }

	componentDidMount() {
			const {personId, getVolunteerOpportunities} = this.props;
			this.setState({ timerId: setInterval(() => getVolunteerOpportunities(personId), 10000) });
	}

	componentWillUnmount() {
			if (this.state.timerId) {
					clearInterval(this.state.timerId);
					this.setState({ timerId: '' });
			}
	}

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState[target.name] = target.value;
			this.setState(newState);
	}

	handlePartialNameText = ({target}) => {
			this.setState({ partialNameText: target.value });
	}

	handlePartialNameEnterKey = (event) => {
			event.key === "Enter" && this.setPartialNameText();
	}

	setPartialNameText = () => {
			const {partialNameText} = this.state;
			this.setState({ partialNameSearch: partialNameText });
	}

	toggleSearch = () => this.setState({ showSearchControls: !this.state.showSearchControls })
	clearFilters = () => this.setState({ volunteerTypeId: '', volunteerPersonId: '', fromDate: '', toDate: '', partialNameSearch: ''})

	handleDeleteOpportunityOpen = (volunteerOpportunityDateId) => this.setState({ isShowingModal_deleteOpportunity: true, volunteerOpportunityDateId });
	handleDeleteOpportunityClose = () => this.setState({ isShowingModal_deleteOpportunity: false, volunteerOpportunityDateId: '' });
	handleDeleteOpportunity = () => {
			const {personId, removeVolunteerOpportunity} = this.props;
			const {volunteerOpportunityDateId} = this.state;
			removeVolunteerOpportunity(personId, volunteerOpportunityDateId);
			this.handleDeleteOpportunityClose();
	}

	handleDeleteVolunteerOpen = (volunteerOpportunityDateId) => this.setState({ isShowingModal_deleteVolunteer: true, volunteerOpportunityDateId });
	handleDeleteVolunteerClose = () => this.setState({ isShowingModal_deleteVolunteer: false, volunteerOpportunityDateId: '' });
	handleDeleteVolunteer = () => {
			const {personId, removeVolunteer} = this.props;
			const {volunteerOpportunityDateId} = this.state;
			removeVolunteer(personId, volunteerOpportunityDateId);
			this.handleDeleteOpportunityClose();
	}

	handleVolunteerCommit = (volunteerOpportunityDateId) => {
			const {personId, addVolunteer} = this.props;
			addVolunteer(personId, volunteerOpportunityDateId);
	}

	changeDate = (field, event) => {
			const newState = Object.assign({}, this.state);
			newState[field] = event.target.value;
			this.setState(newState);
	}

	toggleCheckbox = () => this.setState({ showMyCommitments: !this.state.showMyCommitments })

  render() {
    const {personId, volunteerOpportunities, volunteerList, volunteerTypes, accessRoles, myFrequentPlaces, setMyFrequentPlace, fetchingRecord} = this.props;
		const {volunteerTypeId, partialNameText, partialNameSearch, volunteerPersonId, fromDate, toDate, showSearchControls,  isShowingModal_deleteOpportunity,
						isShowingModal_deleteVolunteer, showMyCommitments} = this.state;
		let localOpportunities = volunteerOpportunities && volunteerOpportunities.opportunities;

		let headings = [{},
				{label: <L p={p} t={`Needed`}/>, tightText: true},
				{label: <L p={p} t={`Volunteers`}/>, tightText: true},
				{label: <L p={p} t={`Name`}/>, tightText: true},
				{label: <L p={p} t={`Event type`}/>, tightText: true},
				{label: <L p={p} t={`Start`}/>, tightText: true},
				{label: <L p={p} t={`End`}/>, tightText: true},
				{label: <L p={p} t={`Note`}/>, tightText: true},
		];
    let data = [];

    if (localOpportunities && localOpportunities.length > 0) {
				if ((volunteerTypeId && volunteerTypeId != 0) || (volunteerPersonId && volunteerPersonId != 0) || partialNameText || fromDate || toDate || showMyCommitments) { //eslint-disable-line
						if (volunteerTypeId && volunteerTypeId != 0) localOpportunities = localOpportunities.filter(m => m.volunteerTypeId === volunteerTypeId); //eslint-disable-line
						if (partialNameSearch) localOpportunities = localOpportunities.filter(m => m.volunteerOpportunityName.indexOf(partialNameSearch) > -1); //eslint-disable-line
						if (fromDate && Number(fromDate.replace(/-/g,'')) > 20160101) {
								localOpportunities = localOpportunities.filter(m => {
										let startTime = m.startTime.indexOf('T') ? m.startTime.substring(0,m.startTime.indexOf('T')) : m.startTime;
										return startTime >= fromDate;
 								});
						}
						if (toDate && Number(toDate.replace(/-/g,'')) > 20160101) {
								localOpportunities = localOpportunities.filter(m => {
										let endTime = m.endTime.indexOf('T') ? m.endTime.substring(0,m.endTime.indexOf('T')) : m.endTime;
										return endTime <= toDate;
 								});
						}
						if (volunteerPersonId && volunteerPersonId != 0) localOpportunities = localOpportunities.filter(m => { //eslint-disable-line
								let foundVolunteer = false;
								volunteerOpportunities && volunteerOpportunities.volunteers && volunteerOpportunities.volunteers.forEach(d => {
										if (d.volunteerOpportunityDateId === m.volunteerOpportunityDateId && d.personId === volunteerPersonId) foundVolunteer = true;
								});
								return foundVolunteer;
						});
						if (showMyCommitments) {
								let volunteers = (volunteerOpportunities && volunteerOpportunities.volunteers) || [];
								localOpportunities = localOpportunities && localOpportunities.length > 0 && localOpportunities.filter(m => {
										let isVolunteer = volunteers && volunteers.length > 0 && volunteers.filter(v => v.volunteerOpportunityDateId === m.volunteerOpportunityDateId && v.personId === personId)[0];
										return isVolunteer && isVolunteer.personName ? true : false;
								});
						}
						//Time filters?
				}
				let volunteers = (volunteerOpportunities && volunteerOpportunities.volunteers) || [];

        data = localOpportunities && localOpportunities.length > 0 && localOpportunities.map(m => {
						let isVolunteer = volunteers && volunteers.length > 0 && volunteers.filter(v => v.volunteerOpportunityDateId === m.volunteerOpportunityDateId && v.personId === personId)[0];
						isVolunteer = isVolunteer && isVolunteer.personName;

						return [
								{value: accessRoles.admin
													? <a onClick={() => this.handleDeleteOpportunityOpen(m.volunteerOpportunityDateId)} data-rh={'Delete this opportunity'}>
																<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
														</a>
													: isVolunteer
															? <a onClick={() => this.handleDeleteVolunteerOpen(m.volunteerOpportunityDateId)} data-rh={'Delete my volunteer committment'}>
																		<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
																</a>
															: <a onClick={() => this.handleVolunteerCommit(m.volunteerOpportunityDateId)} data-rh={'I want to volunteer for this!'}>
																		<Icon pathName={'thumbs_up0'} fillColor={'green'} premium={true} className={styles.icon}/>
																</a>
								},
								{value: m.volunteersNeeded},
								{value: <a onClick={() => this.handleShowVolunteerListOpen(m.volunteerOpportunityDateId)}>{volunteerList.length}</a>},
								{value: m.volunteerOpportunityName},
								{value: m.volunteerTypeName},
								{value: <DateMoment date={m.startTime} includeTime={true} minusHours={6}/>},
								{value: <DateMoment date={m.endTime} includeTime={true} minusHours={6}/>},
								{value: m.note},
	          ]
        });
    }

    return (
        <div className={styles.container}>
						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
								<L p={p} t={`Volunteer Opportunities`}/>
						</div>
						<div className={styles.row}>
								<a onClick={this.toggleSearch} className={classes(styles.row, globalStyles.link)}>
										<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
										{showSearchControls ? <L p={p} t={`Hide search controls`}/> : <L p={p} t={`Show search controls`}/>}
								</a>
								{showSearchControls && <a onClick={this.clearFilters} className={classes(styles.muchRight, globalStyles.link)}><L p={p} t={`Clear filters`}/></a>}
								<div className={classes(styles.row, styles.moveLeftMuch)}>
										<Icon pathName={'plus'} className={styles.iconTop} fillColor={'green'}/>
										<Link to={`/volunteerOpportunityAdd`} className={globalStyles.link}><L p={p} t={`Add Another Opportunity`}/></Link>
								</div>
						</div>
						{showSearchControls &&
								<div className={styles.moreBottom}>
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
										</div>
										{accessRoles.admin &&
												<div>
														<SelectSingleDropDown
																id={`volunteerPersonId`}
																name={`volunteerPersonId`}
																label={<L p={p} t={`Volunteer`}/>}
																value={volunteerPersonId || ''}
																options={volunteerList}
																className={styles.moreBottomMargin}
																height={`medium`}
																onChange={this.handleChange}/>
												</div>
										}
										<div>
												<SelectSingleDropDown
														id={`volunteerTypeId`}
														name={`volunteerTypeId`}
														label={<L p={p} t={`Event type`}/>}
														value={volunteerTypeId || ''}
														options={volunteerTypes}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={this.handleChange}/>
										</div>
										<div>
												<div className={classes(styles.littleLeft, styles.moreTop, styles.row)}>
														<div className={styles.dateRow}>
																<span className={styles.headerLabel}><L p={p} t={`Date range - From`}/></span>
																<DateTimePicker id={`fromDate`} value={fromDate} maxDate={toDate} onChange={(event) => this.changeDate('fromDate', event)}/>
														</div>
														<div className={styles.dateRow}>
																<span className={styles.headerLabel}><L p={p} t={`To`}/></span>
																<DateTimePicker id={`toDate`} value={toDate} minDate={fromDate ? fromDate : ''} onChange={(event) => this.changeDate('toDate', event)}/>
														</div>
												</div>
										</div>
										{!accessRoles.admin &&
												<Checkbox
														id={'showMyCommitments'}
														label={<L p={p} t={`Only show my committments`}/>}
														labelClass={styles.checkboxLabel}
														checked={showMyCommitments || false}
														onClick={this.toggleCheckbox}
														className={styles.button}/>
										}
										<hr/>
								</div>
						}
						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.olunteerOpportunities}/>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Volunteer Opportunities`}/>} path={'volunteerOpportunities'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						<OneFJefFooter />

						{isShowingModal_deleteVolunteer &&
								<MessageModal handleClose={this.handleDeleteVolunteerClose} heading={<L p={p} t={`Delete your committment to this volunteer opportunity?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove your committment to this volunteer opportunity?`}/>} isConfirmType={true}
									 onClick={this.handleDeleteVolunteer} />
						}
						{isShowingModal_deleteOpportunity &&
								<MessageModal handleClose={this.handleDeleteOpportunityClose} heading={<L p={p} t={`Remove this volunteer opportunity?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this volunteer opportunity?`}/>} isConfirmType={true}
									 onClick={this.handleDeleteOpportunity} />
						}
      	</div>
    );
  }
}

export default withAlert(VolunteerOpportunitiesView);
