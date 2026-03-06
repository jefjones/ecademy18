import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './SchoolDaysSettingsView.css';
const p = 'SchoolDaysSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Checkbox from '../../components/Checkbox';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class SchoolDaysSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
				isShowingModal: false,
				monday: props.companyConfig.monday,
				tuesday: props.companyConfig.tuesday,
				wednesday: props.companyConfig.wednesday,
				thursday: props.companyConfig.thursday,
				friday: props.companyConfig.friday,
				saturday: props.companyConfig.saturday,
				sunday: props.companyConfig.sunday,
    }
  }

  handleChange = (field) => {
			const {setCompanyConfig, personId} = this.props;
	    let newState = Object.assign({}, this.state);
	    newState[field] = !newState[field];
    	this.setState(newState);
			setCompanyConfig(personId, field, newState[field])
			this.validateEntry(newState);
  }

	validateEntry = (newState, donePress=false) => {
			const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = newState ? newState : this.state;
			if (!monday && !tuesday && !wednesday && !thursday && !friday && !saturday && !sunday) {
					this.handleNoChosenOpen();
			} else {
					donePress && browserHistory.push('/schoolSettings');
			}

	}

  handleNoChosenOpen = () => this.setState({isShowingModal: true })
  handleNoChosenClose = () => this.setState({isShowingModal: false })

  render() {
			const {isShowingModal} = this.props;
    	return (
	        <div className={styles.container}>
	            <div className={globalStyles.pageTitle}>
	                <L p={p} t={`School Days Settings`}/>
	            </div>
							<div className={styles.instructions}>
									Mark which days the school would have at least one class
							</div>
							<div className={styles.moreLeft}>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'monday'}
													label={<L p={p} t={`Monday`}/>}
													checked={this.state.monday}
													onClick={() => this.handleChange('monday')}
													labelClass={styles.label}/>
									</div>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'tuesday'}
													label={<L p={p} t={`Tuesday`}/>}
													checked={this.state.tuesday}
													onClick={() => this.handleChange('tuesday')}
													labelClass={styles.label}/>
									</div>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'wednesday'}
													label={<L p={p} t={`Wednesday`}/>}
													checked={this.state.wednesday}
													onClick={() => this.handleChange('wednesday')}
													labelClass={styles.label}/>
									</div>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'thursday'}
													label={<L p={p} t={`Thursday`}/>}
													checked={this.state.thursday}
													onClick={() => this.handleChange('thursday')}
													labelClass={styles.label}/>
									</div>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'friday'}
													label={<L p={p} t={`Friday`}/>}
													checked={this.state.friday}
													onClick={() => this.handleChange('friday')}
													labelClass={styles.label}/>
									</div>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'saturday'}
													label={<L p={p} t={`Saturday`}/>}
													checked={this.state.saturday}
													onClick={() => this.handleChange('saturday')}
													labelClass={styles.label}/>
									</div>
									<div className={styles.checkboxSpace}>
											<Checkbox
													id={'sunday'}
													label={<L p={p} t={`Sunday`}/>}
													checked={this.state.sunday}
													onClick={() => this.handleChange('sunday')}
													labelClass={styles.label}/>
									</div>
							</div>
	            <div className={styles.rowRight}>
									<ButtonWithIcon label={<L p={p} t={`Done`}/>} icon={'checkmark_circle'} onClick={() => this.validateEntry(null, true)}/>
	            </div>
	            <OneFJefFooter />
	            {isShowingModal &&
	                <MessageModal handleClose={this.handleNoChosenClose} heading={<L p={p} t={`No days chosen`}/>}
	                   explainJSX={<L p={p} t={`At least one day is required on which one or more classes would occur.`}/>} isConfirmType={true}
	                   onClick={this.handleNoChosen} />
	            }
	      	</div>
      );
	}
}
