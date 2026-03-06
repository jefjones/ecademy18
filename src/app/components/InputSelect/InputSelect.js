import React from 'react';
import styles from './InputSelect.css';
import classNames from 'classnames';

export default ({label, id, onChange, value, error, options, height, className=""}) => (
    <div className={className}>
        <label htmlFor={id} className={styles.labelText}>{label}</label>
        <div>
            <select
                id={id}
                name={id}
                value={value}
                onChange={(event) => onChange(event)}
                className={classNames(styles.editControl, styles[`size${height}`])}
            >
                <option value={"- -"}>
                </option>
                {options.map((option) => {
                        return <option value={option.id}>{option.label}</option>;
                    })
                }
            </select>
            {error && <div className={styles.alertMessage}>{error}</div>}
        </div>
    </div>
);
