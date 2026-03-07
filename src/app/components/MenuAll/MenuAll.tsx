import * as styles from './MenuAll.css'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Icon from '../Icon/Icon'
import newBook from './Assets/bookicon_new.png'
import newDocument from './Assets/Resumeicon_new.png'


export default ({className=""}) => {
    return (
        <div className={classNames(styles.menuContainer)}>
            <div className={styles.linkContainer}><Link to={`/MyWorkEntryAddNew`} className={styles.option}><img className={styles.image} src={newBook} alt="Add new book"/>Add new Book</Link></div>
            <div className={styles.linkContainer}><Link to={`/MyWorkEntryAddNew`} className={styles.option}><img className={styles.image} src={newDocument} alt="Add new document"/>Add new Document</Link></div>
            <div className={styles.linkContainer}><hr className={styles.line} /></div>

            <div className={styles.subHeader}>Editors and Access</div>
            <div className={styles.linkContainer}><Link to={`/MyWorkEditorAccessRepWork`} className={styles.option}><Icon pathName={`key2`} className={styles.icon}/>Give access to my editors</Link></div>
            <div className={styles.linkContainer}><Link to={`/FriendInviteEdit`} className={styles.option}><Icon pathName={`user_plus`} className={styles.icon}/>Invite an editor or writer</Link></div>
            <div className={styles.linkContainer}><Link to={`/GroupAddEdit`} className={styles.option}><Icon pathName={`users`} className={styles.icon}/>Add a group</Link></div>
            <div className={styles.linkContainer}><Link to={`/GroupSearchEdit`} className={styles.option}><Icon pathName={`zoom_in`} className={styles.icon}/>Search for a group</Link></div>
            <div className={styles.linkContainer}><hr className={styles.line} /></div>

            <div className={styles.subHeader}>Bidding Work</div>
            <div className={styles.linkContainer}><Link to={`/BidRequestWorkChoice`} className={styles.option}><Icon pathName={`alarm`} className={styles.icon}/>Enter a new bid request</Link></div>
            <div className={styles.linkContainer}><Link to={`/BidRequestReport`} className={styles.option}><Icon pathName={`stats_bars`} className={styles.icon}/>Bid Request Report</Link></div>
            <div className={styles.linkContainer}><Link to={`/BidRequestSearch`} className={styles.option}><Icon pathName={`coin_dollar`} className={styles.icon}/>Search and Bid</Link></div>
            <div className={styles.linkContainer}><hr className={styles.line} /></div>

            <div className={styles.subHeader}>Publishing</div>
            <div className={styles.linkContainer}><Link to={`/Landing_bookstore`} className={styles.option}><Icon pathName={`books`} className={styles.icon}/>Bookstore</Link></div>
            <div className={styles.linkContainer}><Link to={`/MyWorkBookstore_report`} className={styles.option}><Icon pathName={`info`} className={styles.icon}/>My bookstore entries</Link></div>
            <div className={styles.linkContainer}><Link to={`/MyWorkReaderAudio_assign`} className={styles.option}><Icon pathName={`film`} className={styles.icon}/>My Reader+Audio entries</Link></div>
            <div className={styles.linkContainer}><Link to={`/OrderPrinting`} className={styles.option}><Icon pathName={`file_text2`} className={styles.icon}/>Order printing</Link></div>
            <div className={styles.linkContainer}><hr className={styles.line} /></div>

            <div className={styles.subHeader}>Advertising</div>
            <div className={styles.linkContainer}><Link to={`/Advertise_location`} className={styles.option}><Icon pathName={`newspaper`} className={styles.icon}/>My advertisement entries</Link></div>
        </div>
    )
}
