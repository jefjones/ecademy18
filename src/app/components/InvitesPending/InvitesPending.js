import React, {Component} from 'react';
import styles from './InvitesPending.css';
import classes from 'classnames';
import DateMoment from '../DateMoment';
import MessageModal from '../../components/MessageModal';
const p = 'component';
import L from '../../components/PageLanguage';

export default class InvitesPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caretClassName: classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown),
      expanded: props.expanded ? true : false,
      isShowingModal_delete: false,
      isShowingModal_resend: false,
      friendInvitationId: 0,
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleDeleteConfirmClose = this.handleDeleteConfirmClose.bind(this);
    this.handleDeleteConfirmOpen = this.handleDeleteConfirmOpen.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAcceptInvite = this.handleAcceptInvite.bind(this);
    this.handleResendClose = this.handleResendClose.bind(this);
    this.handleResendOpen = this.handleResendOpen.bind(this);
    this.handleResend = this.handleResend.bind(this);
  }

    handleAcceptInvite(friendInvitationId) {
        const {personId, acceptInvite} = this.props;
        if (friendInvitationId) {
            acceptInvite(personId, friendInvitationId);
        }
    }

    handleResend(friendInvitationId) {
        const {personId, resendInvite} = this.props;
        if (friendInvitationId) {
            resendInvite(personId, friendInvitationId);
        }
        this.handleResendOpen();
    }

  handleDelete() {
      const {personId, deleteInvite} = this.props;
      const {friendInvitationId} = this.state;
      if (friendInvitationId) {
          deleteInvite(personId, friendInvitationId);
      }
      this.handleDeleteConfirmClose();
      this.setState({isShowingModal_delete: false, friendInvitationId: 0});
  }

  handleToggle(ev) {
      ev.preventDefault();
      const {expanded}  = this.state;
      expanded ? this.handleCollapse() : this.handleExpand();
  }

  handleExpand() {
    this.setState({ expanded: true, caretClassName: classes(styles.jef_caret, styles.jefCaretUp) });
  }

  handleCollapse() {
    this.setState({ expanded: false, caretClassName: classes(styles.jef_caret, styles.jefCaretDown) });
  }

  handleDeleteConfirmClose = () => this.setState({isShowingModal_delete: false})
  handleDeleteConfirmOpen = (friendInvitationId) => this.setState({isShowingModal_delete: true, friendInvitationId })
  handleResendClose = () => this.setState({isShowingModal_resend: false})
  handleResendOpen = () => this.setState({isShowingModal_resend: true })

  render() {
    const {invites, personId, excludeReverseInvites} = this.props;
    const {caretClassName, expanded, isShowingModal_delete, isShowingModal_resend} = this.state;
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.rowTop}>
                    <div>
                        <div className={styles.pendingLabel} onClick={this.handleToggle}>
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
                                            <span onClick={() => this.handleDeleteConfirmOpen(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`cancel`}/></span>
                                        </td>
                                        <td>
                                            <span onClick={() => this.handleResend(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`resend`}/></span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        }
                        {!excludeReverseInvites &&
                            <div>
                                <div className={styles.pendingLabel} onClick={this.handleToggle}>
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
                                                    <span onClick={() => this.handleDeleteConfirmOpen(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`decline`}/></span>
                                                </td>
                                                <td>
                                                    <span onClick={() => this.handleAcceptInvite(m.friendInvitationId)} className={styles.cancelButton}><L p={p} t={`accept`}/></span>
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        }
                    </div>
                    <a onClick={this.handleToggle}>
                        <div className={caretClassName}/>
                    </a>
                </div>
            </div>
            {isShowingModal_delete &&
                <MessageModal handleClose={this.handleDeleteConfirmClose} heading={<L p={p} t={`Delete this Editor Invite?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this invitation?`}/>} isConfirmType={true}
                   onClick={this.handleDelete} />
            }
            {isShowingModal_resend &&
               <MessageModal handleClose={this.handleResendClose} heading={<L p={p} t={`Editor Invite`}/>}
                  explainJSX={<L p={p} t={`The invitation has been resent to this editor.`}/>}
                  onClick={this.handleResendClose} />
            }
        </div>
    )}
}
