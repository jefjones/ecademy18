/* See https://github.com/balloob/react-sidebar - this page was cloned to create this local component*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SidePanelDockable.css';
import classes from 'classnames';
import ReactTooltip from 'react-tooltip'
import ConfigModal from '../../components/ConfigModal';
import MessageModal from '../../components/MessageModal';
import DateMoment from '../../components/DateMoment';
import Icon from '../../components/Icon';
const p = 'component';
import L from '../../components/PageLanguage';
//import Diff from 'react-stylable-diff';

const CANCEL_DISTANCE_ON_SCROLL = 20;

const defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
    width: 320,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-in-out, right .3s ease-in-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-in-out, visibility .3s ease-in-out',
    backgroundColor: 'rgba(0,0,0,.3)',
    width: 320,
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
};

class SidePanelDockable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docked: this.props.mediaQuery === 'large',
      open: this.props.mediaQuery === 'large' || this.props.leftSidePanelOpen,

      // the detected width of the sidebar in pixels
      sidebarWidth: props.defaultSidebarWidth,

      // keep track of touching params
      touchIdentifier: null,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchCurrentY: null,

      // if touch is supported by the browser
      dragSupported: false,

      //Merged properties from the old EditsLeftSideOver
      newEditText: '',
      acceptedEditDetailId: 0, //  This works for the editor as well as the author so that only his last accepted/voted-up edit will apply.
      isShowingModal_single: false,
      isShowingModal_all: false,
      isShowingModal_blank: false,
      isShowingModal_config: false,
      deleteIndex: 0
    };

    this.overlayClicked = this.overlayClicked.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.saveSidebarRef = this.saveSidebarRef.bind(this);

    this.checkMediaQuerySize = this.checkMediaQuerySize.bind(this);

    //Merged functions from the old EditsLeftSideOver
    this.handleDisplay = this.handleDisplay.bind(this);
    this.handleClosed = this.handleClosed.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSingleDelete = this.handleSingleDelete.bind(this);
    this.handleAllDeletes = this.handleAllDeletes.bind(this);
    this.handleSingleDeleteClose = this.handleSingleDeleteClose.bind(this);
    this.handleSingleDeleteOpen = this.handleSingleDeleteOpen.bind(this);
    this.handleAllDeleteClose = this.handleAllDeleteClose.bind(this);
    this.handleAllDeleteOpen = this.handleAllDeleteOpen.bind(this);
    this.handleConfigClose = this.handleConfigClose.bind(this);
    this.handleConfigOpen = this.handleConfigOpen.bind(this);
    this.handleAcceptTranslation = this.handleAcceptTranslation.bind(this);
    this.checkForKeypress = this.checkForKeypress.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
  }

  componentDidMount() {
    //document.getElementById('singleEditor').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
    this.singleEditor.addEventListener('keyup', this.checkForKeypress);

    this.setState({
      dragSupported: typeof window === 'object' && 'ontouchstart' in window,
    });
    this.saveSidebarWidth();
    this.checkMediaQuerySize();

    //Merged details from the old EditsLeftSideOver
    const {editDetailsByHrefId, personId, originalSentence, personConfig, isTranslation, translatedSentence} = this.props;
    //document.body.addEventListener("click", this.handleClosed);
    //We are taking away the button reaction since we needed the real estate at the bottom of the screen and above the tool bar.  Double clicking on a sentence will open up the left pane.
    //this.button.addEventListener("click", this.handleDisplay);  //We don't want to have a click here since it is so close to the options buttons below it.
    this.cancelButton.addEventListener("click", this.handleClosed);
    this.closeButton.addEventListener("click", this.handleClosed);
    if (isTranslation) {
        this.resetButton.addEventListener("click", this.handleResetToClear);
    } else {
        this.resetButton.addEventListener("click", this.handleResetToOriginal);
    }

    let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
    //If this isTranslation and the user doesn't have an edit that they have provided, then set thisUserText to blank
    //  so the user can either choose a translation helper below (from bing or google) or start typing on their own.
    let thisUserText = hasUserEdit
        ? hasUserEdit.editText
        : (isTranslation
            ? (personConfig.translateInsertSuggestion
                ? translatedSentence
                : '')
            : originalSentence);

    this.setState({ newEditText: thisUserText})
    this.setState({ keepHistoryOn: personConfig.historySentenceView})
    this.setState({ keepAutoNextOn: personConfig.nextSentenceAuto})
    this.setState({ keepEditDifferenceOn: personConfig.editDifferenceView})

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
    // filter out the updates when we're touching
    if (!this.isTouching()) {
      this.saveSidebarWidth();
    }
    this.checkMediaQuerySize();
  }

  handleNextButton() {
      document.getElementById('singleEditor').innerHTML = ""; //That's in case there isn't another sentence to pick up.
      this.props.setNextHrefId();
  }
  checkForKeypress(evt) {
      evt.key === 'Escape' && this.props.toggleLeftSidePanelOpen();
  }

  checkMediaQuerySize() {
      if (this.props.mediaQuery === 'large' && !this.state.docked) {
          this.props.toggleLeftSidePanelOpen();
          this.setState({docked: true, open: true});
      } else if (this.props.mediaQuery === 'small' && this.state.docked && !this.props.leftSidePanelOpen) {
          this.props.toggleLeftSidePanelOpen();
          this.setState({docked: false, open: false});
      }
  }

  onTouchStart(ev) {
    // filter out if a user starts swiping with a second finger
    if (!this.isTouching()) {
      const touch = ev.targetTouches[0];
      this.setState({
        touchIdentifier: touch.identifier,
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
        touchCurrentX: touch.clientX,
        touchCurrentY: touch.clientY,
      });
    }
  }

  onTouchMove(ev) {
    if (this.isTouching()) {
      for (let ind = 0; ind < ev.targetTouches.length; ind++) {
        // we only care about the finger that we are tracking
        if (ev.targetTouches[ind].identifier === this.state.touchIdentifier) {
          this.setState({
            touchCurrentX: ev.targetTouches[ind].clientX,
            touchCurrentY: ev.targetTouches[ind].clientY,
          });
          break;
        }
      }
    }
  }

  onTouchEnd() {
    if (this.isTouching()) {
      // trigger a change to open if sidebar has been dragged beyond dragToggleDistance
      const touchWidth = this.touchSidebarWidth();

      if ((this.props.open && touchWidth < this.state.sidebarWidth - this.props.dragToggleDistance)
            || (!this.props.open && touchWidth > this.props.dragToggleDistance)) {
        this.props.onSetOpen(!this.props.open);
      }

      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchCurrentY: null,
      });
    }
  }

  // This logic helps us prevents the user from sliding the sidebar horizontally
  // while scrolling the sidebar vertically. When a scroll event comes in, we're
  // cancelling the ongoing gesture if it did not move horizontally much.
  onScroll() {
    if (this.isTouching() && this.inCancelDistanceOnScroll()) {
      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchCurrentY: null,
      });
    }
  }

  // True if the on going gesture X distance is less than the cancel distance
  inCancelDistanceOnScroll() {
    let cancelDistanceOnScroll;

    if (this.props.pullRight) {
      cancelDistanceOnScroll = Math.abs(this.state.touchCurrentX - this.state.touchStartX) <
                                        CANCEL_DISTANCE_ON_SCROLL;
    } else {
      cancelDistanceOnScroll = Math.abs(this.state.touchStartX - this.state.touchCurrentX) <
                                        CANCEL_DISTANCE_ON_SCROLL;
    }
    return cancelDistanceOnScroll;
  }

  isTouching() {
    return this.state.touchIdentifier !== null;
  }

  overlayClicked() {
    if (this.props.open) {
      this.props.onSetOpen(false);
    }
  }

  saveSidebarWidth() {
    const width = this.sidebar.offsetWidth;

    if (width !== this.state.sidebarWidth) {
      this.setState({sidebarWidth: width});
    }
  }

  saveSidebarRef(node) {
    this.sidebar = node;
  }

  // calculate the sidebarWidth based on current touch info
  touchSidebarWidth() {
    // if the sidebar is open and start point of drag is inside the sidebar
    // we will only drag the distance they moved their finger
    // otherwise we will move the sidebar to be below the finger.
    if (this.props.pullRight) {
      if (this.props.open && window.innerWidth - this.state.touchStartX < this.state.sidebarWidth) {
        if (this.state.touchCurrentX > this.state.touchStartX) {
          return this.state.sidebarWidth + this.state.touchStartX - this.state.touchCurrentX;
        }
        return this.state.sidebarWidth;
      }
      return Math.min(window.innerWidth - this.state.touchCurrentX, this.state.sidebarWidth);
    }

    if (this.props.open && this.state.touchStartX < this.state.sidebarWidth) {
      if (this.state.touchCurrentX > this.state.touchStartX) {
        return this.state.sidebarWidth;
      }
      return this.state.sidebarWidth - this.state.touchStartX + this.state.touchCurrentX;
    }
    return Math.min(this.state.touchCurrentX, this.state.sidebarWidth);
  }

  //Functions from the old EditsLeftSideOver
  componentWillUnmount() {
      const {editDetailsByHrefId, personId, originalSentence, isTranslation} = this.props;
      //document.body.removeEventListener("click", this.handleClosed);
      let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
      let thisUserText = hasUserEdit ? hasUserEdit.editText : (isTranslation ? '' : originalSentence);
      this.setState({ newEditText: thisUserText})
  }

  handleDisplay(ev) {
      let {toggleLeftSidePanelOpen, setSentenceChosen, editReview} = this.props;
      setSentenceChosen(editReview.sentenceChosen);
      ev.stopPropagation();
      toggleLeftSidePanelOpen();
  }

  handleClosed() {
      let {toggleLeftSidePanelOpen, personConfig} = this.props;
      toggleLeftSidePanelOpen();
      personConfig && !personConfig.historySentenceView && this.setState({ keepHistoryOn: false});
      personConfig && !personConfig.nextSentenceAuto && this.setState({ keepAutoNextOn: false})
      personConfig && !personConfig.editDifferenceView && this.setState({ keepEditDifferenceOn: false})
  }

  handleAcceptTranslation() {
      document.getElementById('singleEditor').innerHTML = this.props.translatedSentence;
  }

  handleResetToOriginal() {
      document.getElementById('singleEditor').innerHTML = document.getElementById('authorSentence').innerHTML;
  }

  handleResetToClear() {
      document.getElementById('singleEditor').innerHTML = '';
  }

  handleAcceptEdit(editDetailId) {
      //The accepting of an edit will commit Me to taking that editText into the editor window.  They can still make an edit to the edit.
      //But overall this implies that they consider the edit a favorable option so that they will be scored well for it.
      //When the author accepts it, it is higher than if it is just another editor.  So ... only one acceptedEditDetailId per sentence for this page.
      const {editDetailsByHrefId} = this.props;
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
      if (editDetail) {
          if (editDetail.editText === "[<i>erased</i>]") {
              document.getElementById('singleEditor').innerHTML = "";
          } else {
              document.getElementById('singleEditor').innerHTML = editDetail.editText;
          }
          this.setState({ acceptedEditDetailId: editDetail.editDetailId });
      }
  }

  handleSave() {
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

  handleVote(editDetailId, voteType) {
      const {editDetailsByHrefId, saveEditVote} = this.props;
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
      if (voteType === "AGREE") {
          document.getElementById('singleEditor').innerHTML = editDetail.editText;
      }
      if (editDetail) {
          //We are going to have to handle the Paragraph details, too.  For now we will just consider the editDetailId
          //The paragraph has two different IDs:  one for existing and one for new.  Maybe they can be combined.
          //ToDo: Maybe (most likely?) implement a voter comment about their choice for troll or disagree.  See VoteComment in position 4
          //isParagraph is the last position (set as false by default for now.)
          saveEditVote(editDetail.editDetailId, voteType, editDetail.personId, editDetail.editText, "", editDetail.isComment, false);
      }
  }

  handleSingleDelete(editDetailId) {
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

  handleRestore(editDetailId, voteType) {
      const {restoreEditOrComment, editDetailsByHrefId} = this.props;
      let editDetail = editDetailsByHrefId.filter(m => m.editDetailId === editDetailId)[0] || [];
      if (editDetail) {
          restoreEditOrComment(editDetail.editDetailId);
      }
  }

  handleAllDeletes() {
      const {deleteEditOrComment, editDetailsByHrefId} = this.props;
      this.setState({ isShowingModal_all: false })
      editDetailsByHrefId.forEach(m => {
          deleteEditOrComment(m.editDetailId);
      });
  }

  handleTextChange(e) {
      this.setState({ newEditText: e.target.value});
  }

  handleFullVersionView(tabPersonId) {
      this.props.setTabSelected(tabPersonId, true); //force the full version view so that the tabs are displayed in the tool area above automatically.
      this.props.toggleLeftSidePanelOpen();
  }

  handleSingleDeleteClose = () => this.setState({isShowingModal_single: false})
  handleSingleDeleteOpen = (deleteIndex) => this.setState({isShowingModal_single: true, deleteIndex,})
  handleAllDeleteClose = () => this.setState({isShowingModal_all: false})
  handleAllDeleteOpen = () => this.setState({isShowingModal_all: true})
  handleBlankClose = () => this.setState({isShowingModal_blank: false})
  handleBlankOpen = () => this.setState({isShowingModal_blank: true})
  handleConfigClose = () => this.setState({isShowingModal_config: false})
  handleConfigOpen = () => this.setState({isShowingModal_config: true})

  //******************END Of functions from EditsLeftSideOver

  render() {
    const sidebarStyle = {...defaultStyles.sidebar, ...this.props.styles.sidebar};
    const contentStyle = {...defaultStyles.content, ...this.props.styles.content};
    const overlayStyle = {...defaultStyles.overlay, ...this.props.styles.overlay};
    const useTouch = this.state.dragSupported && this.props.touch;
    const isTouching = this.isTouching();
    const rootProps = {
      className: this.props.rootClassName,
      style: {...defaultStyles.root, ...this.props.styles.root},
      role: "navigation",
    };
    let dragHandle;

    // sidebarStyle right/left
    if (this.props.pullRight) {
      sidebarStyle.right = 0;
      sidebarStyle.transform = 'translateX(100%)';
      sidebarStyle.WebkitTransform = 'translateX(100%)';
      if (this.props.shadow) {
        sidebarStyle.boxShadow = '-2px 2px 4px rgba(0, 0, 0, 0.15)';
      }
    } else {
      sidebarStyle.left = 0;
      sidebarStyle.transform = 'translateX(-100%)';
      sidebarStyle.WebkitTransform = 'translateX(-100%)';
      if (this.props.shadow) {
        sidebarStyle.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.15)';
      }
    }

    if (isTouching) {
      const percentage = this.touchSidebarWidth() / this.state.sidebarWidth;

      // slide open to what we dragged
      if (this.props.pullRight) {
        sidebarStyle.transform = `translateX(${(1 - percentage) * 100}%)`;
        sidebarStyle.WebkitTransform = `translateX(${(1 - percentage) * 100}%)`;
      } else {
        sidebarStyle.transform = `translateX(-${(1 - percentage) * 100}%)`;
        sidebarStyle.WebkitTransform = `translateX(-${(1 - percentage) * 100}%)`;
      }

      // fade overlay to match distance of drag
      overlayStyle.opacity = percentage;
      overlayStyle.visibility = 'visible';
    } else if (this.props.docked) {
      // show sidebar
      if (this.state.sidebarWidth !== 0) {
        sidebarStyle.transform = `translateX(0%)`;
        sidebarStyle.WebkitTransform = `translateX(0%)`;
      }

      // make space on the left/right side of the content for the sidebar
      if (this.props.pullRight) {
        contentStyle.right = `${this.state.sidebarWidth}px`;
      } else {
        contentStyle.left = `${this.state.sidebarWidth}px`;
      }
    } else if (this.props.open) {
      // slide open sidebar
      sidebarStyle.transform = `translateX(0%)`;
      sidebarStyle.WebkitTransform = `translateX(0%)`;

      // show overlay
      overlayStyle.opacity = 1;
      overlayStyle.visibility = 'visible';
    }

    if (isTouching || !this.props.transitions) {
      sidebarStyle.transition = 'none';
      sidebarStyle.WebkitTransition = 'none';
      contentStyle.transition = 'none';
      overlayStyle.transition = 'none';
    }

    if (useTouch) {
      if (this.props.open) {
        rootProps.onTouchStart = this.onTouchStart;
        rootProps.onTouchMove = this.onTouchMove;
        rootProps.onTouchEnd = this.onTouchEnd;
        rootProps.onTouchCancel = this.onTouchEnd;
        rootProps.onScroll = this.onScroll;
      } else {
        const dragHandleStyle = {...defaultStyles.dragHandle, ...this.props.styles.dragHandle};
        dragHandleStyle.width = this.props.touchHandleWidth;

        // dragHandleStyle right/left
        if (this.props.pullRight) {
          dragHandleStyle.right = 0;
        } else {
          dragHandleStyle.left = 0;
        }

        dragHandle = (
          <div style={dragHandleStyle}
               onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove}
               onTouchEnd={this.onTouchEnd} onTouchCancel={this.onTouchEnd} />);
      }
    }

    //Constants and variables from EditsLeftSideOver
    const {labelClass, editDetailsByHrefId, personId, authorPersonId, leftSidePanelOpen, originalSentence, personConfig,
                updatePersonConfig, setNextHrefId, isTranslation, translatedSentence} = this.props;
    const {isShowingModal_single, isShowingModal_all, isShowingModal_blank, isShowingModal_config, deleteIndex} = this.state;

    let editPendingCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => m.pendingFlag).length : 0;
    let editHistoryCount = editDetailsByHrefId && editDetailsByHrefId.length > 0 ? editDetailsByHrefId.filter(m => !m.pendingFlag).length : 0;
    let hasUserEdit = editDetailsByHrefId && editDetailsByHrefId.length > 0 && editDetailsByHrefId.filter(m => m.personId === personId && !m.isComment)[0];
    let thisUserText = hasUserEdit
        ? hasUserEdit.editText
        : (isTranslation
            ? (personConfig.translateInsertSuggestion
                ? translatedSentence
                : '')
            : originalSentence);


    let originalSentenceText = originalSentence;
    originalSentenceText = originalSentenceText && originalSentenceText
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .trim();

    return (
      <div {...rootProps}>
        <div className={this.props.sidebarClassName} style={sidebarStyle} ref={this.saveSidebarRef} id="saveSidebarRef">
            <div className={styles.container}>
                <div className={classes(labelClass, styles.editCount)} ref={(ref) => (this.button = ref)}>
                    <div className={styles.row}><L p={p} t={`edits:`}/><div>{editPendingCount}</div></div>
                    <div className={styles.row}><L p={p} t={`history:`}/><div>{editHistoryCount}</div></div>
                </div>
                <div className={classes(styles.children, (leftSidePanelOpen && styles.opened))}>
                    <a className={styles.closeButton} ref={(ref) => (this.closeButton = ref)}>X</a>
                    <span className={styles.authorDateLine}><L p={p} t={`Original Text`}/></span>
                    <span className={styles.authorSentence} ref={(ref) => (this.authorSentence = ref)}
                        id="authorSentence">{originalSentenceText}</span>
                    <div className={styles.resetDiv}>
                        <a className={styles.resetButton} ref={(ref) => (this.resetButton = ref)}><L p={p} t={`Reset`}/></a>
                    </div>
                    <div className={styles.outerBorder}>
                        <span className={styles.myEdit}><L p={p} t={`my edit:`}/></span>
                        <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: thisUserText}}
                            id="singleEditor" ref={ref => {this.singleEditor = ref}} onChange={this.handleTextChange}/>
                    </div>
                    <div className={styles.buttonRow}>
                        {personId === authorPersonId && editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                            <a className={styles.deleteAllButton} onClick={this.handleAllDeleteOpen}>Delete All</a>
                        }
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
                        <a className={styles.cancelButton} ref={(ref) => (this.cancelButton = ref)}><L p={p} t={`Cancel`}/></a>
                        <button className={styles.saveButton} onClick={this.handleSave}><L p={p} t={`Save`}/></button>
                        {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.prevButton} onClick={() => setNextHrefId('PREV')}><L p={p} t={`Prev`}/></a>}
                        {(isTranslation || personConfig.nextSentenceAuto) && <a className={styles.nextButton} onClick={this.handleNextButton}><L p={p} t={`Next`}/></a>}

                        <a onClick={this.handleConfigOpen}>
                            <Icon pathName={`sound_board`} className={styles.launchButton}/>
                        </a>

                        {isShowingModal_config &&
                            <ConfigModal personId={personId} personConfig={personConfig} updatePersonConfig={updatePersonConfig}
                                handleClose={this.handleConfigClose} heading={``} explain={``} isTranslation={isTranslation}/>
                        }
                    </div>

                    {isTranslation &&
                        <div className={styles.editDisplay}>
                            <span className={styles.translateTitle}><L p={p} t={`Machine translation (not perfect)`}/></span>
                            <span className={styles.editText} dangerouslySetInnerHTML={{__html: translatedSentence}}/>
                            <span>
                                <a onClick={this.handleAcceptTranslation}>
                                    <Icon pathName={`checkmark`} className={styles.choiceIcons}/>
                                </a>
                            </span>
                        </div>
                    }

                    <div className={styles.editDetails}>
                        {editDetailsByHrefId && editDetailsByHrefId.length > 0 &&
                            editDetailsByHrefId.map((m, i) => {
                                let tooltipText = "";
                                if (m.pendingFlag) {
                                    tooltipText += !m.isComment && m.personId !== personId ? <div><strong><L p={p} t={`Accept and choose this edit.`}/></strong>  <L p={p} t={`You can edit it further.  This will score this edit favorably.`}/></div> : "";
                                    tooltipText += personId === authorPersonId ? <L p={p} t={`All other edits which haven't been deleted (rejected) will be scored minimally for effort.`}/> : "";
                                    tooltipText += m.personId !== personId  ? <div><strong><L p={p} t={`Disagree with this edit.`}/></strong> <L p={p} t={`But use this sparingly since this decreases the user's score.  Please, be courteous.`}/></div> : "";
                                    tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`Troll!`}/></strong> <L p={p} t={`Use this tool to mark the entry as obnoxious or destructive.  The author ought to take away access for this editor.`}/></div> : "";
                                    tooltipText += (m.personId === personId || personId === authorPersonId) ? <div><strong><L p={p} t={`Delete.`}/></strong>  <L p={p} t={`You can delete your own edits or, if you are the author, you can delete others' edits.`}/></div> : "";
                                    tooltipText += m.personId !== personId ? <div><strong><L p={p} t={`See this editor's full version.`}/></strong> <L p={p} t={`This will return you to the main screen and automatically choose the tab where you can read their full version with their edits marked.`}/></div> : "";
                                } else {
                                    tooltipText += <div><strong><L p={p} t={`Restore`}/></strong>  <L p={p} t={`This is a processed edit.  It is showing up because your settings indicate that you want to view this sentence's history.  You can click on 'restore' in order to have a chance to accept it or edit it further.`}/></div>;
                                }

                                let differenceOriginalSentence = originalSentence  //eslint-disable-line
                                let differenceEditText = m.editText;  //eslint-disable-line
                                if (personConfig.editDifferenceView) {
                                    differenceOriginalSentence = differenceOriginalSentence && differenceOriginalSentence
                                        .replace(/<[^>]*>/g, ' ')
                                       .replace(/\s{2,}/g, ' ')
                                       .trim();
                                    differenceEditText = differenceEditText && differenceEditText
                                        .replace(/<[^>]*>/g, ' ')
                                       .replace(/\s{2,}/g, ' ')
                                       .trim();
                                }

                                let acceptFunction = personId === authorPersonId
                                        ? () => this.handleAcceptEdit(m.editDetailId)
                                        : () => this.handleVote(m.editDetailId, 'AGREE');

                            return (
                                <div className={styles.editDisplay} key={i}>
                                    <span className={styles.authorDateLine}>
                                        {m.personName + ` - `}
                                        <DateMoment date={m.entryDate} className={styles.authorDateLine}/>
                                        {m.isComment && <span className={styles.isComment}> <L p={p} t={`Comment`}/> </span>}
                                        {!m.pendingFlag && m.authorAccepted && <span className={styles.isAccepted}> <L p={p} t={`Accepted`}/> </span>}
                                        {!m.pendingFlag && !m.authorAccepted && <span className={styles.isProcessed}> <L p={p} t={`Processed`}/> </span>}
                                    </span>
                                        <span className={classes(styles.editText, (m.isComment ? styles.isCommentText : ''))}
                                            id={m.personId} dangerouslySetInnerHTML={{__html: m.editText}}/>
                                    {m.pendingFlag &&
                                        <div className={styles.toolOptions}>
                                            {!m.isComment && m.personId !== personId &&
                                                <span className={styles.iconRow}>
                                                    <a onClick={acceptFunction}>
                                                        <Icon pathName={`checkmark`} className={styles.choiceIcons}/>
                                                    </a>
                                                    <span className={classes(styles.voteCount, styles.checkmarkCount)}>{m.agreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span className={styles.iconRow}>
                                                    <a onClick={personId === authorPersonId ? () => this.handleSingleDeleteOpen(i) : () => this.handleVote(m.editDetailId, 'DISAGREE')}>
                                                        <Icon pathName={`cross`} className={classes(styles.choiceIcons, styles.smaller)}/>
                                                    </a>
                                                    <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span className={styles.iconRow}>
                                                    <a onClick={() => this.handleVote(m.editDetailId, 'TROLL')}>
                                                        <Icon pathName={`blocked`} className={classes(styles.choiceIcons, styles.bitSmaller)}/>
                                                    </a>
                                                    <span className={styles.voteCount}>{m.trollCount}</span>
                                                </span>
                                            }
                                            {m.personId === personId &&
                                                <a onClick={() => this.handleSingleDeleteOpen(i)}>
                                                    <Icon pathName={`garbage_bin`} className={styles.choiceIcons}/>
                                                </a>
                                            }
                                            {isShowingModal_single && deleteIndex === i &&
                                              <MessageModal key={i} handleClose={this.handleSingleDeleteClose} heading={<L p={p} t={`Delete this Edit?`}/>}
                                                 explainJSX={<L p={p} t={`Are you sure you want to delete this edit?`}/>} isConfirmType={true}
                                                 onClick={() => this.handleSingleDelete(m.editDetailId)} />
                                            }

                                            {m.personId !== personId &&
                                                <a onClick={() => this.handleFullVersionView(m.personId)}>
                                                    <Icon pathName={`docs_compare`} className={styles.choiceIcons}/>
                                                </a>
                                            }
                                            <span data-html={true} data-tip={tooltipText}>
                                                <Icon pathName={`info`} className={styles.choiceIcons}/>
                                                <ReactTooltip place="left" type="light" effect="solid" className={styles.tooltip} event={`click`}/>
                                            </span>
                                        </div>
                                    }
                                    {!m.pendingFlag &&
                                        <div className={styles.toolOptions}>
                                            <a className={styles.restoreButton} onClick={() => this.handleRestore(m.editDetailId)}><L p={p} t={`Restore`}/></a>
                                            {!m.isComment && m.personId !== personId &&
                                                <span>
                                                    <Icon pathName={`checkmark`} className={styles.historyChoiceIcons}/>
                                                    <span className={styles.voteCount}>{m.agreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span>
                                                    <Icon pathName={`cross`} className={styles.historyChoiceIcons}/>
                                                    <span className={styles.voteCount}>{m.disagreeCount}</span>
                                                </span>
                                            }
                                            {m.personId !== personId &&
                                                <span>
                                                    <Icon pathName={`blocked`} className={styles.historyChoiceIcons}/>
                                                    <span className={styles.voteCount}>{m.trollCount}</span>
                                                </span>
                                            }
                                            <span data-html={true} data-tip={tooltipText}>
                                                <Icon pathName={`info`} className={styles.choiceIcons}/>
                                                <ReactTooltip place="left" type="light" effect="solid" className={styles.tooltip} event={`click`}/>
                                            </span>
                                        </div>
                                    }
                                </div>
                                )}
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className={this.props.overlayClassName}
             style={overlayStyle}
             role="presentation"
             tabIndex="0"
             onClick={this.overlayClicked}
          />
        <div className={this.props.contentClassName} style={contentStyle}>
          {dragHandle}
          {this.props.children}
        </div>
      </div>
    );
  }
}

SidePanelDockable.propTypes = {
  // main content to render
  children: PropTypes.node.isRequired,

  // styles
  styles: PropTypes.shape({
    root: PropTypes.object,
    content: PropTypes.object,
    overlay: PropTypes.object,
    dragHandle: PropTypes.object,
  }),

  // root component optional class
  rootClassName: PropTypes.string,

  // sidebar optional class
  sidebarClassName: PropTypes.string,

  // content optional class
  contentClassName: PropTypes.string,

  // overlay optional class
  overlayClassName: PropTypes.string,

  // boolean if sidebar should be docked
  docked: PropTypes.bool,

  // boolean if sidebar should slide open
  open: PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: PropTypes.bool,

  // max distance from the edge we can start touching
  touchHandleWidth: PropTypes.number,

  // Place the sidebar on the right
  pullRight: PropTypes.bool,

  // Enable/Disable sidebar shadow
  shadow: PropTypes.bool,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: PropTypes.number,

  // callback called when the overlay is clicked
  onSetOpen: PropTypes.func,

  // Intial sidebar width when page loads
  defaultSidebarWidth: PropTypes.number,
};

SidePanelDockable.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  touchHandleWidth: 20,
  pullRight: false,
  shadow: true,
  dragToggleDistance: 30,
  onSetOpen: () => {},
  styles: {},
  defaultSidebarWidth: 0,  //Jef changed
};

export default SidePanelDockable;
