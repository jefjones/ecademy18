import { storiesOf } from '@kadira/storybook'
import SiteSearch from './SiteSearch'
import styles from './SiteSearch.css'

storiesOf('SiteSearch', module)

.add('default', () => (
    <SiteSearch test={''} className={''} icon={'profilePerson'} placeholder={'Search Church Directory'} justify="right"/>
    ))


//lineStyle={styles.storyLineStyle}
