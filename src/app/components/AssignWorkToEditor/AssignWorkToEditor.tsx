import { useEffect, useState } from 'react'
import * as styles from './AssignWorkToEditor.css'
//import SwitchOnOff from '../SwitchOnOff';
import MultiSelect from '../MultiSelect'
import { withAlert } from 'react-alert'
const p = 'component'
import L from '../../components/PageLanguage'

function AssignWorkToEditor(props) {
  const [selectedChapters, setSelectedChapters] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])

  useEffect(() => {
    
          const { chaptersChosen, languagesChosen } = props
          setSelectedChapters(chaptersChosen); setSelectedLanguages(languagesChosen)
      
  }, [])

  let {chapterOptions, languageOptions, editorAssign, workId, editorPersonId} = props
        let hasAssign = {}
        //Existing editor or is this the new inviteEditor which doesn't yet have a personId?
        //Plus, the editorAssign from the inviteEditor is an object that needs to be converted to an array..
        if (editorAssign && editorAssign.length > 0 && editorAssign[0].editorPersonId) {
            hasAssign = editorAssign && editorAssign.length > 0 && editorAssign.filter(m => m.workId === workId && m.editorPersonId === editorPersonId)
        } else {
            hasAssign = editorAssign && editorAssign.workId === workId ? [editorAssign] : []; //This function needs an array not just a plain object.
        }
        let isChecked = ((hasAssign && hasAssign.length === 0) || !hasAssign) ? false : true
        
  
        return (
          <div>
              <a onClick={() => handleSwitch(props, isChecked)} className={isChecked ? styles.removeButton : styles.submitButton}>
                  {isChecked ? <L p={p} t={`Discontinue`}/> : <L p={p} t={`Share`}/>}
              </a>
              {isChecked && chapterOptions && chapterOptions.length > 1 &&
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          options={chapterOptions}
                          onSelectedChanged={handleSelectedChapters}
                          getJustCollapsed={getJustCollapsed_chapters}
                          valueRenderer={sectionValueRenderer}
                          selected={selectedChapters}/>
                  </div>
              }
              {isChecked &&
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          options={languageOptions}
                          onSelectedChanged={handleSelectedLanguages}
                          getJustCollapsed={getJustCollapsed_languages}
                          valueRenderer={languageValueRenderer}
                          selected={selectedLanguages}/>
                  </div>
              }
              <hr className={styles.line}/>
          </div>
        )
}

export default withAlert(AssignWorkToEditor)
