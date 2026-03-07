import { useState } from 'react'
import * as styles from './JefFeatureDisplay.css'
import Icon from '../Icon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function JefFeatureDisplay(props) {
  const [showVideos, setShowVideos] = useState(false)
  const [showScreenshots, setShowScreenshots] = useState(false)

  const toggleFile = (type) => {
    
    				if (type === 'Video') {
    						setShowVideos(!showVideos)
    				} else if (type === 'Screenshot') {
    						setShowScreenshots(!showScreenshots)
    				}
    		
  }

  const {keyIndex, onSelect, checked, feature={}} = props
  				
  
  				let mainVideo = feature.videos && feature.videos.length > 0 && feature.videos.filter(m => m.mainFile)[0]
  				let mainVideoUrl = mainVideo && mainVideo.fileUrl
  				let mainScreenshot = feature.screenshots && feature.screenshots.length > 0 && feature.screenshots.filter(m => m.mainFile)[0]
  				let mainScreenshotUrl = mainScreenshot && mainScreenshot.fileUrl
  
      		return (
  						<div key={keyIndex} className={styles.container}>
  								<div className={styles.row}>
  										<div className={styles.moreRight}>
  												<input type="checkbox" checked={checked} onChange={() => {}}  className={styles.checkbox} onClick={onSelect}/>
  										</div>
  										<div>
  												<div className={styles.title}>{feature.name}</div>
  												<div className={styles.description}>{feature.description}</div>
  										</div>
  										<div className={styles.moreLeft}>
  												<div onClick={feature.videos && feature.videos.length > 0 ? () => toggleFile('Video') : () => {}}
  																className={feature.videos && feature.videos.length > 0 ? styles.cursor : ''}
  																data-rh={feature.videos && feature.videos.length > 0 ? 'click here to see demo videos' : 'no demo videos available'}>
  														<div className={classes(styles.demoText, (feature.videos && feature.videos.length > 0 ? '' : styles.noDisplay))}><L p={p} t={`VIDEOS`}/></div>
  														<div className={classes(styles.moreBottom, (feature.videos && feature.videos.length > 0 ? '' : styles.noDisplay))}>
  																{mainVideoUrl &&
  																		<a href={mainVideoUrl} target={'_video'} className={classes(styles.row, styles.noUnderline)}>
  																				<Icon pathName={'presentation'} premium={true} className={styles.bigIcon} />
  																				<div className={styles.count}>{(feature.videos && feature.videos.length) || '0' }</div>
  																		</a>
  																}
  																{!mainVideoUrl &&
  																		<div className={styles.row}>
  																				<Icon pathName={'presentation'} premium={true} className={styles.bigIcon} />
  																				<div className={styles.count}>{(feature.videos && feature.videos.length) || '0' }</div>
  																		</div>
  																}
  														</div>
  												</div>
  												<div onClick={feature.screenshots && feature.screenshots.length > 0 ? () => toggleFile('Screenshot') : () => {}}
  																className={feature.screenshots && feature.screenshots.length > 0 ? styles.cursor : ''}
  																data-rh={feature.screenshots && feature.screenshots.length > 0 ? 'click here to see screenshots' : 'no screenshots available'}>
  														<div className={classes(styles.demoText, (feature.screenshots && feature.screenshots.length > 0 ? '' : styles.noDisplay))}>SCREEN</div>
  														<div className={classes(styles.demoText, (feature.screenshots && feature.screenshots.length > 0 ? '' : styles.noDisplay))}>SHOTS</div>
  														<div className={feature.screenshots && feature.screenshots.length > 0 ? '' : styles.noDisplay}>
  																{mainScreenshotUrl &&
  																		<a href={mainScreenshotUrl} target={'_video'} className={classes(styles.row, styles.noUnderline)}>
  																				<Icon pathName={'picture'} premium={true} className={styles.bigIcon} />
  																				<div className={styles.count}>{(feature.screenshots && feature.screenshots.length) || '0' }</div>
  																		</a>
  																}
  																{!mainScreenshotUrl &&
  																		<div className={classes(styles.row, styles.noUnderline)}>
  																				<Icon pathName={'picture'} premium={true} className={styles.bigIcon} />
  																				<div className={styles.count}>{(feature.screenshots && feature.screenshots.length) || '0' }</div>
  																		</div>
  																}
  														</div>
  												</div>
  										</div>
  								</div>
  								{showVideos && feature.videos && feature.videos.length > 0 && feature.videos.map((m, i) =>
  										<div key={i}>
  												{i === 0 &&
  														<div className={styles.subHeader}>{feature.videos.length === 1 ? <L p={p} t={`Video Tutorial`}/> : <L p={p} t={`Video Tutorials`}/>}</div>
  												}
  												<div key={i}>
  														<a className={styles.description} href={m.fileUrl} target={`_video${i}`}>{m.description}</a>
  												</div>
  										</div>
  								)}
  								{showScreenshots && feature.screenshots && feature.screenshots.length > 0 && feature.screenshots.map((m, i) =>
  										<div key={`100${i}`}>
  												{i === 0 &&
  														<div className={styles.subHeader}>{feature.screenshots.length === 1 ? <L p={p} t={`Screenshot`}/> : <L p={p} t={`Screenshot`}/>}</div>
  												}
  												<div key={i}>
  														<a className={styles.description} href={m.fileUrl} target={`_screenshot${i}`}>{m.description}</a>
  												</div>
  										</div>
  								)}
  						</div>
  		    )
}
export default JefFeatureDisplay
