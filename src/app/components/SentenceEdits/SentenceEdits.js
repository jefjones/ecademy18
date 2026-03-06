import React, { Component } from 'react';
import styles from './SentenceEdits.css';
import classes from 'classnames';
import ConfigModal from '../../components/ConfigModal';
import MessageModal from '../../components/MessageModal';
import DateMoment from '../../components/DateMoment';
import TextareaModal from '../../components/TextareaModal';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import DiffWord from '../../components/DiffWord';
const p = 'component';
import L from '../../components/PageLanguage';

class SentenceEdits extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
		      newEditText: '',
		      acceptedEditDetailId: 0, //  This works for the editor as well as the author so that only his last accepted/voted-up edit will apply.
		      isShowingModal_single: false,
		      isShowingModal_all: false,
		      isShowingModal_blank: false,
		      isShowingModal_config: false,
		      isShowingModal_comment: false,
		      isShowingModal_erase: false,
		      isShowingLegend: false,
		      deleteIndex: 0,
		      caretClassName: classes(styles.jef_caret, styles.jefCaretDown),
	    };
  }

  componentDidMount() {
	    //document.getElementById('singleEditor').focus();  Don't do this since it will cause the keyboard to come up immediately when that might not be what the user wants by default.
	    this.singleEditor.addEventListener('keyup', this.checkForKeypress);

	    const { personConfig, isTranslation} = this.props;
	    //document.body.addEventListener("click", this.handleClosed);
	    //We are taking away the button reaction since we needed the real estate at the bottom of the screen and above the tool bar.  Double clicking on a sentence will open up the left pane.
	    this.cancelButton.addEventListener("click", this.handleClosed);
	    this.closeButton.addEventListener("click", this.handleClosed);
	    if (isTranslation) {
	        this.resetButton && this.resetButton.addEventListener("click", this.handleResetToClear);
	    } else {
	        this.resetButton && this.resetButton.addEventListener("click", this.handleResetToOriginal);
	    }

	    if (personConfig.historySentenceView) {
	        this.setState({ keepHistoryOn: true});
	    }
	    if (personConfig.nextSentenceAuto) {
	        this.setState({ keepAutoNextOn: true});
	    }
	    if (personConfig.editDifferenceView) {
	        this.setState({ keepEditDifferenceOn: true});
	    }
  }

  componentDidUpdate() {
      //this.singleEditor.focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
  }

  handleUpdatePersonConfig = (personId, configOption, value) => {
      const {updatePersonConfig} = this.props;

      if (configOption === `HistorySentenceViewKeepOn`) {
          this.setState({ keepHistoryOn: value});

      } else if (configOption === `NextSentenceAutoKeepOn`) {
          this.setState({ keepAutoNextOn: value});

      } else if (configOption === `EditDifferenceViewKeepOn`) {
          this.setState({ keepEditDifferenceOn: value});
      }

      updatePersonConfig(personId, configOption, value);
  }

  handleNextButton = () => {
      document.getElementById('singleEditor').innerHTML = ""; //That's in case there isn't another sentence to pick up.
      this.props.setNextHrefId();
  }

  checkForKeypress = (evt) => {
      evt.key === 'Escape' && this.props.leftSidePanelOpen && this.props.toggleLeftSidePanelOpen();
  }

  componentWillUnmount() {
      const {editDetailsByHrefId, personId, originalSentence, isTranslation} = this.props;
      //document.body.removeEventListener("click", this.handleClosed);
      let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
      let thisUserText = hasUserEdit ? hasUserEdit.editText : (isTranslation ? '' : originalSentence);
      this.setState({ newEditText: thisUserText})
  }

  handleClosed = () => {
      let {toggleLeftSidePanelOpen, personConfig} = this.props;
      toggleLeftSidePanelOpen();
      personConfig && !personConfig.historySentenceView && this.setState({ keepHistoryOn: false});
      personConfig && !personConfig.nextSentenceAuto && this.setState({ keepAutoNextOn: false})
      personConfig && !personConfig.editDifferenceView && this.setState({ keepEditDifferenceOn: false})
  }

  handleAcceptTranslation = () => {
      document.getElementById('singleEditor').innerHTML = this.props.translatedSentence;
      //We do not save the editDetail record proactively here since this accepted translation is machine translation which cannot be depended on for blind accuracy.
  }

  handleResetToOriginal = () => {
      document.getElementById('singleEditor').innerHTML = this.props.originalSentence;
  }

  handleResetToClear = () => {
      document.getElementById('singleEditor').innerHTML = '';
  }

  handleAcceptEdit = (editDetailId) => {
      //The accepting of an edit will commit Me to taking that editText into the editor window.  They can still make an edit to the edit.
      //But overall this implies that they consider the edit a favorable option so that they will be scored well for it.
      //When the author accepts it, it is higher than if it is just another editor.  So ... only one acceptedEditDetailId per sentence for this page.
      const {editDetailsByHrefId, personId, authorPersonId, saveEdit} = this.props;
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId && !m.isComment)[0] || [];
      if (editDetail) {
          if (editDetail.editText === "[<i>erased</i>]") {
              document.getElementById('singleEditor').innerHTML = "";
              //Save it proactively so that the user doesn't really have to hit Save on the left panel, so this is saved in case they leave by closing the panel.
              saveEdit(false)("[<i>erased</i>]")(editDetailId, personId === authorPersonId);
          } else {
              document.getElementById('singleEditor').innerHTML = editDetail.editText;
              //Save it proactively so that the user doesn't really have to hit Save on the left panel, so this is saved in case they leave by closing the panel.
              saveEdit(false)(editDetail.editText)(editDetailId, personId === authorPersonId);
          }
          this.setState({ acceptedEditDetailId: editDetail.editDetailId });
      }
  }

  handleSave = () => {
      const {saveEdit, acceptedEditDetailId, toggleLeftSidePanelOpen, personConfig, personId, authorPersonId, setNextHrefId, isTranslation} = this.props;
      //I was having trouble getting the newEditText to have any data in it, so I went right to the source and pulled it from the ContentEditable editorDiv
      if (isTranslation && document.getElementById(`singleEditor`).innerText === "") {
          this.handleBlankOpen();
      } else {
        saveEdit(false)(document.getElementById(`singleEditor`).innerHTML)(acceptedEditDetailId, personId === authorPersonId);
        isTranslation || personConfig.nextSentenceAuto ? setNextHrefId() : toggleLeftSidePanelOpen();
        document.getElementById(`singleEditor`).innerHTML = "";
      }
  }

  handleVote = (editDetailId, voteType) => {
      const {editDetailsByHrefId, saveEditVote, saveEdit, personId, authorPersonId} = this.props;
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
      if (voteType === "AGREE" && editDetail && !editDetail.isComment) {
          document.getElementById('singleEditor').innerHTML = editDetail.editText;
          //Save the edit proactively so that the user doesn't really have to hit Save on this left panel, so this is saved in case they leave by closing this panel.
          saveEdit(false)(editDetail.editText)(editDetailId, personId === authorPersonId);
      }
      if (editDetail) {
          saveEditVote(editDetail.editDetailId, voteType, editDetail.personId, editDetail.editText, "", editDetail.isComment, false);
      }
  }

  handleSingleDelete = (editDetailId) => {
      const {deleteEditOrComment, editDetailsByHrefId} = this.props;
      this.setState({isShowingModal_single: false});
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
      if (editDetail) {
          //We are going to have to handle the Paragraph details, too.  For now we will just consider the editDetailId
          //The paragraph has two different IDs:  one for existing and one for new.  Maybe they can be combined.
          //ToDo: Maybe (most likely?) implement a voter comment about their choice for troll or disagree.  See VoteComment in position 4
          //isParagraph is the last position (set as false by default for now.)
          deleteEditOrComment(editDetail.editDetailId);
      }
  }

  handleRestore = (editDetailId, voteType) => {
      const {restoreEditOrComment, editDetailsByHrefId} = this.props;
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
      if (editDetail) {
          restoreEditOrComment(editDetail.editDetailId);
      }
  }

  handleAllDeletes = () => {
      const {deleteEditOrComment, editDetailsByHrefId} = this.props;
      this.setState({ isShowingModal_all: false })
      editDetailsByHrefId.forEach(m => {
          deleteEditOrComment(m.editDetailId);
      });
  }

  handleTextChange = (e) => {
      this.setState({ newEditText: e.target.value});
  }

  handleFullVersionView = (tabPersonId) => {
      this.props.setTabSelected(tabPersonId, true); //force the full version view so that the tabs are displayed in the tool area above automatically.
      this.props.toggleLeftSidePanelOpen();
  }

  handleSingleDeleteClose = () => {
      this.setState({isShowingModal_single: false});
      this.props.toggleLeftSidePanelOpen();
  }
  handleSingleDeleteOpen = (deleteIndex) => {
      this.setState({isShowingModal_single: true, deleteIndex,});
      this.props.toggleLeftSidePanelOpen();
  }
  handleAllDeleteClose = () => {
      this.setState({isShowingModal_all: false});
      this.props.toggleLeftSidePanelOpen();
  }
  handleAllDeleteOpen = () => {
      this.setState({isShowingModal_all: true});
      this.props.toggleLeftSidePanelOpen();
  }
  handleBlankClose = () => {
      this.setState({isShowingModal_blank: false});
      this.props.toggleLeftSidePanelOpen();
  }
  handleBlankOpen = () => {
      this.setState({isShowingModal_blank: true});
      this.props.toggleLeftSidePanelOpen();
  }
  handleConfigClose = () => {
      this.setState({isShowingModal_config: false});
      this.props.toggleLeftSidePanelOpen();
  }
  handleConfigOpen = () => {
      this.setState({isShowingModal_config: true});
      this.props.toggleLeftSidePanelOpen();
  }

  handleCommentSave = (commentText) => {
      this.props.saveEditOrComment(true)(commentText)(null, false);
      this.setState({isShowingModal_comment: false})
      this.props.toggleLeftSidePanelOpen();
  }

  handleCommentClose = () => {
      this.setState({isShowingModal_comment: false});
      this.props.toggleLeftSidePanelOpen();
  }

  handleCommentOpen = () => {
      this.setState({isShowingModal_comment: true});
      this.props.toggleLeftSidePanelOpen();
  }

  handleEraseConfirmClose = () => {
      this.setState({isShowingModal_erase: false});
      this.props.toggleLeftSidePanelOpen();
  }

  handleEraseConfirmOpen = () => {
      this.setState({isShowingModal_erase: true});
      this.props.toggleLeftSidePanelOpen();
  }

  handleEraseSentence = () => {
      const {saveEditOrComment} = this.props;
      saveEditOrComment(false)("[<i>erased</i>]")(null, false);
      this.setState({isShowingModal_erase: false});
      this.props.toggleLeftSidePanelOpen();
  }

  handleEditIconLegendClose = () => {
      this.setState({isShowingLegend: false});
      this.props.toggleLeftSidePanelOpen();
  }

  handleEditIconLegendOpen = () => {
      this.props.toggleLeftSidePanelOpen();
      this.setState({isShowingLegend: true})
  }

  handleToggle = (ev) => {
      ev.preventDefault();
      const {origTextExpanded}  = this.state;
      origTextExpanded ? this.handleCollapse() : this.handleExpand();
  }

  handleExpand = () => {
      this.setState({ origTextExpanded: true, caretClassName: classes(styles.jef_caret, styles.jefCaretUp) });
  }

  handleCollapse = () => {
      this.setState({ origTextExpanded: false, caretClassName: classes(styles.jef_caret, styles.jefCaretDown) });
  }

  render() {
    const {labelClass, editDetailsByHrefId, personId, authorPersonId, leftSidePanelOpen, originalSentence, personConfig, editorColors,
                setNextHrefId, isTranslation, translatedSentence, editReview, editText, workSummary} = this.props;
    const {isShowingModal_single, isShowingModal_all, isShowingModal_blank, isShowingModal_config, deleteIndex, isShowingModal_comment,
                isShowingModal_erase, isShowingLegend, origTextExpanded} = this.state;

    let editPendingCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => m.pendingFlag).length : 0;
    let editHistoryCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => !m.pendingFlag).length : 0;
    //let thisUserText = editText;
    let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
    let thisUserText = hasUserEdit
        ? hasUserEdit.editText
        : (isTranslation
            ? (personConfig.translateInsertSuggestion
                ? translatedSentence
                : '')
            : originalSentence);

    var regex = "/<(.|\n)*?>/";
    let originalSentenceText = originalSentence;
    originalSentenceText = originalSentenceText && originalSentenceText.replace(regex, "")
            .replace(/<br>/g, "")
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();

    while (originalSentenceText.indexOf('&nbsp;') > -1) originalSentenceText = originalSentenceText.replace('&nbsp;', ' ');

    return (
        <div className={styles.container}>
            <div className={classes(labelClass, styles.editCount)} ref={(ref) => (this.button = ref)}>
                <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                <div className={styles.row}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                <a className={styles.closeButton} ref={(ref) => (this.closeButton = ref)}><L p={p} t={`Close`}/></a>
            </div>
            <div className={classes(styles.children, (leftSidePanelOpen && styles.opened))}>
                <div>
                    <div className={styles.row}>
                        <span className={styles.authorDateLine}><L p={p} t={`Original Text`}/></span>
                        {workSummary && workSummary.languageId_current === workSummary.nativeLanguageId &&
														<a onClick={this.handleToggle} className={styles.link}>
		                            {origTextExpanded ? <L p={p} t={`(hide)`}/> : <L p={p} t={`(show)`}/>}
		                        </a>
												}
												<div className={styles.languageName}>{workSummary.languageName}</div>
                    </div>
                    {(origTextExpanded || (workSummary && workSummary.languageId_current !== workSummary.nativeLanguageId)) &&
                        <span className={styles.authorSentence} ref={(ref) => (this.authorSentence = ref)} id="authorSentence">
                            {originalSentenceText}
                        </span>
                    }
                </div>
                {(origTextExpanded || (workSummary && workSummary.languageId_current !== workSummary.nativeLanguageId)) &&
                    <div className={styles.resetDiv}>
                        <a className={styles.resetButton} onClick={isTranslation ? this.handleResetToClear : this.handleResetToOriginal}><L p={p} t={`Reset`}/></a>
                    </div>
                }
                <div className={styles.outerBorder}>
                    <span className={styles.myEdit}><L p={p} t={`my edit:`}/></span>
                    <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: thisUserText}}
                        id="singleEditor" ref={ref => {this.singleEditor = ref}} onChange={this.handleTextChange}/>
                </div>
                <div className={styles.rowSpread}>
                    <div className={classes(styles.row, styles.topMargin)}>
                        <div>
                            <a onClick={this.handleCommentOpen}>
                                <Icon pathName={`comment_text`} premium={true} className={styles.lessMarginLeft} />
                            </a>
                            {isShowingModal_comment &&
                                <TextareaModal key={'all'} handleClose={this.handleCommentClose} heading={``} explain={``} placeholder={`Comment?`}
                                    onClick={this.handleCommentSave} sentenceChosen={originalSentenceText} currentSentenceText={thisUserText}
                                    commentText={editReview.hrefCommentByMe}/>
                            }
                        </div>
                        {!editReview.isTranslation &&
                            <div>
                                <a onClick={this.handleEraseConfirmOpen}>
                                    <Icon pathName={`eraser`} premium={true} className={styles.sentenceDelete}/>
                                </a>
                            </div>
                        }
                    </div>
                    <div className={styles.buttonRow}>
                        {isShowingModal_all &&
                          <MessageModal key={'all'} handleClose={this.handleAllDeleteClose} heading={<L p={p} t={`Delete All Edits and Comments?`}/>}
                             explainJSX={<L p={p} t={`Are you sure you want to delete all of the edits and comments for this sentence?`}/>} isConfirmType={true}
                             onClick={this.handleAllDeletes} />
                        }
                        {isShowingModal_blank &&
                          <MessageModal key={'empty'} handleClose={this.handleBlankClose} heading={<L p={p} t={`Translation is blank or empty?`}/>}
                             explainJSX={<L p={p} t={`It is not allowed to save a blank translation of a sentence.  Please check your entry and try again.`}/>} isConfirmType={false}
                             onClick={this.handleBlankClose} />
                        }
                        <a className={styles.cancelButton} ref={(ref) => (this.cancelButton = ref)}><L p={p} t={`Close`}/></a>
                        <button className={styles.saveButton} onClick={this.handleSave}><L p={p} t={`Save`}/></button>
                        {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.prevButton} onClick={() => setNextHrefId('PREV')}><L p={p} t={`Prev`}/></a>}
                        {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.nextButton} onClick={this.handleNextButton}><L p={p} t={`Next`}/></a>}

                        <a onClick={this.handleConfigOpen}>
                            <Icon pathName={`cog`} premium={true} className={styles.launchButton}/>
                        </a>

                        {isShowingModal_config &&
                            <ConfigModal personId={personId} personConfig={personConfig} updatePersonConfig={this.handleUpdatePersonConfig}
                                handleClose={this.handleConfigClose} heading={``} explain={``} isTranslation={isTranslation}/>
                        }
                    </div>
                </div>
								<div className={styles.row}>
										{personId === authorPersonId && editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
												<a className={styles.deleteAllButton} onClick={this.handleAllDeleteOpen}><L p={p} t={`Delete All`}/></a>
										}
										<Checkbox
												id={`editDifferenceView`}
												label={<L p={p} t={`Show changes`}/>}
												labelClass={styles.labelCheckbox}
												checked={personConfig.editDifferenceView}
												checkboxClass={styles.checkbox}
												onClick={() => {
														this.handleUpdatePersonConfig(personId, `EditDifferenceView`, !personConfig.editDifferenceView)
														//this.handleUpdatePersonConfig(personId, `EditDifferenceViewKeepOn`, !personConfig.editDifferenceView) //Notice that this is not the KeepOn version but the main editDifferenceView
												}}/>
								</div>

                {isTranslation &&
                    <div className={styles.editDisplay}>
                        <span className={styles.translateTitle}><L p={p} t={`Machine translation (not perfect)`}/></span>
                        <span className={styles.editText} dangerouslySetInnerHTML={{__html: translatedSentence}}/>
                        <span>
                            <a onClick={this.handleAcceptTranslation}>
                                <Icon pathName={`thumbs_up0`} premium={true} className={styles.choiceIcons}/>
                            </a>
                        </span>
                    </div>
                }

                <div className={styles.editDetails}>
                    {editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                        editDetailsByHrefId.map((m, i) => {
                            let differenceEditText = m.editText;  //eslint-disable-line
                            var regex = "/<(.|\n)*?>/";
                            differenceEditText = differenceEditText && differenceEditText.replace(regex, "")
                                   .replace(/<br>/g, "")
                                   .replace(/<[^>]*>/g, ' ')
                                   .replace(/\s{2,}/g, ' ')
                                   .trim();

                            while (differenceEditText.indexOf('&nbsp;') > -1) {
                                differenceEditText = differenceEditText.replace('&nbsp;', '');
                            }

                            let acceptFunction = personId === authorPersonId
                                    ? () => this.handleAcceptEdit(m.editDetailId)
                                    : () => this.handleVote(m.editDetailId, 'AGREE');

                        return (
                            <div className={styles.editDisplay} key={i}>
                                <span className={styles.authorDateLine}>
                                    {editorColors && <div className={styles.colorBox} style={{backgroundColor: editorColors[m.personId]}} />}
                                    {m.personName + ` - `}
                                    <DateMoment date={m.entryDate} />
                                    {m.isComment && <span className={styles.isComment}> <L p={p} t={`Comment`}/> </span>}
                                    {!m.pendingFlag && m.authorAccepted && <span className={styles.isAccepted}> <L p={p} t={`Accepted`}/> </span>}
                                    {!m.pendingFlag && !m.authorAccepted && <span className={styles.isProcessed}> <L p={p} t={`Processed`}/> </span>}
                                </span>
                                <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))} id={m.personId}>
                                    {m.editText.indexOf('<svg id="erased') > -1
                                        ? '[erased]'
                                        : !m.isComment && personConfig.editDifferenceView && originalSentenceText && differenceEditText
                                            ? <DiffWord inputA={originalSentenceText} inputB={differenceEditText} />
                                            : differenceEditText}
                                </span>
                                {m.pendingFlag &&
                                    <div className={styles.toolOptions}>
                                        {!m.isComment && m.personId !== personId &&
                                            <span className={styles.iconRow}>
                                                <a onClick={acceptFunction}>
                                                    <Icon pathName={`thumbs_up0`} premium={true} className={styles.choiceIcons}/>
                                                </a>
                                                <span className={styles.voteCount}>{m.agreeCount}</span>
                                            </span>
                                        }
                                        {m.personId !== personId &&
                                            <span className={styles.iconRow}>
                                                <a onClick={personId === authorPersonId ? () => this.handleSingleDelete(m.editDetailId) : () => this.handleVote(m.editDetailId, 'DISAGREE')}>
                                                    <Icon pathName={`thumbs_down0`} premium={true} className={styles.choiceIcons}/>
                                                </a>
                                                <span className={styles.voteCount}>{m.disagreeCount}</span>
                                            </span>
                                        }
                                        {m.personId !== personId &&
                                            <span className={styles.row}>
                                                <a onClick={() => this.handleVote(m.editDetailId, 'TROLL')} className={classes(styles.row, styles.moreLeft)}>
                                                    <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                                    <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                                                </a>
                                                <span className={styles.trollCount}>{m.trollCount}</span>
                                            </span>
                                        }
                                        {m.personId === personId &&
                                            <a onClick={() => this.handleSingleDeleteOpen(i)}>
                                                <Icon pathName={`undo2`} premium={true} className={styles.choiceIcons}/>
                                            </a>
                                        }
                                        {isShowingModal_single && deleteIndex === i &&
                                          <MessageModal key={i} handleClose={this.handleSingleDeleteClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                                             explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                                             onClick={() => this.handleSingleDelete(m.editDetailId)} />
                                        }

                                        {m.personId !== personId &&
                                            <a onClick={() => this.handleFullVersionView(m.personId)} className={styles.iconRow}>
                                                <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                                                <Icon pathName={`magnifier`} premium={true} className={styles.imageMagnifier}/>
                                            </a>
                                        }
                                        <span onClick={this.handleEditIconLegendOpen}>
                                            <Icon pathName={`info`} className={styles.choiceIcons}/>
                                        </span>
                                    </div>
                                }
                                {!m.pendingFlag &&
                                    <div className={styles.toolOptions}>
                                        <a className={styles.restoreButton} onClick={() => this.handleRestore(m.editDetailId)}><L p={p} t={`Restore`}/></a>
                                        {!m.isComment && m.personId !== personId &&
                                            <span>
                                                <Icon pathName={`thumbs_up0`} premium={true} className={styles.historyChoiceIcons}/>
                                                <span className={styles.voteCount}>{m.agreeCount}</span>
                                            </span>
                                        }
                                        {m.personId !== personId &&
                                            <span>
                                                <Icon pathName={`thumbs_down0`} premium={true} className={styles.historyChoiceIcons}/>
                                                <span className={styles.voteCount}>{m.disagreeCount}</span>
                                            </span>
                                        }
                                        {m.personId !== personId &&
                                            <span className={styles.row}>
                                                <div className={classes(styles.row, styles.moreLeft)}>
                                                    <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                                    <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                                                </div>
                                                <span className={styles.trollCount}>{m.trollCount}</span>
                                            </span>
                                        }
                                        <span onClick={this.handleEditIconLegendOpen}>
                                            <Icon pathName={`info`} className={styles.choiceIcons}/>
                                        </span>
                                    </div>
                                }
                            </div>
                            )}
                        )
                    }
                </div>
            </div>
            {isShowingModal_erase &&
              <MessageModal handleClose={this.handleEraseConfirmClose} heading={<L p={p} t={`Erase this Sentence?`}/>}
                 explainJSX={<L p={p} t={`Are you sure you want to erase this sentence?`}/>} isConfirmType={true}
                 currentSentenceText={thisUserText} onClick={this.handleEraseSentence} />
            }
            {isShowingLegend &&
                <MessageModal handleClose={this.handleEditIconLegendClose} heading={<L p={p} t={`Edit Icon Options`}/>} showEditIconLegend={true}
                    onClick={this.handleEditIconLegendClose} isAuthor={authorPersonId === personId}/>
            }
        </div>
    );
  }
};

export default SentenceEdits;


//  dangerouslySetInnerHTML={{__html: m.editText}}>
