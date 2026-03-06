import { useState } from 'react'
import styles from './FileUploadModal.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import TextDisplay from '../TextDisplay'
import InputText from '../InputText'
import DropZone from 'react-dropzone-component'
const p = 'component'
import L from '../../components/PageLanguage'

function FileUploadModal(props) {
  const [file, setFile] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFileChosen, setIsFileChosen] = useState(false)
  const [fileTitle, setFileTitle] = useState('')

  const changeTitle = (event) => {
    
        setFileTitle(event.target.value)
    
  }

  const handleSubmit = () => {
    
        setIsSubmitted(true)
        dropzone.processQueue()
    		props.handleClose()
    
  }

  const buildURL = () => {
    
    		const {sendInBuildUrl} = props
        
        return sendInBuildUrl(fileTitle)
    
  }

  const {handleClose, handleRecordRecall, label, title, showTitleEntry, skipRecordRecall, submitFileUpload} = props
        
  
        const config = componentConfig
        const djsConfig = djsConfig
  
  			const eventHandlers = {
  					init: dz => dropzone = dz,
  					addedfile: handleFileAdded.bind(this),
  					success: skipRecordRecall
  							? () => {}
  							: () => {
  										handleRecordRecall()
  										submitFileUpload(fileTitle)
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
                                  onChange={changeTitle}/>
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
                                  <a onClick={handleSubmit} className={styles.buttonStyle}><L p={p} t={`Upload`}/></a>
                              }
                          </div>
                      </form>
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
}
export default FileUploadModal
