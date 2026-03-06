import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './CarpoolAdminAreaEntryView.css';
const p = 'CarpoolAdminAreaEntryView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class CarpoolAdminAreaEntryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      carpoolAreaId: '',
      carpoolArea: {
				carpoolAreaId: '',
        areaName: '',
        description: '',
      },
      errors: {
        areaName: '',
        description: '',
      }
    }
  }

  changeArea = (event) => {
	    const field = event.target.name;
	    let carpoolArea = this.state.carpoolArea;
	    let errors = Object.assign({}, this.state.errors);
	    carpoolArea[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ carpoolArea, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateCarpoolArea, personId} = this.props;
      const {carpoolArea, errors} = this.state;
      let hasError = false;

      if (!carpoolArea.areaName) {
          hasError = true;
          this.setState({errors: { ...errors, areaName: <L p={p} t={`Area Name is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateCarpoolArea(personId, carpoolArea);
          this.setState({
              carpoolArea: {
									carpoolAreaId: '',
                  areaName: '',
                  description: '',
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleShowUsedInOpen = (requests) => {
			let listUsedIn = requests && requests.length > 0 && requests.join("<br/>");
			this.setState({isShowingModal_requests: true, listUsedIn });
	}
  handleShowUsedInClose = () => this.setState({isShowingModal_requests: false, listUsedIn: [] })

	handleRemoveItemOpen = (carpoolAreaId, requests) => {
			if (requests && requests.length > 0) {
					this.handleShowUsedInOpen(requests);
			} else {
					this.setState({isShowingModal_remove: true, carpoolAreaId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeCarpoolArea, personId} = this.props;
      const {carpoolAreaId} = this.state;
      removeCarpoolArea(personId, carpoolAreaId);
      this.handleRemoveItemClose();
  }

	handleEdit = (carpoolAreaId) => {
			const {carpoolAreas} = this.props;
			let carpoolArea = carpoolAreas && carpoolAreas.length > 0 && carpoolAreas.filter(m => m.carpoolAreaId === carpoolAreaId)[0];
			if (carpoolArea && carpoolArea.areaName) {
					carpoolArea.description = carpoolArea.description;
					this.setState({ carpoolArea })
			}
	}

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, carpoolAreas} = this.props;
    const {carpoolArea, errors, isShowingModal_remove, isShowingModal_requests} = this.state;

    let headings = [{}, {},
				{label: <L p={p} t={`Area name`}/>, tightText: true},
				{label: <L p={p} t={`Description`}/>, tightText: true},
				{label: <L p={p} t={`Requests`}/>, tightText: true}];

    let data = [];

    if (carpoolAreas && carpoolAreas.length > 0) {
        data = carpoolAreas.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.carpoolAreaId)} className={styles.edit}>
													<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
											</a>},
              {id: m.carpoolAreaId, value: <a onClick={() => this.handleRemoveItemOpen(m.carpoolAreaId, m.requests)} className={styles.remove}>
																								<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
																						</a>},
              {id: m.carpoolAreaId, value: m.areaName},
              {id: m.carpoolAreaId, value: m.description},
							{value: m.requests && m.requests.length, clickFunction: () => this.handleShowUsedInOpen(m.requests)},
            ])
        });
    } else {
        data = [[{value: ''}, {value: <i><L p={p} t={`No carpool area names entered yet.`}/></i> }]]
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Carpool Areas`}/>
            </div>
						<div className={styles.instructions}>
                {'The parent/guardian drivers can also add area names in case they want a specific area identified.'}
            </div>
            <div>
								<InputText
										id={'areaName'}
										name={'areaName'}
										value={carpoolArea.areaName}
										label={<L p={p} t={`Area name`}/>}
										size={"medium"}
										onChange={this.changeArea}
										required={true}
										whenFilled={carpoolArea && carpoolArea.areaName}
                    error={errors.areaName}/>
            </div>
						<div>
								<InputText
										id={'description'}
										name={'description'}
										value={carpoolArea.description}
										label={<L p={p} t={`Description (optional)`}/>}
										size={"long"}
										onChange={this.changeArea}/>
            </div>

						<div>
								<InputText
										id={'city'}
										name={'city'}
										value={carpoolArea.city}
										label={<L p={p} t={`City (optional)`}/>}
										size={"super-short"}
										onChange={this.changeArea}/>
            </div>

            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Carpool Areas`}/>} path={'carpoolAreas'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this carpool area?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this carpool area?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_requests &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Carpool Area has requests `}/>}
										explainJSX={<L p={p} t={`This carpool area has requests pending from other drivers.  This carpool area cannot be deleted until the requests have been deleted or answered.`}/>}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
