  //PropTypes
import styles from './PenspringFileModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import TextDisplay from '../TextDisplay'
import PenspringWorkAddView from '../../views/PenspringWorkAddView'
const p = 'component'
import L from '../../components/PageLanguage'

function PenspringFileModal(props) {
  const {onDelete, handleClose, className, languageList, createWorkAndPenspringTransfer, personId,  accessRoles, course, assignment,
  								companyConfig, recallInitRecords} = props
  
  				//In this case, use the recallInitRecords to send in the onClick which is most likely the closing of the dialog box.
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
  												<TextDisplay label={<L p={p} t={`Assignment`}/>} text={assignment.title} />
  												<PenspringWorkAddView languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer} personId={personId}
  														accessRoles={accessRoles} course={course} assignmentId={assignment.assignmentId} recallInitRecords={recallInitRecords} showMoreInfo={false}
  														hideSectionMessage={true} presetName={assignment.title} isDistributableAssignment={true} companyConfig={companyConfig}/>
                          <div className={styles.dialogButtons}>
                              {onDelete && <a className={styles.noButton} onClick={onDelete}><L p={p} t={`Delete`}/></a>}
                              <a className={styles.noButton}  onClick={handleClose}><L p={p} t={`Cancel`}/></a>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default PenspringFileModal
