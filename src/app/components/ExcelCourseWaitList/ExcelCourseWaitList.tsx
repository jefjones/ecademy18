
import ReactExport from '../ReactDataExport'//"react-data-export";
import styles from './ExcelCourseWaitList.css'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelCourseWaitList(props) {
  const {report} = props
  
  				const dataSet1 = report && report.length > 0 && report.map(m => ({
  					courseName: m.courseName,
  					intervalName: m.intervalName,
  					block1: (m.ifOpenSeatBlock1 ? m.ifOpenSeatBlock1 + ' - ' : '') + (m.firstPrefBlock1 || '0') + ' / ' + (m.secondPrefBlock1 || '0'),
  					block2: (m.ifOpenSeatBlock2 ? m.ifOpenSeatBlock2 + ' - ' : '') + (m.firstPrefBlock2 || '0') + ' / ' + (m.secondPrefBlock2 || '0'),
  					block3: (m.ifOpenSeatBlock3 ? m.ifOpenSeatBlock3 + ' - ' : '') + (m.firstPrefBlock3 || '0') + ' / ' + (m.secondPrefBlock3 || '0'),
  					block4: (m.ifOpenSeatBlock4 ? m.ifOpenSeatBlock4 + ' - ' : '') + (m.firstPrefBlock4 || '0') + ' / ' + (m.secondPrefBlock4 || '0'),
  					block5: (m.ifOpenSeatBlock5 ? m.ifOpenSeatBlock5 + ' - ' : '') + (m.firstPrefBlock5 || '0') + ' / ' + (m.secondPrefBlock5 || '0'),
  				}))
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={dataSet1} name={`Course Wait List`}>
  										<ExcelColumn label={`Course`} value="courseName"/>
  										<ExcelColumn label={`Interval`} value="intervalName"/>
  										<ExcelColumn label={`Block 1`} value="block1"/>
  										<ExcelColumn label={`Block 2`} value="block2"/>
  										<ExcelColumn label={`Block 3`} value="block3"/>
  										<ExcelColumn label={`Block 4`} value="block4"/>
  										<ExcelColumn label={`Block 5`} value="block5"/>
                  </ExcelSheet>
              </ExcelFile>
          )
}


//<ExcelColumn key={i} label={<div className={styles.row}><div>{m.title} {(m.totalPoints && ' (' + m.totalPoints + ')')} {m.dueDate && ' ['}</div> <DateMoment date={m.dueDate} format={'D MMM'<div> {m.dueDate && ']'}</div></div>} value={m.assignmentId}/>
export default ExcelCourseWaitList
