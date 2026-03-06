import { useEffect, useState } from 'react'
import globalStyles from '../../utils/globalStyles.css'
import styles from './ChapterAddOrUpdateView.css'
const p = 'ChapterAddOrUpdateView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import InputText from '../../components/InputText'
import WorkSummary from '../../components/WorkSummary'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import OneFJefFooter from '../../components/OneFJefFooter'

function ChapterAddOrUpdateView(props) {
  const [errors, setErrors] = useState({})
  const [chapter, setChapter] = useState({
                chapterId: chapter ? chapter.chapterId : '',
                name: chapter ? chapter.name : '',
                chapterNbr: chapterSequenceOptions.length,
                workStatusId: chapter ? chapter.workStatusId : 1,
                editSeverityId: chapter ? chapter.editSeverityId : 2,
                comment: chapter && chapter.authorComment ? chapter.authorComment.comment : '',
            })
  const [chapterId, setChapterId] = useState(chapter ? chapter.chapterId : '')
  const [name, setName] = useState(chapter ? chapter.name : '')
  const [chapterNbr, setChapterNbr] = useState(chapterSequenceOptions.length)
  const [workStatusId, setWorkStatusId] = useState(chapter ? chapter.workStatusId : 1)
  const [editSeverityId, setEditSeverityId] = useState(chapter ? chapter.editSeverityId : 2)
  const [comment, setComment] = useState(chapter && chapter.authorComment ? chapter.authorComment.comment : '')

  useEffect(() => {
    
            //document.getElementById("name").focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        
  }, [])

          let {chapterSequenceOptions, workStatusOptions, editSeverityOptions, params, workSummary, personId, setWorkCurrentSelected, //eslint-disable-line
                  deleteWork, deleteChapter, updateChapterDueDate, updateChapterComment, updatePersonConfig, personConfig} = props
  
          return (
              <section className={styles.container}>
                  <div className={styles.titleLine}>
                      <span className={globalStyles.pageTitle}>
                          {params && params.chapterId ? <L p={p} t={`Update Section/Chapter`}/> : <L p={p} t={`Add New Section/Chapter`}/>}
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
                  <hr />
                  <ul className={styles.unorderedList}>
                      <li className={styles.menuItem}>
                          <span className={classes(styles.inputText, styles.lessBottom)}><L p={p} t={`Section/Chapter Name`}/></span><br/>
                          <InputText
                              size={"medium-long"}
                              name={"name"}
                              id={"name"}
                              value={chapter.name}
                              onChange={changeChapter}
                              onEnterKey={handleEnterKey}
                              inputClassName={styles.inputClassName}
                              labelClass={styles.labelClass}
                              error={errors.name} />
                      </li>
                      {workSummary && workSummary.chapterOptions && workSummary.chapterOptions.length > 1 &&
                          <li className={styles.menuItem}>
                              <div>
                                  <SelectSingleDropDown
                                      value={params && params.chapterId ? chapter.chapterNbr : chapterSequenceOptions.length}
                                      id={`chapterNbr`}
                                      label={<L p={p} t={`Sequence`}/>}
                                      options={chapterSequenceOptions}
                                      noBlank={true}
                                      error={''}
                                      labelClass={styles.labelClass}
                                      height={`medium`}
                                      className={styles.singleDropDown}
                                      onChange={changeChapter} />
                              </div>
                          </li>
                      }
                      <li className={styles.menuItem}>
                          <div>
                              <SelectSingleDropDown
                                  value={chapter.workStatusId}
                                  id={`workStatusId`}
                                  label={<L p={p} t={`Status`}/>}
                                  options={workStatusOptions}
                                  noBlank={true}
                                  error={''}
                                  labelClass={styles.labelClass}
                                  height={`medium`}
                                  className={styles.singleDropDown}
                                  onChange={changeChapter} />
                          </div>
                      </li>
                      <li className={styles.menuItem}>
                          <div>
                              <SelectSingleDropDown
                                  value={chapter.editSeverityId}
                                  id={`editSeverityId`}
                                  label={<L p={p} t={`Edit Severity`}/>}
                                  options={editSeverityOptions}
                                  noBlank={true}
                                  error={''}
                                  labelClass={styles.labelClass}
                                  height={`medium`}
                                  className={styles.singleDropDown}
                                  onChange={changeChapter} />
                          </div>
                      </li>
                      <li className={styles.menuItem}>
                          <span className={styles.inputText}><L p={p} t={`Author's Comment`}/></span><br/>
                          <textarea rows={5} cols={45}
                                  id={`comment`}
                                  name={`comment`}
                                  defaultValue={chapter.comment}
                                  onChange={changeChapter}
                                  className={styles.commentTextarea}>
                          </textarea>
                      </li>
                  </ul>
                  {(!params || !params.chapterId) &&
                      <div>
                          <span className={classes(styles.menuItem, styles.navEnterText)}>How do you want to enter text?</span>
                          <div className={styles.row}>
                              <ButtonWithIcon label={<L p={p} t={`Start writing`}/>} icon={'checkmark_circle'} onClick={() => processForm(false)} className={styles.submitButton}/>
                              <ButtonWithIcon label={<L p={p} t={`Upload a file`}/>} icon={'checkmark_circle'} onClick={() => processForm(true)} className={styles.submitButton}/>
                          </div>
                      </div>
                  }
                  {params && params.chapterId &&
                      <a onClick={() => processForm('UPDATE')} className={styles.buttonStyle}><L p={p} t={`Submit`}/></a>
                  }
                  <OneFJefFooter />
              </section>
          )
}

export default ChapterAddOrUpdateView
