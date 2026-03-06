
import ReactExport from '../ReactDataExport'//"react-data-export";
import styles from './ExcelGradebookEntry.css'
import moment from 'moment'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelGradebookEntry(props) {
  const {gradebook, gradeScales} = props
  
  				const dataSet1 = gradebook && gradebook.students && gradebook.students.length > 0 && gradebook.students.map(m => {
  						let studentOverallGrade = gradebook.studentOverallGrades && gradebook.studentOverallGrades.length > 0 && gradebook.studentOverallGrades.filter(g => g.personId === m.id)[0]
  						let overallGrade = studentOverallGrade ? Number(studentOverallGrade.totalPoints) === 0 ? '' : Math.round(studentOverallGrade.totalScores / studentOverallGrade.totalPoints * 100) : ''
  						if (overallGrade > 0) {
  								let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(o => o.lowValue <= overallGrade && o.highValue >= overallGrade)[0]
  								overallGrade = overallGrade
  										? gradeScale
  												? overallGrade + '% ' + gradeScale.letter
  												: overallGrade + '%'
  										: ''
  						}
  
  						let row = {student: m.firstName + ' ' + m.lastName + ' ' + (m.accredited ? `(accredited)` : '') + ' ' + (overallGrade ? overallGrade : '')}
  
  						gradebook.assignments && gradebook.assignments.length > 0 && gradebook.assignments.forEach(s => {
  								let studentScore = gradebook.studentScores && gradebook.studentScores.length > 0 && gradebook.studentScores.filter(t => t.studentPersonId === m.personId && t.assignmentId === s.assignmentId)[0]
  								row = {
  										...row,
  										[s.assignmentId]: studentScore
  												? studentScore.scoreNotIncluded
  														? '-'
  														: studentScore.score === 0
  																? 0
  																: studentScore.score
  												: ''
  								}
  						})
  						return row
  				})
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={dataSet1} name={gradebook.courseName}>
                      <ExcelColumn label={`Student`} value="student"/>
  										{gradebook && gradebook.assignments && gradebook.assignments.length > 0 && gradebook.assignments.map((m, i) =>
                      		<ExcelColumn key={i} label={`${m.title} (${m.totalPoints || ''}) [${moment(m.dueDate).format("D MMM YYYY") || ''}]`} value={m.assignmentId}/>
  										)}
                  </ExcelSheet>
              </ExcelFile>
          )
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
export default ExcelGradebookEntry
