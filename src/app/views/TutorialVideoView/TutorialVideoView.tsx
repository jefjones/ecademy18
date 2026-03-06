import { useState } from 'react'
import styles from './TutorialVideoView.css'
const p = 'TutorialVideoView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import RadioGroup from '../../components/RadioGroup'
import OneFJefFooter from '../../components/OneFJefFooter'
import ReactPlayer from 'react-player'
import classes from 'classnames'

function TutorialVideoView(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [tutorial, setTutorial] = useState('')

  const {tutorialVideos=[], tutorialLabel} = props
  			
  
  			let tutorial = (tutorialVideos.length > 0 && tutorialVideos.filter(m => m.tutorialVideoId === tutorialVideoId || m.label === tutorialLabel)[0]) || {}
  
      	return (
  	        <div className={styles.container}>
  	            <div className={classes(styles.moreBottom, globalStyles.pageTitle)}>
  	                <L p={p} t={`Tutorial Video`}/>
  	            </div>
  							<div className={classes(styles.moreLeft, styles.moreTop)}>
  									<RadioGroup
  											data={tutorialVideos || []}
  											label={<L p={p} t={`Choose a tutorial video`}/>}
  											name={`tutorial`}
  											className={styles.radio}
  											initialValue={(tutorial && tutorial.tutorialVideoId) || ''}
  											onClick={handleTutorial}/>
  							</div>
  							<hr/>
  							<ReactPlayer url={tutorial.fileUrl} controls={true} playing={false} />
  	            <OneFJefFooter />
  	      	</div>
        )
}
export default TutorialVideoView
