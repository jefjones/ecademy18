import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './TestComponentAssignView.css';
const p = 'TestComponentAssignView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class TestComponentAssignView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
			isShowingModal_usedIn: false,
      testComponentAssign: {
				testComponentAssignId: '',
				testComponentId: '',
				testId: '',
				possibleScore: '',
      },
      errors: {
				testComponentId: '',
				testId: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let testComponentAssign = Object.assign({}, this.state.testComponentAssign);
	    let errors = Object.assign({}, this.state.errors);
	    testComponentAssign[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      testComponentAssign,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addTestComponentAssign, personId} = this.props;
      const {testComponentAssign, errors} = this.state;
      let hasError = false;

			if (!testComponentAssign.testId) {
          hasError = true;
          this.setState({errors: { ...errors, testId: <L p={p} t={`Test is required`}/> }});
      }

			if (!testComponentAssign.testComponentId) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Component is required`}/> }});
      }

      if (!hasError) {
          addTestComponentAssign(personId, testComponentAssign);
          this.setState({
              testComponentAssign: {
								testComponentAssignId: '',
								testComponentId: '',
								testId: '',
								possibleScore: '',
              },
          });
      }
  }

	handleRemoveItemOpen = (testComponentAssignId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, testComponentAssignId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeTestComponentAssign, personId} = this.props;
      const {testComponentAssignId} = this.state;
      removeTestComponentAssign(personId, testComponentAssignId);
      this.handleRemoveItemClose();
  }

	handleShowUsedInOpen = (usedIn) => this.setState({isShowingModal_usedIn: true })
  handleShowUsedInClose = () => this.setState({isShowingModal_usedIn: false })

	handleEdit = (testComponentAssignId, testId, testComponentId, possibleScore) =>
			this.setState({
				testComponentAssign: {
					testComponentAssignId,
					testComponentId,
					testId,
					possibleScore,
			}})

  render() {
    const {testSettings={}, fetchingRecord} = this.props;
    const {testComponentAssign, errors, isShowingModal_remove, isShowingModal_usedIn} = this.state;
		let tests = testSettings.tests;
		let testComponents = testSettings.testComponents;

    let headings = [{}, {},
			{label: <L p={p} t={`Test`}/>, tightText: true},
			{label: <L p={p} t={`Component`}/>, tightText: true},
			{label: <L p={p} t={`Possible score`}/>, tightText: true},
			{label: <L p={p} t={`Used in`}/>, tightText: true},
		];

    let data = [];
		let currentTest = '';

    if (tests && tests.length > 0) {
        tests.forEach(m => {
						m && m.testComponentsAssigned && m.testComponentsAssigned.length > 0 && m.testComponentsAssigned.forEach(c => {
								let testName = currentTest !== m.name ? m.name : '';
								currentTest = m.name;
		         		data.push([
										{value: <a onClick={() => this.handleEdit(c.testComponentAssignId, m.testId, c.testComponentId, c.possibleScore)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
			              {value: <a onClick={() => this.handleRemoveItemOpen(c.testComponentAssignId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
										{value: testName},
										{value: c.testComponentName},
										{value: c.possibleScore},
										{value: c.usedIn},
		            ])
						})
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Assign Components to Tests`}/>
            </div>
						<div>
								<SelectSingleDropDown
										id={`testId`}
										name={`testId`}
										label={<L p={p} t={`Test`}/>}
										value={testComponentAssign.testId || ''}
										options={tests}
										height={'medium'}
										className={styles.moreBottomMargin}
										onChange={this.handleChange}/>
						</div>
						<div>
								<SelectSingleDropDown
										id={`testComponentId`}
										name={`testComponentId`}
										label={<L p={p} t={`Test Component`}/>}
										value={testComponentAssign.testComponentId || ''}
										options={testComponents}
										height={'medium'}
										className={styles.moreBottomMargin}
										onChange={this.handleChange}
										error={errors.testComponentId}/>
						</div>
						<InputText
								id={`possibleScore`}
								name={`possibleScore`}
								size={"super-short"}
								label={<L p={p} t={`Points Possible`}/>}
								numberOnly={true}
								value={testComponentAssign.possibleScore || ''}
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
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this Test Component Assignment?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this test component assignment?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This test component assignment is in use`}/>}
										explainJSX={<L p={p} t={`This test component assignment has been used by at least one test and cannot be deleted.`}/>}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
