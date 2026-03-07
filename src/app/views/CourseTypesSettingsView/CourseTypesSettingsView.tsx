import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CourseTypesSettingsView.css'
const p = 'CourseTypesSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

function CourseTypesSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [courseTypeId, setCourseTypeId] = useState('')
  const [courseType, setCourseType] = useState({
        name: '',
				code: '',
        sequence: props.courseTypes && props.courseTypes.length + 1,
				defaultGradingType: 'TEACHER'
      })
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [sequence, setSequence] = useState(props.courseTypes && props.courseTypes.length + 1)
  const [defaultGradingType, setDefaultGradingType] = useState('TEACHER')
  const [errors, setErrors] = useState({
				name: '',
				code: '',
        sequence: '',
				defaultGradingType: '',
      })
  const [p, setP] = useState(undefined)
  const [description, setDescription] = useState(<L p={p} t={`Description is required`}/>)
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(true)
  const [listUsedIn, setListUsedIn] = useState([])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        	if (props.courseTypes !== prevProps.courseTypes) {
    					setCourseType({...courseType, sequence: props.courseTypes && props.courseTypes.length + 1 })
    			}
      
  }, [])

  const {courseTypes, sequences, fetchingRecord} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  			{label: <L p={p} t={`Sequence`}/>, tightText: true},
  			{label: <L p={p} t={`Default Graded By`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}]
  
      let data = []
  
      if (courseTypes && courseTypes.length > 0) {
          data = courseTypes.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.courseTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.courseTypeId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.description},
  							{value: m.sequence},
  							{value: m.defaultGradingType},
                {value: m.usedIn && m.usedIn.length, clickFunction: () => handleShowUsedInOpen(m.usedIn)},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Course Type Settings`}/>
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={courseType.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={courseType.name} />
  						{/*<InputText
  								id={`description`}
  								name={`description`}
  								description={`description`}
  								size={"long"}
  								label={<L p={p} t={`Description`}/>}
  								value={courseType.description || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={courseType.description}
  								error={errors.description} />*/}
  						<div>
  								<SelectSingleDropDown
  										id={'sequence'}
  										label={<L p={p} t={`Sequence (for list display)`}/>}
  										value={courseType.sequence || ''}
  										noBlank={true}
  										options={sequences}
  										className={styles.dropdown}
  										onChange={handleChange}/>
  						</div>
  						<div>
  								<SelectSingleDropDown
  										id={'defaultGradingType'}
  										label={<L p={p} t={`Default grading by`}/>}
  										value={courseType.defaultGradingType || ''}
  										noBlank={true}
  										options={[{id: 'TEACHER', label: 'By Teacher'}, {id: 'STUDENT', label: 'By Student'}]}
  										className={styles.dropdown}
  										onChange={handleChange}/>
  						</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink} isFetchingRecord={fetchingRecord.courseTypesSettings}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this discipline (content area)?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this discipline (content area)?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Discipline is used in these Courses`}/>}
  										explainJSX={<div><L p={p} t={`In order to delete this discipline, please reassign the following courses with a different discipline setting:`}/><br/><br/>{listUsedIn}</div>}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default CourseTypesSettingsView
