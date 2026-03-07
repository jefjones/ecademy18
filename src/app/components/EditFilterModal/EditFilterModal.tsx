import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
//import classes from 'classnames';
const p = 'component'
import L from '../../components/PageLanguage'
import * as styles from './EditFilterModal.css'
import Checkbox from '../Checkbox'
import SearchText from '../SearchText'
//import DateTimePicker from '../DateTimePicker';
//import SelectSingleDropDown from '../SelectSingleDropDown';

export default ({editFilter={}, setFilters, className="", updateFilter, handleClose}) => {
    const ef = editFilter
    return (
        <div className={styles.container}>
            <ModalContainer onClose={handleClose}>
                <ModalDialog onClose={handleClose}>
                    <br />
                    <div>
                        <span className={styles.setFilters} onClick={() => setFilters(false)}><L p={p} t={`clear all`}/></span>
                        <span className={styles.setFilters} onClick={() => setFilters(true)}><L p={p} t={`set all`}/></span>
                        <div className={styles.row}>
                            <span className={styles.rowLabel}>Status:</span>
                            <Checkbox
                                label={<L p={p} t={`pending`}/>}
                                labelClass={styles.labelCheckbox}
                                checked={ef.status.pending}
                                onClick={(event) => updateFilter(`pending`, event.target.checked)}
                                checkboxClass={styles.checkbox}
                            />
                            <div>
                                <Checkbox
                                    label={<L p={p} t={`accepted`}/>}
                                    labelClass={styles.labelCheckbox}
                                    checked={ef.status.accepted}
                                    onClick={(event) => updateFilter(`accepted`, event.target.checked)}
                                    checkboxClass={styles.checkbox} />
                                <Checkbox
                                    label={<L p={p} t={`not accepted`}/>}
                                    labelClass={styles.labelCheckbox}
                                    checked={ef.status.notAccepted}
                                    onClick={(event) => updateFilter(`notAccepted`, event.target.checked)}
                                    checkboxClass={styles.checkbox} />
                            </div>
                        </div>
                        <hr className={styles.divider}/>
                        <div className={styles.row}>
                            <span className={styles.rowLabel}><L p={p} t={`Vote:`}/></span>
                            <Checkbox
                                label={<L p={p} t={`agree`}/>}
                                labelClass={styles.labelCheckbox}
                                checked={ef.vote.upVote}
                                onClick={(event) => updateFilter(`upVote`, event.target.checked)}
                                checkboxClass={styles.checkbox} />
                            <Checkbox
                                label={<L p={p} t={`disagree`}/>}
                                labelClass={styles.labelCheckbox}
                                checked={ef.vote.downVote}
                                onClick={(event) => updateFilter(`downVote`, event.target.checked)}
                                checkboxClass={styles.checkbox} />
                            <Checkbox
                                label={<L p={p} t={`troll`}/>}
                                labelClass={styles.labelCheckbox}
                                checked={ef.vote.trollVote}
                                onClick={(event) => updateFilter(`trollVote`, event.target.checked)}
                                        checkboxClass={styles.checkbox} />
                        </div>
                        <hr className={styles.divider}/>
                        <div className={styles.row}>
                            <span className={styles.rowLabel}><L p={p} t={`Edit Type:`}/></span>
                            <Checkbox
                                label={<L p={p} t={`edits`}/>}
                                labelClass={styles.labelCheckbox}
                                checked={ef.editType.edits}
                                onClick={(event) => updateFilter(`edits`, event.target.checked)}
                                checkboxClass={styles.checkbox} />
                            <Checkbox
                                label={<L p={p} t={`comments`}/>}
                                labelClass={styles.labelCheckbox}
                                checked={ef.editType.comments}
                                onClick={(event) => updateFilter(`comments`, event.target.checked)}
                                checkboxClass={styles.checkbox} />
                        </div>
                        <hr className={styles.divider}/>
                        <hr className={styles.divider}/>
                        <div className={styles.searchText}>
                            <span className={styles.text}><L p={p} t={`Search Text`}/></span><br/>
                            <SearchText
                                className={styles.searchText}
                                icon={'document'}
                                placeholder={<L p={p} t={`Search text`}/>}
                                justify={'left'}
                                value={ef.searchText ? ef.searchText : ''}
                                onChange={(event) => updateFilter("searchText", event.target.value)} />
                        </div>
                        <hr className={styles.divider}/>
                    </div>
                </ModalDialog>
            </ModalContainer>
        </div>
    )
}
