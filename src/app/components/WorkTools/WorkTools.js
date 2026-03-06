import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './WorkTools.css';
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

    handleDeleteType = () => {
        const {hasMultSections} = this.props;
        if (hasMultSections) {
            this.handleDeleteWorkOrSectionOpen();
        } else {
            this.handleDeleteWorkOpen();
        }
    }

    handleDelete = (type) => {
        //Notice that the default option for the switch below is to delete the work.  This is helpful for the situation
        //  when the Work only has one section so that the message dialog for the choice to delete the section or the entire document
        //  does not come up.  The user only has a confirmation to delete the entire document in that case.
        const {deleteWork, deleteChapter, personId, workSummary} = this.props;
        this.handleDeleteWorkOrSectionClose();
        this.handleDeleteWorkClose();
        switch(type) {
            case 'SECTION':
                deleteChapter(personId, workSummary.workId, workSummary.chapterId_current);
                break;
            default:
                deleteWork(personId, workSummary.workId);
                browserHistory.push("/myWorks");
        }
    }

    handleDeleteWorkClose = () => this.setState({isShowingModal_work: false})
    handleDeleteWorkOpen = () => this.setState({isShowingModal_work: true})
    handleDeleteWorkOrSectionClose = () => this.setState({isShowingModal_workOrSection: false})
    handleDeleteWorkOrSectionOpen = () => this.setState({isShowingModal_workOrSection: true})

    toggleLabels = () => {
        const {personId, updatePersonConfig, personConfig} = this.props;
        updatePersonConfig(personId, `WorkToolsShowLabels`, personConfig && !personConfig.workToolsShowLabels)
    }

    render() {
        const {personId, workSummary, className, isOwner, showEditorAccess=true, showDelete=false, showSettings=true,
                setWorkCurrentSelected, group, chapterId, personConfig, forceHideLabels, showLabels=(forceHideLabels ? false : true)} = this.props; //The chapterId is only sent in when this is the workSections page with the list of sections.  Otherwise the chapterId is the current chapterId in the workSummary record
        const {isShowingModal_work, isShowingModal_workOrSection} = this.state;
        let isShowingLabels = forceHideLabels
						? false
						: personConfig && personConfig.workToolsShowLabels
								? personConfig.workToolsShowLabels
								: false;

        return !workSummary ? null : (
            <div className={classes(className, isShowingLabels ? styles.containerColumn : styles.containerRow)}>
                {showSettings &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                        <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? <L p={p} t={`Edit or view document`}/> : null}
																{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, `/editReview/${workSummary.workId}`))}>
                            <Icon pathName={`register`} premium={true}/>
                        </a>
                        {isShowingLabels && showLabels &&
                            <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, `/editReview/${workSummary.workId}`)}>
                                <L p={p} t={`Edit or view document`}/>
                            </a>
                        }
                    </div>
                }
                {isOwner && showEditorAccess &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                        <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? <L p={p} t={`Give or view access`}/> : null}
																{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, group ? "/accessReport/" + group.groupId : "/giveAccessToEditors"))}>
                            <Icon pathName={`users0`} premium={true}/>
                        </a>
                        {isShowingLabels && showLabels &&
                            <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, group ? "/accessReport/" + group.groupId : "/giveAccessToEditors")}>
                                <L p={p} t={`Give or view access`}/>
                            </a>
                        }
                    </div>
                }
                <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                    <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? 'Editing counts and reports' : null}
														{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/report/e/edit/" + workSummary.workId))}>
                        <Icon pathName={`graph_report`} premium={true}/>
                    </a>
                    {isShowingLabels && showLabels &&
                        <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/report/e/edit")}>
                            <L p={p} t={`Editing counts and reports`}/>
                        </a>
                    }
                </div>
                {isOwner && showDelete &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                        <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? 'Delete document' : null} {...tapOrClick(this.handleDeleteType)}>
                            <Icon pathName={`trash2`} premium={true}/>
                        </a>
                        {isShowingLabels && showLabels &&
                            <a className={styles.label} onClick={this.handleDeleteType}>
                                <L p={p} t={`Delete document`}/>
                            </a>
                        }
                    </div>
                }
                {isOwner && showSettings &&
                    <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                        <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? 'Document settings' : null}
																{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/workSettings"))}>
                            <Icon pathName={`cog`} premium={true}/>
                        </a>
                        {isShowingLabels && showLabels &&
                            <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/workSettings")}>
                                <L p={p} t={`Document settings`}/>
                            </a>
                        }
                    </div>
                }
                {showLabels &&
	                  <a onClick={this.toggleLabels} className={classes(styles.labelChoice, isShowingLabels ? styles.moreTop : '')}>
	                      {isShowingLabels ? <L p={p} t={`hide labels`}/> : <L p={p} t={`show labels`}/>}
	                  </a>
                }
                {isShowingModal_work &&
                  <MessageModal handleClose={this.handleDeleteWorkClose} heading={<L p={p} t={`Delete this Document?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} isConfirmType={true}
                     {...tapOrClick(this.handleDelete)} />
                }
                {isShowingModal_workOrSection &&
                  <MessageModal handleClose={this.handleDeleteWorkOrSectionClose} heading={<L p={p} t={`Delete this Entire Document?`}/>}
                     explainJSX={<L p={p} t={`Do you want to delete this entire document or just the section?`}/>} isYesNoCancelType={true}
                     yesText={<L p={p} t={`Delete Document`}/>} noText={<L p={p} t={`Delete Section`}/>} cancelText={<L p={p} t={`Cancel`}/>} handleNo={() => this.handleDelete('SECTION')}
                     onClick={() => this.handleDelete('ENTIRE')} />
                }
            </div>
      )
  }
}
