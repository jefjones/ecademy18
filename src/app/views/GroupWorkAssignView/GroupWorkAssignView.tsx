import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './GroupWorkAssignView.css'
const p = 'GroupWorkAssignView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import TextDisplay from '../../components/TextDisplay'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import * as guid from '../../utils/GuidValidate'

function GroupWorkAssignView(props) {
  const [peerGroupOpen, setPeerGroupOpen] = useState(false)
  const [copyPreviousPeerGroupId, setCopyPreviousPeerGroupId] = useState('')
  const [subGroupCountError, setSubGroupCountError] = useState('')
  const [notAssigned, setNotAssigned] = useState([])
  const [accessAssigned, setAccessAssigned] = useState([])
  const [unevenCount, setUnevenCount] = useState(0)
  const [memberToBeAssigned, setMemberToBeAssigned] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasRemainderMessage, setHasRemainderMessage] = useState('')
  const [isShowingPeerGroupInfo, setIsShowingPeerGroupInfo] = useState(false)
  const [localData, setLocalData] = useState(undefined)
  const [parentPeerGroupName, setParentPeerGroupName] = useState(undefined)
  const [peerGroupName, setPeerGroupName] = useState(undefined)
  const [peerGroups, setPeerGroups] = useState(undefined)
  const [unassignedMembers, setUnassignedMembers] = useState(undefined)
  const [subGroupCount, setSubGroupCount] = useState(undefined)
  const [membersPerGroup, setMembersPerGroup] = useState(undefined)
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
            const {accessAssigned, peerGroupName} = props
            setAccessAssigned(accessAssigned); setPeerGroupName(peerGroupName)
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            if (prevProps.accessAssigned !== props.accessAssigned) {
                setAccessAssigned(props.accessAssigned)
                getUnassignedOptions(props.accessAssigned.peerGroups)
            }
            if (prevState.accessAssigned !== accessAssigned) {
                setAccessAssigned(accessAssigned)
            }
        
  }, [])

  const handlePeerGroupInfoClose = () => {
    return setIsShowingPeerGroupInfo(false)
        handlePeerGroupInfoOpen = () => setIsShowingPeerGroupInfo(true)
    
        render() {
              let {groupSummary, workSummary, subGroupCountOptions} = props
  }

  const handlePeerGroupInfoOpen = () => {
    return setIsShowingPeerGroupInfo(true)
    
        render() {
              let {groupSummary, workSummary, subGroupCountOptions} = props
  }

  let {groupSummary, workSummary, subGroupCountOptions} = props
            let {subGroupCountError, accessAssigned, unassignedMembers, hasRemainderMessage, memberToBeAssigned,peerGroupOpen,
                  isShowingPeerGroupInfo, copyPreviousPeerGroupId} = state
  
            return (
              <div className={styles.container}>
                  <div className={globalStyles.pageTitle}>
                      {groupSummary.groupTypeName === "FACILITATORLEARNER"
                          ? <L p={p} t={`Grant Access to Learners`}/>
                          : <L p={p} t={`Grant Access to Members`}/>
                      }
                  </div>
                  <div className={styles.subTitle}>
                      <span className={styles.subLabel}>group:</span>
                      {groupSummary.groupName}
                  </div>
                  <div className={styles.subTitle}>
                      <span className={styles.subLabel}>assignment:</span>
                      {workSummary.workName}
                  </div>
                  <div className={styles.containerName}>
                      <TextDisplay label={<L p={p} t={`Group members`}/>} text={groupSummary && groupSummary.members && groupSummary.members.length} className={styles.textDisplay}/>
  
                      <div className={classes(styles.row, styles.clickable)}>
                          <a onClick={togglePeerGroupOpen}><Icon pathName={'group_work'} premium={true}/></a>
                          <span className={styles.text} onClick={togglePeerGroupOpen}><L p={p} t={`Split the class into peer groups?`}/></span>
                          <a onClick={togglePeerGroupOpen} className={styles.caretPosition}>
                              <Icon pathName={'chevron_down'} className={peerGroupOpen ? styles.chevronUp : styles.chevronDown} />
                          </a>
                          <a onClick={handlePeerGroupInfoOpen}><Icon pathName={`info0`} className={styles.infoImage}/></a>
                      </div>
  
                      {peerGroupOpen &&
                          <div>
                              <div className={styles.row}>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`copyPreviousPeerGroupId`}
                                          label={<L p={p} t={`(optional) Copy peer group from previous assignment`}/>}
                                          value={copyPreviousPeerGroupId}
                                          options={accessAssigned.otherWorkPeerGroups}
                                          className={styles.singleDropDown}
                                          height={`medium`}
                                          onChange={handlePrevPeerGroupChange} />
                                  </div>
                                  <a onClick={handleCopyPreviousPeerGroup}>
                                      <Icon pathName={`checkmark`} className={classes(styles.farLeft, styles.imageTopMargin)}/>
                                  </a>
                              </div>
                              <div className={styles.row}>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`subGroupCount`}
                                          label={<L p={p} t={`Number of groups`}/>}
                                          value={accessAssigned.subGroupCount}
                                          options={subGroupCountOptions}
                                          className={styles.singleDropDown}
                                          error={subGroupCountError}
                                          height={`medium-short`}
                                          onChange={handleSubGroupCountChange} />
                                  </div>
                                  <span className={styles.bigText}>- OR -</span>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`membersPerGroup`}
                                          label={<L p={p} t={`Members per group`}/>}
                                          value={accessAssigned.membersPerGroup}
                                          options={subGroupCountOptions}
                                          className={styles.singleDropDown}
                                          error={subGroupCountError}
                                          height={`medium-short`}
                                          onChange={handleMembersPerGroupChange} />
                                  </div>
                              </div>
                              <div className={styles.textWarning}>{hasRemainderMessage}</div>
                              <div className={styles.parentGroup}>
                                  <InputText
                                      value={accessAssigned.parentPeerGroupName || ''}
                                      size={"medium-long"}
                                      name={'parentPeerGroupName'}
                                      label={<L p={p} t={`(optional) Give this peer group setup a name`}/>}
                                      onChange={handleParentPeerGroupNameChange}/>
                              </div>
                              <div onClick={handleSubGroupCreate} className={styles.button}>
                                  {accessAssigned && !!accessAssigned.peerGroups && accessAssigned.peerGroups.length > 0 ? <L p={p} t={`Reset Groups`}/> : <L p={p} t={`Make Groups`}/>}
                              </div>
                          </div>
                      }
                  </div>
                  <hr />
                  {unassignedMembers && unassignedMembers.length > 0 &&
                      <div className={styles.unassignedMembers}>
                          {unassignedMembers.length === 1
                              ? <L p={p} t={`There is one unassigned member`}/>
                              : <L p={p} t={`There are ${unassignedMembers.length} unassigned members`}/>
                          }
                      </div>
                  }
                  <div className={classes(styles.row)}>
                      <button className={styles.button} onClick={(event) => processForm("STAY", event)}>
                          <L p={p} t={`Save & Stay`}/>
                      </button>
                      <button className={styles.button} onClick={(event) => processForm("FINISH", event)}>
                          <L p={p} t={`Save & Finish`}/>
                      </button>
                      <a className={styles.resetButton} onClick={resetData}>reset</a>
                  </div>
                  {accessAssigned &&
                      accessAssigned && !!accessAssigned.peerGroups && accessAssigned.peerGroups.map((m, i) =>
                          <div key={i}>
                              <div className={styles.setAll}>
                                  <a onClick={setAllAccess}>set all</a>
                              </div>
                              {accessAssigned.peerGroups.length > 1 &&
                                  <InputText
                                      value={m.name}
                                      size={"medium"}
                                      name={m.sequence}
                                      inputClassName={styles.subGroupInput}
                                      label={<L p={p} t={`Sub group name`}/>}
                                      onChange={(event) => handleSubGroupNameChange(m.sequence, event)}/>
                              }
                              {unassignedMembers && unassignedMembers.length > 0 &&
                                  <div className={classes(styles.row)}>
                                      <div>
                                          <SelectSingleDropDown
                                              id={`unassignedMembers`}
                                              label={<L p={p} t={`Unassigned members`}/>}
                                              value={memberToBeAssigned}
                                              options={unassignedMembers}
                                              className={classes(styles.singleDropDown, styles.moreLeft)}
                                              noBlank={true}
                                              height={`medium`}
                                              onChange={handleMemberToBeAssigned} />
                                      </div>
                                      <a onClick={() => handleAddUnassigned(m.sequence)}>
                                          <Icon pathName={`checkmark`} className={styles.imageTopMargin}/>
                                      </a>
                                  </div>
                              }
                              {m.members && m.members.length > 0 && m.members.map((d, ind) =>
                                  <div key={ind} className={classes(styles.row, styles.leftMargin)}>
                                      {accessAssigned.peerGroups.length > 1 &&
                                          <a onClick={() => handleRemoveMember(m.sequence, d.personId)}>
                                              <Icon pathName={`move`} className={styles.image} premium={true}/>
                                          </a>
                                      }
                                      <Checkbox
                                          id={`memberAccess`}
                                          label={``}
                                          checked={d.workAccess}
                                          className={styles.checkbox}
                                          onClick={() => handleAccessChange(i, ind)}/>
                                      {d.workAccess && d.isLockedAccess && <Icon pathName={`locked0`} premium={true} fillColor={'maroon'} className={styles.locked}/>}
                                      <span className={styles.member} onClick={() => handleAccessChange(i, ind)}>
                                          {d.firstName + ' ' + d.lastName}
                                      </span>
                                  </div>
                              )}
                          </div>
                      )
                  }
                  <OneFJefFooter />
                  {isShowingPeerGroupInfo &&
                      <MessageModal handleClose={handlePeerGroupInfoClose} heading={<L p={p} t={`How to use peer groups with an assignment`}/>} showPeerGroupInfo={true}
                          explainJSX={[<L p={p} t={`Peer groups will allow members of each sub group to view and edit each other's assignments.`}/>,<br/>,<br/>,
                              <L p={p} t={`If you only want one assignment per peer group, grant access to one student. That student will become the one person who can finalize the document by accepting the others' edits.`}/>,<br/>,<br/>,
                              <L p={p} t={`Or, if you want every student to have their own copy to turn in, give access to everyone.  They will each become the author of their own assignment and the others can contribute by making edits.`}/>]}
                          onClick={handlePeerGroupInfoClose}/>
                  }
              </div>
          )
}
export default GroupWorkAssignView
