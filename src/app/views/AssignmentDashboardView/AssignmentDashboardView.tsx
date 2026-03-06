import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './AssignmentDashboardView.css'
const p = 'AssignmentDashboardView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import globalStyles from '../../utils/globalStyles.css'
import GroupTools from '../../components/GroupTools'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import EditTable from '../../components/EditTable'
import StatusLegend from '../../components/StatusLegend'
import numberFormat from '../../utils/numberFormat'
import OneFJefFooter from '../../components/OneFJefFooter'

function AssignmentDashboardView(props) {
  const [isShowingSubMenu, setIsShowingSubMenu] = useState(false)
  const [timerId, setTimerId] = useState(null)
  const [peerGroupId, setPeerGroupId] = useState(event.target.value)
  const [member_personId, setMember_personId] = useState(event.target.value)
  const [isShowingModal_noMemberChosen, setIsShowingModal_noMemberChosen] = useState(true)
  const [isShowingModal_deleteMember, setIsShowingModal_deleteMember] = useState(false)
  const [isShowingModal_deleteWork, setIsShowingModal_deleteWork] = useState(false)
  const [isShowingModal_noPeerGroupChosen, setIsShowingModal_noPeerGroupChosen] = useState(true)
  const [isShowingModal_deletePeerGroup, setIsShowingModal_deletePeerGroup] = useState(false)

  const {personId, groupSummary, setGroupCurrentSelected, deleteGroup, headTitle, subHeadTitle, headings, data,  statusLegend,
                  setWorkCurrentSelected, updatePersonConfig, personConfig} = props
        
  
        return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Assignment Dashboard`}/>
              </div>
              <div className={styles.subTitle}>
                  {groupSummary.groupName}
              </div>
              <div className={styles.subTitle}>
                  <GroupTools personId={personId} summary={groupSummary} currentTool={'assignmentDashboard'}
                      setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup}
                      isOwner={personId === groupSummary.ownerPersonId} className={styles.tools}
                      updatePersonConfig={updatePersonConfig} personConfig={personConfig} />
              </div>
              <hr />
              <div className={styles.menuItem}>
                  <Link to={`/workAddNew/${groupSummary && groupSummary.groupId}`} className={styles.addNew}>
                      {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new assignment`}/> : <L p={p} t={`Add new document`}/>}
                  </Link>
              </div>
              <hr />
              <div className={styles.menuItem}>
                  <Link to={`/groupMemberAdd`} className={styles.addNew}>
                      {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new learner`}/> : <L p={p} t={`Add new member`}/>}
                  </Link>
              </div>
              <hr />
              <table className={styles.tableDisplay}>
                <tbody>
                  <tr>
                      <td className={styles.tableLabel}>
                          <span className={styles.tableLabel}>{groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Assignments`}/> : <L p={p} t={`Documents`}/>}</span>
                      </td>
                      <td className={styles.tableLabel}>
                          <span className={styles.count}>{numberFormat(groupSummary.workSummaries.length || 0)}</span>
                      </td>
                      <td colSpan={3}>
                          <div className={styles.rowTight}>
                              <div>
                                  <SelectSingleDropDown
                                      id={`works`}
                                      label={``}
                                      value={groupSummary.masterWorkId}
                                      options={groupSummary.workSummaries}
                                      className={styles.singleDropDown}
                                      noBlank={true}
                                      error={''}
                                      height={`medium`}
                                      onChange={onChangeWork} />
                              </div>
                              <a onClick={() => setWorkCurrentSelected(personId, groupSummary.masterWorkId, '', '', "/workSettings")} className={styles.linkStyle}>
                                  <Icon pathName={`pencil0`} premium={true} className={styles.image}/>
                              </a>
                              <a onClick={handleDeleteWorkOpen} className={styles.linkStyle}>
                                  <Icon pathName={`trash2`} premium={true} className={styles.image}/>
                              </a>
                              {!!groupSummary.workSummaries &&
                                  <a onClick={sendToWorkAssign} className={styles.rowTight}>
                                      <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                                      <Icon pathName={`user_plus0`} premium={true} className={styles.imageOverlay}/>
                                  </a>
                              }
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td className={styles.tableLabel}>
                          <span className={styles.tableLabel}>{groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Learners`}/> : <L p={p} t={`Editors`}/>}</span>
                      </td>
                      <td className={styles.tableLabel}>
                          <span className={styles.count}>{numberFormat(groupSummary.members.length || 0)}</span>
                      </td>
                      <td>
                          <div className={styles.rowTight}>
                              <div>
                                  <SelectSingleDropDown
                                      id={`members`}
                                      label={``}
                                      value={member_personId}
                                      options={groupSummary.members}
                                      className={styles.singleDropDown}
                                      error={''}
                                      height={`medium`}
                                      onChange={onChangeMember}/>
                              </div>
                              <a onClick={handleSendMemberUpdate} className={classes(styles.linkStyle, member_personId ? styles.fullOpacity : styles.lowOpacity)}>
                                  <Icon pathName={`pencil0`} premium={true} className={styles.image}/>
                              </a>
                              <a onClick={handleDeleteMemberOpen} className={styles.linkStyle}>
                                  <Icon pathName={`trash2`} premium={true} className={styles.image}/>
                              </a>
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
          <hr />
          {data && data.length > 0 &&
              <div>
                  <div className={styles.column}>
                      <div>
                          <div className={styles.headTitle}>{headTitle}</div>
                          <div className={styles.subHeadTitle}>{subHeadTitle}</div>
                      </div>
                      <StatusLegend opened={isShowingSubMenu} toggleOpen={handleToggleSubMenu} subjectBody={statusLegend}
                          headerText={<L p={p} t={`status legend`}/>} className={styles.statusLegend}/>
                  </div>
                  <EditTable labelClass={styles.tableLabelClass} headings={headings}
                      data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                      sendToReport={handlePathLink}/>
              </div>
          }
          {(!data || data.length === 0) &&
              <div className={styles.noAccess}>
                  <L p={p} t={`Access to this assignment has not yet been granted.`}/><br />
                  <L p={p} t={`You can grant access`}/>
                  <a onClick={sendToWorkAssign} className={styles.linkStyle}>
                      here.
                  </a>
                  <a onClick={sendToWorkAssign} className={classes(styles.moreLeftMargin, styles.linkStyle)}>
                      <Icon pathName={`user_plus0`} premium={true} className={styles.image}/>
                  </a>
                  <L p={p} t={`Or if you just granted access, the new assignments are being copied out to the learners.`}/>
                  <L p={p} t={`Please refresh this page in a few moments.`}/>
              </div>
          }
          {isShowingModal_deleteMember &&
              <MessageModal handleClose={handleDeleteMemberClose} heading={<L p={p} t={`Remove this member from this group?`}/>}
                 explainJSX={<L p={p} t={`Are you sure you want to delete this member from this group?`}/>} isConfirmType={true}
                 onClick={handleDeleteMember} />
          }
          {isShowingModal_noMemberChosen &&
              <MessageModal handleClose={handleMemberNotChosenClose} heading={<L p={p} t={`No member chosen`}/>}
                 explainJSX={<L p={p} t={`Please choose a member before requesting to delete a member.`}/>} isConfirmType={false}
                 onClick={handleMemberNotChosenClose} />
          }
          {isShowingModal_deleteWork &&
              <MessageModal handleClose={handleDeleteWorkClose} heading={<L p={p} t={`Remove this document from this group?`}/>}
                 explainJSX={<L p={p} t={`Are you sure you want to delete this document from this group?`}/>} isConfirmType={true}
                 onClick={handleDeleteWork} />
          }
          {isShowingModal_deletePeerGroup &&
              <MessageModal handleClose={handleDeletePeerGroupClose} heading={<L p={p} t={`Delete this peer group?`}/>}
                 explainJSX={<L p={p} t={`Are you sure you want to delete this peer group?`}/>} isConfirmType={true}
                 onClick={handleDeletePeerGroup} />
          }
          {isShowingModal_noPeerGroupChosen &&
              <MessageModal handleClose={handlePeerGroupNotChosenClose} heading={<L p={p} t={`No peer group chosen`}/>}
                 explain={<L p={p} t={`Please choose a peer group before requesting to delete a peer group.`}/>} isConfirmType={false}
                 onClick={handlePeerGroupNotChosenClose} />
          }
  
          <OneFJefFooter />
      </div>
  )
}

export default AssignmentDashboardView
