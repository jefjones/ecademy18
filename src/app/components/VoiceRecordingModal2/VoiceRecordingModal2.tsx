
import styles from './VoiceRecordingModal2.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import TextDisplay from '../TextDisplay'
import ButtonWithIcon from '../ButtonWithIcon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function VoiceRecordingModal2(props) {
  const {handleClose, label, title, startRecording, stopRecording, onTheAir, submitFileUpload, blobUrl} = props
  
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
  									<audio controls={"controls"} src={blobUrl} type={"audio/mpeg"}>
  												<L p={p} t={`This browser does not support this audio control`}/>
  									</audio>
                    <div className={styles.rowButtons}>
                        <ButtonWithIcon label={<L p={p} t={`Start`}/>} icon={'microphone'} onClick={startRecording} className={styles.submitButton} disabled={onTheAir}/>
  											<ButtonWithIcon label={<L p={p} t={`Stop`}/>} icon={'stop_circle'} onClick={stopRecording} className={styles.submitButton} changeRed={true} disabled={!onTheAir}/>
  											<div className={styles.moreLeft}>
                        		<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={submitFileUpload} disabled={!blobUrl || onTheAir} />
  											</div>
                    </div>
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
}
export default VoiceRecordingModal2
