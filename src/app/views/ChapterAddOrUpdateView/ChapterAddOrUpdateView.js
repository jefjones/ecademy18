import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './ChapterAddOrUpdateView.css';
const p = 'ChapterAddOrUpdateView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import InputText from '../../components/InputText';
import WorkSummary from '../../components/WorkSummary';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import OneFJefFooter from '../../components/OneFJefFooter';

class ChapterAddOrUpdateView extends Component {
    constructor(props) {
        super(props);
        const {chapter, chapterSequenceOptions} = props;

        this.state = {
            errors: {},
            chapter: {
                chapterId: chapter ? chapter.chapterId : '',
                name: chapter ? chapter.name : '',
                chapterNbr: chapterSequenceOptions.length,
                workStatusId: chapter ? chapter.workStatusId : 1,
                editSeverityId: chapter ? chapter.editSeverityId : 2,
                comment: chapter && chapter.authorComment ? chapter.authorComment.comment : '',
            }
        };

        this.processForm = this.processForm.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.changeChapter = this.changeChapter.bind(this);
    }

    componentDidMount() {
        //document.getElementById("name").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
    }

    changeChapter(event) {
        const field = event.target.name;
        const chapter = this.state.chapter;
        chapter[field] = event.target.value;

        this.setState({
            chapter
        });
    }

    handleEnterKey(event) {
        event.key === "Enter" && this.processForm();
    }

    processForm(isFileUpload, event) {
        const {addOrUpdateChapter, personId, workId} = this.props;
        const {chapter} = this.state;
        event && event.preventDefault();
        let errors = {};
        let hasError = false;
        let isUpdate = isFileUpload === "UPDATE" ? true : false;
        isFileUpload = isFileUpload === "UPDATE" ? false : isFileUpload;

        if (!chapter.name) {
            errors.name = <L p={p} t={`Chapter name is required.`}/>;
            hasError = true;
        }

        if (!hasError) {
            addOrUpdateChapter(personId, workId, chapter, isFileUpload, isUpdate);
        }
    }

    render() {
        let {errors, chapter} = this.state;
        let {chapterSequenceOptions, workStatusOptions, editSeverityOptions, params, workSummary, personId, setWorkCurrentSelected, //eslint-disable-line
                deleteWork, deleteChapter, updateChapterDueDate, updateChapterComment, updatePersonConfig, personConfig} = this.props;

        return (
            <section className={styles.container}>
                <div className={styles.titleLine}>
                    <span className={globalStyles.pageTitle}>
                        {params && params.chapterId ? <L p={p} t={`Update Section/Chapter`}/> : <L p={p} t={`Add New Section/Chapter`}/>}
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
                <hr />
                <ul className={styles.unorderedList}>
                    <li className={styles.menuItem}>
                        <span className={classes(styles.inputText, styles.lessBottom)}><L p={p} t={`Section/Chapter Name`}/></span><br/>
                        <InputText
                            size={"medium-long"}
                            name={"name"}
                            id={"name"}
                            value={chapter.name}
                            onChange={this.changeChapter}
                            onEnterKey={this.handleEnterKey}
                            inputClassName={styles.inputClassName}
                            labelClass={styles.labelClass}
                            error={errors.name} />
                    </li>
                    {workSummary && workSummary.chapterOptions && workSummary.chapterOptions.length > 1 &&
                        <li className={styles.menuItem}>
                            <div>
                                <SelectSingleDropDown
                                    value={params && params.chapterId ? chapter.chapterNbr : chapterSequenceOptions.length}
                                    id={`chapterNbr`}
                                    label={<L p={p} t={`Sequence`}/>}
                                    options={chapterSequenceOptions}
                                    noBlank={true}
                                    error={''}
                                    labelClass={styles.labelClass}
                                    height={`medium`}
                                    className={styles.singleDropDown}
                                    onChange={this.changeChapter} />
                            </div>
                        </li>
                    }
                    <li className={styles.menuItem}>
                        <div>
                            <SelectSingleDropDown
                                value={chapter.workStatusId}
                                id={`workStatusId`}
                                label={<L p={p} t={`Status`}/>}
                                options={workStatusOptions}
                                noBlank={true}
                                error={''}
                                labelClass={styles.labelClass}
                                height={`medium`}
                                className={styles.singleDropDown}
                                onChange={this.changeChapter} />
                        </div>
                    </li>
                    <li className={styles.menuItem}>
                        <div>
                            <SelectSingleDropDown
                                value={chapter.editSeverityId}
                                id={`editSeverityId`}
                                label={<L p={p} t={`Edit Severity`}/>}
                                options={editSeverityOptions}
                                noBlank={true}
                                error={''}
                                labelClass={styles.labelClass}
                                height={`medium`}
                                className={styles.singleDropDown}
                                onChange={this.changeChapter} />
                        </div>
                    </li>
                    <li className={styles.menuItem}>
                        <span className={styles.inputText}><L p={p} t={`Author's Comment`}/></span><br/>
                        <textarea rows={5} cols={45}
                                id={`comment`}
                                name={`comment`}
                                defaultValue={chapter.comment}
                                onChange={this.changeChapter}
                                className={styles.commentTextarea}>
                        </textarea>
                    </li>
                </ul>
                {(!params || !params.chapterId) &&
                    <div>
                        <span className={classes(styles.menuItem, styles.navEnterText)}>How do you want to enter text?</span>
                        <div className={styles.row}>
                            <ButtonWithIcon label={<L p={p} t={`Start writing`}/>} icon={'checkmark_circle'} onClick={() => this.processForm(false)} className={styles.submitButton}/>
                            <ButtonWithIcon label={<L p={p} t={`Upload a file`}/>} icon={'checkmark_circle'} onClick={() => this.processForm(true)} className={styles.submitButton}/>
                        </div>
                    </div>
                }
                {params && params.chapterId &&
                    <a onClick={() => this.processForm('UPDATE')} className={styles.buttonStyle}><L p={p} t={`Submit`}/></a>
                }
                <OneFJefFooter />
            </section>
        );
    }
}

export default ChapterAddOrUpdateView;
