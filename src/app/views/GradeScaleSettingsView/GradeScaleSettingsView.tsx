import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './GradeScaleSettingsView.css'
const p = 'GradeScaleSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import RadioGroup from '../../components/RadioGroup'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function GradeScaleSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_removeDetail, setIsShowingModal_removeDetail] = useState(false)
  const [isShowingModal_removeTable, setIsShowingModal_removeTable] = useState(false)
  const [isShowingModal_newInstructions, setIsShowingModal_newInstructions] = useState(false)
  const [gradeScaleDetailId, setGradeScaleDetailId] = useState('')
  const [gradeScale, setGradeScale] = useState({
        letter: '',
				lowValue: '',
				highValue: '',
        scale40Value: '',
      })
  const [letter, setLetter] = useState('')
  const [lowValue, setLowValue] = useState('')
  const [highValue, setHighValue] = useState('')
  const [scale40Value, setScale40Value] = useState('')
  const [errors, setErrors] = useState({
				letter: '',
				lowValue: '',
				highValue: '',
        scale40Value: '',
      })
  const [errorLetter, setErrorLetter] = useState(<L p={p} t={`A letter grade is required`}/>)
  const [p, setP] = useState(undefined)
  const [gradeScaleTableId, setGradeScaleTableId] = useState(gradeScale.gradeScaleTableId)
  const [gradeScaleNameChosen, setGradeScaleNameChosen] = useState(undefined)
  const [newGradeScale, setNewGradeScale] = useState(true)
  const [newGradeScaleName, setNewGradeScaleName] = useState(event.target.value)
  const [errorGradeScaleName, setErrorGradeScaleName] = useState('Duplicate name. Please try again.')

  const {gradeScales, fetchingRecord} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Letter`}/>, tightText: true},
  			{label: <L p={p} t={`High value`}/>, tightText: true},
  			{label: <L p={p} t={`Low value`}/>, tightText: true},
  			{label: <L p={p} t={`Scale 4.0 value`}/>, tightText: true}]
  
      let data = []
  
      gradeScales && gradeScales.length > 0 && gradeScales.filter(m => m.gradeScaleTableId === gradeScaleTableId).forEach(m => {
  				if (m.letter) {
  						data.push([
  								{value: <a onClick={() => handleEdit(m.gradeScaleDetailId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
  			          {value: <a onClick={() => handleRemoveDetailOpen(m.gradeScaleDetailId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  								{value: m.letter},
  								{value: m.highValue},
  								{value: m.lowValue},
  								{value: m.scale40Value},
  		        ])
  				}
      })
  
      if (!(data && data.length > 0)) data = [[{value: ''}, {value: <i><L p={p} t={`No grade scales entered yet.`}/></i>, colSpan: 5 }]]
  
  		let gradeScaleTables = gradeScales && gradeScales.length > 0 && gradeScales.reduce((acc, m) => {
  				let alreadyEntered = false
  				acc && acc.length > 0 && acc.forEach(g => {
  					if (m.gradeScaleTableId === g.id) alreadyEntered = true
  				})
  				if (!alreadyEntered) {
  						let option = {
  								id: m.gradeScaleTableId,
  								label: <div className={styles.row}>{m.gradeScaleName}<div onClick={(event) => handleRemoveTableOpen(m.gradeScaleTableId, event)} className={classes(globalStyles.link, styles.remove)}>{m.defaultFlag ? '' : <L p={p} t={`remove`}/>}</div></div>}
  						acc = acc ? acc.concat(option) : [option]
  				}
  				return acc
  		}, [])
  
      return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                  <L p={p} t={`Grade Scale Settings`}/>
              </div>
  						<RadioGroup
  								label={<L p={p} t={`Do you want to modify a grade scale, or add another one?`}/>}
  								data={gradeScaleTables || []}
  								name={`gradeScaleTables`}
  								horizontal={false}
  								className={styles.radio}
  								initialValue={gradeScaleTableId}
  								onClick={handleGradeScaleChoice}/>
  						<div className={classes(styles.row, styles.moveLeftMuch)} onClick={openAddNewGradeScale}>
  								<Icon pathName={'plus'} className={styles.iconPlus} fillColor={'green'}/>
  								<div className={styles.textLink}><L p={p} t={`Add another grade scale`}/></div>
  						</div>
  						{newGradeScale &&
  								<div className={styles.muchMoreLeft}>
  										<div className={styles.row}>
  												<InputText
  														id={`newGradeScaleName`}
  														name={`newGradeScaleName`}
  														size={"medium"}
  														label={<L p={p} t={`New grade scale name`}/>}
  														value={newGradeScaleName || ''}
  														onChange={handleNewGradeScaleName}
  														required={true}
  														whenFilled={newGradeScaleName}
  														error={errorGradeScaleName} />
  												<div className={styles.buttonSetting}>
  														<ButtonWithIcon label={'Start'} icon={'checkmark_circle'} onClick={createNewGradeLevel}/>
  												</div>
  										</div>
  								</div>
  						}
  						{gradeScaleTableId &&
  								<div>
  										<hr/>
  										<div className={styles.labelHeader}>
  												{gradeScaleNameChosen}
  										</div>
  
  										<div className={styles.rowWrap}>
  												<InputText
  														id={`letter`}
  														name={`letter`}
  														size={"super-short"}
  														label={<L p={p} t={`Letter`}/>}
  														value={gradeScale.letter || ''}
  														onChange={handleChange}
  														maxLength={10}
  														required={true}
  														whenFilled={gradeScale.letter}
  														inputClassName={styles.moreLeft}
  														error={errors.letter} />
  												<InputText
  														id={`highValue`}
  														name={`highValue`}
  														size={"super-short"}
  														label={<L p={p} t={`High value`}/>}
  														numberOnly={true}
  														value={gradeScale.highValue || ''}
  														onChange={handleChange}
  														required={true}
  														inputClassName={styles.moreLeft}
  														whenFilled={gradeScale.highValue} />
  												<InputText
  														id={`lowValue`}
  														name={`lowValue`}
  														size={"super-short"}
  														label={<L p={p} t={`Low value`}/>}
  														numberOnly={true}
  														value={gradeScale.lowValue || ''}
  														onChange={handleChange}
  														required={true}
  														inputClassName={styles.moreLeft}
  														whenFilled={gradeScale.lowValue} />
  												<InputText
  														id={`scale40Value`}
  														name={`scale40Value`}
  														size={"super-short"}
  														label={<L p={p} t={`Scale 4.0 value`}/>}
  														numberOnly={true}
  														value={gradeScale.scale40Value || ''}
  														onChange={handleChange}
  														required={true}
  														inputClassName={styles.moreLeft}
  														whenFilled={gradeScale.scale40Value} />
  										</div>
  										<div className={styles.rowRight}>
  												<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  												{gradeScale && gradeScale.gradeScaleDetailId &&
  														<ButtonWithIcon label={<L p={p} t={`Clear`}/>} icon={'undo2'} onClick={clearGradeScale} changeRed={true}/>
  												}
  										</div>
  				            <hr />
  										<div className={styles.labelHeader}>
  												{gradeScaleNameChosen}
  										</div>
  				            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.gradeScaleSettings}
  				                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={handlePathLink}/>
  								</div>
  						}
              <hr />
              <OneFJefFooter />
              {isShowingModal_removeDetail &&
                  <MessageModal handleClose={handleRemoveDetailClose} heading={<L p={p} t={`Remove this Grade Scale Entry?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this grade scale entry?`}/>} isConfirmType={true}
                     onClick={handleRemoveDetail} />
              }
  						{isShowingModal_removeTable &&
                  <MessageModal handleClose={handleRemoveTableClose} heading={<L p={p} t={`Remove this Grade Scale Set?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this grade scale set and name?`}/>} isConfirmType={true}
                     onClick={handleRemoveTable} />
              }
  						{isShowingModal_newInstructions &&
                  <MessageModal handleClose={handleNewGradeScaleMessageClose} heading={<L p={p} t={`New Grade Level`}/>}
                     explainJSX={<L p={p} t={`You can now choose the new grade level name from the list and define the grade scale`}/>}
                     onClick={handleNewGradeScaleMessageClose} />
              }
        </div>
      )
}
export default GradeScaleSettingsView
