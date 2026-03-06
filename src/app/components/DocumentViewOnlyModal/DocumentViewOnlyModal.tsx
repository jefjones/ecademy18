import { useState } from 'react'
import styles from './DocumentViewOnlyModal.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import ImageDisplay from '../ImageDisplay'
import ButtonWithIcon from '../ButtonWithIcon'
//import Iframe from 'react-iframe'
import ReactToPrint from "react-to-print"
const p = 'component'
import L from '../../components/PageLanguage'

function DocumentViewOnlyModal(props) {
  const [file, setFile] = useState({})
  const [data, setData] = useState({})
  const [responseVisitedTypeCode, setResponseVisitedTypeCode] = useState(props.clickedUrl && props.clickedUrl.responseVisitedTypeCode)
  const [errorWebsiteLink, setErrorWebsiteLink] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(true)
  const [studentAssignmentResponseId, setStudentAssignmentResponseId] = useState(undefined)

  const handleRemove = (personId, deleteId) => {
  }

  const {fileUpload, handleClose, className, accessRoles={}, isOwner, isSubmitType, onSubmit} = props
        
  
        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose} className={styles.zIndex}>
                    <ModalDialog onClose={handleClose} style={{ width: '95%', position: 'relative', top: '20'}}>
  											<div ref={el => (componentRef = el)} className={styles.componentPrint}>
  													<ImageDisplay linkText={''} url={fileUpload && (fileUpload.url || fileUpload.fileUrl)} isOwner={isOwner || accessRoles.observer} deleteFunction={handleRemoveOpen}/>
  													{fileUpload &&
  															<div>
  																	<ReactToPrint trigger={() => <a href="#" className={classes(styles.printLink)}>
  																			<Icon pathName={'printer'} premium={true} className={styles.icon}/>
  																			<L p={p} t={`Print`}/></a>} content={() => componentRef}
  																	/>
  															</div>
  													}
  													{!isSubmitType &&
  															<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Close`}/>} onClick={handleClose} />
  													}
  													{isSubmitType &&
  															<div className={styles.row}>
  																	<a className={globalStyles.cancelLink} onClick={handleClose}><L p={p} t={`Close`}/></a>
  																	<ButtonWithIcon label={<L p={p} t={`Decline`}/>} icon={'cross_circle'} onClick={() => onSubmit('decline')} changeRed={true}/>
  																	<ButtonWithIcon label={<L p={p} t={`Approve`}/>} icon={'checkmark_circle'} onClick={() => onSubmit('approve')}/>
  															</div>
  													}
  											</div>
                    </ModalDialog>
                </ModalContainer>
  							{isShowingModal_remove &&
  	                <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this file?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this file?`}/>} isConfirmType={true}
  	                   onClick={handleRemove} />
  	            }
            </div>
        )
}
export default DocumentViewOnlyModal
