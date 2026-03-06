import 'react';  //PropTypes
import styles from './RecipientListModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import EditTable from '../EditTable'
import DateMoment from '../DateMoment'
import TextDisplay from '../TextDisplay'
import ButtonWithIcon from '../ButtonWithIcon'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

const RecipientListModal = props => {
    const {handleClose, okText=<L p={p} t={`OK`}/>, announcement, recipients, onDelete} = props

    let headings = [{}, {label: <L p={p} t={`Recipient`}/>, tightText: true}, {label: <L p={p} t={`Opened`}/>, tightText: true}]
    let data = []

    recipients && recipients.length > 0 && recipients.map((m, i) =>
        data.push([
                            {value: <a onClick={() => onDelete(m.announcementId, m.personId || m.studentPersonId)}>
                                                    <Icon pathName={'cross_circle'} premium={true} className={styles.icon} fillColor={'maroon'}/>
                                            </a>
                            },
                            {value: m.firstName + ' ' + m.lastName},
                            {value: <DateMoment date={m.seenOn} format={'D MMM h:mm a'}/>},
                    ])
            )
            if (data && data.length === 0) data = [[{value: ''}, {value: <i><L p={p} t={`No recipients listed`}/></i> }]]

    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
              <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
                <div className={styles.dialogHeader}>{<L p={p} t={`Recipients: ${recipients.length}`}/>}</div>
                <div className={styles.dialogExplain}>
                                            <TextDisplay label={<L p={p} t={`Entered on`}/>} text={<DateMoment date={announcement.entryDate} format={'D MMM h:mm a'}/>} />
                                            <TextDisplay label={<L p={p} t={`Subject`}/>} text={announcement.subject && announcement.subject.length > 35 ? announcement.subject.substring(0,35) + '...' : announcement.subject}/>
                                            <TextDisplay label={<L p={p} t={`Message`}/>} text={announcement.message}/>
                </div>
                                    <div className={styles.scrollable}>
                        <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
                                    </div>
                <div className={styles.dialogButtons}>
                                            <ButtonWithIcon label={okText} icon={'checkmark_circle'} onClick={handleClose}/>
                </div>
              </ModalDialog>
            </ModalContainer>
        </div>
    )
}

export default RecipientListModal
