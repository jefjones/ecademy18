import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import {browserHistory} from 'react-router';
import styles from './GalleryAddView.css';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import Loading from '../../components/Loading';
import ImageDisplay from '../../components/ImageDisplay';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import DateTimePicker from '../../components/DateTimePicker';
import InputFile from '../../components/InputFile';
import InputTextArea from '../../components/InputTextArea';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import {guidEmpty} from '../../utils/guidValidate.js';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';
import {formatPhoneNumber} from '../../utils/numberFormat.js';

const mapStyles = {
  width: '100%',
  height: '100%'
};

class GalleryAddView extends Component {
  constructor(props) {
    super(props);
    this.resetRecord();
  }

  resetRecord = () => {
      this.state = {
          isShowingModal_remove: false,
          galleryFileId: '',
          gallaryFile: {
              galleryFileId: '',
              fileUrl: '',
              description: '',
              expireDate: '',
              latitude: '',
              longitude: '',
              hide: '',
              personAssign: [],
              classAssign: [],
              personInPicture: [],
              parentAccess: [],
              courseInPicture: [],
          },
          errors: {
              file: '',
          },
      }
  }

  changeRecord = (event) => {
	    const field = event.target.name;
	    let galleryFile = Object.assign({},this.state.galleryFile);
	    let errors = Object.assign({}, this.state.errors);
	    galleryFile[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ galleryFile, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateGalleryFile, personId} = this.props;
      const {galleryFile, errors} = this.state;
      let hasError = false;

      if (!galleryFile.file) {
          hasError = true;
          this.setState({errors: { ...errors, file: "A picture is required" }});
      }

      if (!hasError) {
          addOrUpdateGalleryFile(personId, galleryFile);
          this.setState({
              galleryFile: {
                  galleryFileId: '',
                  fileUrl: '',
                  description: '',
                  expireDate: '',
                  latitude: '',
                  longitude: '',
                  hide: '',
                  // personAssign: [],  Don't reset these unless you do a reset for the page.  Then the user can take more than oen picture with the same settings.
                  // classAssign: [],
                  // personInPicture: [],
                  // parentAccess: [],
                  // courseInPicture: [],
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/firstNav`)
		      }
      }
  }

	changeDate = (field, event) => {
    let galleryFile = Object.assign({}, this.state.galleryFile);
    galleryFile[field] = event.target.value;
    this.setState({ galleryFile });
	}

  handlePartialOwnerEnterKey = (event) => {
      event.key === "Enter" && this.setPartialOwnerText();
  }

  handleFilterChnage = ({target}) => {
    let filter = Object.assign({},this.state.filter);
    filter[target.name] = target.value;
    this.setState({filter});
  }

  handleInputFile = (selectedFile) => {
      const {personId} = this.props;
      const {galleryFile} = this.state;
      let data = new FormData();
      data.append('file', selectedFile)

      let galleryFileId = galleryFile.galleryFileId && galleryFile.galleryFileId !== '0' ? galleryFile.galleryFileId : guidEmpty;

      let url = `${apiHost}ebi/galleryFile/fileUpload/${personId}/${galleryFileId}`

      axios.post(url, data,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials' : 'true',
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
              "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
              "Authorization": "Bearer " + localStorage.getItem("authToken"),
          }})
          .then(response => {
              let newGalleryFile = Object.assign({}, this.state.galleryFile);
              if (!newGalleryFile) newGalleryFile = {};
              if (!newGalleryFile.galleryFileId || newGalleryFile.galleryFileId === '0') {
                  newGalleryFile.galleryFileId = response.data.galleryFileId;
              }
              this.setState({
                  galleryFile: newGalleryFile,
                  files: response.data.files,
                  loadingFile: false,
              });
          })
          .catch(function (error) {
            //Show error here.
          })
      this.handleFileUploadClose();
  }

  handleRemoveFileUploadOpen = (fileUpload) => this.setState({isShowingModal_removeFileUpload: true, fileUpload })
  handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false })
  handleRemoveFileUpload = () => {
      const {removeGalleryFileUpload, personId} = this.props;
      const {fileUpload} = this.state;
      this.handleRemoveFileUploadClose();
      removeGalleryFileUpload(personId, fileUpload.fileUploadId)
      let files = Object.assign([], this.state.files);
      files = files.filter(m => m.fileUploadId !== fileUpload.fileUploadId);
      this.setState({ files });
  }

  handleInputFile = (file) => this.setState({ selectedFile: file })

  handleDocumentOpen = (fileUpload) => this.setState({ isShowingModal_document: true, fileUpload })
  handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {} })

  handleShowGPSOpen = (galleryFileChosen) => this.setState({ isShowingModal_gps: true, galleryFileChosen });
  handleShowGPSClose = () => this.setState({isShowingModal_gps: false, galleryFileChosen: {} })

  getGPSLocation = () => {
  		if(navigator.geolocation) {
  			   navigator.geolocation.getCurrentPosition(this.displayLocation, this.displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
  		} else {
  			   console.log("Geo Location not supported by browser");
  		}
	}

  displayLocation = (position) => {
  		let galleryFile = Object.assign([], this.state.galleryFile);
      galleryFile.longitude = position.coords.longitude;
      galleryFile.latitude = position.coords.latitude;
  		this.setState({ galleryFile });
	}

  displayError = (error) => {
			let errors = ['Unknown error', 'Persmission denied by user', 'Position not available', 'timeout error'];
			this.setState({ message: errors[error.code] + ', ' + error.message })
	}

  onMarkerClick = (props, marker, e) => this.setState({ selectedPlace: props, activeMarker: marker, showingInfoWindow: true });
  onClose = props => {if (this.state.showingInfoWindow)  this.setState({ showingInfoWindow: false, activeMarker: null });}

  handleFormatPhone = () => {
      const {galleryFile} = this.state;
      if (galleryFile.phoneNumber && ('' + galleryFile.phoneNumber).replace(/\D/g, '').length !== 10) {
          this.setState({errorPhone: `The phone number entered is not 10 digits` });
      } else if (formatPhoneNumber(galleryFile.phoneNumber)) {
          this.setState({
              errorPhone: '',
              galleryFile: {...this.state.galleryFile, phoneNumber: formatPhoneNumber(galleryFile.phoneNumber)}
          })
      }
  }

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace} = this.props;
    const {galleryFile={}, errors, isShowingModal_gps, isShowingModal_removeFileUpload, files, galleryFileChosen={}} = this.state;

    return (
        <div className={styles.container}>
            <div className={classes(styles.moreBottom, globalStyles.pageTitle)}>
                {'Add Gallery Photo'}
            </div>
						<div className={classes(styles.row, styles.littleLeft)}>
								<InputText
										name={'description'}
										value={galleryFile.description || ''}
										label={'Owner'}
										maxLength={150}
										size={'medium-long'}
										onChange={this.changeRecord}
                    error={errors.description}/>
						</div>
            <div className={styles.row}>
                <div>
                    <ButtonWithIcon label={'Set GPS Location'} icon={'checkmark_circle'} onClick={(event) => this.getGPSLocation()}/>
                </div>
								<InputText
                    label={"Latitude"}
										id={`latitude`}
										name={`latitude`}
										size={"medium-short"}
										numberOnly={true}
										value={galleryFile.latitude || ''}
										onChange={this.handleChange}
										inputClassName={styles.moreLeft} />
								<InputText
                    label={"Longitude"}
										id={`longitude`}
										name={`longitude`}
										size={"medium-short"}
										numberOnly={true}
										value={galleryFile.longitude || ''}
										onChange={this.handleChange}
										inputClassName={styles.moreLeft} />
            </div>
            {/*
              student lists and parent lists here.
            */}
            <div>
                <InputFile label={'Add a picture'} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
								{files && files.length > 0 && files.map((f, i) =>
										<div key={i}>
												<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId} fileUploadId={f.fileUploadId}
														deleteFunction={() => this.handleRemoveFileUploadOpen(f)} deleteId={galleryFile.galleryFileId}/>
										</div>
								)}
						</div>
            <div className={styles.dateTime}>
                <DateTimePicker id={`expireDate`} label={'Return date'} value={galleryFile.expireDate || ''} onChange={(event) => this.changeDate('expireDate', event)}/>
            </div>
            <div className={classes(styles.row, styles.lotLeft)}>
								<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
						<MyFrequentPlaces personId={personId} pageName={'Add Gallery Photo'} path={'gallaryAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
						{isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={`Remove this gallery photo?`}
                   explain={`Are you sure you want to delete this gallery photo?`} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
            {isShowingModal_gps &&
                <MessageModal handleClose={this.handleShowGPSClose} heading={galleryFileChosen.description}
  									explainJSX={<div style={{width: '320px', height: '320px'}}>
                                   <Map google={this.props.google} zoom={14} style={mapStyles} initialCenter={{ lat: galleryFileChosen.latitude, lng: galleryFileChosen.longitude }}>
                                      <Marker onClick={this.onMarkerClick} name={galleryFileChosen.description} />
                                      <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow} onClose={this.onClose} >
                                          <div>
                                            <h4>{this.state.selectedPlace.name}</h4>
                                          </div>
                                      </InfoWindow>
                                  </Map>
                              </div>
                    }
  									onClick={this.handleShowGPSClose}/>
            }
				</div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVIYKu3n6REqA8Xr48NdApEvIon1ane8M'
})(GalleryAddView);
