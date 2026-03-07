import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const p = 'component'
import L from '../../components/PageLanguage'
import styles from './AnnouncementList.css'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../EditTable'
import MessageModal from '../MessageModal'
import AnnouncementModal from '../AnnouncementModal'
import Icon from '../Icon'
import DateMoment from '../DateMoment'
import Checkbox from '../Checkbox'
import RecipientListModal from '../RecipientListModal'
import OneFJefFooter from '../OneFJefFooter'
import classes from 'classnames'
import {guidEmpty}  from '../../utils/guidValidate'
import {doSort} from '../../utils/sort'
import moment from 'moment'

function AnnouncementList(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [announcementId, setAnnouncementId] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_removeMultiple, setIsShowingModal_removeMultiple] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)
  const [isShowingModal_recipients, setIsShowingModal_recipients] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [multipleChecked, setMultipleChecked] = useState([])
  const [sortByHeadings, setSortByHeadings] = useState({
								sortField: '',
								isAsc: '',
								isNumber: ''
						})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')
  const [announcement, setAnnouncement] = useState(undefined)
  const [firstClick, setFirstClick] = useState(undefined)

  useEffect(() => {
    
    				//window.addEventListener('click', multipleChecking);
    		
  }, [])

  const handleRemoveOpen = (announcementId, recipientPersonId) => {
    return setIsShowingModal_remove(true); setAnnouncementId(announcementId); setRecipientPersonId(recipientPersonId)

  }
  const handleRemoveClose = () => {
    return setIsShowingModal_remove(false)

  }
  const handleRemove = () => {
    
    				const {personId, removeAnnouncement, listType} = props
    				
    				//if listType is 'recipient' or 'deleted', then deleteType is single.  If listType is 'sentBy', then deleteType is 'all'
    				let recipient = listType === 'recipient' || listType === 'deleted' ? personId : !recipientPersonId || recipientPersonId === guidEmpty ? personId : recipientPersonId
            removeAnnouncement(personId, announcementId, recipient, listType, listType === 'sentBy' ? 'all' : 'single')
            handleRemoveClose()
    				handleMessageClose()
        
  }

  const handleRemoveMultipleOpen = () => {
    return setIsShowingModal_removeMultiple(true)

  }
  const handleRemoveMultipleClose = () => {
    return setIsShowingModal_removeMultiple(false)

  }
  const handleRemoveMultiple = () => {
    
    				const {personId, removeAnnouncement, listType, announcementList} = props
    				
    				//if listType is 'recipient' or 'deleted', then deleteType is single.  If listType is 'sentBy', then deleteType is 'all'
    				multipleChecked && multipleChecked.length > 0 && multipleChecked.forEach(id => {
    						let announcement = announcementList && announcementList.length > 0 && announcementList.filter(m => m.announcementId === id)[0]
    						let recipientPersonId = announcement && announcement.recipients && announcement.recipients.length > 0 && announcement.recipients[0]
    						let recipient = listType === 'recipient' || listType === 'deleted' ? personId : !recipientPersonId || recipientPersonId === guidEmpty ? personId : recipientPersonId
    		        removeAnnouncement(personId, id, recipient, listType, listType === 'sentBy' ? 'all' : 'single')
    				})
    				handleRemoveMultipleClose()
    				handleMessageClose()
        
  }

  const handleMessageOpen = (announcementId) => {
    
    				const {getMessageSingleFullThread, setAsSeenByRecipient, personId} = props
    				setAsSeenByRecipient(personId, announcementId)
    				getMessageSingleFullThread(announcementId)
    				setIsShowingModal_message(true); setAnnouncementId(announcementId)
    		
  }

  const handleMessageClose = () => {
    return setIsShowingModal_message(false)
    
    

  }
  const handleRecipientListOpen = (announcement, recipients) => {
    return setIsShowingModal_recipients(true); setAnnouncement(announcement); setRecipients(recipients)
    

  }
  const handleStudentListClose = () => {
    return setIsShowingModal_recipients(false)
    

  }
  const setColumnType = (announcement, announcementId, fromPersonFirstName, fromPersonLastName, recipients) => {
    
    				const {listType} = props
    				return listType === 'sentBy'
    						? <a onClick={() => handleRecipientListOpen(announcement, recipients)} className={styles.link}>{recipients.length !== 0 && recipients.length}</a>
    						: <a onClick={() => handleMessageOpen(announcementId)} className={classes(styles.link, styles.linkBold)}>{fromPersonFirstName + ' ' + fromPersonLastName}</a>
    		
  }

  const resort = (field) => {
    
  }

  const isMultipleChecked = (announcementId) => {
    
    				
    				let isChecked = false
    				multipleChecked && multipleChecked.length > 0 && multipleChecked.forEach(id => { if (id === announcementId) isChecked = true; })
    				return isChecked
    		
  }

  const toggleCheckbox = (event, announcementId, index) => {
    
    				//The event.target.name is a combination of the index and the announcementId.  The index is used to get the first click
    				//	and the second click to check for the control key in order to select everything in between.
    
    				//  If the firstClick is not filled in,
    				//		 save the index of the firstClick
    				//		 toggle the checkbox
    				//  else the firstClick is filled in.
    				//			if the control key is held down
    				//				 get the secondClick index
    				//				 if the secondClick is checked already
    				//						uncheck everything from the firstClick to the secondClick
    				//			   else
    				//						check everything from the firstClick to the secondClick
    				//			   end if
    				//			   clear the firstClick
    				//		  else
    				//				 toggle the checkbox
    				//			   set the firstClick to this index.
    				//  end if
    				const {announcementList} = props
    				
    				if (!firstClick) {
    						setFirstClick(index)
    						toggleChosenAnnouncement(announcementId)
    				} else {  //  else the firstClick is filled in.
    						if (event.shiftKey) {
    								let secondClick = index
    								let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(announcementId) : -1
    								let uncheckAll = false
    								if (indexChecked > -1) {
    										uncheckAll = false
    								}
    								let startIndex = secondClick >= firstClick ? firstClick : secondClick
    								let endIndex = secondClick <= firstClick ? firstClick : secondClick
    								announcementList && announcementList.length > 0 && announcementList.forEach((m, i) => {
    										if (i >= startIndex && i <= endIndex) {
    												if (uncheckAll) {
    														let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(m.announcementId) : -1
    														if (indexChecked > -1) multipleChecked = multipleChecked.splice(indexChecked, 1)
    												} else {
    														let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(m.announcementId) : -1
    														if (indexChecked === -1) multipleChecked = multipleChecked ? multipleChecked.concat(m.announcementId) : [m.announcementId]
    												}
    										}
    								})
    								setMultipleChecked(multipleChecked); setFirstClick('')
    
    						} else {
    								toggleChosenAnnouncement(announcementId)
    								setFirstClick(index)
    						}
    				}
    		
  }

  const toggleChosenAnnouncement = (announcementId) => {
    
    				let indexChecked = multipleChecked && multipleChecked.length > 0 ? multipleChecked.indexOf(announcementId) : -1
    				multipleChecked = indexChecked > -1 ? multipleChecked.splice(indexChecked, 1) : multipleChecked ? multipleChecked.concat(announcementId) : [announcementId]
    				setMultipleChecked(multipleChecked)
    		
  }

  const {personId, mainmenuVersion, setStudentsSelected, listType='recipient', messageSearch, messageFullThread,
  							isFetchingRecord} = props; //list types are recipient, sentBy, or deleted
  			let announcementList = Object.assign([], props.announcementList); //Let this be mutable since there is a sort function below.
        
  
  			let recordCount = !announcementList || announcementList.length === 0 ? '' : announcementList.length
  
  			let headings = listType === 'sentBy'
  					? [{label: recordCount, tightText: true, labelClass: styles.countLabel, colSpan: 2},
  							{label: <L p={p} t={`remove`}/>, tightText: true, clickFunction: handleRemoveMultipleOpen, labelClass: styles.redLink },
  							{label: <L p={p} t={`Date`}/>, tightText: true, clickFunction: () => resort('entryDate')},
  							{label: <L p={p} t={`Recipients`}/>, tightText: true, clickFunction: () => resort('recipients')},
  							{label: <L p={p} t={`Subject`}/>, tightText: true, clickFunction: () => resort('subject')},
  							{label: <L p={p} t={`Message`}/>, tightText: true, clickFunction: () => resort('message')}]
  					: [{label: recordCount, tightText: true, labelClass: styles.countLabel, colSpan: 2},
  							{label: <L p={p} t={`remove`}/>, tightText: true, clickFunction: handleRemoveMultipleOpen, redColor: true },
  							{label: <L p={p} t={`Date`}/>, tightText: true, clickFunction: () => resort('entryDate')},
  							{label: <L p={p} t={`Sender`}/>, tightText: true, clickFunction: () => resort('fromPersonFirstName')},
  							{label: <L p={p} t={`Subject`}/>, tightText: true, clickFunction: () => resort('subject')},
  							{label: <L p={p} t={`Message`}/>, tightText: true, clickFunction: () => resort('message')}]
  
  			if (messageSearch && announcementList && announcementList.length > 0) listType === 'sentBy'
  					? announcementList = announcementList.filter(m => moment(m.entryDate).format("D MMM YYYY").toLowerCase().indexOf(messageSearch) > -1 || String(m.recipients).toLowerCase().indexOf(messageSearch) > -1 || m.subject.toLowerCase().indexOf(messageSearch) > -1 || m.message.toLowerCase().indexOf(messageSearch) > -1)
  					: announcementList = announcementList.filter(m => moment(m.entryDate).format("D MMM YYYY").toLowerCase().indexOf(messageSearch) > -1 || m.fromPersonFirstName.toLowerCase().indexOf(messageSearch) > -1 || m.subject.toLowerCase().indexOf(messageSearch) > -1 || m.message.toLowerCase().indexOf(messageSearch) > -1)
  
  			if (sortByHeadings && sortByHeadings.sortField) {
  					announcementList = doSort(announcementList, sortByHeadings)
  			}
  
  			let data = announcementList && announcementList.length > 0 && announcementList.map((m, i) => {
  					return [
  							{ value: listType === 'sentBy' ? '' : <a onClick={() => {setStudentsSelected([m.fromPersonId], m.announcementId); navigate('/announcementEdit/reply/' + m.announcementId + '/' + m.fromPersonId + '/' + m.fromPersonFirstName + '/' + m.fromPersonLastName)}} className={styles.remove}><Icon pathName={'reply_arrow'} premium={true} className={styles.icon} fillColor={"#147EA7"}/></a>},
  							{ value: <a onClick={() => handleRemoveOpen(m.announcementId, listType)} className={styles.remove}><Icon pathName={'cross_circle'} premium={true} className={styles.icon} fillColor={"maroon"}/></a>},
  							{ value: <Checkbox id={m.announcementId} key={i} label={''} checked={isMultipleChecked(m.announcementId)} onClick={(event) => toggleCheckbox(event, m.announcementId, i)} className={styles.button}/>},
  							{ value: <a onClick={() => handleMessageOpen(m.announcementId)} className={classes(styles.link, styles.row)}><DateMoment date={m.entryDate} format={'D MMM  h:mm a'} minusHours={0}/></a>},
  							{ value: setColumnType(m, m.announcementId, m.fromPersonFirstName, m.fromPersonLastName, m.recipients)},
  							{ value: <a onClick={() => handleMessageOpen(m.announcementId)} className={classes(styles.link, styles.linkBold)}>{m.subject}</a>},
  							{ value: <a onClick={() => handleMessageOpen(m.announcementId)} className={styles.link}>{m.message.length> 50 ? m.message.substring(0,50) + '...' : m.message}</a>},
  					]
  			})
  
        return (
          <div className={styles.container}>
              <div className={mainmenuVersion ? '' : styles.marginLeft}>
  								{!mainmenuVersion &&
  		                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  		                  	{`Messages`}
  		                </div>
  								}
  								{multipleChecked && multipleChecked.length > 0 &&
  										<div className={classes(styles.row, styles.label)}>
  												Messages that are checked:
  												<div onClick={handleRemoveMultipleOpen} className={classes(styles.bigRedLink, styles.moreLeft)}>
  														<L p={p} t={`remove`}/>
  												</div>
  										</div>
  								}
  								{data && data.length > 5 &&
  										<div className={styles.instructions}>
  												<L p={p} t={`To choose a range of delete checkboxes, click on the first checkbox and then hold the SHIFT key while you click on the checkbox that is the last one you want to delete.`}/>
  												<L p={p} t={`All the checkboxes will be chosen in between.  Then click on the 'remove' label at the top of the list.`}/>
  										</div>
  								}
  								<div className={styles.scrollable}>
  										<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} isFetchingRecord={isFetchingRecord}/>
  								</div>
              </div>
  						{!mainmenuVersion &&
              		<OneFJefFooter />
  						}
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this message?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this message?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_removeMultiple &&
                  <MessageModal handleClose={handleRemoveMultipleClose} heading={<L p={p} t={`Remove multiple messages?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove the ${multipleChecked.length} messages that have checkmarks next to them?`}/>} isConfirmType={true}
                     onClick={handleRemoveMultiple} />
              }
  						{isShowingModal_message &&
                  <AnnouncementModal handleClose={handleMessageClose} onDelete={handleRemoveOpen} setStudentsSelected={setStudentsSelected}
  										personId={personId} messageFullThread={messageFullThread}/>
              }
  						{isShowingModal_recipients &&
  								<RecipientListModal handleClose={handleStudentListClose} announcement={announcement} announcementId={announcementId}
  										recipients={recipients} onDelete={handleRemoveOpen} />
  						}
          </div>
      )
}

export default AnnouncementList
