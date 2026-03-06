import React, {Component} from 'react';
import styles from './ImageViewerModal.css';
import ButtonWithIcon from '../ButtonWithIcon';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import Iframe from 'react-iframe'
const p = 'component';
import L from '../../components/PageLanguage';

export default class ImageViewerModal extends Component {
  constructor(props) {
      super(props);

      this.state = {
					responseVisitedTypeCode: props.clickedUrl && props.clickedUrl.responseVisitedTypeCode
      }
	}

  render() {
      const {handleClose, fileUrl, headerDisplay} = this.props;

      return (
          <div className={styles.container}>
              <ModalContainer onClose={handleClose} >
                  <ModalDialog onClose={handleClose} style={{ width: '95%', position: 'relative', top: '20'}}>
											<div>{headerDisplay}</div>
											<Iframe url={fileUrl}
													width="100%"
													height="450px"
													display="initial"
													position="relative"
													allowFullScreen/>
											<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={handleClose} />
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
    }
}
