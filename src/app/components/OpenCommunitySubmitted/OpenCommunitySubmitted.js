import React, {Component} from 'react';
import styles from './OpenCommunitySubmitted.css';
import classes from 'classnames';
import MessageModal from '../../components/MessageModal';
import WorkSummary from '../../components/WorkSummary';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          isShowingModal: false,
          deleteIndex: 0,
      }

      this.handleAlertClose = this.handleAlertClose.bind(this);
      this.handleAlertOpen = this.handleAlertOpen.bind(this);
      this.handleRemoveSubmitted = this.handleRemoveSubmitted.bind(this);
}

  handleRemoveSubmitted(workId, openCommunityEntryId) {
      const {personId, removeOpenCommunityEntry} = this.props;
      this.handleAlertClose();
      removeOpenCommunityEntry(personId, workId, openCommunityEntryId)
      this.setState({
          isShowingModal: false,
      });
  }

  handleAlertClose = () => this.setState({isShowingModal: false})
  handleAlertOpen = (deleteIndex) => this.setState({isShowingModal: true, deleteIndex})

  render() {
      let {personId, setWorkCurrentSelected, updateChapterComment, openCommunityFull,
            setToModifyRecord} = this.props;
      const {isShowingModal, deleteIndex} = this.state;

      let localOpenCommunity = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.personId === personId);

      return (
        <div className={styles.container}>
            {!localOpenCommunity || localOpenCommunity.length === 0 ? <span className={styles.noListMessage}>{`empty list`}<br/><br/></span> : ''}
            {localOpenCommunity && localOpenCommunity.length > 0 &&
                <Accordion allowMultiple={true}>
                    {localOpenCommunity.map((s, i) => {
                        return (
                          <AccordionItem title={s.title} isCurrentTitle={s.isCurrentWork} expanded={s.isExpanded} key={i}
                                  className={styles.accordionTitle}
                                  onTitleClick={() => setWorkCurrentSelected(personId, s.workId, s.chapterId_current, s.languageId_current, 'editReview')}
                                  removeOpenCommunity={() => this.handleAlertOpen(i)} modifyOpenCommunity={() => setToModifyRecord(s.openCommunityEntryId)}>
                              <WorkSummary summary={s} className={styles.workSummary} showIcons={true} personId={personId}
                                  setWorkCurrentSelected={setWorkCurrentSelected} showTitle={false} noShowCurrent={true}
                                  labelCurrentClass={styles.labelCurrentClass} indexKey={i} updateChapterComment={updateChapterComment}/>
                              {isShowingModal && deleteIndex === i &&
                                <MessageModal key={i*1000} handleClose={this.handleAlertClose} heading={<L p={p} t={`Remove this Open Community Entry?`}/>}
                                   explainJSX={<L p={p} t={`Are you sure you want to remove this open community entry?  You will not lose the edits or translations that have been completed.`}/>}
                                   isConfirmType={true} onClick={() => this.handleRemoveSubmitted(s.workId, s.openCommunityEntryId)} />
                              }
                          </AccordionItem>
                        );
                    })}
                </Accordion>
            }
        </div>
      );
   }
}
