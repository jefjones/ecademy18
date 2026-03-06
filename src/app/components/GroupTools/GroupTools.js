import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './GroupTools.css';
import classes from 'classnames';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import tapOrClick from 'react-tap-or-click';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          isShowingModal_work: false,
          isShowingModal_workOrSection: false,
      }
    }

    handleDelete = (type) => {
        const {deleteGroup, personId, summary} = this.props;
        this.handleDeleteGroupClose();
        deleteGroup(personId, summary.groupId);
        browserHistory.push("/myGroupsReport");
    }

    handleDeleteGroupClose = () => this.setState({isShowingModal_work: false})
    handleDeleteGroupOpen = () => this.setState({isShowingModal_work: true})

    toggleLabels = () => {
        const {personId, updatePersonConfig, personConfig} = this.props;
        updatePersonConfig(personId, `GroupToolsShowLabels`, personConfig && !personConfig.groupToolsShowLabels)
    }

    render() {
        const {personId, summary, className, isOwner, showEditorAccess=true, showDelete=false, showSettings=true,
                setGroupCurrentSelected, currentTool, personConfig} = this.props;
        const {isShowingModal_work} = this.state;
        let isShowingLabels = personConfig && personConfig.groupToolsShowLabels ? personConfig.groupToolsShowLabels : false;

        return (
            <div className={classes(className, isShowingLabels ? styles.containerColumn : styles.containerRow)}>
                {showSettings &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '', currentTool === 'assignmentDashboard' ? styles.lowOpacity : '')}>
                        <a className={styles.linkStyle} {...tapOrClick(() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "assignmentDashboard/" + summary.groupId + "/" + summary.masterWorkId))}>
                            <Icon pathName={`pulse`} premium={true}/>
                        </a>
                        {isShowingLabels &&
                            <a className={styles.label} onClick={() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "assignmentDashboard/" + summary.groupId + "/" + summary.masterWorkId)}>
                                <L p={p} t={`View assignments and learners`}/>
                            </a>
                        }
                    </div>
                }
                {isOwner && showEditorAccess &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '', currentTool === 'accessReport' ? styles.lowOpacity : '')}>
                        <a className={styles.linkStyle} {...tapOrClick(() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "accessReport/" + summary.groupId))}>
                            <Icon pathName={`users_plus`} premium={true}/>
                        </a>
                        {isShowingLabels &&
                            <a className={styles.label} onClick={() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "accessReport/" + summary.groupId)}>
                                <L p={p} t={`Give and view learners' access`}/>
                            </a>
                        }
                    </div>
                }
                <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '', currentTool === 'groupEditReport' ? styles.lowOpacity : '')}>
                    <a className={styles.linkStyle} {...tapOrClick(() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "groupEditReport/e/edit/" + summary.masterWorkId))}>
                        <Icon pathName={`chart_growth`} premium={true}/>
                    </a>
                    {isShowingLabels &&
                        <a className={styles.label} onClick={() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "groupEditReport/e/edit/" + summary.masterWorkId)}>
                            <L p={p} t={`Learners' edits and completion reports`}/>
                        </a>
                    }
                </div>
                {isOwner && showDelete &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                        <a className={styles.linkStyle} {...tapOrClick(this.handleDeleteGroupOpen)}>
                            <Icon pathName={`trash2`} premium={true}/>
                        </a>
                        {isShowingLabels &&
                            <a className={styles.label} onClick={this.handleDeleteGroupOpen}>
                                <L p={p} t={`Delete this group?!`}/>
                            </a>
                        }
                    </div>
                }
                {isOwner && showSettings &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '', currentTool === 'groupSettings' ? styles.lowOpacity : '')}>
                        <a className={styles.linkStyle} {...tapOrClick(() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "groupSettings/" + summary.groupId))}>
                            <Icon pathName={`cog`} premium={true}/>
                        </a>
                        {isShowingLabels &&
                            <a className={styles.label} onClick={() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "groupSettings/" + summary.groupId)}>
                                <L p={p} t={`Group settings`}/>
                            </a>
                        }
                    </div>
                }
                <a onClick={this.toggleLabels} className={classes(styles.labelChoice, isShowingLabels ? styles.moreTop : '')}>
                    {isShowingLabels ? <L p={p} t={`hide labels`}/> : <L p={p} t={`show labels`}/>}
                </a>

                {isShowingModal_work &&
                  <MessageModal handleClose={this.handleDeleteGroupClose} heading={<L p={p} t={`Delete this Group?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this group?`}/>} isConfirmType={true}
                     {...tapOrClick(this.handleDelete)} />
                }
            </div>
      )
  }
}
