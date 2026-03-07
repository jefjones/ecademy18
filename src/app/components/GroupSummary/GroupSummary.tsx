import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './GroupSummary.css'
import classes from 'classnames'
import GroupTools from '../../components/GroupTools'
import TextDisplay from '../../components/TextDisplay'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import numberFormat from '../../utils/numberFormat'
import * as guid from '../../utils/guidValidate'
const p = 'component'
import L from '../../components/PageLanguage'

function GroupSummary(props) {
  const [caretClassName, setCaretClassName] = useState(classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown))
  const [expanded, setExpanded] = useState(props.expanded ? true : false)
  const [isShowingModal_deleteMember, setIsShowingModal_deleteMember] = useState(false)
  const [isShowingModal_noMemberChosen, setIsShowingModal_noMemberChosen] = useState(false)
  const [isShowingModal_deleteWork, setIsShowingModal_deleteWork] = useState(false)
  const [isShowingModal_deletePeerGroup, setIsShowingModal_deletePeerGroup] = useState(false)
  const [isShowingModal_noPeerGroupChosen, setIsShowingModal_noPeerGroupChosen] = useState(false)
  const [member_personId, setMember_personId] = useState('')
  const [peerGroupId, setPeerGroupId] = useState('')

  const {summary, showTitle=true, setGroupCurrentSelected, personId, deleteGroup, isHeaderDisplay=false,
              hideCaret=false, indexName, currentGroupTool, isMainMenu, showDelete=false, updatePersonConfig, personConfig} = props
      
  
      return (
          <div className={styles.container}>
              <table className={styles.tableDisplay}>
                <tbody>
                  {isHeaderDisplay && showTitle &&
                      <tr>
                          <td colSpan={4} className={classes(isMainMenu ? styles.whiteBack : '')}>
                              <div className={hideCaret ? styles.rowLeft : styles.row}>
                                  <div className={classes(styles.rowLeft, styles.linkStyle)}
                                          onClick={() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "assignmentDashboard/" + summary.groupId + "/" + summary.masterWorkId)}>
                                      {showTitle && isMainMenu
                                          ? <TextDisplay label={<L p={p} t={`Group (current)`}/>} text={summary.groupName} />
                                          :  <div className={classes(styles.title, (isMainMenu ? styles.titleCurrentWork : ''))} id={"title"}>
                                                {summary.groupName}
                                              </div>
                                      }
                                  </div>
                                  {!hideCaret &&
                                      <a onClick={handleToggle}>
                                          <div className={caretClassName}/>
                                      </a>
                                  }
                              </div>
                          </td>
                      </tr>
                  }
                  {(!isHeaderDisplay || expanded) &&
                      <tr>
                          <td className={styles.label}>
                              <span className={styles.label}><L p={p} t={`group owner`}/></span>
                          </td>
                          <td colSpan={4}>
                              <span className={styles.text}>{summary.ownerName}</span>
                          </td>
                      </tr>
                  }
                  {setGroupCurrentSelected &&
                      <tr>
                          <td colSpan={4}>
                              <GroupTools personId={personId} summary={summary} currentTool={currentGroupTool} showDelete={showDelete}
                                  setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup}
                                  isOwner={personId === summary.ownerPersonId} className={styles.tools}
                                  updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                          </td>
                      </tr>
                  }
                  {(!isHeaderDisplay || expanded) && summary && summary.memberWorkOptions && summary.memberWorkOptions.length > 0 &&
                      <tr>
                          <td className={styles.label}>
                              <span className={styles.label}>{`review`}</span>
                          </td>
                          <td className={styles.label}>
                              <span className={styles.count}>{summary.memberWorkOptions && numberFormat(summary.memberWorkOptions.length || 0)}</span>
                          </td>
                          <td colSpan={3}>
                              <div className={styles.rowTight}>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`membersWorks`}
                                          label={``}
                                          value={summary.memberWorkId}
                                          options={summary.memberWorkOptions}
                                          className={styles.singleDropDown}
                                          noBlank={true}
                                          error={''}
                                          height={`medium`}
                                          onChange={onChangeMemberWork} />
                                  </div>
                                  <a onClick={summary.memberWorkId ? sendToEditReview : () => {}}>
                                      <Icon pathName={`file_text2`} className={classes(styles.image, summary.memberWorkId === guid.emptyGuid() || !summary.memberWorkId ? styles.lowOpacity : styles.highOpacity)}/>
                                  </a>
                              </div>
                          </td>
                      </tr>
                  }
                  {(!isHeaderDisplay || expanded) &&
                      <tr>
                          <td className={styles.label}>
                              <span className={styles.label}>{summary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`assignments`}/> : <L p={p} t={`documents`}/>}</span>
                          </td>
                          <td className={styles.label}>
                              <span className={styles.count}>{numberFormat(summary.workSummaries.length || 0)}</span>
                          </td>
                          <td colSpan={3}>
                              <div className={styles.rowTight}>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`works`}
                                          indexName={indexName}
                                          label={``}
                                          value={summary.masterWorkId}
                                          options={summary.workSummaries}
                                          className={styles.singleDropDown}
                                          noBlank={true}
                                          error={''}
                                          height={`medium`}
                                          onChange={onChangeWork} />
                                  </div>
                                  <a onClick={handleAddNewWork} className={styles.linkStyle}>
                                      <Icon pathName={`plus`} className={styles.image}/>
                                  </a>
                                  <a onClick={handleDeleteWorkOpen} className={styles.linkStyle}>
                                      <Icon pathName={`garbage_bin`} className={styles.image}/>
                                  </a>
                              </div>
                          </td>
                      </tr>
                  }
                  {(!isHeaderDisplay || expanded) &&
                      <tr>
                          <td className={styles.label}>
                              <span className={styles.label}>{summary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`students`}/> : <L p={p} t={`editors`}/>}</span>
                          </td>
                          <td className={styles.label}>
                              <span className={styles.count}>{numberFormat(summary.members.length || 0)}</span>
                          </td>
                          <td>
                              <div className={styles.rowTight}>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`members`}
                                          label={``}
                                          options={summary.members}
                                          className={styles.singleDropDown}
                                          error={''}
                                          height={`medium`}
                                          onChange={onChangeMember}/>
                                  </div>
                                  <a onClick={handleAddNewMember} className={styles.linkStyle}>
                                      <Icon pathName={`plus`} className={styles.image}/>
                                  </a>
                                  <a onClick={handleDeleteMemberOpen} className={styles.linkStyle}>
                                      <Icon pathName={`garbage_bin`} className={styles.image}/>
                                  </a>
                              </div>
                          </td>
                      </tr>
                  }
                  {(!isHeaderDisplay || expanded) &&
                      <tr>
                          <td className={styles.label}>
                              <span className={styles.label}><L p={p} t={`peer groups`}/></span>
                          </td>
                          <td className={styles.label}>
                              <span className={styles.count}>{summary.peerGroups ? numberFormat(summary.peerGroups.length || 0) : 0}</span>
                          </td>
                          <td>
                              <div className={styles.rowTight}>
                                  <div>
                                      <SelectSingleDropDown
                                          id={`peerGroups`}
                                          label={``}
                                          value={peerGroupId}
                                          options={summary.peerGroupOptions}
                                          className={styles.singleDropDown}
                                          error={''}
                                          height={`medium`}
                                          onChange={onChangePeerGroup}/>
                                  </div>
                                  <a onClick={peerGroupId ? handleEditPeerGroup : () => {}} className={classes(styles.linkStyle, peerGroupId ? styles.fullOpacity : styles.lowOpacity)}>
                                      <Icon pathName={`pencil`} className={styles.image}/>
                                  </a>
                                  <a onClick={handleAddNewPeerGroup} className={styles.linkStyle}>
                                      <Icon pathName={`plus`} className={styles.image}/>
                                  </a>
                                  <a onClick={handleDeletePeerGroupOpen} className={styles.linkStyle}>
                                      <Icon pathName={`garbage_bin`} className={styles.image}/>
                                  </a>
                              </div>
                          </td>
                      </tr>
                  }
                  {(!isHeaderDisplay || expanded) &&
                      <tr>
                          <td colSpan={4} className={styles.lastLine}>
                              <hr />
                          </td>
                      </tr>
                  }
                  </tbody>
                  </table>
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
                         explainJSX={<L p={p} t={`Please choose a peer group before requesting to delete a peer group.`}/>} isConfirmType={false}
                         onClick={handlePeerGroupNotChosenClose} />
                  }
              </div>
          )
}
export default GroupSummary
