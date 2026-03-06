import React, {Component} from 'react';
import styles from './DatePicker.css';
import Icon from '../Icon/Icon.js';
import classes from 'classnames';
//import ReactDatePicker from 'react-datepicker';
import moment from 'moment';

export default class DatePicker extends Component {
  constructor (props) {
    super(props);

    let initMoment = moment();
    this.props.initialDate ? initMoment._d = new Date(this.props.initialDate) : initMoment = null

    this.state = {
        initialDate: initMoment
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
        initialDate: date
    });
    this.props.onChange && this.props.onChange(date);
  }

  render() {
    const {className=""} = this.props;
    return (
        <div className={classes(className, styles.dateComponent)}>
            <input type="date"
                value={this.state.initialDate ? this.state.initialDate : null}
                onChange={this.handleChange}
                dateFormat="D MMM YYYY"
                className={styles.dateText}/>
        </div>
    )}
};

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
