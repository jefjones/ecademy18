import { useEffect, useState } from 'react'
import * as styles from './ContactFilter.css'
import RadioGroup from '../RadioGroup'
import DateTimePicker from '../DateTimePicker'
import SelectSingleDropDown from '../SelectSingleDropDown'
import InputText from '../InputText'
import Icon from '../Icon'
import classes from 'classnames'

//The contact filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the contactFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
//  or to name the current search.  However, that means that a "scratch" record needs to be kept at all times.  We'll keep track of that
//  with a flag called ScratchFlag. That record will probably never have a name associated with it and it won't be included in the savedSearch
//  list.  When a record is chosen, however, it will be overwritten so that that Scratch record can be used to update an existing savedSearch
//  but keep that original savedSearch in tact until the user wants to update criteria, rename it or even delete it.
//The savedSearch list will be kept track of locally.
//There is the option for one of the savedSearch-es to be the default search when the page comes up for the first time.
function ContactFilter(props) {
  const [savedSearchName, setSavedSearchName] = useState('')
  const [errorSearchName, setErrorSearchName] = useState('')
  const [checkedDefault, setCheckedDefault] = useState(false)
  const [searchText, setSearchText] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          document.getElementById('searchText').value = props.contactFilter.searchText
      
  }, [])

  let sourceOptions = [
          {
              label: "All",
              id: "all"
          },
          {
              label: "Editors",
              id: "editors"
          },
          {
              label: "Not Assigned",
              id: "notAssigned"
          },
      ]
      let statusOptions = [
          {
              label: "All",
              id: "all"
          },
          {
              label: "Active",
              id: "active"
          },
          {
              label: "Completed",
              id: "completed"
          },
      ]
      let orderByOptions = [
          {
              label: "Due date",
              id: "chapterDueDate"
          },
          {
              label: "Modified Most Recently",
              id: "lastUpdate"
          },
  				{
              label: "First Name",
              id: "firstName"
          },
          {
              label: "Project",
              id: "project"
          },
  				{
              label: "Title",
              id: "title"
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
  
      const {contactFilter, updateFilterByField, clearFilters} = props
      
      const cf = contactFilter
  
      return (
          <div className={styles.container}>
              <div>
                  <div className={styles.row}>
                      <span className={styles.textSave}>Save search</span>
                      <InputText
                          size={"medium"}
                          name={"name"}
                          value={savedSearchName}
                          onChange={handleSearchNameChange}
                          onEnterKey={handleSaveSearchEnterKey}
                          inputClassName={styles.inputClassName}
                          labelClass={styles.labelClass}
                          error={errorSearchName} />
                      <a onClick={handleSearchNameSubmit} className={styles.linkStyle}>
                          <Icon pathName={`plus`} className={styles.image}/>
                      </a>
                      <a onClick={() => clearFilters(cf.personId)} className={classes(styles.linkStyle, styles.marginLeft)}>
                          <Icon pathName={`document_refresh`} className={styles.image}/>
                      </a>
                  </div>
                  <hr/>
                  <div className={styles.row}>
                      <span className={styles.text}>Owner-type</span>
                      <RadioGroup data={sourceOptions} name={`sourceFilter`} horizontal={true}
                          className={styles.radio}
                          labelClass={styles.radioLabels} radioClass={styles.radioClass}
                          initialValue={cf.sourceChosen ? cf.sourceChosen : ''} onClick={(event) => handleOwnerType(event)} personId={cf.personId}/>
                  </div>
                  <hr />
                  <div className={styles.row}>
                      <span className={styles.text}>Status</span>
                      <RadioGroup data={statusOptions} name={`statusFilter`} horizontal={true}
                          className={styles.radio}
                          labelClass={styles.radioLabels} radioClass={styles.radioClass}
                          initialValue={cf.statusChosen ? cf.statusChosen : ''} onClick={(event) => handleStatus(event)} personId={cf.personId}/>
                  </div>
                  <hr/>
                  <div className={styles.row}>
                      <span className={styles.text}>Due date</span>
                      <div>
                          <div className={styles.dateRow}>
                              <span className={styles.text}>from:</span>
                              <DateTimePicker id={`dueDateFrom`} value={cf.dueDateFrom}
                                  onChange={(event) => updateFilterByField(cf.personId, "dueDateFrom", event.target.value)}/>
                          </div>
                          <div className={styles.dateRow}>
                              <span className={styles.text}>to:</span>
                              <DateTimePicker id={`dueDateTo`} value={cf.dueDateTo} minDate={cf.dueDateFrom ? cf.dueDateFrom : ''}
                                  onChange={(event) => updateFilterByField(cf.personId, "dueDateTo", event.target.value)}/>
                          </div>
                      </div>
                  </div>
                  <hr className={styles.divider}/>
                  <div className={styles.row}>
                      <span className={styles.textSave}>Search name</span>
                      <InputText
                          size={"medium"}
                          name={"searchText"}
                          value={searchText}
                          onChange={handleSearchTextChange}
                          onEnterKey={handleSearchNameEnterKey}
                          inputClassName={styles.inputClassName}
                          labelClass={styles.labelClass} />
                      <a onClick={handleSearchTextSubmit} className={styles.linkStyle}>
                          <Icon pathName={`checkmark`} className={styles.image}/>
                      </a>
                  </div>
                  <hr className={styles.divider}/>
                  <div className={styles.row}>
                      <div>
                          <SelectSingleDropDown
                              value={cf.orderByChosen ? cf.orderByChosen : ''}
                              options={orderByOptions}
                              label={`Order by`}
                              error={''}
                              height={`medium`}
                              noBlank={true}
                              className={styles.singleDropDown}
                              onChange={(event) => updateFilterByField(cf.personId, "orderByChosen", event.target.value)} />
                      </div>
                      <div>
                          <SelectSingleDropDown
                              value={cf.orderSortChosen ? cf.orderSortChosen : ''}
                              options={orderSortOptions}
                              label={`Sort direction`}
                              error={''}
                              noBlank={true}
                              height={`medium`}
                              className={styles.singleDropDown}
                              onChange={(event) => updateFilterByField(cf.personId, "orderSortChosen", event.target.value)} />
                      </div>
                  </div>
              </div>
          </div>
      )
}
export default ContactFilter
