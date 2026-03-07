
import * as styles from './ImageDisplay.css'
import classes from 'classnames'
import Iframe from 'react-iframe'
const p = 'component'
import L from '../../components/PageLanguage'

function ImageDisplay(props) {
  const {className, url, deleteFunction, isOwner, onClick, keyIndex} = props
  
    			// let {linkText} = props;
    			//
    	  	// linkText = isWebsiteLink && linkText && linkText.length > 0 && linkText.toLowerCase().indexOf('http') === -1 ? 'http://' + linkText : linkText;
  
    			let isImage = url && url.length > 0 &&
    					 (url.toLowerCase().indexOf('.jpg') > -1 ||
    						url.toLowerCase().indexOf('.jpeg') > -1 ||
    						url.toLowerCase().indexOf('.tiff') > -1 ||
    						url.toLowerCase().indexOf('.gif') > -1 ||
    						url.toLowerCase().indexOf('.png') > -1 ||
    						url.toLowerCase().indexOf('.bmp') > -1)
  
  
    	    return (
    	        <div className={classes(styles.container, className)} onClick={onClick} key={keyIndex}>
    	            <div className={classes(styles.topMargin, styles.row)}>
    									{isImage && <img src={url} alt={<L p={p} t={`Uploaded file`}/>}  styles={{width:'20px'}}/>}
    									{!isImage && url && url.length > 0 &&
    											<div className={styles.horizontalScroll}>
    													<Iframe url={url && url.length > 0 && (url.toLowerCase().indexOf('.doc') > -1 || url.toLowerCase().indexOf('.odt') > -1)
    																	? `https://view.officeapps.live.com/op/view.aspx?src=${url}`
    																	: url}
    															min-width='100px'
    															min-height='50px'
                                  height='auto'
    															display="initial"
    															position="relative"
    															allowFullScreen/>
    											</div>
    									}
    	                {isOwner && deleteFunction && url && url !== 'unknown' &&
    											<div onClick={deleteFunction} className={styles.remove}>
    			                    <L p={p} t={`remove`}/>
    			                </div>
    									}
    	            </div>
    	        </div>
    	    )
}
export default ImageDisplay
