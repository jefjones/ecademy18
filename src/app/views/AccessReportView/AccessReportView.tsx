import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './AccessReportView.css'
const p = 'AccessReportView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/MessageModal'
import Loading from '../../components/Loading'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function AccessReportView(props) {
  const [localHeadings, setLocalHeadings] = useState([])
  const [localData, setLocalData] = useState([])
  const [peerGroupId, setPeerGroupId] = useState('')
  const [peerGroup_workId, setPeerGroup_workId] = useState('')
  const [errorPeerGroup, setErrorPeerGroup] = useState('')
  const [masterWorkId, setMasterWorkId] = useState('')
  const [groupChosen, setGroupChosen] = useState('')
  const [isShowingPeerGroupInfo, setIsShowingPeerGroupInfo] = useState(false)
  const [isShowingJumpToAssign, setIsShowingJumpToAssign] = useState(false)
  const [p, setP] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          const {reportTable} = props
          if (prevProps.reportTable.data !== reportTable.data) {
              reportTable && reportTable.data && reportTable.data.length > 0 && setData()
          }
      
  }, [])

  const handlePeerGroupInfoClose = () => {
    return setIsShowingPeerGroupInfo(false)
    
    

  }
  const handlePeerGroupInfoOpen = () => {
    return setIsShowingPeerGroupInfo(true)
    
    

  }
  const handleJumpToAssignClose = () => {
    return setIsShowingJumpToAssign(false)
    
    

  }
  const handleJumpToAssignOpen = () => {
    return setIsShowingJumpToAssign(true)
    
    

  const {group, fetchingRecord} = props
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Access Report`}/>
              </div>
              <div className={classes(styles.subTitle, styles.row)}>
                  <L p={p} t={`For group:`}/> {group && group.groupName}
              </div>
              <hr />
              <Loading loadingText={`Loading`} isLoading={fetchingRecord && fetchingRecord.accessReport} />
              {fetchingRecord && !fetchingRecord.accessReport && localData &&
                  <div className={classes(styles.row, styles.moreLeft)}>
                      <ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Save & Stay`}/>} className={styles.button} onClick={(event) => processForm("STAY", event)}/>
                      <ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Save & Finish`}/>} className={styles.button} onClick={(event) => processForm("FINISH", event)}/>
                  </div>
              }
              {fetchingRecord && !fetchingRecord.accessReport &&
                  <EditTable labelClass={styles.tableLabelClass} headings={localHeadings}
                      data={localData} noCount={true} firstColumnClass={styles.firstColumnClass}
                      sendToReport={handlePathLink}/>
              }
              <br/>
              <br/>
              <OneFJefFooter />
              {isShowingPeerGroupInfo &&
                  <MessageModal handleClose={handlePeerGroupInfoClose} heading={<L p={p} t={`How to use peer groups with an assignment`}/>} showPeerGroupInfo={true}
                      explainJSX={[<L p={p} t={`Peer groups will allow members of each sub group to view and edit each other's assignments.`}/>,<br/>,<br/>,
                          <L p={p} t={`If you have not yet created a peer group for this group, choose 'Add a new peer group.'`}/>,
                          <L p={p} t={`Once you have at least one peer group and you have returned to this access report, click on an assignment in the report heading.`}/>,
                          <L p={p} t={`You will be taken to a page to decide which peer group to apply to the chosen assignment.`}/>]}
                      onClick={handlePeerGroupInfoClose}/>
              }
              {isShowingJumpToAssign &&
                  <MessageModal handleClose={handleJumpToAssignClose} heading={<L p={p} t={`I'm taking you to the single assignment page`}/>} showPeerGroupInfo={true}
                      explainJSX={<L p={p} t={`We found that it is better to grant access to an assignment to everyone on a different page.  In that page you can choose to split up your class into peer groups, but that is just an option. I'm going to take you there now, is that okay?`}/>}
                      isConfirmType={true}
                      onClick={() => handleJumpToAssign(masterWorkId, groupChosen)}/>
              }
        </div>
      )
}
}
export default AccessReportView
