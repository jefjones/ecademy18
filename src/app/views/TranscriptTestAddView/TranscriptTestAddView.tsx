import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './TranscriptTestAddView.css'
import InputText from '../../components/InputText'
import DateTimePicker from '../../components/DateTimePicker'
import DateMoment from '../../components/DateMoment'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import EditTable from '../../components/EditTable'
import InputDataList from '../../components/InputDataList'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function TranscriptTestAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [transcriptTest, setTranscriptTest] = useState({
				transcriptTestId:'',
				name: '',
				testDate: '',
				english: '',
				math: '',
				reading: '',
				science: '',
				composite: '',
				englishWriting: '',
			})
  const [transcriptTestId, setTranscriptTestId] = useState('')
  const [name, setName] = useState('')
  const [testDate, setTestDate] = useState('')
  const [english, setEnglish] = useState('')
  const [math, setMath] = useState('')
  const [reading, setReading] = useState('')
  const [science, setScience] = useState('')
  const [composite, setComposite] = useState('')
  const [englishWriting, setEnglishWriting] = useState('')
  const [errors, setErrors] = useState({
				name: '',
				testDate: '',
			})
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  
  		let headings = [{},{},
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: <L p={p} t={`Date`}/>, tightText: true},
  				{label: <L p={p} t={`English`}/>, tightText: true},
  				{label: <L p={p} t={`Math`}/>, tightText: true},
  				{label: <L p={p} t={`Reading`}/>, tightText: true},
  				{label: <L p={p} t={`Science`}/>, tightText: true},
  				{label: <L p={p} t={`Composite`}/>, tightText: true},
  				{label: <L p={p} t={`English/Writing`}/>, tightText: true},
  		]
  
  		let data = []
  		transcripts && transcripts.tests && transcripts.tests.length > 0 && transcripts.tests.forEach(m => {
  				let row = [
  						{value: <div onClick={() => handleEdit(m)}>
  												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  										</div>
  						},
  						{value: <a onClick={() => handleRemoveOpen(m.transcriptTestId)} className={styles.remove}>
  												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: m.name},
  						{value: <DateMoment date={m.testDate} format={'D MMM YYYY'} minusHours={6}/>},
  						{value: m.english},
  						{value: m.math},
  						{value: m.reading},
  						{value: m.science},
  						{value: m.composite},
  						{value: m.englishWriting},
  				]
  				data.push(row)
  		})
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>{`Transcript Test/Exam Entry`}</div>
  						<div>
  								<InputDataList
  										label={<L p={p} t={`Student`}/>}
  										name={'student'}
  										options={students}
  										value={selectedStudent}
  										height={`medium`}
  										onChange={handleSelectedStudent}
  										required={true}
  										whenFilled={selectedStudent}
  										error={errors.student}/>
  						</div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium-long"}
  								label={<L p={p} t={`Name`}/>}
  								value={transcriptTest.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={transcriptTest.name}
  								error={errors.name} />
  						<div className={styles.dateTimeSpace}>
  								<DateTimePicker id={`parentContactDate`} label={<L p={p} t={`Date`}/>} value={transcriptTest.testDate || ''} onChange={(event) => changeDate('testDate', event)}
  										required={true} whenFilled={transcriptTest.testDate} className={styles.dateTimeSpace} error={errors.testDate}/>
  						</div>
  						<div className={styles.rowWrap}>
  								<InputText
  										id={`english`}
  										name={`english`}
  										size={"super-short"}
  										numberOnly={true}
  										label={<L p={p} t={`English`}/>}
  										value={transcriptTest.english || ''}
  										onChange={handleChange}
  										inputClassName={styles.input} />
  								<InputText
  										id={`math`}
  										name={`math`}
  										size={"super-short"}
  										numberOnly={true}
  										label={<L p={p} t={`Math`}/>}
  										value={transcriptTest.math || ''}
  										onChange={handleChange}
  										inputClassName={styles.input} />
  								<InputText
  										id={`reading`}
  										name={`reading`}
  										size={"super-short"}
  										numberOnly={true}
  										label={<L p={p} t={`Reading`}/>}
  										value={transcriptTest.reading || ''}
  										onChange={handleChange}
  										inputClassName={styles.input} />
  								<InputText
  										id={`science`}
  										name={`science`}
  										size={"super-short"}
  										numberOnly={true}
  										label={<L p={p} t={`Science`}/>}
  										value={transcriptTest.science || ''}
  										onChange={handleChange}
  										inputClassName={styles.input} />
  								<InputText
  										id={`composite`}
  										name={`composite`}
  										size={"super-short"}
  										numberOnly={true}
  										label={<L p={p} t={`Composite`}/>}
  										value={transcriptTest.composite || ''}
  										onChange={handleChange}
  										inputClassName={styles.input} />
  								<InputText
  										id={`englishWriting`}
  										name={`englishWriting`}
  										size={"super-short"}
  										numberOnly={true}
  										label={<L p={p} t={`English/Writing`}/>}
  										value={transcriptTest.englishWriting || ''}
  										onChange={handleChange}
  										inputClassName={styles.input} />
  						</div>
  						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                  <a className={styles.cancelLink} onClick={() => navigate('/firstNav')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
  						<hr/>
  						{selectedStudent && selectedStudent.label &&
  								<div className={classes(globalStyles.pageTitle, styles.centered, styles.moreBottom)}>
  										<L p={p} t={`Tests for {selectedStudent.label}`}/>
  								</div>
  						}
  						<EditTable data={data} headings={headings} noColorStripe={true} isFetchingRecord={fetchingRecord.transcripts}/>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Transcript Test Add`}/>} path={'transcriptTestAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						<OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this Transcript Test?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this transcript test?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
        	</div>
      )
}
export default TranscriptTestAddView
