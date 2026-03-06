import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import axios from 'axios'
import { navigate, navigateReplace, goBack } from './'
import styles from './CarContactManagerView.css'
import globalStyles from '../../utils/globalStyles.css'
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
  const [selectedPlace, setSelectedPlace] = useState({}          //Shows the infoWindow to the selected place upon a marker);
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
      handleRemoveItemClose = () => setIsShowingModal_remove(false); setCarContactId('')
      handleRemoveItem = () => {
          const {removeCarContact, personId} = props
  }

  const handleRemoveItemClose = () => {
    return setIsShowingModal_remove(false); setCarContactId('')
      handleRemoveItem = () => {
          const {removeCarContact, personId} = props
  }

  const handleRemoveItem = () => {
    
          const {removeCarContact, personId} = props
          
          removeCarContact(personId, carContactId)
          handleRemoveItemClose()
      
  }

  const handleEdit = (carContactId) => {
    
    			const {carContacts} = props
    			let carContact = carContacts && carContacts.length > 0 && carContacts.filter(m => m.carContactId === carContactId)[0]
    			if (carContact && carContact.returnDate) {
    					carContact.returnTime = carContact.returnDate.indexOf('T') > -1 ? carContact.returnDate.substring(carContact.returnDate.indexOf('T') + 1) : carContact.returnDate
    			}
          setCarContact(carContact)
    			handleExpansionChange('panel1')(event, true)
          document.getElementById('ownerName').focus()
    	
  }

  const changeDate = (field, event) => {
    
        let carContact = Object.assign({}, carContact)
        carContact[field] = event.target.value
    
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
      handleFileUploadClose = () => setIsShowingFileUpload(false)
      handleFileUploadSubmit = () => {
          const {personId} = props
  }

  const handleFileUploadClose = () => {
    return setIsShowingFileUpload(false)
      handleFileUploadSubmit = () => {
          const {personId} = props
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
      handleRemoveFileUploadClose = () => setIsShowingModal_removeFileUpload(false)
      handleRemoveFileUpload = () => {
          const {removeCarContactFileUpload, personId} = props
  }

  const handleRemoveFileUploadClose = () => {
    return setIsShowingModal_removeFileUpload(false)
      handleRemoveFileUpload = () => {
          const {removeCarContactFileUpload, personId} = props
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
      handleDocumentClose = () => setIsShowingModal_document(false); setFileUpload({})
    
      handleShowGPSOpen = (carContactChosen) => setIsShowingModal_gps(true); setCarContactChosen(carContactChosen)
  }

  const handleDocumentClose = () => {
    return setIsShowingModal_document(false); setFileUpload({})
    
      handleShowGPSOpen = (carContactChosen) => setIsShowingModal_gps(true); setCarContactChosen(carContactChosen)
  }

  const handleShowGPSOpen = (carContactChosen) => {
    return setIsShowingModal_gps(true); setCarContactChosen(carContactChosen)
  }

  const handleShowGPSClose = () => {
    return setIsShowingModal_gps(false); setCarContactChosen({})
    
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
    
      		let carContact = Object.assign([], carContact)
          carContact.longitude = position.coords.longitude
          carContact.latitude = position.coords.latitude
      		setCarContact(carContact)
    	
  }

  const displayError = (error) => {
    
    			let errors = ['Unknown error', 'Persmission denied by user', 'Position not available', 'timeout error']
    			setMessage(errors[error.code] + '); set' + error.message(' + error.message)
    	
  }

  const onMarkerClick = (props, marker, e) => {
    return setSelectedPlace(props); setActiveMarker(marker); setShowingInfoWindow(true)
  }

  const handleFormatPhone = () => {
    
          
          if (carContact.phoneNumber && ('' + carContact.phoneNumber).replace(/\D/g, '').length !== 10) {
              setErrorPhone(`The phone number entered is not 10 digits`)
          } else if (formatPhoneNumber(carContact.phoneNumber)) {
              setErrorPhone(''); setCarContact({...carContact, phoneNumber: formatPhoneNumber(carContact.phoneNumber)})
          }
      
  }

  const {personId, myFrequentPlaces, setMyFrequentPlace, carContacts, fetchingRecord, removeCarContactFileUpload, usStates} = props
      const {carContact={}, errors, isShowingModal_remove, isShowingModal_usedIn, listUsedIn, expanded, filter={}, isShowingFileUpload, isShowingModal_gps,
              isShowingModal_removeFileUpload, selectedFile, loadingFile, files, isShowingModal_document, fileUpload, carContactChosen={}, errorPhone} = state
      let localCars = carContacts
  
      if (filter.ownerNameFilter) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.ownerName.toLowerCase().indexOf(filter.ownerNameFilter.toLowerCase()) > -1)
      if (filter.contactNameFilter) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.contactName.toLowerCase().indexOf(filter.contactNameFilter.toLowerCase()) > -1)
      if (filter.usStateId && filter.usStateId != 0) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.usStateId == filter.usStateId); //eslint-disable-line
      if (filter.openSearch) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.ownerName.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
          || m.ownerName.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
          || m.contactName.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
          || m.notes.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
          || m.phone.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
          || m.emailAddress.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1)
  
      let headings = [{}, {},
        {label: 'Owner name', tightText: true},
        {label: 'Files', tightText: true},
        {label: 'GPS', tightText: true},
      	{label: 'Address', tightText: true},
      	{label: 'Contact name', tightText: true},
      	{label: 'Role', tightText: true},
      	{label: 'Email address', tightText: true},
      	{label: 'Phone number', tightText: true},
      	{label: 'Return date', tightText: true},
      	{label: 'Note', tightText: true},
      ]
  
      let data = []
  
      if (localCars && localCars.length > 0) {
          data = localCars.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.carContactId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.carContactId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
                {value: m.ownerName},
                {value: <div className={styles.row}>
                            {m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
                                <a key={i} onClick={() => handleDocumentOpen(f)}>
                                    <Icon pathName={'document0'} premium={true} className={styles.iconCell} />
                                </a>
                             )}
                        </div>
                },
                {value: m.longitude ? 'GPS' : '',
                    clickFunction: () => handleShowGPSOpen(m),
                },
                {value: m.address},
                {value: m.contactName},
                {value: m.role},
                {value: m.emailAddress},
                {value: m.phoneNumber},
                {value: <DateMoment date={m.returnDate} minusHours={0}/>},
                {value: m.note},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={classes(styles.moreBottom, globalStyles.pageTitle)}>
                  {'Car Contact Manager'}
              </div>
              <Accordion expanded={expanded === 'panel1'} onChange={handleExpansionChange('panel1')}>
                  <AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
                      <div className={styles.row}>
                        	<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
                          <span className={styles.text}>Add new contact</span>
                      </div>
                  </AccordionSummary>
                  <AccordionDetails>
                      <div>
              						<div className={classes(styles.row, styles.littleLeft)}>
              								<InputText
              										name={'ownerName'}
              										value={carContact.ownerName || ''}
              										label={'Owner'}
              										maxLength={150}
              										size={'medium-long'}
              										onChange={changeContact}
                                  error={errors.ownerName}/>
              						</div>
                          <div>
                              <SelectSingleDropDown
                                  id={`usStateId`}
                                  name={`usStateId`}
                                  label={'US State'}
                                  value={carContact.usStateId || ''}
                                  options={usStates}
                                  className={styles.moreBottomMargin}
                                  height={`medium`}
                                  onChange={changeContact}
                                  error={errors.usStateId}/>
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
      														value={carContact.latitude || ''}
      														onChange={handleChange}
      														inputClassName={styles.moreLeft} />
      												<InputText
                                  label={"Longitude"}
      														id={`longitude`}
      														name={`longitude`}
      														size={"medium-short"}
      														numberOnly={true}
      														value={carContact.longitude || ''}
      														onChange={handleChange}
      														inputClassName={styles.moreLeft} />
                          </div>
                          <hr/>
                          <div className={classes(styles.row, styles.littleLeft)}>
                              <InputText
                                  name={'address'}
                                  value={carContact.address || ''}
                                  label={'Address'}
                                  maxLength={200}
                                  size={'medium-long'}
                                  onChange={changeContact}/>
                          </div>
                          <div className={classes(styles.row, styles.littleLeft)}>
                              <InputText
                                  name={'contactName'}
                                  value={carContact.contactName || ''}
                                  label={'Contact last name'}
                                  maxLength={25}
                                  size={'medium-short'}
                                  onChange={changeContact}
                                  error={errors.contactName}/>
                          </div>
                          <div className={classes(styles.row, styles.littleLeft)}>
                              <InputText
                                  name={'role'}
                                  value={carContact.role || ''}
                                  label={'Role'}
                                  maxLength={50}
                                  size={'medium'}
                                  onChange={changeContact}/>
                          </div>
                          <div className={classes(styles.row, styles.littleLeft)}>
                              <InputText
                                  name={'emailAddress'}
                                  value={carContact.emailAddress || ''}
                                  label={'Email address'}
                                  maxLength={50}
                                  size={'medium'}
                                  onChange={changeContact}/>
                          </div>
                          <div className={classes(styles.row, styles.littleLeft)}>
                              <InputText
                                  name={'phoneNumber'}
                                  value={carContact.phoneNumber || ''}
                                  label={'Phone number'}
                                  maxLength={15}
                                  size={'medium'}
                                  onChange={changeContact}
                                  onBlur={handleFormatPhone}
                                  error={errorPhone}/>
                          </div>
  												<div className={classes(styles.moreTopMargin, styles.littleLeft)}>
                              <InputTextArea label={'Notes'} name={'note'} value={carContact.note} onChange={changeContact} maxLength={2000}
  																columns={100} rows={20}/>
                          </div>
                          <div>
                              <InputFile label={'Include a picture'} isCamera={true} onChange={handleInputFile} isResize={true}/>
  														{/*<div className={classes(styles.row, styles.muchTop, styles.moreLeft)} onClick={handleFileUploadOpen}>
  																<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
  																<div className={classes(globalStyles.link, styles.linkPosition)}>Upload picture</div>
  														</div>*/}
  														<Loading isLoading={loadingFile} />
  														{files && files.length > 0 && files.map((f, i) =>
  																<div key={i}>
  																		<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId} fileUploadId={f.fileUploadId}
  																				deleteFunction={() => handleRemoveFileUploadOpen(f)} deleteId={carContact.carContactId}/>
  																</div>
  														)}
  												</div>
                          <div className={styles.dateTime}>
                              <DateTimePicker id={`returnDate`} label={'Return date'} value={carContact.returnDate || ''} onChange={(event) => changeDate('returnDate', event)}/>
                          </div>
                          <div className={styles.dateColumn}>
                              <span className={styles.label}>Return time</span>
                              <input type="time" name={'returnTime'} onChange={changeContact} value={carContact.returnTime || ''} className={styles.timePicker}/>
                          </div>
                          <div className={classes(styles.row, styles.lotLeft)}>
              								<div className={styles.cancelLink} onClick={cancelAddNew}>Close</div>
  														<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
                          </div>
                      </div>
                  </AccordionDetails>
              </Accordion>
              <div className={classes(styles.row, styles.moreTop)}>
                <Icon pathName={'magnifier'} premium={true} className={classes(styles.moreTop, styles.iconRight)}/>
                <div className={classes(styles.moreSpace, styles.text, styles.moreTop)}>Filters</div>
                <div className={styles.moreLeft}>
                    <InputText
                        label={`Owner`}
                        name={'ownerNameFilter'}
                        value={(filter && filter.ownerNameFilter) || ''}
                        maxLength={25}
                        size={'short'}
                        onChange={handleFilterChnage}/>
                </div>
                <div className={styles.moreLeft}>
                    <InputText
                        label={`Contact name`}
                        name={'contactNameFilter'}
                        value={(filter && filter.contactNameFilter) || ''}
                        maxLength={25}
                        size={'short'}
                        onChange={handleFilterChnage}/>
                </div>
                <div className={styles.moreLeft}>
                    <SelectSingleDropDown
                        id={`usStateId`}
                        label={'US State'}
                        value={(filter && filter.usStateId) || ''}
                        options={usStates}
                        className={styles.moreBottomMargin}
                        height={`medium`}
                        onChange={handleFilterChnage}/>
                </div>
                <div className={classes(styles.row, styles.littleLeft)}>
                    <InputText
                        name={'openSearch'}
                        value={(filter && filter.openSearch) || ''}
                        label={'Open search'}
                        maxLength={15}
                        size={'medium'}
                        onChange={hhandleFilterChnage}/>
                </div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink} isFetchingRecord={fetchingRecord.carContactManager}/>
              <hr />
  						<MyFrequentPlaces personId={personId} pageName={'Car Contact Manager'} path={'carContactManager'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={`Remove this car contact?`}
                     explain={`Are you sure you want to delete this car contact?`} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={`This Class Period is used in these Courses`}
  										explain={'In order to delete this class period, please reassign the following courses with a different class period setting:<br/><br/>' + listUsedIn}
  										onClick={handleShowUsedInClose}/>
              }
              {isShowingFileUpload &&
  								<FileUploadModalWithCrop handleClose={handleFileUploadClose} title={'Choose File or Image'}
  										personId={personId} submitFileUpload={handleFileUploadSubmit}
  										file={selectedFile}
  										handleInputFile={handleInputFile}
  										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .m4a"}
  										handleCancelFile={()=>{}}/>
              }
  						{isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={`Remove this file or image?`}
                     explain={`Are you sure you want to delete this file or image?`} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
              {isShowingModal_document &&
  								<div className={styles.fullWidth}>
  										{<DocumentViewOnlyModal handleClose={handleDocumentClose} showTitle={true} handleSubmit={handleDocumentClose} fileUpload={fileUpload}
                          isOwner={true} handleRemove={removeCarContactFileUpload} deleteId={fileUpload.fileUploadId}/>}
  								</div>
  						}
              {isShowingModal_gps &&
                  <MessageModal handleClose={handleShowGPSClose} heading={carContactChosen.ownerName}
    									explainJSX={<div style={{width: '320px', height: '320px'}}>
                                     <Map google={props.google} zoom={14} style={mapStyles} initialCenter={{ lat: carContactChosen.latitude, lng: carContactChosen.longitude }}>
                                        <Marker onClick={onMarkerClick} name={carContactChosen.ownerName} />
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
})(CarContactManagerView)
