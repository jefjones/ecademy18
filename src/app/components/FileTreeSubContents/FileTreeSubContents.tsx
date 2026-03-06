import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './FileTreeSubContents.css'
import classes from 'classnames'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import DateMoment from '../DateMoment'
import InputText from '../InputText'
import {guidEmpty} from '../../utils/GuidValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function FileTreeSubContents(props) {
  const [scores, setScores] = useState([])
  const [isScoreInit, setIsScoreInit] = useState(false)
  const [isShowingPenspringHomework, setIsShowingPenspringHomework] = useState(false)
  const [workId, setWorkId] = useState(undefined)
  const [isShowingPenspringDistribute, setIsShowingPenspringDistribute] = useState(undefined)

  const sendToReview = (workId, chapterId, languageId) => {
    
    				const {personId, setWorkCurrentSelected, getAuthorWorkspace} = props
    				setWorkCurrentSelected(personId, workId, chapterId, languageId, `/editReview/${workId}`)
    				getAuthorWorkspace(personId, workId, chapterId)
    		
  }

  const handlePenspringHomeworkOpen = (workId) => {
    return setWorkId(workId); setIsShowingPenspringHomework(true)

  }
  const handlePenspringHomeworkClose = () => {
    return setWorkId(''); setIsShowingPenspringHomework(false)

  }
  const handlePenspringHomework = () => {
    
    				const {personId, setPenspringHomeworkSubmitted, getMyWorks, getWorksSharedWithMe} = props
    				
    				setPenspringHomeworkSubmitted(personId, workId)
    				handlePenspringHomeworkClose()
    				getMyWorks(personId)
    				getWorksSharedWithMe(personId)
    		
  }

  const handlePenspringDistributeOpen = (workId) => {
    return setWorkId(workId); setIsShowingPenspringDistribute(true)

  }
  const handlePenspringDistributeClose = () => {
    return setWorkId(''); setIsShowingPenspringDistribute(false)

  }
  const handlePenspringDistribute = () => {
    
    				const {personId, setPenspringDistributeSubmitted} = props
    				
    				setPenspringDistributeSubmitted(personId, workId)
    				handlePenspringDistributeClose()
    		
  }

  const onBlurScore = (studentAssignmentResponseId, event) => {
    
    				const {setGradebookScoreByPenspring, personId } = props
    				setGradebookScoreByPenspring(personId, studentAssignmentResponseId, event.target.value)
    		
  }

  const handleScore = (studentAssignmentResponseId, event) => {
    
  }

  const {fileTreeExplorer, isParentExpanded=true, toggleExpanded, personId, setWorkCurrentSelected, workSummaries, deleteWork, mineOrOthers,
  								getAuthorWorkspace, setPenspringHomeworkSubmitted, getMyWorks, getWorksSharedWithMe, fetchingRecord, resolveFetchingRecordFileTreeExplorer,
  								setGradebookScoreByPenspring, chooseRecord, chosenWork, setPenspringDistributeSubmitted } = props
  				
  
  		    return !isParentExpanded ? null : (
  		        <div className={styles.indent}>
  								{fileTreeExplorer && fileTreeExplorer.folders && fileTreeExplorer.folders.length > 0 && fileTreeExplorer.folders.map((m, i) =>
  										<div key={i} className={classes(styles.subFolder, styles.addIndent)}>
  												<div className={styles.row} onClick={() => toggleExpanded(m.workFolderId)}>
  														<Icon pathName={m.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  														<Icon pathName={m.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  														<div className={styles.label}>{m.folderName.length > 75 ? m.folderName.substring(0,75) + '...' : m.folderName}</div>
  												</div>
  												<FileTreeSubContents fileTreeExplorer={m.subContents} isParentExpanded={m.isExpanded}
  														toggleExpanded={toggleExpanded} setWorkCurrentSelected={setWorkCurrentSelected} personId={personId} mineOrOthers={mineOrOthers}
  														workSummaries={workSummaries} getAuthorWorkspace={getAuthorWorkspace} deleteWork={deleteWork} setPenspringHomeworkSubmitted={setPenspringHomeworkSubmitted}
  														getMyWorks={getMyWorks} getWorksSharedWithMe={getWorksSharedWithMe} fetchingRecord={fetchingRecord}
  														resolveFetchingRecordFileTreeExplorer={resolveFetchingRecordFileTreeExplorer} setGradebookScoreByPenspring={setGradebookScoreByPenspring}
  														chosenWork={chosenWork} chooseRecord={chooseRecord} setPenspringDistributeSubmitted={setPenspringDistributeSubmitted}/>
  										</div>
  								)}
  								<table className={styles.document}>
  									<tbody>
  											{fileTreeExplorer && fileTreeExplorer.files && fileTreeExplorer.files.length > 0 && fileTreeExplorer.files.map((m, i) => {
  												let workName = !!m.distributedWorkId && m.distributedWorkId !== guidEmpty && mineOrOthers === 'Others'
  														? fileTreeExplorer.studentNameFirst === 'FIRSTNAME'
  																? m.firstName + ' ' + m.lastName
  																:m.lastName + ', ' + m.firstName
  														: m.workName.length > 75
  																? m.workName.substring(0,75) + '...'
  																: m.workName
  
  												return (
  													<tr key={i}>
  														<td onClick={() => sendToReview(m.workId, m.chapterId, m.languageId)} className={styles.cellStyle}>
  																{(mineOrOthers === 'Mine' || (m.studentAssignmentResponseId && m.penspringSubmittedDate) || !m.studentAssignmentResponseId || m.studentAssignmentResponseId === guidEmpty) &&
  																		<Icon pathName={'register'} premium={true} className={styles.iconTree} cursor={'pointer'} />
  																}
  														</td>
  														<td onClick={() => chooseRecord(m)} className={classes(styles.cellStyle, chosenWork.workId === m.workId ? styles.chosenWork : '')}
  																	data-rh={workName.length > 75 ? workName : null}>
  																{workName}
  														</td>
  														<td data-rh={m.isDistributableAssignment ? 'Assignment published date' : 'Homework submitted date'} className={styles.cellStyle}>
  																{m.isPenspringHomework && m.isPenspringSubmitted && m.penspringSubmittedDate
  																		? <div onClick={() => chooseRecord(m.workId)}>
  																					<DateMoment date={m.penspringSubmittedDate} format={'D MMM  h:mm a'} minusHours={0} className={styles.date}/>
  																			</div>
  																		: mineOrOthers === 'Mine'
  																				? m.isDistributableAssignment
  																						? m.publishedDate
  																								? <DateMoment date={m.publishedDate} format={'D MMM  h:mm a'} className={styles.date}/>
  																								: <Link to={`/editReview/${m.workId}`} className={styles.linkBold}><L p={p} t={`Publish Assignment`}/></Link>
  																						: m.penspringSubmittedDate
  																								? <DateMoment date={m.penspringSubmittedDate} format={'D MMM  h:mm a'} className={styles.date}/>
  																								: m.isPenspringHomework || (m.studentAssignmentResponseId && m.studentAssignmentResponseId !== guidEmpty)
  																										? <a className={styles.linkBold} onClick={() => handlePenspringHomeworkOpen(m.workId)}><L p={p} t={`Submit Homework`}/></a>
  																										: ''
  																				: m.penspringSubmittedDate
  																						? <DateMoment date={m.penspringSubmittedDate} format={'D MMM  h:mm a'} className={styles.date}/>
  																						: ''
  																}
  														</td>
  														<td className={styles.cellStyle} data-rh={'Possible points'} onClick={() => chooseRecord(m.workId)}>
  																{m.studentAssignmentResponseId && m.studentAssignmentResponseId !== guidEmpty && m.totalPoints}
  														</td>
  														<td data-rh={'Homework score'} className={classes(styles.liftBox, styles.cellStyle)}>
  																{!m.studentAssignmentResponseId || m.studentAssignmentResponseId === guidEmpty
  																		? ''
  																		: m.isPenspringSubmitted && (m.canEditScore || m.accessRoleName === 'Facilitator' || m.gradingType === 'STUDENT')
  																				? <div className={styles.inputBox}>
  																						<InputText id={i} tabIndex={i} size={"super-short"}
  																								value={scores[m.studentAssignmentResponseId]
  																												? scores[m.studentAssignmentResponseId] === 'Empty'
  																														? ''
  																														: scores[m.studentAssignmentResponseId]
  																												: m.score === 0 && m.isPenspringSubmitted
  																														? 0
  																														: !!m.score
  																																? m.score
  																																: ''
  																								}
  																								numberOnly={true}
  																								onChange={(event) => handleScore(m.studentAssignmentResponseId, event)}
  																								onBlur={(event) => onBlurScore(m.studentAssignmentResponseId, event)} />
  																					</div>
  																				: <div className={styles.score}>
  																							{m.score === 0 && m.isPenspringSubmitted
  																											? 0
  																											: !(m.score === 0 || Number(m.score) > 0)
  																													? m.score
  																													: ''
  																							}
  																					</div>
  																}
  														</td>
  														<td className={styles.cellStyle} data-rh={'Word count'} onClick={() => chooseRecord(m.workId)}>
  																{m.wordCount}
  														</td>
  														<td className={styles.cellStyle} data-rh={'Sentence count'} onClick={() => chooseRecord(m.workId)}>
  																{m.sentenceCount}
  														</td>
  														<td className={styles.cellStyle} data-rh={'Edits pending'} onClick={() => chooseRecord(m.workId)}>
  																{m.editsPending}
  														</td>
  														<td className={styles.cellStyle} data-rh={'Edits processed'} onClick={() => chooseRecord(m.workId)}>
  																{m.editsProcessed}
  														</td>
  											</tr>
  										)}
  									)}
  									</tbody>
  								</table>
  								{isShowingPenspringHomework &&
  		                <MessageModal handleClose={handlePenspringHomeworkClose} heading={<L p={p} t={`Submit this homework?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to submit this homework.  The teacher will be able to see your penspring file with your assignment in eCademyApp.`}/>} isConfirmType={true}
  		                   onClick={handlePenspringHomework} />
  		            }
  								{isShowingPenspringDistribute &&
  		                <MessageModal handleClose={handlePenspringDistributeOpen} heading={<L p={p} t={`Distribute this homework?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to distribute this homework?  The assignment will be copied to each student as if they were the oroginal authors.  You will become an editor to each assignment.  You will be able to see the penspring file in the eCademyApp gradebook when the student completes and submits their work.`}/>}
  											 isConfirmType={true} onClick={handlePenspringDistribute} />
  		            }
  		        </div>
  		    )
}
export default FileTreeSubContents
