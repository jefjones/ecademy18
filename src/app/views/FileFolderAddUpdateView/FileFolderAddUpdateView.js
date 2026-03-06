import React, {Component} from 'react';
import styles from './FileFolderAddUpdateView.css';
const p = 'FileFolderAddUpdateView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import {emptyGuid} from '../../utils/GuidValidate.js';

export default class FileFolderAddUpdateView extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
						folderName: '',
						parentWorkFolderId: '',
        }

    }

		componentDidUpdate() {
				const {workFolder} = this.props;
				const {isUpdated} = this.state;
				if (!isUpdated && workFolder) {
						this.setState({ folderName: workFolder.folderName, parentWorkFolderId: workFolder.parentWorkFolderId });
				}
		}

		processForm = () => {
	      const {addOrUpdateFolder, personId, workFolderId, parentWorkFolderId, mineOrOthers}  = this.props;
	      let hasError = false;

				if (!this.state.folderName) {
	          hasError = true;
	          this.setState({ errorFolderName: <L p={p} t={`Please enter a folder name`}/>});
	      }

	      if (!hasError) {
	          addOrUpdateFolder({personId, mineOrOthers, workFolderId, parentWorkFolderId, folderName: this.state.folderName })
	      }
	  }

		handleChange = (event) => {
			let newState = this.state;
			newState[event.target.name] = event.target.value;
			this.setState(newState);
		}

    render() {
          const {workFolderId, workFolder, fileFolderList} = this.props;
          let {errorFolderName, folderName, parentWorkFolderId} = this.state;

          return (
            <div className={styles.container}>
                <div className={globalStyles.pageTitle}>
                    {!workFolderId && workFolderId !== emptyGuid() ? <L p={p} t={`Edit Existing Folder`}/> : <L p={p} t={`Add New Folder`}/>}
                </div>
								<div className={styles.marginLeft}>
										<div>
												<InputText
														size={"medium-long"}
														name={"folderName"}
														label={<L p={p} t={`Folder name`}/>}
														inputClassName={styles.input}
														value={folderName || ''}
														onChange={this.handleChange}
														error={errorFolderName}/>
										</div>
										<div>
												<SelectSingleDropDown
														label={<L p={p} t={`Assign to a parent folder?`}/>}
														value={parentWorkFolderId || ''}
														options={fileFolderList || []}
														error={''}
														height={`medium`}
														className={styles.singleDropDown}
														id={`parentListChoice`}
														onChange={this.handleChange} />
										</div>
								</div>
								<div className={styles.rowRight}>
                    <ButtonWithIcon label={<L p={p} t={`Submit`}/>} onClick={this.processForm}/>
                </div>
                <OneFJefFooter />
            </div>
        )
    }
};

//    djsConfig={djsConfig} />
