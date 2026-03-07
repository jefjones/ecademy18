import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import axios from 'axios'
import * as styles from './SchoolContactManagerView.css'
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

function SchoolContactManagerView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [schoolContactId, setSchoolContactId] = useState('')
  const [schoolContact, setSchoolContact] = useState({
          schoolContactId: '',
          schoolName: '',
          address: '',
          contactName: '',
          role: '',
          emailAddress: '',
          phoneNumber: '',
          returnDate: '',
          note: '',
          usStateId: props.personConfig.choices['SchoolContact_usStateId'],
      })
  const [schoolName, setSchoolName] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [role, setRole] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [note, setNote] = useState('')
  const [usStateId, setUsStateId] = useState(props.personConfig.choices['SchoolContact_usStateId'])
  const [errors, setErrors] = useState({
        schoolName: '',
        contactName: '',
      })
  const [filters, setFilters] = useState({
        schoolName: '',
        contactName: '',
        openSearch: '',
      })
  const [openSearch, setOpenSearch] = useState('')
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace] = useState({}) // Shows the infoWindow to the selected place upon a marker
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
  const [schoolContactChosen, setSchoolContactChosen] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [errorPhone, setErrorPhone] = useState(undefined)

  useEffect(() => {
    
        //document.getElementById('returnDate').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
      
  }, [])

  const changeContact = (event) => {
    
          const {setPersonConfigChoice, personId} = props
    	    const field = event.target.name
    	    let schoolContact = Object.assign({},schoolContact)
    	    let errors = Object.assign({}, errors)
    	    schoolContact[field] = event.target.value
    	    errors[field] = ''
          if (field === 'usStateId') setPersonConfigChoice(personId, 'SchoolContact_usStateId', event.target.value)
    
    	    setSchoolContact(schoolContact); setErrors(errors)
      
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateSchoolContact, personId, personConfig} = props
          
          let hasError = false
    
          if (!schoolContact.schoolName) {
              hasError = true
              setErrors({ ...errors, schoolName: "School name is required" })
          }
          if (!schoolContact.contactName) {
              hasError = true
              setErrors({ ...errors, contactName: "Contact name is required" })
          }
          if (!schoolContact.usStateId) {
              hasError = true
              setErrors({ ...errors, usStateId: "US State is required" })
          }
    
          if (!hasError) {
              if (schoolContact.returnDate && schoolContact.returnDate.indexOf('T') > -1) schoolContact.returnDate = schoolContact.returnDate.substring(0, schoolContact.returnDate.indexOf('T'))
              if (schoolContact.returnDate && schoolContact.returnTime) {
                  schoolContact.returnDate = schoolContact.returnDate + ' ' + schoolContact.returnTime
              }
              delete schoolContact.returnTime
              addOrUpdateSchoolContact(personId, schoolContact)
              setExpanded(''); setSchoolContact({
                    schoolContactId: '',
                    schoolName: '',
                    address: '',
                    contactName: '',
                    role: '',
                    emailAddress: '',
                    phoneNumber: '',
                    returnDate: '',
                    note: '',
                    files: [],
                    selectedFile: '',
                    usStateId: personConfig.choices['SchoolContact_usStateId'],
                  })
    					if (stayOrFinish === "FINISH") {
    		          navigate(`/firstNav`)
    		      }
          }
      
  }

  const handleRemoveItemOpen = (schoolContactId) => {
    return setIsShowingModal_remove(true); setSchoolContactId(schoolContactId)

  }
  const handleRemoveItemClose = () => {
    return setIsShowingModal_remove(false); setSchoolContactId('')

  }
  const handleRemoveItem = () => {
    
          const {removeSchoolContact, personId} = props
          
          removeSchoolContact(personId, schoolContactId)
          handleRemoveItemClose()
      
  }

  const handleEdit = (schoolContactId) => {
    
    			const {schoolContacts} = props
    			if (schoolContact && schoolContact.returnDate) {
    					schoolContact.returnTime = schoolContact.returnDate.indexOf('T') > -1 ? schoolContact.returnDate.substring(schoolContact.returnDate.indexOf('T') + 1) : schoolContact.returnDate
    			}
          setSchoolContact(schoolContact)
    			handleExpansionChange('panel1')(event, true)
          document.getElementById('schoolName').focus()
    	
  }

  const changeDate = (field, event) => {
    
        setSchoolContact(schoolContact)
    	
  }

  const cancelAddNew = () => {
    
        setExpanded(''); setSchoolContact({
              schoolContactId: '',
              schoolName: '',
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

  const handlePartialSchoolEnterKey = (event) => {
    
          event.key === "Enter" && setPartialSchoolText()
      
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
    
          let schoolContactId = schoolContact.schoolContactId && schoolContact.schoolContactId !== '0' ? schoolContact.schoolContactId : guidEmpty
    
          let url = `${apiHost}ebi/schoolContact/fileUpload/${personId}/${schoolContactId}`
    
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
                  let newSchoolContact = Object.assign({}, schoolContact)
                  if (!newSchoolContact) newSchoolContact = {}
                  if (!newSchoolContact.schoolContactId || newSchoolContact.schoolContactId === '0') {
                      newSchoolContact.schoolContactId = response.data.schoolContactId
                  }
                  setSchoolContact(newSchoolContact); setFiles(response.data.files); setLoadingFile(false)
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
    
          let schoolContactId = schoolContact.schoolContactId && schoolContact.schoolContactId !== '0' ? schoolContact.schoolContactId : guidEmpty
    
          let url = `${apiHost}ebi/schoolContact/fileUpload/${personId}/${schoolContactId}`
    
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
                  let newSchoolContact = Object.assign({}, schoolContact)
                  if (!newSchoolContact) newSchoolContact = {}
                  if (!newSchoolContact.schoolContactId || newSchoolContact.schoolContactId === '0') {
                      newSchoolContact.schoolContactId = response.data.schoolContactId
                  }
                  setSchoolContact(newSchoolContact); setFiles(response.data.files); setLoadingFile(false)
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
    
          const {removeSchoolContactFileUpload, personId} = props
          
          handleRemoveFileUploadClose()
          removeSchoolContactFileUpload(personId, fileUpload.fileUploadId)
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

  const handleShowGPSOpen = (schoolContactChosen) => {
    return setIsShowingModal_gps(true); setSchoolContactChosen(schoolContactChosen)
  }

  const handleShowGPSClose = () => {
    return setIsShowingModal_gps(false); setSchoolContactChosen({})
  }

  return null
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(SchoolContactManagerView)
