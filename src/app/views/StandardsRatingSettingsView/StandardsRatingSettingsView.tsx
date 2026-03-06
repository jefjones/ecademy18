import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './StandardsRatingSettingsView.css'
const p = 'StandardsRatingSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import RadioGroup from '../../components/RadioGroup'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import ColorPickerModal from '../../components/ColorPickerModal'
import StandardsRatingColor from '../../components/StandardsRatingColor'
import OneFJefFooter from '../../components/OneFJefFooter'
import Checkbox from '../../components/Checkbox'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import {guidEmpty} from '../../utils/guidValidate'

function StandardsRatingSettingsView(props) {
  const [isShowingModal_removeDetail, setIsShowingModal_removeDetail] = useState(false)
  const [isShowingModal_removeTable, setIsShowingModal_removeTable] = useState(false)
  const [isShowingModal_newInstructions, setIsShowingModal_newInstructions] = useState(false)
  const [standardsRatingDetailId, setStandardsRatingDetailId] = useState('')
  const [standardsRating, setStandardsRating] = useState({})
  const [errors, setErrors] = useState({})
  const [standardsRatingTableId, setStandardsRatingTableId] = useState(undefined)
  const [isInit, setIsInit] = useState(undefined)
  const [isLevelOnly, setIsLevelOnly] = useState(undefined)
  const [name, setName] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [levelAbbrev, setLevelAbbrev] = useState(undefined)
  const [score, setScore] = useState(undefined)
  const [fromPercent, setFromPercent] = useState(undefined)
  const [toPercent, setToPercent] = useState(undefined)
  const [letter, setLetter] = useState(undefined)
  const [lowValue, setLowValue] = useState(undefined)
  const [highValue, setHighValue] = useState(undefined)
  const [scale40Value, setScale40Value] = useState(undefined)
  const [newStandardsRating, setNewStandardsRating] = useState(undefined)
  const [newStandardsRatingName, setNewStandardsRatingName] = useState(undefined)
  const [fromGradeLevelId, setFromGradeLevelId] = useState(undefined)
  const [toGradeLevelId, setToGradeLevelId] = useState(undefined)
  const [standardsRatingNameChosen, setStandardsRatingNameChosen] = useState(undefined)
  const [errorStandardsRatingName, setErrorStandardsRatingName] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [isShowingModal_colorPicker, setIsShowingModal_colorPicker] = useState(undefined)
  const [isShowingModal_isLevelOnly, setIsShowingModal_isLevelOnly] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {standardsRatingTables} = props
    			
    			if (!isInit && standardsRatingTables && standardsRatingTables.length === 1 && !standardsRatingTableId && standardsRatingTableId !== guidEmpty) {
    					setStandardsRating({ standardsRatingTableId: standardsRatingTables[0].id }); setIsInit(true); setStandardsRatingTableId(standardsRatingTables[0].id); setIsLevelOnly(standardsRatingTables[0].isLevelOnly)
    			}
    	
  }, [])

  const handleChange = (event) => {
    
    	    const field = event.target.name
    	    let standardsRating = Object.assign({}, standardsRating)
    	    let errors = Object.assign({}, errors)
    	    standardsRating[field] = event.target.value
    	    errors[field] = ''
    	    setStandardsRating(standardsRating); setErrors(errors)
      
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateStandardsRatingDetail, personId} = props
          
    			let missingInfoMessage = []
    
    			if (!standardsRating.name) {
              setErrors({ ...errors, name: <L p={p} t={`A name is required`}/> })
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Name`}/></div>
    			}
    
          if (isLevelOnly && !standardsRating.levelAbbrev) {
              setErrors({ ...errors, levelAbbrev: <L p={p} t={`An abbreviation is required`}/> })
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Abbreviation`}/></div>
    			}
    
          if (!isLevelOnly && !standardsRating.score) {
              setErrors({ ...errors, score: <L p={p} t={`A rating score is required`}/> })
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Score`}/></div>
    			}
    
    			if (!isLevelOnly && !standardsRating.fromPercent) {
              setErrors({ ...errors, fromPercent: <L p={p} t={`A 'From Percent' is required`}/> })
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From Percent`}/></div>
          }
    
    			if (!isLevelOnly && !standardsRating.toPercent) {
              setErrors({ ...errors, toPercent: <L p={p} t={`A 'To Percent' is required`}/> })
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To Percent`}/></div>
          }
    
          if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
              addOrUpdateStandardsRatingDetail(personId, standardsRating)
    					//Notice that we are going to preserve the standardsRatingTableId in the standardsRating record below
              setStandardsRating({
    									standardsRatingTableId: standardsRating.standardsRatingTableId,
                      name: '',
                      levelAbbrev: '',
                      score: '',
                      fromPercent: '',
                      toPercent: '',
    									letter: '',
    									lowValue: '',
    									highValue: '',
    					        scale40Value: '',
                  })
    					if (stayOrFinish === "FINISH") {
    		          navigate(`/schoolSettings`)
    		      }
    			} else {
    					handleMissingInfoOpen(missingInfoMessage)
          }
      
  }

  const handleNewStandardsRatingMessageOpen = () => {
    return setIsShowingModal_newInstructions(true)
    

  }
  const handleNewStandardsRatingMessageClose = () => {
    return setIsShowingModal_newInstructions(false)
    

  }
  const handleRemoveDetailOpen = (standardsRatingDetailId) => {
    return setIsShowingModal_removeDetail(true); setStandardsRatingDetailId(standardsRatingDetailId)

  }
  const handleRemoveDetailClose = () => {
    return setIsShowingModal_removeDetail(false)

  }
  const handleRemoveDetail = () => {
    
          const {removeStandardsRatingDetail, personId} = props
          
          removeStandardsRatingDetail(personId, standardsRatingDetailId)
          handleRemoveDetailClose()
    			setNewStandardsRating(false)
      
  }

  const handleRemoveTableOpen = (standardsRatingTableId, event) => {
    return setIsShowingModal_removeTable(true); setStandardsRatingTableId(standardsRatingTableId)

  }
  const handleRemoveTableClose = () => {
    return setIsShowingModal_removeTable(false)

  }
  const handleRemoveTable = () => {
    
          const {removeStandardsRatingTable, personId} = props
          
          removeStandardsRatingTable(personId, standardsRatingTableId)
          handleRemoveTableClose()
    			setStandardsRatingTableId('')
      
  }

  const handleEditDetail = (standardsRatingDetailId) => {
    
    			const {standardsRatings} = props
    			if (standardsRating && standardsRating.name)
    					setStandardsRating(standardsRating)
    	
  }

  const handleEditTable = (standardsRatingTableId, event) => {
    
    			const {standardsRatings} = props
    			if (standardsRating && standardsRating.standardsRatingName) {
    					let scaleGradeLevels = doSort(standardsRating.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true })
    					let fromGradeLevelId = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[0].gradeLevelId
              let toGradeLevelId = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[scaleGradeLevels.length-1*1].gradeLevelId
    
    					setNewStandardsRatingName(standardsRating.standardsRatingName); setFromGradeLevelId(fromGradeLevelId); setToGradeLevelId(toGradeLevelId); setIsLevelOnly(standardsRating.isLevelOnly); setStandardsRatingTableId(standardsRating.standardsRatingTableId); setNewStandardsRating(true)
    			}
    	
  }

  const handleStandardsRatingChoice = (standardsRatingTableId) => {
    
    			const {standardsRatings} = props
    			let standardsRatingChosen = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId)[0]
    			if (standardsRatingChosen && standardsRatingChosen.standardsRatingName) {
    					let scaleGradeLevels = doSort(standardsRatingChosen.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true })
    					let fromGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[0].name
              let toGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[scaleGradeLevels.length-1*1].name
    					let standardsRatingNameChosen = `${standardsRatingChosen.standardsRatingName} (${fromGradeLevelName} - ${toGradeLevelName})`
              let isLevelOnly = standardsRatingChosen.isLevelOnly
    					setStandardsRatingTableId(standardsRatingTableId); setStandardsRatingNameChosen(standardsRatingNameChosen); setIsLevelOnly(isLevelOnly); setStandardsRating({ standardsRatingTableId })
    			}
    	
  }

  const openAddNewStandardsRating = () => {
    return setNewStandardsRating(true); setStandardsRatingTableId(''); setStandardsRatingDetailId('')
    

  }
  const handleNewStandardsRatingChange = (event) => {
    
    			let newState = Object.assign({}, state)
    			let field = event.target.name
    			newState[field] = event.target.value
    			setState(newState)
    	
  }

  const addOrUpdateNewStandardsRatingScale = () => {
    
    			const {personId, addOrUpdateStandardsRatingTable, standardsRatings} = props
    			
    			let newState = Object.assign({}, state)
    			let localStandardsRatingName = newState.localStandardsRatingName
    			let isDuplicate = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingName === localStandardsRatingName && m.standardsRatingTableId !== standardsRatingTableId)[0]
    			localStandardsRatingName = newStandardsRatingName ? newStandardsRatingName.replace(' ', '') : newStandardsRatingName
    			let missingInfoMessage = []
    
    			if (!fromGradeLevelId) {
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
    			}
    
    			if (!toGradeLevelId) {
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
    			}
    
    			if (missingInfoMessage && missingInfoMessage.length > 0) {
    					handleMissingInfoOpen(missingInfoMessage)
    			} else if (isDuplicate) {
    					setErrorStandardsRatingName(<L p={p} t={`Duplicate name. Please try again.`}/>)
    			} else if (!newStandardsRatingName) {
    					setErrorStandardsRatingName(<L p={p} t={`Please enter a standards rating scale name`}/>)
    			} else {
    					addOrUpdateStandardsRatingTable(personId, newStandardsRatingName, fromGradeLevelId, toGradeLevelId, standardsRatingTableId, isLevelOnly)
              //Don't clear the IsLevelOnly so that it can be used to show the right controls on the detail section.
    					setErrorStandardsRatingName(''); setNewStandardsRatingName(''); setNewStandardsRating(false); setFromGradeLevelId(''); setToGradeLevelId('')
    			}
    	
  }

  const clearStandardsRating = () => {
    return setStandardsRating({ standardsRatingDetailId: '', })
    
    
    

  }
  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    
    

  }
  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    
    

  }
  const handleColorPickerOpen = (standardsRatingDetailId) => {
    return setIsShowingModal_colorPicker(true); setStandardsRatingDetailId(standardsRatingDetailId)

  }
  const handleColorPickerClose = () => {
    return setIsShowingModal_colorPicker(false); setStandardsRatingDetailId('')

  }
  const handleColorPicker = (color) => {
    
    			const {personId, setStandardsRatingColor} = props
    			
    			setStandardsRatingColor(personId, standardsRatingDetailId, color)
    			handleColorPickerClose()
    	
  }

  const toggleCheckbox = () => {
    
          let newState = Object.assign({}, state)
          newState['isLevelOnly'] = !newState['isLevelOnly']
          setState(newState)
      
  }

  const handleIsLevelOnlyOpen = () => {
    return setIsShowingModal_isLevelOnly(true)
    

  }
  const handleIsLevelOnlyClose = () => {
    return setIsShowingModal_isLevelOnly(false)
    

  const {standardsRatings, standardsRatingTables, fetchingRecord, gradeLevels} = props
      
  
      let headings = [{}, {},
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: isLevelOnly ? <L p={p} t={`Abbreviation`}/> : <L p={p} t={`Score`}/>, tightText: true},
  				{label: isLevelOnly ? '' : <L p={p} t={`From %`}/>, tightText: true},
  				{label: isLevelOnly ? '' : <L p={p} t={`To %`}/>, tightText: true},
  				{label: <L p={p} t={`Color`}/>, tightText: true},
  				{label: <L p={p} t={`Description`}/>, tightText: true}
  		]
  
      let data = []
  
      data = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId).reduce((acc, m) => {
  				if (m.name) {
  						let row = [
  								{value: <a onClick={() => handleEditDetail(m.standardsRatingDetailId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
  								{value: <a onClick={() => handleRemoveDetailOpen(m.standardsRatingDetailId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  								{value: m.name},
  								{value: isLevelOnly ? m.levelAbbrev : m.score === 0 ? '0' : m.score},
  								{value: isLevelOnly ? '' : m.fromPercent === 0 ? '0' : m.fromPercent},
  								{value: isLevelOnly ? '' : m.toPercent === 0 ? '0' : m.toPercent},
  								{value: <div onClick={() => handleColorPickerOpen(m.standardsRatingDetailId)} className={styles.link} data-rh={m.name}>
  														<StandardsRatingColor label={isLevelOnly ? m.levelAbbrev : m.score} color={m.color} name={m.name} code={m.code} description={m.description}/>
  												</div>
  								},
  								{value: m.description},
  				    ]
  						acc = acc && acc.length > 0 ? acc.concat([row]) : [row]
  				}
  				return acc
  		},[])
  
      if (!(data && data.length > 0)) data = [[{value: ''}, {value: <i><L p={p} t={`No standards ratings entered yet.`}/></i>, colSpan: 5 }]]
  
  		let localStandardsRatingTables = standardsRatingTables && standardsRatingTables.length > 0 && standardsRatingTables.reduce((acc, m) => {
  				if (m.label) {
  						let option = {
  								id: m.id,
  								label: <div className={styles.row}>
  													{m.label}
  													<div onClick={(event) => handleEditTable(m.id, event)} className={classes(globalStyles.link, styles.moreLeft, styles.moreRight)}>
  															<L p={p} t={`edit`}/>
  													</div>
  													<div onClick={(event) => handleRemoveTableOpen(m.id, event)} className={classes(globalStyles.link, styles.remove)}>
  															<L p={p} t={`remove`}/>
  													</div>
  											</div>
  							}
  							acc = acc && acc.length > 0 ? acc.concat(option) : [option]
  				}
  				return acc
  		}, [])
  
      return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                  <L p={p} t={`Standards Rating Settings`}/>
              </div>
  						<RadioGroup
  								label={''}
  								name={`standardsRatingTableId`}
  								data={localStandardsRatingTables || []}
  								horizontal={false}
  								className={styles.radio}
  								initialValue={standardsRatingTableId || ''}
  								onClick={handleStandardsRatingChoice}/>
  						<div className={classes(styles.row, styles.moveLeftMuch)} onClick={openAddNewStandardsRating}>
  								<Icon pathName={'plus'} className={styles.iconPlus} fillColor={'green'}/>
  								<div className={styles.textLink}><L p={p} t={`Add a standards rating scale`}/></div>
  						</div>
  						{newStandardsRating &&
  								<div className={styles.muchMoreLeft}>
  										<div className={styles.rowWrap}>
  												<div className={styles.moreTop}>
  														<InputText
  																id={`newStandardsRatingName`}
  																name={`newStandardsRatingName`}
  																size={"medium"}
  																label={standardsRatingTableId ? <L p={p} t={`Update standards rating scale name`}/> : <L p={p} t={`New standards rating scale name`}/>}
  																value={newStandardsRatingName || ''}
  																onChange={handleNewStandardsRatingChange}
  																required={true}
  																whenFilled={newStandardsRatingName}
  																error={errorStandardsRatingName} />
  												</div>
  												<div>
  														<div className={classes(styles.moreLeft, styles.headLabel)}><L p={p} t={`Grade level range`}/></div>
  														<div className={classes(styles.moreLeft, styles.row, styles.notop)}>
  																<div className={styles.positionTop}>
  																		<SelectSingleDropDown
  																				id={'fromGradeLevelId'}
  																				label={<L p={p} t={`From`}/>}
  																				value={fromGradeLevelId || ''}
  																				onChange={handleNewStandardsRatingChange}
  																				options={gradeLevels}
  																				height={'medium'}
  																				required={true}
  																				whenFilled={fromGradeLevelId}/>
  																</div>
  																<div className={styles.positionTop}>
  																		<SelectSingleDropDown
  																				id={'toGradeLevelId'}
  																				label={<L p={p} t={`To`}/>}
  																				value={toGradeLevelId || ''}
  																				onChange={handleNewStandardsRatingChange}
  																				options={gradeLevels}
  																				height={'medium'}
  																				required={true}
  																				whenFilled={toGradeLevelId}/>
  																</div>
  														</div>
  												</div>
                          <div className={classes(styles.row, styles.checkbox)}>
                              <Checkbox
                                  id={'isLevelOnly'}
                                  label={<L p={p} t={`Is level only`}/>}
                                  labelClass={styles.checkboxLabel}
                                  checked={isLevelOnly || false}
                                  onClick={toggleCheckbox}
                                  className={styles.button}/>
                              <a onClick={handleIsLevelOnlyOpen}><Icon pathName={'info'} premium={false} className={styles.icon}/></a>
                          </div>
  												<div className={styles.buttonSetting}>
  														<ButtonWithIcon label={standardsRatingTableId ? <L p={p} t={`Update`}/> : <L p={p} t={`Start`}/>} icon={'checkmark_circle'} onClick={addOrUpdateNewStandardsRatingScale}/>
  												</div>
  										</div>
  										<hr/>
  								</div>
  						}
  						{standardsRatingTableId &&
  								<div>
  										<hr/>
  										<div className={styles.headLabel}>
  												{standardsRatingNameChosen}
  										</div>
  										<div className={globalStyles.instructionsBigger}>
  												<L p={p} t={`After entering a rating level, a blank circle will show in the table further below.  Click on the circle to choose a color.`}/>
  										</div>
                      {isLevelOnly &&
                          <div className={globalStyles.instructionsBigger}>
      												<L p={p} t={`The is set as a "level only" standard grading.  You only need to enter in a name and its abbreviation.  The abbreviation shows up inside the circle.`}/>
      										</div>
                      }
  										<div className={styles.rowWrap}>
  												<InputText
  														id={`name`}
  														name={`name`}
  														size={"medium-short"}
  														label={<L p={p} t={`Name`}/>}
  														value={standardsRating.name || ''}
  														onChange={handleChange}
  														required={true}
  														whenFilled={standardsRating.name}
  														inputClassName={classes(styles.moreLeft, styles.moreTop)} />
                          {isLevelOnly &&
                            <InputText
                                label={<L p={p} t={`Abbreviation`}/>}
                                id={`levelAbbrev`}
                                name={`levelAbbrev`}
                                size={"super-short"}
                                maxLength={2}
                                value={standardsRating.levelAbbrev || ''}
                                onChange={handleChange}
                                required={true}
                                whenFilled={standardsRating.levelAbbrev}
                                inputClassName={styles.moreLeft}/>
                          }
                          {!isLevelOnly &&
                              <div className={styles.rowWrap}>
          												<InputText
          														id={`score`}
          														name={`score`}
          														size={"super-short"}
          														label={<L p={p} t={`Score`}/>}
          														value={standardsRating.score || ''}
          														onChange={handleChange}
          														maxLength={5}
          														required={true}
          														whenFilled={standardsRating.score}
          														inputClassName={styles.moreLeft}/>
          												<InputText
          														id={`fromPercent`}
          														name={`fromPercent`}
          														size={"super-short"}
          														label={<L p={p} t={`From %`}/>}
          														numberOnly={true}
          														value={standardsRating.fromPercent || ''}
          														onChange={handleChange}
          														required={true}
          														inputClassName={styles.moreLeft}
          														whenFilled={standardsRating.fromPercent} />
          												<InputText
          														id={`toPercent`}
          														name={`toPercent`}
          														size={"super-short"}
          														label={<L p={p} t={`To %`}/>}
          														numberOnly={true}
          														value={standardsRating.toPercent || ''}
          														onChange={handleChange}
          														inputClassName={styles.moreLeft}
          														required={true}
          														whenFilled={standardsRating.toPercent} />
                              </div>
                          }
                      </div>
                      <div>
                          <InputText
                              label={<L p={p} t={`Description (optional)`}/>}
                              id={`description`}
                              name={`description`}
                              size={"long"}
                              maxlength={1000}
                              value={standardsRating.description || ''}
                              onChange={handleChange}
                              inputClassName={styles.moreLeft}/>
                      </div>
                      <div className={styles.rowWrap}>
  						            <div className={styles.rowRight}>
  														<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  														{standardsRating && standardsRating.standardsRatingDetailId &&
  						                		<ButtonWithIcon label={<L p={p} t={`Clear`}/>} icon={'undo2'} onClick={clearStandardsRating} changeRed={true}/>
  														}
  						            </div>
  										</div>
  				            <hr />
  										<div className={styles.headLabel}>
  												{standardsRatingNameChosen}
  										</div>
  				            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.standardsRatingSettings}
  				                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={handlePathLink}/>
  								</div>
  						}
              <hr />
              <OneFJefFooter />
              {isShowingModal_removeDetail &&
                  <MessageModal handleClose={handleRemoveDetailClose} heading={<L p={p} t={`Remove this Standards Rating Scale Entry?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this standards rating scale entry?`}/>} isConfirmType={true}
                     onClick={handleRemoveDetail} />
              }
  						{isShowingModal_removeTable &&
                  <MessageModal handleClose={handleRemoveTableClose} heading={<L p={p} t={`Remove this Standards Rating Scale Set?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this standards rating scale set and name?`}/>} isConfirmType={true}
                     onClick={handleRemoveTable} />
              }
  						{isShowingModal_newInstructions &&
                  <MessageModal handleClose={handleNewStandardsRatingMessageClose} heading={<L p={p} t={`New Standards Rating Level`}/>}
                     explainJSX={<L p={p} t={`You can now choose the new standards rating level name from the list and define the standards rating scale`}/>}
                     onClick={handleNewStandardsRatingMessageClose} />
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
              {isShowingModal_isLevelOnly &&
  								<MessageModal handleClose={handleIsLevelOnlyClose} heading={<L p={p} t={`Is Level Only`}/>}  onClick={handleIsLevelOnlyClose}
  									 explainJSX={<L p={p} t={`There are two types of standards-based grading.<br/><br/>By marking this checkbox, you are choosing not to assign a specific standard to an assignment or it's quiz questions.  The teacher simply clicks on the grading circle in the gradebook to toggle it to the next level up.<br/><br/>By NOT marking this box, you are choosing a hybrid dsplay of a traditioal letter grade and the standard grading.  In this case, the grade is based on a percentage of correct answers related to a specifically chosen standard from the standards' list.`}/>} />
  						}
  						{isShowingModal_colorPicker &&
  								<ColorPickerModal handleClose={handleColorPickerClose} onClick={handleColorPicker} />
  						}
        </div>
      )
}
}
export default StandardsRatingSettingsView
