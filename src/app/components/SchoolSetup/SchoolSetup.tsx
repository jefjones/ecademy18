import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import {apiHost} from '../../api_host'
import axios from 'axios'
import styles from './SchoolSetup.css'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../SelectSingleDropDown'
import Icon from '../Icon'
import RadioGroup from '../RadioGroup'
import MessageModal from '../MessageModal'
import InputFile from '../InputFile'
import ButtonWithIcon from '../ButtonWithIcon'
import ImageDisplay from '../ImageDisplay'
import FileUploadModal from '../FileUploadModal'
import TextareaModal from '../TextareaModal'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function SchoolSetup(props) {
  const [expanded, setExpanded] = useState(false)
  const [adminPersonId, setAdminPersonId] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingWebsiteLink_company, setIsShowingWebsiteLink_company] = useState(false)
  const [isShowingFileUpload_company, setIsShowingFileUpload_company] = useState(false)
  const [isShowingModal_removeCompanyDoc, setIsShowingModal_removeCompanyDoc] = useState(false)
  const [selectedFile_logo, setSelectedFile_logo] = useState(file)
  const [selectedFile_signature, setSelectedFile_signature] = useState(file)
  const [selectedFile_officialSeal, setSelectedFile_officialSeal] = useState(file)
  const [selectedFile_coursesAndSections, setSelectedFile_coursesAndSections] = useState(file)
  const [selectedFile_gradRequirements, setSelectedFile_gradRequirements] = useState(file)
  const [selectedFile_studentTranscripts, setSelectedFile_studentTranscripts] = useState(file)
  const [isLogoFileSaved, setIsLogoFileSaved] = useState(true)
  const [isSignatureFileSaved, setIsSignatureFileSaved] = useState(true)
  const [isOfficialSealFileSaved, setIsOfficialSealFileSaved] = useState(true)
  const [isShowingModal_coursesAndSections, setIsShowingModal_coursesAndSections] = useState(true)
  const [isFileSaved_coursesAndSections, setIsFileSaved_coursesAndSections] = useState(true)
  const [isShowingModal_gradRequirements, setIsShowingModal_gradRequirements] = useState(true)
  const [isFileSaved_gradRequirements, setIsFileSaved_gradRequirements] = useState(true)
  const [isShowingModal_studentTranscripts, setIsShowingModal_studentTranscripts] = useState(true)
  const [isFileSaved_studentTranscripts, setIsFileSaved_studentTranscripts] = useState(true)
  const [isShowingModal_removeLogo, setIsShowingModal_removeLogo] = useState(true)
  const [isShowingModal_removeSignature, setIsShowingModal_removeSignature] = useState(true)
  const [isShowingModal_removeOfficialSeal, setIsShowingModal_removeOfficialSeal] = useState(true)
  const [coursesAndSectionsSchoolYearId, setCoursesAndSectionsSchoolYearId] = useState(event.target.value)

  const {personId, className, companyConfig={}, schoolYears, intervals, setCompanyConfig, admins, frontDesks, counselors} = props
  				
  
  				let features = companyConfig && companyConfig.features ? companyConfig.features : {}
  
  		    return (
  						<div className={className}>
  								{companyConfig.urlcode === 'Liahona' &&
  										<div onClick={() => {navigate(`/scheduleAssignByMath`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Setup schedule by math`}/></div>
  								}
  								{features.behaviorIncidents && <div onClick={() => {navigate(`/behaviorIncidentTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Behavior incident types`}/></div>}
  								{features.carpool && <div onClick={() => {navigate(`/carpoolAreas`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Carpool areas`}/></div>}
                  {features.courses &&
                      <div>
                          <hr/>
                              <div className={classes(styles.moreLeft, styles.label)}><L p={p} t={`Courses and Graduation Requirements`}/></div>
                              <div onClick={() => {navigate(`/classPeriods`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Class periods`}/></div>
              								<div onClick={() => {navigate(`/courseTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Course types`}/></div>
                              <div className={classes(styles.muchLeft, styles.label, styles.moreTop)}><L p={p} t={`COURSES`}/></div>
                              <a href={`https://penspringblob.blob.core.windows.net/blob-container/CoursesAndSections.csv?se=2020-02-23T02%3A28%3A04Z&sp=rwl&sv=2018-03-28&sr=c&sig=eUFXcFb%2BoWVcZr4%2FU3LLJEUwJeVSRAlCytEc4oqBtCo%3D`} className={classes(styles.muchMuchLeft, styles.menuHeader)}>
                                  <L p={p} t={`Download course/section CSV template`}/>
                              </a>
                              <div className={classes(styles.muchMuchLeft, styles.row)}>
                                  <InputFile label={<L p={p} t={`Upload courses comma-delimited file (csv)`}/>} onChange={handleInputFile_coursesAndSections}/>
              										{selectedFile_coursesAndSections && !isFileSaved_coursesAndSections &&
                                      <div className={styles.row}>
                                          <div className={styles.moreLeft}>
                                              <SelectSingleDropDown
                                                  label={<L p={p} t={`School year`}/>}
                                                  id={coursesAndSectionsSchoolYearId}
                                                  value={coursesAndSectionsSchoolYearId || ''}
                                                  options={schoolYears}
                                                  height={`medium`}
                                                  onChange={handleCoursesAndSectionsSchoolYear}/>
                                          </div>
                                          <ButtonWithIcon icon={'checkmark_circle'} onClick={handleFileUploadSubmit_coursesAndSectionsOpen} label={<L p={p} t={`Save`}/>}/>
                                      </div>
                                  }
                              </div>
  
                              <div onClick={() => {navigate(`/baseCourses`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`See base course list`}/></div>
                              <div onClick={() => {navigate(`/scheduledCourses`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`See sections scheduled list`}/></div>
  
                              <div className={classes(styles.muchLeft, styles.label, styles.moreTop)}><L p={p} t={`GRADUATION REQUIREMENTS`}/></div>
                              <a href={`https://penspringblob.blob.core.windows.net/blob-container/GraduationRequirements.csv?se=2020-02-23T02%3A29%3A29Z&sp=rwl&sv=2018-03-28&sr=c&sig=0XUkYw%2BVIOArq5ye1bZNmwp6vHJA1EJnteycmTETqKE%3D`} className={classes(styles.muchMuchLeft, styles.menuHeader)}>
                                  <L p={p} t={`Download graduation requirements CSV template`}/>
                              </a>
                              <div className={classes(styles.muchMuchLeft, styles.row)}>
                                  <InputFile label={<L p={p} t={`Upload graduation requirements comma-delimited file (csv)`}/>} onChange={handleInputFile_gradRequirements}/>
              										{selectedFile_gradRequirements && !isFileSaved_gradRequirements &&
                                      <ButtonWithIcon icon={'checkmark_circle'} onClick={handleFileUploadSubmit_gradRequirementsOpen} label={<L p={p} t={`Save`}/>}/>
                                  }
                              </div>
                              <div onClick={() => {navigate(`/financeCreditTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`Graduation requirements list`}/></div>
  
                              <div className={classes(styles.muchLeft, styles.label, styles.moreTop)}><L p={p} t={`STUDENT TRANSCRIPTS`}/></div>
                              <a href={`https://penspringblob.blob.core.windows.net/blob-container/StudentTranscripts.csv?se=2020-02-23T02%3A30%3A18Z&sp=rwl&sv=2018-03-28&sr=c&sig=M29MLUmLwzHsdrkcwW%2BJdjveuEJdt9I8Wn7zanQisdA%3D`} className={classes(styles.muchMuchLeft, styles.menuHeader)}>
                                  <L p={p} t={`Download student transcripts CSV template`}/>
                              </a>
                              <div className={classes(styles.muchMuchLeft, styles.row)}>
                                  <InputFile label={<L p={p} t={`Upload student transcripts comma-delimited file (csv)`}/>} onChange={handleInputFile_studentTranscripts}/>
              										{selectedFile_studentTranscripts && !isFileSaved_studentTranscripts &&
                                      <ButtonWithIcon icon={'checkmark_circle'} onClick={handleFileUploadSubmit_studentTranscriptsOpen} label={<L p={p} t={`Save`}/>}/>
                                  }
                              </div>
                              <div onClick={() => {navigate(`/financeCreditTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchMuchLeft, styles.menuHeader)}><L p={p} t={`Student transcripts list`}/></div>
          								<hr/>
                      </div>
                  }
  								{features.courses && <div onClick={() => {navigate(`/contentTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Content types`}/></div>}
  								{features.courses && <div onClick={() => {navigate(`/learningPathways`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Disciplines (subjects)`}/></div>}
  								{features.billing &&
                      <div>
                          <hr/>
          										<div className={classes(styles.moreLeft, styles.label)}>Finance</div>
          										<div onClick={() => {navigate(`/financeCreditFeeAdd`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Course fees`}/></div>
          										<div onClick={() => {navigate(`/financeCreditTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Credit types`}/></div>
          										<div onClick={() => {navigate(`/financeFeeTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Fee types`}/></div>
          										<div onClick={() => {navigate(`/financeGLCodes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`General ledger codes`}/></div>
          										<div onClick={() => {navigate(`/financeGroups`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Groups`}/></div>
          										<div onClick={() => {navigate(`/financeLowIncomeWaivers`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Low income waiver(s)`}/></div>
          										<div onClick={() => {navigate(`/financeWaiverSchedule`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Waiver schedule`}/></div>
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
  										<div onClick={() => {navigate(`/standardsRating`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Standards-based settings`}/></div>
  								}
  								{companyConfig.gradingType === 'PASSFAIL' &&
  										<div onClick={() => {navigate(`/passFailRating`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={classes(styles.muchLeft, styles.menuHeader)}><L p={p} t={`Pass / Fail ratings`}/></div>
  								}
                  {features.courses && <div onClick={() => {navigate(`/gradeScale`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Grade scale`}/></div>}
  								{features.lockers && <div onClick={() => {navigate(`/lockerSettings`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Lockers`}/></div>}
                  {features.lockers && <div onClick={() => {navigate(`/paddleLockSettings`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Padlocks`}/></div>}
                  <div onClick={() => {navigate(`/passwordResetAdmin`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Password reset`}/></div>
  								{features.pickupLane && <div onClick={() => {navigate(`/pickupLaneSettings`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Pick-up lane (GPS locations)`}/></div>}
                  <div onClick={() => {navigate(`/schoolDays`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`School days`}/></div>
  								<div onClick={() => {navigate(`/intervals`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Semester or quarter intervals`}/></div>
  								{features.volunteerHours && <div onClick={() => {navigate(`/volunteerTypes`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Volunteer types`}/></div>}
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
  														onChange={(event) => changeUser(event, 'admin')}
  														onEnterKey={handleEnterKey}/>
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
  														onChange={(event) => changeUser(event, 'frontDesk')}
  														onEnterKey={handleEnterKey}/>
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
  														onChange={(event) => changeUser(event, 'counselor')}
  														onEnterKey={handleEnterKey}/>
  										</div>
  								</div>
  								<hr/>
  								<div className={styles.row}>
  										<div className={styles.menuHeader}><L p={p} t={`Company Documents`}/></div>
  										<div className={styles.moveTop}>
  												<a onClick={handleFileUploadOpen} className={classes(styles.muchLeft, globalStyles.link)}><L p={p} t={`add file`}/></a> |
  												<a onClick={handleWebsiteLinkOpen} className={classes(styles.littleLeft, globalStyles.link)}><L p={p} t={`add link`}/></a>
  										</div>
  								</div>
  								{companyConfig.companyDocuments && companyConfig.companyDocuments.length > 0 && companyConfig.companyDocuments.map((f, i) => (
  										<div key={i} className={styles.row}>
  												<div className={styles.linkDisplay}>
  														<a onClick={() => handleRemoveCompanyDocOpen(f.companyDocumentId)} className={styles.remove}>
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
  								<div className={styles.muchLeft} ref={(ref) => (logoFile = ref)}>
    										<InputFile label={<L p={p} t={`Upload a school logo`}/>} onChange={handleInputFile_logo}/>
  										<img src={''} alt={'Logo'} ref={(ref) => (imageViewer = ref)} />
  										{selectedFile_logo && !isLogoFileSaved && <ButtonWithIcon icon={'checkmark_circle'} onClick={handleFileUploadSubmit} label={<L p={p} t={`Save`}/>}/>}
  										{companyConfig.logoFileUploadId &&
  												<ImageDisplay linkText={''} url={companyConfig.logoFileUrl} isOwner={true}
  														deleteFunction={() => handleRemoveFileUploadOpen(companyConfig.logoFileUploadId)}/>
  										}
  								</div>
  								<hr/>
  								<div className={styles.menuHeader}><L p={p} t={`Principal Signature (Grade reports)`}/></div>
  								<div className={styles.muchLeft} ref={(ref) => (signatureFile = ref)}>
  										<InputFile label={<L p={p} t={`Upload a principal signature`}/>} onChange={handleInputFile_signature}/>
  										<img src={''} alt={<L p={p} t={`Signature`}/>} ref={(ref) => (signatureViewer = ref)} />
  										{selectedFile_signature && !isSignatureFileSaved && <ButtonWithIcon icon={'checkmark_circle'} onClick={handleFileUploadSubmit_signature} label={<L p={p} t={`Save`}/>}/>}
  										{companyConfig.signatureFileUploadId &&
  												<ImageDisplay linkText={''} url={companyConfig.signatureFileUrl} isOwner={true}
  														deleteFunction={() => handleRemoveFileUploadOpen_signature(companyConfig.signatureFileUploadId)}/>
  										}
  								</div>
  								<hr/>
  								<div className={styles.menuHeader}><L p={p} t={`Official Seal (Grade reports)`}/></div>
  								<div className={styles.muchLeft} ref={(ref) => (officialSealFile = ref)}>
  										<InputFile label={<L p={p} t={`Upload an official seal`}/>} onChange={handleInputFile_officialSeal}/>
  										<img src={''} alt={<L p={p} t={`Official Seal`}/>} ref={(ref) => (officialSealViewer = ref)} />
  										{selectedFile_officialSeal && !isOfficialSealFileSaved && <ButtonWithIcon icon={'checkmark_circle'} onClick={handleFileUploadSubmit_officialSeal} label={<L p={p} t={`Save`}/>}/>}
  										{companyConfig.officialSealFileUploadId &&
  												<ImageDisplay linkText={''} url={companyConfig.officialSealUrl} isOwner={true}
  														deleteFunction={() => handleRemoveFileUploadOpen_officialSeal(companyConfig.officialSealFileUploadId)}/>
  										}
  								</div>
  								<hr/>
  								<div onClick={handleRemoveDemoRecordsOpen} className={styles.menuHeader}>
  										<L p={p} t={`Remove demo records (students, courses, and assignments)`}/>
  								</div>
  								{isShowingModal_remove &&
  		                <MessageModal handleClose={handleRemoveDemoRecordsClose} heading={<L p={p} t={`Remove the demo students, teacher, courses and assignments?`}/>}
  		                   explainJSX={<L p={p} t={`If you chose to create a school with the demo records, you can delete them here.  The records you created yourself will be preserved. Are you sure you want to remove the demo students, teacher, courses and assignments, if any?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveDemoRecords} />
  		            }
  								{isShowingFileUpload_company &&
  		                <FileUploadModal handleClose={handleFileUploadClose} title={<L p={p} t={`Company Document`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={true}
  		                    personId={personId} submitFileUpload={handleSubmitFile} sendInBuildUrl={fileUploadBuildUrl}
  		                    handleRecordRecall={recallAfterFileUpload}
  		                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
  		                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
  		            }
  								{isShowingWebsiteLink_company &&
  		                <TextareaModal key={'all'} handleClose={handleWebsiteLinkClose} heading={<L p={p} t={`Website Link`}/>}
  											 explainJSX={<L p={p} t={`Choose a website link for this company.`}/>} onClick={handleWebsiteLinkSave} placeholder={<L p={p} t={`Website URL?`}/>}
  											 showTitle={true}/>
  		            }
  								{isShowingModal_removeCompanyDoc &&
  		                <MessageModal handleClose={handleRemoveCompanyDoc} heading={<L p={p} t={`Remove this company document?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to delete this company document?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveCompanyDoc} />
  		            }
  								{isShowingModal_removeLogo &&
  		                <MessageModal handleClose={handleRemoveFileUploadOpen} heading={<L p={p} t={`Remove this School Logo?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to delete this school logo?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveFileUpload} />
  		            }
  								{isShowingModal_removeSignature &&
  		                <MessageModal handleClose={handleRemoveFileUploadOpen_signature} heading={<L p={p} t={`Remove this Principal's Signature?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to delete this principal's signature?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveFileUpload_signature} />
  		            }
  								{isShowingModal_removeOfficialSeal &&
  		                <MessageModal handleClose={handleRemoveFileUploadOpen_officialSeal} heading={<L p={p} t={`Remove this Official Seal?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to delete this official seal?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveFileUpload_officialSeal} />
  		            }
                  {isShowingModal_gradRequirements &&
  		                <MessageModal handleClose={handleFileUploadSubmit_gradRequirementsClose} heading={<L p={p} t={`Is the file closed?`}/>}
  		                   explainJSX={<L p={p} t={`The file cannot be processed if the file is open.  Is the file closed now?  If not you can close it before clicking 'Yes' on this message.`}/>} isConfirmType={true}
  		                   onClick={handleFileUploadSubmit_gradRequirements} />
  		            }
                  {isShowingModal_coursesAndSections &&
  		                <MessageModal handleClose={handleFileUploadSubmit_coursesAndSectionsClose} heading={<L p={p} t={`Is the file closed?`}/>}
  		                   explainJSX={<L p={p} t={`The file cannot be processed if the file is open.  Is the file closed now?  If not you can close it before clicking 'Yes' on this message.`}/>} isConfirmType={true}
  		                   onClick={handleFileUploadSubmit_coursesAndSections} />
  		            }
                  {isShowingModal_studentTranscripts &&
  		                <MessageModal handleClose={handleFileUploadSubmit_studentTranscriptsClose} heading={<L p={p} t={`Is the file closed?`}/>}
  		                   explainJSX={<L p={p} t={`The file cannot be processed if the file is open.  Is the file closed now?  If not you can close it before clicking 'Yes' on this message.`}/>} isConfirmType={true}
  		                   onClick={handleFileUploadSubmit_studentTranscripts} />
  		            }
  
  						</div>
  		    )
}
export default SchoolSetup
