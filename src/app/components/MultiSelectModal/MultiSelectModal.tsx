  //PropTypes
import styles from './MultiSelectModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import EditTable from '../EditTable'
import ButtonWithIcon from '../ButtonWithIcon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function MultiSelectModal(props) {
  const {handleClose, className, title, headings, data} = props
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>{title}</div>
  												<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
                          <div className={styles.dialogButtons}>
  														<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={handleClose}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default MultiSelectModal
