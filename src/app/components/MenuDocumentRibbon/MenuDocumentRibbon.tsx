import { useState } from 'react'
import * as styles from './MenuDocumentRibbon.css'
import MessageModal from '../MessageModal'
import WorkSummaryModal from '../../components/WorkSummaryModal'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function MenuDocumentRibbon(props) {
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal_chooseWork, setIsShowingModal_chooseWork] = useState(false)
  const [isShowingModal_notSubmittedYet, setIsShowingModal_notSubmittedYet] = useState(false)
  const [isShowingModal_noAccess, setIsShowingModal_noAccess] = useState(false)
  const [showWorkId, setShowWorkId] = useState('')
  const [workSummary, setWorkSummary] = useState({})

  const {className="", chosenWork={}, personId, setWorkCurrentSelected, updateChapterDueDate, updateChapterComment, updatePersonConfig,
  								personConfig, mineOrOthers } = props
          
  
          return (
              <div className={classes(styles.container, styles.row, className)}>
  								<a onClick={!chosenWork.workId
  												? handleChooseWorkOpen
  												: mineOrOthers === 'Mine' || (chosenWork.studentAssignmentResponseId && chosenWork.penspringSubmittedDate)
  														? () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', `/editReview/${chosenWork.workId}`)
  													  : handleNotSubmittedYetOpen} data-rh={`Review this document and it's edits`}>
  										<Icon pathName={`register`} premium={true} className={classes(styles.image, styles.moreTopMargin,
  											  (!chosenWork.workId || (mineOrOthers === 'Others' && !(chosenWork.studentAssignmentResponseId && chosenWork.penspringSubmittedDate))
  														? styles.opacityLow : ''))}/>
  								</a>
  								{mineOrOthers === 'Mine' &&
  		                <a onClick={!chosenWork.workId
  														? handleChooseWorkOpen
  														: mineOrOthers === chosenWork.mineOrOthers
  																? () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', '/giveAccessToEditors')
  															  : handleNoAccessOpen} data-rh={'Grant access to editors'}>
  		                    <Icon pathName={`users0`} premium={true} className={classes(styles.image, styles.moreTopMargin,
  														(!chosenWork.workId || mineOrOthers !== chosenWork.mineOrOthers ? styles.opacityLow : ''))}/>
  		                </a>
  								}
                  <a onClick={!chosenWork.workId
  												? handleChooseWorkOpen
  												: () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', '/report/e/edit')} data-rh={'Editor reports'}>
                      <Icon pathName={`graph_report`} premium={true} className={classes(styles.image, styles.moreTopMargin, (!chosenWork.workId ? styles.opacityLow : ''))}/>
                  </a>
  								{mineOrOthers === 'Mine' &&
  		                <a onClick={!chosenWork.workId
  														? handleChooseWorkOpen
  														: mineOrOthers === chosenWork.mineOrOthers
  																? () => setWorkCurrentSelected(personId, chosenWork.workId, '', '', '/workSettings')
  															  : handleNoAccessOpen} data-rh={'Document settings'}>
  		                    <Icon pathName={`cog`} premium={true} className={classes(styles.image, styles.moreTopMargin,
  														(!chosenWork.workId || mineOrOthers !== chosenWork.mineOrOthers ? styles.opacityLow : ''))}/>
  		                </a>
  								}
  		            <a onClick={!chosenWork.workId
  												? handleChooseWorkOpen
  												: () => handleSummaryOpen(chosenWork.workId)} data-rh={'Document and editor statistics'}>
                      <Icon pathName={`info`} className={classes(styles.image, styles.lowerOpacity, styles.moreTopMargin, (!chosenWork.workId ? styles.opacityLow : ''))}/>
                  </a>
  								{mineOrOthers === 'Mine' &&
  		                <a onClick={!chosenWork.workId
  														? handleChooseWorkOpen
  														: mineOrOthers === chosenWork.mineOrOthers
  																? validateDelete
  															  : handleNoAccessOpen} data-rh={`Delete this document`}>
  												<Icon pathName={`trash2`} premium={true} className={classes(styles.image, styles.moreTopMargin,
  														(!chosenWork.workId || mineOrOthers !== chosenWork.mineOrOthers ? styles.opacityLow : ''))}/>
  		                </a>
  								}
                  {isShowingModal_delete &&
                      <MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this document?`}/>} isConfirmType={true}
                         explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} onClick={handleDelete} />
                  }
  								{isShowingModal_chooseWork &&
                      <MessageModal handleClose={handleChooseWorkClose} heading={<L p={p} t={`Choose a document`}/>}
                         explainJSX={<L p={p} t={`Click on a document name and then the tools will become available for use.`}/>} onClick={handleChooseWorkClose}/>
                  }
  								{isShowingModal_notSubmittedYet &&
                      <MessageModal handleClose={handleNotSubmittedYetClose} heading={<L p={p} t={`Homework not yet submitted`}/>}
                         explainJSX={<L p={p} t={`This homework has not been submitted yet.`}/>} onClick={handleNotSubmittedYetClose}/>
                  }
  								{isShowingModal_noAccess &&
                      <MessageModal handleClose={handleNoAccessClose} heading={<L p={p} t={`You do not have access to this action`}/>}
                         explainJSX={<L p={p} t={`You are not the owner of this file in order to choose this action.`}/>} onClick={handleNoAccessClose}/>
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
export default MenuDocumentRibbon
