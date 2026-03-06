import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './TestSettingsView.css';
const p = 'TestSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import InputTextArea from '../../components/InputTextArea';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class TestSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
			isShowingModal_usedIn: false,
      test: {
				testId: '',
        name: '',
				possibleScore: '',
				description: '',
      },
      errors: {
				name: '',
				possibleScore: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let test = Object.assign({}, this.state.test);
	    let errors = Object.assign({}, this.state.errors);
	    test[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      test,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateTest, personId} = this.props;
      const {test, errors} = this.state;
      let hasError = false;

			if (!test.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!test.possibleScore) {
          hasError = true;
          this.setState({errors: { ...errors, possibleScore: <L p={p} t={`Points possible is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateTest(personId, test);
          this.setState({
              test: {
								testId: '',
				        name: '',
								possibleScore: '',
								description: '',
              },
          });
      }
  }

	handleRemoveItemOpen = (testId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, testId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeTest, personId} = this.props;
      const {testId} = this.state;
      removeTest(personId, testId);
      this.handleRemoveItemClose();
  }

	handleShowUsedInOpen = (usedIn) => this.setState({isShowingModal_usedIn: true })
  handleShowUsedInClose = () => this.setState({isShowingModal_usedIn: false })

	handleEdit = (testId) => {
			const {tests} = this.props;
			let test = tests && tests.length > 0 && tests.filter(m => m.testId === testId)[0];
			if (test && test.name) this.setState({ test })
	}

  render() {
    const {tests, fetchingRecord} = this.props;
    const {test, errors, isShowingModal_remove, isShowingModal_usedIn} = this.state;
    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Used in`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
		];

    let data = [];

    if (tests && tests.length > 0) {
        data = tests.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.testId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.testId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.usedIn},
							{value: m.description},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {'Test List'}
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={test.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={test.name}
								error={errors.name} />
						<InputText
								id={`possibleScore`}
								name={`possibleScore`}
								size={"super-short"}
								label={<L p={p} t={`Points Possible`}/>}
								numberOnly={true}
								value={test.possibleScore || ''}
								required={true}
								whenFilled={test.possibleScore}
								onChange={this.handleChange}
								error={errors.possibleScore}/>
						<InputTextArea
								label={<L p={p} t={`Description`}/>}
								name={'description'}
								value={test.description || ''}
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
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this Test?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this test?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This test is in use`}/>}
										explainJSX={<L p={p} t={`This test has been taken by at least one student and cannot be deleted.`}/>}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
