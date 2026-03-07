import { useEffect, useState } from 'react'
import styles from './WorkSettingsView.css'
const p = 'WorkSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'
import WorkAddOrUpdate from '../../components/WorkAddOrUpdate'
import MessageModal from '../../components/MessageModal'
import classes from 'classnames'

function WorkSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(false)
  const [workName, setWorkName] = useState(workSummary.title)

  useEffect(() => {
    
            const {workSummary} = props
            setWorkName(workSummary.title)
        
  }, [])

  const {personId, workSummary, groupList, addOrUpdateDocument} = props
        
  
        let chapterOptions = Object.assign([], workSummary.chapterOptions)
        chapterOptions = chapterOptions && chapterOptions.length > 0 && chapterOptions.map(m => {
            m.label = m.label && m.label.length > 35 ? m.label.substring(0,35) + '...' : m.label
            return m
        })
  
        return (
          <div className={styles.chapterer}>
              <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                  <L p={p} t={`Document Settings`}/>
              </div>
              <WorkAddOrUpdate submitOuterPage={() => {}} languageList={workSummary.languageOptions} groupList={groupList}
                  workSummary={workSummary} personId={personId} workId={workSummary.workId} groupChosen={workSummary.groupId}
                  isNotEditMode={true} showButton={true} addOrUpdateDocument={addOrUpdateDocument} showMoreInfo={true}/>
              {chapterOptions && chapterOptions.length > 1 &&
                  <div className={styles.selectListClass}>
                      <SelectSingleDropDown
                          id={`workSections`}
                          label={<L p={p} t={`Section`}/>}
                          indexName={'inLineSection'}
                          value={workSummary.chapterId_current}
                          options={chapterOptions}
                          noBlank={true}
                          error={''}
                          height={`medium`}
                          onChange={onChangeSection} />
                  </div>
              }
              <ul className={styles.unorderedList}>
                  <li><hr /></li>
                  <li><Link to={`/workSections`} className={styles.menuItem}>
                          <L p={p} t={`Sections / Chapters`}/>
                          <span className={styles.marginLeft}><L p={p} t={`(add, merge, split or delete)`}/></span>
                      </Link>
                  </li>
                  <li><hr /></li>
                  {workSummary.authorPersonId === personId && <li><Link to={`/giveAccessToEditors`} className={styles.menuItem}><L p={p} t={`Give Access to your Editors`}/></Link></li>}
                  {workSummary.authorPersonId === personId &&
  								<li><hr /></li>}
                  {workSummary.authorPersonId === personId && <li><Link to={`/workDownload`} className={styles.menuItem}><L p={p} t={`Download (Export)`}/></Link></li>}
                  {workSummary.authorPersonId === personId && <li><Link to={`/draftSettings`} className={styles.menuItem}><L p={p} t={`Draft Comparisons`}/></Link></li>}
                  <li><hr /></li>
  								{workSummary.authorPersonId === personId && <li><a onClick={handleDeleteWorkOpen} className={styles.menuItem}><L p={p} t={`Delete this document`}/></a></li>}
              </ul>
              <OneFJefFooter />
  						{isShowingModal_comment &&
  							<MessageModal key={'acceptAll'} handleClose={handleDeleteWorkClose} heading={<L p={p} t={`Delete this document permanently?`}/>}
  								 explainJSX={<L p={p} t={`Are you sure you want to delete this document permanently?`}/>} isConfirmType={true}
  								 onClick={handleDeleteWork} />
  						}
          </div>
      )
}

export default WorkSettingsView
