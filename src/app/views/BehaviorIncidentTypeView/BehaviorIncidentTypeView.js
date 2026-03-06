import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './BehaviorIncidentTypeView.css';
const p = 'BehaviorIncidentTypeView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class BehaviorIncidentTypeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      behaviorIncidentTypeId: '',
      behaviorIncidentType: {
        name: '',
				level: '',
        sequence: props.behaviorIncidentTypes && props.behaviorIncidentTypes.length + 1,
      },
      errors: {
				name: '',
        sequence: '',
      }
    }
  }

  componentDidUpdate(prevProps) {
    	if (this.props.behaviorIncidentTypes !== prevProps.behaviorIncidentTypes) {
					this.setState({ behaviorIncidentType: {...this.state.behaviorIncidentType, sequence: this.props.behaviorIncidentTypes && this.props.behaviorIncidentTypes.length + 1 } });
			}
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let behaviorIncidentType = Object.assign({}, this.state.behaviorIncidentType);
	    let errors = Object.assign({}, this.state.errors);
	    behaviorIncidentType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      behaviorIncidentType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateBehaviorIncidentType, personId} = this.props;
      const {behaviorIncidentType, errors} = this.state;
      let hasError = false;


			if (!behaviorIncidentType.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!behaviorIncidentType.name) {
          hasError = true;
          this.setState({errors: { ...errors, level: <L p={p} t={`Level is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateBehaviorIncidentType(personId, behaviorIncidentType);
          this.setState({
              behaviorIncidentType: {
								name: '',
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/firstNav`)
		      }
      }
  }

  handleRemoveItemOpen = (behaviorIncidentTypeId) => this.setState({isShowingModal_remove: true, behaviorIncidentTypeId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeBehaviorIncidentType, personId} = this.props;
      const {behaviorIncidentTypeId} = this.state;
      removeBehaviorIncidentType(personId, behaviorIncidentTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (behaviorIncidentTypeId) => {
			const {behaviorIncidentTypes} = this.props;
			let behaviorIncidentType = behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.behaviorIncidentTypeId === behaviorIncidentTypeId)[0];
			if (behaviorIncidentType && behaviorIncidentType.name)
					this.setState({ behaviorIncidentType })
	}

  render() {
    const {behaviorIncidentTypes, levels} = this.props;
    const {behaviorIncidentType, errors, isShowingModal_remove} = this.state;
    let headings = [{}, {},
			{label: 'Level', tightText: true},
			{label: 'Name', tightText: true},
		];

    let data = [];

    if (behaviorIncidentTypes && behaviorIncidentTypes.length > 0) {
        data = behaviorIncidentTypes.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.behaviorIncidentTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.behaviorIncidentTypeId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.level},
							{value: m.name},
            ])
        });
    } else {
        data = [[{value: ''}, {value: <i>No behaviorIncident types entered yet.</i> }]]
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Behavior Incident Types`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={behaviorIncidentType.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={behaviorIncidentType.name}
								error={errors.name} />
						<div>
								<SelectSingleDropDown
										id={`level`}
										name={<L p={p} t={`level`}/>}
										label={<L p={p} t={`Level`}/>}
										value={behaviorIncidentType.level || ''}
										options={levels}
										className={styles.moreBottomMargin}
										height={`medium`}
										onChange={this.handleChange}
										required={true}
										whenFilled={behaviorIncidentType.level}
										error={errors.level} />
						</div>
						<div className={globalStyles.instructionsBigger}>
								<L p={p} t={`Level 1: Minor acts of misconduct that interfece with orderly operatino of the classroom and school.`}/>
						</div>
						<div className={globalStyles.instructionsBigger}>
								<L p={p} t={`Level 2: more serious and disruptive than level1.  Minor acts directed against others.`}/>
						</div>
						<div className={globalStyles.instructionsBigger}>
								<L p={p} t={`Level 3: Repeat offenders and major acts of misconduct including threats to health, safety and property.`}/>
						</div>
	          <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this Behavior Incident Type?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this behavior incident type?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
      </div>
    );
  }
}
