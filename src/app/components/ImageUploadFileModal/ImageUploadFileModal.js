import React, {Component} from 'react';
import styles from './ImageUploadFileModal.css';
import globalStyles from '../../utils/globalStyles.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import DropZone from 'react-dropzone-component';
import {apiHost} from '../../api_host.js';
import TextDisplay from '../../components/TextDisplay';

/*
    This component will upload an image and send the base64 HTML image in this format:
    <img style='max-width:300px;' id='base64image~!12345' src='data:image/jpeg;base64, LzlqLzRBQ...<!-- base64 data -->' />
    Where the image type (jpeg, jpg, tiff, gif) will be picked up from the file extension and dynamically placed in that code above to the right of data:image
    And hhe max-width is just to be able to control the image to be in the size of mobile.  That might change later with a media query to know what type of device that the user is on.
*/

export default class extends Component {
    constructor ( props ) {
    super( props );

    this.state = {
        file: {},
        isSubmitted: false,
        isFileChosen: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildURL = this.buildURL.bind(this);

    this.djsConfig = {
        addRemoveLinks: true,
        acceptedFiles: ".jpg, .jpeg, .tiff, .gif, .png, .bmp",
        autoProcessQueue: false,
        maxFiles: 1,
        paramName: "ebiFile",
        success: function(file, done) {
            //con sole.l  og('done in djs', done);
        },
    };

    this.componentConfig = {
        iconFiletypes: ['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp'],
        showFiletypeIcon: false,
        postUrl: this.buildURL,
        method: 'post',
        paramName: "file", // The name that will be used to transfer the file
        success: function(file, done) {
            //consol  e.l og('done', done);
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

componentDidMount() {
}

componentDidUpdate () {
}

handleFileAdded(file) {
    this.setState({ file, isFileChosen: true })
}

handlePost() {
    this.dropzone.processQueue();
}

handleSubmit() {
    this.setState({isSubmitted: true})
    this.dropzone.processQueue();
    this.props.handleSubmitImageAndWait();
}

buildURL() {
    const {authorPersonId, personId, workId, chapterId, languageId, hrefId, position} = this.props;
    if (authorPersonId === personId) {
        return `${apiHost}ebi/chapter/authorWorkspace/imageNew/` + personId + `/` + workId + `/` + chapterId + `/` + languageId + `/` + hrefId + `/` + position;
    } else {
        return `${apiHost}ebi/work/upload/image/editDetail/` + personId + `/` + workId + `/` + chapterId + `/` + languageId + `/` + hrefId + `/` + position;
    }
}

render() {
      const {handleClose, sentenceText, position, handleGetEditDetails} = this.props;
      const {isFileChosen} = this.state;

      const config = this.componentConfig;
      const djsConfig = this.djsConfig;

      const eventHandlers = {
          init: dz => this.dropzone = dz,
          addedfile: this.handleFileAdded.bind(this),
          success: function(file, response) {
              handleGetEditDetails();
          }
      }

      var regex = "/<(.|\n)*?>/";
      let cleanText = sentenceText && sentenceText.replace(regex, "")
              .replace(/<br>/g, "")
              .replace(/<br\/>/g, "")
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .trim();

      return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose}>
                <ModalDialog onClose={handleClose}>
                    <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                        <div className={globalStyles.pageTitle}>
                            {`Insert an Image`}
                        </div>
                        <div className={styles.containerName}>
                            <TextDisplay label={`Image position`} text={position} />
                            <TextDisplay label={`Sentence`} text={cleanText} />
                        </div>
                        <hr />
                        <div className={styles.explanation}>
                            Click on the box below to browse for a file, or drag-and-drop a file into the box:
                        </div>
                        <DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}/>
                        <div className={styles.buttonDiv}>
                            <a onClick={handleClose} className={styles.cancelLink}>Cancel</a>
                            {isFileChosen &&
                                <a onClick={this.handleSubmit} className={styles.buttonStyle}>{`Upload`}</a>
                            }
                        </div>
                    </form>
                </ModalDialog>
            </ModalContainer>
        </div>
    )}
};

//    djsConfig={djsConfig} />

// <TextDisplay label={`Document name`} text={workName} />
// {sectionName && <TextDisplay label={`Section/chapter name`} text={sectionName} />}
