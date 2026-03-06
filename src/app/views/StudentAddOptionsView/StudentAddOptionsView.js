import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import {browserHistory, Link} from 'react-router';
import styles from './StudentAddOptionsView.css';
const p = 'StudentAddOptionsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import Button from '../../components/Button';
import FileUploadModal from '../../components/FileUploadModal';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class StudentAddOptionsView extends Component {
    constructor(props) {
      super(props);

      this.state = {
					isShowingFileUpload: false,
      }
    }

		fileUploadBuildUrl = () => {
	      const {personId} = this.props;
				this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`If you didn't get an error, the file was sent.  We'll be back in touch as early as an hour from now.`}/></div>)
	      return `${apiHost}ebi/studentAdd/fileUpload/help/` + personId;
	  }

		recallAfterFileUpload = () => {
				//const {courseDocumentsInit, assignmentsInit, personId, courseEntryId} = this.props;
				//Some init file here?
		}

		handleFileUploadOpen = () => this.setState({isShowingFileUpload: true })
	  handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
	  handleSubmitFile = () => {
	      //const {courseDocumentsInit, personId, courseEntryId} = this.props;
				//Some init file here?
				this.handleFileUploadClose();
	  }

		render() {
				const {personId, companyConfig} = this.props;
				const {isShowingFileUpload} = this.state;

		    return (
		        <div className={styles.container}>
		            <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
		              <L p={p} t={`Options for Adding Students`}/>
		            </div>
								<div className={styles.privacyPosition}>
										<Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
								</div>
								<div className={classes(styles.row, styles.space)}>
										<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
										<div className={styles.optionCount}>1</div>
										<div className={styles.description}><L p={p} t={`Enter in students manually one-at-a-time`}/></div>
										<div className={styles.buttonPosition}>
												<Button label={<L p={p} t={`Go >`}/>} onClick={() => browserHistory.push('/studentAddManual')}/>
										</div>
								</div>
								<div className={classes(styles.row, styles.space)}>
										<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
										<div className={styles.optionCount}>2</div>
										<div className={styles.description}><L p={p} t={`Parents or guardians will register their children`}/></div>
								</div>
								<a className={classes(styles.link, styles.muchLeft)} href={`https:www.eCademy.app/regLogin/${encodeURIComponent(companyConfig.name)}`} target={'_blank'}>
										{`https:www.eCademy.app/regLogin/${encodeURIComponent(companyConfig.name)}`}
								</a>
								<div className={classes(styles.row, styles.space)}>
										<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
										<div className={styles.optionCount}>3</div>
										<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
								</div>
								<div className={classes(styles.description, styles.muchLeft)}>
										<L p={p} t={`Upload a list or spreadsheet of student and parent information and we will get all of the information in the right places for you`}/>
										<Button label={<L p={p} t={`Go >`}/>} onClick={this.handleFileUploadOpen}/>
								</div>
								<div className={classes(styles.row, styles.space)}>
										<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
										<div className={styles.optionCount}>4</div>
										<div className={styles.description}>
												<L p={p} t={`Upload a comma-delimited file (.csv).  Specify the order of the data. (This is limited only to comma-delimited files.)`}/>
										</div>
								</div>
								<div className={classes(styles.description, styles.muchMoreLeft)}>
										<Button label={<L p={p} t={`Go >`}/>} onClick={() => browserHistory.push('/studentAddBulk')}/>
								</div>
								<div className={classes(styles.muchTop)}>
										<OneFJefFooter />
								</div>
								{isShowingFileUpload &&
		                <FileUploadModal handleClose={this.handleFileUploadClose} title={<L p={p} t={`Bulk Student Upload`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={false}
		                    personId={personId} submitFileUpload={this.handleSubmitFile} sendInBuildUrl={this.fileUploadBuildUrl} handleRecordRecall={this.recallAfterFileUpload}
		                    acceptedFiles={".xls, .xlsx, .csv, .tsv"} iconFiletypes={['.xls', '.xlsx', '.csv', '.tsv']}/>
		            }
		        </div>
		    )
		};
}

export default withAlert(StudentAddOptionsView);
