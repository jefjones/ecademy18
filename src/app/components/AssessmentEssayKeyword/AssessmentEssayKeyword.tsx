import { useState } from 'react'
import * as styles from './AssessmentEssayKeyword.css'
import classes from 'classnames'
import InputText from '../InputText'
import EditTable from '../EditTable'
import MessageModal from '../MessageModal'
import SelectSingleDropDown from '../SelectSingleDropDown'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function AssessmentEssayKeyword(props) {
  const [keywordPhrase, setKeywordPhrase] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)

  const {className="", keywordPhrases, updateKeywordCountAccuracy, keywordCountAccuracy } = props
  			
  
  			let headings = [{},{}]
  
  			let data = keywordPhrases && keywordPhrases.length > 0 && keywordPhrases.map((keyPhrase, i) =>
  					[
  							{ value: <div onClick={() => handleRemoveOpen(i)}>
  											 		 <Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
  											 </div>
  							 },
  							 { value: <div className={styles.label}>{keyPhrase}</div> },
  					]
  			)
  
  			data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}><L p={p} t={`No keywords or phrases entered`}/></div>, colSpan: 4}]]
  
  			let keywordCounts = keywordPhrases && keywordPhrases.length > 0 && keywordPhrases.map((acc, i) => (
  					{ id: i+1, label: i+1 }
  			))
  
        return (
            <div className={classes(className, styles.container)}>
  							<div className={styles.instructions}>
  									<L p={p} t={`If you enter at least one keyword or phrase and choose at least one keyword count for grading, then this essay will be graded automatically.  Otherwise, grading will need to be done manually.`}/>
  							</div>
  							<div className={styles.row}>
  									<InputText
  											id={`keywordPhrase`}
  											name={`keywordPhrase`}
  											size={"medium-long"}
  											onEnterKey={handleEnterKey}
  											label={<L p={p} t={`Keyword`}/>}
  											instructionsBelow={true}
  											value={keywordPhrase || ''}
  											onChange={changeItem}/>
  									<div className={classes(styles.link, styles.row, styles.topPosition)} onClick={handleAddKeywordPhrase}>
  											<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
  											<div className={styles.moreTop}>{<L p={p} t={`Add`}/>}</div>
  									</div>
  							</div>
  							<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
  							{data && data.length > 0 &&
  									<div>
  											<SelectSingleDropDown
  													id={`keywordCountAccuracy`}
  													name={`keywordCountAccuracy`}
  													label={<L p={p} t={`How many keywords does the student need to enter to get full credit?`}/>}
  													value={keywordCountAccuracy || ''}
  													options={keywordCounts}
  													className={styles.moreBottomMargin}
  													height={`short`}
  													onChange={updateKeywordCountAccuracy}/>
  										</div>
  								}
  								{isShowingModal_remove &&
  		                <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this keyword or phrase?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to remove this keyword or phrase?`}/>} isConfirmType={true}
  		                   onClick={handleRemoveSave} />
  		            }
            </div>
        )
}
export default AssessmentEssayKeyword
