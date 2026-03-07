import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as styles from './FinancePaymentTypesView.css'
const p = 'FinancePaymentTypesView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function FinancePaymentTypesView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [financePaymentTypeId, setFinancePaymentTypeId] = useState('')
  const [financePaymentType, setFinancePaymentType] = useState({
        name: '',
				description: '',
      })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
				name: '',
				description: '',
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedCount, setIsShowingModal_usedCount] = useState(true)

  const {financePaymentTypes, fetchingRecord} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (financePaymentTypes && financePaymentTypes.length > 0) {
          data = financePaymentTypes.map(m => {
              return ([
  							{value: m.name && <a onClick={() => handleEdit(m.financePaymentTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.name && <a onClick={() => handleRemoveItemOpen(m.financePaymentTypeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.description},
                {value: m.usedCount},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Finance Payment Type`}/>
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={financePaymentType.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financePaymentType.name}
  								error={errors.name} />
  						<InputText
  								id={`description`}
  								name={`description`}
  								size={"long"}
  								label={<L p={p} t={`Description`}/>}
  								value={financePaymentType.description || ''}
  								onChange={handleChange} />
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={reset}><L p={p} t={`Reset`}/></div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financePaymentTypeSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this finance payment type?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this finance payment type?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedCount &&
                  <MessageModal handleClose={handleShowUsedCountClose} heading={<L p={p} t={`This Finance Payment Type is in Use`}/>}
  										explainJSX={<L p={p} t={`A finance payment type cannot be deleted once it has been used`}/>}
  										onClick={handleShowUsedCountClose}/>
              }
        </div>
      )
}
export default FinancePaymentTypesView
