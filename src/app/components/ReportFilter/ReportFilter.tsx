import { useEffect, useState } from 'react'
import * as styles from './ReportFilter.css'
//import DateTimePicker from '../DateTimePicker';
import MultiSelect from '../MultiSelect'
import SelectSingleDropDown from '../SelectSingleDropDown'
import RadioGroup from '../RadioGroup'
import InputText from '../InputText'
import Icon from '../Icon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

//The repoir filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the reportFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
//  or to name the current search.  However, that means that a "scratch" record needs to be kept at all times.  We'll keep track of that
//  with a flag called ScratchFlag. That record will probably never have a name associated with it and it won't be included in the savedSearch
//  list.  When a record is chosen, however, it will be overwritten so that that Scratch record can be used to update an existing savedSearch
//  but keep that original savedSearch in tact until the user wants to update criteria, rename it or even delete it.
//The savedSearch list will be kept track of locally.
//There is the option for one of the savedSearch-es to be the default search when the page comes up for the first time.
function ReportFilter(props) {
  const [savedSearchName, setSavedSearchName] = useState('')
  const [errorSearchName, setErrorSearchName] = useState('')
  const [checkedDefault, setCheckedDefault] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [savedFilterIdCurrent, setSavedFilterIdCurrent] = useState(0)
  const [groupChosen, setGroupChosen] = useState('')
  const [selectedWorkIds, setSelectedWorkIds] = useState([])
  const [selectedNativeLanguageIds, setSelectedNativeLanguageIds] = useState([])
  const [selectedTranslateLanguageIds, setSelectedTranslateLanguageIds] = useState([])
  const [selectedEditorIds, setSelectedEditorIds] = useState([])
  const [selectedSectionIds, setSelectedSectionIds] = useState([])
  const [p, setP] = useState(undefined)
  const [incomingParams, setIncomingParams] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          const {reportFilter} = props
          
    
          document.getElementById('searchText').value = props.reportFilter.searchText
          if (savedFilterIdCurrent !== reportFilter.savedFilterIdCurrent || props.incomingParams !== incomingParams) {
              setSavedFilterIdCurrent(reportFilter.savedFilterIdCurrent); setSelectedWorkIds(reportFilter.workIds); setSelectedNativeLanguageIds(reportFilter.nativeLanguageIds); setSelectedTranslateLanguageIds(reportFilter.translateLanguageIds); setSelectedEditorIds(reportFilter.editorIds); setSelectedSectionIds(reportFilter.sectionIds); setIncomingParams(props.incomingParams)
          }
      
  }, [])

  const sendBackRerouteReport = (selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds) => {
    
          const {handleRerouteReport} = props
          handleRerouteReport(selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds)
      
  }

  const handleClearFilter = () => {
    
          const {reportFilter, clearFilters} = props
          setSelectedWorkIds([]); setSelectedNativeLanguageIds([]); setSelectedTranslateLanguageIds([]); setSelectedEditorIds([]); setSelectedSectionIds([])
          clearFilters(reportFilter.personId)
      
  }

  const avoidDupicateSearchName = () => {
    
          
          const {savedSearchOptions} = props
          let noDuplicate = true
    
          if (!savedSearchName) return true
    
          savedSearchOptions && savedSearchOptions.length > 0 && savedSearchOptions.forEach(m => {
              if (m.label.toLowerCase() === savedSearchName.toLowerCase()) {
                  noDuplicate = false
                  setErrorSearchName(<L p={p} t={`Duplicate name.`}/>)
              }
          })
          return noDuplicate
      
  }

  const handleSearchTitleEnterKey = (event) => {
    
          event.key === "Enter" && handleSearchTextSubmit()
      
  }

  const handleSaveSearchEnterKey = (event) => {
    
          if (event.key === "Enter" && avoidDupicateSearchName()) {
              handleSearchNameSubmit()
          }
      
  }

  const handleGroupSelected = (event) => {
    
          setGroupChosen(event.target.value)
      
  }

  const handleWorkSelected = (selectedWorkIds) => {
    
          const {updateFilterByField, personId} = props
          
          setSelectedWorkIds(selectedWorkIds)
          updateFilterByField(personId, "workIds", selectedWorkIds)
          sendBackRerouteReport(selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds)
      
  }

  const handleNativeLanguageSelected = (selectedNativeLanguageIds) => {
    
          const {updateFilterByField, personId} = props
          setSelectedNativeLanguageIds(selectedNativeLanguageIds)
          updateFilterByField(personId, "nativeLanguageIds", selectedNativeLanguageIds)
      
  }

  const handleTranslateLanguageSelected = (selectedTranslateLanguageIds) => {
    
          const {updateFilterByField, personId} = props
          setSelectedTranslateLanguageIds(selectedTranslateLanguageIds)
          updateFilterByField(personId, "translateLanguageIds", selectedTranslateLanguageIds)
      
  }

  const handleEditorSelected = (selectedEditorIds) => {
    
          const {updateFilterByField, personId} = props
          
          setSelectedEditorIds(selectedEditorIds)
          updateFilterByField(personId, "editorIds", selectedEditorIds)
          sendBackRerouteReport(selectedWorkIds, selectedNativeLanguageIds, selectedTranslateLanguageIds, selectedEditorIds, selectedSectionIds)
      
  }

  const handleSectionSelected = (selectedSectionIds) => {
    
          const {updateFilterByField, personId} = props
          setSelectedSectionIds(selectedSectionIds)
          updateFilterByField(personId, "sectionIds", selectedSectionIds)
      
  }

  const getJustCollapsed_work = () => {
    
          const {personId, updateFilterByField} = props
          
          updateFilterByField(personId, "workIds", selectedWorkIds)
      
  }

  const getJustCollapsed_group = () => {
    
          const {personId, updateFilterByField} = props
          
          updateFilterByField(personId, "groupIds", selectedGroupIds)
      
  }

  const getJustCollapsed_nativeLanguage = () => {
    
          const {personId, updateFilterByField} = props
          
          updateFilterByField(personId, "nativeLanguageIds", selectedNativeLanguageIds)
      
  }

  const getJustCollapsed_translateLanguage = () => {
    
          const {personId, updateFilterByField} = props
          
          updateFilterByField(personId, "translateLanguageIds", selectedTranslateLanguageIds)
      
  }

  const getJustCollapsed_editor = () => {
    
          const {personId, updateFilterByField} = props
          
          updateFilterByField(personId, "editorIds", selectedEditorIds)
      
  }

  const getJustCollapsed_section = () => {
    
          const {personId, updateFilterByField} = props
          
          updateFilterByField(personId, "sectionIds", selectedSectionIds)
      
  }

  const handleSearchNameChange = (event) => {
    
          setSavedSearchName(event.target.value); setErrorSearchName('')
      
  }

  const handleSearchTextChange = (event) => {
    
          setSearchText(document.getElementById('searchText').value)
      
  }

  const handleSearchNameSubmit = () => {
    
          
          const {saveNewSavedSearch, personId} = props
    
          if (savedSearchName && avoidDupicateSearchName()) {
              saveNewSavedSearch(personId, savedSearchName)
              setSavedSearchName('')
          } else if (!savedSearchName) {
              setErrorSearchName(<L p={p} t={`Search name is missing.`}/>)
          }
      
  }

  const handleSearchTextSubmit = () => {
    
          
          const {updateFilterByField, personId} = props
    
          updateFilterByField(personId, "searchText", searchText)
      
  }

  const workValueRenderer = (selected, options) => {
    
          if (options.length === 0)
              return <L p={p} t={`No documents match the criteria`}/>
    
          if (selected.length === 0)
              return <L p={p} t={`Select documents...`}/>
    
          // if (selected.length === options.length)
          //     return "All documents are selected";
    
          return <L p={p} t={`Documents:  ${selected.length} of ${options.length}`}/>
      
  }

  const nativeLanguageValueRenderer = (selected, options) => {
    
          if (options.length === 0)
              return <L p={p} t={`No native languages match the criteria`}/>
    
          if (selected.length === 0)
              return <L p={p} t={`Select native language...`}/>
    
          // if (selected.length === options.length)
          //     return "All native languages are selected";
    
          if (selected.length < 5) {
              let comma = ""
              let languageNames = ""
              selected && selected.length > 0 && selected.forEach(value => {
                  languageNames += comma + options.filter(o => o.value === value)[0].label
                  comma = ", "
              })
              languageNames = languageNames === 'en' ? 'English' : languageNames
              if (selected.length === 1) {
                  return <L p={p} t={`Native language:  ${languageNames}`}/>
              } else {
                  return <L p={p} t={`Native languages:  ${languageNames}`}/>
              }
          } else {
              return <L p={p} t={`Native language:  ${selected.length} of ${options.length}`}/>
          }
      
  }

  const translateLanguageValueRenderer = (selected, options) => {
    
          if (options.length === 0)
              return <L p={p} t={`No translate languages match the criteria`}/>
    
          if (selected.length === 0)
              return <L p={p} t={`Select language to translate...`}/>
    
          // if (selected.length === options.length)
          //     return "All languages to translate are selected";
    
          if (selected.length < 5) {
              let comma = ""
              let languageNames = ""
              selected && selected.length > 0 && selected.forEach(value => {
                  languageNames += comma + options.filter(o => o.value === value)[0].label
                  comma = ", "
              })
              languageNames = languageNames === 'en' ? 'English' : languageNames
              if (selected.length === 1) {
                  return <L p={p} t={`Language to translate:  ${languageNames}`}/>
              } else {
                  return <L p={p} t={`Languages to translate:  ${languageNames}`}/>
              }
          } else {
              return <L p={p} t={`Languages to translate:  ${selected.length} of ${options.length}`}/>
          }
      
  }

  const editorValueRenderer = (selected, options) => {
    
          if (options.length === 0)
              return <L p={p} t={`No editors match the criteria`}/>
    
          if (selected.length === 0)
              return <L p={p} t={`Select editors...`}/>
    
          // if (selected.length === options.length)
          //     return "All editors are selected";
    
          return <L p={p} t={`Editors:  ${selected.length} of ${options.length}`}/>
      
  }

  const sectionValueRenderer = (selected, options) => {
    
          if (options.length === 0)
              return <L p={p} t={`No sections/chapters match the criteria`}/>
    
          if (selected.length === 0)
              return <L p={p} t={`Select sections/chapters...`}/>
    
          // if (selected.length === options.length)
          //     return "All sections/chapters are selected";
    
          return <L p={p} t={`Sections/chapters:  ${selected.length} of ${options.length}`}/>
      
  }

  const {workOptions, nativeLanguageOptions, translateLanguageOptions, editorOptions, sectionOptions, personId} = props
      
  
       let groupOptions = [{
           label: 'No group chosen',
           id: 0,
       }]
  
       let EditOrTranslateOptions = [
           {
               label: "Native language edits",
               id: "editNative"
           },
           {
               label: "Language translations",
               id: "translationLanguages"
           },
       ]
  
  
      return (
          <div className={styles.container}>
              <div>
                  <RadioGroup
                      data={EditOrTranslateOptions}
                      name={`sourceFilter`}
                      horizontal={true}
                      className={styles.radio}
                      labelClass={styles.radioLabels}
                      radioClass={styles.radioClass}
                      initialValue={'editNative'}
                      onClick={(event) => handleOwnerType(event)}
                      personId={personId}/>
              </div>
              <hr />
              <div>
                  <div className={styles.multiSelect}>
                      <SelectSingleDropDown
                          id={`groups`}
                          label={<L p={p} t={`Group`}/>}
                          value={groupChosen}
                          options={groupOptions}
                          noBlank={true}
                          height={`medium`}
                          onChange={handleGroupSelected} />
                  </div>
                  {workOptions && workOptions.length > 0 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={workOptions}
                              onSelectedChanged={handleWorkSelected}
                              getJustCollapsed={handleWorkSelected}
                              valueRenderer={workValueRenderer}
                              selected={selectedWorkIds}/>
                      </div>
                  }
                  {nativeLanguageOptions && nativeLanguageOptions.length > 1 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={nativeLanguageOptions}
                              onSelectedChanged={handleNativeLanguageSelected}
                              getJustCollapsed={handleNativeLanguageSelected}
                              valueRenderer={nativeLanguageValueRenderer}
                              selected={selectedNativeLanguageIds}/>
                      </div>
                  }
                  {translateLanguageOptions && translateLanguageOptions.length > 0 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={translateLanguageOptions}
                              onSelectedChanged={handleTranslateLanguageSelected}
                              getJustCollapsed={handleTranslateLanguageSelected}
                              valueRenderer={translateLanguageValueRenderer}
                              selected={selectedTranslateLanguageIds}/>
                      </div>
                  }
                  {editorOptions && editorOptions.length > 0 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={editorOptions}
                              onSelectedChanged={handleEditorSelected}
                              getJustCollapsed={handleEditorSelected}
                              valueRenderer={editorValueRenderer}
                              selected={selectedEditorIds}/>
                      </div>
                  }
                  {sectionOptions && sectionOptions.length > 1 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={sectionOptions}
                              onSelectedChanged={handleSectionSelected}
                              getJustCollapsed={handleSectionSelected}
                              valueRenderer={sectionValueRenderer}
                              selected={selectedSectionIds}/>
                      </div>
                  }
                  <hr className={styles.divider}/>
                  <div className={styles.row}>
                      <span className={styles.textSave}><L p={p} t={`Search title`}/></span>
                      <InputText
                          size={"medium"}
                          name={"searchText"}
                          value={searchText ? searchText : ''}
                          onChange={handleSearchTextChange}
                          inputClassName={styles.inputClassName}
                          onEnterKey={handleSearchTitleEnterKey} />
                      <a onClick={handleSearchTextSubmit} className={styles.linkStyle}>
                          <Icon pathName={`checkmark`} className={styles.image}/>
                      </a>
                  </div>
                  <hr/>
                  <div className={styles.row}>
                      <span className={styles.textSave}><L p={p} t={`Save search`}/></span>
                      <InputText
                          size={"medium"}
                          name={"name"}
                          value={savedSearchName ? savedSearchName : ''}
                          onChange={handleSearchNameChange}
                          inputClassName={styles.inputClassName}
                          onEnterKey={handleSaveSearchEnterKey}
                          labelClass={styles.labelClass}
                          error={errorSearchName} />
                      <a onClick={handleSearchNameSubmit} className={styles.linkStyle}>
                          <Icon pathName={`plus`} className={styles.image}/>
                      </a>
                      <a onClick={handleClearFilter} className={classes(styles.linkStyle, styles.marginLeft)}>
                          <Icon pathName={`document_refresh`} className={styles.image}/>
                      </a>
                  </div>
              </div>
          </div>
      )
}
export default ReportFilter
