import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './BehaviorIncidentListView.css'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateMoment from '../../components/DateMoment'
import MessageModal from '../../components/MessageModal'
import InputText from '../../components/InputText'
import DateTimePicker from '../../components/DateTimePicker'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'

function BehaviorIncidentListView(props) {
  const [showSearchControls, setShowSearchControls] = useState(false)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [behaviorIncidentTypeId, setBehaviorIncidentTypeId] = useState('')
  const [partialNoteText, setPartialNoteText] = useState(props.studentChosenSession || '')
  const [partialNoteSearch, setPartialNoteSearch] = useState(props.studentChosenSession || '')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [staffMemberId, setStaffMemberId] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [timerId, setTimerId] = useState(setInterval(() => getBehaviorIncidents(personId), 10000))
  const [student, setStudent] = useState(undefined)
  const [isShowingModal_note, setIsShowingModal_note] = useState(true)
  const [note, setNote] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [isShowingModal_picture, setIsShowingModal_picture] = useState(true)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [noteHeading, setNoteHeading] = useState('')
  const [noteDisplay, setNoteDisplay] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(true)

  useEffect(() => {
    return () => {
      
      			if (timerId) {
      					clearInterval(timerId)
      					setTimerId('')
      			}
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {personId, getBehaviorIncidents, studentPersonId, students} = props
    			
    			if (!timerId) setTimerId(setInterval(() => getBehaviorIncidents(personId), 10000))
    			if ((!studentPersonId || studentPersonId === guidEmpty) && studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    					let student = students.filter(m => m.id === studentPersonId)[0]
    					setStudent(student); setStudentPersonId(studentPersonId); setShowSearchControls(true)
    			}
    	
  }, [])

  const {personId, myFrequentPlaces, setMyFrequentPlace, behaviorIncidents, behaviorIncidentTypes, students, staffMembers, fetchingRecord} = props
  		
  		let localIncidents = behaviorIncidents
  		let headings = [{},{},
  				{label: <L p={p} t={`Student`}/>, tightText: true},
  				{label: <L p={p} t={`Date`}/>, tightText: true},
  				{label: <L p={p} t={`Incident`}/>, tightText: true},
  				{label: <L p={p} t={`Note`}/>, tightText: true},
  				{label: <L p={p} t={`Picture`}/>, tightText: true},
  				{label: <L p={p} t={`Other students`}/>, tightText: true},
  				{label: <L p={p} t={`Staff involved`}/>, tightText: true},
  				{label: <L p={p} t={`Teacher response`}/>, tightText: true},
  				{label: <L p={p} t={`Admin response`}/>, tightText: true},
  				{label: <L p={p} t={`Parents contacted?`}/>, tightText: true},
  				{label: <L p={p} t={`Plan to contact parents?`}/>, tightText: true},
  				{label: <L p={p} t={`Parent contact date`}/>, tightText: true},
  				{label: <L p={p} t={`Should admin follow up?`}/>, tightText: true},
  				{label: <L p={p} t={`Submitted by`}/>, tightText: true},
  				{label: <L p={p} t={`Submitted on`}/>, tightText: true},
  		]
      let data = []
  
      if (localIncidents && localIncidents.length > 0) {
  				if ((behaviorIncidentTypeId && behaviorIncidentTypeId != 0) || (studentPersonId && studentPersonId != 0) || partialNoteText || fromDate || toDate) { //eslint-disable-line
  						if (behaviorIncidentTypeId && behaviorIncidentTypeId !== guidEmpty && behaviorIncidentTypeId != 0) { //eslint-disable-line
  								localIncidents = localIncidents && localIncidents.length > 0 && localIncidents.filter(m => {
  										let foundIncidentType = false
  										m.behaviorIncidentTypeChoices  && m.behaviorIncidentTypeChoices.length > 0 && m.behaviorIncidentTypeChoices.forEach(c => {
  												if (c.id === behaviorIncidentTypeId)  foundIncidentType = true
  										})
  										return foundIncidentType
  								})
  						}
  						if (partialNoteSearch) localIncidents = localIncidents.filter(m => m.note.indexOf(partialNoteSearch) > -1); //eslint-disable-line
  						if (fromDate && Number(fromDate.replace(/-/g,'')) > 20160101) {
  								localIncidents = localIncidents.filter(m => {
  										let incidentDate = m.incidentDate.indexOf('T') ? m.incidentDate.substring(0,m.incidentDate.indexOf('T')) : m.incidentDate
  										return incidentDate >= fromDate
   								})
  						}
  						if (toDate && Number(toDate.replace(/-/g,'')) > 20160101) {
  								localIncidents = localIncidents.filter(m => {
  										let incidentDate = m.incidentDate.indexOf('T') ? m.incidentDate.substring(0,m.incidentDate.indexOf('T')) : m.incidentDate
  										return incidentDate <= toDate
   								})
  						}
  						if (studentPersonId && studentPersonId !== guidEmpty && studentPersonId != 0) //eslint-disable-line
  								localIncidents = localIncidents.filter(m => {
  										let foundStudent = false
  										m.accusedStudents && m.accusedStudents.length > 0 && m.accusedStudents.forEach(a => {
  												if (a.id === studentPersonId) foundStudent = true
  										})
  										return foundStudent
  								})
  						}
  
  				if (!localIncidents || localIncidents.length === 0) {
  						data = [[{value: ''}, {value: <i>No records found.</i> }]]
  				} else {
  
  		        data = localIncidents && localIncidents.length > 0 && localIncidents.map(m => {
  								return [
                      {value: <Link to={`behaviorIncidentAdd/${m.behaviorIncidentId}`}>
  																<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  														</Link>
  										},
  			              {value: <a onClick={() => handleRemoveItemOpen(m.behaviorIncidentId)} className={styles.remove}>
  																<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  														</a>
  										},
  										{value: m.accusedStudents && m.accusedStudents.length > 0 && m.accusedStudents.map((m, i) =>
  														<div key={i}>
  																<Link to={`/studentProfile/${m.id}`} className={globalStyles.link}>
  																		{m.label}
  																</Link>
  														</div>
  												)
  										},
  										{value: <DateMoment date={m.incidentDate}/>},
  										{value: m.behaviorIncidentTypeChoices && m.behaviorIncidentTypeChoices.reduce((acc, m) => acc ? acc += ', ' + m.label : m.label, "")},
  										{value: m.note && m.note.length > 35
                                ? <div onClick={() => handleDescriptionOpen(m.accusedStudents.reduce((acc, s) => acc && acc.length > 0 ? acc += ', ' + s.label : s.label, ''), m.note)} className={globalStyles.link}>{m.note.substring(0,35) + '...'}</div>
                                : m.note
                      },
  										{value: <a onClick={() => handleImageViewerOpen(m.fileUrl)} className={globalStyles.link}>{m.fileUrl ? <L p={p} t={`picture`}/> : ''}</a>},
  										{value: m.otherStudents && m.otherStudents.reduce((acc, m) => acc ? acc += ', ' + m.label : m.label, "")},
  										{value: m.staffInvolved && m.staffInvolved.reduce((acc, m) => acc ? acc += ', ' + m.label : m.label, "")},
  										{value: m.adminTeacherResponses && m.adminTeacherResponses.length > 0 && m.adminTeacherResponses.filter(f => f.adminOrTeacher === 'Teacher').reduce((acc, f) => acc ? acc += ', ' + f.name : f.name, "")},
  										{value: m.adminTeacherResponses && m.adminTeacherResponses.length > 0 && m.adminTeacherResponses.filter(f => f.adminOrTeacher === 'Admin').reduce((acc, f) => acc ? acc += ', ' + f.name : f.name, "")},
  										{value: m.haveParentsBeenContacted === null ? '' : m.haveParentsBeenContacted ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>},
  										{value: m.planToContactParents === null ? '' : m.planToContactParents ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>},
  										{value: <DateMoment date={m.parentContactDateTime} includeTime={true} minusHours={6}/>},
  										{value: m.shouldAdminFollowUpStudent === null ? '' : m.shouldAdminFollowUpStudent ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>},
  										{value: m.entryPersonName},
  										{value: <DateMoment date={m.entryDate}/>},
  			          ]
  		        })
  				}
      }
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								<L p={p} t={`Behavior Incidents`}/>
  						</div>
  						<div className={styles.row}>
  								<a onClick={toggleSearch} className={classes(styles.row, globalStyles.link)}>
  										<Icon pathName={'magnifier'} premium={true} className={styles.iconTop}/>
  										{showSearchControls ? <L p={p} t={`Hide filters`}/> : <L p={p} t={`Show filters`}/>}
  								</a>
  								{showSearchControls && <a onClick={clearFilters} className={classes(styles.muchRight, globalStyles.link)}><L p={p} t={`Clear filters`}/></a>}
  								<div className={classes(styles.row, styles.moveLeftMuch)}>
  										<Icon pathName={'plus'} className={styles.iconTop} fillColor={'green'}/>
  										<Link to={`/behaviorIncidentAdd`} className={globalStyles.link}><L p={p} t={`Add Another Incident`}/></Link>
  								</div>
  						</div>
  						{showSearchControls &&
  								<div className={styles.moreBottom}>
                  <div>
                      <SelectSingleDropDown
                          id={`behaviorIncidentTypeId`}
                          name={`behaviorIncidentTypeId`}
                          label={<L p={p} t={`Level 1 incident types`}/>}
                          value={behaviorIncidentTypeId || ''}
                          options={behaviorIncidentTypes && behaviorIncidentTypes.filter(m => m.level === 1)}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={handleChange}/>
                  </div>
                  <div>
                      <SelectSingleDropDown
                          id={`behaviorIncidentTypeId`}
                          name={`behaviorIncidentTypeId`}
                          label={<L p={p} t={`Level 2 incident types`}/>}
                          value={behaviorIncidentTypeId || ''}
                          options={behaviorIncidentTypes && behaviorIncidentTypes.filter(m => m.level === 2)}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={handleChange}/>
                  </div>
                  <div>
                      <SelectSingleDropDown
                          id={`behaviorIncidentTypeId`}
                          name={`behaviorIncidentTypeId`}
                          label={<L p={p} t={`Level 3 incident types`}/>}
                          value={behaviorIncidentTypeId || ''}
                          options={behaviorIncidentTypes && behaviorIncidentTypes.filter(m => m.level === 3)}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={handleChange}/>
                  </div>
  										<div>
  												<SelectSingleDropDown
  														id={`studentPersonId`}
  														name={`studentPersonId`}
  														label={<L p={p} t={`Student`}/>}
  														value={studentPersonId || ''}
  														options={students}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  										</div>
                      <div>
  												<SelectSingleDropDown
  														id={`staffMemberId`}
  														name={`staffMemberId`}
  														label={<L p={p} t={`Staff`}/>}
  														value={staffMemberId || ''}
  														options={staffMembers}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  										</div>
  										<div className={styles.row}>
  												<div>
  														<InputText
  																id={"partialNoteText"}
  																name={"partialNoteText"}
  																size={"medium-short"}
  																label={<L p={p} t={`Note search`}/>}
  																value={partialNoteText || ''}
  																onChange={handlePartialNameText}
  																onEnterKey={handlePartialNameEnterKey}/>
  												</div>
  												<div onClick={setPartialNameText} className={styles.checkmarkPosition}>
  														<Icon pathName={'checkmark'} fillColor={partialNoteText ? 'green' : 'silver'}/>
  												</div>
  										</div>
  										<div>
  												<div className={classes(styles.littleLeft, styles.moreTop, styles.row)}>
  														<div className={styles.dateRow}>
  																<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={fromDate} maxDate={toDate} onChange={(event) => changeDate('fromDate', event)}/>
  														</div>
  														<div className={styles.dateRow}>
  																<DateTimePicker id={`toDate`} value={toDate} label={<L p={p} t={`To date`}/>} minDate={fromDate ? fromDate : ''} onChange={(event) => changeDate('toDate', event)}/>
  														</div>
  												</div>
  										</div>
  										<hr/>
  								</div>
  						}
  						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.behaviorIncidentList}/>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Behavior Incident List`}/>} path={'behaviorIncidentList'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						<OneFJefFooter />
  						{isShowingModal_note &&
  								<MessageModal handleClose={handleNoteClose} heading={<L p={p} t={`Note`}/>}
  									 explain={note} onClick={handleNoteClose} />
  						}
  						{isShowingModal_picture &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
              {isShowingModal_description &&
                  <MessageModal handleClose={handleDescriptionClose} heading={noteHeading}
                     explain={noteDisplay} onClick={handleDescriptionClose} />
              }
              {isShowingModal_remove &&
  								<MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this behavior incident?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this behavior incident?`}/>} isConfirmType={true}
  									 onClick={handleRemoveItem} />
  						}
        	</div>
      )
}

export default withAlert(BehaviorIncidentListView)
