import React, {Component} from 'react';
import styles from './EditorInstructions.css';
import tapOrClick from 'react-tap-or-click';
const p = 'component';
import L from '../../components/PageLanguage';

export default class EditorInstructions extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const {editMode, newBreak, deleteBreak, moveSentence, newImage, cancelRecord} = this.props;

        return (
            <div className={styles.container}>
                {editMode === 'textNew' &&
                    <div className={styles.column}>
                        <span className={newBreak.hrefId ? styles.completed : styles.step}><L p={p} t={`1. Click on a sentence where you want the new sentence(s).`}/></span>
                        <span className={styles.step}><L p={p} t={`2. Click on one of the two target icons that appear.`}/></span>
                        <div className={styles.row}>
                            <span className={styles.editMode}><L p={p} t={`Edit mode: New sentence(s)`}/></span>
                            <button className={styles.editButton} {...tapOrClick(() => cancelRecord())}><L p={p} t={`Cancel`}/></button>
                        </div>
                    </div>
                }
                {editMode === 'breakNew' &&
                    <div className={styles.column}>
                        <span className={newBreak.hrefId ? styles.completed : styles.step}><L p={p} t={`1. Click on a sentence where you want the new break.`}/></span>
                        <span className={styles.step}><L p={p} t={`2. Click on the paragraph icon where you want the new break.`}/></span>
                        <div className={styles.row}>
                            <span className={styles.editMode}><L p={p} t={`Edit mode: New paragraph break`}/></span>
                            <button className={styles.editButton} {...tapOrClick(() => cancelRecord())}><L p={p} t={`Cancel`}/></button>
                        </div>
                    </div>
                }
                {editMode === 'breakDelete' &&
                    <div className={styles.column}>
                        <span className={deleteBreak.hrefId ? styles.completed : styles.step}><L p={p} t={`1. Click on a sentence next to the existing break.`}/></span>
                        <span className={styles.step}><L p={p} t={`2. Click on the paragraph icon that appears where you want to delete the paragraph break.`}/></span>
                        <div className={styles.row}>
                            <span className={styles.editMode}><L p={p} t={`Edit mode: Remove paragraph break`}/></span>
                            <button className={styles.editButton} {...tapOrClick(() => cancelRecord())}><L p={p} t={`Cancel`}/></button>
                        </div>
                    </div>
                }
                {editMode === 'sentenceMove' &&
                    <div className={styles.column}>
												<span className={moveSentence.stepCount >= 2 ? styles.completed : styles.step}><L p={p} t={`1. Click on a sentence to move.`}/></span>
                        <span className={moveSentence.stepCount >= 3 ? styles.completed : styles.step}><L p={p} t={`2. To only move one sentence, click on the same sentence again. To move more than one, click on the last sentence - then all sentences in between will be selected.`}/></span>
                        <span className={moveSentence.stepCount >= 4 ? styles.completed : styles.step}><L p={p} t={`3. Click on the sentence where you want to move the chosen sentence(s).`}/></span>
                        <span className={styles.step}><L p={p} t={`4. Click one of the targets that appear at the beginning and the end.`}/></span>
                        <div className={styles.row}>
                            <span className={styles.editMode}><L p={p} t={`Edit mode: Move sentence(s)`}/></span>
                            <button className={styles.editButton} {...tapOrClick(() => cancelRecord())}><L p={p} t={`Cancel`}/></button>
                        </div>
                    </div>
                }
                {editMode === 'imageNew' &&
                    <div className={styles.column}>
                        <span className={newImage.hrefId ? styles.completed : styles.step}><L p={p} t={`1. Click on a sentence where you want to enter the new image.`}/></span>
                        <span className={styles.step}><L p={p} t={`2. Click on one of the two target icons that appear where you want to enter the new image.`}/></span>
                        <div className={styles.row}>
                            <span className={styles.editMode}><L p={p} t={`Edit mode: Insert image`}/></span>
                            <button className={styles.editButton} {...tapOrClick(() => cancelRecord())}><L p={p} t={`Cancel`}/></button>
                        </div>
                    </div>
                }
            </div>
        )
    }
};
