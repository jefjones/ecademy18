import { useState } from 'react';  //PropTypes
import * as styles from './ColorPickerModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import ButtonWithIcon from '../ButtonWithIcon'
import {SketchPicker} from 'react-color'
const p = 'component'
import L from '../../components/PageLanguage'

function ColorPickerModal(props) {
  const [color, setColor] = useState('#fff')

  const {onClick, handleClose, className} = props
  				
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>Color Picker</div>
  									      <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
  														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(color)}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default ColorPickerModal
