import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './FinanceGroupsView.css'
const p = 'FinanceGroupsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import InputDataList from '../../components/InputDataList'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function FinanceGroupsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [financeGroupTableId, setFinanceGroupTableId] = useState('')
  const [financeGroup, setFinanceGroup] = useState({
        name: '',
				description: '',
				ell: false,
				specialEd: false,
				_504: false
      })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ell, setEll] = useState(false)
  const [specialEd, setSpecialEd] = useState(false)
  const [_504, set_504] = useState(false)
  const [errors, setErrors] = useState({
				name: '',
				description: '',
				ell: false,
				specialEd: false,
				_504: false
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedCount, setIsShowingModal_usedCount] = useState(true)
  const [selectedSchoolYears, setSelectedSchoolYears] = useState([])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])
  const [selectedCoursesScheduled, setSelectedCoursesScheduled] = useState([])

  const {financeGroups, fetchingRecord, schoolYears, coursesScheduled, gradeLevels} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`ELL`}/>, tightText: true},
  			{label: <L p={p} t={`Special Ed`}/>, tightText: true},
  			{label: <L p={p} t={`504`}/>, tightText: true},
  			{label: <L p={p} t={`School year(s)`}/>, tightText: true},
  			{label: <L p={p} t={`Grade level(s)`}/>, tightText: true},
  			{label: <L p={p} t={`Course(s)`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (financeGroups && financeGroups.length > 0) {
          data = financeGroups.map(m => {
              return ([
  							{value: m.name && <a onClick={() => handleEdit(m.financeGroupTableId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.name && <a onClick={() => handleRemoveItemOpen(m.financeGroupTableId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.ell ? 'ELL' : ''},
  							{value: m.specialEd ? 'Special Ed' : ''},
  							{value: m._504 ? '504' : ''},
  							{value: m.schoolYears && m.schoolYears.length > 0 && m.schoolYears.reduce((acc, m) => acc += (acc && acc.length > 0 ? ', ' : '') + m.label, '')},
  							{value: m.gradeLevels && m.gradeLevels.length > 0 && m.gradeLevels.reduce((acc, m) => acc += (acc && acc.length > 0 ? ', ' : '') + m.label, '')},
  							{value: m.coursesScheduled && m.coursesScheduled.length > 0 && m.coursesScheduled.reduce((acc, m) => acc += (acc && acc.length > 0 ? '<br/> ' : '') + m.label, '')},
  							{value: m.description},
                {value: m.usedCount},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Finance Groups`}/>
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={financeGroup.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeGroup.name}
  								error={errors.name} />
  						<InputText
  								id={`description`}
  								name={`description`}
  								size={"long"}
  								label={<L p={p} t={`Description`}/>}
  								value={financeGroup.description || ''}
  								onChange={handleChange} />
  						<div className={styles.rowWrap}>
  								<div className={styles.listPosition}>
  										<InputDataList
  												label={<L p={p} t={`School year(s)`}/>}
  												name={'selectedSchoolYears'}
  												options={schoolYears || [{id: '', value: ''}]}
  												value={selectedSchoolYears}
  												multiple={true}
  												height={`medium`}
  												className={styles.moreTop}
  												onChange={chooseSchoolYears}
  												required={true}
  												whenFilled={selectedSchoolYears && selectedSchoolYears.length > 0}
  												error={errors.schoolYears}/>
  								</div>
  								<div className={classes(styles.moreTop, globalStyles.instructionsBigger)}>
  										<br/>
  										<L p={p} t={`For which year or years this group is available for use`}/>
  								</div>
  						</div>
  						<div className={styles.listPosition}>
  								<InputDataList
  										label={<L p={p} t={`Courses scheduled`}/>}
  										name={'selectedCoursesScheduled'}
  										options={coursesScheduled || [{id: '', value: ''}]}
  										value={selectedCoursesScheduled}
  										multiple={true}
  										height={`medium`}
  										className={styles.moreTop}
  										onChange={chooseCoursesScheduled}
  										error={errors.groups}/>
  						</div>
  						<br/>
  						<span className={classes(styles.textRating, styles.moreTop)}><L p={p} t={`Grade Level`}/></span>
  						<div className={styles.rowWrap}>
  								{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
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
  						<br/>
  						<span className={classes(styles.textRating, styles.moreTop)}>Student groups</span>
  						<div className={styles.rowWrap}>
  								<Checkbox
  										id={'ell'}
  										label={'ELL'}
  										checked={financeGroup.ell || ''}
  										onClick={() => toggleCheckbox('ell')}
  										labelClass={styles.labelCheckbox}
  										checkboxClass={styles.checkbox} />
  								<Checkbox
  										id={'specialEd'}
  										label={<L p={p} t={`Special Ed`}/>}
  										checked={financeGroup.specialEd || ''}
  										onClick={() => toggleCheckbox('specialEd')}
  										labelClass={styles.labelCheckbox}
  										checkboxClass={styles.checkbox} />
  								<Checkbox
  										id={'_504'}
  										label={<L p={p} t={`504`}/>}
  										checked={financeGroup._504 || ''}
  										onClick={() => toggleCheckbox('_504')}
  										labelClass={styles.labelCheckbox}
  										checkboxClass={styles.checkbox} />
  						</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={reset}><L p={p} t={`Reset`}/></div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeGroupSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this finance group?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this finance group?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedCount &&
                  <MessageModal handleClose={handleShowUsedCountClose} heading={<L p={p} t={`This Finance Group is in Use`}/>}
  										explainJSX={<L p={p} t={`A finance group cannot be deleted once it has been used`}/>}
  										onClick={handleShowUsedCountClose}/>
              }
        </div>
      )
}
export default FinanceGroupsView
