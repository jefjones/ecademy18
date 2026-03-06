import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './TestComponentSettingsView.css';
const p = 'TestComponentSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import InputTextArea from '../../components/InputTextArea';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class TestComponentSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
			isShowingModal_usedIn: false,
      testComponent: {
				testComponentId: '',
        name: '',
				description: '',
      },
      errors: {
				name: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let testComponent = Object.assign({}, this.state.testComponent);
	    let errors = Object.assign({}, this.state.errors);
	    testComponent[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      testComponent,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateTestComponent, personId} = this.props;
      const {testComponent, errors} = this.state;
      let hasError = false;

			if (!testComponent.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateTestComponent(personId, testComponent);
          this.setState({
              testComponent: {
								testComponentId: '',
				        name: '',
								description: '',
              },
          });
      }
  }

	handleRemoveItemOpen = (testComponentId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, testComponentId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeTestComponent, personId} = this.props;
      const {testComponentId} = this.state;
      removeTestComponent(personId, testComponentId);
      this.handleRemoveItemClose();
  }

	handleShowUsedInOpen = (usedIn) => this.setState({isShowingModal_usedIn: true })
  handleShowUsedInClose = () => this.setState({isShowingModal_usedIn: false })

	handleEdit = (testComponentId) => {
			const {testComponents} = this.props;
			let testComponent = testComponents && testComponents.length > 0 && testComponents.filter(m => m.testComponentId === testComponentId)[0];
			if (testComponent && testComponent.name) this.setState({ testComponent })
	}

  render() {
    const {testComponents, fetchingRecord} = this.props;
    const {testComponent, errors, isShowingModal_remove, isShowingModal_usedIn} = this.state;
    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Used in`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
		];

    let data = [];

    if (testComponents && testComponents.length > 0) {
        data = testComponents.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.testComponentId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.testComponentId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.usedIn},
							{value: m.description},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {'Test Component List'}
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={testComponent.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={testComponent.name}
								autoComplete={'dontdoit'}
								error={errors.name} />
						<InputTextArea
								label={<L p={p} t={`Description`}/>}
								name={'description'}
								value={testComponent.description || ''}
								autoComplete={'dontdoit'}
								onChange={this.handleChange}/>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} isFetchingRecord={fetchingRecord.testSettings}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this Test Component?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this test component?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This test component is in use`}/>}
										explainJSX={<L p={p} t={`This test component has been taken by at least one test and cannot be deleted.`}/>}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
