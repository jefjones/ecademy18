
import ReactExport from '../ReactDataExport'//"react-data-export";
import * as styles from './ExcelCourseSeatStatus.css'
const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelCourseSeatStatus(props) {
  const {report} = props
  
  				const dataSet1 = report && report.length > 0 && report.map(m => {
              let intervalNames = m && m.intervals && m.intervals.length > 0 && m.intervals.reduce((acc, m) => acc && acc.length > 0 ? acc + ', ' + m.code : m.code, '')
              return {
        					format: m.onlineName ? m.onlineName : m.online ? `Online` : `Traditional`,
        					courseName: m.courseName,
        					courseId: m.courseId,
        					section: m.section,
        					facilitatorName: m.facilitatorName,
        					maxSeats: m.maxSeats,
        					seatsUsed: m.studentList && m.studentList.length,
        					openSeats: m.studentList && m.studentList.length > 0 ? m.maxSeats - m.studentList.length : m.maxSeats,
        					block: m.classPeriodName,
        					interval: intervalNames,
        					credits: m.credits,
      				}
          })
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={dataSet1} name={`Course Name with Student Count`}>
  										<ExcelColumn label={`Format`} value="format"/>
  										<ExcelColumn label={`Course Name`} value="courseName"/>
  										<ExcelColumn label={`Course Id`} value="courseId"/>
  										<ExcelColumn label={`Section`} value="section"/>
  										<ExcelColumn label={`Teacher`} value="facilitatorName"/>
  										<ExcelColumn label={`Max Seats`} value="maxSeats"/>
  										<ExcelColumn label={`Seats Used`} value="seatsUsed"/>
  										<ExcelColumn label={`Open Seats`} value="openSeats"/>
  										<ExcelColumn label={`Block`} value="block"/>
  										<ExcelColumn label={`Interval`} value="interval"/>
  										<ExcelColumn label={`Credits`} value="credits"/>
                  </ExcelSheet>
              </ExcelFile>
          )
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'}/><div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
export default ExcelCourseSeatStatus
