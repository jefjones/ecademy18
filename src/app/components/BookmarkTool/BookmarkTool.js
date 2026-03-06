import React, {Component} from 'react';
import styles from './BookmarkTool.css';
import SelectSingleDropDown from '../SelectSingleDropDown/SelectSingleDropDown.js';
import classes from 'classnames';
import TextareaModal from '../TextareaModal';
import MessageModal from '../MessageModal';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class BookmarkTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookmarkName: '',
            isShowingModal_comment: false,
            isShowingModal_bookmark: false,
            isShowingModal_sentence: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCommentClose = this.handleCommentClose.bind(this);
        this.handleCommentOpen = this.handleCommentOpen.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleBookmarkMessageClose = this.handleBookmarkMessageClose.bind(this);
        this.handleBookmarkMessageOpen = this.handleBookmarkMessageOpen.bind(this);
        this.handleSentenceMessageClose = this.handleSentenceMessageClose.bind(this);
        this.handleSentenceMessageOpen = this.handleSentenceMessageOpen.bind(this);
    }

    handleChange(event) {
        this.setState({bookmarkName: event.target.value});
    }

    handleSave(bookmarkName) {
        this.props.saveNewBookmark(bookmarkName, this.props.setBookmark);
        this.setState({isShowingModal_comment: false})
        this.props.handleAddEvent();
    }

    handleCommentClose = () => {
        this.setState({isShowingModal_comment: false});
        this.props.handleRemoveEvent();
    }

    handleCommentOpen = () => {
        this.setState({isShowingModal_comment: true});
        this.props.handleRemoveEvent();
    }

    handleBookmarkMessageClose = () => this.setState({isShowingModal_bookmark: false})
    handleBookmarkMessageOpen = () => this.setState({isShowingModal_bookmark: true})
    handleSentenceMessageClose = () => this.setState({isShowingModal_sentence: false})
    handleSentenceMessageOpen = () => this.setState({isShowingModal_sentence: true})

    render() {
        const {className="", bookmarkChosen, bookmarkOptions, jumpToBookmark, setBookmark, deleteBookmark, setEditOptionTools,
                originalSentence} = this.props;
        const {isShowingModal_comment, isShowingModal_bookmark, isShowingModal_sentence} = this.state;
        let {pointer, totalCount} = this.props;
        pointer = pointer ? pointer : 0;
        totalCount = totalCount ? totalCount : 0;

        return (
            <div className={classes(styles.container, className)}>
                <div className={styles.inputRow}>
                    <a className={styles.closeButton} onClick={setEditOptionTools}>
                        <Icon pathName={`left_arrow`} />
                    </a>
                    <div className={styles.marginRight}>
                        <SelectSingleDropDown
                            value={bookmarkChosen}
                            options={bookmarkOptions || []}
                            height={`medium`}
                            className={styles.singleDropDown}
                            onChange={setBookmark} />
                    </div>
                    <a onClick={bookmarkChosen ? deleteBookmark : this.handleBookmarkMessageOpen}>
                        <Icon pathName={`garbage_bin`} className={classes(styles.image, (bookmarkChosen ? '' : styles.grayedOut))}/>
                    </a>
                    <a onClick={originalSentence ? this.handleCommentOpen : this.handleSentenceMessageOpen}>
                        <Icon pathName={`plus`} className={classes(styles.image, (originalSentence ? '' : styles.grayedOut))} />
                    </a>
                    {isShowingModal_comment &&
                        <TextareaModal key={'all'} handleClose={this.handleCommentClose} heading={``} explain={``}
                           onClick={this.handleSave} currentSentenceText={originalSentence} placeholder={<L p={p} t={`Bookmark name?`}/>}/>
                    }
                    {isShowingModal_bookmark &&
                       <MessageModal handleClose={this.handleBookmarkMessageClose} heading={<L p={p} t={`Choose a bookmark`}/>}
                           explainJSX={<L p={p} t={`You must first choose a bookmark before you can delete a bookmark.`}/>}
                           onClick={this.handleBookmarkMessageClose}/>
                    }
                    {isShowingModal_sentence &&
                       <MessageModal handleClose={this.handleSentenceMessageClose} heading={<L p={p} t={`Choose a sentence`}/>}
                           explainJSX={<L p={p} t={`You must first choose a sentence before adding a bookmark.`}/>}
                           onClick={this.handleSentenceMessageClose}/>
                    }
                    <a onClick={() => jumpToBookmark('NEXT')}>
                        <Icon pathName={`arrow_down`} className={styles.downArrow} />
                    </a>
                    <span className={styles.counts}>
                        {<L p={p} t={`${pointer} of ${totalCount}`}/>}
                    </span>
                    <a onClick={() => jumpToBookmark('PREV')}>
                        <Icon pathName={`arrow_up`} className={styles.upArrow} />
                    </a>
                </div>
            </div>
        )
    }
};
