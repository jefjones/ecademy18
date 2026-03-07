import * as styles from './TeaserImage.css'
import classes from 'classnames'

import Training2014 from './Assets/teaser-2014-Training.jpg'
import Training2014_2 from './Assets/teaser-2014-Training2.jpg'
import Training2015 from './Assets/teaser-2015-Training.png'
import Birthday from './Assets/teaser-Birthday.jpg'
import BoundaryProposals from './Assets/teaser-BoundaryProposals.jpg'
import Callings from './Assets/teaser-Callings.jpg'
import CallingsLG from './Assets/teaser-CallingsLG.jpg'
import CallingsSM from './Assets/teaser-CallingsSM.jpg'
import Certificates from './Assets/teaser-Certificates.jpg'
import Class from './Assets/teaser-Class.jpg'
import ContactInfo from './Assets/teaser-ContactInfo.jpg'
import CreateRecord from './Assets/teaser-CreateRecord.jpg'
import Donations from './Assets/teaser-Donations.jpg'
import EQ from './Assets/teaser-EQ.jpg'
import Finance from './Assets/teaser-Finance.jpg'
import FS_4G from './Assets/teaser-FS-4G.jpg'
import Activity from './Assets/teaser-FS-Activity.jpg'
import GospelTopics from './Assets/teaser-GospelTopics.jpg'
import Hasten from './Assets/teaser-Hasten.jpg'
import HP from './Assets/teaser-HP.jpg'
import HTVT from './Assets/teaser-HTVT.jpg'
import HTVT2 from './Assets/teaser-HTVT2.jpg'
import HTVT3 from './Assets/teaser-HTVT3.jpg'
import SM from './Assets/teaser-HTVT-SM.jpg'
import SM2 from './Assets/teaser-HTVT-SM2.jpg'
import ldstools from './Assets/teaser-ldstools.jpg'
import Leadership from './Assets/teaser-Leadership.jpg'
import LU from './Assets/teaser-LU.jpg'
import LU2 from './Assets/teaser-LU2.jpg'
import mormonOrg from './Assets/teaser-mormonOrg.png'
import Move from './Assets/teaser-Move.jpg'
import Ordinances from './Assets/teaser-MP-Ordinances.jpg'
import MPR from './Assets/teaser-MPR.jpg'
import OtherCourses from './Assets/teaser-OtherCourses.jpg'
import PEF from './Assets/teaser-PEF.jpg'
import Preach from './Assets/teaser-Preach.jpg'
import Primary from './Assets/teaser-Primary.jpg'
import RecordOrdinances from './Assets/teaser-RecordOrdinances.jpg'
import RS from './Assets/teaser-RS.jpg'
import SS from './Assets/teaser-SS.jpg'
import SS2 from './Assets/teaser-SS2.jpg'
import SS3 from './Assets/teaser-SS3.jpg'
import StakeConference from './Assets/teaser-StakeConference.jpg'
import Strengthening from './Assets/teaser-Strengthening.jpg'
import Temple from './Assets/teaser-Temple.jpg'
import ViewReports from './Assets/teaser-ViewReports.jpg'
import ViewReports2 from './Assets/teaser-ViewReports2.jpg'
import VT from './Assets/teaser-VT.jpg'
import WC from './Assets/teaser-WC.jpg'
import welcome from './Assets/teaser-welcome.jpg'
import Youth from './Assets/teaser-Youth.jpg'


const availableIcons = {
    "training2014": Training2014,
    "training2014_2": Training2014_2,
    "training2015": Training2015,
    "birthday": Birthday,
    "boundaryproposals": BoundaryProposals,
    "callings": Callings,
    "callingsvlg": CallingsLG,
    "callings-sm": CallingsSM,
    "certificates": Certificates,
    "class": Class,
    "contactinfo": ContactInfo,
    "createrecord": CreateRecord,
    "donations": Donations,
    "eq": EQ,
    "finance": Finance,
    "fs_4g": FS_4G,
    "activity": Activity,
    "gospeltopics": GospelTopics,
    "hasten": Hasten,
    "hp": HP,
    "htvt": HTVT,
    "htvt2": HTVT2,
    "htvt3": HTVT3,
    "sm": SM,
    "sm2": SM2,
    "ldstools": ldstools,
    "leadership": Leadership,
    "lu": LU,
    "lu2": LU2,
    "mormonorg": mormonOrg,
    "move": Move,
    "ordinances": Ordinances,
    "mpr": MPR,
    "othercourses": OtherCourses,
    "pef": PEF,
    "preach": Preach,
    "primary": Primary,
    "recordordinances": RecordOrdinances,
    "rs": RS,
    "ss": SS,
    "ss2": SS2,
    "ss3": SS3,
    "stakeconference": StakeConference,
    "strengthening": Strengthening,
    "temple": Temple,
    "viewreports": ViewReports,
    "viewreports2": ViewReports2,
    "vt": VT,
    "wc": WC,
    "welcome": welcome,
    "youth": Youth
}

const titleCase = function(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1))
  }).join(' ')
}


export default ({teaser={}, className=""}) => {
    let image = teaser.imageUrl.substr(teaser.imageUrl.indexOf('-')+1)
    image = image.substr(0, image.indexOf('.')).toLowerCase()
    const imgSrc = image && availableIcons[image]

    let title = teaser.title
    if (title) {
        title = teaser.title.substr(teaser.title.indexOf('.')+1)
        title = title.replace(/\./g, " ")
        title = titleCase(title)
    }

    let description = teaser.description
    if (description) {
        description = teaser.description.substr(teaser.description.indexOf('.')+1)
        description = description.replace(/\./g, " ")
        description = titleCase(description)
    }

    return (
        <div className={styles.container}>
            <div className={styles.imgBckg}>
                <a href={teaser.url} className={styles.href}>
                    <div className={styles.textContainer}>
                        <h4 className={styles.teaserHeader}>{title}</h4>
                        <p className={styles.teasertext}>{description}</p>
                    </div>
                    <img src={imgSrc} className={classes(styles.image)} alt={''}/>
                </a>
            </div>
        </div>
    )
}
