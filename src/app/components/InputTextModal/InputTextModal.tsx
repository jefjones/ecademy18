import { useState } from 'react';  //PropTypes
import styles from './InputTextModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import InputText from '../InputText'
import ButtonWithIcon from '../ButtonWithIcon'
const p = 'component'
import L from '../../components/PageLanguage'

function InputTextModal(props) {
  const [chosenOption, setChosenOption] = useState(this.props.defaultValue)

  const {onClick, handleClose, className, headerClass, explainClass, heading, explain, defaultValue=0, label=<L p={p} t={`Choose option`}/>} = props
          
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={classes(styles.dialogHeader, headerClass)}>{heading}</div>
  												<div className={classes(styles.dialogExplain, explainClass)}>{explain}</div>
  												<div className={styles.centered}>
  														<InputText
  																id={"chosenOption"}
  																name={"chosenOption"}
  																size={"super-short"}
  																label={label}
  																value={chosenOption === 0
  																	 				? 0
  																					: chosenOption
  																							? chosenOption
  																							:	defaultValue === 0
  																										? 0
  																										: defaultValue
  																												? defaultValue
  																												: ''
  																			}
  																inputClassName={styles.inputText}
  																onChange={handleChange}/>
  												</div>
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
  														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(chosenOption)}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default InputTextModal
