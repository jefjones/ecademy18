import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './StudentAddBulkConfirmView.css'
import classes from 'classnames'
import EditTable from '../../components/EditTable'
import OneFJefFooter from '../../components/OneFJefFooter'
import { withAlert } from 'react-alert'
import {doSort} from '../../utils/sort'

function StudentAddBulkConfirmView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [learners, setLearners] = useState([])
  const [duplicateEntries, setDuplicateEntries] = useState([])
  const [contactMatches, setContactMatches] = useState([])
  const [isUserComplete, setIsUserComplete] = useState(undefined)

  const stripOutDuplicates = (newLearners) => {
    
          const {existingLearners, editorInvitePending} = props
          let duplicateEntries = []
          let minusMembers = Object.assign([], newLearners)
    
          newLearners && newLearners.length && newLearners.forEach((m, index) => {
              !!editorInvitePending && editorInvitePending.forEach(p => {
                  if ((m.firstName === p.firstName && m.lastName === p.lastName)
    											|| m.username === p.username
                          || m.emailAddress === p.emailAddress
                          || m.birthDate === p.birthDate
                          || m.phone === p.phone) {
                      duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m]
                      delete minusMembers[index]
                   }
                })
                existingLearners && existingLearners.length > 0 && existingLearners.forEach(p => {
                    if ((m.firstName === p.firstName && m.lastName === p.lastName)
    														|| m.username === p.username
                                || m.lastName === p.lastName
                                || m.emailAddress === p.emailAddress
                                || m.birthDate === p.birthDate
                                || m.phone === p.phone) {
                        duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m]
                        delete minusMembers[index]
                    }
                })
          })
    
          setDuplicateEntries(duplicateEntries)
          return minusMembers
      
  }

  const findContactMatches = (emailAddress, phone) => {
    
          const {contacts} = props
          if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
              setContactMatches(contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)))
          }
      
  }

  const showNextButton = () => {
    
        
        if (user.firstName && ((user.emailAddress && validateEmail(user.emailAddress)) || (user.phone && user.phone.length > 8))) {
            setIsUserComplete(true)
        } else {
            setIsUserComplete(false)
        }
      
  }

  const validateEmail = (email) => {
    
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
          return re.test(email)
      
  }

  const validatePhone = (phone) => {
    
          return stripPhoneFormatAndPrefix(phone).length === 10 ? true : false
      
  }

  const stripPhoneFormatAndPrefix = (phone) => {
    
          phone = phone && phone.replace(/\D+/g, "")
          if (phone && phone.indexOf('1') === 0) { //if 1 is in the first place, get rid of it.
              phone = phone.substring(1)
          }
          return phone
      
  }

  const handleBirthDate = (event) => {
    
        let user = state.user
        user.birthDate = event.target.value
        setUser(user)
      
  }

  const fillInEmailAddress = (event) => {
    
    			//if this is a valid email address and the emailAddress is empty, fill it in automatically with the user
    			
    			let username = event.target.value
    			if (validateEmail(username) && !user.emailAddress) user.emailAddress = username
    	
  }

  const checkDuplicateUsername = (event) => {
    
    			props.isDuplicateUsername(event.target.value)
    	
  }

  const processBulk = () => {
    
    			const {personId, processStudentBulkEntry} = props
    			processStudentBulkEntry(personId)
    			navigate('/firstNav')
    	
  }

  let {studentBulkEntryDetails, personConfigEntry, fileFields, fetchingRecord} = props
      //
  
  		personConfigEntry = doSort(personConfigEntry, { sortField: 'sequence', isAsc: true, isNumber: true })
  		studentBulkEntryDetails = doSort(studentBulkEntryDetails, { sortField: 'sequence', isAsc: true, isNumber: true })
  
  		//1. Create the header columns by looping through the personConfigEntry to see which fields were actually used.
  		//2. Create the data rows by looping through the studentBulkEntryDetails in the order they were received
  	  //      a. In that loop, loop through the personConfigEntry records to determine the horizontal order to display the data in columns.
  		let headings = []
  		personConfigEntry && personConfigEntry.length > 0 && personConfigEntry.forEach(m => {
  				let fileField = fileFields && fileFields.length > 0 && fileFields.filter(f => f.fileFieldId === m.fileFieldId)[0]
  				let fileFieldName = ''
  				if (fileField && fileField.name) fileFieldName = fileField.name
  
  				headings.push({
  						verticalText: true,
  						label: fileFieldName,
  						reactHint:  fileFieldName,
  				})
  		})
  
  		let data = []
  
  		studentBulkEntryDetails && studentBulkEntryDetails.length > 0 && studentBulkEntryDetails.forEach(m => {
  				let row = []
  				let isDuplicate = false
  				let isNameMatch = false
  
  				learners && learners.length > 0 && learners.forEach(l => {
  						if ((!!m.externalId && l.studentId === m.externalId)
  									|| (!!m.emailAddress && l.emailAddress === m.emailAddress)
  									|| (!!m.cellPhone && l.phone === m.cellPhone)) isDuplicate = true
  						if (!!m.firstName && l.firstName === m.firstName && !!m.lastName && l.lastName === m.lastName) isNameMatch = true
  				})
  
  				personConfigEntry && personConfigEntry.length > 0 && personConfigEntry.forEach(p => {
  						let fileField = fileFields && fileFields.length > 0 && fileFields.filter(f => f.fileFieldId === p.fileFieldId)[0]
  						if (fileField && fileField.code) {
  								row.push({
  										value: m[fileField.code],
  										reactHint: fileField.name,
  										cellColor: isDuplicate ? 'red' : isNameMatch ? 'pink' : '',
  										textColor: isDuplicate || isNameMatch ? 'white' : '',
  								})
  						}
  				})
  				data.push(row)
  		})
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <span className={globalStyles.pageTitle}><L p={p} t={`Confirm Students Bulk Upload`}/></span>
              </div>
  						<div className={classes(styles.row, styles.text)}>
  								<div className={classes(styles.redBack, styles.legend)}>
  										&nbsp
  								</div>
  								<L p={p} t={`Duplicate - will not be inserted (phone, emailaddress or studentId)`}/>
  						</div>
  						<div className={classes(styles.row, styles.text)}>
  								<div className={classes(styles.pinkBack, styles.legend)}>
  										&nbsp
  								</div>
  								<L p={p} t={`Name match - will still be inserted (first and last name)`}/>
  						</div>
              <div className={classes(styles.rowRight)}>
                  <button className={styles.button} onClick={() => navigate('/studentAddBulk')}>
                      <L p={p} t={`<- Prev`}/>
                  </button>
                  <button className={styles.button} onClick={processBulk}>
                      <L p={p} t={`Finish`}/>
                  </button>
  								<div className={styles.text}>
  										count: {studentBulkEntryDetails && studentBulkEntryDetails.length}
  								</div>
              </div>
  						<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} emptyMessage={<L p={p} t={`Your data is being loaded ... unless there was a problem.  Stand by...`}/>}
  								isFetchingRecord={fetchingRecord.studentAddBulkConfirm}/>
              <OneFJefFooter />
          </div>
      )
}

export default withAlert(StudentAddBulkConfirmView)
