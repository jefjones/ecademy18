import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './PassFailRatingSettingsView.css';
const p = 'PassFailRatingSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';

export default class PassFailRatingSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
			newName: '',
			newSequence: '',
			passFailRatings: [],
    }
  }

	componentDidUpdate() {
			const {passFailRatings} = this.props;
			const {isInitialized} = this.state;
			if (!isInitialized && passFailRatings && passFailRatings.length > 0) {
					this.setState({ isInitialized: true, passFailRatings });
			}
	}

  handleRemoveItemOpen = (passFailRatingId) => this.setState({isShowingModal_remove: true, passFailRatingId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false, sequence: '' })
  handleRemoveItem = () => {
      const {removePassFailRating, personId} = this.props;
      const {passFailRatingId} = this.state;
      removePassFailRating(personId, passFailRatingId);
      this.handleRemoveItemClose();
			this.setState({isInitialized: false });
  }

	processForm = () => {
			const {setPassFailRating, personId} = this.props;
			const {newSequence, newName} = this.state;
			if (newSequence && newName) {
					setPassFailRating(personId, newName, newSequence);
					this.setState({newSequence: '', newName: '', isInitialized: false });
			}
	}

  handleNewChange = ({target}) => {
			this.setState({ [target.name]: target.value })
	}

	handleOldChange = (passFailRatingId, {target}) => {
			let passFailRatings = this.state.passFailRatings;
			let record = passFailRatings.filter(m => m.id === passFailRatingId)[0] || {};
			passFailRatings = passFailRatings.filter(m => m.id !== passFailRatingId);
			record[target.name] = target.value;
			passFailRatings = passFailRatings ? passFailRatings.concat(record) : [record];
			this.setState({ passFailRatings })
	}

	render() {
		const {setPassFailRating, personId} = this.props;
    const {isShowingModal_remove, newSequence, newName} = this.state;
		let {passFailRatings=[]} = this.state;
		passFailRatings = doSort(passFailRatings, { sortField: 'sequence', isAsc: true, isNumber: true });

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Pass Fail Rating Settings`}/>
            </div>
						{passFailRatings.map((m, i) =>
								<div key={i} className={classes(styles.moreLeft, styles.row, styles.moreTop)}>
										<div onClick={() => this.handleRemoveItemOpen(m.id)} className={styles.iconPosition}>
												<Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
										</div>

										<InputText
												id={`sequence`}
												name={`sequence`}
												description={`sequence`}
												max-length={1}
												numberOnly={true}
												size={"super-short"}
												label={<L p={p} t={`Sequence`}/>}
												value={m.sequence === 0 ? 0 : m.sequence ? m.sequence : ''}
												onChange={(event) => this.handleOldChange(m.id, event)}
												onBlur={(event) => { !!event.target.value && !!m.name && setPassFailRating(personId, m.name, event.target.value) }}
												required={true}
												whenFilled={m.sequence === 0 ? '0' : m.sequence} />

										<div className={styles.moreLeft}>
												<InputText
														id={`name`}
														name={`name`}
														size={"medium"}
														label={<L p={p} t={`Name`}/>}
														value={m.name || ''}
														onChange={(event) => this.handleOldChange(m.id, event)}
														onBlur={(event) => { !!event.target.value && !!m.sequence && setPassFailRating(personId, event.target.value, m.sequence) }}
														required={true}
														whenFilled={m.name} />
										</div>
								</div>
						)}
						<div className={classes(styles.addBackground, styles.moreTop)}>
								<div className={styles.header}>Add new rating</div>
								<div className={styles.row}>
										<InputText
												id={`newSequence`}
												name={`newSequence`}
												max-length={1}
												numberOnly={true}
												size={"super-short"}
												label={<L p={p} t={`Sequence`}/>}
												value={newSequence || ''}
												onChange={this.handleNewChange} />

										<div className={styles.moreLeft}>
												<InputText
														id={`newName`}
														name={`newName`}
														size={"medium"}
														label={<L p={p} t={`Name`}/>}
														value={newName || ''}
														onChange={this.handleNewChange} />
										</div>
										<div className={styles.buttonHeight}>
												<ButtonWithIcon label={<L p={p} t={`Add`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
										</div>
								</div>
						</div>
						<hr/>
            <div className={styles.rowRight}>
                <button className={styles.submitButton} onClick={() => browserHistory.push("/schoolSettings")}>
                    <L p={p} t={`Done`}/>
                </button>
            </div>
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this Pass / Fail rating?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this Pass / Fail rating?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
      </div>
    );
  }
}
