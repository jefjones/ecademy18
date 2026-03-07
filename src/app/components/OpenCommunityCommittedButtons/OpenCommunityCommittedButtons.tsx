import { useState } from 'react'
import * as styles from './OpenCommunityCommittedButtons.css'
import MessageModal from '../MessageModal'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenCommunityCommittedButtons(props) {
  const [isShowingModal_uncommit, setIsShowingModal_uncommit] = useState(false)

  const handleUncommitAlertClose = () => {
    return setIsShowingModal_uncommit(false)
    

  }
  const handleUncommitAlertOpen = () => {
    return setIsShowingModal_uncommit(true)
    

  return (
        <div className={styles.container}>
            <div className={styles.buttonPlace}>
                <a onClick={handleUncommitAlertOpen} className={styles.removeButton}>
                    <L p={p} t={`Discontinue`}/>
                </a>
            </div>
             {isShowingModal_uncommit &&
                 <MessageModal handleClose={handleUncommitAlertClose} heading={<L p={p} t={`Discontinue Editing this Document?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to discontinue editing this document?`}/>} isConfirmType={true}
                     onClick={handleUncommitClick}/>
              }
        </div>
      )
}
export default OpenCommunityCommittedButtons
