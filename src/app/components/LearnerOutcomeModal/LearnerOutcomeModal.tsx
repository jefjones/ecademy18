import 'react';  //PropTypes
import * as styles from './LearnerOutcomeModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import EditTable from '../EditTable'
import ButtonWithIcon from '../ButtonWithIcon'


const LearnerOutcomeModal = props => {
    const {handleClose, okText='OK', ratingName, learnerFullName, learnerOutcomes, outcomeList} = props
    let headings = [{label: 'Id', tightText: true}, {label: 'Learner Outcome', tightText: true}]
    let data = []

    if (learnerOutcomes && learnerOutcomes.length > 0) {
        data = learnerOutcomes.reduce((acc, m) => {
            acc = outcomeList.indexOf(m.learnerOutcomeId) > -1
                ? acc.concat([[ {id: m.externalId, value: m.externalId}, {id: m.learnerOutcomeId, value: m.description, wrapCell: true}, ]])
                : acc
            return acc
        }, [])
    } else {
        data = [[{value: ''}, {value: <i>No learner outcomes listed</i> }]]
    }

    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
              <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
                <div className={styles.dialogHeader}>{`Learner Outcomes (` + data.length + `)`}</div>
                <div className={styles.dialogExplain}>
                    {ratingName === 'Proficient'
                        ? learnerFullName + ' is proficient in the following:'
                        : ratingName === 'InProgress'
                            ? learnerFullName + ' is currently working on the following:'
                            : learnerFullName + ' has not yet started the following:'
                    }
                </div>
                <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
                <div className={styles.dialogButtons}>
                                            <ButtonWithIcon label={okText} icon={'checkmark_circle'} onClick={handleClose}/>
                </div>
              </ModalDialog>
            </ModalContainer>
        </div>
    )
}

export default LearnerOutcomeModal
