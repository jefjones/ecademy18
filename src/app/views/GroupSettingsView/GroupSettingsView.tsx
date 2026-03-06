import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './GroupSettingsView.css'
const p = 'GroupSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import GroupTools from '../../components/GroupTools'
import InputText from '../../components/InputText'
import TextDisplay from '../../components/TextDisplay'
import numberFormat from '../../utils/numberFormat'
import OneFJefFooter from '../../components/OneFJefFooter'

function GroupSettingsView(props) {
  const [isLocalNotEditMode, setIsLocalNotEditMode] = useState(true)
  const [groupName, setGroupName] = useState('')
  const [internalId, setInternalId] = useState('')
  const [description, setDescription] = useState('')
  const [groupNameError, setGroupNameError] = useState('')
  const [errors, setErrors] = useState({})
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
            const {groupSummary} = props
            setGroupName(groupSummary.groupName); setInternalId(groupSummary.internalId ? groupSummary.internalId : '- -'); setDescription(groupSummary.description ? groupSummary.description : '- -')
        
  }, [])

  const {personId, groupSummary, setGroupCurrentSelected, deleteGroup, updatePersonConfig, personConfig} = props
        
  
        return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Class Settings`}/>
              </div>
              <div className={styles.subTitle}>
                  <GroupTools personId={personId} summary={groupSummary} currentTool={'groupSettings'} showDelete={true}
                      setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup}
                      isOwner={personId === groupSummary.ownerPersonId} className={styles.tools}
                      updatePersonConfig={updatePersonConfig} personConfig={personConfig} />
              </div>
              <hr />
              {isLocalNotEditMode &&
                  <div>
                      <div className={styles.row}>
                          <TextDisplay label={`Group name`} text={groupName} />
                          <button className={styles.editButton} onClick={toggleEditMode}><L p={p} t={`Edit`}/></button>
                      </div>
                      <TextDisplay label={`Internal id`} text={internalId} />
                      <TextDisplay label={`Description`} text={description} />
                  </div>
              }
  
              {!isLocalNotEditMode &&
                  <ul className={styles.unorderedList}>
                      <div className={styles.row}>
                          <InputText
                              value={groupName}
                              size={"medium-long"}
                              label={<L p={p} t={`Group name`}/>}
                              name={"groupName"}
                              inputClassName={styles.input}
                              onChange={handleNameChange}
                              error={groupNameError}/>
                          <div className={styles.column}>
                              <button className={styles.editButton} onClick={handleSubmit}><L p={p} t={`Save`}/></button>
                              <span className={styles.cancelButton} onClick={handleCancelEdit}><L p={p} t={`Cancel`}/></span>
                          </div>
                      </div>
                      <InputText
                          value={internalId || ''}
                          size={"medium"}
                          label={<L p={p} t={`Internal Id (optional)`}/>}
                          name={"internalId"}
                          inputClassName={styles.input}
                          onChange={handleInternalIdChange}/>
                      <div className={styles.column}>
                          <span className={styles.label}><L p={p} t={`Internal Id (optional)`}/><L p={p} t={`Description (optional)`}/></span>
                          <textarea rows={5} cols={42} value={description || ''} id={`description`} className={styles.messageBox}
                              onChange={(event) => handleDescriptionChange(event)}></textarea>
                      </div>
                      <hr />
                  </ul>
              }
              <hr />
              <div>
                  <Link to={`/workAddNew/${groupSummary && groupSummary.groupId}`} className={styles.addNew}>
                      {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new assignment`}/> : <L p={p} t={`Add new document`}/>}
                      <span className={styles.count}>{numberFormat(groupSummary.workSummaries.length || 0)}</span>
                  </Link>
              </div>
              <hr />
              <div>
                  <Link to={`/groupMemberAdd`} className={styles.addNew}>
                      {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new learner`}/> : <L p={p} t={`Add new member`}/>}
                      <span className={styles.count}>{numberFormat(groupSummary.members.length || 0)}</span>
                  </Link>
              </div>
              <hr />
              <OneFJefFooter />
          </div>
      )
}

export default GroupSettingsView
