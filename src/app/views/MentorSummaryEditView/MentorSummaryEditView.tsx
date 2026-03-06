import { useEffect, useState } from 'react'
import styles from './MentorSummaryEditView.css'
const p = 'MentorSummaryEditView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import TextDisplay from '../../components/TextDisplay'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import moment from 'moment'
import {doSort} from '../../utils/sort'

function MentorSummaryEditView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)
  const [pathwayComments, setPathwayComments] = useState([])
  const [studentPersonId, setStudentPersonId] = useState('')
  const [mentorCommentId, setMentorCommentId] = useState('')
  const [entries, setEntries] = useState([{
							mentorCommentId: '',
							learningPathWayId: '',
							learningPathWayName: '',
							comment: '',
					}])
  const [learningPathWayId, setLearningPathWayId] = useState('')
  const [learningPathWayName, setLearningPathWayName] = useState('')
  const [comment, setComment] = useState('')
  const [learningPathwayName, setLearningPathwayName] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				if (prevProps.entries !== props.entries && prevState.entries !== props.entries) {
    						setEntries(sortEntries(props.entries))
    				}
    		
  }, [])

  const sortEntries = (entries) => {
    
    				let sortByHeadings = {
    						sortField: 'learningPathWayName',
    						isAsc: true,
    						isNumber: false
    				}
    				return doSort(entries, sortByHeadings)
    		
  }

  const handleLearnerChange = (event) => {
    
    				const {getLearnerPathways, personId, getMentorComments} = props
            setStudentPersonId(event.target.value)
    				getLearnerPathways(personId, event.target.value)
    				getMentorComments(personId, event.target.value)
        
  }

  const handleRemove = () => {
    
    				const {removeMentorComment, personId } = props
    				
            removeMentorComment(personId, mentorCommentId)
            setMentorCommentId('')
        
  }

  const processForm = (stayOrFinish) => {
    
    				//This page saves the textarea entries every time the user leaves it.
    				//So, the save button here really just clears the controls.  If it is "finish" it will reroute back to dashboard.
            setIsShowingModal_remove(false); setIsShowingModal_message(false); setPathwayComments([]); setStudentPersonId(''); setMentorCommentId(''); set//This is just for removing an entry(//This is just for removing an entry); setBut keep in mind that each learningPathwayId has a mentorCommentId separate from each other.
    						entries([{
    								mentorCommentId: '',
    								learningPathWayId: '',
    								learningPathWayName: '',
    								comment: '',
    						}])
    				if (stayOrFinish === "FINISH") {
                navigate(`/firstNav`)
            }
        
  }

  const changeComment = (event, learningPathwayId) => {
    
    				let entries = [...entries]
    				entries = entries && entries.length > 0 && entries.map(m => {
    						if (m.learningPathwayId === learningPathwayId) {
    								m.comment = event.target.value
    								m.studentPersonId = studentPersonId
    						}
    						return m
    				})
    				setEntries(entries)
    		
  }

  const onBlurComment = (learningPathwayId) => {
    
    				const {addOrUpdateMentorComment, personId, getMentorComments} = props
    				
    				let entry = entries && entries.length > 0 && entries.filter(m => m.learningPathwayId === learningPathwayId)[0]
    				if (entry && entry.learningPathwayId) {
    						addOrUpdateMentorComment(personId, entry)
    						getMentorComments(personId, studentPersonId)
    				}
    		
  }

  const handleRemoveClose = () => {
    return setIsShowingModal_remove(false)
        handleRemoveOpen = (mentorCommentId) => setIsShowingModal_remove(true); setMentorCommentId(mentorCommentId)
        handleRemove = () => {
    				const {removeMentorComment, personId} = props
  }

  const handleRemoveOpen = (mentorCommentId) => {
    return setIsShowingModal_remove(true); setMentorCommentId(mentorCommentId)
        handleRemove = () => {
    				const {removeMentorComment, personId} = props
  }

  const handleMessageClose = () => {
    return setIsShowingModal_message(false)
    		handleMessageOpen = (mentorCommentId) => {
    				const {pathwayComments} = props
  }

  const handleMessageOpen = (mentorCommentId) => {
    
    				const {pathwayComments} = props
    				let entry = pathwayComments & pathwayComments.length > 0 && pathwayComments.filter(m => m.mentorCommentId === mentorCommentId)
    				let learningPathwayName = entry && entry.learningPathwayName
    				let commment = entry && entry.comment
    				setIsShowingModal_message(true); setMentorCommentId(mentorCommentId); setLearningPathwayName(learningPathwayName); setCommment(commment)
    		
  }

  const handleEditSet = (mentorCommentId) => {
    
    				//Get all of the comments made on the same day and fill them into the learning Pathways' edit controls.
    				//1. get the date from the record with the mentorCommentId.
    				//2. go through all of the records and set the edit controls by document.getElementById that match the learningPathwayId
    				//		 which match the same date.
    				//btw:  We will need to cut out the time of the date and take the date that equals by the string format itself
    				//3. Replace the entries records with each pathwayComments that matches for the learningPathwayId
    				const {pathwayComments} = props
    				let entries = [...entries]
    				let comment = pathwayComments && pathwayComments.filter(m => m.mentorCommentId === mentorCommentId)[0]
    				if (comment && comment.mentorCommentId) {
    						let theDate = moment(comment.entryDate).format('D MMM YYYY')
    						pathwayComments.forEach(m => {
    								if (m.entryDate && moment(m.entryDate).format('D MMM YYYY') === theDate) {
    										entries = entries.filter(e => e.learningPathwayId !== m.learningPathwayId)
    										entries = entries ? entries.concat(m) : [m]
    								}
    						})
    						entries = sortEntries(entries)
    						setEntries(entries)
    				}
    		
  }

  const {learners, pathwayComments} = props
        
  
        let headings = [{}, {}, {label: 'Date', tightText: true}, {label: 'Pathway', tightText: true}, {label: 'Read By', tightText: true}, {label: 'Comment', tightText: true}]
  			let data = pathwayComments && pathwayComments.length > 0
            ? pathwayComments.map((m, i) => {
                  return [
  										{ value: <a onClick={() => handleRemoveOpen(m.mentorCommentId)} className={styles.remove}>remove</a>},
                      { value: <a onClick={() => handleEditSet(m.mentorCommentId)} className={styles.editLink}>edit</a>},
  										{ id: m.personId, value: <a onClick={() => handleCommentViewOpen(m.mentorCommentId)} className={styles.link}>{moment(m.entryDate).format('D MMM YYYY')}</a>},
  										{ id: m.personId, value: <a onClick={() => handleCommentViewOpen(m.mentorCommentId)} className={classes(styles.link, styles.linkBold)}>{m.learningPathwayName}</a>},
  										{ id: m.personId, value: <a onClick={() => handleReadByOpen(m.mentorCommentId)} className={classes(styles.link, styles.linkBold)}>{m.readBy && m.readBy.length}</a>},
  										{ id: m.personId, value: <a onClick={() => handleCommentViewOpen(m.mentorCommentId)} className={styles.link}>{m.comment.length> 50 ? m.comment.substring(0,50) + '...' : m.comment}</a>},
                  ]})
            : [[{},{},{value: 'No comments found', colspan: true}]]
  
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                      {`Enter Mentor Comments`}
                  </div>
                  <div>
                      <SelectSingleDropDown
                          id={`studentPersonId`}
                          label={`Learner`}
                          value={studentPersonId}
                          options={learners}
                          className={styles.singleSelect}
                          height={`medium`}
                          onChange={handleLearnerChange}/>
                  </div>
  								<hr />
  								<TextDisplay label={'Entry Date'} text={entries && entries.length > 0 && entries[0].entryDate ? moment(entries[0].entryDate).format('D MMM YYYY') : moment(new Date()).format('D MMM YYYY')}/>
  								{studentPersonId && entries && entries.length > 0 && entries.map((m, i) =>
  										<div key={i} className={styles.textareaDiv}>
  												<span className={styles.inputText}>{m.learningPathwayName}</span><br/>
  												<textarea rows={5} cols={45}
  																id={m.mentorCommentId}
  																name={m.mentorCommentId}
  																value={m.comment || ''}
  																onChange={(event) => changeComment(event, m.learningPathwayId)}
  																onBlur={() => onBlurComment(m.learningPathwayId)}
  																className={styles.commentTextarea}>
  												</textarea>
  										</div>
  								)}
  								<hr />
                  {studentPersonId &&
  										<div className={classes(styles.rowCenter)}>
  												<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
  												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  		                </div>
  								}
  								<hr />
  								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
              </div>
              <OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this comment?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this comment?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_message &&
  								<MessageModal handleClose={handleMessageClose} heading={`Learning Coach Comment`}
  									 explain={learningPathwayName + ' - ' + comment} onClick={handleRemove} />
              }
          </div>
      )
}

export default MentorSummaryEditView
