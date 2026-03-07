
import * as styles from './WeekdayPicker.css'
import Checkbox from '../Checkbox'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function WeekdayPicker(props) {
  const {className="", picker={}, onClick} = props
      return (
          <div className={classes(className, styles.container)}>
  						<Checkbox
  								id={`sunday`}
  								label={<L p={p} t={`Su`}/>}
  								position={'after'}
  								checked={picker.sunday || ''}
  								onClick={(event) => onClick('sunday', event)}
  								labelClass={styles.labelCheckbox}
  								checkboxClass={styles.checkbox} />
              <Checkbox
                  id={`monday`}
                  label={<L p={p} t={`M`}/>}
                  position={'after'}
                  checked={picker.monday || ''}
                  onClick={(event) => onClick('monday', event)}
                  labelClass={styles.labelCheckbox}
                  checkboxClass={styles.checkbox} />
              <Checkbox
                  id={`tuesday`}
                  label={<L p={p} t={`T`}/>}
                  position={'after'}
                  checked={picker.tuesday || ''}
                  onClick={(event) => onClick('tuesday', event)}
                  className={styles.stacked}
                  labelClass={styles.labelCheckbox}
                  checkboxClass={styles.checkbox} />
              <Checkbox
                  id={`wednesday`}
                  label={<L p={p} t={`W`}/>}
                  position={'after'}
                  checked={picker.wednesday || ''}
                  onClick={(event) => onClick('wednesday', event)}
                  className={styles.stacked}
                  labelClass={styles.labelCheckbox}
                  checkboxClass={styles.checkbox} />
              <Checkbox
                  id={`thursday`}
                  label={<L p={p} t={`Th`}/>}
                  position={'after'}
                  checked={picker.thursday || ''}
                  onClick={(event) => onClick('thursday', event)}
                  className={styles.stacked}
                  labelClass={styles.labelCheckbox}
                  checkboxClass={styles.checkbox} />
              <Checkbox
                  id={`friday`}
                  label={<L p={p} t={`F`}/>}
                  position={'after'}
                  checked={picker.friday || ''}
                  onClick={(event) => onClick('friday', event)}
                  className={styles.stacked}
                  labelClass={styles.labelCheckbox}
                  checkboxClass={styles.checkbox} />
  			<Checkbox
                  id={`saturday`}
                  label={<L p={p} t={`Sa`}/>}
                  position={'after'}
                  checked={picker.saturday || ''}
                  onClick={(event) => onClick('saturday', event)}
                  className={styles.stacked}
                  labelClass={styles.labelCheckbox}
                  checkboxClass={styles.checkbox} />
  
          </div>
      )
}
export default WeekdayPicker
