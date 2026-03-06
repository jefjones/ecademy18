import React, {Component} from 'react';
import styles from './EditModeOption.css';
import Icon from '../Icon';
import classes from 'classnames';
import tapOrClick from 'react-tap-or-click';

export default class EditModeOption extends Component {
    render() {
        const {label, editReview, isShowingLabelsTop, isShowingLabelsBottom, setEditMode, editMode, toggleOpen, iconName,
                iconSuperscript, iconSuperscriptColor, handleShowInstructions, showInstructions, tooltipDirection } = this.props;

        return (
            <div className={styles.editModeButton}>
                {isShowingLabelsTop &&
                    <div className={styles.headText}>
                        <span>{label}</span>
                    </div>
                }
                <div className={classes(styles.row, styles.modeOption, editReview.modeChosen === editMode ? styles.blueBack : styles.grayBack)}
                        key={editMode} data-rh={label} data-rh-at={tooltipDirection ? tooltipDirection : 'bottom'}
                        {...tapOrClick((event) => {setEditMode(editMode, event); toggleOpen && toggleOpen(); handleShowInstructions(showInstructions);})}>
                    <input type="radio" name={`editMode`} id={`editMode`} value={editReview.modeChosen} onChange={() => {}}
                            checked={editReview.modeChosen === editMode ? true : false} className={styles.radio}/>
                    <div className={styles.setLeft}>
                        <Icon pathName={iconName} fillColor={editReview.modeChosen === editMode ? 'white' : ''} className={styles.editModeImage}
                            superscript={iconSuperscript} supFillColor={iconSuperscriptColor ? iconSuperscriptColor : ''}/>
                    </div>
                </div>
                {isShowingLabelsBottom &&
                    <div className={styles.footerText}>
                        <span>{label}</span>
                    </div>
                }
            </div>
        )
    }
}

// <span className={classes(styles.counts, editReview.modeChosen === editMode ? styles.white : '')}>
//     {counts || 0}
// </span>
