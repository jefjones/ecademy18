
import styles from './StandardsAssignmentResult.css'
import StandardsRatingColor from '../StandardsRatingColor'
import classes from 'classnames'
import {doSort} from '../../utils/sort'

function StandardsAssignmentResult(props) {
  const {keyIndex, scores, standardsRatings, horizontal=true, showTopPercent=true, showRightCode=false } = props
  			//showTopPercent if this is turned to true AND only if there is more than one standard to display.
  			//Loop through the assessmentCorrect records by standardSchoolId one-by-one (there can be more than one standard per assessmentCorrect record)
  			//	a. Get the total score of all of the questions
  			//	b. Get the student's score of the same questions
  			//	c. Get the percent scoreRecord
  			//	d. From the standardsRatings, get the standard score
  			//	e. Display the StandardRatingColor (below in render)
  
  			let standardsDisplay = []
  
  			scores && scores.length > 0 && scores.forEach(m => {
  					m.standards && m.standards.length > 0 && m.standards.forEach(d => {
  							let standard = standardsDisplay && standardsDisplay.length > 0 && standardsDisplay.filter(s => s.standardSchoolId === d.standardSchoolId)[0]
  							if (standard && standard.standardSchoolId) {
  									standard.pointsPossible += m.pointsPossible
  									standard.scoreSubTotal += m.score
  									standardsDisplay = standardsDisplay && standardsDisplay.length > 0  && standardsDisplay.filter(s => s.standardSchoolId !== d.standardSchoolId)
  									standardsDisplay = standardsDisplay.concat(standard)
  							} else {
  									let standard = Object.assign({}, {})
  									standard = d
  									standard.pointsPossible = m.pointsPossible
  									standard.scoreSubTotal = m.score
  									standardsDisplay = standardsDisplay && standardsDisplay.length > 0 ? standardsDisplay.concat(standard) : [standard]
  							}
  					})
  			})
  
  			standardsDisplay = standardsDisplay && standardsDisplay.length > 0 && standardsDisplay.map(m => {
  					m.percentScore = m.pointsPossible ? Math.round(m.scoreSubTotal / m.pointsPossible * 100) : 0
  					if (m.percentScore > 100) m.percentScore = 100
  					if (m.percentScore < 0) m.percentScore = 0
  					let rating = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(s => s.fromPercent <= m.percentScore && s.toPercent >= m.percentScore)[0]
  					if (rating && rating.name) {
  							m.rating = rating.score
  							m.color = rating.color
  							m.ratingName = rating.name
  					}
  					return m
  			})
  			standardsDisplay = doSort(standardsDisplay, { sortField: 'code', isAsc: true, isNumber: false })
  
  	    return (
  					<div key={keyIndex} className={horizontal ? styles.rowNowrap : styles.vertical}>
  							{standardsDisplay && standardsDisplay.length > 0 && standardsDisplay.map((m, i) =>
  									<div key={i} className={styles.row}>
  											<div className={styles.space}>
  													{showTopPercent && standardsDisplay && standardsDisplay.length > 1 &&
  															<div className={classes(styles.centered, styles.text)}>{m.percentScore}%</div>
  													}
  													<StandardsRatingColor keyIndex={i} label={m.rating} color={m.color} description={m.description} code={m.code} name={m.name}/>
  											</div>
  											{showRightCode &&
  													<div className={classes(styles.text, styles.muchTop)}>{m.code}</div>
  											}
  									</div>
  							)}
  					</div>
  	    )
}
export default StandardsAssignmentResult
