import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import { Link, useNavigate } from 'react-router-dom'
import * as styles from './NewSchoolCheckListView.css'
const p = 'NewSchoolCheckListView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import OneFJefFooter from '../../components/OneFJefFooter'
import Button from '../../components/Button'
import Icon from '../../components/Icon'
import FileUploadModal from '../../components/FileUploadModal'
import SchoolSetup from '../../components/SchoolSetup'
import StudentListTable from '../../components/StudentListTable'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

function NewSchoolCheckListView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [expanded, setExpanded] = useState('')
  const [hasChangedExpanded, setHasChangedExpanded] = useState(false)
  const [countsTimerId, setCountsTimerId] = useState(setInterval(() => getCountsMainMenu(personId), 10000))

  useEffect(() => {
    
    				const {personId, getCountsMainMenu} = props
    				getCountsMainMenu && setCountsTimerId(setInterval(() => getCountsMainMenu(personId), 10000)); setPersonId(personId)
        
    return () => {
      
              countsTimerId && clearInterval(countsTimerId)
          
    }
  }, [])

  const {personId, companyConfig={}, counts, schoolYears, setCompanyConfig, showLogout, students, gradeLevels, setStudentsSelected,
  								getStudentSchedule, studentAssignmentsInit, studentSchedule, resetUserPersonClipboard, showForceFirstNav} = props
  				
  
  		    return (
  		        <div className={styles.container}>
  		            <div className={globalStyles.pageTitle}>
  		              <L p={p} t={`New School Setup Check List`}/>
  		            </div>
  								<div className={styles.privacyPosition}>
  										<Link to={`/privacy-policy`} className={styles.forgotPassword}><L p={p} t={`Privacy Policy`}/></Link>
  								</div>
  								{showForceFirstNav &&
  										<Link to={'/forceFirstNav'} className={classes(styles.link, styles.linkAlone, styles.row)}>
  												<Icon pathName={'clipboard_check'} premium={true}/>
  												<span className={styles.menuHeaderGreen}><L p={p} t={`Go to full admin main menu`}/></span>
  										</Link>
  								}
  								<div className={classes(styles.row, styles.space)}>
  										<Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={classes(styles.moreLeft, styles.icon)}/>
  										<div className={styles.countHeader}></div>
  										<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  										<div className={styles.stepCount}>1</div>
  										<div className={styles.stepName}><L p={p} t={`Create new school`}/></div>
  								</div>
  								<Accordion expanded={expanded === 'panel1'} onChange={handleExpansionChange('panel1')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  												<div className={classes(styles.row, styles.space)}>
  														{counts.learners || counts.uploadedStudentFile
  																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
  														}
  														<div className={styles.countHeader}>{counts.learners}</div>
  														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  														<div className={styles.stepCount}>2</div>
  														<div className={styles.stepName}><L p={p} t={`Add your students`}/></div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={styles.subSection}>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>1</div>
  																<div className={styles.description}><L p={p} t={`Enter in students manually one-at-a-time`}/></div>
  																<div className={styles.buttonPosition}>
  																		<Button label={'Go >'} onClick={() => navigate('/studentAddManual')}/>
  																</div>
  														</div>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>2</div>
  																<div className={styles.description}><L p={p} t={`Parents or guardians will register their children`}/></div>
  														</div>
  														<a className={classes(styles.link, styles.muchLeft, styles.wordBreak)} href={`https://www.eCademy.app/regLogin/${companyConfig && companyConfig.companyId && companyConfig.companyId.substring(0,6)}`} target={'_blank'}>
  																{`https://www.eCademy.app/regLogin/${companyConfig && companyConfig.companyId && companyConfig.companyId.substring(0,6)}`}
  														</a>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>3</div>
  																<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
  														</div>
  														<div className={classes(styles.description, styles.muchLeft)}>
  																<L p={p} t={`Upload a list or spreadsheet of student and parent information and we will get all of the information in the right places for you`}/>
  																<Button label={<L p={p} t={`Go >`}/>} onClick={handleFileUploadOpen}/>
  														</div>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>4</div>
  																<div className={styles.description}>
  																		<L p={p} t={`Upload a comma-delimited file (.csv).  Specify the order of the data. (This is limited only to comma-delimited files.)`}/>
  																</div>
  														</div>
  														<div className={classes(styles.description, styles.muchMoreLeft)}>
  																<Button label={<L p={p} t={`Go >`}/>} onClick={() => navigate('/studentAddBulk')}/>
  														</div>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel2'} onChange={handleExpansionChange('panel2')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  												<div className={classes(styles.row, styles.space)}>
  														{companyConfig.hasOpenedSettings
  																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
  														}
  														<div className={styles.countHeader}></div>
  														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  														<div className={styles.stepCount}>3</div>
  														<div className={styles.stepName}><L p={p} t={`School settings`}/></div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={styles.columns}>
  														<div className={styles.instructions}><L p={p} t={`By just clicking on one of these links, we will mark that this step is complete since you at least looked around to see if you wanted to change a setting.`}/></div>
  														<SchoolSetup personId={personId} companyConfig={companyConfig} schoolYears={schoolYears} setCompanyConfig={setCompanyConfig} />
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel3'} onChange={handleExpansionChange('panel3')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  												<div className={classes(styles.row, styles.space)}>
  														{counts.facilitators || counts.uploadedTeacherFile
  																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
  														}
  														<div className={styles.countHeader}>{counts.facilitators}</div>
  														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  														<div className={styles.stepCount}>4</div>
  														<div className={styles.stepName}><L p={p} t={`Add teachers`}/></div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={styles.subSection}>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>1</div>
  																<div className={styles.description}><L p={p} t={`Enter in teachers manually one-at-a-time`}/></div>
  																<div className={styles.buttonPosition}>
  																		<Button label={<L p={p} t={`Go >`}/>} onClick={() => navigate('/userAdd/facilitator')}/>
  																</div>
  														</div>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>2</div>
  																<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
  														</div>
  														<div className={classes(styles.description, styles.muchLeft)}>
  																<L p={p} t={`Upload a list or spreadsheet of teacher information and we will get all of the information in the right places for you`}/>
  																<Button label={<L p={p} t={`Go >`}/>} onClick={handleFileUploadOpen}/>
  														</div>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel4'} onChange={handleExpansionChange('panel4')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  												<div className={classes(styles.row, styles.space)}>
  														{counts.learningOpportunities || counts.uploadedCourseFile
  																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
  														}
  														<div className={styles.countHeader}>{counts.learningOpportunities}</div>
  														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  														<div className={styles.stepCount}>5</div>
  														<div className={styles.stepName}><L p={p} t={`Add courses`}/></div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={styles.subSection}>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>1</div>
  																<div className={styles.description}><L p={p} t={`Enter in courses manually one-at-a-time`}/></div>
  																<div className={styles.buttonPosition}>
  																		<Button label={<L p={p} t={`Go >`}/>} onClick={() => navigate('/courseEntry')}/>
  																</div>
  														</div>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.optionLabel}><L p={p} t={`Option`}/></div>
  																<div className={styles.optionCount}>2</div>
  																<div className={styles.description}><L p={p} t={`Let us take care of it for you`}/></div>
  														</div>
  														<div className={classes(styles.description, styles.muchLeft)}>
  																<L p={p} t={`Upload a list or spreadsheet of course information and we will get all of the information in the right places for you. Be sure to include semester, teacher and class period details.`}/>
  																<Button label={<L p={p} t={`Go >`}/>} onClick={handleFileUploadOpen}/>
  														</div>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel6'} onChange={handleExpansionChange('panel6')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  												<div className={classes(styles.row, styles.space)}>
  														{counts.learnerCourseAssigns
  																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
  														}
  														<div className={styles.countHeader}>{counts.learnerCourseAssigns}</div>
  														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  														<div className={styles.stepCount}>6</div>
  														<div className={styles.stepName}><L p={p} t={`Assign students to courses`}/></div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={styles.subSection}>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.description}><L p={p} t={`Click on the clock icon to the left of the student's name to go to the course assignment page`}/></div>
  														</div>
  														<div className={styles.moreLeft}>
  																<StudentListTable students={students} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
  																		setStudentsSelected={setStudentsSelected} getStudentSchedule={getStudentSchedule}
  																		personId={personId} studentAssignmentsInit={studentAssignmentsInit} studentSchedule={studentSchedule}
  																		resetUserPersonClipboard={resetUserPersonClipboard}/>
  														</div>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								<Accordion expanded={expanded === 'panel7'} onChange={handleExpansionChange('panel7')}>
  										<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  												<div className={classes(styles.row, styles.space)}>
  														{counts.courseAssignments
  																? <Icon pathName={'checkmark0'} premium={true} fillColor={'green'} className={styles.icon}/>
  																: <Icon pathName={'clipboard_blank'} premium={true}  fillColor={'red'} className={styles.icon}/>
  														}
  														<div className={styles.countHeader}>{counts.courseAssignments}</div>
  														<div className={styles.stepLabel}><L p={p} t={`Step`}/></div>
  														<div className={styles.stepCount}>7</div>
  														<div className={styles.stepName}><L p={p} t={`Add an assignment to a course`}/></div>
  												</div>
  										</AccordionSummary>
  										<AccordionDetails>
  												<div className={styles.subSection}>
  														<div className={classes(styles.row, styles.space)}>
  																<div className={styles.description}>
  																		<L p={p} t={`I'm going to send you to the Base Course page.  When you get there, click on the assignment icon that looks like a checklist.`}/>
  																		<L p={p} t={`If you have more than one course entered already, click on one of the courses to enable the tool buttons.`}/>
  																</div>
  														</div>
  														<Button label={<L p={p} t={`Go >`}/>} onClick={() => navigate('/baseCourses')}/>
  												</div>
  										</AccordionDetails>
  								</Accordion>
  								{showLogout &&
  										<div className={styles.logoutPosition}>
  												<Link to={`/myProfile`} className={classes(styles.row, styles.menuItem)}>
  														<Icon pathName={'portrait'} premium={true} className={styles.iconBig}/>
  														<L p={p} t={`My Profile`}/>
  												</Link>
  												<Link to={`/logout`} className={classes(styles.row, styles.menuItem)}>
  														<Icon pathName={'stop_circle'} premium={true} className={styles.iconBig}/>
  														<L p={p} t={`Logout`}/>
  												</Link>
  										</div>
  								}
  								<div className={classes(styles.muchTop)}>
  										<OneFJefFooter />
  								</div>
  								{isShowingFileUpload &&
  		                <FileUploadModal handleClose={handleFileUploadClose} title={<L p={p} t={`Record Upload`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={false}
  		                    personId={personId} submitFileUpload={handleSubmitFile} sendInBuildUrl={fileUploadBuildUrl} handleRecordRecall={recallAfterFileUpload}
  		                    acceptedFiles={".xls, .xlsx, .csv, .tsv"} iconFiletypes={['.xls', '.xlsx', '.csv', '.tsv']}/>
  		            }
  		        </div>
  		    )
}

export default withAlert(NewSchoolCheckListView)
