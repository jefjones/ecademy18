import React from 'react';
import styles from './FlexColumn.css';

export default ({heading="", data}) => {
    return (
				<div>
						<div className={styles.header}>{heading}</div>
						<div className={styles.info}>{data}</div>
				</div>
    )
};
