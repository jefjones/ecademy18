import React from 'react';
import { storiesOf } from '@kadira/storybook';
import CaretDropDown from './CaretDropDown.js';
import styles from './CaretDropDown.css';

storiesOf('CaretDropDown', module)

    .add('default', () => (
        <CaretDropDown
        />
    ));


//lineStyle={styles.storyLineStyle}
