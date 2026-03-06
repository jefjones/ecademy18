import styles from './EditReviewToolLegend.css';  //PropTypes
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

export default () => {
    return (
        <table className={styles.container}>
            <tbody>
            <tr>
                <td>
                    <Icon pathName={`pencil`} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`In this mode, you can edit sentences.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <div className={styles.row}>
                        <Icon pathName={`paragraph`} className={styles.image}/>
                        <Icon pathName={`plus`} className={styles.superscriptImage}/>
                    </div>
                </td>
                <td>
                    <L p={p} t={`In this edit mode, make a new paragraph break.  Click on a sentence where you want the paragraph break. Two new paragraph icons appear. One at the beginning and the other at the end. Confirm by choosing  where you want that paragraph to begin.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <div className={styles.row}>
                        <Icon pathName={`paragraph`} className={styles.image}/>
                        <Icon pathName={`cross`} className={styles.superscriptImage}/>
                    </div>
                </td>
                <td>
                    <L p={p} t={`In this edit mode, delete a paragrpah break.  Click on a sentence near the paragraph break that you want ot delete.  Two icons will appear - one on the front of the paragraph and one at the end.  Choose the target icon where you want to delete the paragraph.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`move_sentence`} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`In this edit mode, you can move sentences.  Four steps will appear:  1. Click on the sentence where you want to begin the move selection.`}/>
                    <L p={p} t={`2. Click on the sentence where you want to end the move selection (which might be the same sentence).`}/>
                    <L p={p} t={`3. Click on the sentence where you want to move the chosen text.`}/>
                    <L p={p} t={`4. Two target icons will appear. One at the beginning and the other at the end.  Confirm where you want the new text to be placed.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`comment_text`} premium={true} className={styles.image} />
                </td>
                <td>
                    <L p={p} t={`This comment will belong to a sentence.  A sentence must be chosen in order to assign a comment to that sentence.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`eraser`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`Erase a sentence entirely.  A target sentence must be chosen before this tool can know which sentence you intend to erase.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`left_panel`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`Clicking on this tool will open up the left side panel even if there are not any edits for the given sentence.  The count will show how many editors have contributed to editing the current sentence.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`thumbs_up0`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`You must be on someone else's edit in order to use this option.  Clicking this icon indicates that you accept this edit.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`thumbs_down0`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`You must be on someone else's edit in order to use this option.  Clicking this icon indicates that you do not accept this edit. It will be removed.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <div className={styles.row}>
                        <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                        <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                    </div>
                </td>
                <td>
                    <L p={p} t={`Troll!  You must be on someone else's edit in order to use this option.  Use this tool to mark the entry as obnoxious or destructive.  The author ought to take away access for this editor.`}/>
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
                    <L p={p} t={`This icon will become enabled when you have chosen an edit, a paragraph break, or a moved sentence icon when there is only one editor responsible for that edit.  But only if you are not on that editor's tab, it becomes enabled so that you can then click on it to jump to the editor's tab who is responsible for that edit.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`undo0`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`You must be on your own edit in order to use this option.  You can remove your own edit by clicking this icon.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`magnifier`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`A set of search tools will appear to indicate what text you want to find followed by arrows to move next or previous.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`bookmark2`} premium={true} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`A bookmark list will appear with the options to enter a new bookmark.  Arows will be presented in order to jump to the next or previous bookmarks that you have previously set up.`}/>
                </td>
            </tr>
            <tr>
                <td colSpan={2}>
                    <hr />
                    <L p={p} t={`MOVE SENTENCES`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`target`} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`MOVE SENTENCES`}/><L p={p} t={`When viewing a moved sentence by an editor, click on the target to be jumped to the beginning of the sentences to be moved.`}/>
                </td>
            </tr>
            <tr>
                <td>
                    <Icon pathName={`move_sentence`} className={styles.image}/>
                </td>
                <td>
                    <L p={p} t={`Click on this symbol in order to jump to the target sentence where the sentences are suggested to be moved.`}/>
                </td>
            </tr>
            </tbody>
        </table>
    )
}
