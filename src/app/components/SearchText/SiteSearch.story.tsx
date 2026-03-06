import { storiesOf } from '@kadira/storybook'
import SearchText from './SearchText'
import styles from './SearchText.css'

storiesOf('SearchText', module)

.add('default', () => (
        <SearchText test={''} className={''} icon={'profilePerson'} placeholder={'Search Church Directory'} justify="right"/>
    ))
