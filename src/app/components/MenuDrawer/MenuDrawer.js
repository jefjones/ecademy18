import styles from './MenuDrawer.css';
// import { Link } from 'react-router';
import classNames from 'classnames';
import { Link } from 'react-router';

export default ({workId, categoryTools=[], className=""}) => {

    categoryTools = [
        {
            category: "Leader and Clerk",
            tools: [
                {
                    "label": "Membership",
                    "link": "/workEntryAddNew&type=book",
                    "image": "",
                    "alwaysEnabled": true,
                    "isSwitch": false
                },
                {
                	"label": "Organizations",
                	"link": "/",
                	"image": "",
                	"alwaysEnabled": true,
                	"isSwitch": false
                },
                {
                	"label": "Reports",
                	"link": "/",
                	"image": "",
                	"alwaysEnabled": true,
                	"isSwitch": false
                },
                {
                	"label": "Finance",
                	"link": "/",
                	"image": "",
                	"alwaysEnabled": true,
                	"isSwitch": false
                },
                {
                	"label": "Applications",
                	"link": "/",
                	"image": "",
                	"alwaysEnabled": true,
                	"isSwitch": false
                },
                {
                	"label": "Other",
                	"link": "/",
                	"image": "",
                	"alwaysEnabled": true,
                	"isSwitch": false
                },
                {
                	"label": "Help",
                	"link": "/",
                	"image": "",
                	"alwaysEnabled": true,
                	"isSwitch": false
                },
            ]
        },
        {
            category: "LDS.org",
            tools: [
                {
        			"label": "Scriptures and Study",
        			"link": "/",
        			"image": "",
        			"alwaysEnabled": true,
        			"isSwitch": false
        		},
        		{
        			"label": "Families and Individuals",
        			"link": "/",
        			"image": "",
        			"alwaysEnabled": true,
        			"isSwitch": false
        		},
        		{
        			"label": "Share the Gospel",
        			"link": "/",
        			"image": "",
        			"alwaysEnabled": true,
        			"isSwitch": false
        		},
        		{
        			"label": "Inspiration and News",
        			"link": "/",
        			"image": "",
        			"alwaysEnabled": true,
        			"isSwitch": false
        		},
        		{
        			"label": "Serve and Teach",
        			"link": "/",
        			"image": "",
        			"alwaysEnabled": true,
        			"isSwitch": false
        		}
            ]
        }
    ];


    return (
        <div className={classNames(styles.backStyle, className)}>
            <div className={styles.menuTitle} id="menu">
                {categoryTools.map( ({category, tools=[]}, iCategory) => {
                    return (
                        <div key={iCategory} className={styles.listContainer}>
                            <span className={styles.category}>
                                {category}
                            </span>
                            {tools.map( ({label, link, image, isDisabled, isSwitch, switchIsOn}, iTool) =>
                                isDisabled ?
                                    <span key={iTool} className={styles.listItemDisabled}>{label}</span>
                                :
                                    <Link key={iTool} to={link + `/` + workId} className={styles.listItemEnabled}>{label}</Link>
                            )}
                        </div>
                    )}
                )}
                <a href="#" className={styles.closeMenu}></a>
            </div>

        </div>
    )
};
