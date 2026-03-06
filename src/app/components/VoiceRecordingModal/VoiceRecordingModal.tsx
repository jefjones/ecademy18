import { useEffect } from 'react'
import styles from './VoiceRecordingModal.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import TextDisplay from '../TextDisplay'
import ButtonWithIcon from '../ButtonWithIcon'
let ReactMic
const p = 'component'
import L from '../../components/PageLanguage'

function VoiceRecordingModal(props) {
  useEffect(() => {
    
    			ReactMic = require('react-mic').ReactMic
    	
  }, [])

  const {handleClose, label, title, startRecording, stopRecording, onStop, recordedBlob, record, submitFileUpload} = props
  
        return (
          <div className={styles.container}>
              <ModalContainer onClose={handleClose}>
                  <ModalDialog onClose={handleClose}>
                    <div className={globalStyles.pageTitle}>
                        <L p={p} t={`Voice Recording`}/>
                    </div>
                    <div className={styles.containerName}>
                        <TextDisplay label={label} text={title} />
                    </div>
                    <div>
                        <ReactMic
                              record={record}
  														className={styles.recorder}
                              onStop={onStop}
                              strokeColor="white"
                              backgroundColor="#147EA7" />
                    </div>
  									<audio src={recordedBlob && recordedBlob.blobURL} preload={'auto'} controls="controls">
  												<L p={p} t={`This browser does not support this audio control`}/>
  									</audio>
                    <div className={styles.rowButtons}>
                        <ButtonWithIcon label={<L p={p} t={`Start`}/>} icon={'microphone'} onClick={startRecording} className={styles.submitButton} />
  											<ButtonWithIcon label={<L p={p} t={`Stop`}/>} icon={'stop_circle'} onClick={stopRecording} className={styles.submitButton} changeRed={true}/>
  											<div className={styles.moreLeft}>
                        		<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={submitFileUpload} disabled={!(recordedBlob && recordedBlob.blobURL)} />
  											</div>
                    </div>
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
}
export default VoiceRecordingModal
