import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as styles from './PickupLaneSettingsView.css'
const p = 'PickupLaneSettingsView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import RadioGroup from '../../components/RadioGroup'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react'

const mapStyles = {
  width: '100%',
  height: '100%'
}

function PickupLaneSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace] = useState({})
  const [isShowingModal_removeDetail, setIsShowingModal_removeDetail] = useState(false)
  const [isShowingModal_removeTable, setIsShowingModal_removeTable] = useState(false)
  const [isShowingModal_newInstructions, setIsShowingModal_newInstructions] = useState(false)
  const [pickupLaneDetailId, setPickupLaneDetailId] = useState('')
  const [pickupLane, setPickupLane] = useState({})
  const [errors, setErrors] = useState({})
  const [pickupLaneTableId, setPickupLaneTableId] = useState(pickupLaneTables[0].id)
  const [isInit, setIsInit] = useState(true)
  const [positionNumber, setPositionNumber] = useState(<L p={p} t={`A position number is required`}/>)
  const [p, setP] = useState(undefined)
  const [latitude, setLatitude] = useState(<L p={p} t={`A Latitude is required`}/>)
  const [longitude, setLongitude] = useState(<L p={p} t={`A Longitude is required`}/>)
  const [description, setDescription] = useState('')
  const [newPickupLane, setNewPickupLane] = useState(false)
  const [newPickupLaneName, setNewPickupLaneName] = useState(pickupLane.pickupLaneName)
  const [pickupLaneNameChosen, setPickupLaneNameChosen] = useState(undefined)
  const [errorPickupLaneName, setErrorPickupLaneName] = useState(<L p={p} t={`Duplicate name. Please try again.`}/>)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [message, setMessage] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {pickupLaneTables} = props
    			
    			if (!isInit && pickupLaneTables && pickupLaneTables.length === 1 && (!pickupLaneTableId || pickupLaneTableId === guidEmpty)) {
    					setPickupLane({ pickupLaneTableId: pickupLaneTables[0].id }); setIsInit(true); setPickupLaneTableId(pickupLaneTables[0].id)
    			}
    	
  }, [])

  const {pickupLanes, pickupLaneTables, fetchingRecord, positionNumbers} = props
  
      let headings = [{}, {},
  				{label: <L p={p} t={`Position`}/>, tightText: true},
  				{label: <L p={p} t={`Latitude`}/>, tightText: true},
  				{label: <L p={p} t={`Longitude`}/>, tightText: true},
  				{label: <L p={p} t={`Description`}/>, tightText: true}
  		]
  
      let data = []
  
      data = pickupLanes && pickupLanes.length > 0 && pickupLanes.filter(m => m.pickupLaneTableId === pickupLaneTableId).reduce((acc, m) => {
  				if (m.positionNumber) {
  						let row = [
  								{value: <a onClick={() => handleEditDetail(m.pickupLaneDetailId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
  								{value: <a onClick={() => handleRemoveDetailOpen(m.pickupLaneDetailId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  								{value: m.positionNumber},
  								{value: m.latitude},
  								{value: m.longitude},
  								{value: m.description},
  				    ]
  						acc = acc && acc.length > 0 ? acc.concat([row]) : [row]
  				}
  				return acc
  		},[])
  
      if (!(data && data.length > 0)) data = [[{value: ''}, {value: <i>No pick-up lanes entered yet.</i>, colSpan: 5 }]]
  
  		let localPickupLaneTables = pickupLaneTables && pickupLaneTables.length > 0 && pickupLaneTables.reduce((acc, m) => {
  				if (m.label) {
  						let option = {
  								id: m.id,
  								label: <div className={styles.row}>
  													{m.label}
  													<div onClick={(event) => handleEditTable(m.id, event)} className={classes(globalStyles.link, styles.moreLeft, styles.moreRight)}>
  															edit
  													</div>
  													<div onClick={(event) => handleRemoveTableOpen(m.id, event)} className={classes(globalStyles.link, styles.remove)}>
  															remove
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
                  <L p={p} t={`Pick-up Lane Settings`}/>
              </div>
  						<RadioGroup
  								label={''}
  								name={`pickupLaneTableId`}
  								data={localPickupLaneTables || []}
  								horizontal={false}
  								className={styles.radio}
  								initialValue={pickupLaneTableId || ''}
  								onClick={handlePickupLaneChoice}/>
  						<div className={classes(styles.row, styles.moveLeftMuch)} onClick={openAddNewPickupLane}>
  								<Icon pathName={'plus'} className={styles.iconPlus} fillColor={'green'}/>
  								<div className={styles.textLink}><L p={p} t={`Add a pick-up lane`}/></div>
  						</div>
  						{newPickupLane &&
  								<div className={styles.muchMoreLeft}>
  										<div className={styles.rowWrap}>
  												<div className={styles.muchTop}>
  														<InputText
  																id={`newPickupLaneName`}
  																name={`newPickupLaneName`}
  																size={"medium"}
  																label={<L p={p} t={`New pick-up lane name`}/>}
  																value={newPickupLaneName || ''}
  																onChange={handleNewPickupLaneChange}
  																required={true}
  																whenFilled={newPickupLaneName}
  																error={errorPickupLaneName} />
  												</div>
  												<div className={styles.buttonSetting}>
  														<ButtonWithIcon label={<L p={p} t={`Start`}/>} icon={'checkmark_circle'} onClick={addOrUpdateNewPickupLane}/>
  												</div>
  										</div>
  										<hr/>
  								</div>
  						}
  						{pickupLaneTableId &&
  								<div>
  										<hr/>
  										<div className={styles.headLabel}>
  												{pickupLaneNameChosen}
  										</div>
  										<div className={styles.rowWrap}>
                          <div>
                              <SelectSingleDropDown
                                  id={'positionNumber'}
                                  label={<L p={p} t={`Position`}/>}
                                  value={pickupLane.positionNumber || ''}
                                  onChange={handleChange}
                                  options={positionNumbers}
                                  height={'medium'}
                                  required={true}
                                  whenFilled={pickupLane.positionNumber}/>
                          </div>
                          <hr/>
                          <div className={globalStyles.instructionsBigger}>
                              <L p={p} t={`Stand physically in position of each driver's expected location of the pick-up lane.  Click on the 'Set GPS Location' for the given position number.`}/>
                          </div>
                          <div className={globalStyles.instructionsBigger}>
                              <L p={p} t={`If the positions are not exact, at least they are spaced and eCademy will calculate the order of the line and display it for view.`}/>
                          </div>
                          <div>
                              <ButtonWithIcon label={<L p={p} t={`Set GPS Location`}/>} icon={'checkmark_circle'} onClick={(event) => getGPSLocation()}/>
                          </div>
                          <div className={styles.rowWrap}>
      												<InputText
                                  label={<L p={p} t={`Latitude`}/>}
      														id={`latitude`}
      														name={`latitude`}
      														size={"medium-short"}
      														numberOnly={true}
      														value={pickupLane.latitude || ''}
      														onChange={handleChange}
      														required={true}
      														inputClassName={styles.moreLeft}
      														whenFilled={pickupLane.latitude} />
      												<InputText
                                  label={<L p={p} t={`Longitude`}/>}
      														id={`longitude`}
      														name={`longitude`}
      														size={"medium-short"}
      														numberOnly={true}
      														value={pickupLane.longitude || ''}
      														onChange={handleChange}
      														inputClassName={styles.moreLeft}
      														required={true}
      														whenFilled={pickupLane.longitude} />
                          </div>
                          <hr/>
  												<div className={styles.moreTop}>
  														<InputText
                                  label={<L p={p} t={`Description (optional)`}/>}
  																id={`description`}
  																name={`description`}
  																size={"long"}
  																maxlength={1000}
  																value={pickupLane.description || ''}
  																onChange={handleChange}
  																inputClassName={styles.moreLeft}/>
  												</div>
  						            <div className={styles.rowRight}>
  														<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  														{pickupLane && pickupLane.pickupLaneDetailId &&
  						                		<ButtonWithIcon label={<L p={p} t={`Clear`}/>} icon={'undo2'} onClick={clearPickupLane} changeRed={true}/>
  														}
  						            </div>
  										</div>
  				            <hr />
  										<div className={styles.headLabel}>
  												{pickupLaneNameChosen}
  										</div>
  				            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.pickupLaneSettings}
  				                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={handlePathLink}/>
  
                      {location.latitude &&
                          <Map google={props.google} zoom={18} style={mapStyles} initialCenter={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                                  yesIWantToUseGoogleMapApiInternals>
                              <Marker onClick={onMarkerClick} position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                                  name={'A different place'} />
                              <Marker onClick={onMarkerClick} position={{ lat: Number(location.latitude+.00004*1), lng: Number(location.longitude) }}
                                  name={'Kenyatta International Convention Centre'} />
                              <InfoWindow
                                  marker={activeMarker}
                                  visible={showingInfoWindow}
                                  onClose={onClose} >
                                  <div>
                                      <h4>{selectedPlace.name}</h4>
                                  </div>
                              </InfoWindow>
                          </Map>
                      }
  								</div>
  						}
              <hr />
              <OneFJefFooter />
              {isShowingModal_removeDetail &&
                  <MessageModal handleClose={handleRemoveDetailClose} heading={<L p={p} t={`Remove this Pickup Lane Entry?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this pick-up lane entry?`}/>} isConfirmType={true}
                     onClick={handleRemoveDetail} />
              }
  						{isShowingModal_removeTable &&
                  <MessageModal handleClose={handleRemoveTableClose} heading={<L p={p} t={`Remove this Pickup Lane Set?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this pick-up lane set and name?`}/>} isConfirmType={true}
                     onClick={handleRemoveTable} />
              }
  						{isShowingModal_newInstructions &&
                  <MessageModal handleClose={handleNewPickupLaneMessageClose} heading={<L p={p} t={`New Pickup Lane`}/>}
                     explainJSX={<L p={p} t={`You can now choose the new pick-up lane level name from the list and define the pick-up lane`}/>}
                     onClick={handleNewPickupLaneMessageClose} />
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
        </div>
      )
}
export default PickupLaneSettingsView
