import React, {Component} from 'react';
import styles from './ImageDisplay.css';
import classes from 'classnames';
import Iframe from 'react-iframe'
const p = 'component';
import L from '../../components/PageLanguage';

export default class ImageDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
  			}
  	}

  	fileTypeDisplay = () => {
  			const {clickedUrl} = this.props;
  			let fileName = clickedUrl && clickedUrl.label && clickedUrl.label.toLowerCase();
  			if (clickedUrl.isTextResponse) {
  					return <L p={p} t={`Plain text`}/>;
  			} else if (fileName) {
  					if (fileName.indexOf('.doc') > -1) {
  							return <L p={p} t={`Microsoft Word document`}/>;
  					} else if (fileName.indexOf('.pdf') > -1) {
  							return <L p={p} t={`Adobe PDF file`}/>;
  					} else if (fileName.indexOf('.odt') > -1) {
  							return <L p={p} t={`Open Office document`}/>;
  					} else if (fileName.indexOf('.jpg') > -1 || fileName.indexOf('.jpeg') > -1 || fileName.indexOf('.tif') > -1 || fileName.indexOf('.gif') > -1 || fileName.indexOf('.png') > -1 || fileName.indexOf('.bmp') > -1) {
  							return <L p={p} t={`Image file`}/>;
  					} else if (fileName.indexOf('docs.google') > -1) {
  							return <L p={p} t={`Google Docs (If you see a blank view area, you probably have not been given access to view the file.)`}/>;
  					}
  			}
  			return 'Unknown';
  	}

  	render() {
  			const {className, url, deleteFunction, isOwner, onClick, keyIndex} = this.props;

  			// let {linkText} = this.props;
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
}
