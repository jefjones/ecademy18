import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './SafetyAlertAddView.css'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputTextArea from '../../components/InputTextArea'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import Loading from '../../components/Loading'
import DateMoment from '../../components/DateMoment'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import InputFile from '../../components/InputFile'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {withAlert} from 'react-alert'
import axios from 'axios'

let colorStriping = 0

//1. The alert person enters an alert
//		a. The add function gets back ONLY this written record with the Id so that the get call will look for that one only for alert person.
//	  b. The timer has this Id in order to look for it specifically (it does come back in a list so we just need to pick off the first one - but there is only one)
//2. The entry is received by the office (SafetyAdminAlertView).
//		  a. The admin can approve the messages.  They can also broadcast it so that it goes to all users as well as the police station.
//3. The alert-person receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function SafetyAlertAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [showAllLocations, setShowAllLocations] = useState(false)
  const [safetyAlertTypeId, setSafetyAlertTypeId] = useState('')
  const [selectedAlertStudentInvolved, setSelectedAlertStudentInvolved] = useState([])
  const [note, setNote] = useState('')
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [timerId, setTimerId] = useState(setInterval(() => getSafetyAlerts(personId, safetyAlerts[0].safetyAlertId), 3000))
  const [errorReason, setErrorReason] = useState(<L p={p} t={`Please choose Safety Alert Type or enter a note`}/>)
  const [p, setP] = useState(undefined)
  const [errorStudent, setErrorStudent] = useState(<L p={p} t={`Please enter a note or choose a Safety Alert Type`}/>)
  const [selectedFile, setSelectedFile] = useState(file)

  useEffect(() => {
    return () => {
      
      			const {clearBuildingAndFieldSettings, clearSafetyAlertLocations, personId} = props
      			if (timerId) {
      					clearInterval(timerId)
      					setTimerId('')
      			}
      			clearBuildingAndFieldSettings()
      			clearSafetyAlertLocations(personId)
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {personId, safetyAlerts, getSafetyAlerts} = props
    			
    			if (!timerId && safetyAlerts && safetyAlerts.length > 0 && !safetyAlerts[0].alertReviewName) {
    					setTimerId(setInterval(() => getSafetyAlerts(personId, safetyAlerts[0].safetyAlertId), 3000))
    			} else if (timerId && safetyAlerts && safetyAlerts.length > 0 && safetyAlerts[0].alertReviewName) {
    					clearInterval(timerId)
    					setTimerId('')
    					makeSound()
    			}
    			colorStriping= 0; //This is to reset the global variable, colorStriping, since we want to keep the striping consistent on the views.
    	
  }, [])

  const {personId, safetyAlerts, safetyAlertTypes, buildingAndFieldTreeExplorer, toggleExpanded, myFrequentPlaces, setMyFrequentPlace} = props
      
  		let safetyAlertPending = safetyAlerts && safetyAlerts.length > 0 && safetyAlerts[0]
  
      return (
          <div className={styles.container}>
  						<form method="post" encType="multipart/form-data">
  								<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  										<L p={p} t={`Enter New Safety Alert`}/>
  								</div>
  								{isPendingConfirmation && safetyAlertPending && safetyAlertPending.safetyAlertId &&
  										<div>
  												<TextDisplay label={<L p={p} t={`Entry date`}/>} text={<DateMoment date={safetyAlertPending.entryDate} minusHours={6}/>} hideIfEmpty={true}/>
  												<TextDisplay label={<L p={p} t={`Alert type`}/>} text={safetyAlertPending.safetyAlertTypeName} hideIfEmpty={true}/>
  												<TextDisplay label={<L p={p} t={`Picture`}/>} text={<a onClick={() => handleImageViewerOpen(safetyAlertPending.fileUrl)} className={globalStyles.link}>{safetyAlertPending.fileUrl ? 'View picture' : ''}</a>} hideIfEmpty={true}/>
  												<TextDisplay label={<L p={p} t={`Alert note`}/>} text={safetyAlertPending.alertNote || '- -'}/>
  
  												<div className={styles.row}>
  														<div className={styles.pendingLabelSmaller}>Confirmation:</div>
  														<Loading loadingText={<L p={p} t={`Waiting for office response`}/>} isLoading={!safetyAlertPending.adminName} />
  												</div>
  												<TextDisplay label={<L p={p} t={`Entry date`}/>} text={safetyAlertPending.approvedDate ? <DateMoment date={safetyAlertPending.approvedDate} minusHours={6}/> : '- -'}/>
  												<TextDisplay label={<L p={p} t={`Administrator`}/>} text={safetyAlertPending.adminName || '- -'}/>
  												<TextDisplay label={<L p={p} t={`Admin note`}/>} text={safetyAlertPending.adminNote || '- -'}/>
  										</div>
  								}
  								{!isPendingConfirmation &&
  										<div>
  												<div className={styles.row}>
  														<div>
  																<SelectSingleDropDown
  																		id={`safetyAlertTypeId`}
  																		name={`safetyAlertTypeId`}
  																		label={<L p={p} t={`Alert type`}/>}
  																		value={safetyAlertTypeId || ''}
  																		options={safetyAlertTypes}
  																		className={styles.moreBottomMargin}
  																		height={`medium`}
  																		onChange={handleChange}
  																		error={errorReason}/>
  														</div>
  														<div className={classes(styles.muchLeft, styles.row)}>
  																<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}><L p={p} t={`Close`}/></a>
  																<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  														</div>
  												</div>
  												<InputFile label={`Include a picture`} isCamera={true} onChange={handleInputFile} isResize={true}/>
  												{buildingAndFieldTreeExplorer.buildingAndFields && buildingAndFieldTreeExplorer.buildingAndFields.filter(m => m.isFrequentMine).length > 0 &&
  														<div>
  														<hr />
  														<div className={styles.headerLabel}>
  																<L p={p} t={`My Common Building and Field Locations`}/>
  														</div>
  														{buildingAndFieldTreeExplorer.buildingAndFields.filter(m => m.isFrequentMine).map((m, i) =>
  																<div key={i} className={classes(styles.subFolder1, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
  																		<div className={styles.row} onClick={() => {toggleExpanded(personId, m.buildingAndFieldId); colorStriping = 0;}}>
  																				<div className={styles.checkbox}>
  																						<Checkbox
  																								id={m.buildingAndFieldId}
  																								label={''}
  																								checked={m.isSafetyAlertLocation || false}
  																								onClick={(event) => handleSafetyAlertLocation(event, 'BuildingAndField', m.buildingAndFieldId)}/>
  																				</div>
  																				<Icon pathName={m.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  																				<Icon pathName={m.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  																				<div className={classes(styles.label, styles.row)} data-rh={'Building name'}>
  																						<div className={styles.bold}><L p={p} t={`Building:`}/></div>
  																						{m.name.length > 75 ? m.name.substring(0,75) + '...' : m.name}
  																				</div>
  																				<div className={styles.label} data-rh={'GPS link'}>{m.gpsLink}</div>
  																				<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(m.name, m.note)}>{m.note}</div>
  																		</div>
  																		{m.isExpanded && m.levels && m.levels.length > 0 && m.levels.filter(l => l.isFrequentMine).map((l, i) =>
  																				<div key={i} className={(colorStriping++ % 2 === 0 ? styles.stripe : styles.white)}>
  																						<div className={classes(styles.row, styles.subFolder2)} onClick={() => {toggleExpanded(personId, l.buildingAndFieldLevelId); colorStriping = 0;}}>
  																								<div className={styles.checkbox}>
  																										<Checkbox
  																												id={l.buildingAndFieldLevelId}
  																												label={''}
  																												checked={l.isSafetyAlertLocation || false}
  																												onClick={(event) => handleSafetyAlertLocation(event, 'BuildingAndFieldLevel', l.buildingAndFieldLevelId)}/>
  																								</div>
  																								<Icon pathName={l.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  																								<Icon pathName={l.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  																								<div className={classes(styles.label, styles.row)} data-rh={'Level name'}>
  																										<div className={styles.bold}><L p={p} t={`Level:`}/></div>
  																										{l.name.length > 75 ? l.name.substring(0,75) + '...' : l.name}
  																								</div>
  																								<div className={styles.label} data-rh={'GPS link'}>{l.gpsLink}</div>
  																								<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(l.name, l.note)}>{l.note}</div>
  																						</div>
  																						{l.isExpanded && l.entrances && l.entrances.length > 0 && l.entrances.filter(e => e.isFrequentMine).map((e, i) =>
  																								<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))} >
  																										<div className={styles.checkbox}>
  																												<Checkbox
  																														id={e.levelEntranceId}
  																														label={''}
  																														checked={e.isSafetyAlertLocation || false}
  																														onClick={(event) => handleSafetyAlertLocation(event, 'LevelEntrance', e.levelEntranceId)}/>
  																										</div>
  																										<Icon pathName={'door_in'} premium={true} className={styles.iconTree}/>
  																										<div className={classes(styles.label, styles.row)} data-rh={'Entrance name'}>
  																												<div className={styles.bold}><L p={p} t={`Entrance:`}/></div>
  																												{e.name}
  																										</div>
  																										<div className={styles.label} data-rh={'Map direction'}>{e.mapDirectionName}</div>
  																										<div className={styles.label} data-rh={'Is this door locked during the day?'}>{e.isLockedDuringDay ? <L p={p} t={`Locked`}/> : <L p={p} t={`Not Locked`}/>}</div>
  																										<div className={styles.label} data-rh={'GPS link'}>{e.gpsLink}</div>
  																										<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(e.name, e.note)}>{e.note}</div>
  																								</div>
  																						)}
  																						{l.isExpanded && l.rooms && l.rooms.length > 0 && l.rooms.filter(r => r.isFrequentMine).map((r, i) =>
  																								<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
  																										<div className={styles.checkbox}>
  																												<Checkbox
  																														id={r.roomId}
  																														label={''}
  																														checked={r.isSafetyAlertLocation || false}
  																														onClick={(event) => handleSafetyAlertLocation(event, 'Room', r.roomId)}/>
  																										</div>
  																										<Icon pathName={'room'} premium={true} className={styles.iconTree}/>
  																										<div className={classes(styles.label, styles.row)} data-rh={'Room name'}>
  																												<div className={styles.bold}><L p={p} t={`Room:`}/></div>
  																												{r.name}
  																										</div>
  																										<div className={styles.label} data-rh={'GPS link'}>{r.gpsLink}</div>
  																										<div className={styles.label} data-rh={'Map direction'}>{r.mapDirectionName}</div>
  																										<div className={styles.label} data-rh={'Entrance name'}>{r.levelEntranceName}</div>
  																										<div className={styles.label} data-rh={'Side of hallway from entrance'}>{r.sideOfHallwayFromEntrance}</div>
  																										<div className={styles.label} data-rh={'Number of doors away from entrance'}>{r.numberOfDoorsAwayFromEntrance}</div>
  																										<div className={styles.label} data-rh={'Occupant capacity'}>{r.occupantCapacity}</div>
  																										<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(r.name, r.note)}>{r.note}</div>
  																								</div>
  																						)}
  																				</div>
  																		)}
  																</div>
  														)}
  														</div>
  												}
  												<hr />
  												<div className={classes(styles.row, globalStyles.link, styles.showHideLabel)} onClick={toggleShowAllLocations}>
  														<Icon pathName={'magnifier'} premium={true} className={styles.icon} />
  														{showAllLocations ? `Hide All Building and Field Locations` : `Show All Building and Field Locations`}
  												</div>
  												{showAllLocations &&
  														<div>
  																{buildingAndFieldTreeExplorer.buildingAndFields && buildingAndFieldTreeExplorer.buildingAndFields.length > 0 && buildingAndFieldTreeExplorer.buildingAndFields.map((m, i) =>
  																		<div key={i} className={classes(styles.columns, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
  																				<div className={classes(styles.row, styles.subFolder1)} onClick={() => {toggleExpanded(personId, m.buildingAndFieldId); colorStriping = 0;}}>
  																						<div className={styles.checkbox}>
  																								<Checkbox
  																										id={m.buildingAndFieldId}
  																										label={''}
  																										checked={m.isSafetyAlertLocation || false}
  																										onClick={(event) => handleSafetyAlertLocation(event, 'BuildingAndField', m.buildingAndFieldId)}/>
  																						</div>
  																						<Icon pathName={m.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  																						<Icon pathName={m.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  																						<div className={classes(styles.label, styles.row)} data-rh={'Building name'}>
  																								<div className={styles.bold}><L p={p} t={`Building:`}/></div>
  																								{m.name.length > 75 ? m.name.substring(0,75) + '...' : m.name}
  																						</div>
  																						<div className={styles.label} data-rh={'GPS link'}>{m.gpsLink}</div>
  																						<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(m.name, m.note)}>{m.note}</div>
  																				</div>
  																				{m.isExpanded && m.levels && m.levels.length > 0 && m.levels.map((l, i) =>
  																						<div key={i} className={(colorStriping++ % 2 === 0 ? styles.stripe : styles.white)}>
  																								<div className={classes(styles.row, styles.subFolder2)} onClick={() => {toggleExpanded(personId, l.buildingAndFieldLevelId); colorStriping = 0;}}>
  																										<div className={styles.checkbox}>
  																												<Checkbox
  																														id={l.buildingAndFieldLevelId}
  																														label={''}
  																														checked={l.isSafetyAlertLocation || false}
  																														onClick={(event) => handleSafetyAlertLocation(event, 'BuildingAndFieldLevel', l.buildingAndFieldLevelId)}/>
  																										</div>
  																										<Icon pathName={l.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
  																										<Icon pathName={l.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
  																										<div className={classes(styles.label, styles.row)} data-rh={'Level name'}>
  																												<div className={styles.bold}><L p={p} t={`Level:`}/></div>
  																												{l.name.length > 75 ? l.name.substring(0,75) + '...' : l.name}
  																										</div>
  																										<div className={styles.label} data-rh={'GPS link'}>{l.gpsLink}</div>
  																										<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(l.name, l.note)}>{l.note}</div>
  																								</div>
  																								{l.isExpanded && l.entrances && l.entrances.length > 0 && l.entrances.map((e, i) =>
  																										<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))} >
  																												<div className={styles.checkbox}>
  																														<Checkbox
  																																id={e.levelEntranceId}
  																																label={''}
  																																checked={e.isSafetyAlertLocation || false}
  																																onClick={(event) => handleSafetyAlertLocation(event, 'LevelEntrance', e.levelEntranceId)}/>
  																												</div>
  																												<Icon pathName={'door_in'} premium={true} className={styles.iconTree}/>
  																												<div className={classes(styles.label, styles.row)} data-rh={'Entrance name'}>
  																														<div className={styles.bold}><L p={p} t={`Entrance:`}/></div>
  																														{e.name}
  																												</div>
  																												<div className={styles.label} data-rh={'Map direction'}>{e.mapDirectionName}</div>
  																												<div className={styles.label} data-rh={'Is this door locked during the day?'}>{e.isLockedDuringDay ? 'Locked' : 'Not Locked'}</div>
  																												<div className={styles.label} data-rh={'GPS link'}>{e.gpsLink}</div>
  																												<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(e.name, e.note)}>{e.note}</div>
  																										</div>
  																								)}
  																								{l.isExpanded && l.rooms && l.rooms.length > 0 && l.rooms.map((r, i) =>
  																										<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
  																												<div className={styles.checkbox}>
  																														<Checkbox
  																																id={r.roomId}
  																																label={''}
  																																checked={r.isSafetyAlertLocation || false}
  																																onClick={(event) => handleSafetyAlertLocation(event, 'Room', r.roomId)}/>
  																												</div>
  																												<Icon pathName={'room'} premium={true} className={styles.iconTree}/>
  																												<div className={classes(styles.label, styles.row)} data-rh={'Room name'}>
  																														<div className={styles.bold}><L p={p} t={`Room:`}/></div>
  																														{r.name}
  																												</div>
  																												<div className={styles.label} data-rh={'GPS link'}>{r.gpsLink}</div>
  																												<div className={styles.label} data-rh={'Map direction'}>{r.mapDirectionName}</div>
  																												<div className={styles.label} data-rh={'Entrance name'}>{r.levelEntranceName}</div>
  																												<div className={styles.label} data-rh={'Side of hallway from entrance'}>{r.sideOfHallwayFromEntrance}</div>
  																												<div className={styles.label} data-rh={'Number of doors away from entrance'}>{r.numberOfDoorsAwayFromEntrance}</div>
  																												<div className={styles.label} data-rh={'Occupant capacity'}>{r.occupantCapacity}</div>
  																												<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => handleNoteViewOpen(r.name, r.note)}>{r.note}</div>
  																										</div>
  																								)}
  																						</div>
  																				)}
  																		</div>
  																)}
  														</div>
  												}
  												<hr />
  												<InputTextArea
  														label={<L p={p} t={`Note (optional)`}/>}
  														name={'note'}
  														value={note}
  														onChange={handleChange} />
  
  												{showAllLocations &&
  														<div className={classes(styles.muchLeft, styles.row)}>
  																<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}>Close</a>
  																<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={processForm}/>
  														</div>
  												}
  										</div>
  								}
  						</form>
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Safety Alert Add`}/>} path={'safetyAlertAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
  				{isShowingModal &&
  						<div className={globalStyles.fullWidth}>
  								<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  						</div>
  				}
        </div>
      )
}

export default withAlert(SafetyAlertAddView)
