import { useEffect, useState } from 'react'
import styles from './FileFolderAddUpdateView.css'
const p = 'FileFolderAddUpdateView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import OneFJefFooter from '../../components/OneFJefFooter'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import {emptyGuid} from '../../utils/GuidValidate'

function FileFolderAddUpdateView(props) {
  const [folderName, setFolderName] = useState('')
  const [parentWorkFolderId, setParentWorkFolderId] = useState('')
  const [errorFolderName, setErrorFolderName] = useState(<L p={p} t={`Please enter a folder name`}/>)
  const [p, setP] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {workFolder} = props
    				
    				if (!isUpdated && workFolder) {
    						setFolderName(workFolder.folderName); setParentWorkFolderId(workFolder.parentWorkFolderId)
    				}
    		
  }, [])

  
            return (
              <div className={styles.container}>
                  <div className={globalStyles.pageTitle}>
                      {!workFolderId && workFolderId !== emptyGuid() ? <L p={p} t={`Edit Existing Folder`}/> : <L p={p} t={`Add New Folder`}/>}
                  </div>
  								<div className={styles.marginLeft}>
  										<div>
  												<InputText
  														size={"medium-long"}
  														name={"folderName"}
  														label={<L p={p} t={`Folder name`}/>}
  														inputClassName={styles.input}
  														value={folderName || ''}
  														onChange={handleChange}
  														error={errorFolderName}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														label={<L p={p} t={`Assign to a parent folder?`}/>}
  														value={parentWorkFolderId || ''}
  														options={fileFolderList || []}
  														error={''}
  														height={`medium`}
  														className={styles.singleDropDown}
  														id={`parentListChoice`}
  														onChange={handleChange} />
  										</div>
  								</div>
  								<div className={styles.rowRight}>
                      <ButtonWithIcon label={<L p={p} t={`Submit`}/>} onClick={processForm}/>
                  </div>
                  <OneFJefFooter />
              </div>
          )
}

//    djsConfig={djsConfig} />
export default FileFolderAddUpdateView
