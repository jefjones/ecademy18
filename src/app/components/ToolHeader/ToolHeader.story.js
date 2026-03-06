import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ToolHeader from './ToolHeader.js';


storiesOf('ToolHeader', module)

    .add('default', () => (<ToolHeader className="" text={'Communications'}/>))
