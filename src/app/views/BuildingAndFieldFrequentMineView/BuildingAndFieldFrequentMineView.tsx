import { useEffect, useState } from 'react'
import * as styles from './BuildingAndFieldFrequentMineView.css'
const p = 'BuildingAndFieldFrequentMineView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import Icon from '../../components/Icon'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

let colorStriping = 0

function BuildingAndFieldFrequentMineView(props) {
  const [isShowingModal_note, setIsShowingModal_note] = useState(false)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal_buildingAndField, setIsShowingModal_buildingAndField] = useState(false)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    
    			document.body.addEventListener('keyup', checkEscapeKey)
    			document.body.addEventListener('click', hideContextMenu)
    	
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			colorStriping = 0
    	
  }, [])

  const {personId, buildingAndFieldTreeExplorer={buildingAndFields: []}, toggleExpanded} = props
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Building and Field Settings`}/>
              </div>
  						<hr/>
              <div onClick={() => handleBuildingAndFieldOpen({}, 'BuildingAndField')} className={classes(styles.newWork, styles.row, styles.link)}>
  								<Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
  								<div className={styles.labelPosition}><L p={p} t={`Add a building`}/></div>
  						</div>
              <hr />
  						<div className={classes(styles.menuItem, styles.row)}>
  								<div className={styles.link} onClick={() => handleToggleAllExpanded(true)}><L p={p} t={`expand all`}/></div>
  								<div className={styles.divider}> | </div>
  								<div className={styles.link} onClick={() => handleToggleAllExpanded(false)}><L p={p} t={`collapse all`}/></div>
  						</div>
  						<div className={globalStyles.instructions}><L p={p} t={`Mark any location below which is a frequent location so that you can choose it quickly when entering a safety alert.`}/></div>
  						<div className={styles.muchLeft}>
  								{buildingAndFieldTreeExplorer.buildingAndFields && buildingAndFieldTreeExplorer.buildingAndFields.length > 0 && buildingAndFieldTreeExplorer.buildingAndFields.map((m, i) =>
  										<div key={i} className={classes(styles.subFolder1, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
  												<div className={styles.row} onClick={() => {toggleExpanded(personId, m.buildingAndFieldId); colorStriping = 0;}}>
  														<div className={styles.checkbox}>
  																<Checkbox
  																		id={m.buildingAndFieldId}
  																		label={''}
  																		checked={m.isFrequentMine || false}
  																		onClick={(event) => handleFrequentMine(event, 'BuildingAndField', m.buildingAndFieldId)}
  																		className={styles.button}/>
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
  																						checked={l.isFrequentMine || false}
  																						onClick={(event) => handleFrequentMine(event, 'BuildingAndFieldLevel', l.buildingAndFieldLevelId)}
  																						className={styles.button}/>
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
  																								checked={e.isFrequentMine || false}
  																								onClick={(event) => handleFrequentMine(event, 'LevelEntrance', e.levelEntranceId)}
  																								className={styles.button}/>
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
  																{l.isExpanded && l.rooms && l.rooms.length > 0 && l.rooms.map((r, i) =>
  																		<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
  																				<div className={styles.checkbox}>
  																						<Checkbox
  																								id={r.roomId}
  																								label={''}
  																								checked={r.isFrequentMine || false}
  																								onClick={(event) => handleFrequentMine(event, 'Room', r.roomId)}
  																								className={styles.button}/>
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
              <OneFJefFooter />
  						{isShowingModal_note &&
  								<MessageModal handleClose={handleNoteViewClose} heading={name} explain={note} onClick={handleNoteViewClose} />
  						}
          </div>
      )
}
export default BuildingAndFieldFrequentMineView
