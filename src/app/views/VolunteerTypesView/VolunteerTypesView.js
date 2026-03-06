import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './VolunteerTypesView.css';
const p = 'VolunteerTypesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class VolunteerTypesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      volunteerTypeId: '',
      volunteerType: {
        name: '',
        sequence: props.volunteerTypes && props.volunteerTypes.length + 1,
      },
      errors: {
				name: '',
        sequence: '',
      }
    }
  }

  componentDidUpdate(prevProps) {
    	if (this.props.volunteerTypes !== prevProps.volunteerTypes) {
					this.setState({ volunteerType: {...this.state.volunteerType, sequence: this.props.volunteerTypes && this.props.volunteerTypes.length + 1 } });
			}
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let volunteerType = this.state.volunteerType;
	    let errors = Object.assign({}, this.state.errors);
	    volunteerType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      volunteerType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateVolunteerType, personId, volunteerTypes} = this.props;
      const {volunteerType, errors} = this.state;
      let hasError = false;


			if (!volunteerType.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!volunteerType.sequence) {
          hasError = true;
          this.setState({errors: { ...errors, sequence: <L p={p} t={`Sequence is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateVolunteerType(personId, volunteerType);
          this.setState({
              volunteerType: {
								name: '',
				        sequence: volunteerTypes && volunteerTypes.length + 1,
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

  handleRemoveItemOpen = (volunteerTypeId, usedIn) => this.setState({isShowingModal_remove: true, volunteerTypeId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeVolunteerType, personId} = this.props;
      const {volunteerTypeId} = this.state;
      removeVolunteerType(personId, volunteerTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (volunteerTypeId) => {
			const {volunteerTypes} = this.props;
			let volunteerType = volunteerTypes && volunteerTypes.length > 0 && volunteerTypes.filter(m => m.volunteerTypeId === volunteerTypeId)[0];
			if (volunteerType && volunteerType.name)
					this.setState({ volunteerType })
	}

  render() {
    const {volunteerTypes, sequences, fetchingRecord} = this.props;
    const {volunteerType, errors, isShowingModal_remove} = this.state;
    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Sequence`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (volunteerTypes && volunteerTypes.length > 0) {
        data = volunteerTypes.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.volunteerTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.volunteerTypeId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.sequence},
							{value: m.usedIn && m.usedIn.length},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {'Volunteer Type Setting'}
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={volunteerType.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={volunteerType.name}
								error={errors.name} />
						<div>
								<SelectSingleDropDown
										id={'sequence'}
										label={<L p={p} t={`Sequence (for list display)`}/>}
										value={volunteerType.sequence || ''}
										noBlank={true}
										options={sequences}
										className={styles.dropdown}
										onChange={this.handleChange}/>
						</div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink} isFetchingRecord={fetchingRecord.volunteerTypes}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this volunteer type?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this volunteer type?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
      </div>
    );
  }
}
