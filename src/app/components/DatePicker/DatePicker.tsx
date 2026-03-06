import { useState } from 'react'
import styles from './DatePicker.css'
import Icon from '../Icon/Icon'
import classes from 'classnames'
//import ReactDatePicker from 'react-datepicker';
import moment from 'moment'

function DatePicker(props) {
  const [initialDate, setInitialDate] = useState(initMoment)

  const {className=""} = props
      return (
          <div className={classes(className, styles.dateComponent)}>
              <input type="date"
                  value={initialDate ? initialDate : null}
                  onChange={handleChange}
                  dateFormat="D MMM YYYY"
                  className={styles.dateText}/>
          </div>
      )
}

//
// <ReactDatePicker
//     key={id}
//     selected={this.state.initialDate ? this.state.initialDate : null}
//     onChange={this.handleChange}
//     dateFormat="D MMM YYYY"
//     className={styles.dateText}
//     showYearDropdown
//     showMonthDropdown
//     isClearable={true}
//     dropdownMode="select" />
export default DatePicker
