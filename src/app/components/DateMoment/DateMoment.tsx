import styles from './DateMoment.css'
import moment from 'moment'
import classes from 'classnames'

export default ({date, label, includeTime=true, className, labelClass, format, timeOnly=false, minusHours}) => {
		let dateString = date

		if (minusHours > 0) {
				let realDate = new Date(dateString)
				realDate.setHours(realDate.getHours() - minusHours)
				dateString = realDate.toString()
		}
    return (
        <div className={classes(styles.text, className)}>
						{label && <div className={classes(styles.label, labelClass)}>{label}</div>}
            <div className={labelClass}>{
                moment(dateString).year() > 1969 ?
                    format
												? moment(dateString).format(format)
                        : includeTime || timeOnly
                            ? timeOnly
                                ? moment(dateString).format("h:mm a") === '12:00 am'
																		? ''
																		: moment(dateString).format("h:mm a")
                                : moment(dateString).format("D MMM YYYY, h:mm a")
                            : moment(dateString).format("D MMM YYYY")
                        : ''
            }</div>
        </div>
    )
}
