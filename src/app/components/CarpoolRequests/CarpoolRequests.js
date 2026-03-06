import React, {Component} from 'react';
import {Link} from 'react-router';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
import styles from './CarpoolRequests.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import EditTable from '../EditTable';
import InputText from '../InputText';
import SelectSingleDropDown from '../SelectSingleDropDown';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import MessageModal from '../MessageModal';
import AnnouncementModal from '../AnnouncementModal';
import CarpoolRequestResponseModal from '../CarpoolRequestResponseModal';
import CarpoolAcceptRequestDirectModal from '../CarpoolAcceptRequestDirectModal';
import CarpoolAcceptRequestFinalModal from '../CarpoolAcceptRequestFinalModal';
import Button from '../Button';
import ButtonWithIcon from '../ButtonWithIcon';
import DateMoment from '../DateMoment';
import WeekdayDisplay from '../WeekdayDisplay';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import {emailValidate} from '../../utils/emailValidate.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class CarpoolRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
			localPendingAnswer: [],
      isShowingModal_remove: false,
			isShowingModal_description: false,
			isShowingModal_message: false,
			isShowingModal_response: false,
			isShowingModal_newCarpoolLink: false,
			isShowingModal_carpoolChoice: false,
			isShowingModal_uninvite: false,
			isShowingModal_accept: false,
      carpoolRequestId: '',
			allowAddress: false,
      carpoolRequest: {
				carpoolRequestId: '',
				carpoolAreaId: '',
				carpoolId: '',
				areaName: '',
				desription: '',
				seatsAvailable: '',
				seatsNeeded: '',
				canDropOffDays: [],
        canPickUpDays: [],
        comment: '',
      },
      errors: {
				carpoolAreaId: '',
				seats: '',
				canDropOffDays: '',
				canPickUpDays: '',
				comment: '',
      },
			directCarpoolId: '',
			directEmailAddress: '',
			directComment: '',
    }
  }

	componentDidUpdate() {
			const {carpool} = this.props;
			const {isInit} = this.state;
			if (!isInit && carpool && carpool.carpoolRequestWatches && carpool.carpoolRequestWatches.length > 0) {
					let filterCarpoolAreas = carpool.carpoolRequestWatches.reduce((acc, m) => {
							let option = {
								carpoolAreaId: m.carpoolAreaId,
								areaName: m.areaName,
								description: m.description
							}
							return acc ? acc.concat(option) : [option];
					}, [])
					let checkedSendEmail = carpool.carpoolRequestWatches[0].sendEmail;
					this.setState({ checkedSendEmail, filterCarpoolAreas, isInit: true });
			}

	}

  handleCarpoolRequest = (event) => {
	    const field = event.target.name;
	    let carpoolRequest = Object.assign({}, this.state.carpoolRequest);
	    let errors = Object.assign({}, this.state.errors);
	    carpoolRequest[field] = event.target.value;
	    errors[field] = '';
			if (field === 'areaName') carpoolRequest.carpoolAreaId = guidEmpty;
	    this.setState({ carpoolRequest, errors });
  }

	checkForDuplicateAreaName = () => {
			const {carpool} = this.props;
			const {carpoolRequest} = this.state;
			//If this is an edit record with a valid carpoolRequestId, then let there be one duplicate.
			let duplicateCount = 0;
			carpool.carpoolAreas && carpool.carpoolAreas.length > 0 && carpool.carpoolAreas.forEach(m => {
					if (m.areaName.toLowerCase().replace(' ', '') === carpoolRequest.areaName.toLowerCase().replace(' ', '')) duplicateCount++;
			})
			return carpoolRequest.carpoolRequestId && carpoolRequest.carpoolRequestId !== guidEmpty ? duplicateCount > 1 : duplicateCount > 0;
	}

  processForm = (stayOrFinish) => {
      const {addOrUpdateCarpoolRequest, personId} = this.props;
      const {carpoolRequest, allowAddress} = this.state;
      let hasError = false;

			if (carpoolRequest.areaName && this.checkForDuplicateAreaName()) {
				hasError = true;
				this.setState({ errorCarpoolAreaId: <L p={p} t={`The Area Name entered already exists`}/> });
			}

      if (!carpoolRequest.carpoolAreaId && !carpoolRequest.areaName) {
          hasError = true;
          this.setState({ errorCarpoolAreaId: <L p={p} t={`Area Name is required`}/> });
      }
			if (!carpoolRequest.seatsNeeded && !carpoolRequest.seatsAvailable) {
          hasError = true;
          this.setState({errorSeats: <L p={p} t={`Enter seats needed and seats vacant`}/> });
      }
			// if ((!carpoolRequest.canDropOffDays || carpoolRequest.canDropOffDays.length === 0) && (!carpoolRequest.canPickUpDays || carpoolRequest.canPickUpDays.length === 0)) {
      //     hasError = true;
      //     this.setState({ errorDropOffOrPickUp: "Choose days you can drop off or pick up" });
      // }
			if (!allowAddress) {
          hasError = true;
          this.setState({ errorAllowAddress: <L p={p} t={`A carpool member needs to consider your location in order to make a decision to carpool with you.`}/> });
      }

      if (!hasError) {
          addOrUpdateCarpoolRequest(personId, carpoolRequest);
          this.setState({
              carpoolRequest: {
									carpoolRequestId: '',
									carpoolAreaId: '',
									carpoolId: '',
									areaName: '',
									desription: '',
									seatsAvailable: '',
									seatsNeeded: '',
									canDropOffDays: [],
					        canPickUpDays: [],
					        comment: '',
              },
							errorCarpoolAreaId: '',
							errorSeats: '',
							errorDropOffOrPickUp: '',
							errorAllowAddress: '',
          });
					this.handleExpansionChange('panel1')(null, false);
      }
  }

	handleShowUsedInOpen = (requests) => {
			let listUsedIn = requests && requests.length > 0 && requests.join("<br/>");
			this.setState({isShowingModal_requests: true, listUsedIn });
	}
  handleShowUsedInClose = () => this.setState({isShowingModal_requests: false, listUsedIn: [] })

	handleRemoveItemOpen = (carpoolRequestId) => {
			this.setState({isShowingModal_remove: true, carpoolRequestId })
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false, carpoolRequestId: '' })
  handleRemoveItem = () => {
      const {removeCarpoolRequest, personId} = this.props;
      const {carpoolRequestId} = this.state;
      removeCarpoolRequest(personId, carpoolRequestId);
      this.handleRemoveItemClose();
  }

	handleEdit = (carpoolRequest) => {
			this.handleExpansionChange('panel1')(null, true);
			this.setState({ carpoolRequest });
	}

	handleSelectedCanDropOffDays = (canDropOffDays) => {
      const carpoolRequest = this.state.carpoolRequest;
      carpoolRequest.canDropOffDays = canDropOffDays;
      this.setState({ carpoolRequest });
  }

	handleSelectedCanPickUpDays = (canPickUpDays) => {
      const carpoolRequest = this.state.carpoolRequest;
      carpoolRequest.canPickUpDays = canPickUpDays;
      this.setState({ carpoolRequest });
  }

	handleExpansionChange = panel => (event, expanded) => {
			const {carpool} = this.props;
			this.setState({ expanded: expanded ? panel : false });
			if (panel === 'panel1' && !(carpool.myCarpools && carpool.myCarpools.length > 0)) {
					this.handleCarpoolCreateNewLinkOpen();
			}
	};

	toggleNewAreaControls = () => {
			this.setState({ addNewArea : !this.state.addNewArea})
	}

	handleDescriptionOpen = (areaName, description) => this.setState({isShowingModal_description: true, areaName, description })
	handleDescriptionClose = () => this.setState({isShowingModal_description: false, areaName: '', description: '' })

	handleFilterCarpoolArea = (event, filterCarpoolAreaId) => {
			const {carpool, addOrUpdateCarpoolSearchFilter, personId} = this.props;
			const {checkedSendEmail} = this.state;

			let filterCarpoolAreas = this.state.filterCarpoolAreas;
			filterCarpoolAreaId = filterCarpoolAreaId ? filterCarpoolAreaId : event.target.value;
			if (filterCarpoolAreaId && filterCarpoolAreaId !== guidEmpty) {
					let carpoolArea = carpool.carpoolAreas.filter(m => m.carpoolAreaId === filterCarpoolAreaId)[0] || {};
					if (filterCarpoolAreas && filterCarpoolAreas.length > 0) {
							let hasArea = false;
							filterCarpoolAreas.forEach(m => {
									if (m.carpoolAreaId === filterCarpoolAreaId) {
											hasArea = true;
											filterCarpoolAreas = filterCarpoolAreas.filter(f => f.carpoolAreaId !== filterCarpoolAreaId);
											filterCarpoolAreaId = guidEmpty; //Clear this out since this carpool record is going to be returned to the list and we don't care to have it chosen.
									}
							})
							if (!hasArea) filterCarpoolAreas = filterCarpoolAreas.concat(carpoolArea);
					} else {
							filterCarpoolAreas = [carpoolArea];
					}
					this.setState({ filterCarpoolAreaId, filterCarpoolAreas });
			}
			addOrUpdateCarpoolSearchFilter(personId, filterCarpoolAreas, checkedSendEmail);
	}

	toggleSendEmailFilter = () => {
			const {addOrUpdateCarpoolSearchFilter, personId} = this.props;
			const {filterCarpoolAreas, checkedSendEmail} = this.state;
			this.setState({ checkedSendEmail: !checkedSendEmail });
			addOrUpdateCarpoolSearchFilter(personId, filterCarpoolAreas, !checkedSendEmail);
	}

	toggleAllowAddress = () => {
			this.setState({ allowAddress: !this.state.allowAddress });
	}

	toggleDirectAllowAddress = () => {
			this.setState({ directAllowAddress: !this.state.directAllowAddress });
	}

	setFirstIcon = (request) => {
			const {personId} = this.props
			if (request.responseType === 'invite' && request.responsePersonId === personId) return;

			return (
					<div className={styles.row}>
							{request.fromPersonId === personId &&
									<div onClick={() => this.handleEdit(request)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></div>
							}
							<Link to={`announcementEdit/carpoolRequest/${request.carpoolRequestId}/${request.fromPersonId}/${request.personName}`}
											 data-rh={'Send a message'}>
										<Icon pathName={'comment_text'} premium={true} superscript={'plus'} supFillColor={'#24b51c'} className={styles.icon} superScriptClass={styles.iconSuperscript}/>
							</Link>
							{request.messages && request.messages.length > 0 && request.messages.map((m, i) =>
									<div key={i} onClick={() => this.handleMessageOpen(m.announcementId)}>
											<Icon pathName={'comment_text'} premium={true} className={styles.iconMessage} fillColor={'orange'} />
									</div>
							)}
					</div>
			)
  }

	handleMessageOpen = (announcementId) => {
			const {getMessageSingleFullThread} = this.props;
			getMessageSingleFullThread(announcementId);
			this.setState({isShowingModal_message: true, announcementId });
	}
	handleMessageClose = () => this.setState({isShowingModal_message: false})

	sendToNewCarpool = () => {
		 const {changeTabChosen, toggleOpenAddNewCarpool} = this.props;
		 changeTabChosen('myCarpools');
		 toggleOpenAddNewCarpool(true);
	}

	handlePickMe = (request) => {
			const {personId, removeCarpoolRequestResponse} = this.props;
			//If this is an unpick me, then send the delete request to the server.
			//Otherwise, pop up the message box with the seats available and seats needed fields and day choices with optional comment.
			if (request.responseType === 'pickme') {
					removeCarpoolRequestResponse(personId, request.carpoolRequestResponseId)
			} else {
				  this.handleCarpoolRequestResponseOpen(request, 'pickme');
			}
	}

	handleInviteYou = (request) => {
			const {carpool} = this.props;
			//if this is an uninvite, then delete the CarpoolRequestResponse for the invitation that the use was giving.
			if (request.responseType === 'invite') {
					this.handleUninviteRequestOpen(request.carpoolRequestResponseId);
			//Otherwise,
					// On invite, if the user does not have a carpool, provide a link to create a carpool and that is all for that step. (They will need to return to the request list and make their choices again)
					// 		If they have more than one carpool, provide a radio group to choose with a submit button
					// 		If there is just one carpool, then the request goes through direcctly.
			} else if (!carpool.myCarpools || carpool.myCarpools.length === 0) {
					this.handleCarpoolCreateNewLinkOpen();
			} else {
					this.handleCarpoolRequestResponseOpen(request, 'invite');
			}
	}

	handleUninviteRequestOpen = (carpoolRequestResponseId) => this.setState({ isShowingModal_uninvite: true, carpoolRequestResponseId})
	handleUninviteRequestClose = () => this.setState({ isShowingModal_uninvite: false, carpoolRequestResponseId: '' })
	handleUninviteRequest = () => {
			const {removeCarpoolRequestResponse, personId} = this.props;
			const {carpoolRequestResponseId} = this.state;
			this.handleUninviteRequestClose();
			removeCarpoolRequestResponse(personId, carpoolRequestResponseId);
	}

	handleCarpoolRequestResponseOpen = (carpoolRequest, responseType) => this.setState({ isShowingModal_response: true, carpoolRequest, responseType });
	handleCarpoolRequestResponseClose = () => this.setState({ isShowingModal_response: false, carpoolRequest: {} });

	handleCarpoolCreateNewLinkOpen = () => this.setState({ isShowingModal_newCarpoolLink: true });
	handleCarpoolCreateNewLinkClose = () => this.setState({ isShowingModal_newCarpoolLink: false });
	handleCarpoolCreateNewLink = () => {
			this.props.toggleOpenAddNewCarpool();
			this.handleCarpoolCreateNewLinkClose();
	}

	handleDeclineDirectRequestOpen = (carpoolRequestDirectId) => this.setState({ isShowingModal_directDecline: true, carpoolRequestDirectId });
	handleDeclineDirectRequestClose = () => this.setState({ isShowingModal_directDecline: false, carpoolRequestDirectId: '' });
	handleDeclineDirectRequest = () => {
			this.props.declineDirectRequest(this.props.personId, this.state.carpoolRequestDirectId);
			this.handleDeclineDirectRequestClose();
	}

	handleRemoveDirectRequestOpen = (carpoolRequestDirectId) => this.setState({ isShowingModal_directRemove: true, carpoolRequestDirectId });
	handleRemoveDirectRequestClose = () => this.setState({ isShowingModal_directRemove: false, carpoolRequestDirectId: '' });
	handleRemoveDirectRequest = () => {
			this.props.removeDirectRequest(this.props.personId, this.state.carpoolRequestDirectId);
			this.handleRemoveDirectRequestClose();
	}

	prepForURL = (text) => {
			return text.replace(' ', '+').replace('%20','+');
	}

	handleAcceptOrDecline = (acceptOrDecline, request, response) => {
			const {personId, setCarpoolMember} = this.props;
			let localPendingAnswer = Object.assign({}, this.state.localPendingAnswer);
			localPendingAnswer = localPendingAnswer ? localPendingAnswer.concat(response.carpoolRequestResponseId) : [response.carpoolRequestResponseId];
			this.setState({ localPendingAnswer });
			let thisPersonId = response.responseType === 'invite' ? personId : response.responsePersonId;
			setCarpoolMember(thisPersonId, acceptOrDecline, response.carpoolRequestResponseId, thisPersonId);
	}


	 handleCarpoolRequestDirect = (event) => {
			let newState = Object.assign({}, this.state);
			newState[event.target.name] = event.target.value;
			if (event.target.name === 'directEmailAddress') newState[event.target.name] = newState[event.target.name].replace(' ', '');
			this.setState(newState);
	}

	handleEmailAddressCheck = () => {
			const {directEmailAddress} = this.state;
			let hasError = false;

			if (!directEmailAddress) {
					hasError = true;
					this.setState({ errorDirectEmailAddress: <L p={p} t={`An email address is required`}/> });
			} else if (!emailValidate(directEmailAddress)) {
					hasError = true;
					this.setState({ errorDirectEmailAddress: <L p={p} t={`The email address appears to be invalid`}/> });
			}

			if (!hasError) {
					axios.get(`${apiHost}ebi/emailAddress/verify/${this.state.personId}/${this.state.directEmailAddress}`,
					{
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Access-Control-Allow-Credentials' : 'true',
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
							"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
							"Authorization": "Bearer " + localStorage.getItem("authToken"),
					}})
					.catch(function (error) {
						//Show error here.
					})
					.then(response => {
							let emailAddressFound = false;
							if (response.data === 'FOUND') {
									emailAddressFound = true;
									this.setState({ errorDirectEmailAddress: '', emailAddressFound, isVerify: true });
							} else {
									this.setState({ errorDirectEmailAddress: 'This email address was not found', emailAddressFound, isVerify: true });
							}
					})
			}
	}

	handleAddCarpoolRequestDirect = () => {
			const {personId, addDirectRequest} = this.props;
			const {directCarpoolId, directEmailAddress, directComment, directAllowAddress} = this.state;
			let hasError = false;

			if (!directCarpoolId) {
					hasError = true;
					this.setState({ errorDirectCarpoolId: <L p={p} t={`A carpool is required`}/> });
			}

			if (!directEmailAddress) {
					hasError = true;
					this.setState({ errorDirectEmailAddress: <L p={p} t={`An email address is required`}/> });
			} else if (!emailValidate(directEmailAddress)) {
					hasError = true;
					this.setState({ errorDirectEmailAddress: <L p={p} t={`An email address is required`}/> });
			}

			if (!directAllowAddress) {
          hasError = true;
          this.setState({ errorDirectAllowAddress: <L p={p} t={`A carpool member needs to consider your location in order to make a decision to carpool with you.`}/> });
      }

			if (!hasError) {
					let carpoolRequestDirect = {
							carpoolId: directCarpoolId,
							fromPersonId: personId,
							toEmailAddress: directEmailAddress,
							note: directComment,
					}

					addDirectRequest(personId, carpoolRequestDirect)
					this.setState({ directCarpoolId: '', directEmailAddress: '', directComment: '' })
					this.handleExpansionChange('panel1')(null, false);
			}

	}

	handleAcceptDirectRequestOpen = (carpoolRequestDirectId) => {
			const {carpool} = this.props;
			let carpoolRequestDirect = carpool && carpool.carpoolRequestsDirect && carpool.carpoolRequestsDirect.length > 0 && carpool.carpoolRequestsDirect.filter(m => m.carpoolRequestDirectId === carpoolRequestDirectId)[0];
			this.setState({ isShowingModal_directAccept: true, carpoolRequestDirectId, carpoolRequestDirect });
	}
	handleAcceptDirectRequestClose = () => this.setState({ isShowingModal_directAccept: false, carpoolRequestDirectId: '' });
	handleAcceptDirectRequest = () => {
			const {personId, acceptDirectRequest} = this.props;
			const {carpoolRequestDirectId} = this.state;
			acceptDirectRequest(personId, carpoolRequestDirectId);
			this.handleAcceptDirectRequestClose();
	}

	handleAcceptRequestFinalOpen = (carpoolRequestId, request, carpoolRequestResponse) => {
			const {carpool} = this.props;
			let carpoolRequest = carpool && carpool.carpoolRequests && carpool.carpoolRequests.length > 0 && carpool.carpoolRequests.filter(m => m.carpoolRequestId === carpoolRequestId)[0];
			this.setState({ isShowingModal_accept: true, carpoolRequestId, carpoolRequest, request, carpoolRequestResponse });
	}
	handleAcceptRequestFinalClose = () => this.setState({ isShowingModal_accept: false, carpoolRequestId: '', request: '', carpoolRequestResponse: '' });
	handleAcceptRequestFinal = () => {
			const {request, carpoolRequestResponse} = this.state;
			this.handleAcceptOrDecline('accept', request, carpoolRequestResponse)
			this.handleAcceptRequestFinalClose();
	}

  render() {
    const {personId, carpool={}, daysOfWeek, setStudentsSelected, messageFullThread, addCarpoolRequestResponse, daysOfWeekAll,
						toggleCarpoolRequestDirectCanDoDay, acceptDirectRequest, toggleCarpoolRequestFinalCanDoDay, isFetchingRecord} = this.props;
    const {carpoolRequest, errorCarpoolAreaId, errorSeats, errorDropOffOrPickUp, isShowingModal_remove, isShowingModal_requests, expanded, addNewArea,
						isShowingModal_description, areaName, description, filterCarpoolAreas, filterCarpoolAreaId, checkedSendEmail, isShowingModal_message,
						isShowingModal_response, allowAddress, errorAllowAddress, isShowingModal_newCarpoolLink, responseType, localPendingAnswer=[],
						emailAddressFound, isVerify, directEmailAddress, directCarpoolId, directComment, directAllowAddress, errorDirectEmailAddress,
						errorDirectCarpoolId, errorDirectAllowAddress, isShowingModal_directAccept, isShowingModal_directDecline,
						isShowingModal_directRemove, carpoolRequestDirect, isShowingModal_uninvite, isShowingModal_accept, carpoolRequestResponse} = this.state;

		let localRequests = [];
		let filterCarpoolAreasMinus = carpool.carpoolAreas;
		if (filterCarpoolAreasMinus && filterCarpoolAreasMinus.length > 0 && filterCarpoolAreas && filterCarpoolAreas.length > 0) {
				filterCarpoolAreas.forEach(m => {
						filterCarpoolAreasMinus = filterCarpoolAreasMinus.filter(f => f.carpoolAreaId !== m.carpoolAreaId);
				})
		}
		if (carpool.carpoolRequests && carpool.carpoolRequests.length > 0 && filterCarpoolAreas && filterCarpoolAreas.length > 0) {
				carpool.carpoolRequests.forEach(c => {
						filterCarpoolAreas.forEach(m => {
								if (c.carpoolAreaId === m.carpoolAreaId) {
										localRequests = localRequests ? localRequests.concat(c) : [c];
								}
						})
				})
		} else {
				localRequests = carpool.carpoolRequests;
		}

		let headingsDirect = [{},
				{label: <L p={p} t={`From`}/>, tightText: true},
				{label: <L p={p} t={`To`}/>, tightText: true},
				{label: <L p={p} t={`Response`}/>, tightText: true},
				{label: <L p={p} t={`Note`}/>, tightText: true},
				{label: <L p={p} t={`Entry date`}/>, tightText: true},
				{label: <L p={p} t={`Response date`}/>, tightText: true},
		];

    let dataDirect = [];

    carpool.carpoolRequestsDirect && carpool.carpoolRequestsDirect.length > 0 && carpool.carpoolRequestsDirect.forEach(m => {
          dataDirect.push([
							{value: m.fromPersonId === personId
									? <div onClick={() => this.handleRemoveDirectRequestOpen(m.carpoolRequestDirectId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div>
									: ''
							},
							{value: <a href={`http://maps.google.com/?q=${m.fromStreetAddress}, ${m.fromCity}, ${m.fromUsStateName}`} className={globalStyles.link} target={'_blank'}>
													{m.fromPersonName}
											</a>
							},
							{value: <a href={`http://maps.google.com/?q=${m.toStreetAddress}, ${m.toCity}, ${m.toUsStateName}`} className={globalStyles.link} target={'_blank'}>
													{m.toPersonName}
											</a>
							},
              {value: m.fromPersonId === personId
													? m.acceptOrDecline
															? m.acceptOrDecline
															: <i>pending</i>
													: m.acceptOrDecline
															? m.acceptOrDecline
															: <div className={styles.row}>
																		<Button label={<L p={p} t={`Accept`}/>} onClick={() => this.handleAcceptDirectRequestOpen(m.carpoolRequestDirectId)}
																				addClassName={styles.notSoHigh}/>
																		<Button label={<L p={p} t={`Decline`}/>} onClick={() => this.handleDeclineDirectRequestOpen(m.carpoolRequestDirectId)}
																				changeRed={true} addClassName={styles.notSoHigh}/>
																</div>
							},
							{value: m.comment},
							{value: <DateMoment date={m.entryDate} minusHours={6}/>},
              {value: <DateMoment date={m.responseDate} minusHours={6}/>},
         ])
    })
    if(!(dataDirect && dataDirect.length > 0)) {
        dataDirect = [[{value: ''}, {value: <i><L p={p} t={`No direct requests.`}/></i>, colSpan: 4 }]]
    }

    let headingsOpen = [{}, {},
				{label: <L p={p} t={`Area name`}/>, tightText: true},
				{label: <L p={p} t={`Name`}/>, tightText: true},
				{label: <L p={p} t={`Seats vacant`}/>, tightText: true},
				{label: <L p={p} t={`Seats needed`}/>, tightText: true},
				{label: <div className={styles.nobreak}><L p={p} t={`Can`}/><br/><L p={p} t={`drop off`}/></div>, tightText: true},
				{label: <div className={styles.nobreak}><L p={p} t={`Can`}/><br/><L p={p} t={`pick up`}/></div>, tightText: true},
				{label: 'Comment', tightText: true}];

    let dataOpen = [];

    if (localRequests && localRequests.length > 0) {
        localRequests.forEach(m => {
						let isAccepted = m.carpoolRequestResponses && m.carpoolRequestResponses.length > 0 && m.carpoolRequestResponses.filter(r => r.answerType === 'accepted')[0];
						isAccepted = isAccepted && isAccepted.answerType;

            dataOpen.push([
							{value: this.setFirstIcon(m)},
              {value: m.fromPersonId === personId
													? <div onClick={() => this.handleRemoveItemOpen(m.carpoolRequestId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div>
													: isAccepted
															? ''
															: <Button label={m.carpoolId && m.carpoolId !== guidEmpty
																		? m.responseType === 'pickme'
																		 		? <L p={p} t={`Unpick me`}/>
																				: <L p={p} t={`Pick me!`}/>
																		: m.responseType === 'invite'
																				? <L p={p} t={`Uninvite`}/>
																				: <L p={p} t={`Invite`}/>
																	} onClick={m.carpoolId  && m.carpoolId !== guidEmpty ? () => this.handlePickMe(m) : () => this.handleInviteYou(m)}
																	changeRed={m.responseType} addClassName={styles.notSoHigh}/>
							},
							{value: !!m.description
													? <div onClick={() => this.handleDescriptionOpen(m.areaName, m.description)} className={globalStyles.link}>{m.areaName}</div>
													: m.areaName
							},
							{value: <a href={`http://maps.google.com/?q=${m.streetAddress}, ${m.city}, ${m.usStateName}`} className={globalStyles.link} target={'_blank'}>
													{m.personName}
											</a>
							},
							{value: m.seatsAvailable},
              {value: m.seatsNeeded},
							{value: <WeekdayDisplay days={m.canDropOffDays}/>},
							{value: <WeekdayDisplay days={m.canPickUpDays}/>},
              {value: m.comment},
            ])
						m.carpoolRequestResponses && m.carpoolRequestResponses.length > 0 && m.carpoolRequestResponses.forEach(r => {
								dataOpen.push([
									{value: this.setFirstIcon(r)},
									{},
		              {value: localPendingAnswer.indexOf(r.carpoolRequestResponseId) > -1 && !r.answerType
															? 'Processing...'
															: r.answerType === 'accepted'
																	? <div className={styles.responseLabel}><L p={p} t={`Accepted:`}/>}</div>
																	: r.answerType === 'declined'
																			? <div className={styles.responseLabel}><L p={p} t={`Declined:`}/></div>
																			: m.fromPersonId === personId
																					? <div>
																								<Button label={<L p={p} t={`Accept`}/>} onClick={() => this.handleAcceptRequestFinalOpen(m.carpoolRequestId, m, r)}
																										addClassName={styles.notSoHigh}/>
																								<Button label={<L p={p} t={`Decline`}/>} onClick={() => this.handleAcceptOrDecline('decline', m, r)} changeRed={true} addClassName={styles.notSoHigh}/>
																						</div>
																					: <div className={styles.responseLabel}><L p={p} t={`My response:`}/></div>,
											cellColor: 'response',
									},
									{value: <a href={`http://maps.google.com/?q=${r.streetAddress}, ${r.city}, ${r.usStateName}`} className={globalStyles.link} target={'_blank'}>
															{r.personName}
													</a>,
											cellColor: 'response',
									},
									{value: r.seatsAvailable, cellColor: 'response'},
		              {value: r.seatsNeeded, cellColor: 'response'},
									{value: <WeekdayDisplay days={r.canDropOffDays}/>, cellColor: 'response'},
									{value: <WeekdayDisplay days={r.canPickUpDays}/>, cellColor: 'response'},
		              {value: r.comment, cellColor: 'response'},
		            ])
						})
        });
    } else {
        dataOpen = [[{value: ''}, {value: <i>No carpool area requests.</i> }]]
    }

		let myCarpools = carpool.myCarpools && carpool.myCarpools.length > 0 && carpool.myCarpools.filter(m => m.entryPersonId === personId);
		if (myCarpools && myCarpools.length > 0) {
				myCarpools = myCarpools.reduce((acc, m) => {
						let option = {id: m.carpoolId, label: m.name};
						return acc ? acc.concat(option) : [option];
				}, [])
		}

    return (
        <div className={styles.container}>
						<ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleExpansionChange('panel1')}>
								<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
										<div className={styles.row}>
												<Icon pathName={'plus'} premium={false} className={styles.icon} fillColor={'green'}/>
												<span className={globalStyles.link}>Add a new direct invitation? (For people you already know)</span>
										</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
										<div>
												{!(myCarpools && myCarpools.length > 0) &&
														<div className={globalStyles.errorText}>You must have a carpool created already in order to send a direct invitation</div>
												}
												<div>
														<SelectSingleDropDown
																id={`directCarpoolId`}
																name={`directCarpoolId`}
																label={<L p={p} t={`My carpool`}/>}
																value={directCarpoolId || ''}
																options={myCarpools || []}
																className={styles.moreBottomMargin}
																height={`medium`}
																required={true}
																whenFilled={directCarpoolId}
																onChange={this.handleCarpoolRequestDirect}
																error={errorDirectCarpoolId}/>
												</div>
												<div className={styles.row}>
														<div>
																<InputText
																		id={'directEmailAddress'}
																		name={'directEmailAddress'}
																		value={directEmailAddress || ''}
																		label={<L p={p} t={`Person's email address (to be invited)`}/>}
																		size={"long"}
																		required={true}
																		whenFilled={directEmailAddress}
																		onChange={this.handleCarpoolRequestDirect}
																		onBlur={this.handleEmailAddressCheck}
																		error={errorDirectEmailAddress}/>
								            </div>
														{false && directEmailAddress &&
																<div className={isVerify ? emailAddressFound ? styles.green : styles.red : ''}>
																		{emailAddressFound ? <L p={p} t={`The email address was found`}/> : <L p={p} t={`The email address was not found`}/>}
																</div>
														}
														<div onClick={this.handleEmailAddressCheck} className={classes(styles.link, styles.row, styles.muchTop)}>
																<Icon pathName={isVerify ? emailAddressFound ? 'checkmark0' : 'cross_circle' : 'question_circle'}
																		className={styles.icon} premium={true} fillColor={isVerify ? emailAddressFound ? 'green' : 'red' : ''}/>
																<div className={globalStyles.link}><L p={p} t={`Verify`}/></div>
														</div>
												</div>
												<div>
														<InputText
																id={'directComment'}
																name={'directComment'}
																value={directComment || ''}
																label={<L p={p} t={`Comment (optional)`}/>}
																size={"long"}
																onChange={this.handleCarpoolRequestDirect}/>
						            </div>
												<div className={styles.checkboxPosition}>
														<Checkbox
																id={`directAllowAddress`}
																label={<L p={p} t={`Allow my address to be shown in a Google Maps link`}/>}
																checked={directAllowAddress}
																onClick={this.toggleDirectAllowAddress}
																labelClass={styles.filterList}
																className={styles.checkbox}
																required={true}
																whenFilled={directAllowAddress}
																error={errorDirectAllowAddress} />
												</div>
												<div className={styles.rowRight}>
														<div className={classes(globalStyles.link, styles.closePosition)} onClick={this.handleExpansionChange('panel1')}>Close</div>
						                <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} disabled={!(isVerify && emailAddressFound && directEmailAddress)} className={styles.submitButton}
																		onClick={isVerify && emailAddressFound && directEmailAddress ? this.handleAddCarpoolRequestDirect : () => {}}/>
						            </div>
										</div>
								</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleExpansionChange('panel2')}>
								<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
										<div className={styles.row}>
												<Icon pathName={'plus'} premium={false} className={styles.icon} fillColor={'green'}/>
												<span className={globalStyles.link}><L p={p} t={`Add a new open request?`}/></span>
										</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
										<div>
												<div>
														<SelectSingleDropDown
																id={`carpoolAreaId`}
																name={`carpoolAreaId`}
																label={<L p={p} t={`Area name`}/>}
																value={carpoolRequest.carpoolAreaId || ''}
																options={carpool.carpoolAreas || []}
																className={styles.moreBottomMargin}
																height={`medium`}
																onChange={this.handleCarpoolRequest}
																error={errorCarpoolAreaId}/>
												</div>
												<div className={styles.rowWrap}>
														<div className={classes(globalStyles.instructionsBigger, styles.muchMoreTop)}>
								                <L p={p} t={`Can't find your area?`}/>
								            </div>
														<div className={classes(globalStyles.linkSmall, styles.muchMoreTop)} onClick={this.toggleNewAreaControls}>
														  	<L p={p} t={`Add a new area`}/>
														</div>
												</div>
												<hr/>
												{addNewArea &&
													<div className={styles.row}>
															<InputText
																	id={'areaName'}
																	name={'areaName'}
																	value={carpoolRequest.areaName || ''}
																	label={<L p={p} t={`New area name`}/>}
																	size={"medium"}
																	onChange={this.handleCarpoolRequest}/>
															<InputText
																	id={'description'}
																	name={'description'}
																	value={carpoolRequest.description || ''}
																	label={<L p={p} t={`Area description (optional)`}/>}
																	size={"long"}
																	onChange={this.handleCarpoolRequest}/>
													</div>

												}
												{myCarpools && myCarpools.length > 0 &&
														<div>
																<SelectSingleDropDown
																		id={`carpoolId`}
																		name={`carpoolId`}
																		label={<L p={p} t={`My carpool (optional)`}/>}
																		value={carpoolRequest.carpoolId || ''}
																		options={myCarpools || []}
																		className={styles.moreBottomMargin}
																		height={`medium`}
																		onChange={this.handleCarpoolRequest}/>
														</div>
												}
												<div>
														<InputText
																id={'seatsAvailable'}
																name={'seatsAvailable'}
																value={carpoolRequest.seatsAvailable && carpoolRequest.seatsAvailable !== 0 ? carpoolRequest.seatsAvailable : ''}
																label={<L p={p} t={`Seats vacant in my car`}/>}
																size={"super-short"}
																numberOnly={true}
																onChange={this.handleCarpoolRequest}
																required={true}
																whenFilled={carpoolRequest.seatsAvailable}
																error={errorSeats}/>
						            </div>
												<div>
														<InputText
																id={'seatsNeeded'}
																name={'seatsNeeded'}
																value={carpoolRequest.seatsNeeded && carpoolRequest.seatsNeeded !== 0 ? carpoolRequest.seatsNeeded : ''}
																label={<L p={p} t={`Number of seats I need for my students when others drive.`}/>}
																size={"super-short"}
																numberOnly={true}
																required={true}
																whenFilled={carpoolRequest.seatsNeeded}
																onChange={this.handleCarpoolRequest}/>
						            </div>
												<div className={classes(globalStyles.multiSelect, styles.moreTop)}>
														<CheckboxGroup
																name={'canDropOffDays'}
																options={daysOfWeek || []}
																horizontal={true}
																onSelectedChanged={this.handleSelectedCanDropOffDays}
																label={<L p={p} t={`I can drop-off on days:`}/>}
																selected={carpoolRequest.canDropOffDays}
																labelClass={styles.checkboxLabel}
																error={errorDropOffOrPickUp}/>
												</div>
												<div className={globalStyles.multiSelect}>
														<CheckboxGroup
																name={'canPickUpDays'}
																options={daysOfWeek || []}
																horizontal={true}
																onSelectedChanged={this.handleSelectedCanPickUpDays}
																label={<L p={p} t={`I can pick-up on days:`}/>}
																labelClass={styles.checkboxLabel}
																selected={carpoolRequest.canPickUpDays}/>
												</div>
												<div>
														<InputText
																id={'comment'}
																name={'comment'}
																value={carpoolRequest.comment || ''}
																label={<L p={p} t={`Comment (optional)`}/>}
																size={"long"}
																onChange={this.handleCarpoolRequest}/>
						            </div>
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
														<div className={classes(globalStyles.link, styles.closePosition)} onClick={this.handleExpansionChange('panel1')}><L p={p} t={`Close`}/></div>
														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
						            </div>
										</div>
								</ExpansionPanelDetails>
						</ExpansionPanel>
						<div className={classes(styles.moreTop, styles.classification)}>
								Direct Requests
						</div>
						<div className={classes(styles.moreTop, styles.scrollHorizontal)}>
		            <EditTable labelClass={styles.tableLabelClass} headings={headingsDirect}
		                data={dataDirect} noCount={true} firstColumnClass={styles.firstColumnClass}
		                sendToReport={this.handlePathLink} isFetchingRecord={isFetchingRecord}/>
						</div>
						<div className={classes(styles.moreTop, styles.classification)}>
								Open Requests
						</div>
						<div>
								<div className={styles.moreBottom}>
										<SelectSingleDropDown
												id={`filterCarpoolAreaId`}
												name={`filterCarpoolAreaId`}
												label={<L p={p} t={`Filter search on areas`}/>}
												value={filterCarpoolAreaId || ''}
												options={filterCarpoolAreasMinus || []}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleFilterCarpoolArea}/>
									</div>
									{filterCarpoolAreas && filterCarpoolAreas.length > 0 &&
											<div className={styles.rowWrap}>
													<div>
															{filterCarpoolAreas.map((m, i) =>
																	<div key={i} className={styles.row}>
																			<div onClick={(event) => this.handleFilterCarpoolArea(null, m.carpoolAreaId)}>
																					<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
																			</div>
																			<div className={styles.filterList}>{m.areaName}</div>
																	</div>
															)}
													</div>
													<div className={styles.checkboxPosition}>
															<Checkbox
																	id={`checkedSendEmail`}
																	label={<L p={p} t={`Email me when a new carpool request is made on my chosen area(s)`}/>}
																	checked={checkedSendEmail}
																	onClick={this.toggleSendEmailFilter}
																	labelClass={styles.filterList}
																	className={styles.checkbox} />
													</div>
											</div>
									}
						</div>
						<div className={classes(styles.moreTop, styles.scrollHorizontal)}>
		            <EditTable labelClass={styles.tableLabelClass} headings={headingsOpen}
		                data={dataOpen} noCount={true} firstColumnClass={styles.firstColumnClass}
		                sendToReport={this.handlePathLink} isFetchingRecord={isFetchingRecord}/>
						</div>
            <hr />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this carpool request?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this carpool request?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_requests &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Carpool Area has requests`}/>}
										explainJSX={<L p={p} t={`This carpool area has requests pending from other drivers.  This carpool area cannot be deleted until the requests have been deleted or answered.`}/>}
										onClick={this.handleShowUsedInClose}/>
            }
						{isShowingModal_description &&
                <MessageModal handleClose={this.handleDescriptionClose} heading={areaName}
                   explain={description} onClick={this.handleDescriptionClose} />
            }
						{isShowingModal_message &&
                <AnnouncementModal handleClose={this.handleMessageClose} onDelete={this.handleRemoveOpen} setStudentsSelected={setStudentsSelected}
										personId={personId} messageFullThread={messageFullThread}/>
            }
						{isShowingModal_response &&
                <CarpoolRequestResponseModal handleClose={this.handleCarpoolRequestResponseClose} personId={personId} daysOfWeek={daysOfWeek}
										carpoolRequest={carpoolRequest} addCarpoolRequestResponse={addCarpoolRequestResponse} responseType={responseType}
										carpools={carpool.myCarpools}/>
            }
						{isShowingModal_newCarpoolLink &&
                <MessageModal handleClose={this.handleCarpoolCreateNewLinkClose} heading={<L p={p} t={`Invite new member to a carpool`}/>}
                   explainJSX={<L p={p} t={`You do not currently have a carpool created.  Before you can invite a new member to your carpool, you must first create a carpool.  Can I take you to that form now?`}/> }
									 isConfirmType={true}  onClick={this.handleCarpoolCreateNewLink} />
            }
						{isShowingModal_directDecline &&
                <MessageModal handleClose={this.handleDeclineDirectRequestClose} heading={<L p={p} t={`Decline Carpool Invitation`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to decline this carpool invitation?`}/> }
									 isConfirmType={true}  onClick={this.handleDeclineDirectRequest} />
            }
						{isShowingModal_directRemove &&
                <MessageModal handleClose={this.handleRemoveDirectRequestClose} heading={<L p={p} t={`Remove Direct Invitation`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this direct invitation?`}/> }
									 isConfirmType={true}  onClick={this.handleRemoveDirectRequest} />
            }
						{isShowingModal_directAccept &&
                <CarpoolAcceptRequestDirectModal handleClose={this.handleAcceptDirectRequestClose} personId={personId} daysOfWeekAll={daysOfWeekAll}
										carpoolRequestDirect={carpoolRequestDirect} acceptDirectRequest={acceptDirectRequest}
										toggleCarpoolRequestDirectCanDoDay={toggleCarpoolRequestDirectCanDoDay} />
            }
						{isShowingModal_accept &&
                <CarpoolAcceptRequestFinalModal handleClose={this.handleAcceptRequestFinalClose} personId={personId} daysOfWeekAll={daysOfWeekAll}
										carpoolRequestResponse={carpoolRequestResponse} acceptRequestFinal={this.handleAcceptRequestFinal}
										toggleCarpoolRequestFinalCanDoDay={toggleCarpoolRequestFinalCanDoDay} />
            }
						{isShowingModal_uninvite &&
                <MessageModal handleClose={this.handleUninviteRequestClose} heading={<L p={p} t={`Uninvite this Driver?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to uninvite this driver?`}/> } isConfirmType={true}
									 onClick={this.handleUninviteRequest} />
            }
      </div>
    );
  }
}
