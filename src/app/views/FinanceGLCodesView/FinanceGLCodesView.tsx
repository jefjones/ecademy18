import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './FinanceGLCodesView.css'
const p = 'FinanceGLCodesView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function FinanceGLCodesView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [financeGlcodeId, setFinanceGlcodeId] = useState('')
  const [financeGLCode, setFinanceGLCode] = useState({
				code: '',
				name: '',
        description: '',
      })
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
				code: '',
				name: '',
        description: '',
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedCount, setIsShowingModal_usedCount] = useState(true)

  const {financeGLCodes, fetchingRecord} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Code`}/>, tightText: true},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (financeGLCodes && financeGLCodes.length > 0) {
          data = financeGLCodes.map(m => {
              return ([
  							{value: m.name && <a onClick={() => handleEdit(m.financeGlcodeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.name && <a onClick={() => handleRemoveItemOpen(m.financeGlcodeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.code},
  							{value: m.name},
  							{value: m.description},
                {value: m.usedCount},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Finance GL Codes`}/>
              </div>
  						<InputText
  								id={`code`}
  								name={`code`}
  								size={"short"}
  								label={<L p={p} t={`Code`}/>}
  								value={financeGLCode.code || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeGLCode.code}
  								error={errors.code} />
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={financeGLCode.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeGLCode.name}
  								error={errors.name} />
  						<InputText
  								id={`description`}
  								name={`description`}
  								size={"long"}
  								label={<L p={p} t={`Description`}/>}
  								value={financeGLCode.description || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeGLCode.description}
  								error={errors.description} />
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={reset}><L p={p} t={`Reset`}/></div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeGLCodeSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this finance GL code?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this finance GL code?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedCount &&
                  <MessageModal handleClose={handleShowUsedCountClose} heading={<L p={p} t={`This Finance GL Code is in Use`}/>}
  										explainJSX={<L p={p} t={`A finance GL code cannot be deleted once it has been used`}/>}
  										onClick={handleShowUsedCountClose}/>
              }
        </div>
      )
}
export default FinanceGLCodesView
