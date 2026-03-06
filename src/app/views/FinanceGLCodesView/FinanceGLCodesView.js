import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinanceGLCodesView.css';
const p = 'FinanceGLCodesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinanceGLCodesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financeGlcodeId: '',
      financeGLCode: {
				code: '',
				name: '',
        description: '',
      },
      errors: {
				code: '',
				name: '',
        description: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let financeGLCode = Object.assign({}, this.state.financeGLCode);
	    let errors = Object.assign({}, this.state.errors);
	    financeGLCode[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ financeGLCode, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinanceGLCode, personId} = this.props;
      const {financeGLCode, errors} = this.state;
      let hasError = false;

      if (!financeGLCode.code) {
          hasError = true;
          this.setState({errors: { ...errors, code: <L p={p} t={`Code is required`}/> }});
      }

			if (!financeGLCode.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!financeGLCode.description) {
          hasError = true;
          this.setState({errors: { ...errors, description: <L p={p} t={`Description is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateFinanceGLCode(personId, financeGLCode);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	reset = () => {
			this.setState({
					financeGLCode: {
						code: '',
						name: '',
						description: '',
					},
			});
	}

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financeGlcodeId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financeGlcodeId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinanceGLCode, personId} = this.props;
      const {financeGlcodeId} = this.state;
      removeFinanceGLCode(personId, financeGlcodeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financeGlcodeId) => {
			const {financeGLCodes} = this.props;
			let financeGLCode = financeGLCodes && financeGLCodes.length > 0 && financeGLCodes.filter(m => m.financeGlcodeId === financeGlcodeId)[0];
			if (financeGLCode && financeGLCode.name)
					this.setState({ financeGLCode })
	}

  render() {
    const {financeGLCodes, fetchingRecord} = this.props;
    const {financeGLCode, errors, isShowingModal_remove, isShowingModal_usedCount} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Code`}/>, tightText: true},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (financeGLCodes && financeGLCodes.length > 0) {
        data = financeGLCodes.map(m => {
            return ([
							{value: m.name && <a onClick={() => this.handleEdit(m.financeGlcodeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.name && <a onClick={() => this.handleRemoveItemOpen(m.financeGlcodeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.code},
							{value: m.name},
							{value: m.description},
              {value: m.usedCount},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance GL Codes`}/>
            </div>
						<InputText
								id={`code`}
								name={`code`}
								size={"short"}
								label={<L p={p} t={`Code`}/>}
								value={financeGLCode.code || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeGLCode.code}
								error={errors.code} />
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={financeGLCode.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeGLCode.name}
								error={errors.name} />
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={financeGLCode.description || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeGLCode.description}
								error={errors.description} />
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeGLCodeSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance GL code?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance GL code?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance GL Code is in Use`}/>}
										explainJSX={<L p={p} t={`A finance GL code cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
