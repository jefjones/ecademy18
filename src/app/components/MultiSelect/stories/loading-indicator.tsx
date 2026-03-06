import {storiesOf} from '@kadira/storybook'
import LoadingIndicator from '../loading-indicator'

storiesOf('Loading Indicator', module)
    .add('default view', () => <LoadingIndicator />)
