import { useState } from 'react'
import styles from './RatingBookView.css'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MultiSelect from '../../components/MultiSelect'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'

function RatingBookView(props) {
  const [studentPersonId, setStudentPersonId] = useState(props.studentPersonId)
  const [selectedLearnerOutcomes, setSelectedLearnerOutcomes] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectUsers, setSelectUsers] = useState([])
  const [proficient, setProficient] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [notStarted, setNotStarted] = useState(false)

  const {personId, ratingBook, courses, students, facilitators, learnerOutcomes, setRatingBook, fetchingRecord} = props
      
  
      let headings = [{label: 'Proficient', tightText: true}, {label: 'In Progress', tightText: true}, {label: 'Not Started', tightText: true}, {label: 'Code', tightText: true}, {label: 'Learner Outcome', tightText: true}]
      let data = []
  
      if (ratingBook && ratingBook.length > 0) {
          data = ratingBook.map(m => {
              return ([
                {id: m.learnerOutcomeId, value: <Checkbox id={m.studentPersonId} checked={m.proficient} onClick={() => setRatingBook(personId, m.studentPersonId, m.learnerOutcomeId, 'proficient')}/>},
                {id: m.learnerOutcomeId, value: <Checkbox id={m.studentPersonId} checked={m.inProgress} onClick={() => setRatingBook(personId, m.studentPersonId, m.learnerOutcomeId, 'inProgress')}/>},
                {id: m.learnerOutcomeId, value: <Checkbox id={m.studentPersonId} checked={m.notStarted} onClick={() => setRatingBook(personId, m.studentPersonId, m.learnerOutcomeId, 'notStarted')}/>},
                {id: m.learnerOutcomeId, value: m.externalId},
                {id: m.learnerOutcomeId, value: m.learnerOutcomeDesc},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Learner Outcome Feedback'}
              </div>
              <div>
                  <SelectSingleDropDown
                      id={'studentPersonId'}
                      value={studentPersonId}
                      label={`Learner`}
                      options={students}
                      height={`medium`}
                      noBlank={true}
                      className={styles.singleDropDown}
                      onChange={handleLearnerChange}/>
              </div>
              <div className={styles.multiSelect}>
                  <MultiSelect
                      options={facilitators || []}
                      onSelectedChanged={handleSelectedFacilitators}
                      valueRenderer={facilitatorsValueRenderer}
                      getJustCollapsed={() => {}}
                      selected={selectedFacilitators || []}/>
              </div>
              <div className={styles.multiSelect}>
                  <MultiSelect
                      options={courses || []}
                      onSelectedChanged={handleSelectedCourses}
                      valueRenderer={coursesValueRenderer}
                      getJustCollapsed={() => {}}
                      selected={selectedCourses || []}/>
              </div>
              <div className={styles.multiSelect}>
                  <MultiSelect
                      options={learnerOutcomes || []}
                      onSelectedChanged={handleSelectedLearnerOutcomes}
                      valueRenderer={learnerOutcomesValueRenderer}
                      getJustCollapsed={() => {}}
                      selected={selectedLearnerOutcomes || []}/>
              </div>
              <div className={styles.row}>
                  <span className={styles.textRating}>Feedback Search</span>
                  <Checkbox
                      id={`proficient`}
                      label={`Proficient`}
                      checked={proficient}
                      onClick={() => toggleCheckbox('proficient')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
                  <Checkbox
                      id={`inProgress`}
                      label={`In progress`}
                      checked={inProgress}
                      onClick={(event) => toggleCheckbox('inProgress')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
                  <Checkbox
                      id={`notStarted`}
                      label={`Not started`}
                      checked={notStarted}
                      onClick={(event) => toggleCheckbox('notStarted')}
                      labelClass={styles.labelCheckbox}
                      className={styles.checkbox} />
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
  								isFetchingRecord={fetchingRecord.ratingBook}/>
              <hr />
              <OneFJefFooter />
        </div>
      )
}
export default RatingBookView
