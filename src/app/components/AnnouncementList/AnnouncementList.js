import React, {Component} from 'react';
import {browserHistory} from 'react-router';
const p = 'component';
import L from '../../components/PageLanguage';
import styles from './AnnouncementList.css';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../EditTable';
import MessageModal from '../MessageModal';
import AnnouncementModal from '../AnnouncementModal';
import Icon from '../Icon';
import DateMoment from '../DateMoment';
import Checkbox from '../Checkbox';
import RecipientListModal from '../RecipientListModal';
import OneFJefFooter from '../OneFJefFooter';
import classes from 'classnames';
import {guidEmpty}  from '../../utils/guidValidate.js';
import {doSort} from '../../utils/sort.js';
import moment from 'moment';

class AnnouncementList extends Component {
    constructor(props) {
	      super(props);

	      this.state = {
						announcementId: '', //This is for the removal of an announcement
		        isShowingModal_remove: false,
						isShowingModal_removeMultiple: false,
						isShowingModal_message: false,
						isShowingModal_recipients: false,
						subject: '',
						message: '',
						multipleChecked: [],
						sortByHeadings: {
								sortField: '',
								isAsc: '',
								isNumber: ''
						}
	      }
    }

		componentDidMount() {
				//window.addEventListener('click', this.multipleChecking);
		}

		//It doesn't look lik the recipientPersonId is being used.
    handleRemoveOpen = (announcementId, recipientPersonId) => this.setState({isShowingModal_remove: true, announcementId, recipientPersonId })
		handleRemoveClose = () => this.setState({isShowingModal_remove: false})
    handleRemove = () => {
				const {personId, removeAnnouncement, listType} = this.props;
				const {announcementId, recipientPersonId} = this.state;
				//if listType is 'recipient' or 'deleted', then deleteType is single.  If listType is 'sentBy', then deleteType is 'all'
				let recipient = listType === 'recipient' || listType === 'deleted' ? personId : !recipientPersonId || recipientPersonId === guidEmpty ? personId : recipientPersonId;
        removeAnnouncement(personId, announcementId, recipient, listType, listType === 'sentBy' ? 'all' : 'single');
        this.handleRemoveClose();
				this.handleMessageClose();
    }

    handleRemoveMultipleOpen = () => this.setState({isShowingModal_removeMultiple: true })
		handleRemoveMultipleClose = () => this.setState({isShowingModal_removeMultiple: false})
    handleRemoveMultiple = () => {
				const {personId, removeAnnouncement, listType, announcementList} = this.props;
				const {multipleChecked} = this.state;
				//if listType is 'recipient' or 'deleted', then deleteType is single.  If listType is 'sentBy', then deleteType is 'all'
				multipleChecked && multipleChecked.length > 0 && multipleChecked.forEach(id => {
						let announcement = announcementList && announcementList.length > 0 && announcementList.filter(m => m.announcementId === id)[0];
						let recipientPersonId = announcement && announcement.recipients && announcement.recipients.length > 0 && announcement.recipients[0];
						let recipient = listType === 'recipient' || listType === 'deleted' ? personId : !recipientPersonId || recipientPersonId === guidEmpty ? personId : recipientPersonId;
		        removeAnnouncement(personId, id, recipient, listType, listType === 'sentBy' ? 'all' : 'single');
				})
				this.handleRemoveMultipleClose();
				this.handleMessageClose();
    }

    handleMessageOpen = (announcementId) => {
				const {getMessageSingleFullThread, setAsSeenByRecipient, personId} = this.props;
				setAsSeenByRecipient(personId, announcementId);
				getMessageSingleFullThread(announcementId);
				this.setState({isShowingModal_message: true, announcementId });
		}
		handleMessageClose = () => this.setState({isShowingModal_message: false})

		handleRecipientListOpen = (announcement, recipients) => this.setState({isShowingModal_recipients: true, announcement, recipients })
		handleStudentListClose = () => this.setState({isShowingModal_recipients: false })

		setColumnType = (announcement, announcementId, fromPersonFirstName, fromPersonLastName, recipients) => {
				const {listType} = this.props;
				return listType === 'sentBy'
						? <a onClick={() => this.handleRecipientListOpen(announcement, recipients)} className={styles.link}>{recipients.length !== 0 && recipients.length}</a>
						: <a onClick={() => this.handleMessageOpen(announcementId)} className={classes(styles.link, styles.linkBold)}>{fromPersonFirstName + ' ' + fromPersonLastName}</a>
		}

		resort = (field) => {
				let sortByHeadings = Object.assign({}, this.state.sortByHeadings);
				sortByHeadings.isAsc = sortByHeadings.sortField === field ? !sortByHeadings.isAsc : 'desc';
				sortByHeadings.isNumber = field === 'recipients' ? true : false;
				sortByHeadings.sortField = field;
				this.setState({ sortByHeadings })
		}

