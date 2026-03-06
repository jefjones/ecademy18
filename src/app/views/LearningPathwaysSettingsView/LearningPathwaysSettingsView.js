import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './LearningPathwaysSettingsView.css';
const p = 'LearningPathwaysSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class LearningPathwaysSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      learningPathwayId: '',
      learningPathway: {
        name: '',
        description: '',
      },
      errors: {
        name: '',
        description: '',
      }
    }
  }

  componentDidMount() {
    //document.getElementById('name').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let learningPathway = this.state.learningPathway;
	    let errors = Object.assign({}, this.state.errors);
	    learningPathway[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      learningPathway,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateLearningPathway, personId} = this.props;
      const {learningPathway, errors} = this.state;
      let hasError = false;

      if (!learningPathway.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Code is required`}/> }});
      }

			if (!learningPathway.description) {
          hasError = true;
          this.setState({errors: { ...errors, description: <L p={p} t={`Name is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateLearningPathway(personId, learningPathway);
          this.setState({
              learningPathway: {
                  name: '',
                  description: '',
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

  handleRemoveItemOpen = (learningPathwayId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, learningPathwayId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeLearningPathway, personId} = this.props;
      const {learningPathwayId} = this.state;
      removeLearningPathway(personId, learningPathwayId);
      this.handleRemoveItemClose();
  }

	handleEdit = (learningPathwayId) => {
			const {learningPathways} = this.props;
			let learningPathway = learningPathways && learningPathways.length > 0 && learningPathways.filter(m => m.learningPathwayId === learningPathwayId)[0];
			if (learningPathway && learningPathway.name)
					this.setState({ learningPathway })
	}

  render() {
    const {learningPathways, fetchingRecord} = this.props;
    const {learningPathway, errors, isShowingModal_remove, isShowingModal_usedIn, listUsedIn} = this.state;

    let headings = [{}, {},
			{label: 'Code', tightText: true},
			{label: 'Name', tightText: true},
			{label: 'Used In', tightText: true}];

    let data = [];

    if (learningPathways && learningPathways.length > 0) {
        data = learningPathways.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.learningPathwayId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.learningPathwayId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.description},
              {value: m.usedIn && m.usedIn.length, clickFunction: () => this.handleShowUsedInOpen(m.usedIn)},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Discipline (Content Areas) Settings`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Code`}/>}
								value={learningPathway.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={learningPathway.name}
								error={errors.name} />
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Name`}/>}
								value={learningPathway.description || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={learningPathway.description} />
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.learningPathwaySettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this discipline (content area)?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this discipline (content area)?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Discipline is used in these Courses`}/>}
										explainJSX={<L p={p} t={`In order to delete this discipline, please reassign the following courses with a different discipline setting:<br/><br/>`}/> + listUsedIn}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
