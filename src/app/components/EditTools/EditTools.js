import React, {Component} from 'react';
import styles from './EditTools.css';
import MenuEditModes from '../MenuEditModes';
import MenuInline from '../MenuInline';
import classes from 'classnames';
import Icon from '../Icon';
import MessageModal from '../MessageModal';
import TextareaModal from '../TextareaModal';
import Media from "react-media";
const p = 'component';
import L from '../../components/PageLanguage';

export default class EditTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingSubMenu: false,
            isShowingModal_comment: false,
            isShowingModal_sentence: false,
            isShowingModal_erase: false,
        };
    }

    componentDidMount() {
        document.body.addEventListener('keyup', this.checkEscapeKey);
        document.body.addEventListener('click', this.closeSubMenu); //, true
    }

    componentWillUnmount() {
        document.body.removeEventListener('keyup', this.checkEscapeKey);
        document.body.removeEventListener('click', this.closeSubMenu);
    }

    checkEscapeKey = (evt) => {
        if (evt.key === 'Escape') {
            this.setState({ isShowingSubMenu: false });
        }
    }

    closeSubMenu = () => {
        this.setState({ isShowingSubMenu: false });
    }

    handleToggleSubMenu = () => {
        this.setState({ isShowingSubMenu: !this.state.isShowingSubMenu });
    }

    handleCommentSave = (commentText) => {
        this.props.saveEditOrComment(true)(commentText)(null, false);
        this.setState({isShowingModal_comment: false})
    }

    handleCommentClose = () => { this.setState({isShowingModal_comment: false}) }
    handleCommentOpen = () => { this.setState({isShowingModal_comment: true}) }
    handleSentenceClose = () => { this.setState({isShowingModal_sentence: false}) }
    handleSentenceOpen = () => { this.setState({isShowingModal_sentence: true}) }
    handleDeleteEditClose = () => { this.setState({isShowingModal_deleteEdit: false}) }
    handleDeleteEditOpen = () => { this.setState({isShowingModal_deleteEdit: true}) }
    handleEraseConfirmClose = () => { this.setState({isShowingModal_erase: false}) }
    handleEraseConfirmOpen = () => { this.setState({isShowingModal_erase: true}) }

    handleEraseSentence = () => {
        const {saveEditOrComment} = this.props;
        saveEditOrComment(false)("[<i>erased</i>]")(null, false);
        this.setState({isShowingModal_erase: false});
    }

    render() {
        const {className, setEditOptionTools, setEditMode, editReview, showInstructions, personId, workSummary, deleteWork,
                deleteChapter, setWorkCurrentSelected, setAddInstructions, editMode, toggleLeftSidePanelOpen, sentenceChosen, isDraftView,
                tabsData, draftComparison, editorTabChosen, counts={}, handleShowInstructions, currentSentence, authorPersonId} = this.props;
        const {isShowingSubMenu, isShowingModal_sentence, isShowingModal_comment, isShowingModal_erase} = this.state;

        // let isSentenceEditable = false;
        // if (sentenceChosen) {
        //     if (isDraftView) {
        //         isSentenceEditable = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false;
        //     } else {
        //         isSentenceEditable = true;
        //     }
        // }
        let isDraftCurrentTab = true;
        if (isDraftView) {
            isDraftCurrentTab = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false;
        }

        return (
            <div className={classes(className, styles.container, styles.row)}>
                <div className={styles.row}>
                    <div className={styles.row} data-rh={`Left side panel shows editors' edits`}>
                        <a onClick={toggleLeftSidePanelOpen}>
                            <Icon pathName={`left_panel`} premium={true} className={classes(styles.imageLeftSide, styles.bitSmaller)}/>
                        </a>
                        <span className={styles.sentenceEditCount}>{counts.sentenceEdits}</span>
                    </div>
                    <div data-rh={`Enter a comment for a sentence.`}>
                        <a onClick={sentenceChosen ? this.handleCommentOpen : this.handleSentenceOpen}>
                            <Icon pathName={`comment_text`} premium={true} className={classes(styles.imageLeftSide, (sentenceChosen ? '' : styles.grayedOut), (isDraftCurrentTab ? '' : styles.hidden))} />
                        </a>
                        {isShowingModal_comment && sentenceChosen &&
                            <TextareaModal key={'all'} handleClose={this.handleCommentClose} heading={``} explain={``} placeholder={<L p={p} t={`Comment?`}/>}
                                onClick={this.handleCommentSave} sentenceChosen={sentenceChosen} currentSentenceText={currentSentence}
                                commentText={editReview.hrefCommentByMe}/>
                        }
                    </div>
                    {!editReview.isTranslation &&
                        <div data-custom={`Erase the chosen sentence.`}>
                            <a onClick={sentenceChosen ? this.handleEraseConfirmOpen : this.handleSentenceOpen}>
                                <Icon pathName={`eraser`} premium={true} className={classes(styles.imageScissors, styles.bitBigger, (sentenceChosen ? '' : styles.grayedOut), (isDraftCurrentTab ? '' : styles.hidden))}/>
                            </a>
                        </div>
                    }
                    <div className={styles.row}  data-rh={'Search for text'}>
                        <a onClick={() => setEditOptionTools(`SearchTextTool`)}>
                            <Icon pathName={`magnifier`} premium={true} className={styles.imageScissors}/>
                        </a>
                    </div>
                    <div className={styles.row} data-rh={'Bookmark sentences'}>
                        <a onClick={() => setEditOptionTools(`BookmarkTool`)}>
                            <Icon pathName={`bookmark2`} premium={true} className={styles.imageScissors}/>
                        </a>
                    </div>
                </div>
                {editMode === 'breakNew' &&
                    <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                        <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                        <L p={p} t={`STEPS`}/>
                    </button>
                }
                {editMode === 'breakDelete' &&
                    <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                        <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                        <L p={p} t={`STEPS`}/>
                    </button>
                }
                {editMode === 'sentenceMove' &&
                    <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                        <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                        <L p={p} t={`STEPS`}/>
                    </button>
                }
                {editMode === 'imageNew' &&
                    <button className={styles.editButton} onClick={() => setAddInstructions(true)}>
                        <div className={styles.smallText}><L p={p} t={`Edit Mode`}/></div>
                        <L p={p} t={`STEPS`}/>
                    </button>
                }

                {!showInstructions && personId !== authorPersonId &&
                    <Media query="(max-width: 799px)">
                      {matches =>
                        matches || workSummary.authorPersonId === personId ? (
                            <MenuEditModes opened={isShowingSubMenu} toggleOpen={this.handleToggleSubMenu} setEditOptionTools={setEditOptionTools}
                                className={styles.subMenu} personId={personId} workSummary={workSummary} infoShow={this.handleToolLegendOpen}
                                deleteWork={deleteWork} deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected}
                                editReview={editReview} setEditMode={setEditMode} handleShowInstructions={handleShowInstructions}
                                tooltipDirection='right'/>
                        ) : (
                            <MenuInline setEditOptionTools={setEditOptionTools}
                                className={styles.inlineMenu} personId={personId} workSummary={workSummary} infoShow={this.handleToolLegendOpen}
                                deleteWork={deleteWork} deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected}
                                editReview={editReview} setEditMode={setEditMode} handleShowInstructions={handleShowInstructions}
                                tooltipDirection='bottom'/>
                        )
                      }
                    </Media>
                 }
                 {isShowingModal_sentence &&
                    <MessageModal handleClose={this.handleSentenceClose} heading={<L p={p} t={`Choose a sentence`}/>}
                        explainJSX={<L p={p} t={`You must first choose a sentence before choosing this option.`}/>}
                        onClick={this.handleSentenceClose}/>
                  }
                  {isShowingModal_erase &&
                    <MessageModal handleClose={this.handleEraseConfirmClose} heading={<L p={p} t={`Erase this Sentence?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to erase this sentence?`}/>} isConfirmType={true}
                       currentSentenceText={currentSentence} onClick={this.handleEraseSentence} />
                  }
          </div>
        )
    }
};
