import React, {Component} from 'react';  //PropTypes
import styles from './ColorPickerModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import ButtonWithIcon from '../ButtonWithIcon';
import {SketchPicker} from 'react-color';
const p = 'component';
import L from '../../components/PageLanguage';

export default class ColorPickerModal extends Component {
    constructor(props) {
        super(props);

				this.state = {
				    color: '#fff',
				  };
			}

	  handleChangeComplete = (color) => {
	    	this.setState({ color: color.hex });
	  };

    render() {
        const {onClick, handleClose, className} = this.props;
				const {color} = this.state;

        return (
            <div className={classes(styles.container, className)}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.dialogHeader}>Color Picker</div>
									      <SketchPicker color={color} onChangeComplete={this.handleChangeComplete} />
                        <div className={styles.dialogButtons}>
                            <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
														<ButtonWithIcon label={<L p={p} t={`Save`}/>} icon={'checkmark_circle'} onClick={() => onClick(color)}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
