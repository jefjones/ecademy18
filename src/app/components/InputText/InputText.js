import React, {Component} from 'react';
import styles from './InputText.css';
import classes from 'classnames';
import MessageModal from '../MessageModal';
import Required from '../Required';
const p = 'component';
import L from '../../components/PageLanguage';

export default class InputText extends Component {
  constructor(props) {
			super(props);

			this.state = {
					isShowingModal_numberOnly: false,
					isShowingModal_greaterThan: false,
			}
  }

  isNumbersOnly = (event) => {
		  const {numberOnly, maxNumber, onChange} = this.props;
			let value = event.target.value;
			value = value === '.' ? '0.' : value;
		  if (isNaN(value) && numberOnly) {
			  	this.handleNumberOnlyOpen();
			} else if (maxNumber && Number(value) > Number(maxNumber)) {
					this.handleGreaterThanMaxOpen();
		  } else {
			  	onChange(event);
		  }
  }

  handleNumberOnlyOpen = () => this.setState({isShowingModal_numberOnly: true })
  handleNumberOnlyClose = () => this.setState({isShowingModal_numberOnly: false })

	handleGreaterThanMaxOpen = () => this.setState({isShowingModal_greaterThan: true })
  handleGreaterThanMaxClose = () => this.setState({isShowingModal_greaterThan: false })

  render() {
      const {name, label, placeholder, value, defaultValue, error, isPasswordType=false, size, height, maxLength=100, inputClassName="",
            	labelClass="", onEnterKey, noShadow, instructions, instructionsBelow, required=false, whenFilled, autoFocus, onBlur,
							onDoubleClick=() => {}, autoComplete} = this.props;
			const {isShowingModal_numberOnly, isShowingModal_greaterThan} = this.state;

		  return (
		    <div className={classes(styles.container, inputClassName)}>
		        <div className={styles.row}>
		            {label && <span htmlFor={name} className={classes(styles.label, labelClass, required ? styles.lower : '')}>{label}</span>}
		            <Required setIf={required} setWhen={whenFilled}/>
		        </div>
						<div className={instructionsBelow ? styles.column : styles.row}>
		            <input
		                onChange={this.isNumbersOnly}
		                onKeyPress={onEnterKey}
		                type={isPasswordType ? `password` : `text`}
		                id={name}
		                name={name}
		                autoFocus={autoFocus}
		                placeholder={placeholder}
										onBlur={onBlur}
										autoComplete={autoComplete}
										onDoubleClick={onDoubleClick}
		                maxLength={maxLength || 100}
		                className={classes(styles[`size${height}`], noShadow ? styles.noShadow : '',
		                   size === `medium-left` ? styles.cutRight : '',
		                   size === `medium-right` ? styles.cutLeft : '',
		                   size === `long` || size === `bigtext`
											 		? styles.input_long
													: size === `medium`
															? styles.input_medium
															: (size === `medium-short`  || size === `medium-left` || size === `medium-right`)
																	? styles.input_mediumShort
																	: size === `medium-long`
																			? styles.input_mediumLong
																			: size === `super-short`
																					? styles.input_superShort
																					: styles.input_short)
										}
		                value={value}
		                defaultValue={defaultValue}/>
		            <span className={styles.instructions}>{instructions}</span>
		        </div>
		        {error && <div className={styles.alertMessage}>{error}</div>}
						{isShowingModal_numberOnly &&
	                <MessageModal handleClose={this.handleNumberOnlyClose} heading={<L p={p} t={`Numbers Only`}/>}
	                   explainJSX={<L p={p} t={`Please enter numbers only.`}/>} onClick={this.handleNumberOnlyClose} />
	          }
						{isShowingModal_greaterThan &&
	                <MessageModal handleClose={this.handleGreaterThanMaxClose} heading={<L p={p} t={`Number is Over the Limit`}/>}
	                   explainJSX={<L p={p} t={`The number you entered is greater than the maximum allowed.`}/>} onClick={this.handleGreaterThanMaxClose} />
	          }
		    </div>
		  );
   }
}
