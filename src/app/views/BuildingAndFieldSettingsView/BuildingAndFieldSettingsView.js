import React, {Component} from 'react';
import styles from './BuildingAndFieldSettingsView.css';
const p = 'BuildingAndFieldSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import Icon from '../../components/Icon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import BuildingAndFieldModal from '../../components/BuildingAndFieldModal';

let colorStriping = 0;

export default class BuildingAndFieldSettingsView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_note: false,
					isShowingModal_delete: false,
					isShowingModal_buildingAndField: false,
	    }
  }

	componentDidMount() {
			document.body.addEventListener('keyup', this.checkEscapeKey);
			document.body.addEventListener('click', this.hideContextMenu);
	}

	componentDidUpdate() {
			colorStriping = 0;
	}

	componentWillUnMount() {
			document.body.removeEventListener('keyup', this.checkEscapeKey);
			document.body.removeEventListener('click', this.hideContextMenu);
	}

	chooseRecord = (chosenRecord) => this.setState({ chosenRecord });

	handleToggleAllExpanded = (expandAll) => {
			const {personId, toggleAllExpanded} = this.props;
			toggleAllExpanded(personId, expandAll);
			colorStriping = 0;
	}

	handleNoteViewOpen = (name, note) => this.setState({ isShowingModal_note: true, name, note });
	handleNoteViewClose = () => this.setState({ isShowingModal_note: false, name: '', note: '' });

	handleBuildingAndFieldOpen = (record, recordType, levelEntrances) => this.setState({ isShowingModal_buildingAndField: true, record, recordType, levelEntrances });
	handleBuildingAndFieldClose = () => {
			const {toggleExpanded, personId} = this.props;
			const {record, recordType} = this.state;
			let forceExpanded = true;
			if (recordType === 'BuildingAndField') {
					toggleExpanded(personId, record.buildingAndFieldId, forceExpanded);
			} else if (recordType === 'BuildingAndFieldLevel') {
					toggleExpanded(personId, record.buildingAndFieldLevelId, forceExpanded);
			} else if (recordType === 'LevelEntrance') {
					toggleExpanded(personId, record.buildingAndFieldLevelId, forceExpanded);
			} else if (recordType === 'Room') {
					toggleExpanded(personId, record.buildingAndFieldLevelId, forceExpanded);
			}
			this.setState({ isShowingModal_buildingAndField: false, record: {}, recordType: '', levelEntrances: [] });
	}
	handleBuildingAndField = () => {
			const {personId, addOrUpdateBuildingAndField, addOrUpdateBuildingAndFielddLevel, addOrUpdateLevelEntrance, addOrUpdateRoom, companyConfig} = this.props;
			const {record, recordType} = this.state;
			record.companyId = companyConfig.companyId;
			if (recordType === 'BuildingAndField') {
					addOrUpdateBuildingAndField(personId, record);
			} else if (recordType === 'BuildingAndFieldLevel') {
					addOrUpdateBuildingAndFielddLevel(personId, record);
			} else if (recordType === 'LevelEntrance') {
					addOrUpdateLevelEntrance(personId, record);
			} else if (recordType === 'Room') {
					addOrUpdateRoom(personId, record);
			}
			this.handleBuildingAndFieldClose();
	}

	handleDeleteOpen = (recordType, recordId) => {
			let name = '';
			let note = '';
			if (recordType === 'BuildingAndField') {
					name = <L p={p} t={`Building and Field`}/>;
					note = <L p={p} t={`Are you sure you want to delete this bulding and field record? All level, entrance and room records belonging to this record will be lost!`}/>;
			} else if (recordType === 'BuildingAndFieldLevel') {
					name = <L p={p} t={`Building and Field Level`}/>;
					note = <L p={p} t={`Are you sure you want to delete this bulding and field level record? All entrance and room records belonging to this record will be lost!`}/>;
			} else if (recordType === 'LevelEntrance') {
					name = <L p={p} t={`Level Entrance`}/>;
					note = <L p={p} t={`Are you sure you want to delete this level entrance record?`}/>;
			} else if (recordType === 'Room') {
					name = <L p={p} t={`Room`}/>;
					note = <L p={p} t={`Are you sure you want to delete this room record?`}/>;
			}
			this.setState({ isShowingModal_delete: true, recordType, recordId, name, note });
	}
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false, recordType: '', recordId: '', name: '', note: '' })
	handleDelete = () => {
			const {personId, deleteRecord} = this.props;
			const {recordType, recordId} = this.state;
			this.handleDeleteClose();
			deleteRecord(personId, recordType, recordId);
	}

	handleAddOrUpdateRecord = (event) => {
			event.stopPropagation();
			event.preventDefault();
			let field = event.target.name;
			let record = this.state.record;
			record[field] = event.target.value
			this.setState({ record });
	}

	handleToggleCheckboxRecord = (fieldName) => {
			let record = this.state.record;
			record[fieldName] = !record[fieldName];
			this.setState({ record });
	}

  render() {
    const {personId, buildingAndFieldTreeExplorer={buildingAndFields: []}, toggleExpanded, mapDirections} = this.props;
    const {isShowingModal_note, isShowingModal_delete, name, note, isShowingModal_buildingAndField, record, recordType, levelEntrances } = this.state;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                Building and Field Settings
            </div>
						<hr/>
            <div onClick={() => this.handleBuildingAndFieldOpen({}, <L p={p} t={`BuildingAndField`}/>)} className={classes(styles.newWork, styles.row, styles.link)}>
								<Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
								<div className={styles.labelPosition}>Add a building or field</div>
						</div>
            <hr />
						<div className={classes(styles.menuItem, styles.row)}>
								<div className={styles.link} onClick={() => this.handleToggleAllExpanded(true)}><L p={p} t={`expand all`}/></div>
								<div className={styles.divider}> | </div>
								<div className={styles.link} onClick={() => this.handleToggleAllExpanded(false)}><L p={p} t={`collapse all`}/></div>
						</div>
						<div className={styles.muchLeft}>
								{buildingAndFieldTreeExplorer.buildingAndFields && buildingAndFieldTreeExplorer.buildingAndFields.length > 0 && buildingAndFieldTreeExplorer.buildingAndFields.map((m, i) =>
										<div key={i} className={classes(styles.subFolder1, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
												<div className={styles.row} onClick={() => {toggleExpanded(personId, m.buildingAndFieldId); colorStriping = 0;}}>
														<Icon pathName={m.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
														<Icon pathName={m.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
														<div className={classes(styles.label, styles.row)} data-rh={'Building name'}>
																<div className={styles.bold}>Building:</div>
																{m.name.length > 75 ? m.name.substring(0,75) + '...' : m.name}
														</div>
														<div className={styles.label} data-rh={'GPS link'}>{m.gpsLink}</div>
														<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => this.handleNoteViewOpen(m.name, m.note)}>{m.note}</div>
														<div onClick={() => this.handleBuildingAndFieldOpen(m, 'BuildingAndField')} data-rh={'Edit this building'}>
																<Icon pathName={'pencil0'} premium={true} className={styles.iconInline} />
														</div>
														<div onClick={() => this.handleBuildingAndFieldOpen({buildingAndFieldId: m.buildingAndFieldId}, 'BuildingAndFieldLevel')} className={classes(styles.newWork, styles.row, styles.link)}>
																<Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
															<div className={styles.labelPosition}><L p={p} t={`Level`}/></div>
														</div>
														<div onClick={() => this.handleDeleteOpen('BuildingAndField', m.buildingAndFieldId)} className={classes(styles.newWork, styles.row, styles.link)} data-rh={'Delete this building'}>
																<Icon pathName={'trash2'} premium={true} className={styles.iconSmaller} fillColor={'red'}/>
															<div className={styles.labelPosition}><L p={p} t={`Building`}/></div>
														</div>
												</div>
												{m.isExpanded && m.levels && m.levels.length > 0 && m.levels.map((l, i) =>
														<div key={i} className={(colorStriping++ % 2 === 0 ? styles.stripe : styles.white)}>
																<div className={classes(styles.row, styles.subFolder2)} onClick={() => {toggleExpanded(personId, l.buildingAndFieldLevelId); colorStriping = 0;}}>
																		<Icon pathName={l.isExpanded ? 'chevron_down' : 'chevron_right'} premium={true} className={styles.iconSmaller} cursor={'pointer'} />
																		<Icon pathName={l.isExpanded ? 'folder_minus_inside' : 'folder_plus_inside'} premium={true} fillColor={'#dba01e'} className={styles.iconTree} cursor={'pointer'} />
																		<div className={classes(styles.label, styles.row)} data-rh={'Level name'}>
																				<div className={styles.bold}><L p={p} t={`Level:`}/></div>
																				{l.name.length > 75 ? l.name.substring(0,75) + '...' : l.name}
																		</div>
																		<div className={styles.label} data-rh={'GPS link'}>{l.gpsLink}</div>
																		<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => this.handleNoteViewOpen(l.name, l.note)}>{l.note}</div>
																		<div onClick={() => this.handleBuildingAndFieldOpen(l, 'BuildingAndFieldLevel')} data-rh={'Edit this level'}>
																				<Icon pathName={'pencil0'} premium={true} className={styles.iconInline} />
																		</div>
																		<div onClick={() => this.handleBuildingAndFieldOpen({buildingAndFieldId: m.buildingAndFieldId, buildingAndFieldLevelId: l.buildingAndFieldLevelId}, 'LevelEntrance')} className={classes(styles.newWork, styles.row, styles.link)}>
																				<Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
																			<div className={styles.labelPosition}><L p={p} t={`Entrance`}/></div>
																		</div>
																		<div onClick={() => this.handleBuildingAndFieldOpen({buildingAndFieldId: m.buildingAndFieldId, buildingAndFieldLevelId: l.buildingAndFieldLevelId}, 'Room', l.entrances)} className={classes(styles.newWork, styles.row, styles.link)}>
																				<Icon pathName={'plus'} className={styles.iconSmaller} fillColor={'green'}/>
																			<div className={styles.labelPosition}><L p={p} t={`Room`}/></div>
																		</div>
																		<div onClick={() => this.handleDeleteOpen('BuildingAndFieldLevel', l.buildingAndFieldLevelId)} className={classes(styles.newWork, styles.row, styles.link)} data-rh={'Delete this level'}>
																				<Icon pathName={'trash2'} premium={true} className={styles.iconSmaller} fillColor={'red'}/>
																			<div className={styles.labelPosition}><L p={p} t={`Level`}/></div>
																		</div>
																</div>
																{l.isExpanded && l.entrances && l.entrances.length > 0 && l.entrances.map((e, i) =>
																		<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))} >
																				<Icon pathName={'door_in'} premium={true} className={styles.iconTree}/>
																				<div className={classes(styles.label, styles.row)} data-rh={'Entrance name'}>
																						<div className={styles.bold}><L p={p} t={`Entrance`}/>:</div>
																						{e.name}
																				</div>
																				<div className={styles.label} data-rh={'Map direction'}>{e.mapDirectionName}</div>
																				<div className={styles.label} data-rh={'Is this door locked during the day?'}>{e.isLockedDuringDay ? <L p={p} t={`Locked`}/> : <L p={p} t={`Not Locked`}/>}</div>
																				<div className={styles.label} data-rh={'GPS link'}>{e.gpsLink}</div>
																				<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => this.handleNoteViewOpen(e.name, e.note)}>{e.note}</div>
																				<div onClick={() => this.handleBuildingAndFieldOpen(e, 'LevelEntrance')} data-rh={'Edit this entrance'}>
																						<Icon pathName={'pencil0'} premium={true} className={styles.iconInline} />
																				</div>
																				<div onClick={() => this.handleDeleteOpen('LevelEntrance', e.levelEntranceId)} className={classes(styles.newWork, styles.row, styles.link)} data-rh={'Delete this entrance'}>
																						<Icon pathName={'trash2'} premium={true} className={styles.iconSmaller} fillColor={'red'}/>
																					<div className={styles.labelPosition}><L p={p} t={`Entrance`}/></div>
																				</div>
																		</div>
																)}
																{l.isExpanded && l.rooms && l.rooms.length > 0 && l.rooms.map((r, i) =>
																		<div key={i} className={classes(styles.row, styles.subFolder3, (colorStriping++ % 2 === 0 ? styles.stripe : styles.white))}>
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
																				<div className={classes(styles.link, styles.label)} data-rh={'Note'} onClick={() => this.handleNoteViewOpen(r.name, r.note)}>{r.note}</div>
																				<div onClick={() => this.handleBuildingAndFieldOpen(r, 'Room', l.entrances)} data-rh={'Edit this room'}>
																						<Icon pathName={'pencil0'} premium={true} className={styles.iconInline} />
																				</div>
																				<div onClick={() => this.handleDeleteOpen('Room', r.roomId)} className={classes(styles.newWork, styles.row, styles.link)} data-rh={'Delete this room'}>
																						<Icon pathName={'trash2'} premium={true} className={styles.iconSmaller} fillColor={'red'}/>
																					<div className={styles.labelPosition}><L p={p} t={`Room`}/></div>
																				</div>
																		</div>
																)}
														</div>
												)}
										</div>
								)}
						</div>
            <OneFJefFooter />
						{isShowingModal_note &&
								<MessageModal handleClose={this.handleNoteViewClose} heading={name} explain={note} onClick={this.handleNoteViewClose} />
						}
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={name} explain={note} isConfirmType={true} onClick={this.handleDelete} />
						}
						{isShowingModal_buildingAndField &&
								<BuildingAndFieldModal handleClose={this.handleBuildingAndFieldClose} heading={record.name} onClick={this.handleBuildingAndField}
										record={record} recordType={recordType} handleChange={this.handleAddOrUpdateRecord} toggleCheckbox={this.handleToggleCheckboxRecord}
										mapDirections={mapDirections} levelEntrances={levelEntrances}/>
						}
        </div>
    )}
};
