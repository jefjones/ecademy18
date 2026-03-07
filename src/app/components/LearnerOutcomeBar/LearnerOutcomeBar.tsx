import { useState } from 'react'
import * as styles from './LearnerOutcomeBar.css'
import classes from 'classnames'

function LearnerOutcomeBar(props) {
  const [theText, setTheText] = useState(event.target.value)

  const {rating} = props
        //'proficient' is 1, 'inProgress' is 2, 'notStarted' is 3
  
        return (
          <div className={classes(styles.container)}>
              {rating && rating.length > 0 && rating.map((m, i) =>
                  <div key={i} className={classes(styles.sliver, m.value === 1 ? styles.proficient : m.value === 2 ? styles.inProgress : styles.notStarted)}></div>
              )}
          </div>
        )
}
export default LearnerOutcomeBar
