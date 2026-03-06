import React, {Component} from 'react';
import styles from './WorkDownloadView.css';
const p = 'WorkDownloadView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import WorkSummary from '../../components/WorkSummary';
import MessageModal from '../../components/MessageModal';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import classes from 'classnames';

export default class WorkDownloadView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            copySuccess: '',
            isShowingModal: false,
        }

        this.handleTextHtml = this.handleTextHtml.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
        this.handleMessageOpen = this.handleMessageOpen.bind(this);
    }

    copyToClipboard = (isTextOnly, e) => {
        if (isTextOnly) {
            this.chapterTextWithoutHTML.select();
        } else {
            this.handleTextHtml();
            this.chapterTextHolder.select();
        }
        document.execCommand('copy');
        e.target.focus();
        this.setState({ copySuccess: <L p={p} t={`Copied! You can now paste the text into the program of your choice (email, instant message, a word processor).`}/> });
        this.handleMessageOpen();
    };

    handleTextHtml() {
        var spans = document.getElementById('editorDiv') && document.getElementById('editorDiv').getElementsByTagName('SPAN');
        for(var i = 0; i < spans.length; i++) {
            if (spans[i] && String(spans[i].id).indexOf('~!') > -1) {
                spans[i].removeAttribute("id");
            }
        }
        var paragraphs = document.getElementById('editorDiv').getElementsByTagName('P');
        for(i = 0; i < paragraphs.length; i++) {
            if (paragraphs[i] && String(paragraphs[i].id).indexOf('~!') > -1) {
                paragraphs[i].removeAttribute("id");
            }
        }
        var divs = document.getElementById('editorDiv').getElementsByTagName('DIV');
        for(i = 0; i < divs.length; i++) {
            if (divs[i] && String(divs[i].id).indexOf('~!') > -1) {
                divs[i].removeAttribute("id");
            }
        }
        //Restore the href-s which had been disabled with the replacement code h!^^ref.
        var chapterText = document.getElementById('editorDiv') && document.getElementById('editorDiv').innerHTML;
        chapterText = chapterText.replace(/h!\^\^ref/ig, "href");

        this.chapterTextHolder.value = chapterText;
    }

    handleMessageClose = () => this.setState({isShowingModal: false})
    handleMessageOpen = () => this.setState({isShowingModal: true})

    render() {
        const {workSummary, setWorkCurrentSelected, deleteWork, deleteChapter, chapterText, updateChapterDueDate, updateChapterComment} = this.props;
        const {isShowingModal} = this.state;

        //Replace <br, </p and </div with \n\r  end of line and carriage return.
        let textWithoutHTML = chapterText.replace(/<br/g, "\n\r<br"); //preserve the <br since we don't know what follows it since it will be cleaned out with the regular expression further below.
        textWithoutHTML = textWithoutHTML.replace(/<\/p/g, "\n\r</p");
        textWithoutHTML = textWithoutHTML.replace(/<\/div/g, "\n\r</div");
        textWithoutHTML = textWithoutHTML.replace(/&nbsp;/g, " ");
        textWithoutHTML = textWithoutHTML.replace(/<\/?[^>]+(>|$)/g, "");

        // let textHTML = "";
        // let remainingHTML = chapterText;
        // let theInnerSpan = "";
        // var template = document.createElement('template');
        // template.innerHTML = chapterText;
        // //var spans = template.getElementsByTagName('SPAN');
        // var spans = document.getElementById('editorDiv').getElementsByTagName('SPAN');
        //
        // //TRY LOOPING THROUGH THE SPANS AND REPLACING THE OUTERHTML WITH THE INNERHTML TO GET RID OF THE HREFIDS.
        // for(i = 0; i < spans.length; i++) {
        //     if (spans[i] && String(spans[i].id).indexOf('~!') > -1) {
        //         spans[i].outerHTML = spans[i].innerHTML;
        //         let test = spans[i];
        //     }
        // }

        //Loop through the text. When you come to a span tag with an HrefId, take the innerHTML and concatenate that in order to skip those control tags.
        // while (remainingHTML.indexOf(`<span id="~!`) > -1) {
        //     textHTML += remainingHTML.substring(0, remainingHTML.indexOf(`<span id="~!`));  //This finds the index of the start of that span tag
        //     theInnerSpan = template.getElementById()
        //     textHTML += theInnerSpan
        //     remainingHTML = remainingHTML.substring(remainingHTML.indexOf(">")+1); //Get past the end of the starting hrefId span tag
        //     remainingHTML = remainingHTML.substring(theInnerSpan.length );
        //     remainingHTML = remainingHTML.substring(remainingHTML.indexOf(">")+1); //Get past the end tag of the hrefId span tag
        // }


    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Download Document`}/>
            </div>
            <Accordion allowMultiple={true} noShowExpandAll={true}>
                <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false}
                        className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                        showAssignWorkToEditor={false} personId={workSummary.authorPersonId} workSummary={workSummary}
                        setWorkCurrentSelected={setWorkCurrentSelected}
                        deleteWork={deleteWork} deleteChapter={deleteChapter}>
                    <WorkSummary summary={workSummary} className={styles.workSummary} personId={workSummary.authorPersonId}
                        isHeaderDisplay={false} showTitle={false}
                        setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                        updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}/>
                </AccordionItem>
            </Accordion>
            <div>
                {
                 /* Logical shortcut for only displaying the
                    button if the copy command exists */
                 document.queryCommandSupported('copy') &&
                  <div>
                      <div className={styles.bigLabel}>
                          <L p={p} t={`Copy to Clipboard`}/>
                      </div>
                      <div className={styles.smallLabel}>
                          <L p={p} t={`And paste to another program:  email, word processor, or text message.`}/>
                      </div>
                      <div>
                          <a className={styles.copyChoice} onClick={(event) => this.copyToClipboard(false, event)}><L p={p} t={`Text and HTML`}/></a>
                          <a className={styles.copyChoice} onClick={(event) => this.copyToClipboard(true, event)}><L p={p} t={`Text Only`}/></a>
                      </div>
                      <div className={styles.successLabel}>
                          {this.state.copySuccess}
                      </div>
                  </div>
                }
                <div>
                    <br />
                    <hr width="90%" />
                  <div className={classes(styles.bigLabel, styles.row)}>
                      <L p={p} t={`Save as`}/> Microsoft&trade; Word&trade;
                  </div>
                  <div className={styles.smallLabel}>
                      <L p={p} t={`Right click and choose 'Save target as...' or 'Save link as...'`}/>
                  </div>
                  <div>
                      <a className={styles.copyChoice} href={`/static/wordDocs/` + workSummary.fileName}>{workSummary.fileName}</a>
                  </div>
                </div>
                <form>
                    <textarea ref={(textarea) => this.chapterTextHolder = textarea} className={styles.hiddenTextarea}/>
                    <textarea ref={(textarea) => this.chapterTextWithoutHTML = textarea} value={textWithoutHTML} className={styles.hiddenTextarea}/>
                </form>
                <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: chapterText}}
                    id="editorDiv" ref={ref => {this.editorDiv = ref}}/>
            </div>
            {isShowingModal &&
               <MessageModal handleClose={this.handleMessageClose} heading={<L p={p} t={`Copied to Clipboard`}/>}
                   explainJSX={<L p={p} t={`Copied! You can now paste the text into the program of your choice (email, instant message, a word processor).`}/>}
                   onClick={this.handleMessageClose}/>}
      </div>
    );
  }

}
