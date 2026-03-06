import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './ChapterMergeView.css';
const p = 'ChapterMergeView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import WorkSummary from '../../components/WorkSummary';
import tapOrClick from 'react-tap-or-click';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';

class ChapterMergeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            firstChapterId: 0,
            secondChapterId: 0,
        };

        this.processForm = this.processForm.bind(this);
        this.changeFirstChoice = this.changeFirstChoice.bind(this);
        this.changeSecondChoice = this.changeSecondChoice.bind(this);
    }

    changeFirstChoice(value) {
        this.setState({
            firstChapterId: value
        });
    }

    changeSecondChoice(value) {
        this.setState({
            secondChapterId: value
        });
    }

    processForm(isFileUpload, event) {
        const {mergeChapters, personId, workId} = this.props;
        const {firstChapterId, secondChapterId} = this.state;
        event && event.preventDefault();
        let hasError = false;

        if (!firstChapterId || !secondChapterId) {
            this.setState({error: <L p={p} t={`Please choose both a first and second chapter to merge.`}/>});
            hasError = true;
        }

        if (!hasError) {
            mergeChapters(personId, workId, secondChapterId, firstChapterId);
        }
    }

    render() {
        let {error, firstChapterId, secondChapterId} = this.state;
        let {chapterOptions, workSummary, personId, setWorkCurrentSelected, deleteWork, deleteChapter, updateChapterDueDate,
                updateChapterComment, updatePersonConfig, personConfig} = this.props;

        return (
            <section className={styles.container}>
                <div className={styles.titleLine}>
                    <span className={globalStyles.pageTitle}>
                        <L p={p} t={`Merge Sections/Chapters`}/>
                    </span>
                </div>
                <Accordion allowMultiple={true} noShowExpandAll={true}>
                    <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false} className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                            showAssignWorkToEditor={false} personId={personId} workSummary={workSummary} setWorkCurrentSelected={setWorkCurrentSelected}
                            deleteWork={deleteWork} deleteChapter={deleteChapter} updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                        <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={false} showTitle={false}
                            setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                            updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                            updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                    </AccordionItem>
                </Accordion>
                <div className={styles.buttonPlace}>
                    <a onClick={() => this.processForm()} className={styles.buttonStyle}><L p={p} t={`Submit`}/></a>
                </div>
                {error && <div className={styles.alertMessage}>{error}</div>}
                <hr />
                <table className={styles.tableStyle}>
                    <thead>
                        <tr>
                            <td><span className={classes(styles.tableHeader, styles.sectionName)}><L p={p} t={`Section Name`}/></span></td>
                            <td><span className={styles.tableHeader}><L p={p} t={`First`}/></span></td>
                            <td><span className={styles.tableHeader}><L p={p} t={`Second`}/></span></td>
                        </tr>
                    </thead>
                    <tbody>
                    {chapterOptions.map((m, i) =>
                        <tr key={i} className={styles.lineSpace}>
                            <td>
                                <span className={styles.tableData}>{`(` + m.chapterNbr + `) ` + m.name}</span>
                            </td>
                            <td>
                                <span className={classes(styles.tableData, styles.radioButton)}>
                                    <input type="radio" name={`firstChoice`} value={m.id} checked={firstChapterId === m.id ? true : false}
                                        className={this.radioButton} {...tapOrClick(() => this.changeFirstChoice(m.id))}/>
                                </span>
                            </td>
                            <td>
                                <span className={classes(styles.tableData, styles.radioButton)}>
                                    <input type="radio" name={`secondChoice`} value={m.id} checked={secondChapterId === m.id ? true : false}
                                        className={this.radioButton} {...tapOrClick(() => this.changeSecondChoice(m.id))}/>
                                </span>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        );
    }
}

export default ChapterMergeView;
