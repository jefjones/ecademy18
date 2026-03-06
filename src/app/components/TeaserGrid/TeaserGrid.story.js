import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TeaserGrid from './TeaserGrid.js';

var teasers = [
    {
      "id": "Create Record",
      "feature": null,
      "url": "/mls/mbr/records/create-start?lang=eng",
      "urlInNewWindow": false,
      "imageUrl": "images/teaser-CreateRecord.jpg",
      "title": "dashboard.create.record",
      "description": "dashboard.create.record.description",
      "$$hashKey": "object:669"
    },
    {
      "id": "Rec Ordinances",
      "feature": null,
      "url": "/mls/mbr/records/ordinances?lang=eng",
      "urlInNewWindow": false,
      "imageUrl": "images/teaser-RecordOrdinances.jpg",
      "title": "dashboard.record.ordinances",
      "description": "dashboard.record.ordinances.description",
      "$$hashKey": "object:670"
    },
    {
      "id": "Finance",
      "feature": null,
      "url": "/finance",
      "urlInNewWindow": true,
      "imageUrl": "images/teaser-Finance.jpg",
      "title": "dashboard.finance",
      "description": "dashboard.finance.description",
      "$$hashKey": "object:671"
    },
    {
      "id": "HTVT new",
      "feature": null,
      "url": "/mls/mbr/report/htvt?lang=eng",
      "urlInNewWindow": false,
      "imageUrl": "images/teaser-ViewReports.jpg",
      "title": "dashboard.new.report",
      "description": "dashboard.new.report.description",
      "$$hashKey": "object:672"
    },
    {
      "id": "Min Res",
      "feature": null,
      "url": "https://providentliving.lds.org/leader/ministering-resources?lang=eng",
      "urlInNewWindow": true,
      "imageUrl": "images/teaser-Strengthening.jpg",
      "title": "dashboard.ministering.resources",
      "description": "dashboard.new.topics.available",
      "$$hashKey": "object:673"
    },
    {
      "id": "Topics",
      "feature": null,
      "url": "/mls/mbr/topics/0?lang=eng",
      "urlInNewWindow": false,
      "imageUrl": "images/teaser-GospelTopics.jpg",
      "title": "topics.0",
      "description": null,
      "$$hashKey": "object:674"
    }
  ];


storiesOf('TeaserGrid', module)

    .add('default', () => (
        <TeaserGrid className="" teasers={teasers}/>
    ))
