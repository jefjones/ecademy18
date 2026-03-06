import { useState } from 'react';  //PropTypes
import styles from './TextareaModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import InputText from '../InputText'
import ButtonWithIcon from '../ButtonWithIcon'
const p = 'component'
import L from '../../components/PageLanguage'

function TextareaModal(props) {
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState(newComment || '')

  const {onClick, onDelete, handleClose, className, headerClass, explainClass, heading, explain, placeholder, showTitle} = props
          let {currentSentenceText} = props
          
  
          const regex = "/<(.|\n)*?>/"
          currentSentenceText = currentSentenceText &&
              currentSentenceText.replace(regex, "")
                  .replace(/<br>/g, "")
                  .replace(/<[^>]*>/g, ' ')
                  .replace(/\s{2,}/g, ' ')
                  .trim()
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.currentSentence}>{currentSentenceText && currentSentenceText.replace(regex, "").substring(0,100) + `...`}</div>
                          <div className={classes(styles.dialogHeader, headerClass)}>{heading}</div>
  												{showTitle &&
  														<InputText
  																id={"title"}
  																name={"title"}
  																size={"medium"}
  																label={<L p={p} t={`Link title`}/>}
  																value={title || ''}
  																inputClassName={styles.inputText}
  																onChange={handleChange}/>
  												}
  												<div className={classes(styles.dialogExplain, explainClass)}>{explain}</div>
                          <textarea rows={5} cols={45} value={comment} onChange={handleChange} id={'comment'} name={'comment'}
                              placeholder={placeholder} className={styles.commentBox}/>
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
  														{onDelete && <ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={onDelete} changeRed={true}/>}
  														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(comment, title)}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default TextareaModal
