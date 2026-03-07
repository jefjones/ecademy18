import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LearnerMentorReassignView.css'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import MultiSelect from '../../components/MultiSelect'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateMoment from '../../components/DateMoment'
import LearnerFilter from '../../components/LearnerFilter'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function LearnerMentorReassignView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [selectedLearners, setSelectedLearners] = useState([])
  const [learnersChosen, setLearnersChosen] = useState([])
  const [learningCoach, setLearningCoach] = useState('')
  const [errorLearningCoach, setErrorLearningCoach] = useState('')
  const [errorLearnersChosen, setErrorLearnersChosen] = useState('')

  const {personId, learnerOutcomes, learnerOutcomeTargets, learningPathways, learningFocusAreas, facilitators, mentors, learners,
                  filterScratch_learner, savedFilterIdCurrent_learner, learnerFilterOptions_learner, updateFilterByField_learner,
                  clearFilters_learner, updateSavedSearch_learner, updateFilterDefaultFlag_learner, deleteSavedSearch_learner,
                  chooseSavedSearch_learner, saveNewSavedSearch_learner, companyConfig={}} = props
        
  
        let learnerHeadings = [{label: ''}, {label: companyConfig.isMcl ? 'Learner Name' : 'Student Name', tightText: true}, {label: 'Birth Date', tightText: true}, {label: 'Learning Coach', tightText: true}]
        let learnerData = [...learnersChosen]
        learnerData = learnerData.length > 0 ? learnerData : [[{value: ''}, {value: companyConfig.isMcl ? <i>No learners chosen yet.</i> : <i>No students chosen, yet.</i> }]]
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                      {companyConfig.isMcl ? `Reassign Learning Coaches to Learners` : `Reassign Learning Coaches to Students`}
                  </div>
                  <div className={styles.classification}>Learner(s)</div>
                  <span className={styles.error}>{errorLearnersChosen}</span>
                  <EditTable labelClass={styles.tableLabelClass} headings={learnerHeadings} data={learnerData} noCount={true}/>
                  <Accordion noShowExpandAll={true}>
                      <AccordionItem expanded={false} filterScratch={filterScratch_learner} filterOptions={learnerFilterOptions_learner} savedFilterIdCurrent={savedFilterIdCurrent_learner}
                              updateSavedSearch={updateSavedSearch_learner} deleteSavedSearch={deleteSavedSearch_learner} chooseSavedSearch={chooseSavedSearch_learner}
                              updateFilterByField={updateFilterByField_learner} updateFilterDefaultFlag={updateFilterDefaultFlag_learner} personId={personId}
                              clearFilters={clearFilters_learner}>
                          <LearnerFilter personId={personId} learnerFilter={filterScratch_learner} className={styles.workFilter} updateFilterByField={updateFilterByField_learner}
                              clearFilters={clearFilters_learner} saveNewSavedSearch={saveNewSavedSearch_learner} savedSearchOptions={learnerFilterOptions_learner}
                              learnerOutcomes={learnerOutcomes} learnerOutcomeTargets={learnerOutcomeTargets} learningPathways={learningPathways}
                              learningFocusAreas={learningFocusAreas} facilitators={facilitators} mentors={mentors} companyConfig={companyConfig}/>
                      </AccordionItem>
                  </Accordion>
                  <div className={styles.multiSelect}>
                      <MultiSelect
                          name={'learners'}
                          options={learners || []}
                          onSelectedChanged={handleSelectedLearners}
                          valueRenderer={learnerValueRenderer}
                          getJustCollapsed={() => {}}
                          selected={selectedLearners}/>
                  </div>
                  <hr />
                  <div>
                      <SelectSingleDropDown
                          id={`mentor`}
                          label={`Learning coach`}
                          value={learningCoach}
                          options={mentors}
                          className={styles.singleSelect}
                          height={`medium`}
                          onChange={handleMentorChange}
                          error={errorLearningCoach} />
                  </div>
                  <div className={classes(styles.rowCenter)}>
                      <a className={styles.cancelLink} onClick={() => navigate('/firstNav')}>Close</a>
  										<ButtonWithIcon label={'Save'} icon={'checkmark_circle'} onClick={processForm}/>
                  </div>
              </div>
              <OneFJefFooter />
          </div>
      )
}

export default LearnerMentorReassignView
