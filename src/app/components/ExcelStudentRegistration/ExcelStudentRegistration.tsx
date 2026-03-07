
import ReactExport from '../ReactDataExport'//"react-data-export";
import * as styles from './ExcelStudentRegistration.css'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelStudentRegistration(props) {
  const {report} = props
  
  				const dataSet1 = report && report.length > 0 && report.map(m => {
              //let intervalNames = m && m.intervals && m.intervals.length > 0 && m.intervals.reduce((acc, m) => acc && acc.length > 0 ? acc + ', ' + m.code : m.code, '');
              return {
      						studentName: m.studentName,
      						studentId: m.studentId,
      						gradeLevelName: m.gradeLevelName,
      						counselorName: m.counselorName,
      						credits: m.credits,
                  interval: m.intervalCode,
                  periodNumber: m.periodNumber,
                  courseName: m.courseName,
      				}
          })
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={dataSet1} name={`Course Name with Student Count`}>
  										<ExcelColumn label={`Student`} value="studentName"/>
  										<ExcelColumn label={`Id`} value="studentId"/>
  										<ExcelColumn label={`Grade`} value="gradeLevelName"/>
                      <ExcelColumn label={`Credits`} value="credits"/>
                      <ExcelColumn label={`Interval`} value="interval"/>
                      <ExcelColumn label={`Block`} value="periodNumber"/>
  										<ExcelColumn label={`Course`} value="courseName"/>
                  </ExcelSheet>
              </ExcelFile>
          )
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
export default ExcelStudentRegistration
