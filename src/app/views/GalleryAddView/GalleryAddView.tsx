import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import axios from 'axios'
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
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
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

  }
  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false)

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
    
  }

  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setFileUpload({})
    
  }

  const handleShowGPSOpen = (galleryFileChosen) => {
    return setIsShowingModal_gps(true); setGalleryFileChosen(galleryFileChosen)
  }

  const handleShowGPSClose = () => {
    return setIsShowingModal_gps(false); setGalleryFileChosen({})
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(GalleryAddView)
