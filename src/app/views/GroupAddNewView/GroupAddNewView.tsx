import { useEffect, useState } from 'react'
import styles from './GroupAddNewView.css'
import globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'
import Loading from '../../components/Loading'

function GroupAddNewView(props) {
  const [groupName, setGroupName] = useState(this.props.groupName || '')
  const [languageChosen, setLanguageChosen] = useState(this.props.languageChosen || 1)
  const [internalId, setInternalId] = useState('')
  const [description, setDescription] = useState('')
  const [groupNameError, setGroupNameError] = useState('')
  const [languageError, setLanguageError] = useState('')
  const [showNextButton, setShowNextButton] = useState(true)

  useEffect(() => {
    
            //document.getElementById('groupName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
            document.getElementById('groupName').addEventListener('keydown', checkForKeypress)
        
  }, [])

  let {languageList, groupTypeDescription} = props
            let {languageChosen, groupName, groupNameError, languageError, description, internalId, showNextButton} = state
  
            return (
              <div className={styles.container}>
                  <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                      <div className={globalStyles.pageTitle}>
                          Create New
                      </div>
                      <div className={styles.subTitle}>
                          {groupTypeDescription}
                      </div>
                      <div className={styles.containerName}>
                          <InputText
                              value={groupName}
                              size={"medium-long"}
                              name={"groupName"}
                              label={"Group name"}
                              onChange={handleNameChange}
                              error={groupNameError}/>
                          <InputText
                              value={internalId}
                              size={"medium"}
                              name={"internalId"}
                              label={"Internal id"}
                              onChange={handleInternalIdChange}/>
                          <div className={styles.column}>
                              <span className={styles.label}>Description (optional)</span>
                              <textarea rows={5} cols={42} value={description} onChange={(event) => handleDescriptionChange(event)}
                                  className={styles.messageBox}></textarea>
                          </div>
                      </div>
                      <div className={styles.languageDiv}>
                          <SelectSingleDropDown
                              label={`Native Text Language`}
                              value={languageChosen}
                              options={languageList || []}
                              error={''}
                              height={`medium`}
                              className={styles.singleDropDown}
                              id={`languageChosen`}
                              onChange={handleLanguageChange} />
                          <div className={styles.errorLanguage}>{languageError}</div>
                      </div>
                      <hr />
                      <div className={styles.row}>
                          {showNextButton && <span onClick={handleSubmit} className={styles.button}>{`Next ->`}</span>}
                          <Loading loadingText={`Loading`} isLoading={!showNextButton}/>
                      </div>
                      <OneFJefFooter />
                  </form>
              </div>
          )
}

//    djsConfig={djsConfig} />
export default GroupAddNewView
