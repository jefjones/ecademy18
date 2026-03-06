import React, {Component} from 'react';
import styles from './FileUploadModal.css';
import globalStyles from '../../utils/globalStyles.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import TextDisplay from '../TextDisplay';
import InputText from '../InputText';
import DropZone from 'react-dropzone-component';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
    constructor ( props ) {
    super( props );

    this.state = {
        file: {},
        isSubmitted: false,
        isFileChosen: false,
        fileTitle: '',
    }

    this.djsConfig = {
        addRemoveLinks: true,
        acceptedFiles: props.acceptedFiles,
        autoProcessQueue: false,
        maxFiles: 1,
        paramName: "ebiFile",
        success: function(file, done) {
						props.submitFileUpload();
            //not doing anything here
        },
    };

    this.componentConfig = {
        iconFiletypes: props.iconFiletypes,
        showFiletypeIcon: false,
        postUrl: this.buildURL,
        method: 'post',
        paramName: "file", // The name that will be used to transfer the file
        success: function(file, done) {
            props.skipRecordRecall && props.recallAfterFileUpload()
						props.submitFileUpload();
        },
        accept: function(file, done) {
          if (file.name === "justinbieber.jpg") {
            done("Naha, you don't.");
          }
          else { done(); }
        },
        uploadMultiple: false,
    };

    this.dropzone = null;
}

changeTitle = (event) => {
    this.setState({ fileTitle: event.target.value });
}

handleFileAdded(file) {
    this.setState({ file, isFileChosen: true })
}

handlePost() {
    this.dropzone.processQueue();
}

handleSubmit = () => {
    this.setState({isSubmitted: true})
    this.dropzone.processQueue();
		this.props.handleClose();
}

buildURL = () => {
		const {sendInBuildUrl} = this.props;
    const {fileTitle} = this.state;
    return sendInBuildUrl(fileTitle);
}

render() {
      const {handleClose, handleRecordRecall, label, title, showTitleEntry, skipRecordRecall, submitFileUpload} = this.props;
      const {isFileChosen, fileTitle} = this.state;

      const config = this.componentConfig;
      const djsConfig = this.djsConfig;

			const eventHandlers = {
					init: dz => this.dropzone = dz,
					addedfile: this.handleFileAdded.bind(this),
					success: skipRecordRecall
							? () => {}
							: () => {
										handleRecordRecall();
										submitFileUpload(this.state.fileTitle);
								 },
			}


      return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose}>
                <ModalDialog onClose={handleClose}>
                    <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                        <div className={globalStyles.pageTitle}>
                            <L p={p} t={`Upload a File`}/>
                        </div>
                        <div className={styles.containerName}>
                            <TextDisplay label={label} text={title} />
                        </div>
                        {showTitleEntry &&
                            <InputText
                                id={`fileTitle`}
                                name={`fileTitle`}
                                size={"long"}
                                label={<L p={p} t={`Title`}/>}
                                value={fileTitle || ''}
                                onChange={this.changeTitle}/>
                        }
                        <hr />
                        <div className={styles.explanation}>
                            <L p={p} t={`Click on the box below to browse for a file, or drag-and-drop a file into the box:`}/>
                        </div>
                        <DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}>
														<L p={p} t={`Click here to upload or`}/>
												</DropZone>
                        <div className={styles.buttonDiv}>
                            <a onClick={handleClose} className={styles.cancelLink}>Cancel</a>
                            {isFileChosen &&
                                <a onClick={this.handleSubmit} className={styles.buttonStyle}><L p={p} t={`Upload`}/></a>
                            }
                        </div>
                    </form>
                </ModalDialog>
            </ModalContainer>
        </div>
    )}
};
