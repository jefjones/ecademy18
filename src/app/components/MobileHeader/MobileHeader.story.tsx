import { storiesOf } from '@kadira/storybook'
import MobileHeader from './MobileHeader'

const nav = [
    {
        "href": "/workList",
        "text": "documents",
        "dropdown": [
            {
                "href": "/",
                "text": "something"
            }
        ]
    },
    {
        "href": "/editorList",
        "text": "editors",
        "count": 0,
        "newCount": false
    },
    {
        "href": "/groups",
        "text": "groups",
        "count": 1,
        "newCount": false
    },
    {
        "href": "/workList",
        "text": "community"
    },
    {
        "href": "/messages",
        "text": "messages",
        "count": 4,
        "newCount": true
    }
]

storiesOf('MobileHeader', module)

    .add('default', () => (
        <div>
          <MobileHeader links={nav} logoutClick={() => {}}/>
        </div>
    ))
