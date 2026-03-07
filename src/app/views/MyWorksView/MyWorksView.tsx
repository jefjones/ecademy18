import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './MyWorksView.css'
const p = 'MyWorksView'
import L from '../../components/PageLanguage'
import * as guid from '../../utils/guidValidate'
import globalStyles from '../../utils/globalStyles.css'
import WorkFilter from '../../components/WorkFilter'
import Loading from '../../components/Loading'
import FileTreeSubContents from '../../components/FileTreeSubContents'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {emptyGuid} from '../../utils/guidValidate'
import MenuDocumentRibbon from '../../components/MenuDocumentRibbon'

function MyWorksView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [searchFocusIndex, setSearchFocusIndex] = useState(0)
  const [searchFoundCount, setSearchFoundCount] = useState(null)
  const [showWorkId, setShowWorkId] = useState('')
  const [chosenWork, setChosenWork] = useState('')
  const [workFolderMineExpanded, setWorkFolderMineExpanded] = useState(props.personConfig && props.personConfig.workFolderMineExpanded)
  const [workFolderOthersExpanded, setWorkFolderOthersExpanded] = useState(props.personConfig && props.personConfig.workFolderOthersExpanded)
  const [showSearchControls, setShowSearchControls] = useState(!this.state.showSearchControls)

  useEffect(() => {
    
    			document.body.addEventListener('keyup', checkEscapeKey)
    			document.body.addEventListener('click', hideContextMenu)
    	
  }, [])

  const {personId, fileTreeExplorer, updateFilterByField, clearFilters, workSummaries=[], filterScratch, savedFilterIdCurrent, workFilterOptions,
  						updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch, fetchingRecord, deleteWork,
  						group, setWorkCurrentSelected, getAuthorWorkspace, setPenspringHomeworkSubmitted, getMyWorks, getWorksSharedWithMe,
  						resolveFetchingRecordFileTreeExplorer, setGradebookScoreByPenspring, toggleExpanded, setPenspringDistributeSubmitted} = props
       //searchString, searchFocusIndex, searchFoundCount
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`My Documents`}/>
              </div>
  						<hr/>
  						<div onClick={toggleSearchControls} className={classes(styles.menuItem, styles.row)}>
  								<Icon pathName={'magnifier'} premiuim={true} className={styles.icon}/>
  								<div className={styles.link}>{showSearchControls ? <L p={p} t={`hide search controls`}/> : <L p={p} t={`show search controls`}/>}</div>
  						</div>
              {group &&
                  <div className={classes(styles.subTitle, styles.row)}><L p={p} t={`For group: `}/> {group && group.groupName}</div>
              }
  						{showSearchControls &&
  								<div className={styles.menuItem}>
  										<div>
  												<SelectSingleDropDown
  														id={`filter`}
  														label={<L p={p} t={`Saved searches`}/>}
  														value={savedFilterIdCurrent ? savedFilterIdCurrent : ''}
  														options={workFilterOptions}
  														error={''}
  														height={`medium`}
  														selectClass={styles.selectList}
  														labelClass={styles.listLabel}
  														onChange={(event) => chooseSavedSearch(personId, event.target.value)} />
  										</div>
  										{guid.isGuidNotEmpty(savedFilterIdCurrent) &&
  												<div>
  														<div className={classes(styles.row, styles.marginLessTop)}>
  																<a onClick={() => updateSavedSearch(personId, savedFilterIdCurrent)} className={styles.linkStyle}>
  																		<Icon pathName={`floppy_disk`} className={styles.image}/>
  																</a>
  																<a onClick={() => deleteSavedSearch(personId, savedFilterIdCurrent)} className={styles.linkStyle}>
  																		<Icon pathName={`garbage_bin`} className={styles.image}/>
  																</a>
  																<a onClick={() => clearFilters(personId)} className={styles.linkStyle}>
  																		<Icon pathName={`document_refresh`} className={styles.image}/>
  																</a>
  																<Checkbox
  																		id={`filterDefault`}
  																		label={<L p={p} t={`Default`}/>}
  																		labelClass={styles.labelCheckbox}
  																		position={`before`}
  																		checked={filterScratch.defaultFlag}
  																		onClick={() => updateFilterDefaultFlag(personId, savedFilterIdCurrent, !filterScratch.defaultFlag)}
  																		className={styles.checkbox} />
  														 </div>
  												</div>
  										}
  		                <WorkFilter personId={personId} workFilter={filterScratch} className={styles.workFilter} updateFilterByField={updateFilterByField}
  		                    clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} savedSearchOptions={workFilterOptions}/>
  								</div>
  						}
              <hr />
              <Link to={`/workAddNew/${group && group.groupId}`} className={classes(styles.newWork, styles.row, styles.link)}>
  								<Icon pathName={'plus'} className={styles.iconSmaller}/>
  								<L p={p} t={`Add a new document`}/>
  						</Link>
              <hr />
              <Loading loadingText={`Loading`} isLoading={fetchingRecord && fetchingRecord.works} />
              {!fetchingRecord.works && (!workSummaries || workSummaries.length === 0) ? <span className={styles.noListMessage}>{`empty list`}<br/><br/></span> : ''}
  						<div className={classes(styles.menuItem, styles.row)}>
  								<div className={styles.link} onClick={() => handleToggleAllExpanded(true)}><L p={p} t={`expand all`}/></div>
  								<div className={styles.divider}> | </div>
  								<div className={styles.link} onClick={() => handleToggleAllExpanded(false)}><L p={p} t={`collapse all`}/></div>
  						</div>
  						<div className={classes(styles.mainFolder, styles.row)} onClick={() => handleUpdatePersonConfig('WorkFolderMineExpanded')}>
  								<Icon pathName={workFolderMineExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  								<Icon pathName={workFolderMineExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  								<div className={classes(styles.backgroundFolder, styles.row)}>
  										<div className={styles.pointer}>
  												<L p={p} t={`My Documents`}/>
  										</div>
  										<div className={styles.count}>{fileTreeExplorer.mine.length === 0 ? '0' : fileTreeExplorer.mine.length}</div>
  										{/*<div onClick={(event) => openContextMenuFileFolder(event, 'Mine')} className={classes(styles.link, styles.moreLeft)}>
  												<Icon pathName={'menu_lines'} premium={true} className={styles.iconMenu} />
  										</div>*/}
  								</div>
  						</div>
  						{workFolderMineExpanded &&
  								<div className={styles.ribbonPosition}>
  										<MenuDocumentRibbon personId={personId} chosenWork={chosenWork} setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork}
  												workSummaries={workSummaries} mineOrOthers={'Mine'}/>
  								</div>
  						}
  						<div className={styles.muchLeft}>
  								<FileTreeSubContents fileTreeExplorer={fileTreeExplorer.mine} isParentExpanded={workFolderMineExpanded}
  										toggleExpanded={toggleExpanded} setWorkCurrentSelected={setWorkCurrentSelected} personId={personId} mineOrOthers={'Mine'}
  										workSummaries={workSummaries} getAuthorWorkspace={getAuthorWorkspace} deleteWork={deleteWork} setPenspringHomeworkSubmitted={setPenspringHomeworkSubmitted}
  										getMyWorks={getMyWorks} getWorksSharedWithMe={getWorksSharedWithMe} fetchingRecord={fetchingRecord}
  										resolveFetchingRecordFileTreeExplorer={resolveFetchingRecordFileTreeExplorer} setGradebookScoreByPenspring={setGradebookScoreByPenspring}
  										chosenWork={chosenWork} chooseRecord={chooseRecord} setPenspringDistributeSubmitted={setPenspringDistributeSubmitted}/>
  						</div>
  						<div className={classes(styles.mainFolder, styles.row, styles.moreTop)} onClick={() => handleUpdatePersonConfig('WorkFolderOthersExpanded')}>
  								<Icon pathName={workFolderOthersExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  								<Icon pathName={workFolderOthersExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  								<div className={classes(styles.backgroundFolder, styles.row)}>
  										<L p={p} t={`Documents Shared with Me`}/>
  										<div className={styles.count}>{fileTreeExplorer.others.length === 0 ? '0' : fileTreeExplorer.others.length}</div>
  										{/*<div onClick={(event) => openContextMenuFileFolder(event, 'Others')} className={classes(styles.link, styles.moreLeft)}>
  												<Icon pathName={'menu_lines'} premium={true} className={styles.iconMenu} />
  										</div>*/}
  								</div>
  						</div>
  						{workFolderOthersExpanded &&
  								<div className={styles.ribbonPosition}>
  										<MenuDocumentRibbon personId={personId} chosenWork={chosenWork} setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork}
  												workSummaries={workSummaries} mineOrOthers={'Others'}/>
  								</div>
  						}
  						<div className={styles.muchLeft}>
  								<FileTreeSubContents fileTreeExplorer={fileTreeExplorer.others} isParentExpanded={workFolderOthersExpanded}
  										toggleExpanded={toggleExpanded} setWorkCurrentSelected={setWorkCurrentSelected} personId={personId} mineOrOthers={'Others'}
  										workSummaries={workSummaries} getAuthorWorkspace={getAuthorWorkspace} deleteWork={deleteWork} setPenspringHomeworkSubmitted={setPenspringHomeworkSubmitted}
  										getMyWorks={getMyWorks} getWorksSharedWithMe={getWorksSharedWithMe} fetchingRecord={fetchingRecord}
  										resolveFetchingRecordFileTreeExplorer={resolveFetchingRecordFileTreeExplorer} setGradebookScoreByPenspring={setGradebookScoreByPenspring}
  										chosenWork={chosenWork} chooseRecord={chooseRecord} setPenspringDistributeSubmitted={setPenspringDistributeSubmitted}/>
  						</div>
              <OneFJefFooter />
          </div>
      )
}

// <WorkTools personId={personId} workSummary={workToolSummary} group={group} showDelete={false}
// 		setWorkCurrentSelected={setWorkCurrentSelected} chapterId={workToolSummary && workToolSummary.chapterId_current}
// 		isOwner={workToolSummary && personId === workToolSummary.authorPersonId} className={styles.workTools}
// 		hasMultSections={workToolSummary && workToolSummary.sectionCount > 1} showLabels={false}
// 		updatePersonConfig={updatePersonConfig} personConfig={personConfig} forceHideLabels={true}/>,
// <button style={{ verticalAlign: 'middle', }} onClick={() => this.handleSummaryOpen(rowInfo.node['workId'])} >
// 		?
// </button>,
export default MyWorksView
