import { useState } from 'react'
import styles from './GradRequirementAccordion.css'
import globalStyles from '../../utils/globalStyles.css'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import GraduationRequirements from '../../components/GraduationRequirements'
import Slider from 'rc-slider'
import Icon from '../Icon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function GradRequirementAccordion(props) {
  const [isShowingModal, setIsShowingModal] = useState(undefined)
  const [expanded, setExpanded] = useState(undefined)
  const [isOpen, setIsOpen] = useState(undefined)

  const handleModalOpen = () => {
    return setIsShowingModal(true)
  }

  const handleModalClose = () => {
    return setIsShowingModal(false)
  }

  const {personId, gradRequirements } = props
      
  
  		let requiredTotal = 0
  		let completedOrInProgress = 0
  		gradRequirements && gradRequirements.length > 0 && gradRequirements.forEach(m => {
  				requiredTotal += m.creditsRequired
  				completedOrInProgress += m.creditsEarnedOrInProgress
  		})
  		let percentComplete = !requiredTotal ? 0 : Math.round(completedOrInProgress/requiredTotal*100)
  
      return (
          <div className={styles.container}>
  						<Accordion expanded={expanded} onClick={handleExpansionChange}>
  								<AccordionSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
  										<div className={classes(styles.row, styles.graduationHeader)}>
  												<Icon pathName={'graduation_hat'} className={styles.iconHigher} premium={true}/>
  												<span className={styles.header}><L p={p} t={`Graduation Status`}/></span>
  												<Slider step={5} disabled={true} value={percentComplete} marks={{[percentComplete]: `${percentComplete}%` }}/>
                          <div className={classes(globalStyles.link, styles.showDetails)}><L p={p} t={`Show details`}/></div>
  										</div>
  								</AccordionSummary>
  								<AccordionDetails>
  										<GraduationRequirements  personId={personId} requirements={gradRequirements} setContentAreaFilter={setContentAreaFilter}
  												emptyMessage={<L p={p} t={`No graduation requirements found`}/>} handleExpansionChange={handleExpansionChange} expanded={expanded}/>
  								</AccordionDetails>
  						</Accordion>
          </div>
      )
}
export default GradRequirementAccordion
