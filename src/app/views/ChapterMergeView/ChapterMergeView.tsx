import { useState } from 'react'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './ChapterMergeView.css'
const p = 'ChapterMergeView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import WorkSummary from '../../components/WorkSummary'
import tapOrClick from 'react-tap-or-click'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'

function ChapterMergeView(props) {
  const [error, setError] = useState('')
  const [firstChapterId, setFirstChapterId] = useState(0)
  const [secondChapterId, setSecondChapterId] = useState(0)
  const [p, setP] = useState(undefined)

          let {chapterOptions, workSummary, personId, setWorkCurrentSelected, deleteWork, deleteChapter, updateChapterDueDate,
                  updateChapterComment, updatePersonConfig, personConfig} = props
  
          return (
              <section className={styles.container}>
                  <div className={styles.titleLine}>
                      <span className={globalStyles.pageTitle}>
                          <L p={p} t={`Merge Sections/Chapters`}/>
                      </span>
                  </div>
                  <Accordion allowMultiple={true} noShowExpandAll={true}>
                      <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false} className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                              showAssignWorkToEditor={false} personId={personId} workSummary={workSummary} setWorkCurrentSelected={setWorkCurrentSelected}
                              deleteWork={deleteWork} deleteChapter={deleteChapter} updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                          <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={false} showTitle={false}
                              setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                              updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment}
                              updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                      </AccordionItem>
                  </Accordion>
                  <div className={styles.buttonPlace}>
                      <a onClick={() => processForm()} className={styles.buttonStyle}><L p={p} t={`Submit`}/></a>
                  </div>
                  {error && <div className={styles.alertMessage}>{error}</div>}
                  <hr />
                  <table className={styles.tableStyle}>
                      <thead>
                          <tr>
                              <td><span className={classes(styles.tableHeader, styles.sectionName)}><L p={p} t={`Section Name`}/></span></td>
                              <td><span className={styles.tableHeader}><L p={p} t={`First`}/></span></td>
                              <td><span className={styles.tableHeader}><L p={p} t={`Second`}/></span></td>
                          </tr>
                      </thead>
                      <tbody>
                      {chapterOptions.map((m, i) =>
                          <tr key={i} className={styles.lineSpace}>
                              <td>
                                  <span className={styles.tableData}>{`(` + m.chapterNbr + `) ` + m.name}</span>
                              </td>
                              <td>
                                  <span className={classes(styles.tableData, styles.radioButton)}>
                                      <input type="radio" name={`firstChoice`} value={m.id} checked={firstChapterId === m.id ? true : false}
                                          className={radioButton} {...tapOrClick(() => changeFirstChoice(m.id))}/>
                                  </span>
                              </td>
                              <td>
                                  <span className={classes(styles.tableData, styles.radioButton)}>
                                      <input type="radio" name={`secondChoice`} value={m.id} checked={secondChapterId === m.id ? true : false}
                                          className={radioButton} {...tapOrClick(() => changeSecondChoice(m.id))}/>
                                  </span>
                              </td>
                          </tr>
                      )}
                      </tbody>
                  </table>
              </section>
          )
}

export default ChapterMergeView
