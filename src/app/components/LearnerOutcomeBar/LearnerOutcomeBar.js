import React, {Component} from 'react';
import styles from './LearnerOutcomeBar.css';
import classes from 'classnames';

export default class LearnerOutcomeBar extends Component {
    constructor(props) {
      super(props);

      this.state = {
      }
    }

    handleChange = (event) => {
        this.setState({ theText: event.target.value });
    }

    render() {
      const {rating} = this.props;
      //'proficient' is 1, 'inProgress' is 2, 'notStarted' is 3

      return (
        <div className={classes(styles.container)}>
            {rating && rating.length > 0 && rating.map((m, i) =>
                <div key={i} className={classes(styles.sliver, m.value === 1 ? styles.proficient : m.value === 2 ? styles.inProgress : styles.notStarted)}></div>
            )}
        </div>
      )
  }
}
