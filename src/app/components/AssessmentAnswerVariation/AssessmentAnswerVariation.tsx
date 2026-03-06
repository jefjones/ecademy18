import { useState } from 'react'
import styles from './AssessmentAnswerVariation.css'
import classes from 'classnames'
import InputText from '../InputText'
import EditTable from '../EditTable'
import MessageModal from '../MessageModal'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function AssessmentAnswerVariation(props) {
  const [answerVariation, setAnswerVariation] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)

  const {className="", answerVariations } = props
  			
  
  			let headings = [{},{}]
  
  			let data = answerVariations && answerVariations.length > 0 && answerVariations.map((variation, i) =>
  					[
  							{ value: <div onClick={() => handleRemoveOpen(i)}>
  											 		 <Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
  											 </div>
  							 },
  							 { value: <div className={styles.label}>{variation}</div> },
  					]
  			)
  
  			data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}><L p={p} t={`No answer variations entered`}/></div>, colSpan: 4}]]
  
        return (
            <div className={classes(className, styles.container)}>
  							<div className={styles.row}>
  									<InputText
  											id={`answerVariation`}
  											name={`answerVariation`}
  											size={"medium-long"}
  											onEnterKey={handleEnterKey}
  											label={<L p={p} t={`Answer variation`}/>}
  											instructionsBelow={true}
  											value={answerVariation || ''}
  											instructions={<L p={p} t={`Case is already ignored and please do not use punctuation.`}/>}
  											onChange={changeItem}/>
  									<div className={classes(styles.link, styles.row, styles.topPosition)} onClick={handleAddAnswerVariation}>
  											<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
  											<div className={styles.moreTop}><L p={p} t={`Add`}/></div>
  									</div>
  							</div>
  							<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
  								{isShowingModal_remove &&
  		                <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this answer variation?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to remove this answer variation?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveSave} />
  		            }
            </div>
        )
}
export default AssessmentAnswerVariation
