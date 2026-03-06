import { useState } from 'react'
import styles from './WorkDownloadView.css'
const p = 'WorkDownloadView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import WorkSummary from '../../components/WorkSummary'
import MessageModal from '../../components/MessageModal'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import classes from 'classnames'

function WorkDownloadView(props) {
  const [copySuccess, setCopySuccess] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [p, setP] = useState(undefined)

  const copyToClipboard = (isTextOnly, e) => {
    
            if (isTextOnly) {
                chapterTextWithoutHTML.select()
            } else {
                handleTextHtml()
                chapterTextHolder.select()
            }
            document.execCommand('copy')
            e.target.focus()
            setCopySuccess(<L p={p} t={`Copied! You can now paste the text into the program of your choice (email, instant message, a word processor).`}/>)
            handleMessageOpen()
        
  }

  const handleMessageClose = () => {
    setIsShowingModal(false)
  }

  const handleMessageOpen = () => {
    setIsShowingModal(true)
  }

  const {workSummary, setWorkCurrentSelected, deleteWork, deleteChapter, chapterText, updateChapterDueDate, updateChapterComment} = props
          
  
          //Replace <br, </p and </div with \n\r  end of line and carriage return.
          let textWithoutHTML = chapterText.replace(/<br/g, "\n\r<br"); //preserve the <br since we don't know what follows it since it will be cleaned out with the regular expression further below.
          textWithoutHTML = textWithoutHTML.replace(/<\/p/g, "\n\r</p")
          textWithoutHTML = textWithoutHTML.replace(/<\/div/g, "\n\r</div")
          textWithoutHTML = textWithoutHTML.replace(/&nbsp;/g, " ")
          textWithoutHTML = textWithoutHTML.replace(/<\/?[^>]+(>|$)/g, "")
  
          // let textHTML = "";
          // let remainingHTML = chapterText;
          // let theInnerSpan = "";
          // const template = document.createElement('template');
          // template.innerHTML = chapterText;
          // //let spans = template.getElementsByTagName('SPAN');
          // const spans = document.getElementById('editorDiv').getElementsByTagName('SPAN');
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
                            <a className={styles.copyChoice} onClick={(event) => copyToClipboard(false, event)}><L p={p} t={`Text and HTML`}/></a>
                            <a className={styles.copyChoice} onClick={(event) => copyToClipboard(true, event)}><L p={p} t={`Text Only`}/></a>
                        </div>
                        <div className={styles.successLabel}>
                            {copySuccess}
                        </div>
                    </div>
                  }
                  <div>
                      <br />
                      <hr width="90%" />
                    <div className={classes(styles.bigLabel, styles.row)}>
                        <L p={p} t={`Save as`}/> Microsoft&trade; Word&trade
                    </div>
                    <div className={styles.smallLabel}>
                        <L p={p} t={`Right click and choose 'Save target as...' or 'Save link as...'`}/>
                    </div>
                    <div>
                        <a className={styles.copyChoice} href={`/static/wordDocs/` + workSummary.fileName}>{workSummary.fileName}</a>
                    </div>
                  </div>
                  <form>
                      <textarea ref={(textarea) => chapterTextHolder = textarea} className={styles.hiddenTextarea}/>
                      <textarea ref={(textarea) => chapterTextWithoutHTML = textarea} value={textWithoutHTML} className={styles.hiddenTextarea}/>
                  </form>
                  <div className={styles.editorDiv} contentEditable={true} dangerouslySetInnerHTML={{__html: chapterText}}
                      id="editorDiv" ref={ref => {editorDiv = ref}}/>
              </div>
              {isShowingModal &&
                 <MessageModal handleClose={handleMessageClose} heading={<L p={p} t={`Copied to Clipboard`}/>}
                     explainJSX={<L p={p} t={`Copied! You can now paste the text into the program of your choice (email, instant message, a word processor).`}/>}
                     onClick={handleMessageClose}/>}
        </div>
      )
}
export default WorkDownloadView
