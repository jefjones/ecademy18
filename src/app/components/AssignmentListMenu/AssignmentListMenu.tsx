import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import * as globalStyles from '../../utils/globalStyles.css'
import psPlus from '../../assets/ps_plus.png'
import styles from './AssignmentListMenu.css'
import classes from 'classnames'
import Icon from '../Icon'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'
import FileUploadModal from '../../components/FileUploadModal'
import TextareaModal from '../../components/TextareaModal'
import PenspringFileModal from '../../components/PenspringFileModal'
import MessageModal from '../../components/MessageModal'
const p = 'component'
import L from '../../components/PageLanguage'

function AssignmentListMenu(props) {
  const [isShowingPenspringFile_assignment, setIsShowingPenspringFile_assignment] = useState(true)
  const [sendAssignment, setSendAssignment] = useState(assignment)
  const [assignment, setAssignment] = useState({})
  const [isShowingFileUpload_assignment, setIsShowingFileUpload_assignment] = useState(true)
  const [isShowingWebsiteLink_assignment, setIsShowingWebsiteLink_assignment] = useState(true)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(true)

  const {personId, className="", assignment={}, languageList, createWorkAndPenspringTransfer, companyConfig, accessRoles, course,
  								assignmentsInit, sendInBuildUrl, handleRecordRecall} = props
  				
  				let hasRecordChosen = !assignment || !assignment.courseEntryId ? false : true
  
          return (
              <div className={classes(styles.container, className)}>
  								<a onClick={!hasRecordChosen ? chooseAssignment : () => navigate('/assignmentEntry/' + assignment.courseEntryId + '/' + assignment.assignmentId)}
  												data-rh={'Edit assignment'}>
  										<Icon pathName={'pencil0'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseAssignment : () => navigate('/assignmentEntry/' + assignment.courseEntryId + '/' + guidEmpty + '/' + assignment.sequence)}
  												data-rh={'Add another assignment before the chosen assignment'}>
  										<Icon pathName={'plus'} fillColor={'green'} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseAssignment : () => handlePenspringFileOpen_assignment(assignment)} data-rh={'Create a Penspring file'}>
  										<img src={psPlus} alt="PS" className={classes(styles.moreLeft, styles.penspringIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseAssignment : () => handleFileUploadOpen_assignment(assignment.assignmentId)} data-rh={'Upload a file'}>
  										<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'}
  												className={classes(styles.imageLessleft, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}
  												superScriptClass={classes(styles.addedIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseAssignment : () => handleWebsiteLinkOpen_assignment(assignment.assignmentId)} data-rh={'Add a website link'}>
  										<Icon pathName={'link2'} premium={true} superscript={'plus'} supFillColor={'green'}
  												className={classes(styles.imageLessleft, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}
  												superScriptClass={classes(styles.addedIconLessLeft, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasRecordChosen ? chooseAssignment : handleDeleteOpen} data-rh={'Delete this assignment'}>
  										<Icon pathName={'trash2'} premium={true} fillColor={hasRecordChosen ? 'maroon' : ''}
  												className={classes(styles.imageLessleft, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
  								</a>
  
  								{isShowingPenspringFile_assignment &&
  		                <PenspringFileModal key={'all'} handleClose={handlePenspringFileClose_assignment} onClick={handlePenspringFileClose_assignment}
  											 languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer} personId={personId} companyConfig={companyConfig}
  											 accessRoles={accessRoles} course={course} assignment={assignment}
  											 recallInitRecords={() => {assignmentsInit(personId, assignment.courseEntryId); handlePenspringFileClose_assignment();}}/>
  		            }
  								{isShowingFileUpload_assignment &&
  		                <FileUploadModal handleClose={handleFileUploadClose_assignment} title={<L p={p} t={`Assigment Attachment`}/>} label={<L p={p} t={`File for`}/>} showTitleEntry={true}
  		                    personId={personId} submitFileUpload={handleSubmitFile_assignment} sendInBuildUrl={sendInBuildUrl}
  		                    handleRecordRecall={handleRecordRecall}
  		                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
  		                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
  		            }
  								{isShowingWebsiteLink_assignment &&
  		                <TextareaModal key={'all'} handleClose={handleWebsiteLinkClose_assignment} heading={<L p={p} t={`Website Link`}/>} showTitle={true}
  												explainJSX={<L p={p} t={`Choose a website link for an assignment.`}/>} onClick={handleWebsiteLinkSave_assignment} placeholder={<L p={p} t={`Website URL?`}/>}/>
  		            }
  								{isShowingModal_delete &&
  		                <MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this assignment?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to remove this assignment? Access to any homeowrk and grades turned in for this homework will be lost.`}/>} isConfirmType={true}
  		                   onClick={handleDelete} />
  		            }
              </div>
          )
}

export default withAlert(AssignmentListMenu)
