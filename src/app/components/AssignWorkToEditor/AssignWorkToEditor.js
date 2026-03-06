import React, {Component} from 'react';
import styles from './AssignWorkToEditor.css';
//import SwitchOnOff from '../SwitchOnOff';
import MultiSelect from '../MultiSelect';
import { withAlert } from 'react-alert';
const p = 'component';
import L from '../../components/PageLanguage';

class AssignWorkToEditor extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          selectedChapters: [],
          selectedLanguages: [],
      }

      this.setEditorFunction = this.setEditorFunction.bind(this);
      this.handleSelectedChapters = this.handleSelectedChapters.bind(this);
      this.getJustCollapsed_chapters = this.getJustCollapsed_chapters.bind(this);
      this.handleSelectedLanguages = this.handleSelectedLanguages.bind(this);
      this.getJustCollapsed_languages = this.getJustCollapsed_languages.bind(this);
      this.sectionValueRenderer = this.sectionValueRenderer.bind(this);
      this.languageValueRenderer = this.languageValueRenderer.bind(this);
  }

  componentDidMount() {
      const { chaptersChosen, languagesChosen } = this.props;
      this.setState({
          selectedChapters: chaptersChosen,
          selectedLanguages: languagesChosen,
      })
  }

  handleSelectedChapters(selectedChapters) {
      this.setState({selectedChapters});
  }

  getJustCollapsed_chapters() {
      const {selectedLanguages, selectedChapters} = this.state;
      this.setEditorFunction(this.props,
                           "skip",
                           this.props.workId,
                           this.props.editorPersonId,
                           this.props.owner_personId,
                           selectedChapters,
                           selectedLanguages );
  }

  handleSelectedLanguages(selectedLanguages) {
    this.setState({selectedLanguages});
  }

  getJustCollapsed_languages() {
      const {selectedChapters, selectedLanguages} = this.state;
      this.setEditorFunction(this.props,
                           "skip",
                           this.props.workId,
                           this.props.editorPersonId,
                           this.props.owner_personId,
                           selectedChapters,
                           selectedLanguages );
  }

  setEditorFunction(props, prevState, workId, editorPersonId, owner_personId, chapters, languagesChosen) {
      if (props.isNewInvite) {
          props.setEditorAssign(workId,
                           chapters,
                           languagesChosen ? languagesChosen : [1],
                           prevState === "skip" ? "skip" : prevState);
       } else {
           props.setEditorAssign(prevState === "skip" ? "skip" : !prevState,
                            workId,
                            editorPersonId,
                            owner_personId,
                            chapters,
                            languagesChosen ? languagesChosen : [1] );
        }
  }

  handleSwitch (props, prevState) {
       let chapters = "";
       let languages = "";
       //When this is turned on the first time for a user, give the new editor all sections
       //   (which is particularly helpful when there is only one section, plus the choice list is hidden when there is only one section anyway).
       if (!props.chaptersChosen || props.chaptersChosen.length === 0) {
           const allValues = props.chapterOptions.map(o => o.value);
           this.setState({selectedChapters: allValues })
           chapters = allValues;
       } else {
           chapters = props.chaptersChosen;
       }

       if (!props.languagesChosen || props.languagesChosen.length === 0) {
           this.setState({selectedLanguages: [1] })
           languages = [1];
       } else {
           languages = props.languagesChosen;
       }
			 this.props.alert.info(<div className={styles.alertText}><L p={p} t={`It will take a moment to save this setting.`}/></div>)

       this.setEditorFunction(props,
                             prevState,
                             props.workId,
                             props.editorPersonId,
                             props.owner_personId,
                             chapters,
                             languages);
  }

  sectionValueRenderer(selected, options) {
      if (selected.length === 0) {
          return <L p={p} t={`Select sections...`}/>;
      }

      if (selected.length === options.length) {
          return <L p={p} t={`All sections are selected`}/>;
      }

      return <L p={p} t={`Sections:  ${selected.length} of ${options.length}`}/>;
  }

  languageValueRenderer(selected, options) {
    if (!selected || selected.length === 0) {
        return <L p={p} t={`Select languages...`}/>;
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
    return `Languages:  ${languageNames}`;
  }


  render() {
      let {chapterOptions, languageOptions, editorAssign, workId, editorPersonId} = this.props;
      let hasAssign = {};
      //Existing editor or is this the new inviteEditor which doesn't yet have a personId?
      //Plus, the editorAssign from the inviteEditor is an object that needs to be converted to an array..
      if (editorAssign && editorAssign.length > 0 && editorAssign[0].editorPersonId) {
          hasAssign = editorAssign && editorAssign.length > 0 && editorAssign.filter(m => m.workId === workId && m.editorPersonId === editorPersonId);
      } else {
          hasAssign = editorAssign && editorAssign.workId === workId ? [editorAssign] : []; //This function needs an array not just a plain object.
      }
      let isChecked = ((hasAssign && hasAssign.length === 0) || !hasAssign) ? false : true;
      const {selectedChapters, selectedLanguages} = this.state;

      return (
        <div>
            <a onClick={() => this.handleSwitch(this.props, isChecked)} className={isChecked ? styles.removeButton : styles.submitButton}>
                {isChecked ? <L p={p} t={`Discontinue`}/> : <L p={p} t={`Share`}/>}
            </a>
            {isChecked && chapterOptions && chapterOptions.length > 1 &&
                <div className={styles.multiSelect}>
                    <MultiSelect
                        options={chapterOptions}
                        onSelectedChanged={this.handleSelectedChapters}
                        getJustCollapsed={this.getJustCollapsed_chapters}
                        valueRenderer={this.sectionValueRenderer}
                        selected={selectedChapters}/>
                </div>
            }
            {isChecked &&
                <div className={styles.multiSelect}>
                    <MultiSelect
                        options={languageOptions}
                        onSelectedChanged={this.handleSelectedLanguages}
                        getJustCollapsed={this.getJustCollapsed_languages}
                        valueRenderer={this.languageValueRenderer}
                        selected={selectedLanguages}/>
                </div>
            }
            <hr className={styles.line}/>
        </div>
      );
   }
}

export default withAlert(AssignWorkToEditor);
