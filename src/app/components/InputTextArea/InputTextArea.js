import React, {Component} from 'react';
import styles from './InputTextArea.css';
import classes from 'classnames';
import MessageModal from '../MessageModal';
import Required from '../Required';
const p = 'component';
import L from '../../components/PageLanguage';

export default class InputTextArea extends Component {
		  constructor(props) {
			super(props);

			this.state = {
			}
  }

	isTextLengthLimit = (event) => {
		  const {maxLength, onChange} = this.props;
			let textLength = event.target.value && event.target.value.length;
			if (textLength > maxLength ) {
					this.handleGreaterThanMaxOpen();
		  } else {
			  	onChange(event);
		  }
  }


	handleGreaterThanMaxOpen = () => this.setState({isShowingModal_greaterThan: true })
  handleGreaterThanMaxClose = () => this.setState({isShowingModal_greaterThan: false })

  render() {
      const {name, label, placeholder, value, defaultValue, error, rows=5, columns=40, maxLength=1500, inputClassName="", labelClass="", onEnterKey,
							instructions, instructionsBelow, required=false, whenFilled, autoFocus, onBlur, autoComplete='dontdoit', boldText, textareaClass} = this.props;
			const {isShowingModal_greaterThan} = this.state;

		  return (
		    <div className={classes(styles.container, inputClassName)}>
		        <div className={styles.row}>
		            {label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
		            <Required setIf={required} setWhen={whenFilled}/>
		        </div>
						<div className={instructionsBelow ? styles.column : styles.row}>
								<textarea
												id={name}
												name={name}
												value={value}
				                defaultValue={defaultValue}
												rows={rows}
												cols={columns}
												onChange={this.isTextLengthLimit}
												autoFocus={autoFocus}
				                placeholder={placeholder}
												onBlur={onBlur}
												onKeyPress={onEnterKey}
				                maxLength={maxLength || 100}
												className={classes(styles.commentTextarea, textareaClass, (boldText ? styles.bold : ''))}
												autoComplete={autoComplete}>
								</textarea>
		            <span className={styles.instructions}>{instructions}</span>
		        </div>
		        {error && <div className={styles.alertMessage}>{error}</div>}
						{isShowingModal_greaterThan &&
								<MessageModal handleClose={this.handleGreaterThanMaxClose} heading={<L p={p} t={`Text length limit`}/>}
									 explainJSX={<L p={p} t={`The text you entered is longer than the maximum allowed.`}/>} onClick={this.handleGreaterThanMaxClose} />
	          }
		    </div>
		  );
   }
}
