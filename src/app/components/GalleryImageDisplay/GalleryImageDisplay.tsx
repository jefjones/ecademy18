
import * as styles from './GalleryImageDisplay.css'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function GalleryImageDisplay(props) {
  const {className, url, deleteFunction, isOwner, onClick, keyIndex, description} = props
  
  	    return (
  	        <div className={classes(styles.container, className)} onClick={onClick} key={keyIndex}>
  	            <div className={styles.row}>
                    <img src={url} max-width='250px' alt={'missing'}/>
  	                {isOwner && deleteFunction && url && url !== 'unknown' &&
  											<div onClick={deleteFunction} className={styles.remove}>
  			                    <L p={p} t={`remove`}/>
  			                </div>
  									}
                    <div>{description}</div>
  	            </div>
  	        </div>
  	    )
}
export default GalleryImageDisplay
