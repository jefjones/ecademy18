import React, {Component} from 'react';
import styles from './OpenCommunityCommittedButtons.css';
import MessageModal from '../MessageModal';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          isShowingModal_uncommit: false,
      }

      this.handleUncommitClick = this.handleUncommitClick.bind(this);
      this.handleUncommitAlertClose = this.handleUncommitAlertClose.bind(this);
      this.handleUncommitAlertOpen = this.handleUncommitAlertOpen.bind(this);
  }

  handleUncommitClick() {
      const {personId, uncommitOpenCommunityEntry, openCommunityEntry} = this.props;
      uncommitOpenCommunityEntry(personId, openCommunityEntry.openCommunityEntryId);
      this.handleUncommitAlertClose();
  }

  handleUncommitAlertClose = () => this.setState({isShowingModal_uncommit: false})
  handleUncommitAlertOpen = () => this.setState({isShowingModal_uncommit: true})

  render() {
      const {isShowingModal_uncommit} = this.state;

      return (
        <div className={styles.container}>
            <div className={styles.buttonPlace}>
                <a onClick={this.handleUncommitAlertOpen} className={styles.removeButton}>
                    <L p={p} t={`Discontinue`}/>
                </a>
            </div>
             {isShowingModal_uncommit &&
                 <MessageModal handleClose={this.handleUncommitAlertClose} heading={<L p={p} t={`Discontinue Editing this Document?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to discontinue editing this document?`}/>} isConfirmType={true}
                     onClick={this.handleUncommitClick}/>
              }
        </div>
      );
   }
}
