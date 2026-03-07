import React, {Component} from 'react'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './GeoLocationView.css'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import {doSort} from '../../utils/sort'
//import { withAlert } from 'react-alert';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react'

const mapStyles = {
  width: '100%',
  height: '100%'
}

export function GeoLocationView(props) {
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace] = useState({})
  const [trackId, setTrackId] = useState('')
  const [locations, setLocations] = useState([])
  const [location, setLocation] = useState({
							latitude: '',
							longitude: '',
							accuracy: '',
							altitudeAccuracy: '',
							heading: '',
							speed: '',
					})
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [accuracy, setAccuracy] = useState('')
  const [altitudeAccuracy, setAltitudeAccuracy] = useState('')
  const [heading, setHeading] = useState('')
  const [speed, setSpeed] = useState('')
  const [message, setMessage] = useState(undefined)
  const [tracking, setTracking] = useState(undefined)

  useEffect(() => {
    
    			getLocation()
    	
  }, [])

  const onMarkerClick = (props, marker, e) => {
    return setSelectedPlace(props); setActiveMarker(marker); setShowingInfoWindow(true)
  }

  const getLocation = () => {
    
    		if(navigator.geolocation) {
    			navigator.geolocation.getCurrentPosition(displayLocation, displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
    		} else {
    			console.log("Geo Location not supported by browser")
    		}
    	
  }

  const displayLocation = (position) => {
    
    		let location = {
    			longitude: position.coords.longitude,
    			latitude: position.coords.latitude,
    			accuracy: position.coords.accuracy,
    			altitudeAccuracy: position.coords.altitudeAccuracy,
    			heading: position.coords.heading,
    			speed: position.coords.speed,
          timeStamp: position.timeStamp,
    		}
    
    		let googleLoc = new props.google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    		locations = locations && locations.length > 0 ? locations.concat(googleLoc) : [googleLoc]
    
    
    		setLocation(location); setLocations(locations)
    	
  }

  const displayError = (error) => {
    
    			let errors = ['Unknown error', 'Persmission denied by user', 'Position not available', 'timeout error']
    			setMessage(errors[error.code] + '); set' + error.message(' + error.message)
    	
  }

  const trackMe = () => {
    
    			setTrackId(navigator.geolocation.watchPosition(displayLocation, displayError))
    	
  }

  const clearTracking = () => {
    
    		
    		if (trackId) {
    				navigator.geolocation.clearWatch(trackId)
    				setTrackId(null)
    		}
    	
  }

  const computeTotalDistance = () => {
    
    			
    			let totalDistance = 0
    
    			if (locations.length > 1) {
    					for (let i = 1; i < locations.length; i++) {
    							totalDistance += new props.google.maps.geometry.spherical.computeDistanceBetween(locations[i-1], locations[i])
    					}
    			}
    			setTotalDistance(totalDistance)
    	
  }

  const toggleTrackMe = (e) => {
    
    			
    			let distance =  ''
    			e.preventDefault()
    			if (!tracking) {
    					trackMe()
    			} else {
    				clearTracking()
    				let d = computeTotalDistance()
    				if (d > 0) {
    					d = Math.round(d * 1000) / 1000
    					let miles = d/1.6
    					distance = <div>Total distance traveled: {d}km<br/>Total distance traveled: {miles}m</div>
    				} else {
    					distance = "You didn't travel anywhere at all."
    				}
    			}
    			setTracking(!tracking); setDistance(distance)
    	
  }

      locations = doSort(locations, { sortField: 'timeStamp', isAsc: true, isNumber: false })
  
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
                              google={props.google}
                              zoom={14}
                              style={style}
                              initialCenter={{ lat: location.latitude, lng: location.longitude }}
                            >
                              <Marker
                                onClick={onMarkerClick}
                                name={'Kenyatta International Convention Centre'}
                              />
                                <InfoWindow
                                marker={activeMarker}
                                visible={showingInfoWindow}
                                onClose={onClose}
                              >
                                <div>
                                  <h4>{selectedPlace.name}</h4>
                                </div>
                              </InfoWindow>
                            </Map>
    						<div>{distance}</div>
  						<div>{`Error: ${message}`}</div>
  						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
  								<ButtonWithIcon label={trackId ? 'Stop' : 'Start'} icon={trackId ? 'cross_circle' : 'checkmark_circle'} onClick={trackMe}
  										changeRed={trackId}/>
  						</div>
  						<OneFJefFooter />
        	</div>
      )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(GeoLocationView)
