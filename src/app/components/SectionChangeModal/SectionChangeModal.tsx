import styles from './SectionChangeModal.css';  //PropTypes
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import RadioGroup from '../RadioGroup'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({handleClose, heading, sections, currentSection, changeToSection, personId}) => {
    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
              <ModalDialog onClose={handleClose}>
                <div className={styles.dialogHeader}>{heading}</div>
                <RadioGroup data={sections} name={`sectionChange`} horizontal={false}
                    className={styles.radio} personId={personId}
                    labelClass={styles.radioLabels} radioClass={styles.radioClass}
                    initialValue={currentSection ? currentSection : ''} onClick={(event) => changeToSection(event)} />
                <div className={styles.dialogButtons}>
                    <button className={styles.yesButton} onClick={handleClose}><L p={p} t={`Close`}/></button>
                </div>
              </ModalDialog>
            </ModalContainer>
        </div>
    )
}
