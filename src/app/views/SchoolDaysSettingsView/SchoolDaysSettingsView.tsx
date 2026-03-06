import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './SchoolDaysSettingsView.css'
const p = 'SchoolDaysSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'

function SchoolDaysSettingsView(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [monday, setMonday] = useState(props.companyConfig.monday)
  const [tuesday, setTuesday] = useState(props.companyConfig.tuesday)
  const [wednesday, setWednesday] = useState(props.companyConfig.wednesday)
  const [thursday, setThursday] = useState(props.companyConfig.thursday)
  const [friday, setFriday] = useState(props.companyConfig.friday)
  const [saturday, setSaturday] = useState(props.companyConfig.saturday)
  const [sunday, setSunday] = useState(props.companyConfig.sunday)

  const {isShowingModal} = props
      	return (
  	        <div className={styles.container}>
  	            <div className={globalStyles.pageTitle}>
  	                <L p={p} t={`School Days Settings`}/>
  	            </div>
  							<div className={styles.instructions}>
  									Mark which days the school would have at least one class
  							</div>
  							<div className={styles.moreLeft}>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'monday'}
  													label={<L p={p} t={`Monday`}/>}
  													checked={monday}
  													onClick={() => handleChange('monday')}
  													labelClass={styles.label}/>
  									</div>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'tuesday'}
  													label={<L p={p} t={`Tuesday`}/>}
  													checked={tuesday}
  													onClick={() => handleChange('tuesday')}
  													labelClass={styles.label}/>
  									</div>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'wednesday'}
  													label={<L p={p} t={`Wednesday`}/>}
  													checked={wednesday}
  													onClick={() => handleChange('wednesday')}
  													labelClass={styles.label}/>
  									</div>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'thursday'}
  													label={<L p={p} t={`Thursday`}/>}
  													checked={thursday}
  													onClick={() => handleChange('thursday')}
  													labelClass={styles.label}/>
  									</div>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'friday'}
  													label={<L p={p} t={`Friday`}/>}
  													checked={friday}
  													onClick={() => handleChange('friday')}
  													labelClass={styles.label}/>
  									</div>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'saturday'}
  													label={<L p={p} t={`Saturday`}/>}
  													checked={saturday}
  													onClick={() => handleChange('saturday')}
  													labelClass={styles.label}/>
  									</div>
  									<div className={styles.checkboxSpace}>
  											<Checkbox
  													id={'sunday'}
  													label={<L p={p} t={`Sunday`}/>}
  													checked={sunday}
  													onClick={() => handleChange('sunday')}
  													labelClass={styles.label}/>
  									</div>
  							</div>
  	            <div className={styles.rowRight}>
  									<ButtonWithIcon label={<L p={p} t={`Done`}/>} icon={'checkmark_circle'} onClick={() => validateEntry(null, true)}/>
  	            </div>
  	            <OneFJefFooter />
  	            {isShowingModal &&
  	                <MessageModal handleClose={handleNoChosenClose} heading={<L p={p} t={`No days chosen`}/>}
  	                   explainJSX={<L p={p} t={`At least one day is required on which one or more classes would occur.`}/>} isConfirmType={true}
  	                   onClick={handleNoChosen} />
  	            }
  	      	</div>
        )
}
export default SchoolDaysSettingsView
