import { useState } from 'react'
import styles from './WorkAddView.css'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import OneFJefFooter from '../../components/OneFJefFooter'
import MessageModal from '../../components/MessageModal'
import WorkAddOrUpdate from '../../components/WorkAddOrUpdate'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Icon from '../../components/Icon'

function WorkAddView(props) {
  const [isFileUpload, setIsFileUpload] = useState(false)
  const [runVerifyForm, setRunVerifyForm] = useState(false)
  const [runClearForm, setRunClearForm] = useState(false)
  const [isShowingSectionInfo, setIsShowingSectionInfo] = useState(false)
  const [file, setFile] = useState({})
  const [isShowingChooseEntry, setIsShowingChooseEntry] = useState(false)

  
            return (
              <div className={styles.container}>
                  <div className={globalStyles.pageTitle}>
                      {isNewUser
                          ? <L p={p} t={`Add Your First Document`}/>
                          : groupChosen
                              ? <L p={p} t={`Add New Assignment`}/>
                              : <L p={p} t={`Add New Document`}/>
                      }
                  </div>
                  <WorkAddOrUpdate submitOuterPage={submitOuterPage} languageList={languageList} groupList={groupList} workId={workId}
                      groupChosen={groupChosen} runVerifyForm={runVerifyForm} personId={personId}  unsetRunVerifyForm={unsetRunVerifyForm}
                      addOrUpdateDocument={addOrUpdateDocument} runClearForm={runClearForm} showMoreInfo={false}/>
                  <hr />
                  <div className={styles.row}>
                      {groupChosen &&
                          <ButtonWithIcon label={<L p={p} t={`Leave Blank`}/>} icon={'checkmark_circle'} onClick={() => handleSubmit("/assignmentDashboard", true)}/>
                      }
                      <ButtonWithIcon label={<L p={p} t={`Start Writing`}/>} icon={'checkmark_circle'} onClick={() => handleSubmit(false)} className={styles.button}/>
                      <ButtonWithIcon label={<L p={p} t={`Upload File`}/>} icon={'checkmark_circle'} onClick={() => handleSubmit(true)} className={styles.button}/>
                  </div>
                  <a onClick={handleSectionInfoOpen} className={styles.explanation}>
                      <L p={p} t={`Do you have sections or chapters?`}/>
                      <Icon pathName={`info`} className={styles.image}/>
                  </a>
                  <OneFJefFooter />
                  {isShowingSectionInfo &&
                      <MessageModal handleClose={handleSectionInfoClose} heading={<L p={p} t={`Do you have Sections or Chapters?`}/>} showSectionInfo={true}
                          explainJSX={<L p={p} t={`You can either load your entire document and then choose to split it up by section. Or, you can upload your first section/chapter here and add additional sections or chapters with the section menu options. You can always reorder the sequence of your sections and chapters.`}/>}
                          onClick={handleSectionInfoClose}/>
                  }
                  {isShowingChooseEntry &&
                      <MessageModal handleClose={handleChooseEntryClose} heading={<L p={p} t={`Choose Entry Type`}/>}
                          explainJSX={<L p={p} t={`Please choose how you want to enter your data. You can choose to start writing or you can upload a file.`}/>}
                          onClick={handleChooseEntryClose}/>
                  }
              </div>
          )
}

//    djsConfig={djsConfig} />
export default WorkAddView
