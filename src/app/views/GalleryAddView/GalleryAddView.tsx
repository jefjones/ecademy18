import { useState } from 'react'
import {apiHost} from '../../api_host'
import axios from 'axios'
import { navigate, navigateReplace, goBack } from './'
import styles from './GalleryAddView.css'
import globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import Loading from '../../components/Loading'
import ImageDisplay from '../../components/ImageDisplay'
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import DateTimePicker from '../../components/DateTimePicker'
import InputFile from '../../components/InputFile'
import InputTextArea from '../../components/InputTextArea'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import {guidEmpty} from '../../utils/guidValidate'
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react'
import {formatPhoneNumber} from '../../utils/numberFormat'

const mapStyles = {
  width: '100%',
  height: '100%'
}

function GalleryAddView(props) {
  const [galleryFile, setGalleryFile] = useState(undefined)
  const [errors, setErrors] = useState(undefined)
  const [file, setFile] = useState(undefined)
  const [galleryFileId, setGalleryFileId] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [expireDate, setExpireDate] = useState(undefined)
  const [latitude, setLatitude] = useState(undefined)
  const [longitude, setLongitude] = useState(undefined)
  const [hide, setHide] = useState(undefined)
  const [files, setFiles] = useState(undefined)
  const [loadingFile, setLoadingFile] = useState(undefined)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [isShowingModal_document, setIsShowingModal_document] = useState(undefined)
  const [fileUpload, setFileUpload] = useState(undefined)
  const [isShowingModal_gps, setIsShowingModal_gps] = useState(undefined)
  const [galleryFileChosen, setGalleryFileChosen] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [selectedPlace, setSelectedPlace] = useState(undefined)
  const [activeMarker, setActiveMarker] = useState(undefined)
  const [showingInfoWindow, setShowingInfoWindow] = useState(undefined)
  const [errorPhone, setErrorPhone] = useState(undefined)
  const [phoneNumber, setPhoneNumber] = useState(undefined)

  const resetRecord = () => {
    
          state = {
              isShowingModal_remove: false,
              galleryFileId: '',
              gallaryFile: {
                  galleryFileId: '',
                  fileUrl: '',
                  description: '',
                  expireDate: '',
                  latitude: '',
                  longitude: '',
                  hide: '',
                  personAssign: [],
                  classAssign: [],
                  personInPicture: [],
                  parentAccess: [],
                  courseInPicture: [],
              },
              errors: {
                  file: '',
              },
          }
      
  }

  const changeRecord = (event) => {
    
    	    const field = event.target.name
    	    let galleryFile = Object.assign({},galleryFile)
    	    let errors = Object.assign({}, errors)
    	    galleryFile[field] = event.target.value
    	    errors[field] = ''
    	    setGalleryFile(galleryFile); setErrors(errors)
      
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateGalleryFile, personId} = props
          
          let hasError = false
    
          if (!galleryFile.file) {
              hasError = true
              setErrors({ ...errors, file: "A picture is required" })
          }
    
          if (!hasError) {
              addOrUpdateGalleryFile(personId, galleryFile)
              setGalleryFile({
                      galleryFileId: '',
                      fileUrl: '',
                      description: '',
                      expireDate: '',
                      latitude: '',
                      longitude: '',
                      hide: '',
                      // personAssign: [],  Don't reset these unless you do a reset for the page.  Then the user can take more than oen picture with the same settings.
                      // classAssign: [],
                      // personInPicture: [],
                      // parentAccess: [],
                      // courseInPicture: [],
                  })
    					if (stayOrFinish === "FINISH") {
    		          navigate(`/firstNav`)
    		      }
          }
      
  }

  const changeDate = (field, event) => {
    
        let galleryFile = Object.assign({}, galleryFile)
        galleryFile[field] = event.target.value
        setGalleryFile(galleryFile)
    	
  }

  const handlePartialOwnerEnterKey = (event) => {
    
          event.key === "Enter" && setPartialOwnerText()
      
  }

  const handleFilterChnage = ({target}) => {
    
        let filter = Object.assign({},state.filter)
        filter[target.name] = target.value
        setFilter(filter)
      
  }

  const handleInputFile = (selectedFile) => {
    
          const {personId} = props
          
          let data = new FormData()
          data.append('file', selectedFile)
    
          let galleryFileId = galleryFile.galleryFileId && galleryFile.galleryFileId !== '0' ? galleryFile.galleryFileId : guidEmpty
    
          let url = `${apiHost}ebi/galleryFile/fileUpload/${personId}/${galleryFileId}`
    
          axios.post(url, data,
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Credentials' : 'true',
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                  "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                  "Authorization": "Bearer " + localStorage.getItem("authToken"),
              }})
              .then(response => {
                  let newGalleryFile = Object.assign({}, galleryFile)
                  if (!newGalleryFile) newGalleryFile = {}
                  if (!newGalleryFile.galleryFileId || newGalleryFile.galleryFileId === '0') {
                      newGalleryFile.galleryFileId = response.data.galleryFileId
                  }
                  setGalleryFile(newGalleryFile); setFiles(response.data.files); setLoadingFile(false)
              })
              .catch(function (error) {
                //Show error here.
              })
          handleFileUploadClose()
      
  }

  const handleRemoveFileUploadOpen = (fileUpload) => {
    return setIsShowingModal_removeFileUpload(true); setFileUpload(fileUpload)
      handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false)
      handleRemoveFileUpload = () => {
          const {removeGalleryFileUpload, personId} = props
  }

  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false)
      handleRemoveFileUpload = () => {
          const {removeGalleryFileUpload, personId} = props
  }

  const handleRemoveFileUpload = () => {
    
          const {removeGalleryFileUpload, personId} = props
          
          handleRemoveFileUploadClose()
          removeGalleryFileUpload(personId, fileUpload.fileUploadId)
          let files = Object.assign([], files)
          files = files.filter(m => m.fileUploadId !== fileUpload.fileUploadId)
          setFiles(files)
      
  }

  const handleDocumentOpen = (fileUpload) => {
    return setIsShowingModal_document(true); setFileUpload(fileUpload)
      handleDocumentClose = () => setIsShowingModal_document(false); setFileUpload({})
    
      handleShowGPSOpen = (galleryFileChosen) => setIsShowingModal_gps(true); setGalleryFileChosen(galleryFileChosen)
  }

  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setFileUpload({})
    
      handleShowGPSOpen = (galleryFileChosen) => setIsShowingModal_gps(true); setGalleryFileChosen(galleryFileChosen)
  }

  const handleShowGPSOpen = (galleryFileChosen) => {
    return setIsShowingModal_gps(true); setGalleryFileChosen(galleryFileChosen)
  }

  const handleShowGPSClose = () => {
    return setIsShowingModal_gps(false); setGalleryFileChosen({})
    
      getGPSLocation = () => {
      		if(navigator.geolocation) {
      			   navigator.geolocation.getCurrentPosition(displayLocation, displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
  }

  const getGPSLocation = () => {
    
      		if(navigator.geolocation) {
      			   navigator.geolocation.getCurrentPosition(displayLocation, displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
      		} else {
      			   console.log("Geo Location not supported by browser")
      		}
    	
  }

  const displayLocation = (position) => {
    
      		let galleryFile = Object.assign([], galleryFile)
          galleryFile.longitude = position.coords.longitude
          galleryFile.latitude = position.coords.latitude
      		setGalleryFile(galleryFile)
    	
  }

  const displayError = (error) => {
    
    			let errors = ['Unknown error', 'Persmission denied by user', 'Position not available', 'timeout error']
    			setMessage(errors[error.code] + '); set' + error.message(' + error.message)
    	
  }

  const onMarkerClick = (props, marker, e) => {
    return setSelectedPlace(props); setActiveMarker(marker); setShowingInfoWindow(true)
  }

  const handleFormatPhone = () => {
    
          
          if (galleryFile.phoneNumber && ('' + galleryFile.phoneNumber).replace(/\D/g, '').length !== 10) {
              setErrorPhone(`The phone number entered is not 10 digits`)
          } else if (formatPhoneNumber(galleryFile.phoneNumber)) {
              setErrorPhone(''); setGalleryFile({...galleryFile, phoneNumber: formatPhoneNumber(galleryFile.phoneNumber)})
          }
      
  }

  const {personId, myFrequentPlaces, setMyFrequentPlace} = props
      const {galleryFile={}, errors, isShowingModal_gps, isShowingModal_removeFileUpload, files, galleryFileChosen={}} = state
  
      return (
          <div className={styles.container}>
              <div className={classes(styles.moreBottom, globalStyles.pageTitle)}>
                  {'Add Gallery Photo'}
              </div>
  						<div className={classes(styles.row, styles.littleLeft)}>
  								<InputText
  										name={'description'}
  										value={galleryFile.description || ''}
  										label={'Owner'}
  										maxLength={150}
  										size={'medium-long'}
  										onChange={changeRecord}
                      error={errors.description}/>
  						</div>
              <div className={styles.row}>
                  <div>
                      <ButtonWithIcon label={'Set GPS Location'} icon={'checkmark_circle'} onClick={(event) => getGPSLocation()}/>
                  </div>
  								<InputText
                      label={"Latitude"}
  										id={`latitude`}
  										name={`latitude`}
  										size={"medium-short"}
  										numberOnly={true}
  										value={galleryFile.latitude || ''}
  										onChange={handleChange}
  										inputClassName={styles.moreLeft} />
  								<InputText
                      label={"Longitude"}
  										id={`longitude`}
  										name={`longitude`}
  										size={"medium-short"}
  										numberOnly={true}
  										value={galleryFile.longitude || ''}
  										onChange={handleChange}
  										inputClassName={styles.moreLeft} />
              </div>
              {/*
                student lists and parent lists here.
              */}
              <div>
                  <InputFile label={'Add a picture'} isCamera={true} onChange={handleInputFile} isResize={true}/>
  								{files && files.length > 0 && files.map((f, i) =>
  										<div key={i}>
  												<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId} fileUploadId={f.fileUploadId}
  														deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={galleryFile.galleryFileId}/>
  										</div>
  								)}
  						</div>
              <div className={styles.dateTime}>
                  <DateTimePicker id={`expireDate`} label={'Return date'} value={galleryFile.expireDate || ''} onChange={(event) => changeDate('expireDate', event)}/>
              </div>
              <div className={classes(styles.row, styles.lotLeft)}>
  								<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={'Add Gallery Photo'} path={'gallaryAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={`Remove this gallery photo?`}
                     explain={`Are you sure you want to delete this gallery photo?`} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
              {isShowingModal_gps &&
                  <MessageModal handleClose={handleShowGPSClose} heading={galleryFileChosen.description}
    									explainJSX={<div style={{width: '320px', height: '320px'}}>
                                     <Map google={props.google} zoom={14} style={mapStyles} initialCenter={{ lat: galleryFileChosen.latitude, lng: galleryFileChosen.longitude }}>
                                        <Marker onClick={onMarkerClick} name={galleryFileChosen.description} />
                                        <InfoWindow marker={activeMarker} visible={showingInfoWindow} onClose={onClose} >
                                            <div>
                                              <h4>{selectedPlace.name}</h4>
                                            </div>
                                        </InfoWindow>
                                    </Map>
                                </div>
                      }
    									onClick={handleShowGPSClose}/>
              }
  				</div>
      )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(GalleryAddView)
