import React, {Component} from 'react';
import styles from './MenuDocumentRibbon.css';
import MessageModal from '../MessageModal';
import WorkSummaryModal from '../../components/WorkSummaryModal';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class MenuDocumentRibbon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_delete: false,
						isShowingModal_chooseWork: false,
						isShowingModal_notSubmittedYet: false,
						isShowingModal_noAccess: false,
        };
    }

		validateDelete = () => {
				this.handleDeleteOpen();
		}

    handleDeleteOpen = () =>  this.setState({isShowingModal_delete: true})
		handleDeleteClose = () => {
				this.setState({isShowingModal_delete: false});
				this.props.hideMenu();
		}
		handleDelete = () => {
        const {deleteWork, personId, chosenWork} = this.props;
				deleteWork(personId, chosenWork.workId);
				this.handleDeleteClose();
    }


		handleSummaryOpen = (showWorkId) => {
				const {workSummaries} = this.props;
				let workSummary = null;
				workSummaries && workSummaries.length > 0 && workSummaries.forEach(m => {
						if (m.workId === showWorkId) workSummary = m;
				});
				this.setState({ showWorkId, workSummary })
		}
		handleSummaryClose = (showWorkId) => this.setState({showWorkId: '', workSummary: {}})

		handleChooseWorkOpen = () => this.setState({ isShowingModal_chooseWork: true })
		handleChooseWorkClose = () => this.setState({ isShowingModal_chooseWork: false })

		handleNotSubmittedYetOpen = () => this.setState({ isShowingModal_notSubmittedYet: true })
		handleNotSubmittedYetClose = () => this.setState({ isShowingModal_notSubmittedYet: false })

		handleNoAccessOpen = () => this.setState({ isShowingModal_noAccess: true })
		handleNoAccessClose = () => this.setState({ isShowingModal_noAccess: false })

    render() {
        const {className="", chosenWork={}, personId, setWorkCurrentSelected, updateChapterDueDate, updateChapterComment, updatePersonConfig,
								personConfig, mineOrOthers } = this.props;
        const {isShowingModal_delete, showWorkId, workSummary, isShowingModal_chooseWork, isShowingModal_notSubmittedYet, isShowingModal_noAccess} = this.state;

        return (
            <div className={classes(styles.container, styles.row, className)}>
								<a onClick={!chosenWork.workId
												? this.handleChooseWorkOpen
												: mineOrOthers === 'Mine' || (chosenWork.studentAssignmentResponseId && chosenWork.penspringSubmittedDate)
														? () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', `/editReview/${chosenWork.workId}`)
													  : this.handleNotSubmittedYetOpen} data-rh={`Review this document and it's edits`}>
										<Icon pathName={`register`} premium={true} className={classes(styles.image, styles.moreTopMargin,
											  (!chosenWork.workId || (mineOrOthers === 'Others' && !(chosenWork.studentAssignmentResponseId && chosenWork.penspringSubmittedDate))
														? styles.opacityLow : ''))}/>
								</a>
								{mineOrOthers === 'Mine' &&
		                <a onClick={!chosenWork.workId
														? this.handleChooseWorkOpen
														: mineOrOthers === chosenWork.mineOrOthers
																? () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', '/giveAccessToEditors')
															  : this.handleNoAccessOpen} data-rh={'Grant access to editors'}>
		                    <Icon pathName={`users0`} premium={true} className={classes(styles.image, styles.moreTopMargin,
														(!chosenWork.workId || mineOrOthers !== chosenWork.mineOrOthers ? styles.opacityLow : ''))}/>
		                </a>
								}
                <a onClick={!chosenWork.workId
												? this.handleChooseWorkOpen
												: () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', '/report/e/edit')} data-rh={'Editor reports'}>
                    <Icon pathName={`graph_report`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!chosenWork.workId ? styles.opacityLow : ''))}/>
                </a>
								{mineOrOthers === 'Mine' &&
		                <a onClick={!chosenWork.workId
														? this.handleChooseWorkOpen
														: mineOrOthers === chosenWork.mineOrOthers
																? () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', '/workSettings')
															  : this.handleNoAccessOpen} data-rh={'Document settings'}>
		                    <Icon pathName={`cog`} premium={true} className={classes(styles.image, styles.moreTopMargin,
														(!chosenWork.workId || mineOrOthers !== chosenWork.mineOrOthers ? styles.opacityLow : ''))}/>
		                </a>
								}
		            <a onClick={!chosenWork.workId
												? this.handleChooseWorkOpen
												: () => this.handleSummaryOpen(chosenWork.workId)} data-rh={'Document and editor statistics'}>
                    <Icon pathName={`info`} className={classes(styles.image, styles.lowerOpacity, styles.moreTopMargin, (!chosenWork.workId ? styles.opacityLow : ''))}/>
                </a>
								{mineOrOthers === 'Mine' &&
		                <a onClick={!chosenWork.workId
														? this.handleChooseWorkOpen
														: mineOrOthers === chosenWork.mineOrOthers
																? this.validateDelete
															  : this.handleNoAccessOpen} data-rh={`Delete this document`}>
												<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin,
														(!chosenWork.workId || mineOrOthers !== chosenWork.mineOrOthers ? styles.opacityLow : ''))}/>
		                </a>
								}
                {isShowingModal_delete &&
                    <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this document?`}/>} isConfirmType={true}
                       explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} onClick={this.handleDelete} />
                }
								{isShowingModal_chooseWork &&
                    <MessageModal handleClose={this.handleChooseWorkClose} heading={<L p={p} t={`Choose a document`}/>}
                       explainJSX={<L p={p} t={`Click on a document name and then the tools will become available for use.`}/>} onClick={this.handleChooseWorkClose}/>
                }
								{isShowingModal_notSubmittedYet &&
                    <MessageModal handleClose={this.handleNotSubmittedYetClose} heading={<L p={p} t={`Homework not yet submitted`}/>}
                       explainJSX={<L p={p} t={`This homework has not been submitted yet.`}/>} onClick={this.handleNotSubmittedYetClose}/>
                }
								{isShowingModal_noAccess &&
                    <MessageModal handleClose={this.handleNoAccessClose} heading={<L p={p} t={`You do not have access to this action`}/>}
                       explainJSX={<L p={p} t={`You are not the owner of this file in order to choose this action.`}/>} onClick={this.handleNoAccessClose}/>
                }
								{showWorkId &&
		              	<WorkSummaryModal handleClose={this.handleSummaryClose} summary={workSummary} showTitle={true}
                       onClick={this.handleSave} setWorkCurrentSelected={this.setWorkCurrentSelectedPlusClose}
                       personId={personId} updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                       updatePersonConfig={updatePersonConfig} personConfig={personConfig} headerTitleOnly={true}/>
		            }
						</div>
        )
    }
};
