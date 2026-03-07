import { useEffect, useState } from 'react'
import * as styles from './MenuSubPopUp.css'
import classes from 'classnames'
import SwitchOnOff from '../SwitchOnOff'
import Checkbox from '../Checkbox'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function MenuSubPopUp(props) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            launchButton.addEventListener("click", handleDisplay)
            closeButton.addEventListener("click", handleClosed)
        
    return () => {
      
              //Don't persist the personConfig values if the keep checkboxes are not checked
              const {personConfig, updatePersonConfig, personId, keepHistoryOn, keepAutoNextOn, keepEditDifferenceOn} = props
      
              if (personConfig.historySentenceView && !keepHistoryOn) {
                  updatePersonConfig(personId, `HistorySentenceView`, false)
              }
              if (personConfig.nextSentenceAuto && !keepAutoNextOn) {
                  updatePersonConfig(personId, `NextSentenceAuto`, false)
              }
              if (personConfig.editDifferenceView && !keepEditDifferenceOn) {
                  updatePersonConfig(personId, `EditDifferenceView`, false)
              }
          
    }
  }, [])

  let {personId, updatePersonConfig, personConfig, toggleKeepHistoryOn, toggleKeepAutoNextOn, toggleKeepEditDifferenceOn,
              keepHistoryOn, keepAutoNextOn, keepEditDifferenceOn } = props
          
  
          return (
              <div className={styles.container}>
                  <div className={styles.launchButton} ref={(ref) => (launchButton = ref)}>
                      <Icon pathName={`gearSettings`} className={styles.subMenuIcon}/>
                  </div>
                  <div className={classes(styles.children, (opened && styles.opened))}>
                      <div className={styles.switch}>
                          <SwitchOnOff value={personConfig.historySentenceView} onChange={() => updatePersonConfig(personId, `HistorySentenceView`, !personConfig.historySentenceView)}/>
                          <span className={styles.labelSwitch} onClick={() => updatePersonConfig(personId, `HistorySentenceView`, !personConfig.historySentenceView)}><L p={p} t={`View sentence history`}/></span>
                      </div>
                      <Checkbox
                          id={`historySentenceView`}
                          label={<L p={p} t={`Keep this setting`}/>}
                          labelClass={styles.labelCheckbox}
                          position={`after`}
                          disabled={!personConfig.historySentenceView}
                          checked={keepHistoryOn}
                          onClick={toggleKeepHistoryOn}
                          checkboxClass={styles.checkbox} />
                      <div className={styles.switch}>
                          <SwitchOnOff value={personConfig.nextSentenceAuto} onChange={() => updatePersonConfig(personId, `NextSentenceAuto`, !personConfig.nextSentenceAuto)}/>
                          <span className={styles.labelSwitch} onClick={() => updatePersonConfig(personId, `NextSentenceAuto`, !personConfig.nextSentenceAuto)}><L p={p} t={`Go to next sentence on save and stay`}/></span>
                      </div>
                      <Checkbox
                          id={`nextSentenceAuto`}
                          label={<L p={p} t={`Keep this setting`}/>}
                          labelClass={styles.labelCheckbox}
                          position={`after`}
                          disabled={!personConfig.nextSentenceAuto}
                          checked={keepAutoNextOn}
                          onClick={toggleKeepAutoNextOn}
                          checkboxClass={styles.checkbox} />
                      <div className={styles.switch}>
                          <SwitchOnOff value={personConfig.editDifferenceView} onChange={() => updatePersonConfig(personId, `EditDifferenceView`, !personConfig.editDifferenceView)}/>
                          <span className={styles.labelSwitch} onClick={() => updatePersonConfig(personId, `EditDifferenceView`, !personConfig.editDifferenceView)}><L p={p} t={`Show edit differences`}/></span>
                      </div>
                      <Checkbox
                          id={`editDifferenceView`}
                          label={<L p={p} t={`Keep this setting`}/>}
                          labelClass={styles.labelCheckbox}
                          position={`after`}
                          disabled={!personConfig.editDifferenceView}
                          checked={keepEditDifferenceOn}
                          onClick={toggleKeepEditDifferenceOn}
                          checkboxClass={styles.checkbox} />
                          <a className={styles.closeButton} ref={(ref) => (closeButton = ref)}><L p={p} t={`Close`}/></a>
                  </div>
              </div>
          )
}
export default MenuSubPopUp
