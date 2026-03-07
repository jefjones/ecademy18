import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './GroupMemberAddView.css'
const p = 'GroupMemberAddView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import InputText from '../../components/InputText'
import TabPage from '../../components/TabPage'
import InvitesPending from '../../components/InvitesPending'
import GroupMembers from '../../components/GroupMembers'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import ContactSummary from '../../components/ContactSummary'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'

function GroupMemberAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [isBulkEntered, setIsBulkEntered] = useState(false)
  const [errorEmailAddress, setErrorEmailAddress] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [members, setMembers] = useState([])
  const [duplicateEntries, setDuplicateEntries] = useState([])
  const [isShowingNoBulkEntryMessage, setIsShowingNoBulkEntryMessage] = useState(false)
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
  const [bulk, setBulk] = useState({
          delimiter: 'comma',
          firstField: 'fullNameFirstFirst',
          secondField: 'emailAddress',
          thirdField: '',
          fourthField: '',
          fifthField: '',
          memberData: '', //This should always be text for the textarea.  Never an array of objects.
      })
  const [delimiter, setDelimiter] = useState('comma')
  const [firstField, setFirstField] = useState('fullNameFirstFirst')
  const [secondField, setSecondField] = useState('emailAddress')
  const [thirdField, setThirdField] = useState('')
  const [fourthField, setFourthField] = useState('')
  const [fifthField, setFifthField] = useState('')
  const [memberData, setMemberData] = useState('')
  const [contactMatches, setContactMatches] = useState([])
  const [localTabsData, setLocalTabsData] = useState(undefined)
  const [chosenTab, setChosenTab] = useState(undefined)
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
          setLocalTabsData(props.tabsData)
      
  }, [])

  const handleNoBulkEntryMessageOpen = () => {
    setIsShowingNoBulkEntryMessage(true)
  }

  const handleNoBulkEntryMessageClose = () => {
    setIsShowingNoBulkEntryMessage(false)
  }

  const {editorInvitePending, personId, deleteInvite, acceptInvite, resendInvite, setContactCurrentSelected, group, removeMember,
              bulkDelimiterOptions, fieldOptions} = props
      
  
      return (
          <section className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Group Members`}/>
              </div>
              <div className={styles.row}>
                  <span className={styles.subTitle}>{group && group.groupName}</span>
              </div>
              {editorInvitePending && editorInvitePending.length > 0 &&
                  <InvitesPending invites={editorInvitePending} personId={personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                      resendInvite={resendInvite} excludeReverseInvites={true}/>
              }
              {group && group.members && group.members.length > 0 &&
                  <GroupMembers members={group.members} personId={personId} groupId={group.groupId} removeMember={removeMember} />
              }
              <hr />
              <TabPage tabsData={localTabsData} onClick={handleFormChange} />
              {localTabsData && localTabsData.chosenTab === 'FieldEntry' &&
                  <div>
                      <div className={styles.formLeft}>
                          <InputText
                              size={"medium"}
                              name={"firstName"}
                              label={<L p={p} t={`First name`}/>}
                              value={user.firstName}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              error={errorFirstName} />
                          <InputText
                              size={"medium"}
                              name={"lastName"}
                              label={<L p={p} t={`Last name`}/>}
                              value={user.lastName}
                              onEnterKey={handleEnterKey}
                              onChange={changeUser}/>
                          <InputText
                              size={"medium"}
                              name={"memberId"}
                              label={<L p={p} t={`Internal id (optional)`}/>}
                              value={user.memberId}
                              onEnterKey={handleEnterKey}
                              onChange={changeUser}/>
                          <hr />
                          <InputText
                              size={"medium-long"}
                              name={"emailAddress"}
                              label={<L p={p} t={`Email address`}/>}
                              value={user.emailAddress}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              error={errorEmailAddress} />
                          <div className={styles.orPhone}><L p={p} t={`Or enter cell phone for text messaging:`}/></div>
                          <InputText
                              size={"medium-short"}
                              name={"phone"}
                              label={<L p={p} t={`Text message phone number`}/>}
                              value={user.phone}
                              onChange={changeUser}
                              onEnterKey={handleEnterKey}
                              instructions={<L p={p} t={`numbers only are acceptable`}/>} />
                          <hr />
                      </div>
                      <span className={styles.label}><L p={p} t={`Add a message (optional)`}/></span>
                      <textarea rows={5} cols={42} value={inviteMessage} onChange={(event) => handleMessageChange(event)}
                          className={styles.messageBox}></textarea>
                      <div className={classes(styles.rowRight)}>
                          <ButtonWithIcon label={<L p={p} t={`Save & Stay`}/>} icon={'checkmark_circle'} className={classes(styles.button, (isUserComplete ? styles.opacityFull : styles.opacityLow))} onClick={(event) => processForm("STAY", event)}/>
                          <ButtonWithIcon label={<L p={p} t={`Save & Finish`}/>} icon={'checkmark_circle'} className={classes(styles.button, (isUserComplete ? styles.opacityFull : styles.opacityLow))} onClick={(event) => processForm("FINISH", event)}/>
                      </div>
                  </div>
              }
              {localTabsData && localTabsData.chosenTab === 'BulkPaste' &&
                  <div className={styles.formLeft}>
                      <div className={classes(styles.rowRight)}>
                          <button className={classes(styles.button, (isBulkEntered ? styles.opacityFull : styles.opacityLow))} onClick={returnToBulkEntry}>
                              <L p={p} t={`<- Prev`}/>
                          </button>
                          <button className={classes(styles.button, (!!bulk.memberData ? styles.opacityFull : styles.opacityLow))}
                                  onClick={isBulkEntered ? processBulk : goToBulkVerification}>
                              {isBulkEntered ? <L p={p} t={`Finish`}/> : <L p={p} t={`Next ->`}/>}
                          </button>
                      </div>
                      {!isBulkEntered &&
                          <div>
                              <SelectSingleDropDown
                                  id={`delimiter`}
                                  label={<L p={p} t={`How are the fields separated?`}/>}
                                  value={bulk.delimiter}
                                  options={bulkDelimiterOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`firstField`}
                                  label={<L p={p} t={`First field`}/>}
                                  value={bulk.firstField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`secondField`}
                                  label={<L p={p} t={`Second field`}/>}
                                  value={bulk.secondField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`thirdField`}
                                  label={<L p={p} t={`Third field`}/>}
                                  value={bulk.thirdField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`fourthField`}
                                  label={<L p={p} t={`Fourth field`}/>}
                                  value={bulk.fourthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`fifthField`}
                                  label={<L p={p} t={`Fifth field`}/>}
                                  value={bulk.fifthField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <span className={styles.labelBulk}><L p={p} t={`Paste in member data in bulk (one member per line)`}/></span>
                              <textarea rows={25} cols={100} value={bulk.memberData} onChange={(event) => handleBulkEntry(event)}
                                  className={styles.bulkBox}></textarea>
                          </div>
                      }
                      {isBulkEntered &&
                          <div>
                              {duplicateEntries &&
                                  <div className={styles.column}>
                                      <div className={styles.warningText}><L p={p} t={`You have ${duplicateEntries.length} duplicate entries`}/></div>
                                      {!duplicateEntries.length ? '' :
                                          <table className={styles.tableStyle}>
                                              <thead>
                                                  <tr>
                                                      <td className={styles.hdr}><L p={p} t={`First`}/></td>
                                                      <td className={styles.hdr}><L p={p} t={`Last`}/></td>
                                                      <td className={styles.hdr}><L p={p} t={`Member id`}/></td>
                                                      <td className={styles.hdr}><L p={p} t={`Email address`}/></td>
                                                      <td className={styles.hdr}><L p={p} t={`Phone`}/></td>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                              {duplicateEntries && duplicateEntries.length > 0 && duplicateEntries.map((m, i) =>
                                                  <tr key={i}>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.firstName}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.lastName}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.memberId}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.emailAddress}</span>
                                                      </td>
                                                      <td>
                                                          <span className={styles.txtRed}>{m.phone}</span>
                                                      </td>
                                                  </tr>
                                              )}
                                              </tbody>
                                          </table>
                                      }
                                  </div>
                              }
                              <div className={styles.headerText}><L p={p} t={`${members.length} entries will be assigned to this group`}/></div>
                              <table className={styles.tableStyle}>
                                  <thead>
                                      <tr>
                                          <td className={styles.hdr}><L p={p} t={`First`}/></td>
                                          <td className={styles.hdr}><L p={p} t={`Last`}/></td>
                                          <td className={styles.hdr}><L p={p} t={`Member id`}/></td>
                                          <td className={styles.hdr}><L p={p} t={`Email address`}/></td>
                                          <td className={styles.hdr}><L p={p} t={`Phone`}/></td>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  {members && members.length > 0 && members.map((m, i) =>
                                      <tr key={i}>
                                          <td>
                                              <span className={styles.txt}>{m.firstName}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.lastName}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.memberId}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.emailAddress}</span>
                                          </td>
                                          <td>
                                              <span className={styles.txt}>{m.phone}</span>
                                          </td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          </div>
                      }
                  </div>
              }
              {contactMatches && contactMatches.length > 0 &&
                  <div>
                      <span className={styles.matches}>Found existing contacts: {contactMatches.length}</span><br/>
                      <Accordion allowMultiple={true}>
                          {contactMatches.map( (contactSummary, i) => {
                              return (
                                  <AccordionItem contactSummary={contactSummary} expanded={false} key={i} className={styles.accordionTitle} onTitleClick={() => {}}
                                      showAssignWorkToEditor={false} onContactClick={setContactCurrentSelected} personId={personId}>
                                  <ContactSummary key={i*100} summary={contactSummary} className={styles.contactSummary} showAccessIcon={true}
                                      userPersonId={contactSummary.personId} noShowTitle={true}/>
                                  </AccordionItem>
                              )
                          })}
                      </Accordion>
                  </div>
              }
              <OneFJefFooter />
              {isShowingNoBulkEntryMessage &&
                  <MessageModal handleClose={handleNoBulkEntryMessageClose} heading={<L p={p} t={`No entries found`}/>}
                     explainJSX={<L p={p} t={`It doesn't appear that there are any group members entered in the bulk entry box below.`}/>} isConfirmType={false}
                     onClick={handleNoBulkEntryMessageClose} />
              }
          </section>
      )
}

export default GroupMemberAddView
