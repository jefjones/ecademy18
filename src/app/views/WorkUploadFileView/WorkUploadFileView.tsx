import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './WorkUploadFileView.css'
const p = 'WorkUploadFileView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import ProgressModal from '../../components/ProgressModal'
import TextDisplay from '../../components/TextDisplay'
import DropZone from 'react-dropzone-component'
import {apiHost} from '../../api_host'
import OneFJefFooter from '../../components/OneFJefFooter'
import * as guid from '../../utils/GuidValidate'

function WorkUploadFileView(props) {
  const [file, setFile] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFileChosen, setIsFileChosen] = useState(false)
  const [isShowingProgress, setIsShowingProgress] = useState(false)
  const [timerId, setTimerId] = useState(null)

  useEffect(() => {
    
        props.setBlankTextProcessingProgress(props.personId)
    
    return () => {
      
          const {getWorkList, personId, setBlankTextProcessingProgress} = props
          getWorkList(personId)
          clearInterval(timerId)
          setBlankTextProcessingProgress(personId)
      
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        const {textProcessingProgress} = props
        if (textProcessingProgress && textProcessingProgress.allDoneFlag) {
            handleProgressClose()
        }
    
  }, [])

  let {workSummary, textProcessingProgress} = props
  
        const config = componentConfig
        const djsConfig = djsConfig
  
        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => dropzone = dz,
            addedfile: handleFileAdded.bind(this)
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
                          <a onClick={handleSubmit} className={styles.buttonStyle}><L p={p} t={`Upload`}/></a>
                      }
                  </div>
              </form>
              {isShowingProgress &&
                  <ProgressModal handleClose={handleProgressClose} heading={<L p={p} t={`Text Processing Progress`}/>}
                      progress={textProcessingProgress}/>
              }
              <OneFJefFooter />
          </div>
      )
}

//    djsConfig={djsConfig} />
//<span onClick={isSubmitted ? this.handleProgressOpen : () => {}} className={classes(styles.buttonStyle, !isSubmitted ? styles.disabled : '')}>{`Next ->`}</span>
export default WorkUploadFileView
