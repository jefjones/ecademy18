import * as styles from './ConfigModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import SwitchOnOff from '../SwitchOnOff'
import Checkbox from '../Checkbox'
import tapOrClick from 'react-tap-or-click'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({personId, updatePersonConfig, personConfig, handleClose, className, isTranslation}) => {
    return (
        <div className={classes(styles.container, className)}>
            <ModalContainer onClose={handleClose}>
                <ModalDialog onClose={handleClose}>
                    <br />
                    <div>
                      {isTranslation &&
                          <div className={styles.switch}>
                              <SwitchOnOff value={personConfig.translateInsertSuggestion} onChange={() => updatePersonConfig(personId, `TranslateInsertSuggestion`, !personConfig.translateInsertSuggestion)}/>
                              <span className={styles.labelSwitch} {...tapOrClick(() => updatePersonConfig(personId, `TranslateInsertSuggestion`, !personConfig.translateInsertSuggestion))}><L p={p} t={`Always insert the translation suggestion`}/></span>
                          </div>
                      }
                      {isTranslation &&
                          <Checkbox
                              id={`translateInsertSuggestion`}
                              label={<L p={p} t={`Keep this setting for later`}/>}
                              labelClass={styles.labelCheckbox}
                              position={`after`}
                              disabled={!personConfig.translateInsertSuggestion}
                              checked={personConfig.translateInsertSuggestionKeepOn}
                              {...tapOrClick(() => updatePersonConfig(personId, `TranslateInsertSuggestion`, !personConfig.translateInsertSuggestionKeepOn))}
                              checkboxClass={styles.checkbox} />
                      }
                        <div className={styles.switch}>
                            <SwitchOnOff value={personConfig.historySentenceView} onChange={() => updatePersonConfig(personId, `HistorySentenceView`, !personConfig.historySentenceView)}/>
                            <span className={styles.labelSwitch} {...tapOrClick(() => updatePersonConfig(personId, `HistorySentenceView`, !personConfig.historySentenceView))}><L p={p} t={`View sentence history`}/></span>
                        </div>
                        <Checkbox
                            id={`historySentenceView`}
                            label={<L p={p} t={`Keep this setting for later`}/>}
                            labelClass={styles.labelCheckbox}
                            position={`after`}
                            disabled={!personConfig.historySentenceView}
                            checked={personConfig.historySentenceViewKeepOn}
                            {...tapOrClick(() => updatePersonConfig(personId, `HistorySentenceViewKeepOn`, !personConfig.historySentenceViewKeepOn))}
                            checkboxClass={styles.checkbox} />
                        {!isTranslation &&
                            <div className={styles.switch}>
                                <SwitchOnOff value={isTranslation || personConfig.nextSentenceAuto} onChange={() => updatePersonConfig(personId, `NextSentenceAuto`, isTranslation ? isTranslation : !personConfig.nextSentenceAuto)}/>
                                <span className={styles.labelSwitch} {...tapOrClick(() => updatePersonConfig(personId, `NextSentenceAuto`, !personConfig.nextSentenceAuto))}><L p={p} t={`Go to next sentence on save and stay`}/></span>
                            </div>
                        }
                        {!isTranslation &&
                            <Checkbox
                                id={`nextSentenceAuto`}
                                label={<L p={p} t={`Keep this setting for later`}/>}
                                labelClass={styles.labelCheckbox}
                                position={`after`}
                                disabled={!personConfig.nextSentenceAuto}
                                checked={personConfig.nextSentenceAutoKeepOn}
                                {...tapOrClick(() => updatePersonConfig(personId, `NextSentenceAutoKeepOn`, !personConfig.nextSentenceAutoKeepOn))}
                                checkboxClass={styles.checkbox} />
                        }
                        <div className={styles.switch}>
                            <SwitchOnOff value={personConfig.editDifferenceView} onChange={() => updatePersonConfig(personId, `EditDifferenceView`, !personConfig.editDifferenceView)}/>
                            <span className={styles.labelSwitch} {...tapOrClick(() => updatePersonConfig(personId, `EditDifferenceView`, !personConfig.editDifferenceView))}><L p={p} t={`Show edit differences`}/></span>
                        </div>
                        <Checkbox
                            id={`editDifferenceView`}
                            label={<L p={p} t={`Keep this setting for later`}/>}
                            labelClass={styles.labelCheckbox}
                            position={`after`}
                            disabled={!personConfig.editDifferenceView}
                            checked={personConfig.editDifferenceViewKeepOn}
                            {...tapOrClick(() => updatePersonConfig(personId, `EditDifferenceViewKeepOn`, !personConfig.editDifferenceViewKeepOn))}
                            checkboxClass={styles.checkbox} />
                    </div>
                    <div className={styles.dialogButtons}>
                        <button className={styles.yesButton} {...tapOrClick(handleClose)}>Done</button>
                    </div>
                </ModalDialog>
            </ModalContainer>
        </div>
    )
}
