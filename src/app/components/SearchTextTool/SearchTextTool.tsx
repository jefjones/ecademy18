import { useState } from 'react'
import classes from 'classnames'
import * as styles from './SearchTextTool.css'
import InputText from '../InputText/InputText'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function SearchTextTools(props) {
  const [searchText, setSearchText] = useState('')

  let {className="", pointer, totalCount, jumpToSearch, submitSearchText, setEditOptionTools, hideLeftArrow} = props
          
          pointer = pointer ? pointer : 0
          totalCount = totalCount ? totalCount : 0
  
          return (
              <div className={classes(className, styles.container)}>
                  {!hideLeftArrow &&
                      <a className={styles.closeButton} onClick={setEditOptionTools}>
                          <Icon pathName={`left_arrow`} />
                      </a>
                  }
                  <InputText
                      value={searchText}
                      size={"medium"}
                      height={"medium"}
                      noShadow={true}
                      name={"searchText"}
                      onChange={handleTextEntry}
                      placeholder={<L p={p} t={`Search text`}/>}/>
                  <a onClick={() => submitSearchText(searchText)}>
                      <Icon pathName={`checkmark`} className={styles.submitButton}/>
                  </a>
                  <div className={styles.navRow}>
                      <a onClick={() => jumpToSearch('NEXT')}>
                          <Icon pathName={`arrow_down`} className={styles.downArrow} />
                      </a>
                      <span className={styles.counts}>
                          <L p={p} t={`${pointer} of ${totalCount}`}/>
                      </span>
                      <a onClick={() => jumpToSearch('PREV')}>
                          <Icon pathName={`arrow_up`} className={styles.upArrow} />
                      </a>
                  </div>
              </div>
          )
}
export default SearchTextTools
