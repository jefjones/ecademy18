import styles from './TimeDisplay.css'

export default ({time, className="", includeMilli=false}) => {
    let hourPart
    let otherPart
    let amPM = "am"

    if (time && time.length > 0 && time.indexOf('T') > 1) {
      let timePart = time.substring(time.indexOf('T') + 1)
      hourPart = parseInt(timePart.substring(0, timePart.indexOf(':'))); //eslint-disable-line
      if (hourPart >= 12) {
          amPM = "pm"
          if (hourPart > 12) hourPart -= 12
      }
      otherPart = includeMilli ? timePart.substring(timePart.indexOf(':') + 1) : timePart.substring(timePart.indexOf(':') + 1, timePart.lastIndexOf(':'))

    } else if (time && time.length > 0 && time.indexOf(':') > -1) {
        hourPart = parseInt(time.substring(0, time.indexOf(':'))); //eslint-disable-line
        if (hourPart >= 12) {
            amPM = "pm"
						if (hourPart > 12) hourPart -= 12
        }
        otherPart = time.substring(time.indexOf(':') + 1)
    }

    return (
        <div className={className}>
            <span className={styles.dateFormat}>
                {hourPart + ':' + otherPart + ' ' + amPM}
            </span>
        </div>
    )
}
