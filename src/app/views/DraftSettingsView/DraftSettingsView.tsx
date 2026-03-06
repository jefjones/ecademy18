import { useState } from 'react'
import styles from './DraftSettingsView.css'
const p = 'DraftSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import WorkSummary from '../../components/WorkSummary'
import Checkbox from '../../components/Checkbox'
import MessageModal from '../../components/MessageModal'
import { Link } from 'react-router-dom'
import InputText from '../../components/InputText'
import classes from 'classnames'
import DateMoment from '../../components/DateMoment'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Icon from '../../components/Icon'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'

function DraftSettingsView(props) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [p, setP] = useState(undefined)

  const {workSummary, setWorkCurrentSelected, personId, deleteWork, deleteChapter, draftSettings, updateChapterDueDate,
              updateChapterComment, updatePersonConfig, personConfig} = props
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Draft Settings`}/>
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
              <Link to={`/editReview/isdraft`} className={styles.viewDrafts}>
                  <L p={p} t={`View Draft Comparisons`}/>
              </Link>
              <hr />
              {draftSettings && draftSettings.length > 0 &&
                  draftSettings.map((m, i) => {
                      return (
                          <div key={i}>
                              <div className={styles.draftRow}>
                                  {!m.isCurrent &&
                                      <a className={styles.linkStyle} onClick={handleDeleteOpen}>
                                          <Icon pathName={`garbage_bin`} className={styles.delete}/>
                                      </a>
                                  }
                                  {isShowingModal &&
                                    <MessageModal key={i} handleClose={handleDeleteClose} heading={<L p={p} t={`Delete this Draft?`}/>}
                                       explainJSX={<L p={p} t={`Are you sure you want to delete this draft, ${m.name}?`}/>} isConfirmType={true}
                                       onClick={() => handleDelete(m.draftComparisonId, m.name)} />
                                  }
                                  <Checkbox
                                      id={m.draftComparisonId}
                                      label={m.name}
                                      labelClass={styles.checkboxLabel}
                                      checked={m.isChosen}
                                      onClick={(event) => handleDraftChosen(m.draftComparisonId, event)}
                                      onChange={(event) => handleDraftChosen(m.draftComparisonId, event)}
                                      checkboxClass={classes(styles.checkbox, (m.isCurrent ? styles.noDeleteImage : ''))} />
                              </div>
                              <DateMoment date={m.draftDate} className={styles.dateFormat} />
                          </div>
                      )
                  })
              }
              <div>
                  <InputText
                      label={<L p={p} t={`Draft Name`}/>}
                      labelClass={styles.inputText}
                      value={name}
                      size={"medium"}
                      name={"searchText"}
                      placeholder={""}
                      onChange={handleNameUpdate}/>
                  <div className={styles.errorName}>{nameError}</div>
              </div>
  
              <div className={styles.buttonDiv}>
                  <ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={handleSubmit}/>
              </div>
        </div>
      )
}
export default DraftSettingsView
