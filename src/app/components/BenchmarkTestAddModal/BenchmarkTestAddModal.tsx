import { useState } from 'react'
import styles from './BenchmarkTestAddModal.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import InputText from '../InputText'
import MessageModal from '../MessageModal'
import InputTextArea from '../InputTextArea'
import SelectSingleDropDown from '../SelectSingleDropDown'
import ButtonWithIcon from '../ButtonWithIcon'
import {guidEmpty} from '../../utils/guidValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function BenchmarkTestAddModal(props) {
  const [errors, setErrors] = useState({ ...this.state.errors, name: <L p={p} t={`Name is required`}/>})
  const [name, setName] = useState(<L p={p} t={`Name is required`}/>)
  const [p, setP] = useState(undefined)
  const [pointsPossible, setPointsPossible] = useState(<L p={p} t={`Points are required`}/>)
  const [description, setDescription] = useState(<L p={p} t={`Description is required`}/>)
  const [fromGradeLevelId, setFromGradeLevelId] = useState(<L p={p} t={`From grade level is required`}/>)
  const [toGradeLevelId, setToGradeLevelId] = useState(<L p={p} t={`"To grade level" is required`}/>)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  
        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose} className={styles.zIndex}>
                    <ModalDialog onClose={handleClose}>
  											<div>
  		                      <div className={globalStyles.pageTitle}>
  		                          {!benchmarkTest.benchmarkTestId || benchmarkTest.benchmarkTestId === guidEmpty
  																	? <L p={p} t={`Add Benchmark Test`}/>
  																	: <L p={p} t={`Edit Benchmark Test`}/>
  															}
  		                      </div>
  													<InputText
  		                          id={`name`}
  		                          name={`name`}
  		                          size={'medium'}
  		                          label={<L p={p} t={`Name`}/>}
  		                          value={benchmarkTest.name || ''}
  		                          onChange={changeBenchmarkTest}
  															required={true}
  															whenFilled={benchmarkTest.name}
  															autoComplete={'dontdoit'}
  		                          error={errors.name}/>
  		                      <InputText
  		                          id={`pointsPossible`}
  		                          name={`pointsPossible`}
  		                          size={'super-short'}
  		                          label={<L p={p} t={`Points`}/>}
  															numberOnly={true}
  		                          value={benchmarkTest.pointsPossible || ''}
  		                          onChange={changeBenchmarkTest}
  															required={true}
  															whenFilled={benchmarkTest.pointsPossible}
  															autoComplete={'dontdoit'}
  		                          error={errors.pointsPossible}/>
  													<InputTextArea
  															label={<L p={p} t={`Description`}/>}
  															name={'description'}
  															value={benchmarkTest.description || ''}
  															autoComplete={'dontdoit'}
  															onChange={changeBenchmarkTest}
  															required={true}
  															whenFilled={benchmarkTest.description}
  															error={errors.description}/>
  													<div>
  															<SelectSingleDropDown
  																	id={'sequence'}
  																	name={'sequence'}
  																	label={<L p={p} t={`Sequence`}/>}
  																	value={benchmarkTest.sequence}
  																	noBlank={true}
  																	options={sequences}
  																	className={styles.dropdown}
  																	onChange={changeBenchmarkTest}/>
  													</div>
  													<hr/>
  													<div className={classes(styles.headLabel)}>Grade level range:</div>
  													<div className={classes(styles.row)}>
  															<div>
  																	<SelectSingleDropDown
  																			id={'fromGradeLevelId'}
  																			label={<L p={p} t={`From`}/>}
  																			value={benchmarkTest.fromGradeLevelId || ''}
  																			onChange={changeBenchmarkTest}
  																			options={personConfig.gradeLevels}
  																			height={'medium'}
  																			required={true}
  																			whenFilled={benchmarkTest.fromGradeLevelId}
  																			error={errors.fromGradeLevelId}/>
  															</div>
  															<div>
  																	<SelectSingleDropDown
  																			id={'toGradeLevelId'}
  																			label={<L p={p} t={`To`}/>}
  																			value={benchmarkTest.toGradeLevelId || ''}
  																			onChange={changeBenchmarkTest}
  																			options={personConfig.gradeLevels}
  																			height={'medium'}
  																			required={true}
  																			whenFilled={benchmarkTest.toGradeLevelId}
  																			error={errors.toGradeLevelId}/>
  															</div>
  													</div>
  													<hr/>
  													<div className={classes(styles.rowRight)}>
  															<div className={styles.cancelLink} onClick={handleClose}>
  																	<L p={p} t={`Close`}/>
  															</div>
  															<div>
  																	<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  															</div>
  													</div>
  											</div>
                    </ModalDialog>
                </ModalContainer>
  							{isShowingModal_missingInfo &&
  									<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  										 explainJSC={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  							}
            </div>
        )
}
export default BenchmarkTestAddModal
