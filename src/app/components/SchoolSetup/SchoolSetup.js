import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import styles from './SchoolSetup.css';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../SelectSingleDropDown';
import Icon from '../Icon';
import RadioGroup from '../RadioGroup';
import MessageModal from '../MessageModal';
import InputFile from '../InputFile';
import ButtonWithIcon from '../ButtonWithIcon';
import ImageDisplay from '../ImageDisplay';
import FileUploadModal from '../FileUploadModal';
import TextareaModal from '../TextareaModal';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class SchoolSetup extends Component {
    constructor(props) {
        super(props);

        this.state = {
						expanded: false,
						adminPersonId: '',
						isShowingModal_remove: false,
						isShowingWebsiteLink_company: false,
						isShowingFileUpload_company: false,
						isShowingModal_removeCompanyDoc: false,
				}
		}

		changeUser = (event, userRole) => {
	      const field = event.target.name;
	      let newState = Object.assign({}, this.state);
	      newState[field] = event.target.value;
	      this.setState(newState);
				browserHistory.push(`/userAdd/${userRole}/${event.target.value}`);
    }

		handleRemoveDemoRecordsOpen = () => this.setState({isShowingModal_remove: true})
	  handleRemoveDemoRecordsClose = () => this.setState({isShowingModal_remove: false})
	  handleRemoveDemoRecords = () => {
	      const {removeDemoRecords, personId} = this.props;
	      removeDemoRecords(personId)
	      this.handleRemoveDemoRecordsClose();
	  }

		handleInputFile_logo = (file) => {
				this.setState({ selectedFile_logo: file });
				var img = this.imageViewer;
				var reader = new FileReader();
				reader.onloadend = function() {
				    img.src = reader.result;
				}
				reader.readAsDataURL(file);
				this.logoFile.after(img);
		}

		handleInputFile_signature = (file) => {
				this.setState({ selectedFile_signature: file });
				var img = this.signatureViewer;
				var reader = new FileReader();
				reader.onloadend = function() {
				    img.src = reader.result;
				}
				reader.readAsDataURL(file);
				this.signatureFile.after(img);
		}

		handleInputFile_officialSeal = (file) => {
				this.setState({ selectedFile_officialSeal: file });
				var img = this.officialSealViewer;
				var reader = new FileReader();
				reader.onloadend = function() {
				    img.src = reader.result;
				}
				reader.readAsDataURL(file);
				this.officialSealFile.after(img);
		}

    handleInputFile_coursesAndSections = (file) => this.setState({ selectedFile_coursesAndSections: file })
    handleInputFile_gradRequirements = (file) => this.setState({ selectedFile_gradRequirements: file })
    handleInputFile_studentTranscripts = (file) => this.setState({ selectedFile_studentTranscripts: file })

		handleRemoveInputFile_logo = () => {
				this.setState({ selectedFile_logo: null });
				var img = this.imageViewer;
		    img.src = "";
				this.logoFile.after(img);
		}

		handleRemoveInputFile_signature = () => {
				this.setState({ selectedFile_signature: null });
				var img = this.signatureViewer;
		    img.src = "";
				this.signatureFile.after(img);
		}

		handleRemoveInputFile_officialSeal = () => {
				this.setState({ selectedFile_officialSeal: null });
				var img = this.officialSealViewer;
		    img.src = "";
				this.officialSealFile.after(img);
		}

		handleFileUploadSubmit = () => {
				const {personId} = this.props;
				const {selectedFile_logo} = this.state;
				let data = new FormData();
				data.append('file', selectedFile_logo)

				let url = `${apiHost}ebi/companyConfig/addLogo/${personId}`

				axios.post(url, data,
						{
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Access-Control-Allow-Credentials' : 'true',
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
								"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
								"Authorization": "Bearer " + localStorage.getItem("authToken"),
						}})
				this.setState({ isLogoFileSaved: true });
		}

		handleFileUploadSubmit_signature = () => {
				const {personId} = this.props;
				const {selectedFile_signature} = this.state;
				let data = new FormData();
				data.append('file', selectedFile_signature)

				let url = `${apiHost}ebi/companyConfig/addSignature/${personId}`

				axios.post(url, data,
						{
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Access-Control-Allow-Credentials' : 'true',
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
								"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
								"Authorization": "Bearer " + localStorage.getItem("authToken"),
						}})
				this.setState({ isSignatureFileSaved: true });
		}

		handleFileUploadSubmit_officialSeal = () => {
				const {personId} = this.props;
				const {selectedFile_officialSeal} = this.state;
				let data = new FormData();
				data.append('file', selectedFile_officialSeal)

				let url = `${apiHost}ebi/companyConfig/addOfficialSeal/${personId}`

				axios.post(url, data,
						{
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Access-Control-Allow-Credentials' : 'true',
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
								"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
								"Authorization": "Bearer " + localStorage.getItem("authToken"),
						}})
				this.setState({ isOfficialSealFileSaved: true });
		}

    handleFileUploadSubmit_coursesAndSectionsOpen = () => this.setState({ isShowingModal_coursesAndSections: true })
    handleFileUploadSubmit_coursesAndSectionsClose = () => this.setState({ isShowingModal_coursesAndSections: false })
    handleFileUploadSubmit_coursesAndSections = () => {
				const {personId} = this.props;
				const {selectedFile_coursesAndSections, coursesAndSectionsSchoolYearId} = this.state;
        this.handleFileUploadSubmit_coursesAndSectionsClose();
				let data = new FormData();
				data.append('file', selectedFile_coursesAndSections)

				let url = `${apiHost}ebi/schoolSetup/uploadCoursesAndSectionsFile/${personId}/${coursesAndSectionsSchoolYearId}`

				axios.post(url, data,
						{
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Access-Control-Allow-Credentials' : 'true',
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
								"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
								"Authorization": "Bearer " + localStorage.getItem("authToken"),
						}})
				this.setState({ isFileSaved_coursesAndSections: true });
		}

    handleFileUploadSubmit_gradRequirementsOpen = () => this.setState({ isShowingModal_gradRequirements: true })
    handleFileUploadSubmit_gradRequirementsClose = () => this.setState({ isShowingModal_gradRequirements: false })
    handleFileUploadSubmit_gradRequirements = () => {
				const {personId} = this.props;
				const {selectedFile_gradRequirements} = this.state;
        this.handleFileUploadSubmit_gradRequirementsClose()
				let data = new FormData();
				data.append('file', selectedFile_gradRequirements)

				let url = `${apiHost}ebi/schoolSetup/uploadGradRequirementsFile/${personId}`

				axios.post(url, data,
						{
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Access-Control-Allow-Credentials' : 'true',
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
								"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
								"Authorization": "Bearer " + localStorage.getItem("authToken"),
						}})
				this.setState({ isFileSaved_gradRequirements: true });
		}

    handleFileUploadSubmit_studentTranscriptsOpen = () => this.setState({ isShowingModal_studentTranscripts: true })
    handleFileUploadSubmit_studentTranscriptsClose = () => this.setState({ isShowingModal_studentTranscripts: false })
    handleFileUploadSubmit_studentTranscripts = () => {
				const {personId} = this.props;
				const {selectedFile_studentTranscripts} = this.state;
        this.handleFileUploadSubmit_studentTranscriptsClose();
				let data = new FormData();
				data.append('file', selectedFile_studentTranscripts)

				let url = `${apiHost}ebi/schoolSetup/uploadStudentTranscriptsFile/${personId}`

				axios.post(url, data,
						{
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Access-Control-Allow-Credentials' : 'true',
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
								"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
								"Authorization": "Bearer " + localStorage.getItem("authToken"),
						}})
				this.setState({ isFileSaved_studentTranscripts: true });
		}

		handleRemoveFileUploadOpen = (fileUploadId) => this.setState({isShowingModal_removeLogo: true, fileUploadId })
	  handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeLogo: false })
	  handleRemoveFileUpload = () => {
	      const {removeLogoFileUpload, personId} = this.props;
	      const {fileUploadId} = this.state;
	      removeLogoFileUpload(personId, fileUploadId);
	      this.handleRemoveFileUploadClose();
	  }

		handleRemoveFileUploadOpen_signature = (fileUploadId) => this.setState({isShowingModal_removeSignature: true, fileUploadId })
	  handleRemoveFileUploadClose_signature = () => this.setState({isShowingModal_removeSignature: false })
	  handleRemoveFileUpload_signature = () => {
	      const {removeSignatureFileUpload, personId} = this.props;
	      const {fileUploadId} = this.state;
	      removeSignatureFileUpload(personId, fileUploadId);
	      this.handleRemoveFileUploadClose_signature();
	  }

		handleRemoveFileUploadOpen_officialSeal = (fileUploadId) => this.setState({isShowingModal_removeOfficialSeal: true, fileUploadId })
	  handleRemoveFileUploadClose_officialSeal = () => this.setState({isShowingModal_removeOfficialSeal: false })
	  handleRemoveFileUpload_officialSeal = () => {
	      const {removeOfficialSealFileUpload, personId} = this.props;
	      const {fileUploadId} = this.state;
	      removeOfficialSealFileUpload(personId, fileUploadId);
	      this.handleRemoveFileUploadClose_officialSeal();
	  }

		handleFileUploadOpen = () => this.setState({isShowingFileUpload_company: true })
	  handleFileUploadClose = () => this.setState({isShowingFileUpload_company: false})
	  handleSubmitFile = () => {
	      const {getCompanyConfig, personId} = this.props;
	      getCompanyConfig(personId);
				this.handleFileUploadClose();
	  }

		handleWebsiteLinkOpen = () => this.setState({isShowingWebsiteLink_company: true})
		handleWebsiteLinkClose = () => this.setState({isShowingWebsiteLink_company: false})
		handleWebsiteLinkSave = (websiteLink, websiteTitle) => {
				const {saveCompanyWebsiteLink, companyConfig, personId} = this.props;
				saveCompanyWebsiteLink(personId, companyConfig.companyId, websiteLink, websiteTitle);
				this.handleWebsiteLinkClose();
		}

		handleRemoveCompanyDocOpen = (companyDocumentId) => this.setState({isShowingModal_removeCompanyDoc: true, companyDocumentId })
		handleRemoveCompanyDocClose = () => this.setState({isShowingModal_removeCompanyDoc: false})
		handleRemoveCompanyDoc = () => {
				const {removeCompanyDocumentFile, personId} = this.props;
				const {companyDocumentId} = this.state;
				removeCompanyDocumentFile(personId, companyDocumentId);
				this.handleRemoveCompanyDocClose();
		}

		fileUploadBuildUrl = (title) => {
				const {personId, companyConfig} = this.props;
				return `${apiHost}ebi/companyDocuments/fileUpload/` + personId + `/` + companyConfig.companyId + `/` + encodeURIComponent(title);
		}

		recallAfterFileUpload = () => {
	    	const {getCompanyConfig, personId} = this.props;
	    	getCompanyConfig(personId);
	  }

    handleCoursesAndSectionsSchoolYear = (event) => this.setState({ coursesAndSectionsSchoolYearId: event.target.value})

		render() {
				const {personId, className, companyConfig={}, schoolYears, intervals, setCompanyConfig, admins, frontDesks, counselors} = this.props;
				const {adminPersonId, isShowingModal_remove, selectedFile_logo, isLogoFileSaved, isShowingWebsiteLink_company, isShowingFileUpload_company,
								isShowingModal_removeCompanyDoc, selectedFile_signature, isSignatureFileSaved, isShowingModal_removeLogo, isShowingModal_removeSignature,
								isShowingModal_removeOfficialSeal, selectedFile_officialSeal, isOfficialSealFileSaved, frontDeskPersonId, counselorPersonId,
								coursesAndSectionsSchoolYearId, selectedFile_coursesAndSections, isFileSaved_coursesAndSections, isFileSaved_gradRequirements,
                selectedFile_gradRequirements, isFileSaved_studentTranscripts, selectedFile_studentTranscripts, isShowingModal_gradRequirements,
                isShowingModal_coursesAndSections, isShowingModal_studentTranscripts} = this.state;

				let features = companyConfig && companyConfig.features ? companyConfig.features : {};

		    return (
						<div className={className}>
								{companyConfig.urlcode === 'Liahona' &&
										<div onClick={() => {browserHistory.push(`/scheduleAssignByMath`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Setup schedule by math`}/></div>
								}
								{features.behaviorIncidents && <div onClick={() => {browserHistory.push(`/behaviorIncidentTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Behavior incident types`}/></div>}
								{features.carpool && <div onClick={() => {browserHistory.push(`/carpoolAreas`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Carpool areas`}/></div>}
                {features.courses &&
                    <div>
                        <hr/>
                            <div className={classes(styles.moreLeft, styles.label)}><L p={p} t={`Courses and Graduation Requirements`}/></div>
                            <div onClick={() => {browserHistory.push(`/classPeriods`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Class periods`}/></div>
            								<div onClick={() => {browserHistory.push(`/courseTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Course types`}/></div>
                            <div className={classes(styles.muchLeft, styles.label, styles.moreTop)}><L p={p} t={`COURSES`}/></div>
                            <a href={`https://penspringblob.blob.core.windows.net/blob-container/CoursesAndSections.csv?se=2020-02-23T02%3A28%3A04Z&sp=rwl&sv=2018-03-28&sr=c&sig=eUFXcFb%2BoWVcZr4%2FU3LLJEUwJeVSRAlCytEc4oqBtCo%3D`} className={classes(styles.muchMuchLeft, styles.menuHeader)}>
                                <L p={p} t={`Download course/section CSV template`}/>
                            </a>
                            <div className={classes(styles.muchMuchLeft, styles.row)}>
                                <InputFile label={<L p={p} t={`Upload courses comma-delimited file (csv)`}/>} onChange={this.handleInputFile_coursesAndSections}/>
            										{selectedFile_coursesAndSections && !isFileSaved_coursesAndSections &&
                                    <div className={styles.row}>
                                        <div className={styles.moreLeft}>
                                            <SelectSingleDropDown
                                                label={<L p={p} t={`School year`}/>}
                                                id={coursesAndSectionsSchoolYearId}
                                                value={coursesAndSectionsSchoolYearId || ''}
                                                options={schoolYears}
                                                height={`medium`}
                                                onChange={this.handleCoursesAndSectionsSchoolYear}/>
                                        </div>
                                        <ButtonWithIcon icon={'checkmark_circle'} onClick={this.handleFileUploadSubmit_coursesAndSectionsOpen} label={<L p={p} t={`Save`}/>}/>
                                    </div>
                                }
                            </div>

                            <div onClick={() => {browserHistory.push(`/baseCourses`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`See base course list`}/></div>
                            <div onClick={() => {browserHistory.push(`/scheduledCourses`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`See sections scheduled list`}/></div>

                            <div className={classes(styles.muchLeft, styles.label, styles.moreTop)}><L p={p} t={`GRADUATION REQUIREMENTS`}/></div>
                            <a href={`https://penspringblob.blob.core.windows.net/blob-container/GraduationRequirements.csv?se=2020-02-23T02%3A29%3A29Z&sp=rwl&sv=2018-03-28&sr=c&sig=0XUkYw%2BVIOArq5ye1bZNmwp6vHJA1EJnteycmTETqKE%3D`} className={classes(styles.muchMuchLeft, styles.menuHeader)}>
                                <L p={p} t={`Download graduation requirements CSV template`}/>
                            </a>
                            <div className={classes(styles.muchMuchLeft, styles.row)}>
                                <InputFile label={<L p={p} t={`Upload graduation requirements comma-delimited file (csv)`}/>} onChange={this.handleInputFile_gradRequirements}/>
            										{selectedFile_gradRequirements && !isFileSaved_gradRequirements &&
                                    <ButtonWithIcon icon={'checkmark_circle'} onClick={this.handleFileUploadSubmit_gradRequirementsOpen} label={<L p={p} t={`Save`}/>}/>
                                }
                            </div>
                            <div onClick={() => {browserHistory.push(`/financeCreditTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`Graduation requirements list`}/></div>

                            <div className={classes(styles.muchLeft, styles.label, styles.moreTop)}><L p={p} t={`STUDENT TRANSCRIPTS`}/></div>
                            <a href={`https://penspringblob.blob.core.windows.net/blob-container/StudentTranscripts.csv?se=2020-02-23T02%3A30%3A18Z&sp=rwl&sv=2018-03-28&sr=c&sig=M29MLUmLwzHsdrkcwW%2BJdjveuEJdt9I8Wn7zanQisdA%3D`} className={classes(styles.muchMuchLeft, styles.menuHeader)}>
                                <L p={p} t={`Download student transcripts CSV template`}/>
                            </a>
                            <div className={classes(styles.muchMuchLeft, styles.row)}>
                                <InputFile label={<L p={p} t={`Upload student transcripts comma-delimited file (csv)`}/>} onChange={this.handleInputFile_studentTranscripts}/>
            										{selectedFile_studentTranscripts && !isFileSaved_studentTranscripts &&
                                    <ButtonWithIcon icon={'checkmark_circle'} onClick={this.handleFileUploadSubmit_studentTranscriptsOpen} label={<L p={p} t={`Save`}/>}/>
                                }
                            </div>
                            <div onClick={() => {browserHistory.push(`/financeCreditTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`Student transcripts list`}/></div>
        								<hr/>
                    </div>
                }
								{features.courses && <div onClick={() => {browserHistory.push(`/contentTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Content types`}/></div>}
								{features.courses && <div onClick={() => {browserHistory.push(`/learningPathways`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Disciplines (subjects)`}/></div>}
								{features.billing &&
                    <div>
                        <hr/>
        										<div className={classes(styles.moreLeft, styles.label)}>Finance</div>
        										<div onClick={() => {browserHistory.push(`/financeCreditFeeAdd`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Course fees`}/></div>
        										<div onClick={() => {browserHistory.push(`/financeCreditTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Credit types`}/></div>
        										<div onClick={() => {browserHistory.push(`/financeFeeTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Fee types`}/></div>
        										<div onClick={() => {browserHistory.push(`/financeGLCodes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`General ledger codes`}/></div>
        										<div onClick={() => {browserHistory.push(`/financeGroups`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Groups`}/></div>
        										<div onClick={() => {browserHistory.push(`/financeLowIncomeWaivers`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Low income waiver(s)`}/></div>
        										<div onClick={() => {browserHistory.push(`/financeWaiverSchedule`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Waiver schedule`}/></div>
        								<hr/>
                    </div>
                }
								<div className={classes(styles.topSpace, styles.moreLeft)}>
										<RadioGroup
												data={[{ label: "Traditional", id: 'TRADITIONAL' }, { label: "Standards-based", id: 'STANDARDSRATING' }, { label: "Pass / Fail", id: 'PASSFAIL' }]}
												label={<L p={p} t={`Grading Type`}/>}
												horizontal={true}
												className={styles.radio}
												initialValue={companyConfig.gradingType || 'TRADITIONAL'}
												onClick={(value) => {setCompanyConfig(personId, 'GradingType', value); setCompanyConfig(personId, 'hasOpenedSettings', true);}}/>
								</div>
								{companyConfig.gradingType === 'STANDARDSRATING' &&
										<div onClick={() => {browserHistory.push(`/standardsRating`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Standards-based settings`}/></div>
								}
								{companyConfig.gradingType === 'PASSFAIL' &&
										<div onClick={() => {browserHistory.push(`/passFailRating`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Pass / Fail ratings`}/></div>
								}
                {features.courses && <div onClick={() => {browserHistory.push(`/gradeScale`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Grade scale`}/></div>}
								{features.lockers && <div onClick={() => {browserHistory.push(`/lockerSettings`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Lockers`}/></div>}
                {features.lockers && <div onClick={() => {browserHistory.push(`/paddleLockSettings`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Padlocks`}/></div>}
                <div onClick={() => {browserHistory.push(`/passwordResetAdmin`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Password reset`}/></div>
								{features.pickupLane && <div onClick={() => {browserHistory.push(`/pickupLaneSettings`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Pick-up lane (GPS locations)`}/></div>}
                <div onClick={() => {browserHistory.push(`/schoolDays`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`School days`}/></div>
								<div onClick={() => {browserHistory.push(`/intervals`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Semester or quarter intervals`}/></div>
								{features.volunteerHours && <div onClick={() => {browserHistory.push(`/volunteerTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Volunteer types`}/></div>}
								<hr/>
								{companyConfig && companyConfig.schoolRegistrationCode &&
										<div className={styles.moreLeft}>
										 		<div className={styles.label}><L p={p} t={`Registration link (for the primary guardian)`}/></div>
												<a href={`https://www.eCademy.app/reg/${companyConfig.schoolRegistrationCode}`} className={globalStyles.link}>
														{`https://www.eCademy.app/reg/${companyConfig.schoolRegistrationCode}`}
												</a>
										</div>
								}
								<hr/>
								<div className={styles.moreLeft}>
										<SelectSingleDropDown
												label={<L p={p} t={`Current school year for class views and student schedules`}/>}
												value={(companyConfig && companyConfig.schoolYearId) || ''}
												options={schoolYears}
												height={`medium`}
												onChange={(event) => {setCompanyConfig(personId, 'schoolYearId', event.target.value); setCompanyConfig(personId, 'hasOpenedSettings', true);}}/>
								</div>
								<div className={styles.moreLeft}>
										<SelectSingleDropDown
												label={<L p={p} t={`Current semester or quarter interval for class views and student schedules`}/>}
												value={(companyConfig && companyConfig.intervalId) || ''}
												options={intervals}
												height={`medium`}
												onChange={(event) => {setCompanyConfig(personId, 'intervalId', event.target.value); setCompanyConfig(personId, 'hasOpenedSettings', true);}}/>
								</div>
								<div className={styles.moreLeft}>
										<SelectSingleDropDown
												label={<L p={p} t={`People's name order`}/>}
												value={(companyConfig && companyConfig.studentNameFirst) || ''}
												options={[{id: 'FIRSTNAME', label: `First name first`}, {id: 'LASTNAME', label: `Last name first`}]}
												height={`medium`}
												onChange={(event) => {setCompanyConfig(personId, 'studentNameFirst', event.target.value); setCompanyConfig(personId, 'hasOpenedSettings', true);}}/>
								</div>
								<div className={styles.moreLeft}>
										<SelectSingleDropDown
												id={`intervalType`}
												name={`intervalType`}
												label={<L p={p} t={`Interval type`}/>}
												value={(companyConfig && companyConfig.intervalType) || 'SEMESTERS'}
												noBlank={true}
												options={[
														{id: 'QUARTERS', label: `Quarters`},
														{id: 'SEMESTERS', label: `Semesters`},
														{id: 'TRIMESTERS', label: `Trimesters`},
												]}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={(event) => {setCompanyConfig(personId, 'intervalType', event.target.value); setCompanyConfig(personId, 'hasOpenedSettings', true);}}/>
								</div>
								<hr/>
								<div>
										<div className={styles.row}>
												<Icon pathName={'plus'} className={styles.iconAdmin} fillColor={'green'}/>
												<Link to={`/userAdd/admin`} className={styles.menuHeader}><L p={p} t={`Add Administrator`}/></Link>
										</div>
										<div>
												<SelectSingleDropDown
														id={`adminPersonId`}
														name={`adminPersonId`}
														label={<L p={p} t={`Administrators`}/>}
														value={adminPersonId}
														options={admins}
														className={styles.listManage}
														height={`medium`}
														onChange={(event) => this.changeUser(event, 'admin')}
														onEnterKey={this.handleEnterKey}/>
										</div>
								</div>
								<hr/>
								<div>
										<div className={styles.row}>
												<Icon pathName={'plus'} className={styles.iconAdmin} fillColor={'green'}/>
												<Link to={`/userAdd/frontDesk`} className={styles.menuHeader}><L p={p} t={`Add Front Desk User`}/></Link>
										</div>
										<div>
												<SelectSingleDropDown
														id={`frontDeskPersonId`}
														name={`frontDeskPersonId`}
														label={<L p={p} t={`Front desk users`}/>}
														value={frontDeskPersonId}
														options={frontDesks}
														className={styles.listManage}
														height={`medium`}
														onChange={(event) => this.changeUser(event, 'frontDesk')}
														onEnterKey={this.handleEnterKey}/>
										</div>
								</div>
								<hr/>
								<div>
										<div className={styles.row}>
												<Icon pathName={'plus'} className={styles.iconAdmin} fillColor={'green'}/>
												<Link to={`/userAdd/counselor`} className={styles.menuHeader}><L p={p} t={`Add a Counselor`}/></Link>
										</div>
										<div>
												<SelectSingleDropDown
														id={`counselorPersonId`}
														name={`counselorPersonId`}
														label={<L p={p} t={`Counselors`}/>}
														value={counselorPersonId}
														options={counselors}
														className={styles.listManage}
														height={`medium`}
														onChange={(event) => this.changeUser(event, 'counselor')}
														onEnterKey={this.handleEnterKey}/>
										</div>
								</div>
								<hr/>
								<div className={styles.row}>
										<div className={styles.menuHeader}><L p={p} t={`Company Documents`}/></div>
										<div className={styles.moveTop}>
												<a onClick={this.handleFileUploadOpen} className={classes(styles.muchLeft, globalStyles.link)}><L p={p} t={`add file`}/></a> |
												<a onClick={this.handleWebsiteLinkOpen} className={classes(styles.littleLeft, globalStyles.link)}><L p={p} t={`add link`}/></a>
										</div>
								</div>
								{companyConfig.companyDocuments && companyConfig.companyDocuments.length > 0 && companyConfig.companyDocuments.map((f, i) => (
										<div key={i} className={styles.row}>
												<div className={styles.linkDisplay}>
														<a onClick={() => this.handleRemoveCompanyDocOpen(f.companyDocumentId)} className={styles.remove}>
																<L p={p} t={`remove`}/>
														</a>
														<a href={f.websiteLink ? f.websiteLink.indexOf('http') === -1 ? 'http://' + f.websiteLink : f.websiteLink : f.fileUrl}
																className={classes(globalStyles.link, styles.moreSpace)} target="_blank">
																{f.title}
														</a>
												</div>
										</div>
								))}
								{(!companyConfig.companyDocuments || companyConfig.companyDocuments.length === 0) &&
										<div className={styles.noDocs}><L p={p} t={`No documents found`}/></div>
								}
								<hr/>
								<div className={styles.menuHeader}><L p={p} t={`School Logo (Letterhead)`}/></div>
								<div className={styles.muchLeft} ref={(ref) => (this.logoFile = ref)}>
  										<InputFile label={<L p={p} t={`Upload a school logo`}/>} onChange={this.handleInputFile_logo}/>
										<img src={''} alt={'Logo'} ref={(ref) => (this.imageViewer = ref)} />
										{selectedFile_logo && !isLogoFileSaved && <ButtonWithIcon icon={'checkmark_circle'} onClick={this.handleFileUploadSubmit} label={<L p={p} t={`Save`}/>}/>}
										{companyConfig.logoFileUploadId &&
												<ImageDisplay linkText={''} url={companyConfig.logoFileUrl} isOwner={true}
														deleteFunction={() => this.handleRemoveFileUploadOpen(companyConfig.logoFileUploadId)}/>
										}
								</div>
								<hr/>
								<div className={styles.menuHeader}><L p={p} t={`Principal Signature (Grade reports)`}/></div>
								<div className={styles.muchLeft} ref={(ref) => (this.signatureFile = ref)}>
										<InputFile label={<L p={p} t={`Upload a principal signature`}/>} onChange={this.handleInputFile_signature}/>
										<img src={''} alt={<L p={p} t={`Signature`}/>} ref={(ref) => (this.signatureViewer = ref)} />
										{selectedFile_signature && !isSignatureFileSaved && <ButtonWithIcon icon={'checkmark_circle'} onClick={this.handleFileUploadSubmit_signature} label={<L p={p} t={`Save`}/>}/>}
										{companyConfig.signatureFileUploadId &&
												<ImageDisplay linkText={''} url={companyConfig.signatureFileUrl} isOwner={true}
														deleteFunction={() => this.handleRemoveFileUploadOpen_signature(companyConfig.signatureFileUploadId)}/>
										}
								</div>
								<hr/>
								<div className={styles.menuHeader}><L p={p} t={`Official Seal (Grade reports)`}/></div>
								<div className={styles.muchLeft} ref={(ref) => (this.officialSealFile = ref)}>
										<InputFile label={<L p={p} t={`Upload an official seal`}/>} onChange={this.handleInputFile_officialSeal}/>
										<img src={''} alt={<L p={p} t={`Official Seal`}/>} ref={(ref) => (this.officialSealViewer = ref)} />
										{selectedFile_officialSeal && !isOfficialSealFileSaved && <ButtonWithIcon icon={'checkmark_circle'} onClick={this.handleFileUploadSubmit_officialSeal} label={<L p={p} t={`Save`}/>}/>}
										{companyConfig.officialSealFileUploadId &&
												<ImageDisplay linkText={''} url={companyConfig.officialSealUrl} isOwner={true}
														deleteFunction={() => this.handleRemoveFileUploadOpen_officialSeal(companyConfig.officialSealFileUploadId)}/>
										}
								</div>
								<hr/>
								<div onClick={this.handleRemoveDemoRecordsOpen} className={styles.menuHeader}>
										<L p={p} t={`Remove demo records (students, courses, and assignments)`}/>
								</div>
								{isShowingModal_remove &&
		                <MessageModal handleClose={this.handleRemoveDemoRecordsClose} heading={<L p={p} t={`Remove the demo students, teacher, courses and assignments?`}/>}
		                   explainJSX={<L p={p} t={`If you chose to create a school with the demo records, you can delete them here.  The records you created yourself will be preserved. Are you sure you want to remove the demo students, teacher, courses and assignments, if any?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveDemoRecords} />
		            }
								{isShowingFileUpload_company &&
		                <FileUploadModal handleClose={this.handleFileUploadClose} title={<L p={p} t={`Company Document`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={true}
		                    personId={personId} submitFileUpload={this.handleSubmitFile} sendInBuildUrl={this.fileUploadBuildUrl}
		                    handleRecordRecall={this.recallAfterFileUpload}
		                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
		                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
		            }
								{isShowingWebsiteLink_company &&
		                <TextareaModal key={'all'} handleClose={this.handleWebsiteLinkClose} heading={<L p={p} t={`Website Link`}/>}
											 explainJSX={<L p={p} t={`Choose a website link for this company.`}/>} onClick={this.handleWebsiteLinkSave} placeholder={<L p={p} t={`Website URL?`}/>}
											 showTitle={true}/>
		            }
								{isShowingModal_removeCompanyDoc &&
		                <MessageModal handleClose={this.handleRemoveCompanyDoc} heading={<L p={p} t={`Remove this company document?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to delete this company document?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveCompanyDoc} />
		            }
								{isShowingModal_removeLogo &&
		                <MessageModal handleClose={this.handleRemoveFileUploadOpen} heading={<L p={p} t={`Remove this School Logo?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to delete this school logo?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveFileUpload} />
		            }
								{isShowingModal_removeSignature &&
		                <MessageModal handleClose={this.handleRemoveFileUploadOpen_signature} heading={<L p={p} t={`Remove this Principal's Signature?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to delete this principal's signature?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveFileUpload_signature} />
		            }
								{isShowingModal_removeOfficialSeal &&
		                <MessageModal handleClose={this.handleRemoveFileUploadOpen_officialSeal} heading={<L p={p} t={`Remove this Official Seal?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to delete this official seal?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveFileUpload_officialSeal} />
		            }
                {isShowingModal_gradRequirements &&
		                <MessageModal handleClose={this.handleFileUploadSubmit_gradRequirementsClose} heading={<L p={p} t={`Is the file closed?`}/>}
		                   explainJSX={<L p={p} t={`The file cannot be processed if the file is open.  Is the file closed now?  If not you can close it before clicking 'Yes' on this message.`}/>} isConfirmType={true}
		                   onClick={this.handleFileUploadSubmit_gradRequirements} />
		            }
                {isShowingModal_coursesAndSections &&
		                <MessageModal handleClose={this.handleFileUploadSubmit_coursesAndSectionsClose} heading={<L p={p} t={`Is the file closed?`}/>}
		                   explainJSX={<L p={p} t={`The file cannot be processed if the file is open.  Is the file closed now?  If not you can close it before clicking 'Yes' on this message.`}/>} isConfirmType={true}
		                   onClick={this.handleFileUploadSubmit_coursesAndSections} />
		            }
                {isShowingModal_studentTranscripts &&
		                <MessageModal handleClose={this.handleFileUploadSubmit_studentTranscriptsClose} heading={<L p={p} t={`Is the file closed?`}/>}
		                   explainJSX={<L p={p} t={`The file cannot be processed if the file is open.  Is the file closed now?  If not you can close it before clicking 'Yes' on this message.`}/>} isConfirmType={true}
		                   onClick={this.handleFileUploadSubmit_studentTranscripts} />
		            }

						</div>
		    )
		}
};
