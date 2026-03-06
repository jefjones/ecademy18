import { useState } from 'react'
import styles from './GradingRatingLegend.css'
import globalStyles from '../../utils/globalStyles.css'
import StandardsRatingColor from '../StandardsRatingColor'
import MessageModal from '../MessageModal'
import Icon from '../Icon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function GradingRatingLegend(props) {
  const [isShowingModal, setIsShowingModal] = useState(true)
  const [showJSX, setShowJSX] = useState('')

  const {gradingType} = props
  				
  
  		    return (
  		        <div className={classes(styles.container, styles.row)} onClick={handleOpen}>
  										<Icon pathName={'document0'} premium={true} className={styles.icon} />
  										<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Show the standards grading legend`}/></div>
  								{isShowingModal &&
  										<MessageModal handleClose={handleClose} heading={gradingType === 'STANDARDSRATING' ? <L p={p} t={`Standards Based Rating`}/> : <L p={p} t={`Pass or Fail Rating`}/>}
  											 explainJSX={showJSX} onClick={handleClose} />
  								}
  		        </div>
  		    )
}
export default GradingRatingLegend
