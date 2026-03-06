import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import styles from './AssignmentResponseModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import TextDisplay from '../TextDisplay'
import RadioGroup from '../RadioGroup'
import InputText from '../InputText'
import Required from '../Required'
import Loading from '../Loading'
import MessageModal from '../MessageModal'
import ButtonWithIcon from '../ButtonWithIcon'
import DropZone from 'react-dropzone-component'
import {wait} from '../../utils/wait'
//import penspringSmall from '../../assets/Penspring_small.png';
import PenspringWorkAddView from '../../views/PenspringWorkAddView'
const p = 'component'
import L from '../../components/PageLanguage'

//Error:  The date is not being able to be modified.  But we cut it out of the view anyway (showMoreInfo=false) for our purposes here.

function AssignmentResponseModal(props) {
  const [file, setFile] = useState({})
  const [assignment, setAssignment] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFileChosen, setIsFileChosen] = useState(false)
  const [newTextResponse, setNewTextResponse] = useState('')
  const [errorContentType, setErrorContentType] = useState('')
  const [errorResponseType, setErrorResponseType] = useState(false)
  const [errorTextResponse, setErrorTextResponse] = useState(false)
  const [errorWebsiteLink, setErrorWebsiteLink] = useState(false)
  const [errorFileUpload, setErrorFileUpload] = useState(false)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [fileList, setFileList] = useState(['First file', 'Second file', 'Third file', 'Fourth file', 'Firth file', 'Sixth file', 'Seventh file', 'Eighth file', 'Ninth file'])
  const [data, setData] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [studentAssignmentResponseId, setStudentAssignmentResponseId] = useState(undefined)

  useEffect(() => {
    
    			const {assignmentId, assignmentsInfo, clearPenspringTransfer, personId} = props
    			if (!data || !data.assignmentId) setData(data)
    			clearPenspringTransfer(personId)
      
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {assignmentId, assignmentsInfo, penspringTransfer, clearPenspringTransfer, personId, handleClose} = props
    			if (!data || !data.assignmentId) setData(data)
    			if (penspringTransfer) {
    					setData({})
    					clearPenspringTransfer(personId)
    					handleClose()
    			}
    	
  }, [])

  const handleFileUpload = () => {
    
          
          let hasError = false
    			//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.
    
          if (!isFileChosen) {
              hasError = true
              setErrorFileUpload('A file is required')
          }
    
          if (!hasError) {
    					setIsSubmitted(true)
    		      dropzone.processQueue()
          }
      
  }

  const buildURL = () => {
    
          const {personId, courseScheduledId} = props
          
    			return `${apiHost}ebi/studentAssignment/fileUpload/` + personId + `/` + courseScheduledId + `/` + data.responseTypeName + `/` + (data.score || ` `) + `/` + data.assignmentId
      
  }

  const changeResponse = ({target}) => {
    
          const data = Object.assign({}, data)
    			const field = target.name
          data[field] = target.value
    			if (field === 'responseTypeName') setErrorTextResponse(false)
    			if (field === 'newWebsiteLink') setErrorWebsiteLink(false)
          setData(data)
      
  }

  const handleCommentEntry = ({target}) => {
    
    	
  }

  const handleResponseType = (value) => {
    
          let data = Object.assign({}, data)
          data['responseTypeName'] = value
          setData(data); setErrorResponseType(false); setErrorTextResponse(false); setErrorWebsiteLink(false); setErrorFileUpload(false)
      
  }

  const processForm = () => {
    
          const {handleSubmit, handleClose, assignmentId}  = props
          
          let hasError = false
    			//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.
    
    			if (!data.responseTypeName) {
              hasError = true
              setErrorResponseType(<L p={p} t={`A response type is required`}/>)
          }
          if (data.responseTypeName === 'STUDENTRESPONSE' && !data.newTextResponse) {
              hasError = true
              setErrorTextResponse(<L p={p} t={`A comment response is required`}/>)
          }
    			if (data.responseTypeName === 'WEBSITELINK' && !data.newWebsiteLink) {
              hasError = true
              setErrorWebsiteLink(<L p={p} t={`A website link is required`}/>)
          }
    
          if (!hasError) {
              handleSubmit(data, assignmentId)
              handleClose()
          }
      
  }

  const handleRemoveOpen = (studentAssignmentResponseId, deleteFile='') => {
    return setIsShowingModal_remove(true); setStudentAssignmentResponseId(studentAssignmentResponseId); setDeleteFile(deleteFile)

  }
  const handleRemoveClose = () => {
    return setIsShowingModal_remove(false)

  }
  const handleRemove = (emove(personId, studentAssignmentResponseId, deleteFile) => {
    
  }

  const setEditTextResponse = () => {
    
  }

  const {personId, studentPersonId, languageList, handleClose, className, assignmentId, course, companyConfig={}, accessRoles,
  							createWorkAndPenspringTransfer, recallInitRecords } = props
        const config = componentConfig
        const djsConfig = djsConfig
        const eventHandlers = {
            init: dz => dropzone = dz,
            addedfile: handleFileAdded.bind(this),
            success: () => {wait(5000); props.recallInitRecords()},
        }
  
  			let incomingTextResponse = (data.textResponses && data.textResponses.length > 0 && data.textResponses.filter(m => m.isTeacherResponse === (accessRoles.facilitator || accessRoles.admin))[0]) || {}
  
        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.center}>
                            <div className={styles.heading}>Assignment Response</div>
  													<TextDisplay label={`Assignment`} text={data.title} />
  													<div className={classes(styles.moreTop, styles.row)}>
  															<TextDisplay label={<L p={p} t={`Course`}/>} text={course && course.courseName} />
  															<TextDisplay label={<L p={p} t={`Teacher`}/>} text={course && course.facilitatorName} />
                                <TextDisplay label={<L p={p} t={`Class Period`}/>} text={course && course.classPeriodName} />
                            </div>
                        </div>
                        <ul className={styles.unorderedList}>
                            <li>
  															<div className={styles.row}>
  																	<RadioGroup
  																			title={<L p={p} t={`How do you want to send your homework?`}/>}
  																			name={'responseTypeCode'}
  																			data={[
  																					//{ label: <div><L p={p} t={`I want a <img className={styles.penspringLogo} src={penspringSmall} alt="penspring"/>editable file`}/></div>, id: "PENSPRING" },
  																					{ label: <L p={p} t={`I want to type my answers in plain text.`}/>, id: "STUDENTRESPONSE" },
  																					{ label: <L p={p} t={`I want to attach a file.`}/>, id: "FILEATTACH" },
  																					{ label: <L p={p} t={`I want to enter in a Google Docs link`}/>, id: "WEBSITELINK" },
  																			]}
  																			horizontal={false}
  																			className={styles.moreTop}
  																			initialValue={data.responseTypeName}
  																			onClick={handleResponseType}/>
  																	<div className={styles.error}>{errorResponseType}</div>
  													    </div>
  													</li>
  													{data.canEditScore &&
  															<li>
  		                             <InputText
  		                                 id={`score`}
  		                                 name={`score`}
  		                                 size={"super-short"}
  		                                 label={<L p={p} t={`Score (possible: ${data.totalPoints})`}/>}
  		                                 value={data.score || ''}
  		                                 onChange={changeResponse}
  																		 numberOnly={true}
  																		 />
  																		 {/*maxNumber={Number(data.totalPoints) + Number(data.extraCredit)}*/}
  		                          </li>
  													}
  													{data.responseTypeName === 'PENSPRING' &&
  															<li>
                                  	<PenspringWorkAddView languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer} personId={personId}
  																			accessRoles={accessRoles} studentPersonId={studentPersonId} course={course} assignmentId={assignmentId}
  																			recallInitRecords={recallInitRecords} showMoreInfo={false} companyConfig={companyConfig}/>
  		                          </li>
  													}
  													{data.responseTypeName === 'WEBSITELINK' &&
  															<li>
  		                             <InputText
  		                                 id={`newWebsiteLink`}
  		                                 name={`newWebsiteLink`}
  		                                 size={"medium-long"}
  		                                 label={<L p={p} t={`Google Docs link`}/>}
  		                                 value={data.newWebsiteLink || ''}
  		                                 onChange={changeResponse}
  																		 required={true}
  																		 whenFilled={data.newWebsiteLink}
  																		 error={errorWebsiteLink}/>
  		                          </li>
  													}
                            {data.responseTypeName === 'FILEATTACH' &&
  															<li>
  		                                <div className={styles.explanation}>
  		                                    <L p={p} t={`Click on the box below to browse for a file,`}/> <br/>
  		                                    <L p={p} t={`or drag-and-drop a file into the box:`}/>
  		                                </div>
  		                                <DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}>
  																				<L p={p} t={`Click here to upload or`}/>
  																		</DropZone>
  																		<div className={styles.error}>{errorFileUpload}</div>
  																		<div className={styles.instructions}>{'Available file types: .jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .pages, .ppt, .pptx, .pptm'}</div>
  		                          </li>
  													}
                            {data.responseTypeName === 'STUDENTRESPONSE' &&
  															<li>
  																	<div className={styles.row}>
  				                              <span className={classes(styles.inputText, styles.moveDown)}>{<L p={p} t={`Comments`}/>}</span><br/>
  																			<Required setIf={data.responseTypeName === 'STUDENTRESPONSE'} setWhen={data.newTextResponse || (incomingTextResponse && incomingTextResponse.label)} className={styles.required}/>
  																	</div>
  																	<div className={styles.column}>
  				                              <textarea rows={5} cols={45}
  				                                      id={`newTextResponse`}
  				                                      name={`newTextResponse`}
  																							value={data.newTextResponse || (incomingTextResponse && incomingTextResponse.label) || ''}
  				                                      onChange={handleCommentEntry}
  				                                      className={styles.commentTextarea}>
  				                              </textarea>
  																			<div className={styles.error}>{errorTextResponse}</div>
  																	</div>
  		                          </li>
  													}
  													<li>
  															<div className={styles.rowWrap}>
  																	{data.studentFileUploadUrls && data.studentFileUploadUrls.length > 0 &&
  																			<div>
  																					<div className={styles.label}><L p={p} t={`File Attachment`}/></div>
  																					{data.studentFileUploadUrls.map((f, i) =>
  																							<div key={i} className={styles.row}>
  																									<a key={i} href={f.label} target={'_blank'} className={styles.link}>{fileList[i]}</a>
  																									<a onClick={() => handleRemoveOpen(f.id, 'DELETEFILE')} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
  																							</div>
  																					)}
  																			</div>
  																	}
  																	{data.studentWebsiteLinks && data.studentWebsiteLinks.length > 0 &&
  																			<div className={styles.someLeft}>
  																					<div className={styles.label}><L p={p} t={`Website Link`}/></div>
  																					{data.studentWebsiteLinks.map((w, i) =>
  																							<div key={i} className={styles.row}>
  																									<a key={i} href={w.label && w.label.indexOf('http') === -1 ? 'http://' + w.label : w.label} target={'_blank'} className={styles.link}>{w.label}</a>
  																									<a onClick={() => handleRemoveOpen(w.id)} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
  																							</div>
  																					)}
  																			</div>
  																	}
  															</div>
  															{data.studentTextResponse && data.studentTextResponse.label &&
  																	<div className={styles.moreTop}>
  																			<div className={styles.label}><L p={p} t={`Text Response`}/></div>
  																			<div className={styles.someLeft}>
  																					<a onClick={() => handleRemoveOpen(data.studentTextResponse.id)} className={styles.remove}><L p={p} t={`remove`}/></a>
  																					<a onClick={setEditTextResponse} className={classes(styles.moreLeft, styles.link)}><L p={p} t={`edit`}/></a>
  																					<div className={styles.text}>{data.studentTextResponse.label}</div>
  																			</div>
  																	</div>
  															}
  													</li>
  													{data.responseTypeName !== 'PENSPRING' &&
  		                          <li>
  																	<hr />
  		                              <div className={classes(styles.dialogButtons, styles.row, styles.moreLeft)}>
  		                                  <a className={styles.cancelLink} onClick={() => handleClose(isFileChosen)}>Close</a>
  																			{isSubmitted &&
  																					<Loading isLoading={true} loadingText={<L p={p} t={`Please wait`}/>} />
  																			}
  																			{!isSubmitted &&
  									                    		<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={data.responseTypeName === 'FILEATTACH' ? handleFileUpload : processForm}/>
  																			}
  		                              </div>
  		                          </li>
  													}
                        </ul>
                    </ModalDialog>
                </ModalContainer>
  							{isShowingModal_remove &&
  	                <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this response entry?`}/>}
  	                   explainJSX={<L p={p} t={`Are you sure you want to delete this response entry?`}/>} isConfirmType={true}
  	                   onClick={handleRemove} />
  	            }
            </div>
        )
}
export default AssignmentResponseModal
