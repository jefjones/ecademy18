import React from 'react';
import {Component} from 'react'
import styles from './MenuInline.css';
import EditModeOption from '../EditModeOption';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class MenuInline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingLabels: false,
        }
    }

    toggleLabels = () => this.setState({ isShowingLabels: !this.state.isShowingLabels });

    render() {
        const {className, editReview, setEditMode, handleShowInstructions} = this.props;
        const {isShowingLabels} = this.state;

        return (
            <div className={classes(styles.row, className)}>
                {!editReview.isTranslation &&
                    <EditModeOption label={<L p={p} t={`edit text (default)`}/>} editReview={editReview} isShowingLabelsBottom={isShowingLabels}
                        setEditMode={setEditMode} editMode={'edit'} showInstructions={false}
                        iconName={`pencil`} handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.editCount}/>
                }
                {!editReview.isTranslation &&
                    <EditModeOption label={<L p={p} t={`new paragraph break`}/>} editReview={editReview} isShowingLabelsBottom={isShowingLabels}
                        setEditMode={setEditMode} editMode={'breakNew'} showInstructions={true}
                        iconName={`paragraph`} iconSuperscript={'plus'} iconSuperscriptColor={'green'}
												handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.breakNewCount}/>
                }
                {!editReview.isTranslation &&
                    <EditModeOption label={<L p={p} t={`delete paragraph break`}/>} editReview={editReview} isShowingLabelsBottom={isShowingLabels}
                        setEditMode={setEditMode} editMode={'breakDelete'} showInstructions={true}
                        iconName={`paragraph`} iconSuperscript={'cross'} iconSuperscriptColor={'maroon'}
												handleShowInstructions={handleShowInstructions} counts={editReview.modeCounts.breakDeleteCount}/>
                }
                {!editReview.isTranslation &&
                    <EditModeOption label={<L p={p} t={`move sentence`}/>} editReview={editReview} isShowingLabelsBottom={isShowingLabels}
                        setEditMode={setEditMode} editMode={'sentenceMove'} showInstructions={true}
                        iconName={`move_sentence`}handleShowInstructions={handleShowInstructions}
                        counts={editReview.modeCounts.sentenceMoveCount}/>
                }
                {/*!editReview.isTranslation &&
                    <EditModeOption label={`new image`} editReview={editReview} isShowingLabelsBottom={isShowingLabels}
                        setEditMode={setEditMode} editMode={'imageNew'} showInstructions={true}
                        iconName={`image_picture`}handleShowInstructions={handleShowInstructions}
                        counts={editReview.modeCounts.imageNewCount}/>
                */}
            </div>
        )
    }
}

// {!editReview.isTranslation && personId !== workSummary.authorPersonId && //Let's put this off until later.  Let editors enter text into an existing sentence for now.
//     <EditModeOption label={`new sentence(s)`} editReview={editReview} isShowingLabelsBottom={isShowingLabels}
//         setEditMode={setEditMode} editMode={'textNew'} showInstructions={true}
//         iconName={`pencil`} iconSuperscript={'plus'} handleShowInstructions={handleShowInstructions}
//         counts={editReview.modeCounts.breakNewCount}/>
// }

// <div className={styles.labelChoice}>
//     <a onClick={this.toggleLabels}>
//         {isShowingLabels ? `hide labels` : `show labels`}
//     </a>
// </div>
