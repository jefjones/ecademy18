import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import * as styles from './DocumentResponseModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import TextDisplay from '../TextDisplay'
import RadioGroup from '../RadioGroup'
import InputText from '../InputText'
import ButtonWithIcon from '../ButtonWithIcon'
import Loading from '../Loading'
import Required from '../Required'
import DateMoment from '../DateMoment'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import DropZone from 'react-dropzone-component'
import {wait} from '../../utils/wait'
import Iframe from 'react-iframe'
import ReactToPrint from "react-to-print"
const p = 'component'
import L from '../../components/PageLanguage'

function DocumentResponseModal(props) {
  const [file, setFile] = useState({})
  const [data, setData] = useState({})
  const [assignment, setAssignment] = useState({})
  const [newTextResponse, setNewTextResponse] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFileChosen, setIsFileChosen] = useState(false)
  const [errorContentType, setErrorContentType] = useState('')
  const [errorResponseType, setErrorResponseType] = useState(false)
  const [errorTextResponse, setErrorTextResponse] = useState(false)
  const [errorWebsiteLink, setErrorWebsiteLink] = useState(false)
  const [errorFileUpload, setErrorFileUpload] = useState(false)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [fileList, setFileList] = useState([<L p={p} t={`First file`}/>, <L p={p} t={`Second file`}/>, <L p={p} t={`Third file`}/>, <L p={p} t={`Fourth file`}/>, <L p={p} t={`Firth file`}/>, <L p={p} t={`Sixth file`}/>, <L p={p} t={`Seventh file`}/>, <L p={p} t={`Eighth file`}/>, <L p={p} t={`Ninth file`}/>])
  const [responseVisitedTypeCode, setResponseVisitedTypeCode] = useState(props.clickedUrl && props.clickedUrl.responseVisitedTypeCode)
  const [setVisitedAlready, setSetVisitedAlready] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [studentAssignmentResponseId, setStudentAssignmentResponseId] = useState(undefined)

  useEffect(() => {
    
    			const {setResponseVisitedType, studentAssignmentsInit, courseScheduledId, personId, responseData, clickedUrl, accessRoles, student} = props
    			if (!data || !data.assignmentId)
    					setData(responseData); setFileTypeDisplay(fileTypeDisplay())
    			if ((accessRoles.admin || accessRoles.facilitator) && clickedUrl && !clickedUrl.responseVisitedTypeCode) {
    					setResponseVisitedType(personId, clickedUrl.studentAssignmentResponseId, 'VISITED')
    					//studentAssignmentsInit(personId, student.studentPersonId, courseScheduledId);
    			}
      
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {setResponseVisitedType, personId, clickedUrl, accessRoles} = props
    			if (!setVisitedAlready && (accessRoles.admin || accessRoles.facilitator) && clickedUrl && !clickedUrl.responseVisitedTypeCode) {
    					setResponseVisitedType(personId, clickedUrl.studentAssignmentResponseId, 'VISITED')
    					setSetVisitedAlready(true)
    			}
    	
  }, [])

  const handleResponseVisitedType = (value) => {
    
    			const {setResponseVisitedType, personId, clickedUrl} = props
    			setResponseVisitedType(personId, clickedUrl.studentAssignmentResponseId, value)
    			setResponseVisitedTypeCode(value)
    	
  }

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
    
          const {courseScheduledId, student, assignmentId} = props
          
    			let isTeacherResponse = true
    			return `${apiHost}ebi/studentAssignment/fileUpload/` + student.personId + `/` + courseScheduledId + `/` + data.responseTypeName + `/ /` + assignmentId + `/` + isTeacherResponse; //The blank parameter is the score that should not be filled since this is a teacher response.
      
  }

  const changeResponse = ({target}) => {
    
          const data = Object.assign({}, data)
    			const field = target.name
          data[field] = target.value
    			if (field === 'responseTypeName') setErrorTextResponse(false)
    			if (field === 'newWebsiteLink') setErrorWebsiteLink(false)
          setData(data)
      
  }

  const handleWebsiteLink = ({target}) => {
    
          const data = Object.assign({}, data)
          data.newWebsiteLink = target.value
          setData(data); setErrorWebsiteLink('')
      
  }

  const handleCommentEntry = ({target}) => {
    
          let data = Object.assign({}, data)
          data.newTextResponse = target.value
          setData(data); setErrorTextResponse('')
    	
  }

  const handleResponseType = (value) => {
    
          let data = Object.assign({}, data)
          data['responseTypeName'] = value
          setData(data); setErrorResponseType(''); setErrorTextResponse(''); setErrorWebsiteLink(''); setErrorFileUpload('')
      
  }

  const processForm = () => {
    
          const {handleSubmit, handleClose, assignmentId, student}  = props
          let data = Object.assign({}, data)
          let hasError = false
    			//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.
    
    			//This isn't required any longer if it is the teacher since there is the option to mark an entry as 'visited'.
    			// if (!data.responseTypeName) {
          //     hasError = true;
          //     setErrorResponseType('A response type is required');
          // }
          if (data.responseTypeName === 'STUDENTRESPONSE' && !data.newTextResponse) {
              hasError = true
              setErrorTextResponse(<L p={p} t={`A comment response is required`}/>)
          }
    			if (data.responseTypeName === 'WEBSITELINK' && !data.newWebsiteLink) {
              hasError = true
              setErrorWebsiteLink(<L p={p} t={`A website link is required`}/>)
          }
          if (!hasError) {
              handleSubmit({...data, isTeacherResponse: true, personId: student.personId}, assignmentId)
    					setData({})
              handleClose()
          }
      
  }

  const handleRemoveOpen = (studentAssignmentResponseId, deleteFile='') => {
    return setIsShowingModal_remove(true); setStudentAssignmentResponseId(studentAssignmentResponseId); setDeleteFile(deleteFile)

  }
  const handleRemoveClose = () => {
    return setIsShowingModal_remove(false)

  }
  const handleRemove = (personId, studentAssignmentResponseId, deleteFile) => {
    
  }

  const setEditTextResponse = () => {
    
  }

  const fileTypeDisplay = () => {
    
    			const {clickedUrl} = props
    			let fileName = clickedUrl && clickedUrl.label && clickedUrl.label.toLowerCase()
    			if (clickedUrl.isTextResponse) {
    					return 'Plain text'
    			} else if (fileName) {
    					if (fileName.indexOf('.doc') > -1) {
    							return <L p={p} t={`Microsoft Word document`}/>
    					} else if (fileName.indexOf('.pdf') > -1) {
    							return <L p={p} t={`Adobe PDF file`}/>
    					} else if (fileName.indexOf('.odt') > -1) {
    							return <L p={p} t={`Open Office document`}/>
    					} else if (fileName.indexOf('.jpg') > -1 || fileName.indexOf('.jpeg') > -1 || fileName.indexOf('.tif') > -1 || fileName.indexOf('.gif') > -1 || fileName.indexOf('.png') > -1 || fileName.indexOf('.bmp') > -1) {
    							return <L p={p} t={`Image file`}/>
    					} else if (fileName.indexOf('docs.google') > -1) {
    							return <L p={p} t={`Google Docs (If you see a blank view area, you probably have not been given access to view the file.)`}/>
    					}
    			}
    			return 'Unknown'
    	
  }

  const {clickedUrl, student, handleClose, className, course, accessRoles, companyConfig, fileUploads, websiteLinks, textResponses} = props
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
                <ModalContainer onClose={handleClose} >
                    <ModalDialog onClose={handleClose} style={{ width: '95%', position: 'relative', top: '20'}}>
  											<div ref={el => (componentRef = el)} className={styles.componentPrint}>
  		                      <div className={styles.center}>
  		                          <div className={styles.heading}>Assignment Response</div>
  															<div className={classes(styles.moreTop, styles.rowWrap)}>
  																	<TextDisplay label={`Assignment`} text={data.assignmentTitle || data.title || (assignment && assignment.title)} />
  																	<TextDisplay label={`Course`} text={course && (course.label || course.courseName)} />
  																	<TextDisplay label={`Student`} text={student && (student.firstName + ' ' + (student.lastName || ''))} />
  																	<TextDisplay label={`Entry Date`} text={<DateMoment date={clickedUrl.entryDate} format={'D MMM  h:mm a'} minusHours={6}/>} />
  		                          </div>
  		                      </div>
  													{fileTypeDisplay && fileTypeDisplay !== 'Unknown' && <div className={styles.text}>File Type:  {fileTypeDisplay}</div>}
  													<div className={styles.horizontalScroll}>
  															{clickedUrl && !clickedUrl.isTextResponse && clickedUrl.label &&
  																	<Iframe url={clickedUrl.label && (clickedUrl.label.indexOf('.doc') > -1 || clickedUrl.label.indexOf('.odt') > -1)
  																					? `https://view.officeapps.live.com/op/view.aspx?src=${clickedUrl.label}`
  																					: clickedUrl.label}
  																			width="100%"
  																			height="450px"
  																			display="initial"
  																			position="relative"
  																			allowFullScreen/>
  															}
  															{clickedUrl && clickedUrl.isTextResponse &&
  																	<div>
  																			<div className={styles.edit}>{clickedUrl.instructions || clickedUrl.label}</div>
  																			<ReactToPrint trigger={() => <a href="#" className={classes(styles.printLink)}>
  																					<Icon pathName={'printer'} premium={true} className={styles.icon}/>
  																					<L p={p} t={`Print`}/></a>} content={() => componentRef}
  																			/>
  																	</div>
  															}
  													</div>
  											</div>
  											{(accessRoles.facilitator || accessRoles.admin) && (!clickedUrl || !clickedUrl.isTeacherResponse) &&
  		                      <ul className={styles.unorderedList}>
  		                          <li>
  																	<RadioGroup
  																			title={<L p={p} t={`How do you want to respond to this homework?`}/>}
  																			name={'responseTypeCode'}
  																			data={[
  																					{ label: <L p={p} t={`I want to type plain text.`}/>, id: "STUDENTRESPONSE" },
  																					{ label: <L p={p} t={`I want to attach a file.`}/>, id: "FILEATTACH" },
  																					{ label: <L p={p} t={`I want to enter in a Google Docs link`}/>, id: "WEBSITELINK" },
  																			]}
  																			horizontal={false}
  																			className={styles.moreTop}
  																			initialValue={data.responseTypeName}
  																			onClick={handleResponseType}/>
  																	<div className={styles.error}>{errorResponseType}</div>
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
  															{data.responseTypeName === 'WEBSITELINK' &&
  																	<li>
  				                             <InputText
  				                                 id={`newWebsiteLink`}
  				                                 name={`newWebsiteLink`}
  				                                 size={"medium-long"}
  				                                 label={<L p={p} t={`Google Docs link`}/>}
  				                                 value={data.newWebsiteLink || ''}
  				                                 onChange={handleWebsiteLink}
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
  						                              <span className={classes(styles.inputText, styles.moveDown)}><L p={p} t={`Comments`}/></span><br/>
  																					<Required setIf={data.responseTypeName === 'STUDENTRESPONSE'} setWhen={(data.textResponses && data.textResponses.label) || data.newTextResponse} className={styles.required}/>
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
  													</ul>
  											}
  											<ul className={styles.unorderedList}>
  													<li>
  															<div className={styles.rowWrap}>
  																	{fileUploads && fileUploads.length > 0 &&
  																			<div className={styles.moreRight}>
  																					{fileUploads.map((f, i) => {
  																							if (((accessRoles.admin || accessRoles.facilitator) && f.isTeacherResponse) || (!(accessRoles.admin || accessRoles.facilitator) && !f.isTeacherResponse)) {
  																									return (
  																											<div key={i}>
  																													<div className={styles.label}><L p={p} t={`File Attachment`}/></div>
  																													<div className={classes(styles.row, styles.muchBottom)}>
  																															<a onClick={() => handleRemoveOpen(f.id, 'DELETEFILE')} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
  																															<a href={f.label} target={'_blank'} className={styles.link}>{f.label}</a>
  																													</div>
  																											</div>
  																									)
  																							}
  																							return null
  																					})}
  																			</div>
  																	}
  																	{websiteLinks && websiteLinks.length > 0 &&
  																			<div>
  																					{websiteLinks.map((w, ind) => {
  																							if (((accessRoles.admin || accessRoles.facilitator) && w.isTeacherResponse) || (!(accessRoles.admin || accessRoles.facilitator) && !w.isTeacherResponse)) {
  																									return (
  																											<div key={ind}>
  																													<br/>
  																													<div className={styles.label}><L p={p} t={`Google Docs Link`}/></div>
  																													<div className={classes(styles.row, styles.moreBottom)}>
  																															<a onClick={() => handleRemoveOpen(w.id)} className={classes(styles.someTop, styles.moreRight, styles.remove)}><L p={p} t={`remove`}/></a>
  																															<a href={w.label && w.label.indexOf('http') === -1 ? 'http://' + w.label : w.label} target={'_blank'} className={styles.link}>{w.label}</a>
  																													</div>
  																											</div>
  																									)
  																							}
  																							return null
  																					})}
  																			</div>
  																	}
  															</div>
  															{textResponses && textResponses.length > 0 &&
  																	<div className={styles.moreTop}>
  																			{textResponses.map((t, i) => {
  																					if (((accessRoles.admin || accessRoles.facilitator) && t.isTeacherResponse) || (!(accessRoles.admin || accessRoles.facilitator) && !t.isTeacherResponse)) {
  																							return (
  																									<div key={i}>
  																											<div className={styles.label}><L p={p} t={`Text Response`}/></div>
  																											<div className={styles.someLeft}>
  																													<a onClick={() => handleRemoveOpen(t.id)} className={styles.remove}><L p={p} t={`remove`}/></a>
  																													<a onClick={setEditTextResponse} className={classes(styles.moreLeft, styles.link)}><L p={p} t={`edit`}/></a>
  																													<div className={styles.text}>{t.label}</div>
  																											</div>
  																									</div>
  																							)
  																					}
  																					return null
  																			})}
  																	</div>
  															}
  													</li>
  													{(accessRoles.admin || accessRoles.facilitator) && clickedUrl && !clickedUrl.isTeacherResponse &&
  															<li>
  																	<hr/>
  																	<RadioGroup
  																			title={<L p={p} t={`Teacher visited response:`}/>}
  																			name={'responseVisitedTypeCode'}
  																			data={[
  																					{ label: <L p={p} t={`Show as visited`}/>, id: "VISITED" },
  																					{ label: <L p={p} t={`Hide this student response`}/>, id: "HIDE" },
  																					{ label: <L p={p} t={`Delete this student response`}/>, id: "DELETED" },
  																					{ label: <L p={p} t={`Attention:  I need to come back to this`}/>, id: "ATTENTION" },
  																					{ label: <L p={p} t={`Mark as not visited`}/>, id: "UNREAD" },
  																			]}
  																			horizontal={false}
  																			className={styles.moreTop}
  																			initialValue={responseVisitedTypeCode || 'VISITED'}
  																			onClick={handleResponseVisitedType} />
  															</li>
  													}
  											</ul>
  											{(accessRoles.facilitator || accessRoles.admin) && (!clickedUrl || !clickedUrl.isTeacherResponse) &&
  											     <div>
  																<hr />
  		                            <div className={classes(styles.dialogButtons, styles.row, styles.moreLeft)}>
  		                                <a className={styles.cancelLink} onClick={handleClose}>Close</a>
  																		{isSubmitted &&
  																				<Loading isLoading={true} loadingText={<L p={p} t={`Please wait`}/>} />
  																		}
  																		{!isSubmitted &&
  																				<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={data.responseTypeName === 'FILEATTACH' ? handleFileUpload : processForm}/>
  																		}
  		                            </div>
  														</div>
  											}
  											{!((accessRoles.facilitator || accessRoles.admin) && (!clickedUrl || !clickedUrl.isTeacherResponse)) &&
  													<div className={classes(styles.dialogButtons, styles.row, styles.moreLeft)}>
  															<hr />
  															<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={handleClose}/>
  													</div>
  											}
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
export default DocumentResponseModal
