import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './WorkTools.css'
import classes from 'classnames'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import tapOrClick from 'react-tap-or-click'
const p = 'component'
import L from '../../components/PageLanguage'

function WorkTools(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_work, setIsShowingModal_work] = useState(false)
  const [isShowingModal_workOrSection, setIsShowingModal_workOrSection] = useState(false)

  const handleDeleteType = () => {
    
            const {hasMultSections} = props
            if (hasMultSections) {
                handleDeleteWorkOrSectionOpen()
            } else {
                handleDeleteWorkOpen()
            }
        
  }

  const handleDelete = (type) => {
    
            //Notice that the default option for the switch below is to delete the work.  This is helpful for the situation
            //  when the Work only has one section so that the message dialog for the choice to delete the section or the entire document
            //  does not come up.  The user only has a confirmation to delete the entire document in that case.
            const {deleteWork, deleteChapter, personId, workSummary} = props
            handleDeleteWorkOrSectionClose()
            handleDeleteWorkClose()
            switch(type) {
                case 'SECTION':
                    deleteChapter(personId, workSummary.workId, workSummary.chapterId_current)
                    break
                default:
                    deleteWork(personId, workSummary.workId)
                    navigate("/myWorks")
            }
        
  }

  const handleDeleteWorkClose = () => {
    return setIsShowingModal_work(false)
    

  }
  const handleDeleteWorkOpen = () => {
    return setIsShowingModal_work(true)
    

  }
  const handleDeleteWorkOrSectionClose = () => {
    return setIsShowingModal_workOrSection(false)
    

  }
  const handleDeleteWorkOrSectionOpen = () => {
    return setIsShowingModal_workOrSection(true)
    

  }
  const toggleLabels = () => {
    
            const {personId, updatePersonConfig, personConfig} = props
            updatePersonConfig(personId, `WorkToolsShowLabels`, personConfig && !personConfig.workToolsShowLabels)
        
  }

  const {personId, workSummary, className, isOwner, showEditorAccess=true, showDelete=false, showSettings=true,
                  setWorkCurrentSelected, group, chapterId, personConfig, forceHideLabels, showLabels=(forceHideLabels ? false : true)} = props; //The chapterId is only sent in when this is the workSections page with the list of sections.  Otherwise the chapterId is the current chapterId in the workSummary record
          
          let isShowingLabels = forceHideLabels
  						? false
  						: personConfig && personConfig.workToolsShowLabels
  								? personConfig.workToolsShowLabels
  								: false
  
          return !workSummary ? null : (
              <div className={classes(className, isShowingLabels ? styles.containerColumn : styles.containerRow)}>
                  {showSettings &&
                      <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                          <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? <L p={p} t={`Edit or view document`}/> : null}
  																{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, `/editReview/${workSummary.workId}`))}>
                              <Icon pathName={`register`} premium={true}/>
                          </a>
                          {isShowingLabels && showLabels &&
                              <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, `/editReview/${workSummary.workId}`)}>
                                  <L p={p} t={`Edit or view document`}/>
                              </a>
                          }
                      </div>
                  }
                  {isOwner && showEditorAccess &&
                      <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                          <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? <L p={p} t={`Give or view access`}/> : null}
  																{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, group ? "/accessReport/" + group.groupId : "/giveAccessToEditors"))}>
                              <Icon pathName={`users0`} premium={true}/>
                          </a>
                          {isShowingLabels && showLabels &&
                              <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, group ? "/accessReport/" + group.groupId : "/giveAccessToEditors")}>
                                  <L p={p} t={`Give or view access`}/>
                              </a>
                          }
                      </div>
                  }
                  <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                      <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? 'Editing counts and reports' : null}
  														{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/report/e/edit/" + workSummary.workId))}>
                          <Icon pathName={`graph_report`} premium={true}/>
                      </a>
                      {isShowingLabels && showLabels &&
                          <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/report/e/edit")}>
                              <L p={p} t={`Editing counts and reports`}/>
                          </a>
                      }
                  </div>
                  {isOwner && showDelete &&
                      <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                          <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? 'Delete document' : null} {...tapOrClick(handleDeleteType)}>
                              <Icon pathName={`trash2`} premium={true}/>
                          </a>
                          {isShowingLabels && showLabels &&
                              <a className={styles.label} onClick={handleDeleteType}>
                                  <L p={p} t={`Delete document`}/>
                              </a>
                          }
                      </div>
                  }
                  {isOwner && showSettings &&
                      <div className={classes(styles.row, isShowingLabels ? styles.moreTop : '')}>
                          <a className={styles.linkStyle} data-rh={!isShowingLabels || !showLabels ? 'Document settings' : null}
  																{...tapOrClick(() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/workSettings"))}>
                              <Icon pathName={`cog`} premium={true}/>
                          </a>
                          {isShowingLabels && showLabels &&
                              <a className={styles.label} onClick={() => setWorkCurrentSelected(personId, workSummary.workId, chapterId ? chapterId : workSummary.chapterId_current, workSummary.languageId_current, "/workSettings")}>
                                  <L p={p} t={`Document settings`}/>
                              </a>
                          }
                      </div>
                  }
                  {showLabels &&
  	                  <a onClick={toggleLabels} className={classes(styles.labelChoice, isShowingLabels ? styles.moreTop : '')}>
  	                      {isShowingLabels ? <L p={p} t={`hide labels`}/> : <L p={p} t={`show labels`}/>}
  	                  </a>
                  }
                  {isShowingModal_work &&
                    <MessageModal handleClose={handleDeleteWorkClose} heading={<L p={p} t={`Delete this Document?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to delete this document?`}/>} isConfirmType={true}
                       {...tapOrClick(handleDelete)} />
                  }
                  {isShowingModal_workOrSection &&
                    <MessageModal handleClose={handleDeleteWorkOrSectionClose} heading={<L p={p} t={`Delete this Entire Document?`}/>}
                       explainJSX={<L p={p} t={`Do you want to delete this entire document or just the section?`}/>} isYesNoCancelType={true}
                       yesText={<L p={p} t={`Delete Document`}/>} noText={<L p={p} t={`Delete Section`}/>} cancelText={<L p={p} t={`Cancel`}/>} handleNo={() => handleDelete('SECTION')}
                       onClick={() => handleDelete('ENTIRE')} />
                  }
              </div>
        )
}
export default WorkTools
