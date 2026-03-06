import React, {Component} from 'react';
import styles from './DocumentViewOnlyModal.css';
import globalStyles from '../../utils/globalStyles.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import Icon from '../Icon';
import MessageModal from '../MessageModal';
import ImageDisplay from '../ImageDisplay';
import ButtonWithIcon from '../ButtonWithIcon';
//import Iframe from 'react-iframe'
import ReactToPrint from "react-to-print";
const p = 'component';
import L from '../../components/PageLanguage';

export default class DocumentViewOnlyModal extends Component {
  constructor(props) {
      super(props);

      this.state = {
          file: {},
					data: {},
					responseVisitedTypeCode: props.clickedUrl && props.clickedUrl.responseVisitedTypeCode
      }
	}

	handleWebsiteLink = ({target}) => {
      const data = Object.assign('', this.state.data);
      data.newWebsiteLink = target.value;
      this.setState({ data, errorWebsiteLink: '' });
  }

	handleRemoveOpen = (studentAssignmentResponseId, deleteFile='') => this.setState({isShowingModal_remove: true, studentAssignmentResponseId, deleteFile })
  handleRemoveClose = () => this.setState({isShowingModal_remove: false })
  handleRemove = () => {
      const {handleClose, handleRemove, personId, deleteId} = this.props;
      handleRemove(personId, deleteId);
      handleClose();
      this.handleRemoveClose();
  }

  render() {
      const {fileUpload, handleClose, className, accessRoles={}, isOwner, isSubmitType, onSubmit} = this.props;
      const {isShowingModal_remove} = this.state;

      return (
          <div className={classes(styles.container, className)}>
              <ModalContainer onClose={handleClose} className={styles.zIndex}>
                  <ModalDialog onClose={handleClose} style={{ width: '95%', position: 'relative', top: '20'}}>
											<div ref={el => (this.componentRef = el)} className={styles.componentPrint}>
													<ImageDisplay linkText={''} url={fileUpload && (fileUpload.url || fileUpload.fileUrl)} isOwner={isOwner || accessRoles.observer} deleteFunction={this.handleRemoveOpen}/>
													{fileUpload &&
															<div>
																	<ReactToPrint trigger={() => <a href="#" className={classes(styles.printLink)}>
																			<Icon pathName={'printer'} premium={true} className={styles.icon}/>
																			<L p={p} t={`Print`}/></a>} content={() => this.componentRef}
																	/>
															</div>
													}
													{!isSubmitType &&
															<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Close`}/>} onClick={handleClose} />
													}
													{isSubmitType &&
															<div className={styles.row}>
																	<a className={globalStyles.cancelLink} onClick={handleClose}><L p={p} t={`Close`}/></a>
																	<ButtonWithIcon label={<L p={p} t={`Decline`}/>} icon={'cross_circle'} onClick={() => onSubmit('decline')} changeRed={true}/>
																	<ButtonWithIcon label={<L p={p} t={`Approve`}/>} icon={'checkmark_circle'} onClick={() => onSubmit('approve')}/>
															</div>
													}
											</div>
                  </ModalDialog>
              </ModalContainer>
							{isShowingModal_remove &&
	                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this file?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this file?`}/>} isConfirmType={true}
	                   onClick={this.handleRemove} />
	            }
          </div>
      )
    }
}
