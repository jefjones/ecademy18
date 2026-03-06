import React from 'react';
import {Component} from 'react'
import styles from './StatusLegend.css';
import Icon from '../Icon';
import classes from 'classnames';

export default class StatusLegend extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const {opened, toggleOpen, className, headerText, subjectBody} = this.props;

        return (
            <div className={classes(styles.mainContainer, className)}>
                <span onClick={toggleOpen} className={styles.row}>
                    <span className={styles.headerText}>{headerText}</span>
                    <Icon pathName={'chevron_down'} className={opened ? styles.chevronUp : styles.chevronDown} />
                </span>
                {opened &&
                    <div>
                        <div className={opened ? styles.opened : styles.notOpen}>
                            {subjectBody && subjectBody.length > 0 && subjectBody.map((m, i) => (
                                <div className={styles.row} key={i}>
                                    <div className={styles.subject}>{m.subject}</div>
                                    <div className={styles.body}>{m.body}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        )
    }
}
