import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import {browserHistory} from 'react-router';
import styles from './CarContactManagerView.css';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import Loading from '../../components/Loading';
import ImageDisplay from '../../components/ImageDisplay';
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop';
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
import DateMoment from '../../components/DateMoment';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import {guidEmpty} from '../../utils/guidValidate.js';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';
import {formatPhoneNumber} from '../../utils/numberFormat.js';

const mapStyles = {
  width: '100%',
  height: '100%'
};

class CarContactManagerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      carContactId: '',
      carContact: {
          carContactId: '',
          ownerName: '',
          address: '',
          contactName: '',
          role: '',
          emailAddress: '',
          phoneNumber: '',
          returnDate: '',
          note: '',
          usStateId: props.personConfig.choices['CarContact_usStateId'],
      },
      errors: {
        ownerName: '',
        contactName: '',
      },
      filters: {
        ownerNameFilter: '',
        contactNameFilter: '',
        openSearch: '',
      },
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    }
  }

  componentDidMount() {
    //document.getElementById('returnDate').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
  }

  changeContact = (event) => {
      const {setPersonConfigChoice, personId} = this.props;
	    const field = event.target.name;
	    let carContact = Object.assign({},this.state.carContact);
	    let errors = Object.assign({}, this.state.errors);
	    carContact[field] = event.target.value;
	    errors[field] = '';
      if (field === 'usStateId') setPersonConfigChoice(personId, 'CarContact_usStateId', event.target.value);

	    this.setState({
		      carContact,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateCarContact, personId, personConfig} = this.props;
      const {carContact} = this.state;
      let hasError = false;

      // if (!carContact.ownerName) {
      //     hasError = true;
      //     this.setState({errors: { ...errors, ownerName: "Owner name is required" }});
      // }
      // if (!carContact.contactName) {
      //     hasError = true;
      //     this.setState({errors: { ...errors, contactName: "Contact name is required" }});
      // }
      // if (!carContact.usStateId) {
      //     hasError = true;
      //     this.setState({errors: { ...errors, usStateId: "US State is required" }});
      // }

      if (!hasError) {
          if (carContact.returnDate && carContact.returnDate.indexOf('T') > -1) carContact.returnDate = carContact.returnDate.substring(0, carContact.returnDate.indexOf('T'));
          if (carContact.returnDate && carContact.returnTime) {
              carContact.returnDate = carContact.returnDate + ' ' + carContact.returnTime;
          }
          delete carContact.returnTime;
          addOrUpdateCarContact(personId, carContact);
          this.setState({
              expanded: '',
              carContact: {
                carContactId: '',
                ownerName: '',
                address: '',
                contactName: '',
                role: '',
                emailAddress: '',
                phoneNumber: '',
                returnDate: '',
                note: '',
                files: [],
                selectedFile: '',
                usStateId: personConfig.choices['CarContact_usStateId'],
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/firstNav`)
		      }
      }
  }

	handleRemoveItemOpen = (carContactId) => this.setState({isShowingModal_remove: true, carContactId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false, carContactId: '' })
  handleRemoveItem = () => {
      const {removeCarContact, personId} = this.props;
      const {carContactId} = this.state;
      removeCarContact(personId, carContactId);
      this.handleRemoveItemClose();
  }

	handleEdit = (carContactId) => {
			const {carContacts} = this.props;
			let carContact = carContacts && carContacts.length > 0 && carContacts.filter(m => m.carContactId === carContactId)[0];
			if (carContact && carContact.returnDate) {
					carContact.returnTime = carContact.returnDate.indexOf('T') > -1 ? carContact.returnDate.substring(carContact.returnDate.indexOf('T') + 1) : carContact.returnDate;
			}
      this.setState({ carContact })
			this.handleExpansionChange('panel1')(event, true);
      document.getElementById('ownerName').focus();
	}

	changeDate = (field, event) => {
    let carContact = Object.assign({}, this.state.carContact);
    carContact[field] = event.target.value;

    this.setState({
        carContact,
    });
	}

  handleExpansionChange = panel => (event, expanded) => {
      this.setState({
          expanded: expanded ? panel : false,
          hasChangedExpanded: true,
      });
      document.getElementById('ownerName').focus();
  };

  cancelAddNew = () => {
    this.setState({
        expanded: '',
        carContact: {
          carContactId: '',
          ownerName: '',
          address: '',
          contactName: '',
          role: '',
          emailAddress: '',
          phoneNumber: '',
          returnDate: '',
          note: '',
          files: [],
          selectedFile: '',
        },
    });
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
      const {carContact} = this.state;
      let data = new FormData();
      data.append('file', selectedFile)

      let carContactId = carContact.carContactId && carContact.carContactId !== '0' ? carContact.carContactId : guidEmpty;

      let url = `${apiHost}ebi/carContact/fileUpload/${personId}/${carContactId}`

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
              let newCarContact = Object.assign({}, this.state.carContact);
              if (!newCarContact) newCarContact = {};
              if (!newCarContact.carContactId || newCarContact.carContactId === '0') {
                  newCarContact.carContactId = response.data.carContactId;
              }
              this.setState({
                  carContact: newCarContact,
                  files: response.data.files,
                  loadingFile: false,
              });
          })
          .catch(function (error) {
            //Show error here.
          })
      this.handleFileUploadClose();
  }

  handleFileUploadOpen = () => this.setState({ isShowingFileUpload: true, loadingFile: true })
  handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
  handleFileUploadSubmit = () => {
      const {personId} = this.props;
      const {carContact, selectedFile} = this.state;
      let data = new FormData();
      data.append('file', selectedFile)

      let carContactId = carContact.carContactId && carContact.carContactId !== '0' ? carContact.carContactId : guidEmpty;

      let url = `${apiHost}ebi/carContact/fileUpload/${personId}/${carContactId}`

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
              let newCarContact = Object.assign({}, this.state.carContact);
              if (!newCarContact) newCarContact = {};
              if (!newCarContact.carContactId || newCarContact.carContactId === '0') {
                  newCarContact.carContactId = response.data.carContactId;
              }
              this.setState({
                  carContact: newCarContact,
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
      const {removeCarContactFileUpload, personId} = this.props;
      const {fileUpload} = this.state;
      this.handleRemoveFileUploadClose();
      removeCarContactFileUpload(personId, fileUpload.fileUploadId)
      let files = Object.assign([], this.state.files);
      files = files.filter(m => m.fileUploadId !== fileUpload.fileUploadId);
      this.setState({ files });
  }

  handleInputFile = (file) => this.setState({ selectedFile: file })

  handleDocumentOpen = (fileUpload) => this.setState({ isShowingModal_document: true, fileUpload })
  handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {} })

  handleShowGPSOpen = (carContactChosen) => this.setState({ isShowingModal_gps: true, carContactChosen });
  handleShowGPSClose = () => this.setState({isShowingModal_gps: false, carContactChosen: {} })

  getGPSLocation = () => {
  		if(navigator.geolocation) {
  			   navigator.geolocation.getCurrentPosition(this.displayLocation, this.displayError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
  		} else {
  			   console.log("Geo Location not supported by browser");
  		}
	}

  displayLocation = (position) => {
  		let carContact = Object.assign([], this.state.carContact);
      carContact.longitude = position.coords.longitude;
      carContact.latitude = position.coords.latitude;
  		this.setState({ carContact });
	}

  displayError = (error) => {
			let errors = ['Unknown error', 'Persmission denied by user', 'Position not available', 'timeout error'];
			this.setState({ message: errors[error.code] + ', ' + error.message })
	}

  onMarkerClick = (props, marker, e) => this.setState({ selectedPlace: props, activeMarker: marker, showingInfoWindow: true });
  onClose = props => {if (this.state.showingInfoWindow)  this.setState({ showingInfoWindow: false, activeMarker: null });}

  handleFormatPhone = () => {
      const {carContact} = this.state;
      if (carContact.phoneNumber && ('' + carContact.phoneNumber).replace(/\D/g, '').length !== 10) {
          this.setState({errorPhone: `The phone number entered is not 10 digits` });
      } else if (formatPhoneNumber(carContact.phoneNumber)) {
          this.setState({
              errorPhone: '',
              carContact: {...this.state.carContact, phoneNumber: formatPhoneNumber(carContact.phoneNumber)}
          })
      }
  }

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, carContacts, fetchingRecord, removeCarContactFileUpload, usStates} = this.props;
    const {carContact={}, errors, isShowingModal_remove, isShowingModal_usedIn, listUsedIn, expanded, filter={}, isShowingFileUpload, isShowingModal_gps,
            isShowingModal_removeFileUpload, selectedFile, loadingFile, files, isShowingModal_document, fileUpload, carContactChosen={}, errorPhone} = this.state;
    let localCars = carContacts;

    if (filter.ownerNameFilter) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.ownerName.toLowerCase().indexOf(filter.ownerNameFilter.toLowerCase()) > -1);
    if (filter.contactNameFilter) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.contactName.toLowerCase().indexOf(filter.contactNameFilter.toLowerCase()) > -1);
    if (filter.usStateId && filter.usStateId != 0) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.usStateId == filter.usStateId); //eslint-disable-line
    if (filter.openSearch) localCars = localCars && localCars.length > 0 && localCars.filter(m => m.ownerName.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
        || m.ownerName.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
        || m.contactName.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
        || m.notes.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
        || m.phone.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1
        || m.emailAddress.toLowerCase().indexOf(filter.openSearch.toLowerCase()) > -1);

    let headings = [{}, {},
      {label: 'Owner name', tightText: true},
      {label: 'Files', tightText: true},
      {label: 'GPS', tightText: true},
    	{label: 'Address', tightText: true},
    	{label: 'Contact name', tightText: true},
    	{label: 'Role', tightText: true},
    	{label: 'Email address', tightText: true},
    	{label: 'Phone number', tightText: true},
    	{label: 'Return date', tightText: true},
    	{label: 'Note', tightText: true},
    ];

    let data = [];

    if (localCars && localCars.length > 0) {
        data = localCars.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.carContactId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.carContactId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
              {value: m.ownerName},
              {value: <div className={styles.row}>
                          {m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
                              <a key={i} onClick={() => this.handleDocumentOpen(f)}>
                                  <Icon pathName={'document0'} premium={true} className={styles.iconCell} />
                              </a>
                           )}
                      </div>
              },
              {value: m.longitude ? 'GPS' : '',
                  clickFunction: () => this.handleShowGPSOpen(m),
              },
              {value: m.address},
              {value: m.contactName},
              {value: m.role},
              {value: m.emailAddress},
              {value: m.phoneNumber},
              {value: <DateMoment date={m.returnDate} minusHours={0}/>},
              {value: m.note},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={classes(styles.moreBottom, globalStyles.pageTitle)}>
                {'Car Contact Manager'}
            </div>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleExpansionChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
                    <div className={styles.row}>
                      	<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
                        <span className={styles.text}>Add new contact</span>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div>
            						<div className={classes(styles.row, styles.littleLeft)}>
            								<InputText
            										name={'ownerName'}
            										value={carContact.ownerName || ''}
            										label={'Owner'}
            										maxLength={150}
            										size={'medium-long'}
            										onChange={this.changeContact}
                                error={errors.ownerName}/>
            						</div>
                        <div>
                            <SelectSingleDropDown
                                id={`usStateId`}
                                name={`usStateId`}
                                label={'US State'}
                                value={carContact.usStateId || ''}
                                options={usStates}
                                className={styles.moreBottomMargin}
                                height={`medium`}
                                onChange={this.changeContact}
                                error={errors.usStateId}/>
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
    														value={carContact.latitude || ''}
    														onChange={this.handleChange}
    														inputClassName={styles.moreLeft} />
    												<InputText
                                label={"Longitude"}
    														id={`longitude`}
    														name={`longitude`}
    														size={"medium-short"}
    														numberOnly={true}
    														value={carContact.longitude || ''}
    														onChange={this.handleChange}
    														inputClassName={styles.moreLeft} />
                        </div>
                        <hr/>
                        <div className={classes(styles.row, styles.littleLeft)}>
                            <InputText
                                name={'address'}
                                value={carContact.address || ''}
                                label={'Address'}
                                maxLength={200}
                                size={'medium-long'}
                                onChange={this.changeContact}/>
                        </div>
                        <div className={classes(styles.row, styles.littleLeft)}>
                            <InputText
                                name={'contactName'}
                                value={carContact.contactName || ''}
                                label={'Contact last name'}
                                maxLength={25}
                                size={'medium-short'}
                                onChange={this.changeContact}
                                error={errors.contactName}/>
                        </div>
                        <div className={classes(styles.row, styles.littleLeft)}>
                            <InputText
                                name={'role'}
                                value={carContact.role || ''}
                                label={'Role'}
                                maxLength={50}
                                size={'medium'}
                                onChange={this.changeContact}/>
                        </div>
                        <div className={classes(styles.row, styles.littleLeft)}>
                            <InputText
                                name={'emailAddress'}
                                value={carContact.emailAddress || ''}
                                label={'Email address'}
                                maxLength={50}
                                size={'medium'}
                                onChange={this.changeContact}/>
                        </div>
                        <div className={classes(styles.row, styles.littleLeft)}>
                            <InputText
                                name={'phoneNumber'}
                                value={carContact.phoneNumber || ''}
                                label={'Phone number'}
                                maxLength={15}
                                size={'medium'}
                                onChange={this.changeContact}
                                onBlur={this.handleFormatPhone}
                                error={errorPhone}/>
                        </div>
												<div className={classes(styles.moreTopMargin, styles.littleLeft)}>
                            <InputTextArea label={'Notes'} name={'note'} value={carContact.note} onChange={this.changeContact} maxLength={2000}
																columns={100} rows={20}/>
                        </div>
                        <div>
                            <InputFile label={'Include a picture'} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
														{/*<div className={classes(styles.row, styles.muchTop, styles.moreLeft)} onClick={this.handleFileUploadOpen}>
																<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
																<div className={classes(globalStyles.link, styles.linkPosition)}>Upload picture</div>
														</div>*/}
														<Loading isLoading={loadingFile} />
														{files && files.length > 0 && files.map((f, i) =>
																<div key={i}>
																		<ImageDisplay linkText={''} url={f.fileUrl} isOwner={f.entryPersonId === personId} fileUploadId={f.fileUploadId}
																				deleteFunction={() => this.handleRemoveFileUploadOpen(f)} deleteId={carContact.carContactId}/>
																</div>
														)}
												</div>
                        <div className={styles.dateTime}>
                            <DateTimePicker id={`returnDate`} label={'Return date'} value={carContact.returnDate || ''} onChange={(event) => this.changeDate('returnDate', event)}/>
                        </div>
                        <div className={styles.dateColumn}>
                            <span className={styles.label}>Return time</span>
                            <input type="time" name={'returnTime'} onChange={this.changeContact} value={carContact.returnTime || ''} className={styles.timePicker}/>
                        </div>
                        <div className={classes(styles.row, styles.lotLeft)}>
            								<div className={styles.cancelLink} onClick={this.cancelAddNew}>Close</div>
														<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <div className={classes(styles.row, styles.moreTop)}>
              <Icon pathName={'magnifier'} premium={true} className={classes(styles.moreTop, styles.iconRight)}/>
              <div className={classes(styles.moreSpace, styles.text, styles.moreTop)}>Filters</div>
              <div className={styles.moreLeft}>
                  <InputText
                      label={`Owner`}
                      name={'ownerNameFilter'}
                      value={(filter && filter.ownerNameFilter) || ''}
                      maxLength={25}
                      size={'short'}
                      onChange={this.handleFilterChnage}/>
              </div>
              <div className={styles.moreLeft}>
                  <InputText
                      label={`Contact name`}
                      name={'contactNameFilter'}
                      value={(filter && filter.contactNameFilter) || ''}
                      maxLength={25}
                      size={'short'}
                      onChange={this.handleFilterChnage}/>
              </div>
              <div className={styles.moreLeft}>
                  <SelectSingleDropDown
                      id={`usStateId`}
                      label={'US State'}
                      value={(filter && filter.usStateId) || ''}
                      options={usStates}
                      className={styles.moreBottomMargin}
                      height={`medium`}
                      onChange={this.handleFilterChnage}/>
              </div>
              <div className={classes(styles.row, styles.littleLeft)}>
                  <InputText
                      name={'openSearch'}
                      value={(filter && filter.openSearch) || ''}
                      label={'Open search'}
                      maxLength={15}
                      size={'medium'}
                      onChange={this.hhandleFilterChnage}/>
              </div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink} isFetchingRecord={fetchingRecord.carContactManager}/>
            <hr />
						<MyFrequentPlaces personId={personId} pageName={'Car Contact Manager'} path={'carContactManager'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={`Remove this car contact?`}
                   explain={`Are you sure you want to delete this car contact?`} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={`This Class Period is used in these Courses`}
										explain={'In order to delete this class period, please reassign the following courses with a different class period setting:<br/><br/>' + listUsedIn}
										onClick={this.handleShowUsedInClose}/>
            }
            {isShowingFileUpload &&
								<FileUploadModalWithCrop handleClose={this.handleFileUploadClose} title={'Choose File or Image'}
										personId={personId} submitFileUpload={this.handleFileUploadSubmit}
										file={selectedFile}
										handleInputFile={this.handleInputFile}
										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .m4a"}
										handleCancelFile={()=>{}}/>
            }
						{isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={`Remove this file or image?`}
                   explain={`Are you sure you want to delete this file or image?`} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
            {isShowingModal_document &&
								<div className={styles.fullWidth}>
										{<DocumentViewOnlyModal handleClose={this.handleDocumentClose} showTitle={true} handleSubmit={this.handleDocumentClose} fileUpload={fileUpload}
                        isOwner={true} handleRemove={removeCarContactFileUpload} deleteId={fileUpload.fileUploadId}/>}
								</div>
						}
            {isShowingModal_gps &&
                <MessageModal handleClose={this.handleShowGPSClose} heading={carContactChosen.ownerName}
  									explainJSX={<div style={{width: '320px', height: '320px'}}>
                                   <Map google={this.props.google} zoom={14} style={mapStyles} initialCenter={{ lat: carContactChosen.latitude, lng: carContactChosen.longitude }}>
                                      <Marker onClick={this.onMarkerClick} name={carContactChosen.ownerName} />
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
})(CarContactManagerView);
