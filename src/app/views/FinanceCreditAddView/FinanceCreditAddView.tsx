import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import styles from './FinanceCreditAddView.css'
const p = 'FinanceCreditAddView'
import L from '../../components/PageLanguage'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import globalStyles from '../../utils/globalStyles.css'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import EditTable from '../../components/EditTable'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'

function FinanceCreditAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedObservers, setSelectedObservers] = useState([])
  const [financeCredit, setFinanceCredit] = useState({
					})
  const [errors, setErrors] = useState({})
  const [isInit, setIsInit] = useState(true)
  const [creditAmounts, setCreditAmounts] = useState([])
  const [financeCreditTransactionId, setFinanceCreditTransactionId] = useState('')
  const [financeCreditTypeId, setFinanceCreditTypeId] = useState('')
  const [financeGlcodeId, setFinanceGlcodeId] = useState('')
  const [financeGroupTableId, setFinanceGroupTableId] = useState('')
  const [refundType, setRefundType] = useState('')
  const [financeWaiverScheduleId, setFinanceWaiverScheduleId] = useState('')
  const [financeLowIncomeWaiverId, setFinanceLowIncomeWaiverId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [mandatoryOrOptional, setMandatoryOrOptional] = useState('')
  const [selectedFile, setSelectedFile] = useState(file)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [clearStudent, setClearStudent] = useState(false)
  const [clearGuardian, setClearGuardian] = useState(false)
  const [clearTeacher, setClearTeacher] = useState(false)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {paramPersonId, students} = props
    			
    			if (!isInit && paramPersonId && students && students.length > 0) {
    					let paramPerson = students.filter(m => m.id === paramPersonId)[0]
    					if (paramPerson && paramPerson.id) setIsInit(true); setSelectedStudents([paramPerson])
    			}
    	
  }, [])

  const {personId, financeCreditTypes, students, myFrequentPlaces, setMyFrequentPlace, financeGroups} = props
  		
  
  		let headings = [{label: <L p={p} t={`Student`}/>},{label: <L p={p} t={`Grade level`}/>}, {label: <L p={p} t={`Amount`}/>}]
  
  		let data = selectedStudents && selectedStudents.length > 0 && selectedStudents.map((m, i) =>
  				[
  						{ value: m.label},
  						{ value: m.gradeLevelName},
  						{ value: <InputText
  													id={`amount${m.id}`}
  													name={`amount${m.id}`}
  													size={"short"}
  													numberOnly={true}
  													label={``}
  													//value={getFinanceCreditAmount(m.id)}
  													value={state[`amount${m.id}`] || ''}
  													onChange={(event) => handleCreditAmount(m.id, event)}/>
  						},
  				]
  		)
  
  		data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}>Please choose at least one student</div>, colSpan: 4}]]
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								{financeCreditTransactionId ? <L p={p} t={`Update Credit Entry`}/> : <L p={p} t={`Add New Credit`}/>}
  						</div>
  						<div className={globalStyles.instructionsBigger}>
  								<L p={p} t={`Choose a group or at least one student`}/>
  						</div>
  						<div className={styles.rowWrap}>
  								<div className={styles.row}>
  										<div>
  												<InputDataList
  														label={<L p={p} t={`Student(s)`}/>}
  														name={'students'}
  														options={students}
  														value={selectedStudents}
  														multiple={true}
  														height={`medium`}
  														className={styles.moreSpace}
  														onChange={handleSelectedStudents}
  														error={errors.studentsOrGroup}/>
  										</div>
  										{selectedStudents && selectedStudents.length === 1 &&
  												<div className={classes(styles.siblingPosition, styles.smallWidth, styles.row, styles.moreRight)}>
  														<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={includeSiblings} addClassName={styles.smallButton}/>
  														<div className={classes(styles.label, styles.labelPosition)}>{noSiblingsFound ? <L p={p} t={`No siblings found`}/> : <L p={p} t={`Include siblings`}/>}</div>
  												</div>
  										}
  								</div>
  								<div className={classes(styles.moreBottom, styles.littleTop)}>
  										<SelectSingleDropDown
  												id={`financeGroupTableId`}
  												name={`financeGroupTableId`}
  												label={<L p={p} t={`or Group`}/>}
  												value={financeCredit.financeGroupTableId || ''}
  												options={financeGroups}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleChange}
  												errors={errors.financeGroupTableId}/>
  								</div>
  						</div>
  						<hr/>
  						<div className={styles.rowWrap}>
  								<div className={styles.moreBottom}>
  										<SelectSingleDropDown
  												id={`financeCreditTypeId`}
  												name={`financeCreditTypeId`}
  												label={<L p={p} t={`Credit type`}/>}
  												value={financeCredit.financeCreditTypeId || ''}
  												options={financeCreditTypes}
  												height={`medium`}
  												onChange={handleChange}
  												required={true}
  												whenFilled={financeCredit.financeCreditTypeId}
  												errors={errors.financeCreditTypeId}/>
  								</div>
  								<div className={classes(styles.moreRight, styles.littleTop)}>
  										<InputTextArea
  												label={<L p={p} t={`Description`}/>}
  												name={'description'}
  												value={financeCredit.description || ''}
  												autoComplete={'dontdoit'}
  												inputClassName={styles.moreRight}
  												boldText={true}
  												onChange={handleChange}/>
  								</div>
  								<div className={styles.moreSpace}>
  										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={handleInputFile} isResize={true}/>
  								</div>
  						</div>
  						<div className={classes(styles.muchLeft, styles.row)}>
  								<a className={styles.cancelLink} onClick={() => navigate('/schoolSettings')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  						</div>
  						<hr/>
  						<EditTable headings={headings} data={data} />
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Credit Entry`}/>} path={'financeCreditAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceCreditAddView)