		isMultipleChecked = (announcementId) => {
				const {multipleChecked} = this.state;
				let isChecked = false;
				multipleChecked && multipleChecked.length > 0 && multipleChecked.forEach(id => { if (id === announcementId) isChecked = true; });
				return isChecked;
		}

		toggleCheckbox = (event, announcementId, index) => {
				//The event.target.name is a combination of the index and the announcementId.  The index is used to get the first click
				//	and the second click to check for the control key in order to select everything in between.

				//  If the firstClick is not filled in,
				//		 save the index of the firstClick
				//		 toggle the checkbox
				//  else the firstClick is filled in.
				//			if the control key is held down
				//				 get the secondClick index
				//				 if the secondClick is checked already
				//						uncheck everything from the firstClick to the secondClick
				//			   else
				//						check everything from the firstClick to the secondClick
				//			   end if
				//			   clear the firstClick
				//		  else
				//				 toggle the checkbox
				//			   set the firstClick to this index.
				//  end if
				const {announcementList} = this.props;
				const {firstClick} = this.state;
				let multipleChecked = Object.assign([], this.state.multipleChecked);

				if (!firstClick) {
						this.setState({ firstClick: index });
						this.toggleChosenAnnouncement(announcementId);
				} else {  //  else the firstClick is filled in.
						if (event.shiftKey) {
								let secondClick = index;
								let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(announcementId) : -1;
								let uncheckAll = false;
								if (indexChecked > -1) {
										uncheckAll = false;
								}
								let startIndex = secondClick >= firstClick ? firstClick : secondClick;
								let endIndex = secondClick <= firstClick ? firstClick : secondClick;
								announcementList && announcementList.length > 0 && announcementList.forEach((m, i) => {
										if (i >= startIndex && i <= endIndex) {
												if (uncheckAll) {
														let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(m.announcementId) : -1;
														if (indexChecked > -1) multipleChecked = multipleChecked.splice(indexChecked, 1);
												} else {
														let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(m.announcementId) : -1;
														if (indexChecked === -1) multipleChecked = multipleChecked ? multipleChecked.concat(m.announcementId) : [m.announcementId];
												}
										}
								})
								this.setState({ multipleChecked, firstClick: '' })

						} else {
								this.toggleChosenAnnouncement(announcementId);
								this.setState({ firstClick: index });
						}
				}
		}

		toggleChosenAnnouncement = (announcementId) => {
				let multipleChecked = Object.assign([], this.state.multipleChecked);
				let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(announcementId) : -1;
				multipleChecked = indexChecked > -1 ? multipleChecked.splice(indexChecked, 1) : multipleChecked ? multipleChecked.concat(announcementId) : [announcementId];
				this.setState({ multipleChecked })
		}

