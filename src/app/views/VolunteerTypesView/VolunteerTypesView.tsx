import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './VolunteerTypesView.css'
const p = 'VolunteerTypesView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'

function VolunteerTypesView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [volunteerTypeId, setVolunteerTypeId] = useState('')
  const [volunteerType, setVolunteerType] = useState({
        name: '',
        sequence: props.volunteerTypes && props.volunteerTypes.length + 1,
      })
  const [name, setName] = useState('')
  const [sequence, setSequence] = useState(props.volunteerTypes && props.volunteerTypes.length + 1)
  const [errors, setErrors] = useState({
				name: '',
        sequence: '',
      })
  const [p, setP] = useState(undefined)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        	if (props.volunteerTypes !== prevProps.volunteerTypes) {
    					setVolunteerType({...volunteerType, sequence: props.volunteerTypes && props.volunteerTypes.length + 1 })
    			}
      
  }, [])

  const {volunteerTypes, sequences, fetchingRecord} = props
      
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Sequence`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (volunteerTypes && volunteerTypes.length > 0) {
          data = volunteerTypes.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.volunteerTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.volunteerTypeId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.sequence},
  							{value: m.usedIn && m.usedIn.length},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Volunteer Type Setting'}
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={volunteerType.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={volunteerType.name}
  								error={errors.name} />
  						<div>
  								<SelectSingleDropDown
  										id={'sequence'}
  										label={<L p={p} t={`Sequence (for list display)`}/>}
  										value={volunteerType.sequence || ''}
  										noBlank={true}
  										options={sequences}
  										className={styles.dropdown}
  										onChange={handleChange}/>
  						</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink} isFetchingRecord={fetchingRecord.volunteerTypes}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this volunteer type?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this volunteer type?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
        </div>
      )
}
export default VolunteerTypesView
