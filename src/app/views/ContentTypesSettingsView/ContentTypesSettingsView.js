import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './ContentTypesSettingsView.css';
const p = 'ContentTypesSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class ContentTypesSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      contentTypeId: '',
      contentType: {
        name: '',
				code: '',
        sequence: props.contentTypes && props.contentTypes.length + 1,
      },
      errors: {
				name: '',
				code: '',
        sequence: '',
      }
    }
  }

  componentDidUpdate(prevProps) {
    	if (this.props.contentTypes !== prevProps.contentTypes) {
					this.setState({ contentType: {...this.state.contentType, sequence: this.props.contentTypes && this.props.contentTypes.length + 1 } });
			}
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let contentType = this.state.contentType;
	    let errors = Object.assign({}, this.state.errors);
	    contentType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      contentType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateContentType, personId, contentTypes} = this.props;
      const {contentType, errors} = this.state;
      let hasError = false;

      if (!contentType.code) {
          hasError = true;
          this.setState({errors: { ...errors, code: <L p={p} t={`Code is required`}/> }});
      }

			if (!contentType.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!contentType.sequence) {
          hasError = true;
          this.setState({errors: { ...errors, sequence: <L p={p} t={`Sequence is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateContentType(personId, contentType);
          this.setState({
              contentType: {
								name: '',
								code: '',
				        sequence: contentTypes && contentTypes.length + 1,
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleShowUsedInOpen = (usedIn) => {
			let listUsedIn = usedIn && usedIn.length > 0 && usedIn.join("<br/>");
			this.setState({isShowingModal_usedIn: true, listUsedIn });
	}
  handleShowUsedInClose = () => this.setState({isShowingModal_usedIn: false, listUsedIn: [] })

  handleRemoveItemOpen = (contentTypeId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, contentTypeId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeContentType, personId} = this.props;
      const {contentTypeId} = this.state;
      removeContentType(personId, contentTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (contentTypeId) => {
			const {contentTypes} = this.props;
			let contentType = contentTypes && contentTypes.length > 0 && contentTypes.filter(m => m.contentTypeId === contentTypeId)[0];
			if (contentType && contentType.name)
					this.setState({ contentType })
	}

  render() {
    const {contentTypes, sequences, fetchingRecord, companyConfig} = this.props;
    const {contentType, errors, isShowingModal_remove, isShowingModal_usedIn, listUsedIn} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Code`}/>, tightText: true},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Sequence`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (contentTypes && contentTypes.length > 0) {
        data = contentTypes.map(m => {
            return ([
							{value: m.code === 'BENCHMARK' ? '' : <a onClick={() => this.handleEdit(m.contentTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.code === 'BENCHMARK' ? '' : <a onClick={() => this.handleRemoveItemOpen(m.contentTypeId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.code},
							{value: m.name},
							{value: m.sequence},
              {value: m.usedIn && m.usedIn.length, clickFunction: () => this.handleShowUsedInOpen(m.usedIn)},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Content Type Settings`}/>
            </div>
						<InputText
								id={`code`}
								name={`code`}
								size={"short"}
								label={<L p={p} t={`Code`}/>}
								value={contentType.code || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={contentType.code} />
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={contentType.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={contentType.name}
								error={errors.name} />
						<div>
								<SelectSingleDropDown
										id={'sequence'}
										label={<L p={p} t={`Sequence (for list display)`}/>}
										value={contentType.sequence || ''}
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
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.contentTypeSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
						{companyConfig.features.benchmarkTests &&
								<div className={globalStyles.instructionsBigger}>
										<L p={p} t={`The Benchmark Test feature is turned on.  The "Benchmark Test" content type is included here which can only be taken out by turning off the feature.`}/>
								</div>
						}
						{companyConfig.features.benchmarkTests && <hr/>}
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this content type?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this content type?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Content Type is used in these Assignments`}/>}
										explainJSX={<L p={p} t={`In order to delete this content type please reassign the following courses with a different content type setting:<br/><br/>`}/> + listUsedIn}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
