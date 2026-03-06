import React, {Component} from 'react';
import styles from './OpenCommunityToCommitButtons.css';
import MultiSelect from '../MultiSelect';
import Checkbox from '../Checkbox';
import MessageModal from '../MessageModal';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          selectedChapters: [],
          selectedLanguages: [],
          nativeLanguageEdit: false,
          errorLanguage: '',
          errorChapter: '',
          isShowingModal_new: false,
          isShowingModal_uncommit: false,
      }

      this.handleNativeLanguageEdit = this.handleNativeLanguageEdit.bind(this);
      this.handleSelectedChapters = this.handleSelectedChapters.bind(this);
      this.handleSelectedLanguages = this.handleSelectedLanguages.bind(this);
      this.sectionValueRenderer = this.sectionValueRenderer.bind(this);
      this.languageValueRenderer = this.languageValueRenderer.bind(this);
      this.handleCommitClick = this.handleCommitClick.bind(this);
      this.handleUncommitClick = this.handleUncommitClick.bind(this);
      this.handleNewAlertClose = this.handleNewAlertClose.bind(this);
      this.handleNewAlertOpen = this.handleNewAlertOpen.bind(this);
      this.handleUncommitAlertClose = this.handleUncommitAlertClose.bind(this);
      this.handleUncommitAlertOpen = this.handleUncommitAlertOpen.bind(this);
  }

  componentDidMount() {
      const {openCommunityEntry} = this.props;

      const selectedChapters = openCommunityEntry.hasCommittedOpenCommunity
        ? openCommunityEntry.committedChapterIds
        : this.props.chapterOptions.map(o => o.value);

     const selectedLanguages = openCommunityEntry.hasCommittedOpenCommunity
        ? openCommunityEntry.committedTranslatedLanguageIds
        : [];

      const nativeLanguageEdit = openCommunityEntry.committedNativeLanguageEdit
         ? openCommunityEntry.committedNativeLanguageEdit
         : false;

      this.setState({selectedChapters, selectedLanguages, nativeLanguageEdit});
  }

  handleUncommitClick() {
      const {personId, uncommitOpenCommunityEntry, openCommunityEntry} = this.props;
      uncommitOpenCommunityEntry(personId, openCommunityEntry.openCommunityEntryId);
      this.handleUncommitAlertClose();
      this.setState({
          selectedLanguages: [],
          nativeLanguageEdit: false,
      });
  }

  handleCommitClick() {
      const {personId, openCommunityEntry, commitOpenCommunityEntry} = this.props;
      const {selectedChapters, selectedLanguages, nativeLanguageEdit} = this.state;
      let hasError = false;

      if (selectedChapters.length === 0) {
          this.setState({ errorChapter: <L p={p} t={`Please choose at least one chapter`}/>});
          hasError = true;
      }

      if (openCommunityEntry.editNativeLanguage && !nativeLanguageEdit) {
          this.setState({ errorLanguage: <L p={p} t={`Please choose to edit the native language before committing.`}/>});
          hasError = true;
      } else if (!openCommunityEntry.editNativeLanguage && selectedLanguages.length === 0) {
          this.setState({ errorLanguage: <L p={p} t={`Please choose a language for translation before committing.`}/>});
          hasError = true;
      }

      if (!hasError) {
          commitOpenCommunityEntry(personId, openCommunityEntry.openCommunityEntryId, selectedChapters,
                                    selectedLanguages, nativeLanguageEdit);
          this.handleNewAlertOpen();
      }
  }

  handleNativeLanguageEdit() {
      this.setState({
          nativeLanguageEdit: !this.state.nativeLanguageEdit,
          errorLanguage: ""
      });
  }

  handleSelectedChapters(selectedChapters) {
      this.setState({selectedChapters});
      this.setState({ errorChapter: ""});
  }

  handleSelectedLanguages(selectedLanguages) {
      this.setState({selectedLanguages});
      this.setState({ errorLanguage: ""});
  }

  sectionValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select sections/chapters...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All sections/chapters are selected`}/>;
      }

      return <L p={p} t={`Sections/chapters:  ${selected.length} of ${options.length}`}/>;
  }

  languageValueRenderer(selected, options) {
    if (!selected || selected.length === 0) {
        return <L p={p} t={`Select language to translate...`}/>;
    }

    if (selected.length === options.length) {
        return <L p={p} t={`All languages are selected`}/>;
    }
    let comma = "";
    let languageNames = "";
    selected && selected.length > 0 && selected.forEach(value => {
        languageNames += comma + options.filter(o => o.value === value)[0].label;
        comma = ", ";
    });
    languageNames = languageNames === 'en' ? 'English' : languageNames;
    return <L p={p} t={`Language to translate:  ${languageNames}`}/>;
  }

  handleNewAlertClose = () => this.setState({isShowingModal_new: false})
  handleNewAlertOpen = () => this.setState({isShowingModal_new: true})
  handleUncommitAlertClose = () => this.setState({isShowingModal_uncommit: false})
  handleUncommitAlertOpen = () => this.setState({isShowingModal_uncommit: true})

  render() {
      let {chapterOptions, languageOptions, openCommunityEntry} = this.props;
      const {selectedChapters, selectedLanguages, nativeLanguageEdit, isShowingModal_new, isShowingModal_uncommit,
                errorChapter, errorLanguage} = this.state;

      return (
        <div className={styles.container}>
            <div>
                {chapterOptions && chapterOptions.length > 1 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={chapterOptions}
                            onSelectedChanged={this.handleSelectedChapters}
                            valueRenderer={this.sectionValueRenderer}
                            selected={selectedChapters || []}/>
                        <span className={styles.errorMessage}>{errorChapter}</span>
                    </div>
                }
                {openCommunityEntry.editNativeLanguage &&
                    <div className={styles.checkbox}>
                        <Checkbox
                            id={`editNativeLanguage`}
                            label={<L p={p} t={`Edit this document in ${openCommunityEntry.nativeLanguageName}`}/>}
                            labelClass={styles.labelCheckbox}
                            position={`before`}
                            onClick={this.handleNativeLanguageEdit}
                            checked={nativeLanguageEdit}
                            checkboxClass={styles.checkbox} />
                    </div>
                }
                {openCommunityEntry.languageOptions.length > 0 &&
                    <div className={styles.multiSelect}>
                        <MultiSelect
                            options={languageOptions}
                            onSelectedChanged={this.handleSelectedLanguages}
                            valueRenderer={this.languageValueRenderer}
                            selected={selectedLanguages || []}/>
                    </div>
                }
                <span className={styles.errorMessage}>{errorLanguage}</span>
                <div className={styles.row}>
                    <div>
                        <a onClick={this.handleCommitClick} className={styles.submitButton}>
                            {openCommunityEntry.hasCommittedOpenCommunity ? <L p={p} t={`Update`}/> : <L p={p} t={`Commit`}/>}
                        </a>
                    </div>
                    {openCommunityEntry.hasCommittedOpenCommunity &&
                        <div>
                            <a onClick={this.handleUncommitAlertOpen} className={styles.removeButton}>
                                <L p={p} t={`Uncommit`}/>
                            </a>
                        </div>
                    }
                </div>
            </div>
            {isShowingModal_new &&
                <MessageModal handleClose={this.handleNewAlertClose} heading={<L p={p} t={`New Record Saved`}/>}
                    explainJSX={<L p={p} t={`You have chosen to help the author with this document.  You can see this entry under the 'Committed' tab to the right.  You can also see this document in the 'My Documents' page.`}/>}
                    onClick={this.handleNewAlertClose}/>
             }
             {isShowingModal_uncommit &&
                 <MessageModal handleClose={this.handleUncommitAlertClose} heading={<L p={p} t={`Discontinue Editing this Document?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to discontinue editing this document?`}/>} isConfirmType={true}
                     onClick={this.handleUncommitClick}/>
              }
        </div>
      );
   }
}
