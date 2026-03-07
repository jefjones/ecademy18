import * as styles from './ProgressModal.css';  //PropTypes
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import numberFormat from '../../utils/numberFormat'

// let textProcessingProgress = {
//     workName: '',
//     workId: 0,
//     allDoneFlag: 0,
//     chapters: [
//         {
//             chapterId: 0,
//             chapterName: '',
//             wordCount: 0,
//             progressCount: 0,
//             doneFlag: 0,
//         },
//     ],
// }

export default ({className="", heading="", headerClass="", explainClass="", progress, handleClose }) => {
    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
              <ModalDialog onClose={handleClose}>
                <div className={styles.dialogHeader}>{heading}</div>
                <div className={styles.workName}>{progress && progress.workName}</div>
                <table className={styles.centered}>
                    <tbody>
                    <tr><td></td></tr>
                    {progress && progress.chapters && progress.chapters.length > 0 &&
                        progress.chapters.map((c, i) => {
                            return (
                                <tr key={i}>
                                    <td className={styles.chapterName}>
                                        {progress.chapters.length === 1
                                            ? ''
                                            : c.chapterName.length > 35
                                                ? c.chapterName.substring(0,35) + '...'
                                                : c.chapterName}
                                    </td>
                                    <td className={styles.countLabel}>
                                        {numberFormat(c.progressCount)}
                                        <span className={styles.ofText}>of</span>
                                        {numberFormat(c.wordCount)}
                                    </td>
                                    <td className={styles.percentLabel}>
                                        {c.doneFlag ? '100%' : c.wordCount ? Math.round(c.progressCount * 100 / c.wordCount) + '%' : 'error'}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
              </ModalDialog>
            </ModalContainer>
        </div>
    )
}
