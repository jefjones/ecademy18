import React from 'react';
import styles from './ToolHeader.css';
import classes from 'classnames';

export default ({text="", align="left", className=""}) => {
    return (
        <div className={styles.text}>
            {text}
        </div>
    )
};
