import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ContextCourseAction.css'
import MessageModal from '../MessageModal'
import TextareaModal from '../../components/TextareaModal'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function ContextCourseAction(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_deleteEdit, setIsShowingModal_deleteEdit] = useState(false)
  const [isShowingModal_duplicate, setIsShowingModal_duplicate] = useState(false)
  const [isShowingModal_hasSchedule, setIsShowingModal_hasSchedule] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener('click', props.hideContextCourseActionMenu)
        
    return () => {
      
              document.body.removeEventListener('click', props.hideContextCourseActionMenu)
          
    }
  }, [])

  const {className="", courseEntryId, courseScheduledId, courseName, actionType, showVertical } = props
          
  
          return (
              <div className={classes(styles.container, (showVertical ? '' : styles.row), className)}>
                  <div className={styles.multipleContainer}>
  										<div className={classes(styles.row, styles.moreRight)} data-rh={actionType === 'BASECOURSE' ? <L p={p} t={`Schedule this course`}/> : <L p={p} t={`Assign this course to a student`}/>}>
  												<a onClick={() => navigate(actionType === 'BASECOURSE' ? '/courseToSchedule/new/' + courseEntryId : '/learnerCourseAssign/set/course/' + courseScheduledId)}>
  														<Icon pathName={`calendar_31`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
  												</a>
  										</div>
                      <div className={classes(styles.row, styles.moreRight)} data-rh={'Gradebook'}>
                          <a onClick={() => navigate('/gradebookEntry/' + courseScheduledId)}>
                              <Icon pathName={`medal_empty`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
                      <div className={classes(styles.row, styles.moreRight)} data-rh={'Manage assignments'}>
                          <a onClick={() => navigate('/assignmentList/' + courseEntryId)}>
                              <Icon pathName={`list3`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
  										<div className={classes(styles.row, styles.moreRight)} data-rh={'Weighted Scores'}>
                          <a onClick={() => navigate('/courseWeightedScore/' + courseEntryId)}>
                              <Icon pathName={`scale`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
  										{/*<div className={classes(styles.row, styles.moreRight)} data-rh={'Duplicate this course to create another'}>
                          <a onClick={handleDuplicateOpen}>
                              <Icon pathName={`compare_docs`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>*/}
  										<div className={classes(styles.row, styles.moreRight)} data-rh={'View the class discussion'}>
                          <a onClick={() => navigate('/discussionClass/' + courseEntryId)}>
                              <Icon pathName={`chat_bubbles`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
  										<div className={classes(styles.row, styles.moreRight)} data-rh={'Edit the course setup'}>
                          <a onClick={sendToCourseEdit}>
                              <Icon pathName={`pencil0`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
                      <div className={classes(styles.row, styles.moreRight)} data-rh={`Delete this course`}>
                          <a onClick={validateDelete}>
  														<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
                  </div>
  								{isShowingModal_hasSchedule &&
                      <MessageModal handleClose={handleHasScheduledCourseClose} heading={<L p={p} t={`This base course has scheduled courses?`}/>}
                         explainJSX={<L p={p} t={`This base course has one or more currently scheduled courses.  In order to delete this base course, the scheduled courses that use this base course need to be deleted first.`}/>}
  											 onClick={handleHasScheduledCourseClose} />
                  }
                  {isShowingModal_deleteEdit &&
                      <MessageModal handleClose={handleDeleteClose} heading={actionType === 'BASECOURSE' ? <L p={p} t={`Delete this course?`}/> : <L p={p} t={`Remove this course from the schedule?`}/>}
                         explainJSX={actionType === 'BASECOURSE' ? <L p={p} t={`Are you sure you want to delete this course?`}/> : <L p={p} t={`Are you sure you want to remove this course from the schedule?`}/>}
  											 isConfirmType={true} onClick={handleDelete} />
                  }
  								{isShowingModal_duplicate &&
  										<TextareaModal key={'all'} handleClose={handleDuplicateClose} heading={``} explain={``}
  											 onClick={handleCourseDuplicate} currentSentenceText={courseName} placeholder={<L p={p} t={`Make a copy of this course?`}/>}/>
  								}
              </div>
          )
}
export default ContextCourseAction
