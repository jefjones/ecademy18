import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './FinanceLowIncomeWaiversView.css'
const p = 'FinanceLowIncomeWaiversView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function FinanceLowIncomeWaiversView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [financeLowIncomeWaiverId, setFinanceLowIncomeWaiverId] = useState('')
  const [financeLowIncomeWaiver, setFinanceLowIncomeWaiver] = useState({
        name: '',
				description: '',
				percentWaived: '',
      })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [percentWaived, setPercentWaived] = useState('')
  const [errors, setErrors] = useState({
				name: '',
				description: '',
				percentWaived: '',
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedCount, setIsShowingModal_usedCount] = useState(true)

  const {financeLowIncomeWaivers, fetchingRecord} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`% Waived`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (financeLowIncomeWaivers && financeLowIncomeWaivers.length > 0) {
          data = financeLowIncomeWaivers.map(m => {
              return ([
  							{value: m.name && <a onClick={() => handleEdit(m.financeLowIncomeWaiverId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.name && <a onClick={() => handleRemoveItemOpen(m.financeLowIncomeWaiverId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.percentWaived},
  							{value: m.description},
                {value: m.usedCount},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Finance Low Income Waivers`}/>
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={financeLowIncomeWaiver.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeLowIncomeWaiver.name}
  								error={errors.name} />
  						<InputText
  								id={`description`}
  								name={`description`}
  								size={"long"}
  								label={<L p={p} t={`Description`}/>}
  								value={financeLowIncomeWaiver.description || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeLowIncomeWaiver.description}
  								error={errors.description}/>
  						<InputText
  								id={`percentWaived`}
  								name={`percentWaived`}
  								size={"super-short"}
  								numberOnly={true}
  								maxNumber={100}
  								label={<L p={p} t={`% Waived`}/>}
  								value={financeLowIncomeWaiver.percentWaived || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={financeLowIncomeWaiver.percentWaived}
  								error={errors.percentWaived} />
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={reset}><L p={p} t={`Reset`}/></div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeLowIncomeWaiverSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this finance low income waiver?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this finance low income waiver?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedCount &&
                  <MessageModal handleClose={handleShowUsedCountClose} heading={<L p={p} t={`This Finance Low Income Waiver is in Use`}/>}
  										explainJSX={<L p={p} t={`A finance low income waiver cannot be deleted once it has been used`}/>}
  										onClick={handleShowUsedCountClose}/>
              }
        </div>
      )
}
export default FinanceLowIncomeWaiversView
