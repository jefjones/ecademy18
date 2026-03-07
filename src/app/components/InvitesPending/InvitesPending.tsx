import { useState } from 'react'
import * as styles from './InvitesPending.css'
import classes from 'classnames'
import DateMoment from '../DateMoment'
import MessageModal from '../../components/MessageModal'
const p = 'component'
import L from '../../components/PageLanguage'

function InvitesPending(props) {
  const [caretClassName, setCaretClassName] = useState(classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown))
  const [expanded, setExpanded] = useState(props.expanded ? true : false)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal_resend, setIsShowingModal_resend] = useState(false)
  const [friendInvitationId, setFriendInvitationId] = useState(0)

  const {invites, personId, excludeReverseInvites} = props
      
      return (
          <div className={styles.container}>
              <div>
                  <div className={styles.rowTop}>
                      <div>
                          <div className={styles.pendingLabel} onClick={handleToggle}>
                              <L p={p} t={`You have invitations pending:`}/><div>{invites && invites.length > 0 && invites.filter(m => m.senderPersonId === personId).length}</div>
                          </div>
                          {expanded && invites && invites.filter(m => m.senderPersonId === personId).length > 0 &&
                              <table className={styles.marginLeft}>
                                  <tbody>
                                  {invites.filter(m => m.senderPersonId === personId).map((m, i) =>
                                      <tr key={i}>
                                          <td>
                                              <span className={styles.fullName}>{m.firstName} {m.lastName}</span><br/>
                                              {m.email && <span className={styles.fullName}>{m.email}</span>}
                                              {m.phone && <span className={styles.fullName}>{m.phone}</span>}
                                          </td>
                                          <td>
                                              <DateMoment date={m.entryDate} format={`D MMM YYYY`} className={styles.entryDate}/>
                                          </td>
                                          <td>
                                              <span onClick={() => handleDeleteConfirmOpen(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`cancel`}/></span>
                                          </td>
                                          <td>
                                              <span onClick={() => handleResend(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`resend`}/></span>
                                          </td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          }
                          {!excludeReverseInvites &&
                              <div>
                                  <div className={styles.pendingLabel} onClick={handleToggle}>
                                      <L p={p} t={`You have been invited:`}/><div>{invites && invites.length > 0 && invites.filter(m => m.senderPersonId !== personId).length}</div>
                                  </div>
                                  {expanded && invites && invites.filter(m => m.senderPersonId !== personId).length > 0 &&
                                      <table className={styles.marginLeft}>
                                          <tbody>
                                          {invites.filter(m => m.senderPersonId !== personId).map((m, i) =>
                                              <tr key={i}>
                                                  <td>
                                                      <span className={styles.fullName}>{m.firstName} {m.lastName}</span>
                                                  </td>
                                                  <td>
                                                      <DateMoment date={m.entryDate} format={`D MMM YYYY`} className={styles.entryDate}/>
                                                  </td>
                                                  <td>
                                                      <span onClick={() => handleDeleteConfirmOpen(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`decline`}/></span>
                                                  </td>
                                                  <td>
                                                      <span onClick={() => handleAcceptInvite(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`accept`}/></span>
                                                  </td>
                                              </tr>
                                          )}
                                          </tbody>
                                      </table>
                                  }
                              </div>
                          }
                      </div>
                      <a onClick={handleToggle}>
                          <div className={caretClassName}/>
                      </a>
                  </div>
              </div>
              {isShowingModal_delete &&
                  <MessageModal handleClose={handleDeleteConfirmClose} heading={<L p={p} t={`Delete this Editor Invite?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this invitation?`}/>} isConfirmType={true}
                     onClick={handleDelete} />
              }
              {isShowingModal_resend &&
                 <MessageModal handleClose={handleResendClose} heading={<L p={p} t={`Editor Invite`}/>}
                    explainJSX={<L p={p} t={`The invitation has been resent to this editor.`}/>}
                    onClick={handleResendClose} />
              }
          </div>
      )
}
export default InvitesPending
