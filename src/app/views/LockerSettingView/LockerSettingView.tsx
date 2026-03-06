import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './LockerSettingView.css'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import OneFJefFooter from '../../components/OneFJefFooter'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Icon from '../../components/Icon'
import classes from 'classnames'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import EditTable from '../../components/EditTable'

function LockerSettingView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [locker, setLocker] = useState({
				lockerId:'',
				name: '',
				level: '',
				combination: '',
				note:'',
			})
  const [lockerId, setLockerId] = useState('')
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [combination, setCombination] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({
				name:'',
			})

  
  		let headings = [{},{},
  				{label: <L p={p} t={`Locker #`}/>, tightText: true},
  				{label: <L p={p} t={`Position`}/>, tightText: true},
  				{label: <L p={p} t={`Combination`}/>, tightText: true},
  				{label: <L p={p} t={`Note`}/>, tightText: true},
  		]
  		let data = lockers && lockers.length > 0 && lockers.map(locker => {
  				return [
  						{value: <div onClick={() => getrecord(locker)}>
  												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  										</div>
  						},
  						{value: <a onClick={() => handleRemoveOpen(locker.lockerId)} className={styles.remove}>
  												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  										</a>
  						},
  						{value: locker.name},
  						{value: locker.level},
  						{value: locker.combination},
  						{value: locker.note},
  
  				]
  		})
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								Lockers
  						</div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Locker Number`}/>}
  								value={locker.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={locker.name}
  								error={errors.name} />
  						<div>
  								<SelectSingleDropDown
  										id={`level`}
  										name={`level`}
  										label={<L p={p} t={`Position Level`}/>}
  										value={locker.level || ''}
  										options={levels}
  										className={styles.moreBottomMargin}
  										height={`medium`}
  										onChange={handleChange}/>
  						</div>
  						<InputText
  								id={`combination`}
  								name={`combination`}
  								size={"medium"}
  								label={<L p={p} t={`Fixed Combination (optional)`}/>}
  								value={locker.combination || ''}
  								onChange={handleChange} />
  						<InputTextArea
  								label={<L p={p} t={`Note (optional)`}/>}
  								name={'note'}
  								value={locker.note}
  								onChange={handleChange} />
  						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                  <a className={styles.cancelLink} onClick={() => navigate('/schoolSettings')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
  						<hr/>
  						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.lockerSettings}/>
  						<OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this record?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this record?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
        	</div>
      )
}
export default LockerSettingView
