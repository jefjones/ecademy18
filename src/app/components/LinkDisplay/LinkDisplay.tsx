import * as styles from './LinkDisplay.css'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

//This is used both for file uploads as well as website links.  If there is a fileUploadId, then the deleteFunction will send that back, otherwise it sends back the given element of the links list.

export default ({linkText, label, className, url, isWebsiteLink, deleteFunction, deleteId, fileUploadId, isOwner}) => {
  	linkText = isWebsiteLink && linkText && linkText.length > 0 && linkText.toLowerCase().indexOf('http') === -1 ? 'http://' + linkText : linkText

    return (
        <div className={classes(styles.container, className)}>
            <div className={classes(styles.topMargin, styles.row)}>
                <a href={isWebsiteLink ? linkText : url} className={styles.linkText} target="_blank">
                    {linkText}
                </a>
                {isOwner &&
										<div onClick={deleteFunction} className={styles.remove}>
		                    <L p={p} t={`remove`}/>
		                </div>
								}
            </div>
        </div>
    )
}
