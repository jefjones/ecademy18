import { useState } from 'react'
import * as styles from './GroupMembers.css'
import classes from 'classnames'
import MessageModal from '../../components/MessageModal'
const p = 'component'
import L from '../../components/PageLanguage'

function GroupMembers(props) {
  const [caretClassName, setCaretClassName] = useState(classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown))
  const [expanded, setExpanded] = useState(props.expanded ? true : false)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [member_personId, setMember_personId] = useState(0)

  const {members} = props
      
  
      return (
          <div className={styles.container}>
              <div>
                  <div className={styles.rowTop}>
                      <div>
                          <div className={classes(styles.pendingLabel, styles.row)} onClick={handleToggle}>
                              <L p={p} t={`Members:`}/><div>{members && members.length}</div>
                          </div>
                          {expanded && members && members.length > 0 &&
                              <table className={styles.marginLeft}>
                                  <tbody>
                                  {members.map((m, i) =>
                                      <tr key={i}>
                                          <td>
                                              <span className={styles.fullName}>{m.firstName} {m.lastName}</span><br/>
                                              <span className={styles.fullName}>{m.memberId}</span>
                                          </td>
                                          <td>
                                              {m.emailAddress && <span className={styles.fullName}>{m.emailAddress}</span>}
                                              {m.phone && <span className={styles.fullName}>{m.phone}</span>}
                                          </td>
                                          <td>
                                              <span onClick={() => handleDeleteConfirmOpen(m.personId)} className={styles.cancelButton}><L p={p} t={`remove`}/></span>
                                          </td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          }
                      </div>
                      <a onClick={handleToggle}>
                          <div className={caretClassName}/>
                      </a>
                  </div>
              </div>
              {isShowingModal_delete &&
                  <MessageModal handleClose={handleDeleteConfirmClose} heading={<L p={p} t={`Remove this member from this group?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this member from this group?`}/>} isConfirmType={true}
                     onClick={handleDelete} />
              }
          </div>
      )
}
export default GroupMembers
