import React from 'react';
import { storiesOf } from '@kadira/storybook';
import InputText from './InputText.js';

storiesOf('InputText', module)

    .add('short', () => (
        <InputText
            size="short"
            name="first name"
            label="first name"
            value={`inside stuff`}
            onChange={() => {}}
            error={`errors here`}
        />
    ))
    .add('medium', () => (
        <InputText
            size="medium"
            name="first name"
            label="first name"
            value={`inside stuff`}
            onChange={() => {}}
            error={`errors here`}
        />
    ))
    .add('medium-long', () => (
        <InputText
            size="medium-long"
            name="first name"
            label="first name"
            value={`inside stuff`}
            onChange={() => {}}
            error={`errors here`}
        />
    ))
    .add('long', () => (
        <InputText
            size="long"
            name="first name"
            label="first name"
            value={`inside stuff`}
            onChange={() => {}}
            error={`errors here`}
        />
    ))
