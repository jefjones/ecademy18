import React, {Component} from 'react';
import styles from './SwitchOnOff.css';
import classes from 'classnames';

export default class extends Component {
  constructor ( props ) {
      super( props );
  }

  render() {
      let {value, onChange} = this.props;
      return(
        <div className={styles.container}>
          <div className={styles.switch_container}>
              <label>
                  <input ref="switch" checked={ value } onClick={ onChange } onChange={() => {}} className={styles.switch} type="checkbox"/>
                  <div>
                      <span><g className={classes(styles.icon, styles.icon_toolbar, styles.grid_view)}></g></span>
                      <span><g className={classes(styles.icon, styles.icon_toolbar, styles.ticket_view)}></g></span>
                      <div></div>
                  </div>
              </label>
          </div>
        </div>
      );
 }
}
