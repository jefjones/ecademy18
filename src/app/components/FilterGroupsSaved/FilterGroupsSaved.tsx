
import * as styles from './FilterGroupsSaved.css'
import classes from 'classnames'
import SelectSingleDropDown from '../SelectSingleDropDown'
import InputText from '../InputText'
const p = 'component'
import L from '../../components/PageLanguage'

function FilterGroupsSaved(props) {
  const {label, filterGroups, filterGroupSavedId, filterGroupName, dataRh=null, setFilterGroup, saveOrUpdateGroup, hasFilterChosen,
                  changeNewSavedGroupName, deleteSavedGroup, resetFilters, handleEnterKeySaveGroupName } = props
  
          return (
      				<div data-rh={dataRh}>
                  {filterGroups && filterGroups.length > 0 &&
                      <div className={classes(styles.row, styles.moreleft)}>
                          <div>
                              <SelectSingleDropDown
                                  id={`filterGroupSavedId`}
                                  label={label ? label : <L p={p} t={`Saved Groups`}/>}
                                  value={filterGroupSavedId || ''}
                                  options={filterGroups}
                                  className={styles.moreBottomMargin}
                                  height={`medium`}
                                  onChange={setFilterGroup}/>
                          </div>
                          <a onClick={filterGroupSavedId ? (event) => saveOrUpdateGroup(event, true) : () => {}} className={filterGroupSavedId ? styles.enabledText : styles.disabledText}><L p={p} t={`update`}/></a>
                          <a onClick={filterGroupSavedId ? deleteSavedGroup : () => {}} className={filterGroupSavedId ? styles.enabledText : styles.disabledText}><L p={p} t={`delete`}/></a>
                          <div className={classes(styles.moreLeft, styles.link, styles.red)} onClick={resetFilters}>
                              <L p={p} t={`reset filters`}/>
                          </div>
                      </div>
                  }
                  {hasFilterChosen() &&
                      <div className={classes(styles.row, styles.moreleft)}>
                          <InputText
                              id={`filterGroupName`}
                              size={"medium-long"}
                              label={<L p={p} t={`Save New Group`}/>}
                              value={filterGroupName || ''}
                              onChange={changeNewSavedGroupName}
                              onEnterKey={handleEnterKeySaveGroupName}/>
                          <a onClick={filterGroupName ? (event) => saveOrUpdateGroup(event, false) : () => {}} className={filterGroupName ? styles.enabledText : styles.disabledText}><L p={p} t={`save`}/></a>
                      </div>
                  }
      				</div>
          )
}

export default FilterGroupsSaved
