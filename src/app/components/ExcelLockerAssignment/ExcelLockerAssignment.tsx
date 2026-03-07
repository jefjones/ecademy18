
import ReactExport from '../ReactDataExport'//"react-data-export";
import * as styles from './ExcelLockerAssignment.css'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

function ExcelLockerAssignment(props) {
  const {lockerStudentAssigns, companyConfig} = props
  
  				let data = lockerStudentAssigns && lockerStudentAssigns.length > 0 && lockerStudentAssigns.map(m => ({
  								student: companyConfig.studentNameFirst === 'FIRSTNAME' ? m.fname + ' ' + m.lname : m.lname + ', ' + m.fname,
  								lockerName: m.lockerName,
  								lockerCombination: m.lockerCombination,
  								lockerNote: m.lockerNote,
  								serialNumber: m.serialNumber,
  								paddlelockCombination: m.paddlelockCombination,
  								paddlelockNote: m.paddlelockNote,
  								lockerStudentAssignNote: m.lockerStudentAssignNote,
  				}))
  
          return (
              <ExcelFile className={styles.change}>
                  <ExcelSheet data={data} name={`Locker Assignments`}>
  										<ExcelColumn label={`Student`} value="student"/>
  										<ExcelColumn label={`Locker`} value="lockerName"/>
  										<ExcelColumn label={`Locker combo`} value="lockerCombination"/>
  										<ExcelColumn label={`Locker note`} value="lockerNote"/>
  										<ExcelColumn label={`Paddlelock`} value="serialNumber"/>
  										<ExcelColumn label={`Paddlelock combo`} value="paddlelockCombination"/>
  										<ExcelColumn label={`Paddlelock note`} value="paddlelockNote"/>
                      <ExcelColumn label={`Assign note`} value="lockerStudentAssignNote"/>
                  </ExcelSheet>
              </ExcelFile>
          )
}
export default ExcelLockerAssignment
