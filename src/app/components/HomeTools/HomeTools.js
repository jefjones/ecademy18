import React from 'react';
import styles from './HomeTools.css';
import classes from 'classnames';
import ToolHeader from '../ToolHeader/ToolHeader.js';
import SiteSearch from '../SiteSearch/SiteSearch.js';
import Badge from '../Badge/Badge.js';

export default ({homeTools=[], className=""}) => {
    return (
        <div className={className}>
            {homeTools.map((section, i) => {

                return (
                    <div key={i} className={styles.headerMargin}>
                        <ToolHeader text={section.section}/>
                        {section.tools.map((tool, d) => {
                            if (tool.type === 'link') {
                                return (
                                    <a key={d} href={tool.url} target={(tool.openUrlInNewWindow ? '_blank' : '')} className={styles.href}>
                                        {tool.text}
                                        {tool.hasCount && <Badge className={styles.badge} count={tool.count}/>}
                                    </a>
                                )
                            } else if (tool.type === 'inputText') {
                                return (
                                    <div key={d}>
                                        <SiteSearch icon={'profilePerson'} placeholder={'Search Church Directory'} className={styles.lessMargin}/>
                                        <a href={tool.url} target={(tool.openUrlInNewWindow ? '_blank' : '')} className={classes(styles.href, styles.rightLink)}>
                                            {tool.linkText}
                                        </a>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={d}>
                                        <br/>
                                        <a href={tool.url} target={(tool.openUrlInNewWindow ? '_blank' : '')} className={classes(styles.href, styles.rightLink)}>
                                            {tool.linkText}
                                        </a>
                                    </div>
                                )
                            }
                        })}
                    </div>
                )
            })}
        </div>
    )
};
