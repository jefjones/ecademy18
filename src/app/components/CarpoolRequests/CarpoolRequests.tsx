import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {apiHost} from '../../api_host'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
import styles from './CarpoolRequests.css'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import EditTable from '../EditTable'
import InputText from '../InputText'
import SelectSingleDropDown from '../SelectSingleDropDown'
import CheckboxGroup from '../CheckboxGroup'
import Checkbox from '../Checkbox'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import AnnouncementModal from '../AnnouncementModal'
import CarpoolRequestResponseModal from '../CarpoolRequestResponseModal'
import CarpoolAcceptRequestDirectModal from '../CarpoolAcceptRequestDirectModal'
import CarpoolAcceptRequestFinalModal from '../CarpoolAcceptRequestFinalModal'
import Button from '../Button'
import ButtonWithIcon from '../ButtonWithIcon'
import DateMoment from '../DateMoment'
import WeekdayDisplay from '../WeekdayDisplay'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import {emailValidate} from '../../utils/emailValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolRequests(props) {
  const [localPendingAnswer, setLocalPendingAnswer] = useState([])
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_description, setIsShowingModal_description] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)
  const [isShowingModal_response, setIsShowingModal_response] = useState(false)
  const [isShowingModal_newCarpoolLink, setIsShowingModal_newCarpoolLink] = useState(false)
  const [isShowingModal_carpoolChoice, setIsShowingModal_carpoolChoice] = useState(false)
  const [isShowingModal_uninvite, setIsShowingModal_uninvite] = useState(false)
  const [isShowingModal_accept, setIsShowingModal_accept] = useState(false)
  const [carpoolRequestId, setCarpoolRequestId] = useState('')
  const [allowAddress, setAllowAddress] = useState(false)
  const [carpoolRequest, setCarpoolRequest] = useState({
				carpoolRequestId: '',
				carpoolAreaId: '',
				carpoolId: '',
				areaName: '',
				desription: '',
				seatsAvailable: '',
				seatsNeeded: '',
				canDropOffDays: [],
        canPickUpDays: [],
        comment: '',
      })
  const [carpoolAreaId, setCarpoolAreaId] = useState('')
  const [carpoolId, setCarpoolId] = useState('')
  const [areaName, setAreaName] = useState('')
  const [desription, setDesription] = useState('')
  const [seatsAvailable, setSeatsAvailable] = useState('')
  const [seatsNeeded, setSeatsNeeded] = useState('')
  const [canDropOffDays, setCanDropOffDays] = useState([])
  const [canPickUpDays, setCanPickUpDays] = useState([])
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({
				carpoolAreaId: '',
				seats: '',
				canDropOffDays: '',
				canPickUpDays: '',
				comment: '',
      })
  const [seats, setSeats] = useState('')
  const [directCarpoolId, setDirectCarpoolId] = useState('')
  const [directEmailAddress, setDirectEmailAddress] = useState('')
  const [directComment, setDirectComment] = useState('')
  const [isInit, setIsInit] = useState(undefined)
  const [checkedSendEmail, setCheckedSendEmail] = useState(undefined)
  const [filterCarpoolAreas, setFilterCarpoolAreas] = useState(undefined)
  const [errorCarpoolAreaId, setErrorCarpoolAreaId] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorSeats, setErrorSeats] = useState(undefined)
  const [errorDropOffOrPickUp, setErrorDropOffOrPickUp] = useState(undefined)
  const [errorAllowAddress, setErrorAllowAddress] = useState(undefined)
  const [isShowingModal_requests, setIsShowingModal_requests] = useState(undefined)
  const [listUsedIn, setListUsedIn] = useState(undefined)
  const [expanded, setExpanded] = useState(undefined)
  const [addNewArea, setAddNewArea] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [filterCarpoolAreaId, setFilterCarpoolAreaId] = useState(undefined)
  const [directAllowAddress, setDirectAllowAddress] = useState(undefined)
  const [carpoolRequestResponseId, setCarpoolRequestResponseId] = useState(undefined)
  const [isShowingModal_directDecline, setIsShowingModal_directDecline] = useState(undefined)
  const [carpoolRequestDirectId, setCarpoolRequestDirectId] = useState(undefined)
  const [isShowingModal_directRemove, setIsShowingModal_directRemove] = useState(undefined)
  const [errorDirectEmailAddress, setErrorDirectEmailAddress] = useState(undefined)
  const [isVerify, setIsVerify] = useState(undefined)
  const [emailAddressFound, setEmailAddressFound] = useState(undefined)
  const [errorDirectCarpoolId, setErrorDirectCarpoolId] = useState(undefined)
  const [errorDirectAllowAddress, setErrorDirectAllowAddress] = useState(undefined)
  const [isShowingModal_directAccept, setIsShowingModal_directAccept] = useState(undefined)
  const [request, setRequest] = useState(undefined)
  const [carpoolRequestResponse, setCarpoolRequestResponse] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {carpool} = props
    			
    			if (!isInit && carpool && carpool.carpoolRequestWatches && carpool.carpoolRequestWatches.length > 0) {
    					let filterCarpoolAreas = carpool.carpoolRequestWatches.reduce((acc, m) => {
    							let option = {
    								carpoolAreaId: m.carpoolAreaId,
    								areaName: m.areaName,
    								description: m.description
    							}
    							return acc ? acc.concat(option) : [option]
    					}, [])
    					let checkedSendEmail = carpool.carpoolRequestWatches[0].sendEmail
    					setCheckedSendEmail(checkedSendEmail); setFilterCarpoolAreas(filterCarpoolAreas); setIsInit(true)
    			}
    
    	
  }, [])

  const handleCarpoolRequest = (event) => {
    
    	    const field = event.target.name
    	    let carpoolRequest = Object.assign({}, carpoolRequest)
    	    let errors = Object.assign({}, errors)
    	    carpoolRequest[field] = event.target.value
    	    errors[field] = ''
    			if (field === 'areaName') carpoolRequest.carpoolAreaId = guidEmpty
    	    setCarpoolRequest(carpoolRequest); setErrors(errors)
      
  }

  const checkForDuplicateAreaName = () => {
    
    			const {carpool} = props
    			
    			//If this is an edit record with a valid carpoolRequestId, then let there be one duplicate.
    			let duplicateCount = 0
    			carpool.carpoolAreas && carpool.carpoolAreas.length > 0 && carpool.carpoolAreas.forEach(m => {
    					if (m.areaName.toLowerCase().replace(' ', '') === carpoolRequest.areaName.toLowerCase().replace(' ', '')) duplicateCount++
    			})
    			return carpoolRequest.carpoolRequestId && carpoolRequest.carpoolRequestId !== guidEmpty ? duplicateCount > 1 : duplicateCount > 0
    	
  }

  const processForm = (stayOrFinish) => {
    
          const {addOrUpdateCarpoolRequest, personId} = props
          
          let hasError = false
    
    			if (carpoolRequest.areaName && checkForDuplicateAreaName()) {
    				hasError = true
    				setErrorCarpoolAreaId(<L p={p} t={`The Area Name entered already exists`}/>)
    			}
    
          if (!carpoolRequest.carpoolAreaId && !carpoolRequest.areaName) {
              hasError = true
              setErrorCarpoolAreaId(<L p={p} t={`Area Name is required`}/>)
          }
    			if (!carpoolRequest.seatsNeeded && !carpoolRequest.seatsAvailable) {
              hasError = true
              setErrorSeats(<L p={p} t={`Enter seats needed and seats vacant`}/>)
          }
    			// if ((!carpoolRequest.canDropOffDays || carpoolRequest.canDropOffDays.length === 0) && (!carpoolRequest.canPickUpDays || carpoolRequest.canPickUpDays.length === 0)) {
          //     hasError = true;
          //     setErrorDropOffOrPickUp("Choose days you can drop off or pick up");
          // }
    			if (!allowAddress) {
              hasError = true
              setErrorAllowAddress(<L p={p} t={`A carpool member needs to consider your location in order to make a decision to carpool with you.`}/>)
          }
    
          if (!hasError) {
              addOrUpdateCarpoolRequest(personId, carpoolRequest)
              setCarpoolRequest({
    									carpoolRequestId: '',
    									carpoolAreaId: '',
    									carpoolId: '',
    									areaName: '',
    									desription: '',
    									seatsAvailable: '',
    									seatsNeeded: '',
    									canDropOffDays: [],
    					        canPickUpDays: [],
    					        comment: '',
                  }); setErrorCarpoolAreaId(''); setErrorSeats(''); setErrorDropOffOrPickUp(''); setErrorAllowAddress('')
    					handleExpansionChange('panel1')(null, false)
          }
      
  }

  const handleShowUsedInOpen = (requests) => {
    
    	
  }

  const handleShowUsedInClose = () => {
    return setIsShowingModal_requests(false); setListUsedIn([])
    

  }
  const handleRemoveItemOpen = (carpoolRequestId) => {
    
    			setIsShowingModal_remove(true); setCarpoolRequestId(carpoolRequestId)
    	
  }

  const handleRemoveItemClose = () => {
    return setIsShowingModal_remove(false); setCarpoolRequestId('')

  }
  const handleRemoveItem = () => {
    
          const {removeCarpoolRequest, personId} = props
          
          removeCarpoolRequest(personId, carpoolRequestId)
          handleRemoveItemClose()
      
  }

  const handleEdit = (carpoolRequest) => {
    
    			handleExpansionChange('panel1')(null, true)
    			setCarpoolRequest(carpoolRequest)
    	
  }

  const handleSelectedCanDropOffDays = (canDropOffDays) => {
    
          const carpoolRequest = carpoolRequest
          carpoolRequest.canDropOffDays = canDropOffDays
          setCarpoolRequest(carpoolRequest)
      
  }

  const handleSelectedCanPickUpDays = (canPickUpDays) => {
    
          const carpoolRequest = carpoolRequest
          carpoolRequest.canPickUpDays = canPickUpDays
          setCarpoolRequest(carpoolRequest)
      
  }

  const toggleNewAreaControls = () => {
    
    			setAddNewArea(!addNewArea)
    	
  }

  const handleDescriptionOpen = (areaName, description) => {
    return setIsShowingModal_description(true); setAreaName(areaName); setDescription(description)
    

  }
  const handleDescriptionClose = () => {
    return setIsShowingModal_description(false); setAreaName(''); setDescription('')
    

  }
  const handleFilterCarpoolArea = (event, filterCarpoolAreaId) => {
    
    			const {carpool, addOrUpdateCarpoolSearchFilter, personId} = props
    			
    
    			if (filterCarpoolAreaId && filterCarpoolAreaId !== guidEmpty) {
    					let carpoolArea = carpool.carpoolAreas.filter(m => m.carpoolAreaId === filterCarpoolAreaId)[0] || {}
    					if (filterCarpoolAreas && filterCarpoolAreas.length > 0) {
    							let hasArea = false
    							filterCarpoolAreas.forEach(m => {
    									if (m.carpoolAreaId === filterCarpoolAreaId) {
    											hasArea = true
    											filterCarpoolAreas = filterCarpoolAreas.filter(f => f.carpoolAreaId !== filterCarpoolAreaId)
    											filterCarpoolAreaId = guidEmpty; //Clear this out since this carpool record is going to be returned to the list and we don't care to have it chosen.
    									}
    							})
    							if (!hasArea) filterCarpoolAreas = filterCarpoolAreas.concat(carpoolArea)
    					} else {
    							filterCarpoolAreas = [carpoolArea]
    					}
    					setFilterCarpoolAreaId(filterCarpoolAreaId); setFilterCarpoolAreas(filterCarpoolAreas)
    			}
    			addOrUpdateCarpoolSearchFilter(personId, filterCarpoolAreas, checkedSendEmail)
    	
  }

  const toggleSendEmailFilter = () => {
    
    			const {addOrUpdateCarpoolSearchFilter, personId} = props
    			
    			setCheckedSendEmail(!checkedSendEmail)
    			addOrUpdateCarpoolSearchFilter(personId, filterCarpoolAreas, !checkedSendEmail)
    	
  }

  const toggleAllowAddress = () => {
    
    			setAllowAddress(!allowAddress)
    	
  }

  const toggleDirectAllowAddress = () => {
    
    			setDirectAllowAddress(!directAllowAddress)
    	
  }

  const setFirstIcon = (request) => {
    
    			const {personId} = props
    			if (request.responseType === 'invite' && request.responsePersonId === personId) return
    
    			return (
    					<div className={styles.row}>
    							{request.fromPersonId === personId &&
    									<div onClick={() => handleEdit(request)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></div>
    							}
    							<Link to={`announcementEdit/carpoolRequest/${request.carpoolRequestId}/${request.fromPersonId}/${request.personName}`}
    											 data-rh={'Send a message'}>
    										<Icon pathName={'comment_text'} premium={true} superscript={'plus'} supFillColor={'#24b51c'} className={styles.icon} superScriptClass={styles.iconSuperscript}/>
    							</Link>
    							{request.messages && request.messages.length > 0 && request.messages.map((m, i) =>
    									<div key={i} onClick={() => handleMessageOpen(m.announcementId)}>
    											<Icon pathName={'comment_text'} premium={true} className={styles.iconMessage} fillColor={'orange'} />
    									</div>
    							)}
    					</div>
    			)
      
  }

  const handleMessageOpen = (announcementId) => {
    
    			const {getMessageSingleFullThread} = props
    			getMessageSingleFullThread(announcementId)
    			setIsShowingModal_message(true); setAnnouncementId(announcementId)
    	
  }

  const handleMessageClose = () => {
    return setIsShowingModal_message(false)
    

  }
  const sendToNewCarpool = () => {
    
    		 const {changeTabChosen, toggleOpenAddNewCarpool} = props
    		 changeTabChosen('myCarpools')
    		 toggleOpenAddNewCarpool(true)
    	
  }

  const handlePickMe = (request) => {
    
    			const {personId, removeCarpoolRequestResponse} = props
    			//If this is an unpick me, then send the delete request to the server.
    			//Otherwise, pop up the message box with the seats available and seats needed fields and day choices with optional comment.
    			if (request.responseType === 'pickme') {
    					removeCarpoolRequestResponse(personId, request.carpoolRequestResponseId)
    			} else {
    				  handleCarpoolRequestResponseOpen(request, 'pickme')
    			}
    	
  }

  const handleInviteYou = (request) => {
    
    			const {carpool} = props
    			//if this is an uninvite, then delete the CarpoolRequestResponse for the invitation that the use was giving.
    			if (request.responseType === 'invite') {
    					handleUninviteRequestOpen(request.carpoolRequestResponseId)
    			//Otherwise,
    					// On invite, if the user does not have a carpool, provide a link to create a carpool and that is all for that step. (They will need to return to the request list and make their choices again)
    					// 		If they have more than one carpool, provide a radio group to choose with a submit button
    					// 		If there is just one carpool, then the request goes through direcctly.
    			} else if (!carpool.myCarpools || carpool.myCarpools.length === 0) {
    					handleCarpoolCreateNewLinkOpen()
    			} else {
    					handleCarpoolRequestResponseOpen(request, 'invite')
    			}
    	
  }

  const handleUninviteRequestOpen = (carpoolRequestResponseId) => {
    return setIsShowingModal_uninvite(true); setCarpoolRequestResponseId(carpoolRequestResponseId)

  }
  const handleUninviteRequestClose = () => {
    return setIsShowingModal_uninvite(false); setCarpoolRequestResponseId('')

  }
  const handleUninviteRequest = () => {
    
    			const {removeCarpoolRequestResponse, personId} = props
    			
    			handleUninviteRequestClose()
    			removeCarpoolRequestResponse(personId, carpoolRequestResponseId)
    	
  }

  const handleCarpoolRequestResponseOpen = (carpoolRequest, responseType) => {
    return setIsShowingModal_response(true); setCarpoolRequest(carpoolRequest); setResponseType(responseType)
  }

  const handleCarpoolRequestResponseClose = () => {
    return setIsShowingModal_response(false); setCarpoolRequest({})
  }

  const handleCarpoolCreateNewLinkOpen = () => {
    return setIsShowingModal_newCarpoolLink(true)
  }

  const handleCarpoolCreateNewLinkClose = () => {
    return setIsShowingModal_newCarpoolLink(false)
  }

  const handleCarpoolCreateNewLink = () => {
    
    			props.toggleOpenAddNewCarpool()
    			handleCarpoolCreateNewLinkClose()
    	
  }

  const handleDeclineDirectRequestOpen = (carpoolRequestDirectId) => {
    return setIsShowingModal_directDecline(true); setCarpoolRequestDirectId(carpoolRequestDirectId)
  }

  const handleDeclineDirectRequestClose = () => {
    return setIsShowingModal_directDecline(false); setCarpoolRequestDirectId('')
  }

  const handleDeclineDirectRequest = () => {
    
    			props.declineDirectRequest(props.personId, carpoolRequestDirectId)
    			handleDeclineDirectRequestClose()
    	
  }

  const handleRemoveDirectRequestOpen = (carpoolRequestDirectId) => {
    return setIsShowingModal_directRemove(true); setCarpoolRequestDirectId(carpoolRequestDirectId)
  }

  const handleRemoveDirectRequestClose = () => {
    return setIsShowingModal_directRemove(false); setCarpoolRequestDirectId('')
  }

  const handleRemoveDirectRequest = () => {
    
    			props.removeDirectRequest(props.personId, carpoolRequestDirectId)
    			handleRemoveDirectRequestClose()
    	
  }

  const prepForURL = (text) => {
    
    			return text.replace(' ', '+').replace('%20','+')
    	
  }

  const handleAcceptOrDecline = (acceptOrDecline, request, response) => {
    
    			const {personId, setCarpoolMember} = props
    			let thisPersonId = response.responseType === 'invite' ? personId : response.responsePersonId
    			setCarpoolMember(thisPersonId, acceptOrDecline, response.carpoolRequestResponseId, thisPersonId)
    	
  }

  const handleCarpoolRequestDirect = (event) => {
    
    			let newState = Object.assign({}, state)
    			newState[event.target.name] = event.target.value
    			if (event.target.name === 'directEmailAddress') newState[event.target.name] = newState[event.target.name].replace(' ', '')
    			setState(newState)
    	
  }

  const handleEmailAddressCheck = () => {
    
    			
    			let hasError = false
    
    			if (!directEmailAddress) {
    					hasError = true
    					setErrorDirectEmailAddress(<L p={p} t={`An email address is required`}/>)
    			} else if (!emailValidate(directEmailAddress)) {
    					hasError = true
    					setErrorDirectEmailAddress(<L p={p} t={`The email address appears to be invalid`}/>)
    			}
    
    			if (!hasError) {
    					axios.get(`${apiHost}ebi/emailAddress/verify/${state.personId}/${directEmailAddress}`,
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
    					.catch(function (error) {
    						//Show error here.
    					})
    					.then(response => {
    							let emailAddressFound = false
    							if (response.data === 'FOUND') {
    									emailAddressFound = true
    									setErrorDirectEmailAddress(''); setEmailAddressFound(emailAddressFound); setIsVerify(true)
    							} else {
    									setErrorDirectEmailAddress('This email address was not found'); setEmailAddressFound(emailAddressFound); setIsVerify(true)
    							}
    					})
    			}
    	
  }

  const handleAddCarpoolRequestDirect = () => {
    
    			const {personId, addDirectRequest} = props
    			
    			let hasError = false
    
    			if (!directCarpoolId) {
    					hasError = true
    					setErrorDirectCarpoolId(<L p={p} t={`A carpool is required`}/>)
    			}
    
    			if (!directEmailAddress) {
    					hasError = true
    					setErrorDirectEmailAddress(<L p={p} t={`An email address is required`}/>)
    			} else if (!emailValidate(directEmailAddress)) {
    					hasError = true
    					setErrorDirectEmailAddress(<L p={p} t={`An email address is required`}/>)
    			}
    
    			if (!directAllowAddress) {
              hasError = true
              setErrorDirectAllowAddress(<L p={p} t={`A carpool member needs to consider your location in order to make a decision to carpool with you.`}/>)
          }
    
    			if (!hasError) {
    					let carpoolRequestDirect = {
    							carpoolId: directCarpoolId,
    							fromPersonId: personId,
    							toEmailAddress: directEmailAddress,
    							note: directComment,
    					}
    
    					addDirectRequest(personId, carpoolRequestDirect)
    					setDirectCarpoolId(''); setDirectEmailAddress(''); setDirectComment('')
    					handleExpansionChange('panel1')(null, false)
    			}
    
    	
  }

  const handleAcceptDirectRequestOpen = (carpoolRequestDirectId) => {
    
    			const {carpool} = props
    			let carpoolRequestDirect = carpool && carpool.carpoolRequestsDirect && carpool.carpoolRequestsDirect.length > 0 && carpool.carpoolRequestsDirect.filter(m => m.carpoolRequestDirectId === carpoolRequestDirectId)[0]
    			setIsShowingModal_directAccept(true); setCarpoolRequestDirectId(carpoolRequestDirectId); setCarpoolRequestDirect(carpoolRequestDirect)
    	
  }

  const handleAcceptDirectRequestClose = () => {
    return setIsShowingModal_directAccept(false); setCarpoolRequestDirectId('')
  }

  const handleAcceptDirectRequest = () => {
    
    			const {personId, acceptDirectRequest} = props
    			
    			acceptDirectRequest(personId, carpoolRequestDirectId)
    			handleAcceptDirectRequestClose()
    	
  }

  const handleAcceptRequestFinalOpen = (carpoolRequestId, request, carpoolRequestResponse) => {
    
    			const {carpool} = props
    	
  }

  const handleAcceptRequestFinalClose = () => {
    return setIsShowingModal_accept(false); setCarpoolRequestId(''); setRequest(''); setCarpoolRequestResponse('')
  }

  const handleAcceptRequestFinal = () => {
    
    			
    			handleAcceptOrDecline('accept', request, carpoolRequestResponse)
    			handleAcceptRequestFinalClose()
    	
  }

  const {personId, carpool={}, daysOfWeek, setStudentsSelected, messageFullThread, addCarpoolRequestResponse, daysOfWeekAll,
  						toggleCarpoolRequestDirectCanDoDay, acceptDirectRequest, toggleCarpoolRequestFinalCanDoDay, isFetchingRecord} = props
      
  
  		let localRequests = []
  		let filterCarpoolAreasMinus = carpool.carpoolAreas
  		if (filterCarpoolAreasMinus && filterCarpoolAreasMinus.length > 0 && filterCarpoolAreas && filterCarpoolAreas.length > 0) {
  				filterCarpoolAreas.forEach(m => {
  						filterCarpoolAreasMinus = filterCarpoolAreasMinus.filter(f => f.carpoolAreaId !== m.carpoolAreaId)
  				})
  		}
  		if (carpool.carpoolRequests && carpool.carpoolRequests.length > 0 && filterCarpoolAreas && filterCarpoolAreas.length > 0) {
  				carpool.carpoolRequests.forEach(c => {
  						filterCarpoolAreas.forEach(m => {
  								if (c.carpoolAreaId === m.carpoolAreaId) {
  										localRequests = localRequests ? localRequests.concat(c) : [c]
  								}
  						})
  				})
  		} else {
  				localRequests = carpool.carpoolRequests
  		}
  
  		let headingsDirect = [{},
  				{label: <L p={p} t={`From`}/>, tightText: true},
  				{label: <L p={p} t={`To`}/>, tightText: true},
  				{label: <L p={p} t={`Response`}/>, tightText: true},
  				{label: <L p={p} t={`Note`}/>, tightText: true},
  				{label: <L p={p} t={`Entry date`}/>, tightText: true},
  				{label: <L p={p} t={`Response date`}/>, tightText: true},
  		]
  
      let dataDirect = []
  
      carpool.carpoolRequestsDirect && carpool.carpoolRequestsDirect.length > 0 && carpool.carpoolRequestsDirect.forEach(m => {
            dataDirect.push([
  							{value: m.fromPersonId === personId
  									? <div onClick={() => handleRemoveDirectRequestOpen(m.carpoolRequestDirectId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div>
  									: ''
  							},
  							{value: <a href={`http://maps.google.com/?q=${m.fromStreetAddress}, ${m.fromCity}, ${m.fromUsStateName}`} className={globalStyles.link} target={'_blank'}>
  													{m.fromPersonName}
  											</a>
  							},
  							{value: <a href={`http://maps.google.com/?q=${m.toStreetAddress}, ${m.toCity}, ${m.toUsStateName}`} className={globalStyles.link} target={'_blank'}>
  													{m.toPersonName}
  											</a>
  							},
                {value: m.fromPersonId === personId
  													? m.acceptOrDecline
  															? m.acceptOrDecline
  															: <i>pending</i>
  													: m.acceptOrDecline
  															? m.acceptOrDecline
  															: <div className={styles.row}>
  																		<Button label={<L p={p} t={`Accept`}/>} onClick={() => handleAcceptDirectRequestOpen(m.carpoolRequestDirectId)}
  																				addClassName={styles.notSoHigh}/>
  																		<Button label={<L p={p} t={`Decline`}/>} onClick={() => handleDeclineDirectRequestOpen(m.carpoolRequestDirectId)}
  																				changeRed={true} addClassName={styles.notSoHigh}/>
  																</div>
  							},
  							{value: m.comment},
  							{value: <DateMoment date={m.entryDate} minusHours={6}/>},
                {value: <DateMoment date={m.responseDate} minusHours={6}/>},
           ])
      })
      if(!(dataDirect && dataDirect.length > 0)) {
          dataDirect = [[{value: ''}, {value: <i><L p={p} t={`No direct requests.`}/></i>, colSpan: 4 }]]
      }
  
      let headingsOpen = [{}, {},
  				{label: <L p={p} t={`Area name`}/>, tightText: true},
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: <L p={p} t={`Seats vacant`}/>, tightText: true},
  				{label: <L p={p} t={`Seats needed`}/>, tightText: true},
  				{label: <div className={styles.nobreak}><L p={p} t={`Can`}/><br/><L p={p} t={`drop off`}/></div>, tightText: true},
  				{label: <div className={styles.nobreak}><L p={p} t={`Can`}/><br/><L p={p} t={`pick up`}/></div>, tightText: true},
  				{label: 'Comment', tightText: true}]
  
      let dataOpen = []
  
      if (localRequests && localRequests.length > 0) {
          localRequests.forEach(m => {
  						let isAccepted = m.carpoolRequestResponses && m.carpoolRequestResponses.length > 0 && m.carpoolRequestResponses.filter(r => r.answerType === 'accepted')[0]
  						isAccepted = isAccepted && isAccepted.answerType
  
              dataOpen.push([
  							{value: setFirstIcon(m)},
                {value: m.fromPersonId === personId
  													? <div onClick={() => handleRemoveItemOpen(m.carpoolRequestId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></div>
  													: isAccepted
  															? ''
  															: <Button label={m.carpoolId && m.carpoolId !== guidEmpty
  																		? m.responseType === 'pickme'
  																		 		? <L p={p} t={`Unpick me`}/>
  																				: <L p={p} t={`Pick me!`}/>
  																		: m.responseType === 'invite'
  																				? <L p={p} t={`Uninvite`}/>
  																				: <L p={p} t={`Invite`}/>
  																	} onClick={m.carpoolId  && m.carpoolId !== guidEmpty ? () => handlePickMe(m) : () => handleInviteYou(m)}
  																	changeRed={m.responseType} addClassName={styles.notSoHigh}/>
  							},
  							{value: !!m.description
  													? <div onClick={() => handleDescriptionOpen(m.areaName, m.description)} className={globalStyles.link}>{m.areaName}</div>
  													: m.areaName
  							},
  							{value: <a href={`http://maps.google.com/?q=${m.streetAddress}, ${m.city}, ${m.usStateName}`} className={globalStyles.link} target={'_blank'}>
  													{m.personName}
  											</a>
  							},
  							{value: m.seatsAvailable},
                {value: m.seatsNeeded},
  							{value: <WeekdayDisplay days={m.canDropOffDays}/>},
  							{value: <WeekdayDisplay days={m.canPickUpDays}/>},
                {value: m.comment},
              ])
  						m.carpoolRequestResponses && m.carpoolRequestResponses.length > 0 && m.carpoolRequestResponses.forEach(r => {
  								dataOpen.push([
  									{value: setFirstIcon(r)},
  									{},
  		              {value: localPendingAnswer.indexOf(r.carpoolRequestResponseId) > -1 && !r.answerType
  															? 'Processing...'
  															: r.answerType === 'accepted'
  																	? <div className={styles.responseLabel}><L p={p} t={`Accepted:`}/>}</div>
  																	: r.answerType === 'declined'
  																			? <div className={styles.responseLabel}><L p={p} t={`Declined:`}/></div>
  																			: m.fromPersonId === personId
  																					? <div>
  																								<Button label={<L p={p} t={`Accept`}/>} onClick={() => handleAcceptRequestFinalOpen(m.carpoolRequestId, m, r)}
  																										addClassName={styles.notSoHigh}/>
  																								<Button label={<L p={p} t={`Decline`}/>} onClick={() => handleAcceptOrDecline('decline', m, r)} changeRed={true} addClassName={styles.notSoHigh}/>
  																						</div>
  																					: <div className={styles.responseLabel}><L p={p} t={`My response:`}/></div>,
  											cellColor: 'response',
  									},
  									{value: <a href={`http://maps.google.com/?q=${r.streetAddress}, ${r.city}, ${r.usStateName}`} className={globalStyles.link} target={'_blank'}>
  															{r.personName}
  													</a>,
  											cellColor: 'response',
  									},
  									{value: r.seatsAvailable, cellColor: 'response'},
  		              {value: r.seatsNeeded, cellColor: 'response'},
  									{value: <WeekdayDisplay days={r.canDropOffDays}/>, cellColor: 'response'},
  									{value: <WeekdayDisplay days={r.canPickUpDays}/>, cellColor: 'response'},
  		              {value: r.comment, cellColor: 'response'},
  		            ])
  						})
          })
}
}
export default CarpoolRequests
