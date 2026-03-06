import { useEffect } from 'react'
import styles from './OpenCommunityToVolunteer.css'
import classes from 'classnames'
import OpenCommunityFilter from '../../components/OpenCommunityFilter'
import WorkSummary from '../../components/WorkSummary'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenCommunityToVolunteer(props) {
  useEffect(() => {
    
      
  }, [])

  const {personId, updateFilterByField, clearFilters, filterScratch, savedFilterIdCurrent, openCommunityFilterOptions,
              updateSavedSearch, updateFilterDefaultFlag, deleteSavedSearch, chooseSavedSearch, saveNewSavedSearch, commitOpenCommunityEntry, uncommitOpenCommunityEntry,
              editSeverityOptions, wordCountOptions, genreOptions, languageOptions} = props
        let {openCommunityToVol} = props
        openCommunityToVol = openCommunityToVol.filter(m => m.personId !== personId && !m.hasCommittedOpenCommunity); //don't include the documents which belong to this user.
  
        return (
          <div className={styles.container}>
              <Accordion noShowExpandAll={true}>
                  <AccordionItem expanded={false} filterScratch={filterScratch} filterOptions={openCommunityFilterOptions} savedFilterIdCurrent={savedFilterIdCurrent}
                          updateSavedSearch={updateSavedSearch} deleteSavedSearch={deleteSavedSearch} chooseSavedSearch={chooseSavedSearch}
                          updateFilterByField={updateFilterByField} updateFilterDefaultFlag={updateFilterDefaultFlag} personId={personId}
                          showNotifyMe={true} clearFilters={clearFilters}>
                      <OpenCommunityFilter personId={personId} openCommunityFilter={filterScratch} updateFilterByField={updateFilterByField}
                          clearFilters={clearFilters} saveNewSavedSearch={saveNewSavedSearch} editSeverityOptions={editSeverityOptions}
                          wordCountOptions={wordCountOptions} genreOptions={genreOptions} languageOptions={languageOptions}
                          savedSearchOptions={openCommunityFilterOptions}/>
                  </AccordionItem>
              </Accordion>
              <hr />
              {!openCommunityToVol || openCommunityToVol.length === 0 ? <span className={styles.noListMessage}><L p={p} t={`empty list`}/><br/><br/></span> : ''}
              {openCommunityToVol && openCommunityToVol.length > 0 &&
                  <Accordion allowMultiple={true}>
                      {openCommunityToVol.map((s, i) => {
                          let openCommChapterOptions = s.chapterIds.map(id => s.chapterOptions.filter(m => m.value === id)[0])
                          let openCommLanguageOptions = s.translateLanguageIds.map(id => s.languageOptions.filter(m => m.id === id)[0])
  
                          return (
                            <AccordionItem title={s.title} isCurrentTitle={s.isCurrentWork} expanded={s.isExpanded} key={i}
                                    className={classes(styles.accordionTitle, s.isCurrentWork ? styles.isCurrentWork : '')}
                                    commitOpenCommunityEntry={commitOpenCommunityEntry} uncommitOpenCommunityEntry={uncommitOpenCommunityEntry}
                                    openCommChapterOptions={openCommChapterOptions} openCommLanguageOptions={openCommLanguageOptions}
                                    openCommunityEntry={s} personId={personId}>
                                <WorkSummary summary={s} className={styles.workSummary} showIcons={true} personId={personId}
                                    showTitle={false} noShowCurrent={true} labelCurrentClass={styles.labelCurrentClass} indexKey={i} />
                            </AccordionItem>
                          )
                      })}
                  </Accordion>
              }
          </div>
        )
}
export default OpenCommunityToVolunteer
