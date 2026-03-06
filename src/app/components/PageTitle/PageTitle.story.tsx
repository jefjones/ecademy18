import { storiesOf } from '@kadira/storybook'
import PageTitle from './PageTitle'
import styles from './PageTitle.css'

storiesOf('PageTitle', module)

    .add('default', () => (
        <PageTitle title='Customer List'
            subLabel=''
            lineStyles=''
            titleStyle=''
            subStyle=''
            printURL={() => {}}
        />
    ))
