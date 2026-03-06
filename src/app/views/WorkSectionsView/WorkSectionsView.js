import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './WorkSectionsView.css';
const p = 'WorkSectionsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import classes from 'classnames';
import WorkSummary from '../../components/WorkSummary';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';

class WorkSectionView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chapterToSplit: 0,
        };

        this.changeSequence = this.changeSequence.bind(this);
        this.handleSplitChapter = this.handleSplitChapter.bind(this);
        this.handleChapterUpdate = this.handleChapterUpdate.bind(this);
    }

    handleSplitChapter(event) {
        const {setWorkCurrentSelected, personId, workSummary} = this.props;
        event.target.value && setWorkCurrentSelected(personId, workSummary.workId, event.target.value, workSummary.languageId_current, "/splitChapter");
    }

    handleChapterUpdate(event) {
        const {setWorkCurrentSelected, personId, workSummary} = this.props;
        event.target.value && setWorkCurrentSelected(personId, workSummary.workId, event.target.value, workSummary.languageId_current, "/addOrUpdateChapter/" + workSummary.chapterId_current);
    }

    changeSequence(props, chapterId, event) {
        //If you use the chapterId from the props, it seems to only send the first chapterId.
        const {onChangeSequence, personId, workSummary} = props;
        onChangeSequence(personId, workSummary.workId, chapterId, event.target.value);
    }

    render() {
        const {personId, setWorkCurrentSelected, deleteWork, deleteChapter, sectionSummaries=[], workSummary,
                updateChapterDueDate, updateChapterComment, updatePersonConfig, personConfig} = this.props;

        const {chapterToSplit} = this.state;

        return (
            <div className={styles.container}>
                <div className={globalStyles.pageTitle}>
                    <L p={p} t={`Document Sections (or Chapters)`}/>
                </div>
                <Accordion allowMultiple={true} noShowExpandAll={true}>
                    <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false}
                            className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                            showAssignWorkToEditor={false} personId={personId} workSummary={workSummary}
                            setWorkCurrentSelected={setWorkCurrentSelected}
                            deleteWork={deleteWork} deleteChapter={deleteChapter}>
                        <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={false} showTitle={false}
                            setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                            updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}/>
                    </AccordionItem>
                </Accordion>
                <hr />
                <ul className={styles.unorderedList}>
                    <li><Link to={'/addOrUpdateChapter'} className={styles.menuItem}><L p={p} t={`Add a new section`}/></Link></li>
                    <li><Link to={'/mergeChapters'} className={styles.menuItem}><L p={p} t={`Merge two sections`}/></Link></li>
                    <li>
                        <div className={styles.selectListClass}>
                            <SelectSingleDropDown
                                value={chapterToSplit}
                                options={workSummary.chapterOptions}
                                label={<L p={p} t={`Split section`}/>}
                                error={''}
                                height={`short`}
                                onChange={this.handleSplitChapter} />
                        </div>
                    </li>
                    <li>
                        <div className={styles.selectListClass}>
                            <SelectSingleDropDown
                                value={''}
                                options={workSummary.chapterOptions}
                                label={<L p={p} t={`Name and settings update`}/>}
                                error={''}
                                height={`short`}
                                onChange={this.handleChapterUpdate} />
                        </div>
                    </li>
                </ul>
                <hr />
                {!sectionSummaries || sectionSummaries.length === 0 ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
                {sectionSummaries &&
                    <Accordion allowMultiple={true}>
                        {sectionSummaries.map((s, i) => {
                            return (
                              <AccordionItem title={s.title} expanded={s.isExpanded} key={s.chapterId} indexKey={s.chapterId}
                                  className={classes(styles.accordionTitle, s.isCurrentWork ? styles.isCurrentWork : '')}
                                  onTitleClick={() => setWorkCurrentSelected(personId, s.workId, s.chapterOptions[i].chapterId, s.languageId_current, 'editReview')}
                                  updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                                      <WorkSummary key={i} summary={s} className={styles.workSummary} showIcons={true} personId={personId} noShowSection={true}
                                          setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} showTitle={false} showEdit={true}
                                          labelCurrentClass={styles.labelCurrentClass} deleteChapter={deleteChapter} noShowCurrent={true}
                                          onChangeSequence={(event) => this.changeSequence(this.props, s.chapterId, event)} chapterId={s.chapterOptions[i].chapterId}
                                          updateChapterDueDate={updateChapterDueDate} showSequence={true} updateChapterComment={updateChapterComment}
                                          updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                              </AccordionItem>
                            );
                        })}
                    </Accordion>
                }
            </div>
        )
    }
}

export default WorkSectionView;
