import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FinanceCourseFeeAddView.css'
const p = 'FinanceCourseFeeAddView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import {formatNumber} from '../../utils/numberFormat'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import DateTimePicker from '../../components/DateTimePicker'
import DateMoment from '../../components/DateMoment'
import RadioGroup from '../../components/RadioGroup'
import Checkbox from '../../components/Checkbox'
import Icon from '../../components/Icon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'

function FinanceCourseFeeAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedObservers, setSelectedObservers] = useState([])
  const [financeCourseFee, setFinanceCourseFee] = useState({
					})
  const [errors, setErrors] = useState({})
  const [fileUrl, setFileUrl] = useState('')
  const [selectedCourseEntryIds, setSelectedCourseEntryIds] = useState([])
  const [financeCourseFeeId, setFinanceCourseFeeId] = useState('')
  const [financeFeeTypeId, setFinanceFeeTypeId] = useState('')
  const [financeGlcodeId, setFinanceGlcodeId] = useState('')
  const [refundType, setRefundType] = useState('')
  const [financeWaiverScheduleId, setFinanceWaiverScheduleId] = useState('')
  const [financeLowIncomeWaiverId, setFinanceLowIncomeWaiverId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [mandatoryOrOptional, setMandatoryOrOptional] = useState('')
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [partialNameText, setPartialNameText] = useState('')
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])
  const [slectedGradeLevels, setSlectedGradeLevels] = useState([])
  const [isShowingModal_description, setIsShowingModal_description] = useState(true)
  const [courseName, setCourseName] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(true)
  const [fianceCourseFeeId, setFianceCourseFeeId] = useState(null)

  const {personId, financeCourseFees, financeFeeTypes, baseCourses, myFrequentPlaces, setMyFrequentPlace, refundOptions, financeGLCodes, personConfig,
  						financeLowIncomeWaivers, fetchingRecord} = props
  		
  
  		let filteredCourseFees = financeCourseFees
  
  		if (partialNameText) {
  				let cutBackTextFilter = partialNameText.toLowerCase()
  				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.courseName && m.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1))
  		}
  
  		if (selectedCourses && selectedCourses.length > 0) {
  				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => {
  						let found = false
  						selectedCourses.forEach(s => { if (s.id === m.courseEntryId) found = true })
  						return found
  				})
  		}
  
  		if (selectedGradeLevels && selectedGradeLevels.length > 0) {
  				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => {
  						let found = false
  						selectedGradeLevels.forEach(gradeLevelId => {
  								m.gradeLevels && m.gradeLevels.length > 0 && m.gradeLevels.forEach(g => {
  										if (g.gradeLevelId === gradeLevelId) found = true
  								})
  						})
  						return found
  				})
  		}
  
  		if (viewOption === 'WithFees') {
  				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => m.amount)
  		} else if (viewOption === 'WithoutFees') {
  				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => !m.amount)
  		}
  
  		filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.map((m, i) => {
  				m.icons = <div className={classes(globalStyles.cellText, styles.moreTop, styles.row)}>
  											<Checkbox
  													id={`courseFee${m.courseEntryId}`}
  													name={`courseFee${m.courseEntryId}`}
  													label={''}
  													checked={getSelectedCourseEntry(m.courseEntryId)}
  													onClick={() => toggleCourseEntry(m.courseEntryId)}/>
  											{m.amount
  													? <a onClick={() => handleRemoveItemOpen(m.financeCourseFeeId)} className={styles.remove}>
  																<Icon pathName={'trash2'} premium={true} className={styles.icon} fillColor={'maroon'}/>
  														</a>
  													: ''
  											}
  									</div>
  				m.feeType = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  										{m.financeFeeTypeName}
  								 </div>
  			 m.feeAmount = m.amount
                          ? <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
      												{`$${formatNumber(m.amount, true, false, 2)}`}
      										  </div>
                          : ''
  		 	 m.name = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  										{m.courseName}
  								 </div>
  			 m.glcodeName = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  													{m.financeGlcodeName}
  											</div>
  			 m.refund = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  											{m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}
  									</div>
  			 m.lowIncomeWaiverName = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  															{m.financeLowIncomeWaiverName}
  													 </div>
  			 m.mandatory = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  															{m.mandatoryOrOptional}
  													 </div>
  			 m.due = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  															<DateMoment date={m.dueDate}/>
  													 </div>
  				m.desc = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => {handleDescriptionOpen(m.courseName, m.description); chooseRecord(i);}}>
  											{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
  									</div>
  				m.entry = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  											<DateMoment date={m.entryDate}/>
  									</div>
  				m.entryPerson = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => chooseRecord(i)}>
  														{m.entryPersonName}
  												</div>
  
  				return m
  		})
  
  		let columns = [
  			{
  				width: 60,
  				label: '',
  				dataKey: 'icons',
  			},
  			{
  				width: 120,
  				label: <L p={p} t={`Fee`}/>,
  				dataKey: 'feeType',
  			},
  			{
  				width: 60,
  				label: <L p={p} t={`Amount`}/>,
  				dataKey: 'feeAmount',
  			},
  			{
  				width: 160,
  				label: <L p={p} t={`Name`}/>,
  				dataKey: 'name',
  			},
  			{
  				width: 100,
  				label: <L p={p} t={`GL code`}/>,
  				dataKey: 'glcodeName',
  			},
  			{
  				width: 120,
  				label: <L p={p} t={`Refund type`}/>,
  				dataKey: 'refund',
  			},
  			{
  				width: 120,
  				label: <L p={p} t={`Income waiver`}/>,
  				dataKey: 'lowIncomeWaiverName',
  			},
  			{
  				width: 80,
  				label: <L p={p} t={`Mandatory?`}/>,
  				dataKey: 'mandatory',
  			},
  			{
  				width: 100,
  				label: <L p={p} t={`Due date`}/>,
  				dataKey: 'due',
  			},
  			{
  				width: 320,
  				label: <L p={p} t={`Description`}/>,
  				dataKey: 'desc',
  			},
  			{
  				width: 100,
  				label: <L p={p} t={`Entry date`}/>,
  				dataKey: 'entry',
  			},
  			{
  				width: 120,
  				label: <L p={p} t={`Entered by`}/>,
  				dataKey: 'entryPerson',
  			}
  	]
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Add New Course Fee`}/>
  						</div>
  						<div>
  								<div className={styles.rowWrap}>
  										<div>
  												<div className={globalStyles.filterLabel}><L p={p} t={`FILTERS:`}/></div>
  												<div onClick={resetFilters} className={globalStyles.clearLink}><L p={p} t={`clear`}/></div>
  										</div>
  										<div className={styles.littleLeft}>
  												<InputText
  														id={"partialNameText"}
  														name={"partialNameText"}
  														size={"medium"}
  														label={<L p={p} t={`Text search`}/>}
  														value={partialNameText || ''}
  														onChange={handleTextSearch}/>
  										</div>
  										<div>
  												<InputDataList
  														label={<L p={p} t={`Course(s)`}/>}
  														name={'courses'}
  														options={baseCourses}
  														value={selectedCourses}
  														multiple={true}
  														height={`medium`}
  														className={styles.moreSpace}
  														onChange={handleSelectedCourses}
  														error={errors.baseCoursesOrGroup}/>
  										</div>
  										<div className={classes(styles.muchTop, styles.moreLeft)}>
  												<div className={styles.label}><L p={p} t={`Grade levels`}/></div>
  												<div className={styles.rowWrap}>
  														{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
  																<Checkbox
  																		key={i}
  																		id={m.gradeLevelId}
  																		label={m.name}
  																		checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && (selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
  																		onClick={() => toggleGradeLevel(m.gradeLevelId)}
  																		labelClass={styles.labelCheckbox}
  																		checkboxClass={styles.checkbox} />
  														)}
  												</div>
  										</div>
  								</div>
  								<div className={styles.moreTop}>
  										<RadioGroup
  												label={'View options'}
  												data={[{label: <L p={p} t={`All`}/>, id: 'All'}, {label: <L p={p} t={`With fees`}/>, id: 'WithFees'}, {label: <L p={p} t={`Without fees`}/>, id: 'WithoutFees'}]}
  												name={`viewOption`}
  												horizontal={true}
  												className={styles.radio}
  												initialValue={viewOption || 'All'}
  												onClick={handleViewOption}/>
  								</div>
  						</div>
  						<hr/>
  						<div className={styles.rowWrap}>
  								<div className={styles.moreBottom}>
  										<SelectSingleDropDown
  												id={`financeFeeTypeId`}
  												name={`financeFeeTypeId`}
  												label={<L p={p} t={`Fee type`}/>}
  												value={financeFeeTypeId || financeCourseFee.financeFeeTypeId || ''}
  												options={financeFeeTypes}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleCourseFee}
  												required={true}
  												whenFilled={financeCourseFee.financeFeeTypeId}
  												errors={errors.financeFeeTypeId}/>
  								</div>
  								<InputText
  										id={`amount`}
  										name={`amount`}
  										size={"short"}
  										numberOnly={true}
  										label={<L p={p} t={`Amount`}/>}
  										value={financeCourseFee.amount || ''}
  										onChange={handleCourseFee}
  										required={true}
  										whenFilled={financeCourseFee.amount}
  										error={errors.amount}/>
  								<div className={classes(styles.moreTop, styles.moreRight)}>
  										<DateTimePicker label={<L p={p} t={`Due date (optional)`}/>} id={`dueDate`} value={financeCourseFee.dueDate} onChange={handleCourseFee}/>
  								</div>
  								<div className={styles.moreRight}>
  										<InputTextArea
  												label={<L p={p} t={`Description`}/>}
  												name={'description'}
  												value={financeCourseFee.description || ''}
  												autoComplete={'dontdoit'}
  												inputClassName={styles.moreRight}
  												boldText={true}
  												onChange={handleCourseFee}/>
  								</div>
  						</div>
  						<div className={styles.rowWrap}>
  								<div className={styles.moreTop}>
  										<RadioGroup
  												label={<L p={p} t={`Refund option`}/>}
  												data={refundOptions}
  												name={`refundType`}
  												horizontal={false}
  												className={styles.radio}
  												initialValue={financeCourseFee.refundType}
  												onClick={handleRadioChoice}
  												required={true}
  												whenFilled={financeCourseFee.refundType}
  												error={errors.refundType}/>
  								</div>
  								<div>
  										<SelectSingleDropDown
  												id={`financeGlcodeId`}
  												name={`financeGlcodeId`}
  												label={<L p={p} t={`GL code`}/>}
  												value={financeCourseFee.financeGlcodeId || ''}
  												options={financeGLCodes}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleCourseFee}/>
  								</div>
  								<div>
  										<SelectSingleDropDown
  												id={`financeLowIncomeWaiverId`}
  												name={`financeLowIncomeWaiverId`}
  												label={<L p={p} t={`Low income waiver`}/>}
  												value={financeCourseFee.financeLowIncomeWaiverId || ''}
  												options={financeLowIncomeWaivers}
  												className={styles.moreBottomMargin}
  												height={`medium`}
  												onChange={handleCourseFee}/>
  								</div>
  								<div className={styles.moreTop}>
  										<RadioGroup
  											label={<L p={p} t={`Is this fee mandatory?`}/>}
  											data={[{ label: <L p={p} t={`Mandatory`}/>, id: 'Mandatory' }, { label: <L p={p} t={`Optional`}/>, id: 'Optional' }, ]}
  											name={`answerTrueFalse`}
  											horizontal={true}
  											className={styles.radio}
  											initialValue={financeCourseFee.mandatoryOrOptional}
  											required={true}
  											whenFilled={financeCourseFee.mandatoryOrOptional}
  											onClick={handleMandatory}
  											error={errors.mandatoryOrOptional}/>
  								</div>
  						</div>
  						<div className={classes(styles.muchLeft, styles.row)}>
  								<a className={styles.cancelLink} onClick={() => navigate('/financeCourseFeeList')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  						</div>
  						<div className={styles.widthStop}>
  								<Loading isLoading={fetchingRecord.financeCourseFees} />
  								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(filteredCourseFees && filteredCourseFees.length) || 0}
  												rowGetter={({ index }) => (filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees[index]) || ''}
  												columns={columns} />
  								</Paper>
  						</div>
  						{isShowingModal_delete &&
  								<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this billing record?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this billing record?`}/>} isConfirmType={true}
  									 onClick={handleDelete} />
  						}
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
  						{isShowingModal_description &&
  								<MessageModal handleClose={handleDescriptionClose} heading={courseName} explain={description} onClick={handleDescriptionClose} />
  						}
  						{isShowingModal_remove &&
  								<MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this course fee entry?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to remove this course fee?`}/>} isConfirmType={true}
  									 onClick={handleRemoveItem} />
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Billing`}/>} path={'financeCourseFeeAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
        </div>
      )
}

export default withAlert(FinanceCourseFeeAddView)
