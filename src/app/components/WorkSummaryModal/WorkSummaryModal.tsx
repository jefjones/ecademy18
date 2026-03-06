import styles from './WorkSummaryModal.css';  //PropTypes
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import WorkSummary from '../WorkSummary'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({onClick, handleClose, summary, setWorkCurrentSelected, personId, personName, deleteWork, isHeaderDisplay=false, showTitle=false,
                    headerTitleOnly=false, deleteChapter, updateChapterDueDate, updateChapterComment, updatePersonConfig, personConfig}) => {
    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
                <ModalDialog onClose={handleClose}>
                    <WorkSummary summary={summary} className={styles.workSummary} showIcons={true} personId={personId} isHeaderDisplay={isHeaderDisplay}
                        setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} showTitle={showTitle} noShowCurrent={true}
                        labelCurrentClass={styles.labelCurrentClass} deleteChapter={deleteChapter} indexName={`summaryModal`} headerTitleOnly={headerTitleOnly}
                        updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                        updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                    <div className={styles.dialogButtons}>
                        <button className={styles.yesButton} onClick={handleClose}><L p={p} t={`OK`}/></button>
                    </div>
                </ModalDialog>
            </ModalContainer>
        </div>
    )
}
