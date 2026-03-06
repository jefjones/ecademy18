import React, {Component} from 'react';  //PropTypes
import styles from './CarpoolMemberStudentsModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import TextDisplay from '../TextDisplay';
import ButtonWithIcon from '../ButtonWithIcon';
import Loading from '../Loading';
import CheckboxGroup from '../CheckboxGroup';
const p = 'component';
import L from '../../components/PageLanguage';

export default class CarpoolMemberStudentsModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
						// myStudentsInCarpool: props.carpool && props.carpool.myStudentsAll && props.carpool.myStudentsAll && props.carpool.myStudentsAll.reduce((acc, m) => m.inCarpool ? acc ? acc.concat(m.studentPersonId) : [m.studentPersonId] : acc, []),
						// myStudentsAll: props.carpool && props.carpool.myStudentsAll,
        }
    }

		componentDidUpdate() {
				const {carpool, isShowing} = this.props;
				if (isShowing && !this.state.isInit && carpool.myStudentsInCarpool && carpool.myStudentsInCarpool.length > 0) {
						let myStudentsInCarpool = carpool.myStudentsInCarpool.reduce((acc, m) => m.inCarpool ? acc ? acc.concat(m.studentPersonId) : [m.studentPersonId] : acc, []);
						this.setState({ isInit: true, myStudentsInCarpool });
				}
		}

		processForm = (stayOrFinish) => {
	      const {personId, setMemberStudentsInCarpool, carpool, handleClose} = this.props;
	      const {myStudentsInCarpool} = this.state;
	      let hasError = false;

	      if (!myStudentsInCarpool || myStudentsInCarpool.length === 0) {
	          hasError = true;
	          this.setState({ errorStudents: <L p={p} t={`At least one student is required`}/> });
	      }

	      if (!hasError) {
						setMemberStudentsInCarpool(personId, carpool.carpoolId, myStudentsInCarpool)
						handleClose();
	          this.setState({ myStudentsInCarpool: [] });
	      }
	  }

		handleSelectChange = (myStudentsInCarpool) => {
				this.setState({ myStudentsInCarpool });
		}

    render() {
				const {handleClose, carpool} = this.props;
        const {myStudentsInCarpool, errorStudents} = this.state;

        return (
            <div className={styles.container}>
                <ModalContainer onClose={handleClose}>
                    <ModalDialog onClose={handleClose}>
                        <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Member Student`}/>}</div>
												<div className={styles.rowWrap}>
														<TextDisplay label={<L p={p} t={`Carpool name`}/>} text={carpool.name}/>
												</div>
												<div className={styles.moreTop}>
														<Loading isLoading={!myStudentsInCarpool || myStudentsInCarpool.length === 0} />
														{myStudentsInCarpool && myStudentsInCarpool.length > 0 &&
																<CheckboxGroup
																		name={'myStudents'}
																		options={carpool.myStudentsAll || []}
																		horizontal={true}
																		onSelectedChanged={this.handleSelectChange}
																		label={<L p={p} t={`Choose students who will be in this carpool:`}/>}
																		selected={myStudentsInCarpool}
																		error={errorStudents}/>
														}
												</div>
                        <div className={styles.dialogButtons}>
                            <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                        </div>
                    </ModalDialog>
                </ModalContainer>
            </div>
        )
    }
}
