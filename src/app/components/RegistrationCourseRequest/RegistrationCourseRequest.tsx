import { useState } from 'react'
import styles from './RegistrationCourseRequest.css'
import Required from '../Required'
import Checkbox from '../Checkbox'
import {doSort} from '../../utils/sort'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function RegistrationPendingView(props) {
  const [intervalId, setIntervalId] = useState(8)
  const [monthlyAmount, setMonthlyAmount] = useState(0)

  const toggleCheckbox = (field, pathway) => {
    
    				const {selectedCourses, selectCourse} = props
    				let newState = Object.assign({}, state)
    				newState[field] = newState[field] === null || newState[field] === undefined ? false : !newState[field]
    				setState(newState)
    				let chosenPathway =  selectedCourses && selectedCourses.length > 0 && selectedCourses.filter(m => m.learningPathwayName === pathway)[0]
    				if (chosenPathway && chosenPathway.registrationCourseId) selectCourse(pathway, chosenPathway.registrationCourseId, newState[field])
    		
  }

  const handleSelectCourse = (event, pathway, registrationCourseId) => {
      //, checkboxAccredited
    				//If this is the label-click that is coming through then event.target.clicked will be undefined.
    				//  If it is a label-click and the checkbox is checked, then this is a delete.
    				//	Otherwise, if event.target.clicked comes back false, then it is also a delete.
    				const {selectCourse, selectedCourses} = props
    				let isToggleDelete = false
            selectedCourses && selectedCourses.length > 0 && selectedCourses.forEach(m => {
                if (m.registrationCourseId === registrationCourseId) isToggleDelete = true
            })
    				//let isAccredited = document.getElementById(checkboxAccredited) && document.getElementById(checkboxAccredited).checked;
    				selectCourse(pathway, registrationCourseId, isToggleDelete); //, isAccredited
    		
  }

  const handleUpdateInterval = ({target}) => {
    
    				let newState = Object.assign({}, state)
    				newState[target.name] = target.value
    				setState(newState)
    		
  }

  const isSelectedCourse = (registrationCourseId) => {
    
    				const {accreditation} = props
    				let isChosen = false
    				accreditation.selectedCourses && accreditation.selectedCourses.length > 0 && accreditation.selectedCourses.forEach(m => {
    						if (m.registrationCourseId === registrationCourseId) isChosen = true
    				})
    				return isChosen
    		
  }

  const {gradeLevelId, courseTypeName, selectedCourses, gradeLevels} = props
  				let {data} = props
  				//If the data doesn't have the courseTypeName in it, then do not bother even showing this control.
  				data = data && data.length > 0 && data.filter(m => m.courseTypeName === courseTypeName)
  				let noData = !data || data.length === 0
  				let pathwayNames = []
  
  				if (!noData) {
  						pathwayNames = [...new Set(data.map(m => m.learningPathwayName))]
  				}
  
  				return noData ? null : (
  						<div className={styles.container}>
  								<hr />
  								<div className={classes(styles.row, styles.subHeading)}>
  										<L p={p} t={`Request Courses`}/>
                    <Required setIf={true} setWhen={selectedCourses && selectedCourses.length > 0} className={styles.required}/>
  										{monthlyAmount
  												? <div className={classes(styles.billingAmount, styles.row)}>
  															{`Monthly amount: `}
  															$<strong>{monthlyAmount}</strong>
  													</div>
  												: ''
  										}
  				        </div>
  								{/*<div className={styles.selectList}>
  										<SelectSingleDropDown
  												id={`intervalId`}
  												label={`Semester`}
  												value={intervalId}
  												options={intervals}
  												noBlank={true}
  												height={`medium`}
  												onChange={handleUpdateInterval}/>
  								</div>*/}
  								<div className={styles.rowWrap}>
  										{pathwayNames && pathwayNames.length > 0 && pathwayNames.map((pathway, i) => {
  												let courses = data.filter(d => d.learningPathwayName === pathway)
  												courses = doSort(courses, { sortField: 'courseName', isAsc: true, isNumber: false })
  
  												let gradeLevelSequence = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.gradeLevelId === gradeLevelId)[0]
  												gradeLevelSequence = gradeLevelSequence && gradeLevelSequence.sequence
  
  												let options = courses && courses.length > 0
  														&& courses.filter(m => m.gradeLevelStart <= gradeLevelSequence
  																						&& m.gradeLevelEnd >= gradeLevelSequence)
  														.map(c => ({
  																label: c.courseName,
  																id: c.registrationCourseId
  														})
  												)
  
  												return (!courses || courses.length === 0) ? null : (
  													<div key={i} className={styles.section}>
  																<div key={i} className={classes(styles.background, styles.row)}>
  												            <span className={classes(styles.strong, styles.label)}>{pathway}</span>
  																		{/*accredited &&
  																				<Checkbox
  																						id={pathway + 'accredited'}
  																						label={'Accredited?'}
  																						checked={state[pathway + 'accredited'] || state[pathway + 'accredited'] === null || state[pathway + 'accredited'] === undefined
  																								? true
  																								: state[pathway + 'accredited']
  																						}
  																						checkboxClass={styles.checkbox}
  																						labelClass={styles.label}
  																						onClick={() => toggleCheckbox(pathway + 'accredited', pathway)}/>
  																		*/}
  																</div>
  																{options && options.length > 0 && options.map((o, i) =>
  																		<div key={i} className={styles.checkboxSpace}>
  																				<Checkbox
  								                            id={pathway + o.id}
  								                            label={o.label}
  								                            checked={isSelectedCourse(o.id)}
  																						labelClass={styles.labelCheckbox}
  								                            onClick={(event) => handleSelectCourse(event, pathway, o.id)} />
  																		</div>
  																)}
  														</div>
  												)
  										})}
  								</div>
  						</div>
  			 )
}


//onClick={(event) => this.handleSelectCourse(event, pathway, o.id, pathway + 'accredited')} />
export default RegistrationPendingView
