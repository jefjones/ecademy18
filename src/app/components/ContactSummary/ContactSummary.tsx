import * as styles from './ContactSummary.css'
import classes from 'classnames'
import ProfilePicture from '../../assets/boy_default.jpg'
import DateMoment from '../DateMoment'
import Icon from '../Icon'
import {formatNumber} from '../../utils/numberFormat'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({chapters, workId, summary={}, className="", onClick, showAccessIcon=true, showDoneButton=false, userPersonId, noShowTitle}) => {
    return (
        <div className={classes(styles.container, className)}>
          <table className={styles.textDisplayWidth}>
            <tbody>
            {!noShowTitle &&
                <tr>
                    <td colSpan={2} >
                        <a onClick={() => onClick(userPersonId, summary.personId, "/contactProfile")}>
                            <img src={ProfilePicture} className={styles.profilePicture} alt={`profile`}/>
                        </a>
                        <span className={styles.linkStyle} onClick={() => onClick(userPersonId, summary.personId, "/contactProfile")}>
                            {summary.firstName + ' ' + summary.lastName}
                        </span>
                        <span className={styles.score}>{formatNumber(summary.editorScore, true, false, 1)}</span>
                        {showAccessIcon &&
                             <a className={styles.linkStyle} onClick={() => onClick(userPersonId, summary.personId, "/giveAccessToWorks")}>
                                 <Icon pathName={`folder_plus`} className={styles.documentImage} />
                             </a>
                         }
                         {showDoneButton &&
                             <a className={styles.buttonStyle} onClick={() => onClick(userPersonId, summary.personId, "/contactProfile")}>
                               <L p={p} t={`Done`}/>
                             </a>
                          }
                    </td>
                </tr>
            }
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`assigned`}/>
                </td>
                <td className={styles.text}>
                    {summary.worksAssigned}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`native language`}/>
                </td>
                <td className={styles.text}>
                    {summary.nativeLanguageNames}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`translate language`}/>
                </td>
                <td className={styles.text}>
                    {summary.translateLanguageNames}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`total edits`}/>
                </td>
                <td className={styles.text}>
                    {summary.totalEdits}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`soonest due date`}/>
                </td>
                <td className={styles.text}>
                    <DateMoment date={summary.editorSoonestDueDate}/>
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`edits pending`}/>
                </td>
                <td className={styles.text}>
                    {summary.editsPending}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`latest update`}/>
                </td>
                <td className={styles.text}>
                    <DateMoment date={summary.editorLastUpdate}/>
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`vote up count`}/>
                </td>
                <td className={styles.text}>
                    {summary.voteUpCount}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`troll count`}/>
                </td>
                <td className={styles.text}>
                    {summary.trollCount}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`vote down count`}/>
                </td>
                <td className={styles.text}>
                    {summary.voteDownCount}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`votes cast`}/>
                </td>
                <td className={styles.text}>
                    {summary.votesCast}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`author accepted`}/>
                </td>
                <td className={styles.text}>
                    {summary.authorAcceptedEdits}
                </td>
            </tr>
            <tr>
                <td className={styles.label}>
                    <L p={p} t={`location`}/>
                </td>
                <td className={styles.text}>
                    {summary.location}
                </td>
            </tr>
          </tbody>
          </table>
        </div>
    )
}
