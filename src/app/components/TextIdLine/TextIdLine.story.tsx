import { storiesOf } from '@kadira/storybook'
import TextIdLine from './TextIdLine'
import styles from './TextIdLine.css'

storiesOf('TextIdLine', module)

    .add('default', () => (
        <TextIdLine
            text={'American Fork Utah Stake'}
            id={'999765'}
            textStyle={''}
            idStyle={''}
        />
    ))


//lineStyle={styles.storyLineStyle}
