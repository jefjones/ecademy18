import { useEffect, useState } from 'react';  //PropTypes
import styles from './EditModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function EditModal(props) {
  const [originalText_noHTML, setOriginalText_noHTML] = useState('')

  useEffect(() => {
    
            const {originalText} = props
            const regex = "/<(.|\n)*?>/"
            let cleanText = originalText
            cleanText.replace(regex, "")
                .replace(/<br>/g, "")
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim()
            setOriginalText_noHTML(cleanText)
        
  }, [])

  const {handleClose, editText, saveEdit} = props
          
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <p className={classes(styles.originalText)} dangerouslySetInnerHTML={{__html: originalText_noHTML}}/>
                          <div className={styles.resetDiv}>
                              <a className={styles.resetButton} onClick={handleResetToOriginal}><L p={p} t={`Reset`}/></a>
                          </div>
                          <div className={styles.editBox} contentEditable={true} dangerouslySetInnerHTML={{__html: editText}} ref={ref => {singleEditor = ref}} />
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
                              <button className={styles.yesButton} onClick={() => saveEdit(singleEditor.innerHTML)}><L p={p} t={`Save`}/></button>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default EditModal
