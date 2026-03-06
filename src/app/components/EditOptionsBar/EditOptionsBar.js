import React, {Component} from 'react';
import styles from './EditOptionsBar.css';
import MenuPopup from '../MenuPopup';
import classes from 'classnames';
import Icon from '../Icon';
import tapOrClick from 'react-tap-or-click';

export default class EditOptionsBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingSubMenu: false,
        };

        this.handleToggleSubMenu = this.handleToggleSubMenu.bind(this);
    }

    handleToggleSubMenu() {
        this.setState({ isShowingSubMenu: !this.state.isShowingSubMenu });
    }

    render() {
        const {className, setEditOptionTools, setEditMode, editReview, showInstructions, personId, workSummary, deleteWork, deleteChapter,
                setWorkCurrentSelected} = this.props;
        const {isShowingSubMenu} = this.state;

        return (
            <div className={classes(className, styles.container, styles.row)}>
                {!editReview.isTranslation &&
                    <div className={styles.editModeButton}>
                        <div className={styles.headText}>
                            edit
                        </div>
                        <div className={classes(styles.row, styles.modeOption, editReview.modeChosen === 'edit' ? styles.blueBack : styles.grayBack)}
                                {...tapOrClick((event) => setEditMode('edit', event))}>
                            <input type="radio" name={`editMode`} id={`editMode`} value={editReview.modeChosen}
                                    checked={editReview.modeChosen === 'edit' ? true : false} className={styles.radio}/>
                            <Icon pathName={`pencil`} className={styles.editModeImage}/>
                            <span className={classes(styles.counts, editReview.modeChosen === 'edit' ? styles.white : '')}>
                                {editReview.modeCounts.editCount || 0}
                            </span>
                        </div>
                    </div>
                }
                {!editReview.isTranslation &&
                    <div className={styles.editModeButton}>
                        <div className={styles.headText}>
                            new break
                        </div>
                        <div className={classes(styles.row, styles.modeOption, editReview.modeChosen === 'breakNew' ? styles.blueBack : styles.grayBack)}
                                {...tapOrClick((event) => setEditMode('breakNew', event))} onChange={() => {}}>
                            <input type="radio" name={`editMode`} id={`editMode`} value={editReview.modeChosen}
                                    checked={editReview.modeChosen === 'breakNew' ? true : false} className={styles.radio}/>
                            <Icon pathName={`paragraph`} className={styles.editModeImage} superscript={`plus`}/>
                            <span className={classes(styles.counts, editReview.modeChosen === 'breakNew' ? styles.white : '')}>
                                {editReview.modeCounts.breakNewCount || 0}
                            </span>
                        </div>
                    </div>
                }
                {!editReview.isTranslation &&
                    <div className={styles.editModeButton}>
                        <div className={styles.headText}>
                            delete break
                        </div>
                        <div className={classes(styles.row, styles.modeOption, editReview.modeChosen === 'breakDelete' ? styles.blueBack : styles.grayBack)}
                                {...tapOrClick((event) => setEditMode('breakDelete', event))} onChange={() => {}}>
                            <input type="radio" name={`editMode`} id={`editMode`} value={editReview.modeChosen}
                                    checked={editReview.modeChosen === 'breakDelete' ? true : false} className={styles.radio}/>
                            <Icon pathName={`paragraph`} className={styles.editModeImage} superscript={`cross`}/>
                            <span className={classes(styles.counts, editReview.modeChosen === 'breakDelete' ? styles.white : '')}>
                                {editReview.modeCounts.breakDeleteCount || 0}
                            </span>
                        </div>
                    </div>
                }
                {!editReview.isTranslation &&
                    <div className={styles.editModeButton}>
                        <div className={styles.headText}>
                            move
                        </div>
                        <div className={classes(styles.row, styles.modeOption, editReview.modeChosen === 'sentenceMove' ? styles.blueBack : styles.grayBack)}
                                {...tapOrClick((event) => setEditMode('sentenceMove', event))} onChange={() => {}}>
                            <input type="radio" name={`editMode`} id={`editMode`} value={editReview.modeChosen}
                                    checked={editReview.modeChosen === 'sentenceMove' ? true : false} className={styles.radio}/>
                            <Icon pathName={`move_sentence`} className={styles.editModeImage}/>
                            <span className={classes(styles.counts, editReview.modeChosen === 'sentenceMove' ? styles.white : '')}>
                                {editReview.modeCounts.sentenceMoveCount || 0}
                            </span>
                        </div>
                    </div>
                }
                {/*!editReview.isTranslation &&
                    <div className={styles.editModeButton}>
                        <div className={classes(styles.headText)}>
                            image
                        </div>
                        <div className={classes(styles.row, styles.modeOption, editReview.modeChosen === 'imageNew' ? styles.blueBack : styles.grayBack)}
                                {...tapOrClick((event) => setEditMode('imageNew', event))} onChange={() => {}}>
                            <input type="radio" name={`editMode`} id={`editMode`} value={editReview.modeChosen}
                                    checked={editReview.modeChosen === 'imageNew' ? true : false} className={styles.radio}/>
                            <Icon pathName={`image_picture`} className={styles.editModeImage}/>
                            <span className={classes(styles.counts, editReview.modeChosen === 'imageNew' ? styles.white : '')}>
                                {editReview.modeCounts.imageNewCount || 0}
                            </span>
                        </div>
                    </div>
                */}
                {!showInstructions &&
                    <MenuPopup opened={isShowingSubMenu} toggleOpen={this.handleToggleSubMenu} setEditOptionTools={setEditOptionTools}
                        className={styles.subMenu} personId={personId} workSummary={workSummary} infoShow={this.handleToolLegendOpen}
                        deleteWork={deleteWork} deleteChapter={deleteChapter} setWorkCurrentSelected={setWorkCurrentSelected}
                        editReview={editReview} setEditMode={setEditMode}/>
                 }
          </div>
        )
    }
};
