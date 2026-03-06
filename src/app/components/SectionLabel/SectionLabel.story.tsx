import { storiesOf } from '@kadira/storybook'
import SectionLabel from './SectionLabel'

storiesOf('SectionLabel', module)

    .add('default', () => (
        <SectionLabel mainLabel='Children Approaching Baptism Age'
            subLabel='Members age 8 who have not been baptized or who are turning 8 in the next two months.'
            mainStyle=''
            subStyle=''
        />
    ))
