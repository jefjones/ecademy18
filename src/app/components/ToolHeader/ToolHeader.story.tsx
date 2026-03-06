import { storiesOf } from '@kadira/storybook'
import ToolHeader from './ToolHeader'


storiesOf('ToolHeader', module)

    .add('default', () => (<ToolHeader className="" text={'Communications'}/>))
