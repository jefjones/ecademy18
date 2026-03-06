import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './WorkSectionsView.css'
const p = 'WorkSectionsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import WorkSummary from '../../components/WorkSummary'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'

function WorkSectionView(props) {
  const [chapterToSplit, setChapterToSplit] = useState(0)

  const {personId, setWorkCurrentSelected, deleteWork, deleteChapter, sectionSummaries=[], workSummary,
                  updateChapterDueDate, updateChapterComment, updatePersonConfig, personConfig} = props
  
          
  
          return (
              <div className={styles.container}>
                  <div className={globalStyles.pageTitle}>
                      <L p={p} t={`Document Sections (or Chapters)`}/>
                  </div>
                  <Accordion allowMultiple={true} noShowExpandAll={true}>
                      <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false}
                              className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                              showAssignWorkToEditor={false} personId={personId} workSummary={workSummary}
                              setWorkCurrentSelected={setWorkCurrentSelected}
                              deleteWork={deleteWork} deleteChapter={deleteChapter}>
                          <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={false} showTitle={false}
                              setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                              updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}/>
                      </AccordionItem>
                  </Accordion>
                  <hr />
                  <ul className={styles.unorderedList}>
                      <li><Link to={'/addOrUpdateChapter'} className={styles.menuItem}><L p={p} t={`Add a new section`}/></Link></li>
                      <li><Link to={'/mergeChapters'} className={styles.menuItem}><L p={p} t={`Merge two sections`}/></Link></li>
                      <li>
                          <div className={styles.selectListClass}>
                              <SelectSingleDropDown
                                  value={chapterToSplit}
                                  options={workSummary.chapterOptions}
                                  label={<L p={p} t={`Split section`}/>}
                                  error={''}
                                  height={`short`}
                                  onChange={handleSplitChapter} />
                          </div>
                      </li>
                      <li>
                          <div className={styles.selectListClass}>
                              <SelectSingleDropDown
                                  value={''}
                                  options={workSummary.chapterOptions}
                                  label={<L p={p} t={`Name and settings update`}/>}
                                  error={''}
                                  height={`short`}
                                  onChange={handleChapterUpdate} />
                          </div>
                      </li>
                  </ul>
                  <hr />
                  {!sectionSummaries || sectionSummaries.length === 0 ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
                  {sectionSummaries &&
                      <Accordion allowMultiple={true}>
                          {sectionSummaries.map((s, i) => {
                              return (
                                <AccordionItem title={s.title} expanded={s.isExpanded} key={s.chapterId} indexKey={s.chapterId}
                                    className={classes(styles.accordionTitle, s.isCurrentWork ? styles.isCurrentWork : '')}
                                    onTitleClick={() => setWorkCurrentSelected(personId, s.workId, s.chapterOptions[i].chapterId, s.languageId_current, 'editReview')}
                                    updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                                        <WorkSummary key={i} summary={s} className={styles.workSummary} showIcons={true} personId={personId} noShowSection={true}
                                            setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} showTitle={false} showEdit={true}
                                            labelCurrentClass={styles.labelCurrentClass} deleteChapter={deleteChapter} noShowCurrent={true}
                                            onChangeSequence={(event) => changeSequence(props, s.chapterId, event)} chapterId={s.chapterOptions[i].chapterId}
                                            updateChapterDueDate={updateChapterDueDate} showSequence={true} updateChapterComment={updateChapterComment}
                                            updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                                </AccordionItem>
                              )
                          })}
                      </Accordion>
                  }
              </div>
          )
}

export default WorkSectionView
