import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './BehaviorIncidentTypeView.css'
const p = 'BehaviorIncidentTypeView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

function BehaviorIncidentTypeView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [behaviorIncidentTypeId, setBehaviorIncidentTypeId] = useState('')
  const [behaviorIncidentType, setBehaviorIncidentType] = useState({
        name: '',
				level: '',
        sequence: props.behaviorIncidentTypes && props.behaviorIncidentTypes.length + 1,
      })
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [sequence, setSequence] = useState(props.behaviorIncidentTypes && props.behaviorIncidentTypes.length + 1)
  const [errors, setErrors] = useState({
				name: '',
        sequence: '',
      })
  const [p, setP] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        	if (props.behaviorIncidentTypes !== prevProps.behaviorIncidentTypes) {
    					setBehaviorIncidentType({...behaviorIncidentType, sequence: props.behaviorIncidentTypes && props.behaviorIncidentTypes.length + 1 })
    			}
      
  }, [])

  const {behaviorIncidentTypes, levels} = props
      
      let headings = [{}, {},
  			{label: 'Level', tightText: true},
  			{label: 'Name', tightText: true},
  		]
  
      let data = []
  
      if (behaviorIncidentTypes && behaviorIncidentTypes.length > 0) {
          data = behaviorIncidentTypes.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.behaviorIncidentTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.behaviorIncidentTypeId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.level},
  							{value: m.name},
              ])
          })
      } else {
          data = [[{value: ''}, {value: <i>No behaviorIncident types entered yet.</i> }]]
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Behavior Incident Types`}/>
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={behaviorIncidentType.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={behaviorIncidentType.name}
  								error={errors.name} />
  						<div>
  								<SelectSingleDropDown
  										id={`level`}
  										name={<L p={p} t={`level`}/>}
  										label={<L p={p} t={`Level`}/>}
  										value={behaviorIncidentType.level || ''}
  										options={levels}
  										className={styles.moreBottomMargin}
  										height={`medium`}
  										onChange={handleChange}
  										required={true}
  										whenFilled={behaviorIncidentType.level}
  										error={errors.level} />
  						</div>
  						<div className={globalStyles.instructionsBigger}>
  								<L p={p} t={`Level 1: Minor acts of misconduct that interfece with orderly operatino of the classroom and school.`}/>
  						</div>
  						<div className={globalStyles.instructionsBigger}>
  								<L p={p} t={`Level 2: more serious and disruptive than level1.  Minor acts directed against others.`}/>
  						</div>
  						<div className={globalStyles.instructionsBigger}>
  								<L p={p} t={`Level 3: Repeat offenders and major acts of misconduct including threats to health, safety and property.`}/>
  						</div>
  	          <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this Behavior Incident Type?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this behavior incident type?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
        </div>
      )
}
export default BehaviorIncidentTypeView
