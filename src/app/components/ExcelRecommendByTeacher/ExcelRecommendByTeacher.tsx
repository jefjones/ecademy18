
import ReactExport from '../ReactDataExport'//"react-data-export";
import styles from './ExcelRecommendByTeacher.css'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelRecommendByTeacher(props) {
  const {report} = props
  
  				const dataSet1 = report && report.length > 0 && report.map(m => ({
  						facilitatorFirstName: m.facilitatorFirstName,
  						facilitatorLastName: m.facilitatorLastName,
  						gradeLevelName: m.gradeLevelName,
  						studentId: m.studentId,
  						courseName: m.courseName,
  						courseId: m.courseId,
  						studentFirstName: m.studentFirstName,
  						studentLastName: m.studentLastName,
  				}))
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={dataSet1} name={`Course Name with Student Count`}>
  										<ExcelColumn label={`Teacher Last Name`} value="facilitatorLastName"/>
  										<ExcelColumn label={`Teacher First Name`} value="facilitatorFirstName"/>
  										<ExcelColumn label={`Grade Level`} value="gradeLevelName"/>
  										<ExcelColumn label={`Student Id`} value="studentId"/>
  										<ExcelColumn label={`Course Name`} value="courseName"/>
  										<ExcelColumn label={`Course Code`} value="courseId"/>
  										<ExcelColumn label={`Student Last Name`} value="studentLastName"/>
  										<ExcelColumn label={`Student First Name`} value="studentFirstName"/>
                  </ExcelSheet>
              </ExcelFile>
          )
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
export default ExcelRecommendByTeacher
