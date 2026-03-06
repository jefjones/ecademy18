import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import styles from './FinanceFeeTypesView.css'
const p = 'FinanceFeeTypesView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import InputDataList from '../../components/InputDataList'
import TextDisplay from '../../components/TextDisplay'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import RadioGroup from '../../components/RadioGroup'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function FinanceFeeTypesView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [financeFeeTypeId, setFinanceFeeTypeId] = useState('')
  const [financeFeeType, setFinanceFeeType] = useState({
        name: '',
				description: '',
				refundType: '',
				schoolYears: '',
				financeGlcodeId: '',
				financeLowIncomeWaiverId: '',
      })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [refundType, setRefundType] = useState('')
  const [schoolYears, setSchoolYears] = useState('')
  const [financeGlcodeId, setFinanceGlcodeId] = useState('')
  const [financeLowIncomeWaiverId, setFinanceLowIncomeWaiverId] = useState('')
  const [errors, setErrors] = useState({
				name: '',
				description: '',
				schoolYears: '',
				refundType: '',
      })
  const [isShowingModal_usedCount, setIsShowingModal_usedCount] = useState(true)
  const [selectedSchoolYears, setSelectedSchoolYears] = useState('')

  const {financeFeeTypes, fetchingRecord, schoolYears, financeGLCodes, financeLowIncomeWaivers, refundOptions} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  			{label: <L p={p} t={`Refund type`}/>, tightText: true},
  			{label: <L p={p} t={`GL code`}/>, tightText: true},
  			{label: <L p={p} t={`Low income waiver`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true},
        {label: <L p={p} t={`School years`}/>, tightText: true},
  		]
  
      let data = []
  
      if (financeFeeTypes && financeFeeTypes.length > 0) {
          data = financeFeeTypes.map(m => {
  						let refundType = refundOptions && refundOptions.length > 0 && refundOptions.filter(r => r.id === m.refundType)[0]
  						let refundTypeName = (refundType && refundType.label) ? refundType.label : ''
  						let financeGLCode = financeGLCodes && financeGLCodes.length > 0 && financeGLCodes.filter(r => r.id === m.financeGlcodeId)[0]
  						let financeGLCodeName  = (financeGLCode && financeGLCode.label) ? financeGLCode.label : ''
  						let financeLowIncomeWaiver = financeGLCodes && financeGLCodes.length > 0 && financeGLCodes.filter(r => r.id === m.financeGlcodeId)[0]
  						let financeLowIncomeWaiverName  = (financeLowIncomeWaiver && financeLowIncomeWaiver.label) ? financeLowIncomeWaiver.label : ''
  
              return ([
  							{value: m.name && !m.isLunch && !m.isCredit && !m.isCourse && <a onClick={() => handleEdit(m.financeFeeTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.name && !m.isLunch && !m.isCredit && !m.isCourse && <a onClick={() => handleRemoveItemOpen(m.financeFeeTypeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.description},
  							{value: refundTypeName },
  							{value: financeGLCodeName },
  							{value: financeLowIncomeWaiverName },
                {value: m.usedCount},
                {value: m.schoolYears && m.schoolYears.length > 0 && m.schoolYears.reduce((acc, m) => acc += (acc && acc.length > 0 && ', ') + m.name, '')},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Finance Fee Type`}/>
              </div>
  						{(financeFeeType.isLunch || financeFeeType.isCredit || financeFeeType.isCourse)
  								? <TextDisplay label={<L p={p} t={`Name`}/>} text={financeFeeType.name} className={styles.noLeftMargin}/>
  								: <InputText
  											id={`name`}
  											name={`name`}
  											size={"medium-short"}
  											label={<L p={p} t={`Name`}/>}
  											value={financeFeeType.name || ''}
  											onChange={handleChange}
  											required={true}
  											whenFilled={financeFeeType.name}
  											error={errors.name} />
  						}
  						<InputText
  								id={`description`}
  								name={`description`}
  								size={"long"}
  								label={<L p={p} t={`Description`}/>}
  								value={financeFeeType.description || ''}
  								onChange={handleChange} />
  						<div className={styles.row}>
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
  												disabled={(financeFeeType.isLunch || financeFeeType.isCredit || financeFeeType.isCourse)}
  												required={true}
  												whenFilled={selectedSchoolYears && selectedSchoolYears.length > 0}
  												error={errors.schoolYears}/>
  								</div>
  								<div className={classes(styles.moreTop, globalStyles.instructionsBigger)}>
  										<br/>
  										<L p={p} t={`For which year or years this fee is available for use`}/>
  								</div>
  						</div>
  						<div className={styles.moreTop}>
  								<RadioGroup
  										label={<L p={p} t={`Refund option`}/>}
  										data={refundOptions}
  										name={`refundType`}
  										horizontal={false}
  										className={styles.radio}
  										initialValue={financeFeeType.refundType}
  										onClick={handleRadioChoice}
  										required={true}
  										whenFilled={financeFeeType.refundType}
  										error={errors.refundType}/>
  						</div>
  						<hr/>
  						<div className={styles.row}>
  								<div>
  										<div>
  													<SelectSingleDropDown
  															id={`financeGlcodeId`}
  															name={`financeGlcodeId`}
  															label={<L p={p} t={`GL code`}/>}
  															value={financeFeeType.financeGlcodeId || ''}
  															options={financeGLCodes}
  															className={styles.moreBottomMargin}
  															height={`medium`}
  															onChange={handleChange}/>
  											</div>
  											<div>
  													<SelectSingleDropDown
  															id={`financeLowIncomeWaiverId`}
  															name={`financeLowIncomeWaiverId`}
  															label={<L p={p} t={`Low income waiver`}/>}
  															value={financeFeeType.financeLowIncomeWaiverId || ''}
  															options={financeLowIncomeWaivers}
  															className={styles.moreBottomMargin}
  															height={`medium`}
  															onChange={handleChange}/>
  											</div>
  								</div>
  								<div className={classes(styles.moreTop, globalStyles.instructionsBigger, styles.maxWidth)}>
  										<L p={p} t={`If the GL Code or low income waivers are always the same for this fee, you can choose them here.`}/>
  										<L p={p} t={`Otherwise, you can leave them blank and let the user choose them when entering the billing for this fee type.`}/>
  								</div>
  						</div>
  						<hr/>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
  								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={reset}><L p={p} t={`Reset`}/></div>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeFeeTypeSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this finance fee type?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this finance fee type?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedCount &&
                  <MessageModal handleClose={handleShowUsedCountClose} heading={<L p={p} t={`This Finance Fee Type is in Use`}/>}
  										explainJSX={<L p={p} t={`A finance fee type cannot be deleted once it has been used`}/>}
  										onClick={handleShowUsedCountClose}/>
              }
        </div>
      )
}
export default FinanceFeeTypesView
