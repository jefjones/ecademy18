import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './GeoLocationView.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import {doSort} from '../../utils/sort.js';
//import { withAlert } from 'react-alert';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class GeoLocationView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
          showingInfoWindow: false,  //Hides or the shows the infoWindow
          activeMarker: {},          //Shows the active marker upon click
          selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker

					trackId: '',
					locations: [],
					location: {
							latitude: '',
							longitude: '',
							accuracy: '',
							altitudeAccuracy: '',
							heading: '',
							speed: '',
					}
	    }
  }

	componentDidMount() {
			this.getLocation();
	}

  onMarkerClick = (props, marker, e) =>
      this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
      });

  onClose = props => {
      if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
      }
  };

	getLocation = () => {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.displayLocation, this.displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
		} else {
			console.log("Geo Location not supported by browser");
		}
	}

	displayLocation = (position) => {
		let locations = Object.assign([], this.state.locations);
		let location = {
			longitude: position.coords.longitude,
			latitude: position.coords.latitude,
			accuracy: position.coords.accuracy,
			altitudeAccuracy: position.coords.altitudeAccuracy,
			heading: position.coords.heading,
			speed: position.coords.speed,
      timeStamp: position.timeStamp,
		}

		let googleLoc = new this.props.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		locations = locations && locations.length > 0 ? locations.concat(googleLoc) : [googleLoc];


		this.setState({location, locations})
	}

	displayError = (error) => {
			let errors = ['Unknown error', 'Persmission denied by user', 'Position not available', 'timeout error'];
			this.setState({ message: errors[error.code] + ', ' + error.message })
	}

	trackMe = () => {
			this.setState({ trackId: navigator.geolocation.watchPosition(this.displayLocation, this.displayError) });
	}

	clearTracking = () => {
		const {trackId} = this.state;
		if (trackId) {
				navigator.geolocation.clearWatch(trackId);
				this.setState({ trackId: null });
		}
	}

	computeTotalDistance = () => {
			const {locations} = this.state;
			let totalDistance = 0;

			if (locations.length > 1) {
					for (let i = 1; i < locations.length; i++) {
							totalDistance += new this.props.google.maps.geometry.spherical.computeDistanceBetween(locations[i-1], locations[i]);
					}
			}
			this.setState({ totalDistance });
	}

	toggleTrackMe = (e) => {
			const {tracking} = this.state;
			let distance =  ''
			e.preventDefault();
			if (!tracking) {
					this.trackMe();
			} else {
				this.clearTracking();
				let d = this.computeTotalDistance();
				if (d > 0) {
					d = Math.round(d * 1000) / 1000;
					let miles = d/1.6;
					distance = <div>Total distance traveled: {d}km<br/>Total distance traveled: {miles}m</div>
				} else {
					distance = "You didn't travel anywhere at all.";
				}
			}
			this.setState({ tracking: !this.state.tracking, distance });
	};

  render() {
    const {trackId, distance, location={}, message} = this.state;
		let locations= Object.assign([], this.state.locations);

    locations = doSort(locations, { sortField: 'timeStamp', isAsc: true, isNumber: false });

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								Geo Location
						</div>
        						<div>
        								<div>{`latitude: ${location.latitude}`}</div>
        								<div>{`longitude: ${location.longitude}`}</div>
        								<div>{`accuracy: ${location.accuracy}`}</div>
        								<div>{`altitudeAccuracy: ${location.altitudeAccuracy}`}</div>
        								<div>{`heading: ${location.heading}`}</div>
                        <div>{`speed: ${location.speed}`}</div>
        								<div>{`timeStamp: ${location.timeStamp}`}</div>

        						</div>
                    <Map
                            google={this.props.google}
                            zoom={14}
                            style={style}
                            initialCenter={{ lat: location.latitude, lng: location.longitude }
                          >
                            <Marker
                              onClick={this.onMarkerClick}
                              name={'Kenyatta International Convention Centre'}
                            />
                              <InfoWindow
                              marker={this.state.activeMarker}
                              visible={this.state.showingInfoWindow}
                              onClose={this.onClose}
                            >
                              <div>
                                <h4>{this.state.selectedPlace.name}</h4>
                              </div>
                            </InfoWindow>
                          </Map>
  						<div>{distance}</div>
						<div>{`Error: ${message}`}</div>
						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
								<ButtonWithIcon label={trackId ? 'Stop' : 'Start'} icon={trackId ? 'cross_circle' : 'checkmark_circle'} onClick={this.trackMe}
										changeRed={trackId}/>
						</div>
						<OneFJefFooter />
      	</div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(GeoLocationView)
