import { useState } from 'react'
import * as styles from './ContextMenuDocument.css'
import MessageModal from '../MessageModal'
import WorkSummaryModal from '../../components/WorkSummaryModal'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function ContextMenuDocument(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [showWorkId, setShowWorkId] = useState('')
  const [workSummary, setWorkSummary] = useState({})

  const {className="", workId, personId, setWorkCurrentSelected, updateChapterDueDate, updateChapterComment,
  								updatePersonConfig, personConfig } = props
          
  
          return (
              <div className={classes(styles.container, styles.row, className)}>
                  <div className={styles.multipleContainer}>
  										<div className={classes(styles.row, styles.moreRight)} data-rh={`Review this document and it's edits`}>
  												<a onClick={() => setWorkCurrentSelected(personId, workId, '', '', `/editReview/${workId}`)}>
  														<Icon pathName={`register`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
  												</a>
  										</div>
                      <div className={classes(styles.row, styles.moreRight)} data-rh={'Grant access to editors'}>
                          <a onClick={() => setWorkCurrentSelected(personId, workId, '', '', '/giveAccessToEditors')}>
                              <Icon pathName={`users0`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
                      <div className={classes(styles.row, styles.moreRight)} data-rh={'Editing counts and reports'}>
                          <a onClick={() => setWorkCurrentSelected(personId, workId, '', '', '/report/e/edit')}>
                              <Icon pathName={`graph_report`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
  										<div className={classes(styles.row, styles.moreRight)} data-rh={'Document settings'}>
                          <a onClick={() => setWorkCurrentSelected(personId, workId, '', '', '/workSettings')}>
                              <Icon pathName={`cog`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>
  										<div className={classes(styles.row, styles.moreRight)} data-rh={'Document and editor statistics'}>
                          <a onClick={() => handleSummaryOpen(workId)}>
                              <Icon pathName={`info`} className={classes(styles.image, styles.lowerOpacity, styles.moreTopMargin)}/>
                          </a>
                      </div>
                      {<div className={classes(styles.row, styles.moreRight)} data-rh={`Delete this document`}>
                          <a onClick={validateDelete}>
  														<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                          </a>
                      </div>}
                  </div>
                  {isShowingModal_delete &&
                      <MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this document?`}/>} isConfirmType={true}
                         explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} onClick={handleDelete} />
                  }
  								{showWorkId &&
  		              	<WorkSummaryModal handleClose={handleSummaryClose} summary={workSummary} showTitle={true}
                         onClick={handleSave} setWorkCurrentSelected={setWorkCurrentSelectedPlusClose}
                         personId={personId} updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                         updatePersonConfig={updatePersonConfig} personConfig={personConfig} headerTitleOnly={true}/>
  		            }
  						</div>
          )
}
export default ContextMenuDocument
