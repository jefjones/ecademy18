import { useState } from 'react'
import styles from './ImageViewerModal.css'
import ButtonWithIcon from '../ButtonWithIcon'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import Iframe from 'react-iframe'
const p = 'component'
import L from '../../components/PageLanguage'

function ImageViewerModal(props) {
  const [responseVisitedTypeCode, setResponseVisitedTypeCode] = useState(props.clickedUrl && props.clickedUrl.responseVisitedTypeCode)

  const {handleClose, fileUrl, headerDisplay} = props
  
        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose} >
                    <ModalDialog onClose={handleClose} style={{ width: '95%', position: 'relative', top: '20'}}>
  											<div>{headerDisplay}</div>
  											<Iframe url={fileUrl}
  													width="100%"
  													height="450px"
  													display="initial"
  													position="relative"
  													allowFullScreen/>
  											<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={handleClose} />
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
}
export default ImageViewerModal
