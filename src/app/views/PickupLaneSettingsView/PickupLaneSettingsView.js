import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './PickupLaneSettingsView.css';
const p = 'PickupLaneSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import RadioGroup from '../../components/RadioGroup';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export default class PickupLaneSettingsView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
          showingInfoWindow: false,  //Hides or the shows the infoWindow
          activeMarker: {},          //Shows the active marker upon click
          selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker

		      isShowingModal_removeDetail: false,
					isShowingModal_removeTable: false,
					isShowingModal_newInstructions: false,
		      pickupLaneDetailId: '',
		      pickupLane: {},
		      errors: {}
	    }
  }

	componentDidUpdate() {
			const {pickupLaneTables} = this.props;
			const {isInit, pickupLaneTableId} = this.state;
			if (!isInit && pickupLaneTables && pickupLaneTables.length === 1 && (!pickupLaneTableId || pickupLaneTableId === guidEmpty)) {
					this.setState({
							pickupLane: { pickupLaneTableId: pickupLaneTables[0].id },
							isInit: true,
							pickupLaneTableId: pickupLaneTables[0].id,
					});
			}
	}

  handleChange = (event) => {
	    const field = event.target.name;
	    let pickupLane = Object.assign({}, this.state.pickupLane);
	    let errors = Object.assign({}, this.state.errors);
	    pickupLane[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ pickupLane, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdatePickupLaneDetail, personId} = this.props;
      const {pickupLane, errors} = this.state;
			let missingInfoMessage = [];

      if (!pickupLane.positionNumber) {
          this.setState({errors: { ...errors, positionNumber: <L p={p} t={`A position number is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Position number`}/></div>
			}

			if (!pickupLane.latitude) {
          this.setState({errors: { ...errors, latitude: <L p={p} t={`A Latitude is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Latitude`}/></div>
      }

			if (!pickupLane.longitude) {
          this.setState({errors: { ...errors, longitude: <L p={p} t={`A Longitude is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Longitude`}/></div>
      }

      if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
          addOrUpdatePickupLaneDetail(personId, pickupLane);
					//Notice that we are going to preserve the pickupLaneTableId in the pickupLane record below
          this.setState({
              pickupLane: {
									pickupLaneTableId: pickupLane.pickupLaneTableId,
                  positionNumber: '',
                  latitude: '',
                  longitude: '',
                  description: '',
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
  }

	handleNewPickupLaneMessageOpen = () => this.setState({isShowingModal_newInstructions: true })
  handleNewPickupLaneMessageClose = () => this.setState({isShowingModal_newInstructions: false })

  handleRemoveDetailOpen = (pickupLaneDetailId) => this.setState({isShowingModal_removeDetail: true, pickupLaneDetailId })
  handleRemoveDetailClose = () => this.setState({isShowingModal_removeDetail: false })
  handleRemoveDetail = () => {
      const {removePickupLaneDetail, personId} = this.props;
      const {pickupLaneDetailId} = this.state;
      removePickupLaneDetail(personId, pickupLaneDetailId);
      this.handleRemoveDetailClose();
			this.setState({ newPickupLane: false });
  }

	handleRemoveTableOpen = (pickupLaneTableId, event) => this.setState({isShowingModal_removeTable: true, pickupLaneTableId })
  handleRemoveTableClose = () => this.setState({isShowingModal_removeTable: false })
  handleRemoveTable = () => {
      const {removePickupLaneTable, personId} = this.props;
      const {pickupLaneTableId} = this.state;
      removePickupLaneTable(personId, pickupLaneTableId);
      this.handleRemoveTableClose();
			this.setState({ pickupLaneTableId: '' });
  }

	handleEditDetail = (pickupLaneDetailId) => {
			const {pickupLanes} = this.props;
			let pickupLane = pickupLanes && pickupLanes.length > 0 && pickupLanes.filter(m => m.pickupLaneDetailId === pickupLaneDetailId)[0];
			if (pickupLane && pickupLane.positionNumber)
					this.setState({ pickupLane })
	}

	handleEditTable = (pickupLaneTableId, event) => {
			const {pickupLanes} = this.props;
			let pickupLane = pickupLanes && pickupLanes.length > 0 && pickupLanes.filter(m => m.pickupLaneTableId === pickupLaneTableId)[0];
			this.setState({
					newPickupLaneName: pickupLane.pickupLaneName,
					pickupLaneTableId: pickupLane.pickupLaneTableId,
					newPickupLane: true
			})
	}

	handlePickupLaneChoice = (pickupLaneTableId) => {
			const {pickupLanes} = this.props;
			let pickupLaneChosen = pickupLanes && pickupLanes.length > 0 && pickupLanes.filter(m => m.pickupLaneTableId === pickupLaneTableId)[0];
			if (pickupLaneChosen && pickupLaneChosen.pickupLaneName) {
					let pickupLaneNameChosen =pickupLaneChosen.pickupLaneName;
					this.setState({ pickupLaneTableId, pickupLaneNameChosen, pickupLane: { pickupLaneTableId } });
			}
	}

	openAddNewPickupLane = () => this.setState({ newPickupLane: true, pickupLaneTableId: '', pickupLaneDetailId: '' })

	handleNewPickupLaneChange = (event) => {
			let newState = Object.assign({}, this.state);
			let field = event.target.name;
			newState[field] = event.target.value;
			this.setState(newState)
	}

	addOrUpdateNewPickupLane = () => {
			const {personId, addOrUpdatePickupLaneTable, pickupLanes} = this.props;
			const {pickupLaneTableId, newPickupLaneName} = this.state;
			let newState = Object.assign({}, this.state);
			let localPickupLaneName = newState.localPickupLaneName;
			let isDuplicate = pickupLanes && pickupLanes.length > 0 && pickupLanes.filter(m => m.pickupLaneName === localPickupLaneName && m.pickupLaneTableId !== pickupLaneTableId)[0];
			localPickupLaneName = newPickupLaneName ? newPickupLaneName.replace(' ', '') : newPickupLaneName;
			let missingInfoMessage = ``;

			if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else if (isDuplicate) {
					this.setState({ errorPickupLaneName: <L p={p} t={`Duplicate name. Please try again.`}/> })
			} else if (!newPickupLaneName) {
					this.setState({ errorPickupLaneName: <L p={p} t={`Please enter a pick-up lane name`}/> })
			} else {
					addOrUpdatePickupLaneTable(personId, newPickupLaneName, pickupLaneTableId);
					this.setState({ errorPickupLaneName: '', newPickupLaneName: '', newPickupLane: false });
					this.handleNewPickupLaneMessageOpen = () => this.setState({ isShowingModal_newInstructions: true })
			}
	}

	clearPickupLane = () => this.setState({ pickupLane: { pickupLaneDetailId: '', } })

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

  getGPSLocation = () => {
  		if(navigator.geolocation) {
  			   navigator.geolocation.getCurrentPosition(this.displayLocation, this.displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
  		} else {
  			   console.log("Geo Location not supported by browser");
  		}
	}

  displayLocation = (position) => {
  		let pickupLane = Object.assign([], this.state.pickupLane);
      pickupLane.longitude = position.coords.longitude;
      pickupLane.latitude = position.coords.latitude;

      //let googleLoc = new this.props.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  		this.setState({ pickupLane });
	}

  displayError = (error) => {
			let errors = [<L p={p} t={`Unknown error`}/>, <L p={p} t={`Persmission denied by user`}/>, <L p={p} t={`Position not available`}/>, <L p={p} t={`timeout error`}/>];
			this.setState({ message: errors[error.code] + ', ' + error.message })
	}

  render() {
    const {pickupLanes, pickupLaneTables, fetchingRecord, positionNumbers} = this.props;
    const {pickupLane={}, isShowingModal_removeDetail, pickupLaneTableId, newPickupLane, newPickupLaneName, errorPickupLaneName, isShowingModal_newInstructions,
            isShowingModal_removeTable, pickupLaneNameChosen, isShowingModal_missingInfo, messageInfoIncomplete,} = this.state;

    let headings = [{}, {},
				{label: <L p={p} t={`Position`}/>, tightText: true},
				{label: <L p={p} t={`Latitude`}/>, tightText: true},
				{label: <L p={p} t={`Longitude`}/>, tightText: true},
				{label: <L p={p} t={`Description`}/>, tightText: true}
		];

    let data = [];

    data = pickupLanes && pickupLanes.length > 0 && pickupLanes.filter(m => m.pickupLaneTableId === pickupLaneTableId).reduce((acc, m) => {
				if (m.positionNumber) {
						let row = [
								{value: <a onClick={() => this.handleEditDetail(m.pickupLaneDetailId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
								{value: <a onClick={() => this.handleRemoveDetailOpen(m.pickupLaneDetailId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
								{value: m.positionNumber},
								{value: m.latitude},
								{value: m.longitude},
								{value: m.description},
				    ];
						acc = acc && acc.length > 0 ? acc.concat([row]) : [row];
				}
				return acc;
		},[]);

    if (!(data && data.length > 0)) data = [[{value: ''}, {value: <i>No pick-up lanes entered yet.</i>, colSpan: 5 }]]

		let localPickupLaneTables = pickupLaneTables && pickupLaneTables.length > 0 && pickupLaneTables.reduce((acc, m) => {
				if (m.label) {
						let option = {
								id: m.id,
								label: <div className={styles.row}>
													{m.label}
													<div onClick={(event) => this.handleEditTable(m.id, event)} className={classes(globalStyles.link, styles.moreLeft, styles.moreRight)}>
															edit
													</div>
													<div onClick={(event) => this.handleRemoveTableOpen(m.id, event)} className={classes(globalStyles.link, styles.remove)}>
															remove
													</div>
											</div>
							}
							acc = acc && acc.length > 0 ? acc.concat(option) : [option];
				}
				return acc;
		}, []);

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
								onClick={this.handlePickupLaneChoice}/>
						<div className={classes(styles.row, styles.moveLeftMuch)} onClick={this.openAddNewPickupLane}>
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
																onChange={this.handleNewPickupLaneChange}
																required={true}
																whenFilled={newPickupLaneName}
																error={errorPickupLaneName} />
												</div>
												<div className={styles.buttonSetting}>
														<ButtonWithIcon label={<L p={p} t={`Start`}/>} icon={'checkmark_circle'} onClick={this.addOrUpdateNewPickupLane}/>
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
                                onChange={this.handleChange}
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
                            <ButtonWithIcon label={<L p={p} t={`Set GPS Location`}/>} icon={'checkmark_circle'} onClick={(event) => this.getGPSLocation()}/>
                        </div>
                        <div className={styles.rowWrap}>
    												<InputText
                                label={<L p={p} t={`Latitude`}/>}
    														id={`latitude`}
    														name={`latitude`}
    														size={"medium-short"}
    														numberOnly={true}
    														value={pickupLane.latitude || ''}
    														onChange={this.handleChange}
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
    														onChange={this.handleChange}
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
																onChange={this.handleChange}
																inputClassName={styles.moreLeft}/>
												</div>
						            <div className={styles.rowRight}>
														<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
														{pickupLane && pickupLane.pickupLaneDetailId &&
						                		<ButtonWithIcon label={<L p={p} t={`Clear`}/>} icon={'undo2'} onClick={this.clearPickupLane} changeRed={true}/>
														}
						            </div>
										</div>
				            <hr />
										<div className={styles.headLabel}>
												{pickupLaneNameChosen}
										</div>
				            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.pickupLaneSettings}
				                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={this.handlePathLink}/>

                    {location.latitude &&
                        <Map google={this.props.google} zoom={18} style={mapStyles} initialCenter={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                                yesIWantToUseGoogleMapApiInternals>
                            <Marker onClick={this.onMarkerClick} position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                                name={'A different place'} />
                            <Marker onClick={this.onMarkerClick} position={{ lat: Number(location.latitude+.00004*1), lng: Number(location.longitude) }}
                                name={'Kenyatta International Convention Centre'} />
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}
                                onClose={this.onClose} >
                                <div>
                                    <h4>{this.state.selectedPlace.name}</h4>
                                </div>
                            </InfoWindow>
                        </Map>
                    }
								</div>
						}
            <hr />
            <OneFJefFooter />
            {isShowingModal_removeDetail &&
                <MessageModal handleClose={this.handleRemoveDetailClose} heading={<L p={p} t={`Remove this Pickup Lane Entry?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this pick-up lane entry?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveDetail} />
            }
						{isShowingModal_removeTable &&
                <MessageModal handleClose={this.handleRemoveTableClose} heading={<L p={p} t={`Remove this Pickup Lane Set?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this pick-up lane set and name?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveTable} />
            }
						{isShowingModal_newInstructions &&
                <MessageModal handleClose={this.handleNewPickupLaneMessageClose} heading={<L p={p} t={`New Pickup Lane`}/>}
                   explainJSX={<L p={p} t={`You can now choose the new pick-up lane level name from the list and define the pick-up lane`}/>}
                   onClick={this.handleNewPickupLaneMessageClose} />
            }
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
      </div>
    );
  }
}
