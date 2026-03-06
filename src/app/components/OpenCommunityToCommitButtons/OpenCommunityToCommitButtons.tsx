import { useEffect, useState } from 'react'
import styles from './OpenCommunityToCommitButtons.css'
import MultiSelect from '../MultiSelect'
import Checkbox from '../Checkbox'
import MessageModal from '../MessageModal'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenCommunityToCommitButtons(props) {
  const [selectedChapters, setSelectedChapters] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [nativeLanguageEdit, setNativeLanguageEdit] = useState(false)
  const [errorLanguage, setErrorLanguage] = useState('')
  const [errorChapter, setErrorChapter] = useState('')
  const [isShowingModal_new, setIsShowingModal_new] = useState(false)
  const [isShowingModal_uncommit, setIsShowingModal_uncommit] = useState(false)
  const [p, setP] = useState(undefined)

  useEffect(() => {
    
          const {openCommunityEntry} = props
    
          const selectedChapters = openCommunityEntry.hasCommittedOpenCommunity
            ? openCommunityEntry.committedChapterIds
            : props.chapterOptions.map(o => o.value)
    
         const selectedLanguages = openCommunityEntry.hasCommittedOpenCommunity
            ? openCommunityEntry.committedTranslatedLanguageIds
            : []
    
          const nativeLanguageEdit = openCommunityEntry.committedNativeLanguageEdit
             ? openCommunityEntry.committedNativeLanguageEdit
             : false
    
          setSelectedChapters(selectedChapters); setSelectedLanguages(selectedLanguages); setNativeLanguageEdit(nativeLanguageEdit)
      
  }, [])

  const handleNewAlertClose = () => {
    return setIsShowingModal_new(false)
    

  }
  const handleNewAlertOpen = () => {
    return setIsShowingModal_new(true)
    

  }
  const handleUncommitAlertClose = () => {
    return setIsShowingModal_uncommit(false)
    

  }
  const handleUncommitAlertOpen = () => {
    return setIsShowingModal_uncommit(true)
    

  let {chapterOptions, languageOptions, openCommunityEntry} = props
        
  
        return (
          <div className={styles.container}>
              <div>
                  {chapterOptions && chapterOptions.length > 1 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={chapterOptions}
                              onSelectedChanged={handleSelectedChapters}
                              valueRenderer={sectionValueRenderer}
                              selected={selectedChapters || []}/>
                          <span className={styles.errorMessage}>{errorChapter}</span>
                      </div>
                  }
                  {openCommunityEntry.editNativeLanguage &&
                      <div className={styles.checkbox}>
                          <Checkbox
                              id={`editNativeLanguage`}
                              label={<L p={p} t={`Edit this document in ${openCommunityEntry.nativeLanguageName}`}/>}
                              labelClass={styles.labelCheckbox}
                              position={`before`}
                              onClick={handleNativeLanguageEdit}
                              checked={nativeLanguageEdit}
                              checkboxClass={styles.checkbox} />
                      </div>
                  }
                  {openCommunityEntry.languageOptions.length > 0 &&
                      <div className={styles.multiSelect}>
                          <MultiSelect
                              options={languageOptions}
                              onSelectedChanged={handleSelectedLanguages}
                              valueRenderer={languageValueRenderer}
                              selected={selectedLanguages || []}/>
                      </div>
                  }
                  <span className={styles.errorMessage}>{errorLanguage}</span>
                  <div className={styles.row}>
                      <div>
                          <a onClick={handleCommitClick} className={styles.submitButton}>
                              {openCommunityEntry.hasCommittedOpenCommunity ? <L p={p} t={`Update`}/> : <L p={p} t={`Commit`}/>}
                          </a>
                      </div>
                      {openCommunityEntry.hasCommittedOpenCommunity &&
                          <div>
                              <a onClick={handleUncommitAlertOpen} className={styles.removeButton}>
                                  <L p={p} t={`Uncommit`}/>
                              </a>
                          </div>
                      }
                  </div>
              </div>
              {isShowingModal_new &&
                  <MessageModal handleClose={handleNewAlertClose} heading={<L p={p} t={`New Record Saved`}/>}
                      explainJSX={<L p={p} t={`You have chosen to help the author with this document.  You can see this entry under the 'Committed' tab to the right.  You can also see this document in the 'My Documents' page.`}/>}
                      onClick={handleNewAlertClose}/>
               }
               {isShowingModal_uncommit &&
                   <MessageModal handleClose={handleUncommitAlertClose} heading={<L p={p} t={`Discontinue Editing this Document?`}/>}
                       explainJSX={<L p={p} t={`Are you sure you want to discontinue editing this document?`}/>} isConfirmType={true}
                       onClick={handleUncommitClick}/>
                }
          </div>
        )
}
export default OpenCommunityToCommitButtons
