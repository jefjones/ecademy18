import * as styles from './AudioDisplay.css'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({className, src, preload="auto", controls="controls", browserMessage,
								  deleteFunction, fileUploadId, isOwner, isSmall }) => {
    return (
        <div className={styles.container}>
						<audio src={src} preload={preload} controls={controls} className={classes((isSmall ? styles.small : ''), className)} >
							 {!browserMessage && <L p={p} t={`This browser does not support this audio control`}/>}
							 {browserMessage}
						</audio>
            {isOwner && deleteFunction &&
								<div onClick={deleteFunction} className={styles.remove}>
                    remove
                </div>
						}
        </div>
    )
}
