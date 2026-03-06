import React, {Component} from 'react';  //PropTypes
import styles from './OpenRegistrationsList.css';
import EditTable from '../EditTable';
import Icon from '../Icon';
import DateMoment from '../DateMoment';
import MessageModal from '../MessageModal';
const p = 'component';
import L from '../../components/PageLanguage';

export default class OpenRegistrationsList extends Component {
	    constructor(props) {
	      super(props);

	      this.state = {
						openRegistrationTableId: '',
						isShowingModal_remove: false,
				}
		}

		handleRemoveOpen = (openRegistrationTableId) => this.setState({ isShowingModal_remove: true, openRegistrationTableId });
		handleRemoveClose = () => this.setState({ isShowingModal_remove: false, openRegistrationTableId: '' });
		handleRemove = () => {
				const {removeOpenRegistration, personId} = this.props;
				const {openRegistrationTableId} = this.state;
				removeOpenRegistration(personId, openRegistrationTableId)
				this.handleRemoveClose();
		}

		handleEdit = (openRegistrationTableId, personList) => {
				const {resetUserPersonClipboard, personId, companyConfig} = this.props;
				let clipboardList = personList && personList.length > 0 && personList.map(m => m.studentPersonId);
				let userPersonClipboard = {
						userPersonId: personId,
						personType: 'STUDENT',
						personList: clipboardList,
						companyId: companyConfig.companyId,
				}
				resetUserPersonClipboard(personId, userPersonClipboard, '/openRegistration/' + openRegistrationTableId)
		}

    render() {
        const {openRegistrations, accessRoles, isFetchingRecord} = this.props;
				const {isShowingModal_remove} = this.state;
				let headings = [
						{},
						{label: <L p={p} t={`Name`}/>, tightText: true},
						{label: <L p={p} t={`Students`}/>, tightText: true},
						{label: <L p={p} t={`From`}/>, tightText: true},
						{label: <L p={p} t={`To`}/>, tightText: true},
				];

				let data = openRegistrations && openRegistrations.length > 0 && openRegistrations.map(m => ([
					{value:
							accessRoles.admin &&
							<div className={styles.row}>
									<a onClick={() => this.handleRemoveOpen(m.openRegistrationTableId)} className={styles.redLink}>
											<L p={p} t={`remove`}/>
									</a>
									<a onClick={() => this.handleEdit(m.openRegistrationTableId, m.studentList)}>
											<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
									</a>
							</div>
					},
					{ value: m.name },
					{ value: m.studentList && m.studentList.length },
					{ value: <DateMoment date={m.openDateFrom} format={`D MMM YYYY`} className={styles.entryDate}/> },
					{ value: <DateMoment date={m.openDateTo} format={`D MMM YYYY`} className={styles.entryDate}/> },
				]));

        return (
            <div className={styles.container}>
								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={isFetchingRecord}/>
								{isShowingModal_remove &&
		                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this open registration?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to remove this open registration?`}/>} isConfirmType={true}
		                   onClick={this.handleRemove} />
		            }
            </div>
        )
    }
}
