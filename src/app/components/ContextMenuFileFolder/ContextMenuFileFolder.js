import React, {Component} from 'react';
import styles from './ContextMenuFileFolder.css';
import MessageModal from '../MessageModal';
import classes from 'classnames';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class ContextMenuFileFolder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal_delete: false,
        };
    }

		validateDelete = () => {
				this.handleDeleteOpen();
		}

    handleDelete = () => {
        const {removeRecord, personId, id} = this.props;
				removeRecord(personId, id);
				this.handleDeleteClose();
    }

    handleDeleteClose = () => {
				this.setState({isShowingModal_delete: false});
				this.props.hideMenu();
		}
    handleDeleteOpen = () =>  this.setState({isShowingModal_delete: true})

		handleSummaryOpen = (showWorkId) => this.setState({showWorkId})
		handleSummaryClose = (showWorkId) => this.setState({showWorkId: ''})

    render() {
        const {className="", sendToWorkAddNew, sendToFolderAddUpdate } = this.props;
        const {isShowingModal_delete, } = this.state;

        return !sendToWorkAddNew ? null : (
            <div className={classes(styles.container, styles.row, className)}>
                <div className={styles.multipleContainer}>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Add a new document`}>
												<div onClick={() => sendToWorkAddNew()}>
														<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'} className={classes(styles.image, styles.moreTopMargin)}
																superScriptClass={styles.plusSymbol}/>
												</div>
										</div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Add a new folder`}>
												<div onClick={() => sendToFolderAddUpdate()}>
														<Icon pathName={'folder_plus_inside'} premium={true} fillColor={'#dba01e'} superscript={'plus'} supFillColor={'green'}
																className={classes(styles.image, styles.moreTopMargin)} superScriptClass={styles.plusSymbol}/>
												</div>
										</div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Rename this folder`}>
												<div onClick={this.sendToFolderAddUpdate}>
														<Icon pathName={'folder_plus_inside'} premium={true} fillColor={'#dba01e'} superscript={'pencil0'} supFillColor={'red'}
																className={classes(styles.image, styles.moreTopMargin)} superScriptClass={styles.plusSymbolBigger}/>
												</div>
										</div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Move this folder (drag and drop)`} onClick={() => {}}>
												<Icon pathName={'folder_plus_inside'} premium={true} fillColor={'#dba01e'} superscript={'shuffle'} supFillColor={'green'}
														className={classes(styles.image, styles.moreTopMargin)} superScriptClass={styles.plusSymbolBigger}/>
										</div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Remove this folder`} onClick={() => {}}>
												<Icon pathName={'folder_plus_inside'} premium={true} fillColor={'#dba01e'} superscript={'cross'} supFillColor={'red'}
														className={classes(styles.image, styles.moreTopMargin)} superScriptClass={styles.plusSymbol}/>
										</div>
										<div className={classes(styles.row, styles.moreRight)} data-rh={`Remove one or more documents`} onClick={() => {}}>
												<Icon pathName={'papers'} premium={true} superscript={'cross'} supFillColor={'red'}
														className={classes(styles.image, styles.moreTopMargin)} superScriptClass={styles.plusSymbol}/>
										</div>
                </div>
                {isShowingModal_delete &&
                    <MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this document?`}/>} isConfirmType={true}
                       explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} onClick={this.handleDelete} />
                }
						</div>
        )
    }
};
