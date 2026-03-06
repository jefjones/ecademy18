
import styles from './EditListNavigator.css'
import Icon from '../Icon'

function EditListNavigator(props) {
  const {editDetailId_chosen, editListOptions, handlePointerMove, idName} = props
          return (
              <div className={styles.navRow}>
                  <a onClick={() => handlePointerMove('NEXT', idName, editListOptions)}>
                      <Icon pathName={`arrow_down`} className={styles.downArrow} />
                  </a>
                  <select id={idName}
                          value={editDetailId_chosen || ''}
                          height={`medium-short`}
                          className={styles.singleDropDown}
                          onChange={handleEditChosen} >
                      {editListOptions && editListOptions.length > 0 &&
                          editListOptions.map((option, index) => <option key={index} value={option.id}>{option.label}</option>)
                      }
                  </select>
                  <a onClick={() => handlePointerMove('PREV', idName, editListOptions)}>
                      <Icon pathName={`arrow_up`} className={styles.upArrow} />
                  </a>
              </div>
          )
}
export default EditListNavigator
