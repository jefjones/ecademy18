import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import styles from './AnnouncementManageView.css';
const p = 'AnnouncementManageView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import MessageModal from '../../components/MessageModal';
import AnnouncementModal from '../../components/AnnouncementModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import moment from 'moment';

class AnnouncementManageView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isShowingModal_remove: false,
					isShowingModal_message: false,
					announcementId: '',
      }
    }

		handleRemoveClose = () => this.setState({isShowingModal_remove: false})
    handleRemoveOpen = (announcementId) => this.setState({isShowingModal_remove: true, announcementId })
    handleRemove = () => {
				const {personId, removeAnnouncementAdmin} = this.props;
				const {announcementId} = this.state;
        removeAnnouncementAdmin(personId, announcementId);
        this.handleRemoveClose();
    }

		handleMessageClose = () => this.setState({isShowingModal_message: false})
    handleMessageOpen = (announcementId) => this.setState({isShowingModal_message: true, announcementId })

    render() {
      const {announcements, setStudentsSelected} = this.props;
      const {isShowingModal_remove, isShowingModal_message, announcementId} = this.state;

      let headings = [{}, {}, {label: <L p={p} t={`Date`}/>}, {label: <L p={p} t={`Subject`}/>}, {label: <L p={p} t={`Message`}/>}];
      let data = announcements && announcements.length > 0
          ?  announcements.map((m, i) => {
                return [
										{ value: <a onClick={() => this.handleRemoveOpen(m.announcementId)} className={styles.remove}><L p={p} t={`remove`}/></a>},
                    { value: <a onClick={() => browserHistory.push('/announcementEdit/' + m.announcementId)} className={styles.editLink}><L p={p} t={`edit`}/></a>},
										{ id: m.personId, value: <a onClick={() => this.handleMessageOpen(m.announcementId)} className={styles.link}>{moment(m.sendToDateTime).format('D MMM YYYY')}</a>},
										{ id: m.personId, value: <a onClick={() => this.handleMessageOpen(m.announcementId)} className={classes(styles.link, styles.linkBold)}>{m.subject}</a>},
										{ id: m.personId, value: <a onClick={() => this.handleMessageOpen(m.announcementId)} className={styles.link}>{m.message.length> 50 ? m.message.substring(0,50) + '...' : m.message}</a>},
                ]})
          : [[{},{value: 'no messages found'}]]


			let subject = '';
			let message = '';

			if (announcementId) {
					let announcement = announcements && announcements.length > 0 && announcements.filter(m => m.announcementId === announcementId)[0];
					if (announcement && announcement.announcementId) {
							subject = announcement.subject;
							message = announcement.message;
					}
			}

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  	<L p={p} t={`Manage Announcements`}/>
                </div>
								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
            </div>
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this announcement?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this announcement and all of its recipients?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
						{isShowingModal_message &&
                <AnnouncementModal handleClose={this.handleMessageClose} onDelete={this.handleRemoveOpen} subject={subject} message={message}
										announcementList={announcements} announcementId={announcementId} setStudentsSelected={setStudentsSelected}/>
            }
            <OneFJefFooter />
        </div>
    )};
}

export default AnnouncementManageView;
