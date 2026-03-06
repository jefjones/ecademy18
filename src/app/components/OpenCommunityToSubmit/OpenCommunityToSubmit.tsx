import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './OpenCommunityToSubmit.css'
import MultiSelect from '../MultiSelect'
import Checkbox from '../Checkbox'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateTimePicker from '../../components/DateTimePicker'
import MessageModal from '../../components/MessageModal'
import WorkFilter from '../../components/WorkFilter'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import moment from 'moment'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenCommunityToSubmit(props) {
  const [selectedChapters, setSelectedChapters] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [chosenWork, setChosenWork] = useState({})
  const [chapterOptions, setChapterOptions] = useState([])
  const [dueDate, setDueDate] = useState('')
  const [editNativeLanguage, setEditNativeLanguage] = useState(false)
  const [nativeLanguageName, setNativeLanguageName] = useState('')
  const [editorsCount, setEditorsCount] = useState(5)
  const [declineIdleId, setDeclineIdleId] = useState(0)
  const [editSeverityId, setEditSeverityId] = useState(0)
  const [errorDueDate, setErrorDueDate] = useState('')
  const [errorGenres, setErrorGenres] = useState('')
  const [errorChapters, setErrorChapters] = useState('')
  const [errorNoEntries, setErrorNoEntries] = useState('')
  const [isShowingModal_saved, setIsShowingModal_saved] = useState(false)
  const [isShowingModal_editTranslate, setIsShowingModal_editTranslate] = useState(false)
  const [localWorkSummaries, setLocalWorkSummaries] = useState([])
  const [p, setP] = useState(undefined)
  const [errorGeners, setErrorGeners] = useState(undefined)

  useEffect(() => {
    
          const {workSummaries, declineIdleOptions, editSeverityOptions} = props
          setLocalWorkSummaries(workSummaries); setDeclineIdleId(declineIdleOptions && declineIdleOptions.length > 0 && declineIdleOptions[0].id); setEditSeverityId(editSeverityOptions && editSeverityOptions.length > 0 && editSeverityOptions[0].id)
      
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          
          const {workSummaries, modifyOpenCommunityEntryId, openCommunityFull} = props
          //If this is a modify record, force in the modify details into the edit controls without having to call the handleWorkChoices function.
          //Then let the record be modified and updated.  If the record is not saved and the user moves onto another, then clear out this record with DidUnmount.
          if (modifyOpenCommunityEntryId && modifyOpenCommunityEntryId !== chosenWork.openCommunityEntryId) {
              let modifyWork = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.openCommunityEntryId === modifyOpenCommunityEntryId)[0]
              setChosenWork(modifyWork); setSelectedChapters(modifyWork.chapterIds || []); setSelectedLanguages(modifyWork.translateLanguageIds || []); setSelectedGenres(modifyWork.genreIds || []); setChapterOptions(modifyWork.chapterOptions); setDueDate(moment(modifyWork.dueDate).format("D MMM YYYY")); setNativeLanguageName(modifyWork.nativeLanguageName); setEditorsCount(modifyWork.openCommEditorsCount); setDeclineIdleId(modifyWork.declineIdleId); setEditSeverityId(modifyWork.editSeverityId)
          } else  if (!modifyOpenCommunityEntryId && workSummaries && workSummaries.length > 0 && !chosenWork.workId) {
              let firstWork = workSummaries[0]
              handleWorkChoice(firstWork.workId)
          }
      
  }, [])

  const handleAlertClose = () => {
    return setIsShowingModal_saved(false)
    

  }
  const handleAlertOpen = () => {
    return setIsShowingModal_saved(true)
    

  }
  const handleEditTranslateMessageClose = () => {
    return setIsShowingModal_editTranslate(false)
    

  }
  const handleEditTranslateMessageOpen = () => {
    return setIsShowingModal_editTranslate(true)
    

  const {personId, workOptions, declineIdleOptions, genreOptions, languageOptions, editorsCountOptions, workSummaries, editSeverityOptions,
                  modifyOpenCommunityEntryId, updateFilterByField_work, updateFilterDefaultFlag_work, clearFilters_work,
                  saveNewSavedSearch_work, updateSavedSearch_work, deleteSavedSearch_work, chooseSavedSearch_work, workFilterScratch,
                  savedWorkFilterIdCurrent, workFilterOptions, } = props
        
  
        return (
          <div className={styles.container}>
              <Accordion noShowExpandAll={true}>
                  <AccordionItem expanded={false} filterScratch={workFilterScratch} filterOptions={workFilterOptions} savedFilterIdCurrent={savedWorkFilterIdCurrent}
                          updateSavedSearch={updateSavedSearch_work} deleteSavedSearch={deleteSavedSearch_work} chooseSavedSearch={chooseSavedSearch_work}
                          updateFilterByField={updateFilterByField_work} updateFilterDefaultFlag={updateFilterDefaultFlag_work} personId={personId}
                          clearFilters={clearFilters_work}>
                      <WorkFilter personId={personId} workFilter={workFilterScratch} className={styles.workFilter}
                          updateFilterByField={updateFilterByField_work} hideSourceStatus={true}
                          clearFilters={clearFilters_work} saveNewSavedSearch={saveNewSavedSearch_work} savedSearchOptions={workFilterOptions}/>
                  </AccordionItem>
              </Accordion>
              <div className={styles.marginLeft}>
              {(!workOptions || workOptions.length === 0) &&
                  <div>
                      <hr />
                      <Link to={'/workAddNew'} className={styles.newWork}><L p={p} t={`Add new document`}/></Link>
                      <hr />
                  </div>
              }
              {!modifyOpenCommunityEntryId &&
                  <div>
                      <SelectSingleDropDown
                          value={chosenWork && chosenWork.workId ? chosenWork.workId : workSummaries && workSummaries.length > 0 && workSummaries[0].workId}
                          options={workOptions && workOptions.length > 0 ? workOptions : [{id: 0, label:'no entries'}]}
                          error={''}
                          label={<L p={p} t={`Documents`}/>}
                          id={'Documents'}
                          height={`medium`}
                          noBlank={true}
                          labelClass={styles.selectLabelClass}
                          selectClass={styles.selectListClass}
                          onChange={(event) => handleWorkChoice(event.target.value)} />
                      <span className={styles.errorMessage}>{errorNoEntries}</span>
                  </div>
              }
              {modifyOpenCommunityEntryId ?
                  <div className={styles.stackedText}>
                      <span className={styles.nativeLanguage}><L p={p} t={`Modify Open Community Entry`}/></span>
                      <span className={styles.textBig}>{chosenWork.title}</span>
                  </div>
                  : ''
              }
              {workOptions && workOptions.length > 0 &&
                  <div>
                      <div className={styles.row}>
                          <div className={styles.stackedText}>
                              <span className={styles.nativeLanguage}><L p={p} t={`Native Language`}/></span>
                              <span className={styles.textBig}>{nativeLanguageName}</span>
                          </div>
                          <div className={styles.checkbox}>
                              <Checkbox
                                  id={`editNativeLanguage`}
                                  label={<L p={p} t={`Edit in the native language`}/>}
                                  labelClass={styles.labelCheckbox}
                                  position={`before`}
                                  checked={editNativeLanguage}
                                  onClick={() => handleEditNativeLanguage(!editNativeLanguage)} />
                          </div>
                      </div>
                      <hr/>
                      {chosenWork.sectionCount > 1 &&
                          <div className={styles.multiSelect}>
                              <MultiSelect
                                  options={chapterOptions && chapterOptions.length > 0 ? chapterOptions : [{value: 0, label:'Please choose a document'}]}
                                  onSelectedChanged={handleSelectedChapters}
                                  valueRenderer={chapterValueRenderer}
                                  selected={selectedChapters}/>
                              <span className={styles.errorMessage}>{errorChapters}</span>
                          </div>
                      }
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={languageOptions && languageOptions.length > 0 ? languageOptions : [{value: 0, label:'no entries'}]}
                              onSelectedChanged={handleSelectedLanguages}
                              valueRenderer={languageValueRenderer}
                              selected={selectedLanguages}/>
                      </div>
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={genreOptions && genreOptions.length > 0 ? genreOptions : [{value: 0, label:'no entries'}]}
                              onSelectedChanged={handleSelectedGenres}
                              valueRenderer={genreValueRenderer}
                              selected={selectedGenres}/>
                          <span className={styles.errorMessage}>{errorGenres}</span>
                      </div>
                      <hr/>
                      <div>
                          <SelectSingleDropDown
                              value={editorsCount}
                              options={editorsCountOptions}
                              error={''}
                              label={<L p={p} t={`Allow Quantity of Editors`}/>}
                              height={`short`}
                              noBlank={true}
                              labelClass={styles.selectLabelClass}
                              selectClass={styles.selectListClass}
                              onChange={handleEditorsCount} />
                      </div>
                      <div>
                          <div className={styles.dateRow}>
                              <span className={styles.textAbove}>Due date</span>
                              <DateTimePicker id={`dueDateFrom`} value={dueDate} onChange={(event) => handleDueDateChange(event.target.value)}/>
                              <span className={styles.errorMessage}>{errorDueDate}</span>
                          </div>
                      </div>
                      <div>
                          <SelectSingleDropDown
                              value={declineIdleId}
                              options={declineIdleOptions && declineIdleOptions.length > 0 ? declineIdleOptions : [{id: 0, label:'no entries'}]}
                              label={<L p={p} t={`Decline Idle Editors In`}/>}
                              height={`medium`}
                              noBlank={true}
                              labelClass={styles.selectLabelClass}
                              selectClass={styles.selectListClass}
                              onChange={handleDeclineIdle} />
                      </div>
                      <div className={styles.extraMarginTop}>
                          <SelectSingleDropDown
                              value={editSeverityId}
                              options={editSeverityOptions && editSeverityOptions.length > 0 ? editSeverityOptions : [{id: 0, label:'no entries'}]}
                              label={<L p={p} t={`Level of Edit Intensity (native language editing only)`}/>}
                              height={`medium`}
                              noBlank={true}
                              labelClass={styles.selectLabelClass}
                              selectClass={styles.selectListClass}
                              onChange={handleEditSeverity} />
                      </div>
                      <div className={styles.buttonPlace}>
                          <a onClick={processForm} className={styles.submitButton}>
                              <L p={p} t={`Submit`}/>
                          </a>
                      </div>
                  </div>
              }
              {isShowingModal_saved &&
                  <MessageModal handleClose={handleAlertClose} heading={<L p={p} t={`New Record Saved`}/>}
                      explainJSX={<L p={p} t={`The new Open Community entry has been saved.  It can now be seen by editors and translators so that they can volunteer to edit or translate for you.`}/>}
                      onClick={handleAlertClose}/>
               }
               {isShowingModal_editTranslate &&
                   <MessageModal handleClose={handleEditTranslateMessageClose} heading={<L p={p} t={`Edit and Translate Error!`}/>}
                       explainJSX={<L p={p} t={`It is not recommended that you request editors for both editing and translating.  The editing process should be complete before translation is started.`}/>}
                       onClick={handleEditTranslateMessageClose}/>
                }
                </div>
          </div>
        )
}
}
export default OpenCommunityToSubmit
