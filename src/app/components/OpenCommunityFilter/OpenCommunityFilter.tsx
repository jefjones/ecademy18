import { useEffect, useState } from 'react'
import styles from './OpenCommunityFilter.css'
import classes from 'classnames'
import DateTimePicker from '../DateTimePicker'
import MultiSelect from '../MultiSelect'
import SelectSingleDropDown from '../SelectSingleDropDown'
import InputText from '../InputText'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

//The open community filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the openCommunityFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
//  or to name the current search.  However, that means that a "scratch" record needs to be kept at all times.  We'll keep track of that
//  with a flag called ScratchFlag. That record will probably never have a name associated with it and it won't be included in the savedSearch
//  list.  When a record is chosen, however, it will be overwritten so that that Scratch record can be used to update an existing savedSearch
//  but keep that original savedSearch in tact until the user wants to update criteria, rename it or even delete it.
//The savedSearch list will be kept track of locally.
//There is the option for one of the savedSearch-es to be the default search when the page comes up for the first time.
function OpenCommunityFilter(props) {
  const [savedSearchName, setSavedSearchName] = useState('')
  const [errorSearchName, setErrorSearchName] = useState('')
  const [checkedDefault, setCheckedDefault] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [savedFilterIdCurrent, setSavedFilterIdCurrent] = useState(0)
  const [selectedNativeLanguageIds, setSelectedNativeLanguageIds] = useState([])
  const [selectedTranslateLanguageIds, setSelectedTranslateLanguageIds] = useState([])
  const [selectedGenreIds, setSelectedGenreIds] = useState([])
  const [selectedEditSeverityIds, setSelectedEditSeverityIds] = useState([])
  const [p, setP] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          const {openCommunityFilter} = props
          
    
          document.getElementById('searchText').value = props.openCommunityFilter.searchText
          if (savedFilterIdCurrent !== openCommunityFilter.savedFilterIdCurrent) {
              setSavedFilterIdCurrent(openCommunityFilter.savedFilterIdCurrent); setSelectedNativeLanguageIds(openCommunityFilter.nativeLanguageIds); setSelectedTranslateLanguageIds(openCommunityFilter.translateLanguageIds); setSelectedGenreIds(openCommunityFilter.genreIds); setSelectedEditSeverityIds(openCommunityFilter.editSeverityIds)
          }
      
  }, [])

  let orderByOptions = [
          {
              label: "Due date",
              id: "chapterDueDate"
          },
          {
              label: "Title",
              id: "title"
          },
          {
              label: "Modified Most Recently",
              id: "lastUpdate"
          },
          {
              label: "Project",
              id: "project"
          },
      ]
      let orderSortOptions = [
          {
              label: "Ascending",
              id: "asc"
          },
          {
              label: "Descending",
              id: "desc"
          },
      ]
  
      const {openCommunityFilter, updateFilterByField, editSeverityOptions, wordCountOptions, genreOptions, languageOptions} = props
      
  
      return (
          <div className={styles.container}>
              <div>
                  <div className={styles.row}>
                      <span className={styles.textSave}><L p={p} t={`Save search`}/></span>
                      <InputText
                          size={"medium"}
                          name={"name"}
                          value={savedSearchName ? savedSearchName : ''}
                          onChange={handleSearchNameChange}
                          onEnterKey={handleSaveSearchEnterKey}
                          error={errorSearchName} />
                      <a onClick={handleSearchNameSubmit} className={styles.linkStyle}>
                          <Icon pathName={`plus`} className={styles.image}/>
                      </a>
                      <a onClick={handleClearFilter} className={classes(styles.linkStyle, styles.marginLeft)}>
                          <Icon pathName={`document_refresh`} className={styles.image}/>
                      </a>
                  </div>
                  <hr/>
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          options={languageOptions}
                          onSelectedChanged={handleNativeLanguageSelected}
                          getJustCollapsed={getJustCollapsed_nativeLanguage}
                          valueRenderer={nativeLanguageValueRenderer}
                          selected={selectedNativeLanguageIds}/>
                  </div>
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          options={languageOptions}
                          onSelectedChanged={handleTranslateLanguageSelected}
                          getJustCollapsed={getJustCollapsed_translateLanguage}
                          valueRenderer={translateLanguageValueRenderer}
                          selected={selectedTranslateLanguageIds}/>
                  </div>
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          options={genreOptions}
                          onSelectedChanged={handleGenreSelected}
                          getJustCollapsed={getJustCollapsed_genre}
                          valueRenderer={genreValueRenderer}
                          selected={selectedGenreIds}/>
                  </div>
                  <hr />
                  <div className={styles.row}>
                      <span className={styles.text}><L p={p} t={`Due date`}/></span>
                      <div>
                          <div className={styles.dateRow}>
                              <span className={styles.text}><L p={p} t={`from:`}/></span>
                              <DateTimePicker id={`dueDateFrom`} value={openCommunityFilter.dueDateFrom}
                                  onChange={(event) => updateFilterByField(openCommunityFilter.personId, "dueDateFrom", event.target.value)}/>
                          </div>
                          <div className={styles.dateRow}>
                              <span className={styles.text}><L p={p} t={`to:`}/></span>
                              <DateTimePicker id={`dueDateTo`} value={openCommunityFilter.dueDateTo} minDate={openCommunityFilter.dueDateFrom ? openCommunityFilter.dueDateFrom : ''}
                                  onChange={(event) => updateFilterByField(openCommunityFilter.personId, "dueDateTo", event.target.value)}/>
                          </div>
                      </div>
                  </div>
                  <hr className={styles.divider}/>
                  <div className={styles.row}>
                      <span className={styles.text}><L p={p} t={`Word Count`}/></span>
                      <div className={styles.row}>
                          <div className={styles.dateRow}>
                              <SelectSingleDropDown
                                  value={openCommunityFilter.wordCountFrom ? openCommunityFilter.wordCountFrom : ''}
                                  options={wordCountOptions}
                                  error={''}
                                  label={<L p={p} t={`From`}/>}
                                  height={`short`}
                                  noBlank={true}
                                  labelClass={styles.text}
                                  selectClass={styles.selectListClass}
                                  onChange={(event) => updateFilterByField(openCommunityFilter.personId, "wordCountFrom", event.target.value)} />
                          </div>
                          <div className={classes(styles.dateRow, styles.leftMargin)}>
                              <SelectSingleDropDown
                                  value={openCommunityFilter.wordCountTo ? openCommunityFilter.wordCountTo : ''}
                                  options={wordCountOptions}
                                  error={''}
                                  label={<L p={p} t={`To`}/>}
                                  height={`short`}
                                  noBlank={true}
                                  labelClass={styles.text}
                                  selectClass={styles.selectListClass}
                                  onChange={(event) => updateFilterByField(openCommunityFilter.personId, "wordCountTo", event.target.value)} />
                          </div>
                      </div>
                  </div>
                  <hr className={styles.divider}/>
                  <div className={styles.row}>
                      <span className={styles.textSave}><L p={p} t={`Search title`}/></span>
                      <InputText
                          size={"medium"}
                          name={"searchText"}
                          value={searchText ? searchText : ''}
                          onChange={handleSearchTextChange}
                          inputClassName={styles.inputClassName}
                          onEnterKey={handleSearchTitleEnterKey}
                          labelClass={styles.labelClass} />
                      <a onClick={handleSearchTextSubmit} className={styles.linkStyle}>
                          <Icon pathName={`checkmark`} className={styles.image}/>
                      </a>
                  </div>
                  <hr className={styles.divider}/>
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          options={editSeverityOptions}
                          onSelectedChanged={handleEditSeveritySelected}
                          getJustCollapsed={getJustCollapsed_editSeverity}
                          valueRenderer={editSeverityValueRenderer}
                          selected={selectedEditSeverityIds}/>
                  </div>
                  <hr className={styles.divider}/>
                  <div className={styles.row}>
                      <div>
                          <SelectSingleDropDown
                              value={openCommunityFilter.orderByChosen ? openCommunityFilter.orderByChosen : ''}
                              options={orderByOptions}
                              label={<L p={p} t={`Order by`}/>}
                              error={''}
                              height={`medium`}
                              noBlank={true}
                              className={styles.singleDropDown}
                              onChange={(event) => updateFilterByField(openCommunityFilter.personId, "orderByChosen", event.target.value)} />
                      </div>
                      <div>
                          <SelectSingleDropDown
                              value={openCommunityFilter.orderSortChosen ? openCommunityFilter.orderSortChosen : ''}
                              options={orderSortOptions}
                              label={<L p={p} t={`Sort direction`}/>}
                              error={''}
                              noBlank={true}
                              height={`medium`}
                              className={styles.singleDropDown}
                              onChange={(event) => updateFilterByField(openCommunityFilter.personId, "orderSortChosen", event.target.value)} />
                      </div>
                  </div>
              </div>
          </div>
      )
}
export default OpenCommunityFilter
