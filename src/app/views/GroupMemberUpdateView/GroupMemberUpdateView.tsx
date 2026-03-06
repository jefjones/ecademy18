import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
import styles from './GroupMemberUpdateView.css'
const p = 'GroupMemberUpdateView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import InputText from '../../components/InputText'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

//This page is different out of necessity because a group member can have its data manipulated by the teacher.  But be aware that them
//  PersonGroupAssign table has its own copy of the first name, last name, email address, phone, and internal member id.  The user can
//  change their own name for their own record on Penspring and continue to use Penspring at their own discretion.  This is particularly
//  helpful, too, in class arrangements when the names of the people need to be hidden from other students. An arbitrary nickname can be given.

function GroupMemberUpdateView(props) {
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [errorEmailAddress, setErrorEmailAddress] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        memberId: '',
        emailAddress: '',
        phone: '',
      })
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [memberId, setMemberId] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
          set// errorEmailAddress(''); set// errorFirstName(''); setUser(props.member);
      
  }, [])

  const {group} = props
      
  
      return (
          <div className={styles.container}>
              <div className={styles.titleLine}>
                  <span className={globalStyles.pageTitle}>Group Members</span>
              </div>
              <div className={styles.row}>
                  <span className={styles.subTitle}>{group && group.groupName}</span>
              </div>
              <div>
                  <div className={styles.formLeft}>
                      <InputText
                          size={"medium"}
                          name={"firstName"}
                          label={<L p={p} t={`First name`}/>}
                          value={user.firstName || ''}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          error={errorFirstName} />
                      <InputText
                          size={"medium"}
                          name={"lastName"}
                          label={<L p={p} t={`Last name`}/>}
                          value={user.lastName || ''}
                          onEnterKey={handleEnterKey}
                          onChange={changeUser}/>
                      <InputText
                          size={"medium"}
                          name={"memberId"}
                          label={<L p={p} t={`Internal id (optional)`}/>}
                          value={user.memberId || ''}
                          onEnterKey={handleEnterKey}
                          onChange={changeUser}/>
                      <hr />
                      <InputText
                          size={"medium-long"}
                          name={"emailAddress"}
                          label={<L p={p} t={`Email address`}/>}
                          value={user.emailAddress || ''}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          error={errorEmailAddress} />
                      <div className={styles.orPhone}><L p={p} t={`Or enter cell phone for text messaging:`}/></div>
                      <InputText
                          size={"medium-short"}
                          name={"phone"}
                          label={<L p={p} t={`Text message phone number`}/>}
                          value={user.phone || ''}
                          onChange={changeUser}
                          onEnterKey={handleEnterKey}
                          instructions={<L p={p} t={`numbers only are acceptable`}/>} />
                      <hr />
                  </div>
                  <div className={classes(styles.rowRight)}>
                      <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} className={styles.button} onClick={(event) => processForm(event)}/>
                  </div>
              </div>
              <OneFJefFooter />
          </div>
      )
}

export default GroupMemberUpdateView
