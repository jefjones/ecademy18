import { useEffect, useState } from 'react'
import styles from './ImageUploadFileModal.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import DropZone from 'react-dropzone-component'
import {apiHost} from '../../api_host'
import TextDisplay from '../../components/TextDisplay'

/*
    This component will upload an image and send the base64 HTML image in this format:
    <img style='max-width:300px;' id='base64image~!12345' src='data:image/jpeg;base64, LzlqLzRBQ...<!-- base64 data -->' />
    Where the image type (jpeg, jpg, tiff, gif) will be picked up from the file extension and dynamically placed in that code above to the right of data:image
    And hhe max-width is just to be able to control the image to be in the size of mobile.  That might change later with a media query to know what type of device that the user is on.
*/

function ImageUploadFileModal(props) {
  const [file, setFile] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFileChosen, setIsFileChosen] = useState(false)

  useEffect(() => {
    
    
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    
  }, [])

  const {handleClose, sentenceText, position, handleGetEditDetails} = props
        
  
        const config = componentConfig
        const djsConfig = djsConfig
  
        const eventHandlers = {
            init: dz => dropzone = dz,
            addedfile: handleFileAdded.bind(this),
            success: function(file, response) {
                handleGetEditDetails()
            }
        }
  
        const regex = "/<(.|\n)*?>/"
        let cleanText = sentenceText && sentenceText.replace(regex, "")
                .replace(/<br>/g, "")
                .replace(/<br\/>/g, "")
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim()
  
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
                                  <a onClick={handleSubmit} className={styles.buttonStyle}>{`Upload`}</a>
                              }
                          </div>
                      </form>
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
}

//    djsConfig={djsConfig} />

// <TextDisplay label={`Document name`} text={workName} />
// {sectionName && <TextDisplay label={`Section/chapter name`} text={sectionName} />}
export default ImageUploadFileModal
