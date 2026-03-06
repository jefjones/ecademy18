import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './LunchMenuOptionSetupView.css';
const p = 'LunchMenuOptionSetupView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import InputTextArea from '../../components/InputTextArea';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class LunchMenuOptionSetupView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      lunchMenuOptionId: '',
      lunchMenuOption: {
				lunchMenuOptionId: '',
        name: '',
        contents: '',
      },
      errors: {
        name: '',
        contents: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let lunchMenuOption = this.state.lunchMenuOption;
	    let errors = Object.assign({}, this.state.errors);
	    lunchMenuOption[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ lunchMenuOption, errors });
  }

  processForm = () => {
      const {addOrUpdateLunchMenuOption, personId} = this.props;
      const {lunchMenuOption, errors} = this.state;
      let hasError = false;

			if (!lunchMenuOption.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`A lunch name is required`}/> }});
      }

      if (!lunchMenuOption.contents) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Lunch contents is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateLunchMenuOption(personId, lunchMenuOption);
          this.setState({
              lunchMenuOption: {
									lunchMenuOptionId: '',
                  name: '',
                  contents: '',
              },
          });
      }
  }

	handleRemoveItemOpen = (lunchMenuOptionId) => this.setState({isShowingModal_remove: true, lunchMenuOptionId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false, lunchMenuOptionId: '' })
  handleRemoveItem = () => {
      const {removeLunchMenuOption, personId} = this.props;
      const {lunchMenuOptionId} = this.state;
      removeLunchMenuOption(personId, lunchMenuOptionId);
      this.handleRemoveItemClose();
  }

	handleEdit = (lunchMenuOptionId) => {
			const {lunchMenuOptions} = this.props;
			let lunchMenuOption = lunchMenuOptions && lunchMenuOptions.length > 0 && lunchMenuOptions.filter(m => m.lunchMenuOptionId === lunchMenuOptionId)[0];
			if (lunchMenuOption && lunchMenuOption.name) {
					lunchMenuOption.contents = lunchMenuOption.contents;
					this.setState({ lunchMenuOption })
			}
	}

  render() {
    const {lunchMenuOptions} = this.props;
    const {lunchMenuOption, errors, isShowingModal_remove} = this.state;

    let headings = [{}, {},
				{label: <L p={p} t={`Name`}/>, tightText: true},
				{label: <L p={p} t={`Contents`}/>, tightText: true},
		];

    let data = [];

    if (lunchMenuOptions && lunchMenuOptions.length > 0) {
        data = lunchMenuOptions.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.lunchMenuOptionId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {id: m.lunchMenuOptionId, value: <a onClick={() => this.handleRemoveItemOpen(m.lunchMenuOptionId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
              {id: m.lunchMenuOptionId, value: m.name},
              {id: m.lunchMenuOptionId, value: m.contents},
            ])
        });
    } else {
        data = [[{value: ''}, {colSpan: 4, value: <i><L p={p} t={`No lunch menu options entered yet.`}/></i> }]]
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Lunch Menu Option Setup`}/>
            </div>
            <div>
								<InputText
										id={'name'}
										name={'name'}
										value={lunchMenuOption.name}
										label={<L p={p} t={`Area name`}/>}
										size={"medium"}
										onChange={this.handleChange}
										required={true}
										whenFilled={lunchMenuOption && lunchMenuOption.name}
                    error={errors.name}/>
            </div>
						<div>
								<InputTextArea label={<L p={p} t={`Contents`}/>} rows={5} cols={45} value={lunchMenuOption.contents} onChange={this.handleChange} id={'contents'} name={'contents'}
										required={true}
										whenFilled={lunchMenuOption && lunchMenuOption.contents}
										className={styles.commentBox} boldText={true}/>
            </div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this lunch menu option?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this lunch menu option?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
      </div>
    );
  }
}
