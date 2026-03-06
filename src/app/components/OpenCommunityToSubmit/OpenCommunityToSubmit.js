import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './OpenCommunityToSubmit.css';
import MultiSelect from '../MultiSelect';
import Checkbox from '../Checkbox';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateTimePicker from '../../components/DateTimePicker';
import MessageModal from '../../components/MessageModal';
import WorkFilter from '../../components/WorkFilter';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import moment from 'moment';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          selectedChapters: [],
          selectedLanguages: [],
          selectedGenres: [],
          chosenWork: {},
          chapterOptions: [],
          dueDate: '',
          editNativeLanguage: false,
          nativeLanguageName: '',
          editorsCount: 5,
          declineIdleId: 0,
          editSeverityId: 0,
          errorDueDate: '',
          errorGenres: '',
          errorChapters: '',
          errorNoEntries: '',
          isShowingModal_saved: false,
          isShowingModal_editTranslate: false,
          localWorkSummaries: [],
      }

      this.handleEditSeverity = this.handleEditSeverity.bind(this);
      this.handleDeclineIdle = this.handleDeclineIdle.bind(this);
      this.handleDueDateChange = this.handleDueDateChange.bind(this);
      this.handleWorkChoice = this.handleWorkChoice.bind(this);
      this.processForm = this.processForm.bind(this);
      this.handleEditorsCount = this.handleEditorsCount.bind(this);
      this.handleSelectedChapters = this.handleSelectedChapters.bind(this);
      this.handleSelectedGenres = this.handleSelectedGenres.bind(this);
      this.handleSelectedLanguages = this.handleSelectedLanguages.bind(this);
      this.chapterValueRenderer = this.chapterValueRenderer.bind(this);
      this.languageValueRenderer = this.languageValueRenderer.bind(this);
      this.genreValueRenderer = this.genreValueRenderer.bind(this);
      this.handleAlertClose = this.handleAlertClose.bind(this);
      this.handleAlertOpen = this.handleAlertOpen.bind(this);
      this.handleEditNativeLanguage = this.handleEditNativeLanguage.bind(this);
      this.alertNativeAndTranslate = this.alertNativeAndTranslate.bind(this);
      this.handleEditTranslateMessageClose = this.handleEditTranslateMessageClose.bind(this);
      this.handleEditTranslateMessageOpen = this.handleEditTranslateMessageOpen.bind(this);
  }

  componentDidMount() {
      const {workSummaries, declineIdleOptions, editSeverityOptions} = this.props;
      this.setState({
          localWorkSummaries: workSummaries,
          declineIdleId: declineIdleOptions && declineIdleOptions.length > 0 && declineIdleOptions[0].id,
          editSeverityId: editSeverityOptions && editSeverityOptions.length > 0 && editSeverityOptions[0].id,
      });
  }

  componentDidUpdate() {
      const {chosenWork} = this.state;
      const {workSummaries, modifyOpenCommunityEntryId, openCommunityFull} = this.props;
      //If this is a modify record, force in the modify details into the edit controls without having to call the handleWorkChoices function.
      //Then let the record be modified and updated.  If the record is not saved and the user moves onto another, then clear out this record with DidUnmount.
      if (modifyOpenCommunityEntryId && modifyOpenCommunityEntryId !== chosenWork.openCommunityEntryId) {
          let modifyWork = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.openCommunityEntryId === modifyOpenCommunityEntryId)[0];
          this.setState({
              chosenWork: modifyWork,
              selectedChapters: modifyWork.chapterIds || [],
              selectedLanguages: modifyWork.translateLanguageIds || [],
              selectedGenres: modifyWork.genreIds || [],
              chapterOptions: modifyWork.chapterOptions,
              dueDate: moment(modifyWork.dueDate).format("D MMM YYYY"),
              nativeLanguageName: modifyWork.nativeLanguageName,
              editorsCount: modifyWork.openCommEditorsCount,
              declineIdleId: modifyWork.declineIdleId,
              editSeverityId: modifyWork.editSeverityId,
          });
      } else  if (!modifyOpenCommunityEntryId && workSummaries && workSummaries.length > 0 && !chosenWork.workId) {
          let firstWork = workSummaries[0];
          this.handleWorkChoice(firstWork.workId);
      }
  }

  alertNativeAndTranslate(paramSelectedLanguage, paramChecked) {
      //The parameters are sent in since this funcion could be evaluated before the local state is updated.
    if (paramChecked && paramSelectedLanguage.length > 0) {
        this.handleEditTranslateMessageOpen();
    }
  }

  handleEditNativeLanguage(value) {
      const {selectedLanguages} = this.state;
      this.setState({editNativeLanguage: value });
      this.alertNativeAndTranslate(selectedLanguages, value);
  }

  handleDueDateChange(dueDate) {
      this.setState({dueDate, errorDueDate: ""});
  }

  handleWorkChoice(value) {
      const {workSummaries, languageOptions} = this.props;
      let chosenWork = workSummaries && workSummaries.length > 0 && workSummaries.filter(m => m.workId === value)[0]
      let chapterOptions = chosenWork && chosenWork.chapterOptions ? chosenWork.chapterOptions : [];
      let nativeLanguageName = languageOptions && languageOptions.length > 0 && languageOptions.filter(m => m.value === chosenWork.nativeLanguageId)[0];
      nativeLanguageName = nativeLanguageName && nativeLanguageName.label;
      const selectedChapters = chosenWork.chapterOptions.map(o => o.value);

      this.setState({
          selectedChapters,
          chosenWork,
          chapterOptions,
          nativeLanguageName,
       });
  }

  handleDeclineIdle(event) {
      this.setState({ declineIdleId: event.target.value });
  }

  handleEditSeverity(event) {
      this.setState({ editSeverityId: event.target.value });
  }

  handleEditorsCount(event) {
      this.setState({ editorsCount: event.target.value })
  }

  processForm() {
      const {chosenWork, selectedChapters, editNativeLanguage, selectedLanguages, selectedGenres, dueDate, editorsCount, declineIdleId,
                editSeverityId} = this.state;
      const {saveOpenCommunityEntry, personId, onSubmitTabChange, workSummaries, declineIdleOptions, editSeverityOptions} = this.props;
      event && event.preventDefault();
      let hasError = false;

     if (!workSummaries || workSummaries.length === 0) {
         this.setState({ errorNoEntries: <L p={p} t={`There are not any available documents to submit`}/>});
         hasError = true;
     }

      if (selectedChapters.length === 0) {
          this.setState({ errorChapters: <L p={p} t={`Please choose at least one chapter`}/>});
          hasError = true;
      }

      if (selectedGenres.length === 0) {
          this.setState({ errorGenres: <L p={p} t={`Please choose at least one genre`}/>});
          hasError = true;
      }

      if (!dueDate) {
          this.setState({ errorDueDate: <L p={p} t={`Please enter a due date`}/>});
          hasError = true;
      }

      if (!hasError) {
          let finalDeclineIdleId = declineIdleId ? declineIdleId : declineIdleOptions[0].id;
          let finalEditSeverityId = editSeverityId ? editSeverityId : editSeverityOptions[0].id;
          saveOpenCommunityEntry(personId, chosenWork.workId, selectedChapters, selectedLanguages, editNativeLanguage,
                                    selectedGenres, dueDate, editorsCount, finalDeclineIdleId, finalEditSeverityId, chosenWork.openCommunityEntryId);
          this.handleAlertOpen();
          // let withoutRecord = workOptions.filter(m => m.id !== chosenWork.workId);
          // let nextWorkId = withoutRecord[0] ? withoutRecord[0].id : 0;
          // nextWorkId && this.handleWorkChoice(nextWorkId);

          this.setState({
              selectedChapters: [],
              editNativeLanguage: false,
              selectedLanguages: [],
              selectedGenres: [],
              chosenWork: {},
              chapterOptions: [],
              dueDate: '',
              nativeLanguageName: '',
              editorsCount: 5,
              declineIdleId: 0,
              editSeverityId: 0,
          });
          onSubmitTabChange();
      }
  }

  handleSelectedChapters(selectedChapters) {
      this.setState({selectedChapters, errorChapters: ''});
  }

  handleSelectedLanguages(selectedLanguages) {
      const {editNativeLanguage} = this.state;
      this.setState({selectedLanguages});
      this.alertNativeAndTranslate(selectedLanguages, editNativeLanguage);
  }

  handleSelectedGenres(selectedGenres) {
      this.setState({selectedGenres, errorGeners: ''});
  }

  chapterValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select sections...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All sections/chapters are selected`}/>;
      }

      return <L p={p} t={`Sections:  ${selected.length} of ${options.length}`}/>;
  }

  languageValueRenderer(selected, options) {
    if (!selected || selected.length === 0) {
        return <L p={p} t={`Select languages for translation (optional)`}/>;
    }

    if (selected.length === options.length) {
        return <L p={p} t={`All languages are selected`}/>;
    }
    return <L p={p} t={`Languages: ${selected.length} of ${options.length}`}/>;
  }

  genreValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select genres...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All genres are selected`}/>;
      }

      return <L p={p} t={`Genres:  ${selected.length} of ${options.length}`}/>;
  }

  handleAlertClose = () => this.setState({isShowingModal_saved: false})
  handleAlertOpen = () => this.setState({isShowingModal_saved: true})
  handleEditTranslateMessageClose = () => this.setState({isShowingModal_editTranslate: false})
  handleEditTranslateMessageOpen = () => this.setState({isShowingModal_editTranslate: true})

  render() {
      const {personId, workOptions, declineIdleOptions, genreOptions, languageOptions, editorsCountOptions, workSummaries, editSeverityOptions,
                modifyOpenCommunityEntryId, updateFilterByField_work, updateFilterDefaultFlag_work, clearFilters_work,
                saveNewSavedSearch_work, updateSavedSearch_work, deleteSavedSearch_work, chooseSavedSearch_work, workFilterScratch,
                savedWorkFilterIdCurrent, workFilterOptions, } = this.props;
      const {chosenWork, selectedChapters, selectedLanguages, selectedGenres, chapterOptions, nativeLanguageName, editorsCount, dueDate,
                declineIdleId, editSeverityId, errorGenres, errorChapters, errorDueDate, errorNoEntries, isShowingModal_saved,
                isShowingModal_editTranslate, editNativeLanguage} = this.state;

      return (
        <div className={styles.container}>
            <Accordion noShowExpandAll={true}>
                <AccordionItem expanded={false} filterScratch={workFilterScratch} filterOptions={workFilterOptions} savedFilterIdCurrent={savedWorkFilterIdCurrent}
                        updateSavedSearch={updateSavedSearch_work} deleteSavedSearch={deleteSavedSearch_work} chooseSavedSearch={chooseSavedSearch_work}
                        updateFilterByField={updateFilterByField_work} updateFilterDefaultFlag={updateFilterDefaultFlag_work} personId={personId}
                        clearFilters={clearFilters_work}>
                    <WorkFilter personId={personId} workFilter={workFilterScratch} className={styles.workFilter}
                        updateFilterByField={updateFilterByField_work} hideSourceStatus={true}
                        clearFilters={clearFilters_work} saveNewSavedSearch={saveNewSavedSearch_work} savedSearchOptions={workFilterOptions}/>
                </AccordionItem>
            </Accordion>
            <div className={styles.marginLeft}>
            {(!workOptions || workOptions.length === 0) &&
                <div>
                    <hr />
                    <Link to={'/workAddNew'} className={styles.newWork}><L p={p} t={`Add new document`}/></Link>
                    <hr />
                </div>
            }
            {!modifyOpenCommunityEntryId &&
                <div>
                    <SelectSingleDropDown
                        value={chosenWork && chosenWork.workId ? chosenWork.workId : workSummaries && workSummaries.length > 0 && workSummaries[0].workId}
                        options={workOptions && workOptions.length > 0 ? workOptions : [{id: 0, label:'no entries'}]}
                        error={''}
                        label={<L p={p} t={`Documents`}/>}
                        id={'Documents'}
                        height={`medium`}
                        noBlank={true}
                        labelClass={styles.selectLabelClass}
                        selectClass={styles.selectListClass}
                        onChange={(event) => this.handleWorkChoice(event.target.value)} />
                    <span className={styles.errorMessage}>{errorNoEntries}</span>
                </div>
            }
            {modifyOpenCommunityEntryId ?
                <div className={styles.stackedText}>
                    <span className={styles.nativeLanguage}><L p={p} t={`Modify Open Community Entry`}/></span>
                    <span className={styles.textBig}>{chosenWork.title}</span>
                </div>
                : ''
            }
            {workOptions && workOptions.length > 0 &&
                <div>
                    <div className={styles.row}>
                        <div className={styles.stackedText}>
                            <span className={styles.nativeLanguage}><L p={p} t={`Native Language`}/></span>
                            <span className={styles.textBig}>{nativeLanguageName}</span>
                        </div>
                        <div className={styles.checkbox}>
                            <Checkbox
                                id={`editNativeLanguage`}
                                label={<L p={p} t={`Edit in the native language`}/>}
                                labelClass={styles.labelCheckbox}
                                position={`before`}
                                checked={editNativeLanguage}
                                onClick={() => this.handleEditNativeLanguage(!editNativeLanguage)} />
                        </div>
                    </div>
                    <hr/>
                    {chosenWork.sectionCount > 1 &&
                        <div className={styles.multiSelect}>
                            <MultiSelect
                                options={chapterOptions && chapterOptions.length > 0 ? chapterOptions : [{value: 0, label:'Please choose a document'}]}
                                onSelectedChanged={this.handleSelectedChapters}
                                valueRenderer={this.chapterValueRenderer}
                                selected={selectedChapters}/>
                            <span className={styles.errorMessage}>{errorChapters}</span>
                        </div>
                    }
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={languageOptions && languageOptions.length > 0 ? languageOptions : [{value: 0, label:'no entries'}]}
                            onSelectedChanged={this.handleSelectedLanguages}
                            valueRenderer={this.languageValueRenderer}
                            selected={selectedLanguages}/>
                    </div>
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={genreOptions && genreOptions.length > 0 ? genreOptions : [{value: 0, label:'no entries'}]}
                            onSelectedChanged={this.handleSelectedGenres}
                            valueRenderer={this.genreValueRenderer}
                            selected={selectedGenres}/>
                        <span className={styles.errorMessage}>{errorGenres}</span>
                    </div>
                    <hr/>
                    <div>
                        <SelectSingleDropDown
                            value={editorsCount}
                            options={editorsCountOptions}
                            error={''}
                            label={<L p={p} t={`Allow Quantity of Editors`}/>}
                            height={`short`}
                            noBlank={true}
                            labelClass={styles.selectLabelClass}
                            selectClass={styles.selectListClass}
                            onChange={this.handleEditorsCount} />
                    </div>
                    <div>
                        <div className={styles.dateRow}>
                            <span className={styles.textAbove}>Due date</span>
                            <DateTimePicker id={`dueDateFrom`} value={dueDate} onChange={(event) => this.handleDueDateChange(event.target.value)}/>
                            <span className={styles.errorMessage}>{errorDueDate}</span>
                        </div>
                    </div>
                    <div>
                        <SelectSingleDropDown
                            value={declineIdleId}
                            options={declineIdleOptions && declineIdleOptions.length > 0 ? declineIdleOptions : [{id: 0, label:'no entries'}]}
                            label={<L p={p} t={`Decline Idle Editors In`}/>}
                            height={`medium`}
                            noBlank={true}
                            labelClass={styles.selectLabelClass}
                            selectClass={styles.selectListClass}
                            onChange={this.handleDeclineIdle} />
                    </div>
                    <div className={styles.extraMarginTop}>
                        <SelectSingleDropDown
                            value={editSeverityId}
                            options={editSeverityOptions && editSeverityOptions.length > 0 ? editSeverityOptions : [{id: 0, label:'no entries'}]}
                            label={<L p={p} t={`Level of Edit Intensity (native language editing only)`}/>}
                            height={`medium`}
                            noBlank={true}
                            labelClass={styles.selectLabelClass}
                            selectClass={styles.selectListClass}
                            onChange={this.handleEditSeverity} />
                    </div>
                    <div className={styles.buttonPlace}>
                        <a onClick={this.processForm} className={styles.submitButton}>
                            <L p={p} t={`Submit`}/>
                        </a>
                    </div>
                </div>
            }
            {isShowingModal_saved &&
                <MessageModal handleClose={this.handleAlertClose} heading={<L p={p} t={`New Record Saved`}/>}
                    explainJSX={<L p={p} t={`The new Open Community entry has been saved.  It can now be seen by editors and translators so that they can volunteer to edit or translate for you.`}/>}
                    onClick={this.handleAlertClose}/>
             }
             {isShowingModal_editTranslate &&
                 <MessageModal handleClose={this.handleEditTranslateMessageClose} heading={<L p={p} t={`Edit and Translate Error!`}/>}
                     explainJSX={<L p={p} t={`It is not recommended that you request editors for both editing and translating.  The editing process should be complete before translation is started.`}/>}
                     onClick={this.handleEditTranslateMessageClose}/>
              }
              </div>
        </div>
      );
   }
}
