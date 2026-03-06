import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinancePaymentTypesView.css';
const p = 'FinancePaymentTypesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinancePaymentTypesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financePaymentTypeId: '',
      financePaymentType: {
        name: '',
				description: '',
      },
      errors: {
				name: '',
				description: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let financePaymentType = Object.assign({}, this.state.financePaymentType);
	    let errors = Object.assign({}, this.state.errors);
	    financePaymentType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      financePaymentType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinancePaymentType, personId} = this.props;
      const {financePaymentType, errors} = this.state;
      let hasError = false;

			if (!financePaymentType.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateFinancePaymentType(personId, financePaymentType);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	reset = () => {
			this.setState({
					financePaymentType: {
						name: '',
						description: '',
					},
			});
	}

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financePaymentTypeId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financePaymentTypeId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinancePaymentType, personId} = this.props;
      const {financePaymentTypeId} = this.state;
      removeFinancePaymentType(personId, financePaymentTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financePaymentTypeId) => {
			const {financePaymentTypes} = this.props;
			let financePaymentType = financePaymentTypes && financePaymentTypes.length > 0 && financePaymentTypes.filter(m => m.financePaymentTypeId === financePaymentTypeId)[0];
			if (financePaymentType && financePaymentType.name)
					this.setState({ financePaymentType })
	}

  render() {
    const {financePaymentTypes, fetchingRecord} = this.props;
    const {financePaymentType, errors, isShowingModal_remove, isShowingModal_usedCount} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (financePaymentTypes && financePaymentTypes.length > 0) {
        data = financePaymentTypes.map(m => {
            return ([
							{value: m.name && <a onClick={() => this.handleEdit(m.financePaymentTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.name && <a onClick={() => this.handleRemoveItemOpen(m.financePaymentTypeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.description},
              {value: m.usedCount},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance Payment Type`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={financePaymentType.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financePaymentType.name}
								error={errors.name} />
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={financePaymentType.description || ''}
								onChange={this.handleChange} />
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financePaymentTypeSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance payment type?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance payment type?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance Payment Type is in Use`}/>}
										explainJSX={<L p={p} t={`A finance payment type cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
