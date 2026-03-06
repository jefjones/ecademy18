import React, {Component} from 'react';
import styles from './ContextKnowledgeRating.css';
import StandardsRatingColor from '../StandardsRatingColor';
import classes from 'classnames';

export default class ContextKnowledgeRating extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    render() {
        const {className, onClick, studentPersonId, assignmentId, standardsRatings} = this.props;

        return (
            <div className={classes(styles.container, className, styles.rowWrap)}>
                {standardsRatings && standardsRatings.length > 0 && standardsRatings.map((m, i) =>
                    <div key={i} onClick={() => onClick(studentPersonId, assignmentId, i+1*1)} className={styles.space}>
                        <StandardsRatingColor label={m.levelAbbrev} color={m.color} description={m.description} showName={false} name={m.name}/>
                    </div>
                )}
            </div>
        )
    }
};
