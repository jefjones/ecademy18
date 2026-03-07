
import ReactExport from '../ReactDataExport'//"react-data-export";
import * as styles from './ExcelStudentCourseAssign.css'
const p = 'component'
import L from '../../components/PageLanguage'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelStudentCourseAssign(props) {
  const {report} = props
  
  				const dataSet1 = report && report.length > 0 && report.map(m => ({
  					studentName: m.studentName,
  					studentId: m.studentId,
  					gradeLevelName: m.gradeLevelName,
  					courseName: m.courseName,
  					courseId: m.courseId,
  					sectionId: m.sectionId,
  					teacherName: m.teacherName,
  					classPeriodNumber: m.classPeriodNumber,
  					intervalName: m.intervalName,
  					credits: m.credits,
  				}))
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={dataSet1} name={`Course Name with Student Count`}>
  										<ExcelColumn label={`Student Name`} value="studentName"/>
  										<ExcelColumn label={`Student Id`} value="studentId"/>
  										<ExcelColumn label={`Grade`} value="gradeLevelName"/>
  										<ExcelColumn label={`Course Name`} value="courseName"/>
  										<ExcelColumn label={`Course Id`} value="courseId"/>
  										<ExcelColumn label={`Section Id`} value="sectionId"/>
  										<ExcelColumn label={`Teacher`} value="teacherName"/>
  										<ExcelColumn label={`Block`} value="classPeriodNumber"/>
  										<ExcelColumn label={`Interval`} value="intervalName"/>
  										<ExcelColumn label={`Credits`} value="credits"/>
                  </ExcelSheet>
              </ExcelFile>
          )
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
export default ExcelStudentCourseAssign
