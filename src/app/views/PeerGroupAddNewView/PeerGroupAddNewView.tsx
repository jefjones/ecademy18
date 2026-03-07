import { useEffect, useState } from 'react'
import * as styles from './PeerGroupAddNewView.css'
const p = 'PeerGroupAddNewView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import TextDisplay from '../../components/TextDisplay'
import Icon from '../../components/Icon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import * as guid from '../../utils/guidValidate'

function PeerGroupAddNewView(props) {
  const [peerGroupName, setPeerGroupName] = useState('')
  const [subGroupCount, setSubGroupCount] = useState('')
  const [peerGroupNameError, setPeerGroupNameError] = useState('')
  const [subGroupCountError, setSubGroupCountError] = useState('')
  const [notAssigned, setNotAssigned] = useState([])
  const [assignedSubGroup, setAssignedSubGroup] = useState([])
  const [unevenCount, setUnevenCount] = useState(0)
  const [memberToBeAssigned, setMemberToBeAssigned] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [unassignedMembers, setUnassignedMembers] = useState(undefined)
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
            const {assignedSubGroup, subGroupCount, peerGroupName} = props
            //document.getElementById('peerGroupName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
            setAssignedSubGroup(assignedSubGroup); setSubGroupCount(subGroupCount ? subGroupCount : 1); setPeerGroupName(peerGroupName)
        
  }, [])

  let {summary, subGroupCountOptions} = props

  return (
              <div className={styles.container}>
                  <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                      <div className={globalStyles.pageTitle}>
                          <L p={p} t={`Create New Peer Group`}/>
                      </div>
                      <div className={styles.subTitle}>
                          {summary.groupName}
                      </div>
                      <div className={styles.containerName}>
                          <InputText
                              value={peerGroupName}
                              size={"medium-long"}
                              name={"peerGroupName"}
                              label={<L p={p} t={`Peer group name`}/>}
                              onChange={handleNameChange}
                              error={peerGroupNameError}/>
  
                          <TextDisplay label={<L p={p} t={`Group members`}/>} text={summary && summary.members && summary.members.length} className={styles.textDisplay}/>
  
                          <div className={styles.marginTop}>
                              <SelectSingleDropDown
                                  id={`subGroupCount`}
                                  label={<L p={p} t={`Number of groups desired`}/>}
                                  value={subGroupCount}
                                  options={subGroupCountOptions}
                                  className={styles.singleDropDown}
                                  noBlank={true}
                                  error={subGroupCountError}
                                  height={`medium-short`}
                                  onChange={handleSubGroupCountChange} />
                          </div>
                      </div>
                      <hr />
                      <div className={styles.row}>
                          <span onClick={handleSubGroupCreate} className={styles.button}>{!!assignedSubGroup && assignedSubGroup.length > 0 ? <L p={p} t={`Update Groups`}/> : <L p={p} t={`Make Groups`}/>}</span>
                          {!isSubmitted &&
                              <span onClick={!!assignedSubGroup && assignedSubGroup.length > 0 ? handleSubmit : () => {}} className={classes(styles.button, !!assignedSubGroup && assignedSubGroup.length > 0 ? styles.fullOpacity : styles.lowOpacity) }>
                                  <L p={p} t={`Finish`}/>
                              </span>
                          }
                      </div>
                      <hr />
                      {!!unevenCount &&
                          <div className={styles.extraMembers}>
                              {unevenCount === 1
                                  ? <L p={p} t={`The first group has one more member than the other groups`}/>
                                  : <L p={p} t={`The first ${unevenCount} groups have one more member than the other groups`}/>
                              }
                          </div>
                      }
                      {unassignedMembers && unassignedMembers.length > 0 &&
                          <div className={styles.unassignedMembers}>
                              {unassignedMembers.length === 1
                                  ? <L p={p} t={`There is one unassigned member`}/>
                                  : <L p={p} t={`There are ${unassignedMembers.length} unassigned members`}/>
                              }
                          </div>
                      }
                      {assignedSubGroup &&
                              !!assignedSubGroup && assignedSubGroup.map((m, i) =>
                                  <div key={i}>
                                      <InputText
                                          value={m.name}
                                          size={"medium"}
                                          name={m.sequence}
                                          label={<L p={p} t={`Sub group name`}/>}
                                          onChange={(event) => handleSubGroupNameChange(m.sequence, event)}/>
                                      {unassignedMembers && unassignedMembers.length > 0 &&
                                          <div className={classes(styles.row)}>
                                              <div>
                                                  <SelectSingleDropDown
                                                      id={`unassignedMembers`}
                                                      label={<L p={p} t={`Unassigned members`}/>}
                                                      value={memberToBeAssigned}
                                                      options={unassignedMembers}
                                                      className={styles.singleDropDown}
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
                                          <div key={ind} className={styles.row}>
                                              <a onClick={() => handleRemoveMember(m.sequence, d.personId)}>
                                                  <Icon pathName={`move_sentence`} className={styles.image}/>
                                              </a>
                                              <span className={styles.member}>{d.firstName + ' ' + d.lastName}</span>
                                          </div>
                                      )}
                                  </div>
                              )
                      }
                      <OneFJefFooter />
                  </form>
              </div>
          )
}

//    djsConfig={djsConfig} />
export default PeerGroupAddNewView