    render() {
      const {personId, mainmenuVersion, setStudentsSelected, listType='recipient', messageSearch, messageFullThread,
							isFetchingRecord} = this.props; //list types are recipient, sentBy, or deleted
			let announcementList = Object.assign([], this.props.announcementList); //Let this be mutable since there is a sort function below.
      const {isShowingModal_remove, isShowingModal_message, isShowingModal_recipients, announcementId, announcement, recipients,
							sortByHeadings, isShowingModal_removeMultiple, multipleChecked} = this.state;

			let recordCount = !announcementList || announcementList.length === 0 ? '' : announcementList.length;

			let headings = listType === 'sentBy'
					? [{label: recordCount, tightText: true, labelClass: styles.countLabel, colSpan: 2},
							{label: <L p={p} t={`remove`}/>, tightText: true, clickFunction: this.handleRemoveMultipleOpen, labelClass: styles.redLink },
							{label: <L p={p} t={`Date`}/>, tightText: true, clickFunction: () => this.resort('entryDate')},
							{label: <L p={p} t={`Recipients`}/>, tightText: true, clickFunction: () => this.resort('recipients')},
							{label: <L p={p} t={`Subject`}/>, tightText: true, clickFunction: () => this.resort('subject')},
							{label: <L p={p} t={`Message`}/>, tightText: true, clickFunction: () => this.resort('message')}]
					: [{label: recordCount, tightText: true, labelClass: styles.countLabel, colSpan: 2},
							{label: <L p={p} t={`remove`}/>, tightText: true, clickFunction: this.handleRemoveMultipleOpen, redColor: true },
							{label: <L p={p} t={`Date`}/>, tightText: true, clickFunction: () => this.resort('entryDate')},
							{label: <L p={p} t={`Sender`}/>, tightText: true, clickFunction: () => this.resort('fromPersonFirstName')},
							{label: <L p={p} t={`Subject`}/>, tightText: true, clickFunction: () => this.resort('subject')},
							{label: <L p={p} t={`Message`}/>, tightText: true, clickFunction: () => this.resort('message')}]

			if (messageSearch && announcementList && announcementList.length > 0) listType === 'sentBy'
					? announcementList = announcementList.filter(m => moment(m.entryDate).format("D MMM YYYY").toLowerCase().indexOf(messageSearch) > -1 || String(m.recipients).toLowerCase().indexOf(messageSearch) > -1 || m.subject.toLowerCase().indexOf(messageSearch) > -1 || m.message.toLowerCase().indexOf(messageSearch) > -1)
					: announcementList = announcementList.filter(m => moment(m.entryDate).format("D MMM YYYY").toLowerCase().indexOf(messageSearch) > -1 || m.fromPersonFirstName.toLowerCase().indexOf(messageSearch) > -1 || m.subject.toLowerCase().indexOf(messageSearch) > -1 || m.message.toLowerCase().indexOf(messageSearch) > -1)

			if (sortByHeadings && sortByHeadings.sortField) {
					announcementList = doSort(announcementList, sortByHeadings);
			}

			let data = announcementList && announcementList.length > 0 && announcementList.map((m, i) => {
					return [
							{ value: listType === 'sentBy' ? '' : <a onClick={() => {setStudentsSelected([m.fromPersonId], m.announcementId); browserHistory.push('/announcementEdit/reply/' + m.announcementId + '/' + m.fromPersonId + '/' + m.fromPersonFirstName + '/' + m.fromPersonLastName)}} className={styles.remove}><Icon pathName={'reply_arrow'} premium={true} className={styles.icon} fillColor={"#147EA7"}/></a>},
							{ value: <a onClick={() => this.handleRemoveOpen(m.announcementId, listType)} className={styles.remove}><Icon pathName={'cross_circle'} premium={true} className={styles.icon} fillColor={"maroon"}/></a>},
							{ value: <Checkbox id={m.announcementId} key={i} label={''} checked={this.isMultipleChecked(m.announcementId)} onClick={(event) => this.toggleCheckbox(event, m.announcementId, i)} className={styles.button}/>},
							{ value: <a onClick={() => this.handleMessageOpen(m.announcementId)} className={classes(styles.link, styles.row)}><DateMoment date={m.entryDate} format={'D MMM  h:mm a'} minusHours={0}/></a>},
							{ value: this.setColumnType(m, m.announcementId, m.fromPersonFirstName, m.fromPersonLastName, m.recipients)},
							{ value: <a onClick={() => this.handleMessageOpen(m.announcementId)} className={classes(styles.link, styles.linkBold)}>{m.subject}</a>},
							{ value: <a onClick={() => this.handleMessageOpen(m.announcementId)} className={styles.link}>{m.message.length> 50 ? m.message.substring(0,50) + '...' : m.message}</a>},
					]
			})

      return (
        <div className={styles.container}>
            <div className={mainmenuVersion ? '' : styles.marginLeft}>
								{!mainmenuVersion &&
		                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
		                  	{`Messages`}
		                </div>
								}
								{multipleChecked && multipleChecked.length > 0 &&
										<div className={classes(styles.row, styles.label)}>
												Messages that are checked:
												<div onClick={this.handleRemoveMultipleOpen} className={classes(styles.bigRedLink, styles.moreLeft)}>
														<L p={p} t={`remove`}/>
												</div>
										</div>
								}
								{data && data.length > 5 &&
										<div className={styles.instructions}>
												<L p={p} t={`To choose a range of delete checkboxes, click on the first checkbox and then hold the SHIFT key while you click on the checkbox that is the last one you want to delete.`}/>
												<L p={p} t={`All the checkboxes will be chosen in between.  Then click on the 'remove' label at the top of the list.`}/>
										</div>
								}
								<div className={styles.scrollable}>
										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} isFetchingRecord={isFetchingRecord}/>
								</div>
            </div>
						{!mainmenuVersion &&
            		<OneFJefFooter />
						}
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this message?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this message?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_removeMultiple &&
                <MessageModal handleClose={this.handleRemoveMultipleClose} heading={<L p={p} t={`Remove multiple messages?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove the ${multipleChecked.length} messages that have checkmarks next to them?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveMultiple} />
            }
						{isShowingModal_message &&
                <AnnouncementModal handleClose={this.handleMessageClose} onDelete={this.handleRemoveOpen} setStudentsSelected={setStudentsSelected}
										personId={personId} messageFullThread={messageFullThread}/>
            }
						{isShowingModal_recipients &&
								<RecipientListModal handleClose={this.handleStudentListClose} announcement={announcement} announcementId={announcementId}
										recipients={recipients} onDelete={this.handleRemoveOpen} />
						}
        </div>
    )};
}

export default AnnouncementList;
