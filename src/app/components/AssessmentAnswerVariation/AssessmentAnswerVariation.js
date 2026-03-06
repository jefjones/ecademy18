import React, {Component} from 'react';
import styles from './AssessmentAnswerVariation.css';
import classes from 'classnames';
import InputText from '../InputText';
import EditTable from '../EditTable';
import MessageModal from '../MessageModal';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class AssessmentAnswerVariation extends Component {
    constructor(props) {
      super(props);

      this.state = {
					answerVariation: '',
					isShowingModal_remove: false,
      }
    }

		changeItem = ({target}) => {
				let newState = Object.assign({}, this.state);
				newState[target.name] = target.value;
				this.setState(newState);
		}

		handleAddAnswerVariation = () => {
				const {addAnswerVariation} = this.props;
				const {answerVariation} = this.state;
				if (answerVariation) {
						addAnswerVariation(answerVariation);
						this.setState({ answerVariation: '' });
				}
		}

		handleEnterKey = (event) => {
	      event.key === "Enter" && this.handleAddAnswerVariation();
	  }

		handleRemoveOpen = (answerIndex) => this.setState({isShowingModal_remove: true, answerIndex})
	  handleRemoveClose = () => this.setState({isShowingModal_remove: false})
	  handleRemoveSave = () => {
	      const {removeAnswerVariation} = this.props;
	      const {answerIndex} = this.state;
	      removeAnswerVariation(answerIndex)
	      this.handleRemoveClose();
	  }

    render() {
      const {className="", answerVariations } = this.props;
			const {answerVariation, isShowingModal_remove} = this.state;

			let headings = [{},{}];

			let data = answerVariations && answerVariations.length > 0 && answerVariations.map((variation, i) =>
					[
							{ value: <div onClick={() => this.handleRemoveOpen(i)}>
											 		 <Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
											 </div>
							 },
							 { value: <div className={styles.label}>{variation}</div> },
					]
			);

			data = data && data.length > 0 ? data : [[{value: ''},{value: <div className={styles.noRecords}><L p={p} t={`No answer variations entered`}/></div>, colSpan: 4}]];

      return (
          <div className={classes(className, styles.container)}>
							<div className={styles.row}>
									<InputText
											id={`answerVariation`}
											name={`answerVariation`}
											size={"medium-long"}
											onEnterKey={this.handleEnterKey}
											label={<L p={p} t={`Answer variation`}/>}
											instructionsBelow={true}
											value={answerVariation || ''}
											instructions={<L p={p} t={`Case is already ignored and please do not use punctuation.`}/>}
											onChange={this.changeItem}/>
									<div className={classes(styles.link, styles.row, styles.topPosition)} onClick={this.handleAddAnswerVariation}>
											<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
											<div className={styles.moreTop}><L p={p} t={`Add`}/></div>
									</div>
							</div>
							<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
								{isShowingModal_remove &&
		                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this answer variation?`}/>}
		                   explainJSX={<L p={p} t={`Are you sure you want to remove this answer variation?`}/>} isConfirmType={true}
		                   onClick={this.handleRemoveSave} />
		            }
          </div>
      )
  }
}
