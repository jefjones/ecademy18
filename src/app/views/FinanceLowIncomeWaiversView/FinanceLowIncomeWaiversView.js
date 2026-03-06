import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinanceLowIncomeWaiversView.css';
const p = 'FinanceLowIncomeWaiversView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinanceLowIncomeWaiversView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financeLowIncomeWaiverId: '',
      financeLowIncomeWaiver: {
        name: '',
				description: '',
				percentWaived: '',
      },
      errors: {
				name: '',
				description: '',
				percentWaived: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let financeLowIncomeWaiver = Object.assign({}, this.state.financeLowIncomeWaiver);
	    let errors = Object.assign({}, this.state.errors);
	    financeLowIncomeWaiver[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      financeLowIncomeWaiver,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinanceLowIncomeWaiver, personId} = this.props;
      const {financeLowIncomeWaiver, errors} = this.state;
      let hasError = false;

			if (!financeLowIncomeWaiver.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!financeLowIncomeWaiver.description) {
          hasError = true;
          this.setState({errors: { ...errors, description: <L p={p} t={`Description is required`}/> }});
      }

			if (!financeLowIncomeWaiver.percentWaived) {
          hasError = true;
          this.setState({errors: { ...errors, percentWaived: <L p={p} t={`Percent Waived is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateFinanceLowIncomeWaiver(personId, financeLowIncomeWaiver);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	reset = () => {
			this.setState({
					financeLowIncomeWaiver: {
						name: '',
						description: '',
						percentWaived: '',
					},
			});
	}

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financeLowIncomeWaiverId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financeLowIncomeWaiverId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinanceLowIncomeWaiver, personId} = this.props;
      const {financeLowIncomeWaiverId} = this.state;
      removeFinanceLowIncomeWaiver(personId, financeLowIncomeWaiverId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financeLowIncomeWaiverId) => {
			const {financeLowIncomeWaivers} = this.props;
			let financeLowIncomeWaiver = financeLowIncomeWaivers && financeLowIncomeWaivers.length > 0 && financeLowIncomeWaivers.filter(m => m.financeLowIncomeWaiverId === financeLowIncomeWaiverId)[0];
			if (financeLowIncomeWaiver && financeLowIncomeWaiver.name)
					this.setState({ financeLowIncomeWaiver })
	}

  render() {
    const {financeLowIncomeWaivers, fetchingRecord} = this.props;
    const {financeLowIncomeWaiver, errors, isShowingModal_remove, isShowingModal_usedCount} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`% Waived`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (financeLowIncomeWaivers && financeLowIncomeWaivers.length > 0) {
        data = financeLowIncomeWaivers.map(m => {
            return ([
							{value: m.name && <a onClick={() => this.handleEdit(m.financeLowIncomeWaiverId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.name && <a onClick={() => this.handleRemoveItemOpen(m.financeLowIncomeWaiverId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.percentWaived},
							{value: m.description},
              {value: m.usedCount},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance Low Income Waivers`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={financeLowIncomeWaiver.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeLowIncomeWaiver.name}
								error={errors.name} />
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={financeLowIncomeWaiver.description || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeLowIncomeWaiver.description}
								error={errors.description}/>
						<InputText
								id={`percentWaived`}
								name={`percentWaived`}
								size={"super-short"}
								numberOnly={true}
								maxNumber={100}
								label={<L p={p} t={`% Waived`}/>}
								value={financeLowIncomeWaiver.percentWaived || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeLowIncomeWaiver.percentWaived}
								error={errors.percentWaived} />
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeLowIncomeWaiverSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance low income waiver?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance low income waiver?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance Low Income Waiver is in Use`}/>}
										explainJSX={<L p={p} t={`A finance low income waiver cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
