
import styles from './SwitchOnOff.css'
import classes from 'classnames'

function SwitchOnOff(props) {
  let {value, onChange} = props
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
        )
}
export default SwitchOnOff
