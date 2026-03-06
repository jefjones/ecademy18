import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './PaddleLockSettingView.css'
import InputText from '../../components/InputText'
import OneFJefFooter from '../../components/OneFJefFooter'
import Icon from '../../components/Icon'
import classes from 'classnames'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import EditTable from '../../components/EditTable'

function PaddleLockSettingView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [paddlelock, setPaddlelock] = useState({
						paddlelockId:'',
						serialNumber: '',
						combination: '',
					})
  const [paddlelockId, setPaddlelockId] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [combination, setCombination] = useState('')
  const [errors, setErrors] = useState({
						serialNumber:'',
					})

  const {paddlelocks=[], fetchingRecord} = props
  		const {paddlelock={}, errors, isShowingModal_remove} = state
  
  		let headings = [{},{},
  				{label: <L p={p} t={`Serial #`}/>, tightText: true},
  				{label: <L p={p} t={`Combination`}/>, tightText: true},
  		]
  		let data = paddlelocks && paddlelocks.length > 0 && paddlelocks.map(m => {
  				return [
  						{value: <div onClick={() => getRecord(m)}>
  												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  										</div>
  						},
              {value: <a onClick={() => handleRemoveOpen(m.paddlelockId)} className={styles.remove}>
                          <Icon pathName={'trash2'} premium={true} className={styles.icon}/>
                      </a>
  						},
  						{value: m.serialNumber},
  						{value: m.combination},
  
  				]
  		})
  
      return (
          <div className={styles.container}>
  						<div className={globalStyles.pageTitle}>
  								<L p={p} t={`Padlocks`}/>
  						</div>
  						<InputText
  								id={`serialNumber`}
  								name={`serialNumber`}
                  maxLength={15}
  								size={"medium"}
  								label={<L p={p} t={`Serial Number`}/>}
  								value={paddlelock.serialNumber || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={paddlelock.serialNumber}
  								error={errors.serialNumber} />
  						<InputText
  								id={`combination`}
  								name={`combination`}
                  maxLength={15}
  								size={"medium"}
  								label={<L p={p} t={`Combination`}/>}
  								value={paddlelock.combination || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={paddlelock.name}
  								error={errors.name} />
  						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                  <a className={styles.cancelLink} onClick={() => navigate('/schoolSettings')}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'}
  										onClick={processForm}/>
              </div>
  						<hr/>
  						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.paddlelockSettings}/>
  						<OneFJefFooter />
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this record?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this record?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
        	</div>
      )
}
export default PaddleLockSettingView
