import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './TestScoreAddView.css'
const p = 'TestScoreAddView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import TextDisplay from '../../components/TextDisplay'
import InputText from '../../components/InputText'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import DateTimePicker from '../../components/DateTimePicker'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function TestScoreAddView(props) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [testScore, setTestScore] = useState({
				testingId: '',
				studentPersonId: '',
				testDate: '',
				testComponentScores: [],
				note: ''
      })
  const [testingId, setTestingId] = useState('')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [testDate, setTestDate] = useState('')
  const [testComponentScores, setTestComponentScores] = useState([])
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({
				testingId: '',
				studentPersonId: '',
				testDate: '',
				testComponentScores: [],
      })
  const [p, setP] = useState(undefined)
  const [testId, setTestId] = useState(<L p={p} t={`Test is required`}/>)
  const [name, setName] = useState(<L p={p} t={`Component is required`}/>)

  const {personId, myFrequentPlaces, setMyFrequentPlace, testSettings={}, students} = props
      
  		let tests = testSettings.tests
  		let test = testScore && testScore.testId && tests && tests.length > 0 && tests.filter(m => m.testId === testScore.testId)[0]
  		let testComponents = test && test.testComponentsAssigned
  		let overallScore = 0
  
      return (
          <div className={styles.container}>
              <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                  <L p={p} t={`Add Test Score`}/>
              </div>
  						<div>
  								<InputDataList
  										label={<L p={p} t={`Student`}/>}
  										name={'student'}
  										options={students}
  										value={selectedStudent}
  										height={`medium`}
  										className={styles.moreSpace}
  										onChange={handleSelectedStudents}
  										required={true}
  										whenFilled={selectedStudent && selectedStudent.id}
  										error={errors.studentPersonId}/>
  						</div>
  						<div className={styles.row}>
  								<div>
  										<SelectSingleDropDown
  												id={`testId`}
  												name={`testId`}
  												label={<L p={p} t={`Test`}/>}
  												value={testScore.testId || ''}
  												options={tests}
  												height={'medium'}
  												className={styles.moreBottomMargin}
  												required={true}
  												whenFilled={testScore.testId}
  												onChange={handleChange}
  												error={errors.testId}/>
  								</div>
  								{testScore.possibleScore && <TextDisplay label={<L p={p} t={`Possible score`}/>} text={testScore.possibleScore} className={styles.textPlacement}/>}
  						</div>
  						<div className={styles.moreTop}>
  								<DateTimePicker id={`testDate`} value={testScore.testDate} label={<L p={p} t={`Test date`}/>} required={true} whenFilled={testScore.testDate}
  										onChange={(event) => changeTestDate('testDate', event)} error={errors.testDate}/>
  						</div>
  						{testComponents && testComponents.length > 0 && testComponents.map((m, i) => {
  								let score = testScore && testScore.testComponentScores && testScore.testComponentScores.length > 0 && testScore.testComponentScores.filter(t => t.testComponentId === m.testComponentId)[0]
  								score = score && score.score ? score.score : ''
  								overallScore = String(Number(score ? score : 0) + Number(overallScore))
  
  								return (
  										<InputText key={i}
  												id={`possibleScore`}
  												name={`possibleScore`}
  												size={"super-short"}
  												label={<L p={p} t={`${m.testComponentName} score`}/>}
  												numberOnly={true}
  												value={score || ''}
  												onChange={(event) => handleScoreChange(m.testComponentId, event)}/>
  								)
  						})}
  						{overallScore ? <TextDisplay label={<L p={p} t={`Total score`}/>} text={overallScore} className={styles.moreSpace}/> : ''}
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Test Score Add`}/>} path={'testScoreAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
        </div>
      )
}

export default withAlert(TestScoreAddView)
