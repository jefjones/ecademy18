import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TeaserImage from './TeaserImage.js';

var teaser = {
      "id": "Create Record",
      "url": "/mls/mbr/records/create-start?lang={lang}",
      "imageUrl": "images/teaser-CreateRecord.jpg",
      "title": "dashboard.create.record",
      "description": "dashboard.create.record.description"
    };


storiesOf('TeaserImage', module)

    .add('default', () => (<TeaserImage className="" teaser={teaser}/>))
