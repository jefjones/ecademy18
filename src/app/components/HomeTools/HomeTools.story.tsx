import { storiesOf } from '@kadira/storybook'
import HomeTools from './HomeTools'

let homeTools = [
    {
        section: 'Communications',
        tools: [
            {
                type: 'link',
                text: 'Confidential Records',
                url: '/mls/mbr/ca/?lang=eng',
                openUrlInNewWindow: false,
                hasCount: true,
                count: 0
            },
            {
                type: 'link',
                text: 'Photos to Approve',
                url: '/directory?lang=eng',
                openUrlInNewWindow: false,
                hasCount: true,
                count: 3
            },
            {
                type: 'link',
                text: 'Official Communications',
                url: 'https://letters.lds.org/?lang=eng',
                openUrlInNewWindow: false,
                hasCount: true,
                count: 1
            },
            {
                type: 'link',
                text: 'Handbook 1',
                url: 'https://www.lds.org/handbook/handbook-1-stake-presidents-and-bishops?lang=eng',
                openUrlInNewWindow: true,
                hasCount: false
            },
            {
                type: 'link',
                text: 'Handbook 2',
                url: 'https://www.lds.org/handbook/handbook-2-administering-the-church?lang=eng',
                openUrlInNewWindow: true,
                hasCount: false
            }
        ]
    },
    {
        section: 'Units and Leaders',
        tools: [
            {
                type: 'inputText',
                placeholder: 'Search Church Directory',
                icon: 'profilePerson',
                linkText: 'Go to CDOL',
                openUrlInNewWindow: false,
                url: 'https://cdol-stage.lds.org/cdol/'
            }
        ]
    },
    {
        section: 'Welfare Services',
        tools: [
            {
                type: 'link',
                text: 'Ministering Resources',
                openUrlInNewWindow: true,
                url: 'https://providentliving.lds.org/leader/ministering-resources?lang=eng'
            },
            {
                type: 'link',
                text: 'Welfare Services Requests',
                openUrlInNewWindow: true,
                url: 'https://welfare-stage.lds.org?lang=eng'
            },
            {
                type: 'link',
                text: 'Welfare Leader Resources',
                openUrlInNewWindow: true,
                url: 'https://www.lds.org/topics/welfare/leader-resources?lang=eng'
            },
            {
                type: 'link',
                text: '24-Hour Welfare Help Line',
                openUrlInNewWindow: true,
                url: 'https://providentliving.lds.org/leader/resources/24-hour-welfare-help-line?lang=eng'
            },
            {
                type: 'link',
                text: 'Law of the Fast Training',
                openUrlInNewWindow: true,
                url: 'https://www.lds.org/bc/content/ldsorg/topics/fasting-and-fast-offerings/PD60001350_TMP_2016%20LeadMtg_The%20Law%20of%20the%20Fast_9-15-16%20KW.pdf',
            }
        ]
    },
    {
        section: 'Schedule',
        tools: [
            {
                type: 'noTool',
                linkText: 'Go to Calendar',
                openUrlInNewWindow: false,
                url: '/church-calendar'
            }
        ]
    }
]


storiesOf('HomeTools', module)

    .add('default', () => (<HomeTools className="" homeTools={homeTools}/>))
