import React, {Component} from 'react';
import styles from './OpenCommunityCommitted.css';
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
          isShowingModal_uncommit: false,
          deleteIndex: 0,
      }

      this.handleUncommitAlertClose = this.handleUncommitAlertClose.bind(this);
      this.handleUncommitAlertOpen = this.handleUncommitAlertOpen.bind(this);
      this.handleUncommitClick = this.handleUncommitClick.bind(this);
}

handleUncommitClick() {
    const {uncommitOpenCommunityEntry, openCommunityEntry} = this.props;
    uncommitOpenCommunityEntry(openCommunityEntry.personId, openCommunityEntry.openCommunityEntryId);
    this.handleUncommitAlertClose();
    this.setState({
        selectedLanguages: [],
        nativeLanguageEdit: false,
    });
}

handleUncommitAlertClose = () => this.setState({isShowingModal_uncommit: false})
handleUncommitAlertOpen = () => this.setState({isShowingModal_uncommit: true})

render() {
      let {personId, setWorkCurrentSelected, updateChapterComment, openCommunityFull, uncommitOpenCommunityEntry} = this.props;
      const {isShowingModal_uncommit, deleteIndex} = this.state;
      let localOpenCommunity = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.hasCommittedOpenCommunity);

      return (
        <div className={styles.container}>
            {!localOpenCommunity || localOpenCommunity.length === 0 ? <span className={styles.noListMessage}>{`empty list`}<br/><br/></span> : ''}
            {localOpenCommunity && localOpenCommunity.length > 0 &&
                <Accordion allowMultiple={true}>
                    {localOpenCommunity.map((s, i) => {
                        return (
                          <AccordionItem title={s.title} isCurrentTitle={s.isCurrentWork} expanded={s.isExpanded} key={i} showCommitted={true}
                                  className={styles.accordionTitle} uncommitOpenCommunityEntry={uncommitOpenCommunityEntry} openCommunityEntry={s}
                                  onTitleClick={() => setWorkCurrentSelected(personId, s.workId, s.chapterId_current, s.languageId_current, 'editReview')}>
                              <WorkSummary summary={s} className={styles.workSummary} showIcons={true} personId={personId}
                                  setWorkCurrentSelected={setWorkCurrentSelected} showTitle={false} noShowCurrent={true}
                                  labelCurrentClass={styles.labelCurrentClass} indexKey={i}
                                  updateChapterComment={updateChapterComment}/>
                              {isShowingModal_uncommit && deleteIndex === i &&
                                  <MessageModal key={i*1000} handleClose={this.handleUncommitAlertClose} heading={<L p={p} t={`Discontinue Editing this Document?`}/>}
                                      explainJSX={<L p={p} t={`Are you sure you want to discontinue editing this document?`}/>} isConfirmType={true}
                                      onClick={this.handleUncommitClick}/>
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
