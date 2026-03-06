import React, {Component} from 'react';
import styles from './AssessmentEssayKeyword.css';
import classes from 'classnames';
import InputText from '../InputText';
import EditTable from '../EditTable';
import MessageModal from '../MessageModal';
import SelectSingleDropDown from '../SelectSingleDropDown';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class AssessmentEssayKeyword extends Component {
    constructor(props) {
      super(props);

      this.state = {
					keywordPhrase: '',
					isShowingModal_remove: false,
      }
    }

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				newState[target.name] = target.value;
				this.setState(newState);
		}

		handleAddKeywordPhrase = () => {
				const {addKeywordPhrase} = this.props;
				const {keywordPhrase} = this.state;
				if (keywordPhrase) {
						addKeywordPhrase(keywordPhrase);
						this.setState({ keywordPhrase: '' });
				}
		}

		handleEnterKey = (event) => {
	      event.key === "Enter" && this.handleAddKeywordPhrase();
	  }

		handleRemoveOpen = (keywordIndex) => this.setState({isShowingModal_remove: true, keywordIndex})
	  handleRemoveClose = () => this.setState({isShowingModal_remove: false})
	  handleRemoveSave = () => {
	      const {removeKeywordPhrase} = this.props;
	      const {keywordIndex} = this.state;
	      removeKeywordPhrase(keywordIndex)
	      this.handleRemoveClose();
	  }

    render() {
      const {className="", keywordPhrases, updateKeywordCountAccuracy, keywordCountAccuracy } = this.props;
			const {keywordPhrase, isShowingModal_remove} = this.state;

			let headings = [{},{}];

			let data = keywordPhrases && keywordPhrases.length > 0 && keywordPhrases.map((keyPhrase, i) =>
					[
							{ value: <div onClick={() => this.handleRemoveOpen(i)}>
											 		 <Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
											 </div>
							 },
							 { value: <div className={styles.label}>{keyPhrase}</div> },
					]
			);

			data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}><L p={p} t={`No keywords or phrases entered`}/></div>, colSpan: 4}]];

			let keywordCounts = keywordPhrases && keywordPhrases.length > 0 && keywordPhrases.map((acc, i) => (
					{ id: i+1, label: i+1 }
			));

      return (
          <div className={classes(className, styles.container)}>
							<div className={styles.instructions}>
									<L p={p} t={`If you enter at least one keyword or phrase and choose at least one keyword count for grading, then this essay will be graded automatically.  Otherwise, grading will need to be done manually.`}/>
							</div>
							<div className={styles.row}>
									<InputText
											id={`keywordPhrase`}
											name={`keywordPhrase`}
											size={"medium-long"}
											onEnterKey={this.handleEnterKey}
											label={<L p={p} t={`Keyword`}/>}
											instructionsBelow={true}
											value={keywordPhrase || ''}
											onChange={this.changeItem}/>
									<div className={classes(styles.link, styles.row, styles.topPosition)} onClick={this.handleAddKeywordPhrase}>
											<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
											<div className={styles.moreTop}>{<L p={p} t={`Add`}/>}</div>
									</div>
							</div>
							<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
							{data && data.length > 0 &&
									<div>
											<SelectSingleDropDown
													id={`keywordCountAccuracy`}
													name={`keywordCountAccuracy`}
													label={<L p={p} t={`How many keywords does the student need to enter to get full credit?`}/>}
													value={keywordCountAccuracy || ''}
													options={keywordCounts}
													className={styles.moreBottomMargin}
													height={`short`}
													onChange={updateKeywordCountAccuracy}/>
										</div>
								}
								{isShowingModal_remove &&
		                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this keyword or phrase?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to remove this keyword or phrase?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveSave} />
		            }
          </div>
      )
  }
}
