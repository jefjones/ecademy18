import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './WorkUploadFileView.css';
const p = 'WorkUploadFileView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import ProgressModal from '../../components/ProgressModal';
import TextDisplay from '../../components/TextDisplay';
import DropZone from 'react-dropzone-component';
import {apiHost} from '../../api_host.js';
import OneFJefFooter from '../../components/OneFJefFooter';
import * as guid from '../../utils/GuidValidate.js';

export default class extends Component {
    constructor ( props ) {
    super( props );

    this.state = {
        file: {},
        isSubmitted: false,
        isFileChosen: false,
        isShowingProgress: false,
        timerId: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildURL = this.buildURL.bind(this);
    this.handleProgressClose = this.handleProgressClose.bind(this);

    this.djsConfig = {
        addRemoveLinks: true,
        acceptedFiles: ".txt, .rtf, .html, .htm, .docx",
        autoProcessQueue: false,
        maxFiles: 1,
        paramName: "ebiFile",
    };

    this.componentConfig = {
        iconFiletypes: ['txt', 'rtf', 'html', 'htm', 'docx'],
        showFiletypeIcon: false,
        postUrl: this.buildURL,
        method: 'post',
        paramName: "file", // The name that will be used to transfer the file
        accept: function(file, done) {
          if (file.name === "justinbieber.jpg") {
            done("Naha, you don't.");
          }
          else { done(); }
        }
        //uploadMultiple: false,
    };

    this.dropzone = null;
}

componentDidMount() {
    this.props.setBlankTextProcessingProgress(this.props.personId);
}

componentDidUpdate () {
    const {textProcessingProgress} = this.props;
    if (textProcessingProgress && textProcessingProgress.allDoneFlag) {
        this.handleProgressClose();
    }
}

componentWillUnmount() {
    const {getWorkList, personId, setBlankTextProcessingProgress} = this.props;
    getWorkList(personId);
    clearInterval(this.state.timerId);
    setBlankTextProcessingProgress(personId);
}

handleProgressClose() {
    const {setBlankTextProcessingProgress, personId} = this.props;
    this.setState({ isShowingProgress: false })
    clearInterval(this.state.timerId);
    setBlankTextProcessingProgress(personId);
    browserHistory.push("/workNewAfterNav");
}

handleFileAdded(file) {
    this.setState({ file, isFileChosen: true })
}

handleSubmit() {
    this.dropzone.processQueue();
}

buildURL() {
    const {personId, workSummary, getTextProcessingProgress} = this.props;
    this.setState({
        isShowingProgress: true,
        timerId: setInterval(() => getTextProcessingProgress(personId), 1000)
    });

    let emptyGuid = guid.emptyGuid;
    return `${apiHost}ebi/work/upload/` + personId + `/` + workSummary.workId + `/` + emptyGuid + `/` + workSummary.nativeLanguageId + `/` + false;
}

render() {
      let {workSummary, textProcessingProgress} = this.props;
      let {isFileChosen, isShowingProgress} = this.state;

      const config = this.componentConfig;
      const djsConfig = this.djsConfig;

      // For a list of all possible events (there are many), see README.md!
      const eventHandlers = {
          init: dz => this.dropzone = dz,
          addedfile: this.handleFileAdded.bind(this)
      }

      return (
        <div className={styles.container}>
            <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                <div className={globalStyles.pageTitle}>
                    <L p={p} t={`Upload a File`}/>
                </div>
                <div className={styles.containerName}>
                    <TextDisplay label={<L p={p} t={`Document name`}/>} text={workSummary.workName} />
                </div>
                <hr />
                <div className={styles.explanation}>
                    <L p={p} t={`Click on the box below to browse for a file, or drag-and-drop a file into the box:`}/>
                </div>
                <DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}/>
                <div className={styles.buttonDiv}>
                    {isFileChosen &&
                        <a onClick={this.handleSubmit} className={styles.buttonStyle}><L p={p} t={`Upload`}/></a>
                    }
                </div>
            </form>
            {isShowingProgress &&
                <ProgressModal handleClose={this.handleProgressClose} heading={<L p={p} t={`Text Processing Progress`}/>}
                    progress={textProcessingProgress}/>
            }
            <OneFJefFooter />
        </div>
    )}
};

//    djsConfig={djsConfig} />
//<span onClick={isSubmitted ? this.handleProgressOpen : () => {}} className={classes(styles.buttonStyle, !isSubmitted ? styles.disabled : '')}>{`Next ->`}</span>
