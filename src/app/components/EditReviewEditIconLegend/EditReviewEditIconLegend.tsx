import * as styles from './EditReviewEditIconLegend.css';  //PropTypes
import Icon from '../Icon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({isAuthor}) => {
    return (
        <table className={styles.container}>
            <tbody>
            <tr>
                <td>
                    <Icon pathName={`comment_text`} premium={true} className={styles.image} />
                </td>
                <td>
                    <strong><L p={p} t={`Comment.`}/></strong> <L p={p} t={`This comment will belong to a sentence.  A sentence must be chosen in order to assign a comment to that sentence.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`eraser`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <strong><L p={p} t={`Erase.`}/></strong> <L p={p} t={`Erase a sentence entirely.  A target sentence must be chosen before this tool can know which sentence you intend to erase.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`thumbs_up0`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <strong><L p={p} t={`Accept and choose this edit.`}/></strong>  <L p={p} t={`You can edit it further.  This will score this edit favorably.`}/>
                    {isAuthor &&
                        <span><L p={p} t={`All other edits which haven't been deleted (rejected) will be scored minimally for effort.`}/></span>
                    }
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`thumbs_down0`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <strong><L p={p} t={`Disagree with this edit.`}/></strong><L p={p} t={`But use this sparingly since this decreases the user's score.  Please, be courteous.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <div className={classes(styles.row, styles.moreLeft)}>
                        <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                        <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                    </div>
                </td>
                <td>
                    <strong><L p={p} t={`Troll!`}/></strong> <L p={p} t={`Use this tool to mark the entry as obnoxious or destructive.  The author ought to take away access for this editor.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`undo2`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <strong><L p={p} t={`Undo.`}/></strong>  <L p={p} t={`You can delete your own edits or, if you are the author, you can delete others' edits.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <div className={styles.row}>
                        <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                        <Icon pathName={`magnifier`} premium={true} className={styles.imageMagnifier}/>
                    </div>
                </td>
                <td>
                    <strong><L p={p} t={`See this editor's full version.`}/></strong> <L p={p} t={`This will return you to the main screen and automatically choose the tab where you can read their full version with their edits marked.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <div className={styles.linkStyle}>
                        <L p={p} t={`Restore`}/>
                    </div>
                </td>
                <td>
                    <strong><L p={p} t={`Restore`}/></strong>  <L p={p} t={`This is an option for an edit that has already been accepted or rejected.  It is showing up because your settings indicate that you want to view this sentence's history.  You can click on 'restore' in order to have a chance to accept it or edit it further.`}/>
                </td>
            </tr>
            </tbody>
        </table>
    )
}
