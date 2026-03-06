import React from 'react';
import { storiesOf } from '@kadira/storybook';
import WorkSummary from './WorkSummary.js';


let summary = {
  title: "The Car that Wouldn't Stop Dying",
  author: "Neil P. Donald",
  entryDate: "17 Apr 2015",
  wordCount: "9,563",
  sentenceCount: 832,
  editsPending: 536,
  editsProcessed: 42,
  editorsCount: 4,
  languagesCount: 0,
  sequence: 1,
  section: "The Car that Wouldn't Stop Dying"
}

storiesOf('WorkSummary', module)
    .add('default', () => <WorkSummary className="" summary={summary}/>)
