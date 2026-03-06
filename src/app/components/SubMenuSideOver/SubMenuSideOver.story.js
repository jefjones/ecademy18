import { storiesOf, action } from '@kadira/storybook';
import SubMenuSideOver from './SubMenuSideOver.js';

storiesOf('SubMenuSideOver', module)

    .add('default', () => (<SubMenuSideOver
                            className=""
                            label="testing this label"
                            icon="EmptyFile"
                            >
                            {`testing the children`}
                            </SubMenuSideOver>))
