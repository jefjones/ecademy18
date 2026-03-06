import React, {Component} from 'react';
import styles from './GroupMembers.css';
import classes from 'classnames';
import MessageModal from '../../components/MessageModal';
const p = 'component';
import L from '../../components/PageLanguage';

export default class GroupMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caretClassName: classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown),
      expanded: props.expanded ? true : false,
      isShowingModal_delete: false,
      member_personId: 0,
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleDeleteConfirmClose = this.handleDeleteConfirmClose.bind(this);
    this.handleDeleteConfirmOpen = this.handleDeleteConfirmOpen.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
      const {personId, groupId, removeMember} = this.props;
      const {member_personId} = this.state;
      removeMember(personId, groupId, member_personId);
      this.handleDeleteConfirmClose();
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
  handleDeleteConfirmOpen = (member_personId) => this.setState({isShowingModal_delete: true, member_personId })

  render() {
    const {members} = this.props;
    const {caretClassName, expanded, isShowingModal_delete} = this.state;

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.rowTop}>
                    <div>
                        <div className={classes(styles.pendingLabel, styles.row)} onClick={this.handleToggle}>
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
                                            <span onClick={() => this.handleDeleteConfirmOpen(m.personId)} className={styles.cancelButton}><L p={p} t={`remove`}/></span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        }
                    </div>
                    <a onClick={this.handleToggle}>
                        <div className={caretClassName}/>
                    </a>
                </div>
            </div>
            {isShowingModal_delete &&
                <MessageModal handleClose={this.handleDeleteConfirmClose} heading={<L p={p} t={`Remove this member from this group?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this member from this group?`}/>} isConfirmType={true}
                   onClick={this.handleDelete} />
            }
        </div>
    )}
}
