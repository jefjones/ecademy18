import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './MessagesAndRemindersView.css';
const p = 'MessagesAndRemindersView';
import L from '../../components/PageLanguage';
import AnnouncementList from '../../components/AnnouncementList';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class MessagesAndRemindersView extends Component {
    constructor(props) {
        super(props);

        this.state = {
					 typeAnnouncementList: 'recipient', //Other options are 'sentBy' and 'deleted'
					 chosenTab: 'inbox',
					 messageSearch: '',
        }
    }

		componentDidMount() {
				const {personId, getCountsMessages} = this.props;
				this.getAnnouncements();
				this.setState({ countsTimerId: setInterval(() => getCountsMessages(personId), 30000) });
		}

		componentWillUnmount() {
				clearInterval(this.state.recipientTimerId);
				clearInterval(this.state.senderTimerId);
				clearInterval(this.state.discardedTimerId);
				clearInterval(this.state.countsTimerId);
		}

		changeMessageSearch = ({target}) => {
	      let messageSearch = this.state.essageSearch;
				messageSearch = target.value.toLowerCase();
	      this.setState({ messageSearch });
	  }

		getSentBy = () => {
				const {getAnnouncementsSentBy, clearAnnouncementList, personId} = this.props;
				clearAnnouncementList();
				getAnnouncementsSentBy(personId);
				clearInterval(this.state.recipientTimerId);
				clearInterval(this.state.senderTimerId);
				clearInterval(this.state.discardedTimerId);
				this.setState({
						typeAnnouncementList: 'sentBy',
						chosenTab: 'sent',
						senderTimerId: setInterval(() => getAnnouncementsSentBy(personId), 5000),
						recipientTimerId: null,
						discardedTimerId: null,
				});
		}

		getDeletedAnnouncements = () => {
				const {getAnnouncementsDeleted, clearAnnouncementList, personId} = this.props;
				clearAnnouncementList();
				getAnnouncementsDeleted(personId);
				clearInterval(this.state.recipientTimerId);
				clearInterval(this.state.senderTimerId);
				clearInterval(this.state.discardedTimerId);
				this.setState({
						typeAnnouncementList: 'deleted',
						chosenTab: 'deleted',
						discardedTimerId: setInterval(() => getAnnouncementsDeleted(personId), 5000),
						recipientTimerId: null,
						senderTimerId: null,
				});
		}

		getAnnouncements = () => {
				const {getAnnouncementsRecipient, clearAnnouncementList, personId} = this.props;
				clearAnnouncementList();
				getAnnouncementsRecipient(personId);
				clearInterval(this.state.recipientTimerId);
				clearInterval(this.state.senderTimerId);
				clearInterval(this.state.discardedTimerId);
				this.setState({
						typeAnnouncementList: 'recipient',
						chosenTab: 'inbox',
						recipientTimerId: setInterval(() => getAnnouncementsRecipient(personId), 5000),
						senderTimerId: null,
						discardedTimerId: null,
				});
		}

    render() {
         const {personId, setAsSeenByRecipient, announcementList, announcementsSentBy, announcementsDeleted, removeAnnouncement, setStudentsSelected,
					 			companyConfig={}, counts, getMessageSingleFullThread, messageFullThread, myFrequentPlaces, setMyFrequentPlace, fetchingRecord} = this.props;
         const {messageSearch, chosenTab, typeAnnouncementList} = this.state;

				let showList = typeAnnouncementList === 'sentBy'
						? announcementsSentBy
						: typeAnnouncementList === 'deleted'
								? announcementsDeleted
								: announcementList;

        return (
            <div className={styles.container}>
								<div className={styles.classification}>Messages and Reminders</div>
								<div>
										<div className={styles.row}>
												<div onClick={this.getAnnouncements} className={classes(styles.tabs, (chosenTab === 'inbox' && styles.tabChoice))}>
														<Icon pathName={'inbox0'} premium={true} fillColor={chosenTab === 'inbox' ? '' : 'white'}/>
														<div className={classes(styles.row, (chosenTab === 'inbox' ? '' : styles.whiteText))}>
																<L p={p} t={`INBOX`}/>
																<div className={chosenTab === 'inbox' ? styles.count : styles.whiteCount}>{counts.recipient}</div>
														</div>
												</div>
												<div onClick={this.getSentBy}  className={classes(styles.tabs, (chosenTab === 'sent' && styles.tabChoice))}>
														<Icon pathName={'sent'} premium={true} fillColor={chosenTab === 'sent' ? '' : 'white'}/>
														<div className={classes(styles.row, (chosenTab === 'sent' ? '' : styles.whiteText))}>
																<L p={p} t={`SENT`}/>
																<div className={chosenTab === 'sent' ? styles.count : styles.whiteCount}>{counts.sender}</div>
														</div>
												</div>
												<div onClick={this.getDeletedAnnouncements}  className={classes(styles.tabs, (chosenTab === 'deleted' && styles.tabChoice))}>
														<Icon pathName={'trash2'} premium={true} fillColor={chosenTab === 'deleted' ? '' : 'white'} />
														<div className={classes(styles.row, (chosenTab === 'deleted' ? '' : styles.whiteText))}>
																<L p={p} t={`DISCARDED`}/>
																<div className={chosenTab === 'deleted' ? styles.count : styles.whiteCount}>{counts.discarded}</div>
														</div>
												</div>
										</div>
										<div className={styles.row}>
												<Link to={`/announcementEdit`} className={classes(styles.row, styles.menuItem, styles.link, styles.moreWidith)}>
														<Icon pathName={'pencil0'} premium={true} className={styles.iconRight}/>
														<L p={p} t={`Compose`}/>
												</Link>
												<div>
														<Icon pathName={'magnifier'} premium={true} className={styles.iconRight}/>
												</div>
												<InputText
														id={`messageSearch`}
														name={`messageSearch`}
														size={"short"}
														label={''}
														value={messageSearch || ''}
														onChange={this.changeMessageSearch}/>
										</div>
										<div className={styles.scrollable}>
												<AnnouncementList companyConfig={companyConfig} mainmenuVersion={true} setAsSeenByRecipient={setAsSeenByRecipient}
														announcementList={showList} announcementsSentBy={announcementsSentBy} listType={typeAnnouncementList} messageSearch={messageSearch}
														removeAnnouncement={removeAnnouncement} personId={personId} setStudentsSelected={setStudentsSelected}
														isFetchingRecord={fetchingRecord.announcementList} getMessageSingleFullThread={getMessageSingleFullThread}
														messageFullThread={messageFullThread}/>
										</div>
								</div>
								<div className={styles.fullWidth}>
										<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Messages and Reminders`}/>} path={'messagesAndReminders'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
								</div>
								<OneFJefFooter />
            </div>
        )
    };
}
