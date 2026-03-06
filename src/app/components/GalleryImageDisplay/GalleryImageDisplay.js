import React, {Component} from 'react';
import styles from './GalleryImageDisplay.css';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class GalleryImageDisplay extends Component {
  constructor(props) {
      super(props);

      this.state = {
			}
	}

	render() {
			const {className, url, deleteFunction, isOwner, onClick, keyIndex, description} = this.props;

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
}
