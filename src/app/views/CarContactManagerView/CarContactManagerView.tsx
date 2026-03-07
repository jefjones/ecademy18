import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import axios from 'axios'
import * as styles from './CarContactManagerView.css'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import InputText from '../../components/InputText'
import Loading from '../../components/Loading'
import ImageDisplay from '../../components/ImageDisplay'
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop'
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
import DateMoment from '../../components/DateMoment'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import {guidEmpty} from '../../utils/guidValidate'
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react'
import {formatPhoneNumber} from '../../utils/numberFormat'

const mapStyles = {
  width: '100%',
  height: '100%'
}

function CarContactManagerView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [carContactId, setCarContactId] = useState('')
  const [carContact, setCarContact] = useState({
          carContactId: '',
          ownerName: '',
          address: '',
          contactName: '',
          role: '',
          emailAddress: '',
          phoneNumber: '',
          returnDate: '',
          note: '',
          usStateId: props.personConfig.choices['CarContact_usStateId'],
      })
  const [ownerName, setOwnerName] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [role, setRole] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [note, setNote] = useState('')
  const [usStateId, setUsStateId] = useState(props.personConfig.choices['CarContact_usStateId'])
  const [errors, setErrors] = useState({
        ownerName: '',
        contactName: '',
      })
  const [filters, setFilters] = useState({
        ownerNameFilter: '',
        contactNameFilter: '',
        openSearch: '',
      })
  const [ownerNameFilter, setOwnerNameFilter] = useState('')
  const [contactNameFilter, setContactNameFilter] = useState('')
  const [openSearch, setOpenSearch] = useState('')
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace] = useState({}) //Shows the infoWindow to the selected place upon a marker
  const [expanded, setExpanded] = useState(undefined)
  const [files, setFiles] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [hasChangedExpanded, setHasChangedExpanded] = useState(undefined)
  const [loadingFile, setLoadingFile] = useState(undefined)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(undefined)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(undefined)
  const [isShowingModal_document, setIsShowingModal_document] = useState(undefined)
  const [fileUpload, setFileUpload] = useState(undefined)
  const [isShowingModal_gps, setIsShowingModal_gps] = useState(undefined)
  const [carContactChosen, setCarContactChosen] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [errorPhone, setErrorPhone] = useState(undefined)

  useEffect(() => {
    
        //document.getElementById('returnDate').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
      
  }, [])

  const changeContact = (event) => {
    
          const {setPersonConfigChoice, personId} = props
    	    const field = event.target.name
    	    let carContact = Object.assign({},carContact)
    	    let errors = Object.assign({}, errors)
    	    carContact[field] = event.target.value
    	    errors[field] = ''
          if (field === 'usStateId') setPersonConfigChoice(personId, 'CarContact_usStateId', event.target.value)
    
    	    setCarContact(carContact); setErrors(errors)
      
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateCarContact, personId, personConfig} = props
          
          let hasError = false
    
          // if (!carContact.ownerName) {
          //     hasError = true;
          //     setErrors({ ...errors, ownerName: "Owner name is required" });
          // }
          // if (!carContact.contactName) {
          //     hasError = true;
          //     setErrors({ ...errors, contactName: "Contact name is required" });
          // }
          // if (!carContact.usStateId) {
          //     hasError = true;
          //     setErrors({ ...errors, usStateId: "US State is required" });
          // }
    
          if (!hasError) {
              if (carContact.returnDate && carContact.returnDate.indexOf('T') > -1) carContact.returnDate = carContact.returnDate.substring(0, carContact.returnDate.indexOf('T'))
              if (carContact.returnDate && carContact.returnTime) {
                  carContact.returnDate = carContact.returnDate + ' ' + carContact.returnTime
              }
              delete carContact.returnTime
              addOrUpdateCarContact(personId, carContact)
              setExpanded(''); setCarContact({
                    carContactId: '',
                    ownerName: '',
                    address: '',
                    contactName: '',
                    role: '',
                    emailAddress: '',
                    phoneNumber: '',
                    returnDate: '',
                    note: '',
                    files: [],
                    selectedFile: '',
                    usStateId: personConfig.choices['CarContact_usStateId'],
                  })
    					if (stayOrFinish === "FINISH") {
    		          navigate(`/firstNav`)
    		      }
          }
      
  }

  const handleRemoveItemOpen = (carContactId) => {
    return setIsShowingModal_remove(true); setCarContactId(carContactId)

  }
  const handleRemoveItemClose = () => {
    return setIsShowingModal_remove(false); setCarContactId('')

  }
  const handleRemoveItem = () => {
    
          const {removeCarContact, personId} = props
          
          removeCarContact(personId, carContactId)
          handleRemoveItemClose()
      
  }

  const handleEdit = (carContactId) => {
    
    			const {carContacts} = props
    			if (carContact && carContact.returnDate) {
    					carContact.returnTime = carContact.returnDate.indexOf('T') > -1 ? carContact.returnDate.substring(carContact.returnDate.indexOf('T') + 1) : carContact.returnDate
    			}
          setCarContact(carContact)
    			handleExpansionChange('panel1')(event, true)
          document.getElementById('ownerName').focus()
    	
  }

  const changeDate = (field, event) => {
    
        setCarContact(carContact)
    	
  }

  const cancelAddNew = () => {
    
        setExpanded(''); setCarContact({
              carContactId: '',
              ownerName: '',
              address: '',
              contactName: '',
              role: '',
              emailAddress: '',
              phoneNumber: '',
              returnDate: '',
              note: '',
              files: [],
              selectedFile: '',
            })
      
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
    
          let carContactId = carContact.carContactId && carContact.carContactId !== '0' ? carContact.carContactId : guidEmpty
    
          let url = `${apiHost}ebi/carContact/fileUpload/${personId}/${carContactId}`
    
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
                  let newCarContact = Object.assign({}, carContact)
                  if (!newCarContact) newCarContact = {}
                  if (!newCarContact.carContactId || newCarContact.carContactId === '0') {
                      newCarContact.carContactId = response.data.carContactId
                  }
                  setCarContact(newCarContact); setFiles(response.data.files); setLoadingFile(false)
              })
              .catch(function (error) {
                //Show error here.
              })
          handleFileUploadClose()
      
  }

  const handleFileUploadOpen = () => {
    return setIsShowingFileUpload(true); setLoadingFile(true)

  }
  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false)

  }
  const handleFileUploadSubmit = () => {
    
          const {personId} = props
          
          let data = new FormData()
          data.append('file', selectedFile)
    
          let carContactId = carContact.carContactId && carContact.carContactId !== '0' ? carContact.carContactId : guidEmpty
    
          let url = `${apiHost}ebi/carContact/fileUpload/${personId}/${carContactId}`
    
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
                  let newCarContact = Object.assign({}, carContact)
                  if (!newCarContact) newCarContact = {}
                  if (!newCarContact.carContactId || newCarContact.carContactId === '0') {
                      newCarContact.carContactId = response.data.carContactId
                  }
                  setCarContact(newCarContact); setFiles(response.data.files); setLoadingFile(false)
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
    
          const {removeCarContactFileUpload, personId} = props
          
          handleRemoveFileUploadClose()
          removeCarContactFileUpload(personId, fileUpload.fileUploadId)
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

  const handleShowGPSOpen = (carContactChosen) => {
    return setIsShowingModal_gps(true); setCarContactChosen(carContactChosen)
  }

  const handleShowGPSClose = () => {
    setIsShowingModal_gps(false); setCarContactChosen({})
  }

  return null // TODO: restore JSX render output
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(CarContactManagerView)
