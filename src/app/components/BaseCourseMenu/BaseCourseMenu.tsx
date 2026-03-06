import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './BaseCourseMenu.css'
import MessageModal from '../MessageModal'
import TextareaModal from '../../components/TextareaModal'
import classes from 'classnames'
import Icon from '../Icon'
import { withAlert } from 'react-alert'
const p = 'component'
import L from '../../components/PageLanguage'

function BaseCourseMenu(props) {
  const [isShowingModal_deleteEdit, setIsShowingModal_deleteEdit] = useState(false)
  const [isShowingModal_duplicate, setIsShowingModal_duplicate] = useState(false)
  const [isShowingModal_hasSchedule, setIsShowingModal_hasSchedule] = useState(false)

  const {className="", courseEntryId, courseScheduledId, courseName, actionType, isAdmin, addToClipboard, courseClipboard,
  			 					singleRemoveCourseClipboard, companyConfig} = props
          
  
  				let hasRecordChosen = !courseEntryId && !courseScheduledId ? false : true
  
          return (
              <div className={classes(styles.container, className)}>
                  {actionType !== 'BASECOURSE' &&
                      <a onClick={!hasRecordChosen ? chooseCourse : () => navigate('/courseToSchedule')}
                              data-rh={`Schedule a new course section`} className={classes(styles.moveRight, styles.row)}>
                          <Icon pathName={`group_work`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                          <Icon pathName={`plus`} fillColor={'green'} className={classes(styles.plusIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                      </a>
                  }
  								{actionType === 'BASECOURSE' &&
  										<a onClick={!hasRecordChosen ? chooseCourse : () => navigate(actionType === 'BASECOURSE' ? '/courseToSchedule/new/' + courseEntryId : '/learnerCourseAssign/set/course/' + courseScheduledId)}
  														data-rh={actionType === 'BASECOURSE' ? `Schedule this course` : `Assign this course to a student`} className={classes(styles.moveRight, styles.row)}>
  												<Icon pathName={`clock3`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  												<Icon pathName={`plus`} fillColor={'green'} className={classes(styles.plusIcon, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  										</a>
  								}
  								{actionType !== 'BASECOURSE' && (!courseClipboard || !courseClipboard.courseList || !courseClipboard.courseList.length
  												|| (courseClipboard && courseClipboard.courseList && courseClipboard.courseList.length > 0 && courseClipboard.courseList.indexOf(courseScheduledId) === -1))
  										? <a onClick={!hasRecordChosen ? chooseCourse : () => addToClipboard(courseScheduledId)} data-rh={'Add course to clipboard'} className={styles.positionRight}>
  													<Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true}
  															superScriptClass={classes(styles.superScriptAdd, (!hasRecordChosen ? styles.opacityLow : ''))}
  															className={classes(styles.iconSuperAdd, styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
  											</a>
  										: companyConfig.urlcode === 'Manheim'
  												? <a onClick={!hasRecordChosen ? chooseCourse : () => singleRemoveCourseClipboard(courseScheduledId)} data-rh={'Remove course from clipboard'} className={styles.positionRight}>
  															<Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#ff0000'} premium={true}
  																	superScriptClass={classes(styles.superScriptAdd, (!hasRecordChosen ? styles.opacityLow : ''))}
  																	className={classes(styles.iconSuperAdd, styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))} />
  													</a>
  												: ''
  								}
                  {isAdmin &&
  										<a onClick={!hasRecordChosen ? chooseCourse : sendToCourseEdit} data-rh={'Edit the course setup'}>
  		                    <Icon pathName={`pencil0`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  		                </a>
  								}
                  <a onClick={!hasRecordChosen ? chooseCourse : () => navigate('/gradebookEntry/' + courseScheduledId)}  data-rh={'Gradebook'}>
                      <Icon pathName={`medal_empty`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                  </a>
                  <a onClick={!hasRecordChosen ? chooseCourse : () => navigate('/assignmentList/' + courseEntryId)} data-rh={'Manage assignments'}>
                      <Icon pathName={`list3`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                  </a>
                  <a onClick={!hasRecordChosen ? chooseCourse : () => navigate('/courseWeightedScore/' + courseEntryId)} data-rh={'Weighted Scores'}>
                      <Icon pathName={`scale`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                  </a>
                  {/*isAdmin &&
  										<a onClick={!hasRecordChosen ? chooseCourse : handleDuplicateOpen} data-rh={'Duplicate this course to create another'}>
  		                    <Icon pathName={`compare_docs`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  		                </a>
  								*/}
                  <a onClick={!hasRecordChosen ? chooseCourse : () => navigate('/discussionClass/' + courseEntryId)} data-rh={'View the class discussion'}>
                      <Icon pathName={`chat_bubbles`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
                  </a>
  								{isAdmin &&
  										<a onClick={!hasRecordChosen ? chooseCourse : validateDelete} data-rh={`Delete this course`}>
  												<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasRecordChosen ? styles.opacityLow : ''))}/>
  		                </a>
  								}
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

export default withAlert(BaseCourseMenu)
