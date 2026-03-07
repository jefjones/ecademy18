import { storiesOf } from '@kadira/storybook'
import CaretDropDown from './CaretDropDown'
import * as styles from './CaretDropDown.css'

storiesOf('CaretDropDown', module)

    .add('default', () => (
        <CaretDropDown
        />
    ))


//lineStyle={styles.storyLineStyle}
