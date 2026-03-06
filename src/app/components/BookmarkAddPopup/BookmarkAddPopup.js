import React, {Component} from 'react'
import styles from './BookmarkAddPopup.css';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class BookmarkAddPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookmarkName: '',
            opened: false
        }

        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleClosed = this.handleClosed.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        //this.nameTextBox.focus(); //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        this.button.addEventListener("click", this.handleDisplay);
        this.saveButton.addEventListener("click", this.handleClosed);
        this.cancelButton.addEventListener("click", this.handleClosed);
    }

    handleChange(event) {
        this.setState({bookmarkName: event.target.value});
    }

    handleDisplay(ev) {
        ev.stopPropagation();
        this.setState({opened: !this.state.opened});
    }

    handleClosed() {
        this.setState({opened: false});
    }

    render() {
        let {className, originalSentence, saveNewBookmark} = this.props;
        const {opened, bookmarkName} = this.state;

        var regex = "/<(.|\n)*?>/";
        originalSentence = originalSentence && originalSentence.replace(regex, "").replace(/<br>/g, "");

        return (
            <div className={classes(styles.container, className)}>
                <div className={styles.button} ref={(ref) => (this.button = ref)}>
                    <Icon pathName={`plus`} className={styles.bookmarkAdd}/>
                </div>
                <div className={classes(styles.children, (opened && styles.opened))}>
                    <div className={styles.nameBox}>
                        <span className={styles.originalSentence}>{originalSentence && originalSentence.replace(regex, "").substring(0,135) + `...`}</span>
                        <textarea rows={5} cols={35} value={bookmarkName} onChange={this.handleChange} placeholder={<L p={p} t={`Name of new bookmark?`}/>}
                            ref={ref => (this.nameTextBox = ref)} autoFocus={true}></textarea>
                        <div className={styles.buttonRow}>
                            <a className={styles.cancelButton} ref={(ref) => (this.cancelButton = ref)}><L p={p} t={`Cancel`}/></a>
                            <button onClick={() => saveNewBookmark(bookmarkName)} className={styles.saveButton} ref={(ref) => (this.saveButton = ref)}><L p={p} t={`Save`}/></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
