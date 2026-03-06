import React, {Component} from 'react';
import styles from './ContextMenuDocument.css';
import MessageModal from '../MessageModal';
import WorkSummaryModal from '../../components/WorkSummaryModal';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class ContextMenuDocument extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_delete: false,
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
        const {deleteWork, personId, workId} = this.props;
				deleteWork(personId, workId);
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

    render() {
        const {className="", workId, personId, setWorkCurrentSelected, updateChapterDueDate, updateChapterComment,
								updatePersonConfig, personConfig } = this.props;
        const {isShowingModal_delete, showWorkId, workSummary} = this.state;

        return (
            <div className={classes(styles.container, styles.row, className)}>
                <div className={styles.multipleContainer}>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Review this document and it's edits`}>
												<a onClick={() => setWorkCurrentSelected(personId, workId, '', '', `/editReview/${workId}`)}>
														<Icon pathName={`register`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
												</a>
										</div>
                    <div className={classes(styles.row, styles.moreRight)} data-rh={'Grant access to editors'}>
                        <a onClick={() => setWorkCurrentSelected(personId, workId, '', '', '/giveAccessToEditors')}>
                            <Icon pathName={`users0`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
                    <div className={classes(styles.row, styles.moreRight)} data-rh={'Editing counts and reports'}>
                        <a onClick={() => setWorkCurrentSelected(personId, workId, '', '', '/report/e/edit')}>
                            <Icon pathName={`graph_report`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={'Document settings'}>
                        <a onClick={() => setWorkCurrentSelected(personId, workId, '', '', '/workSettings')}>
                            <Icon pathName={`cog`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={'Document and editor statistics'}>
                        <a onClick={() => this.handleSummaryOpen(workId)}>
                            <Icon pathName={`info`} className={classes(styles.image, styles.lowerOpacity, styles.moreTopMargin)}/>
                        </a>
                    </div>
                    {<div className={classes(styles.row, styles.moreRight)} data-rh={`Delete this document`}>
                        <a onClick={this.validateDelete}>
														<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                        </a>
                    </div>}
                </div>
                {isShowingModal_delete &&
                    <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this document?`}/>} isConfirmType={true}
                       explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} onClick={this.handleDelete} />
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
