import React from 'react';
import styles from './StandardsRatingColor.css';
import classes from 'classnames';

export default ({label="", id, disabled=false, onClick, replaceClassName, addClassName, keyIndex, name, description, showName, color='#d9d3d4' }) => {
    return (
				<div key={keyIndex} className={styles.rowNowrap}>
						<div data-rh={name && name.length > 50 ? name.substring(0, 50) + '...' : name}
										style={{backgroundColor: color, border: '1px solid', borderColor: 'gray', borderRadius: '15px', width: '22px', height: '22px', outline: 'none'}}>
								<div className={styles.label}>{label === 0 ? '0' : label}</div>
						</div>
						{showName &&
								<div className={classes(styles.text, styles.position)}>{name}</div>
						}
				</div>
    )
};
