import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './MobileHeader.css'
import globalStyles from '../../utils/globalStyles.css'
import Logo from '../../assets/PenSpring_medium.png'
import MainMenu from '../MainMenu'
import Idle from 'react-idle'
import MediaQuery from 'react-responsive'
import MenuHeaderIcons from '../MenuHeaderIcons'
import classes from 'classnames'
import WorkSummaryModal from '../WorkSummaryModal'

function MobileHeader(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [clickedOnCaret, setClickedOnCaret] = useState(false)
  const [isShowingOffline, setIsShowingOffline] = useState(false)

  useEffect(() => {
    
            window.addEventListener('online', handleOnline)
            window.addEventListener('offline', handleOffline)
        
  }, [])

  const {workSummary, setWorkCurrentSelected, isNewUserOnFirstWorkAdd, personId, personName, fetchingRecord, deleteWork, //firstName,
                  deleteChapter, updateChapterDueDate, updateChapterComment, editorScore, groupSummary, setGroupCurrentSelected, 
                  deleteGroup, groupSummaries, updatePersonConfig, personConfig, editorInvitePending, deleteInvite, acceptInvite, resendInvite} = props
          
  
          return (
              <div>
                  <div className={styles.container}>
                    <Link to="/"><img src={Logo} className={styles.logo} alt={`penspring logo`} /></Link>
                    <div className={classes(styles.workTitle, (workSummary && workSummary.sectionCount > 1 ? styles.showSection : ''))}>
                      <div className={classes(styles.row, styles.link)} onClick={handleSummaryOpen}>
                           {!fetchingRecord || fetchingRecord.works
                               ? <span className={styles.yellow}>waiting to load...</span>
                               : !workSummary || !workSummary.title
                                  ? ''
                                  : workSummary.title.length > 30
                                      ? workSummary.title.substring(0,30) + `...`
                                      : workSummary.title
                            }
                            {fetchingRecord && !fetchingRecord.works && workSummary &&
                                <a onClick={handleSummaryOpen}>
                                    <div className={classes(globalStyles.jef_caret, globalStyles.jefCaretDown)}/>
                                </a>
                            }
                            {fetchingRecord && !fetchingRecord.works && workSummary && !workSummary.groupName && workSummary.languageName_current && workSummary.languageName_current !== "" &&
                                <span className={classes(styles.yellow, styles.lessMargin)}>
                                  {workSummary && workSummary.languageName_current.length > 1 && workSummary.title &&
                                      workSummary.title.length > 25 ? workSummary.languageName_current.substring(0,7) : workSummary.languageName_current}
                                </span>
                            }
                        </div>
                        {workSummary && workSummary.groupName && workSummary.authorName &&
                            <div className={styles.section}>
                              {workSummary.authorName}
                            </div>
                        }
                        {workSummary && workSummary.sectionCount > 1 && fetchingRecord && !fetchingRecord.works && workSummary.chapterName_current &&
                            <div className={styles.section}>
                                {`(` + workSummary.chapterNbr_current + `) `}
                                {workSummary && workSummary.chapterName_current && workSummary.chapterName_current.length > 48
                                    ? workSummary.chapterName_current.substring(0,48) + `...`
                                    : workSummary.chapterName_current}
                            </div>
  											}
                    </div>
  									<MediaQuery minWidth={700}>
  		                  {(matches) => {
  			                    if (matches) {
  				                      return (
  																	<MenuHeaderIcons firstName={''}/>
  															)
  												} else {
  			                      return (
  			                        	<div></div>
  			                      )
  		                    }
  											}}
  									</MediaQuery>
                    {!isNewUserOnFirstWorkAdd &&
                        <MainMenu className={styles.nav} workSummary={workSummary} setWorkCurrentSelected={setWorkCurrentSelected}
                            personId={personId} personName={personName} deleteWork={deleteWork} deleteChapter={deleteChapter}
                            editorScore={editorScore} groupSummary={groupSummary} setGroupCurrentSelected={setGroupCurrentSelected}
                            deleteGroup={deleteGroup} groupSummaries={groupSummaries} updatePersonConfig={updatePersonConfig} personConfig={personConfig}
                            editorInvitePending={editorInvitePending} deleteInvite={deleteInvite} acceptInvite={acceptInvite} resendInvite={resendInvite}/>
                     }
                    {isShowingModal &&
                        <WorkSummaryModal handleClose={handleSummaryClose} summary={workSummary} showTitle={true}
                           onClick={handleSave} setWorkCurrentSelected={setWorkCurrentSelectedPlusClose}
                           personId={personId} personName={personName} deleteWork={handleDeleteWork} deleteChapter={deleteChapter}
                           updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                           updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                     }
                  </div>
                  {isShowingOffline && <div className={styles.offlineText}>You appear to be offline.</div>}
                  <Idle
                      className={styles.highZIndex}
                      timeout={1200000}
                      onChange={({ idle}) => {
                          if (idle) {
                              //navigate("/login/timeout");
                              handleLogout()
                          }
                        }}
                      render={({ idle }) =>
                          <div>
                              {idle
                                ? <div className={styles.expiredText}>It appears that your session may have expired.</div>
                                : <div></div>
                              }
                          </div>
                      }
                    />
              </div>
          )
}

//<b className={styles.caret}></b>
export default MobileHeader
