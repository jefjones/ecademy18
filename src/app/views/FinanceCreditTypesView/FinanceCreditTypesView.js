import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinanceCreditTypesView.css';
const p = 'FinanceCreditTypesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinanceCreditTypesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financeCreditTypeId: '',
      financeCreditType: {
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
	    let financeCreditType = Object.assign({}, this.state.financeCreditType);
	    let errors = Object.assign({}, this.state.errors);
	    financeCreditType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      financeCreditType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinanceCreditType, personId} = this.props;
      const {financeCreditType, errors} = this.state;
      let hasError = false;

      if (!financeCreditType.description) {
          hasError = true;
          this.setState({errors: { ...errors, description: <L p={p} t={`Description is required`}/> }});
      }

			if (!financeCreditType.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateFinanceCreditType(personId, financeCreditType);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	reset = () => {
			this.setState({
					financeCreditType: {
						name: '',
						description: '',
					},
			});
	}

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financeCreditTypeId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financeCreditTypeId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinanceCreditType, personId} = this.props;
      const {financeCreditTypeId} = this.state;
      removeFinanceCreditType(personId, financeCreditTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financeCreditTypeId) => {
			const {financeCreditTypes} = this.props;
			let financeCreditType = financeCreditTypes && financeCreditTypes.length > 0 && financeCreditTypes.filter(m => m.financeCreditTypeId === financeCreditTypeId)[0];
			if (financeCreditType && financeCreditType.name)
					this.setState({ financeCreditType })
	}

  render() {
    const {financeCreditTypes, fetchingRecord} = this.props;
    const {financeCreditType, errors, isShowingModal_remove, isShowingModal_usedCount} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (financeCreditTypes && financeCreditTypes.length > 0) {
        data = financeCreditTypes.map(m => {
            return ([
							{value: m.name && <a onClick={() => this.handleEdit(m.financeCreditTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.name && <a onClick={() => this.handleRemoveItemOpen(m.financeCreditTypeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.description},
              {value: m.usedCount},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance Credit Type`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={financeCreditType.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeCreditType.name} />
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={financeCreditType.description || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeCreditType.description}
								error={errors.description} />
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeCreditTypeSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance credit type?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance credit type?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance Credit Type is in Use`}/>}
										explainJSX={<L p={p} t={`A finance credit type cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
