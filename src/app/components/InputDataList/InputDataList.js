import React, {Component} from 'react';
import globalStyles from '../../utils/globalStyles.css';
import styles from './InputDataList.css';
import classes from 'classnames';
import Required from '../Required';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

//If multiple and buttonLabel is filled in, that is a subtle distinction between the use of a one-entry-only control and a multiple record entry
//	In multiple entry case, there is the add button as well as the table display below as well as the clear-control function onBlur or on click of Add.
//	Notice that the click of the Add button doesn't do anything since it is just the action of onBlur that does the saving of the record.

export default class InputDataList extends Component {
  constructor(props) {
			super(props);

			this.state = {
				textValue: '',
				localValue: props.value,
			}
  }

	componentDidMount() {
	 		this.input.addEventListener("change", this.getValue);
	}

  componentDidUpdate() {
			const {value, clearTextValue, resetClearTextValue} = this.props;
      const {isInit} = this.state;
			if (!isInit && value && value.length > 0)  this.setState({ isInit: true, textValue: value.label, localValue: value });
			if (clearTextValue) {
					this.setState({ textValue: '', localValue: '' })
					resetClearTextValue();
			}
	}

	componentWillUnmount() {
	 		this.input.removeEventListener("change", this.getValue);
	}

	getValue = (event) => {
			const {onChange, options, multiple} = this.props;
			let localValue = Object.assign([], this.state.localValue);
			let option = options && options.length > 0 && options.filter(m => m.label === event.target.value)[0];
			if (option && option.id) {
					option = {id: option.id, label: option.label };
					let isDuplicate = false;
					localValue && localValue.length > 0 && localValue.forEach(m => {
							if (m.id === option.id) isDuplicate = true;
					})
					if (!isDuplicate) {
							localValue = localValue && localValue.length > 0 ? localValue.concat(option) : [option];
							this.setState({ localValue });
							onChange(multiple ? localValue : localValue && localValue.length > 0 && localValue[0]);
					}
					multiple && this.setState({ textValue: '' }); //If this is a multiple record control, then erase the text and let the new record be written in the table below.
			}
	}

	handleTextChange = (event) => this.setState({ textValue: event.target.value });

	handleRemove = (id) => {
  		const {onChange, removeFunction=()=>{}} = this.props;
  		let localValue = Object.assign([], this.state.localValue);
  		localValue = localValue && localValue.length > 0 && localValue.filter(m => m.id !== id);
  		onChange(localValue);
  		removeFunction(id);
  		this.setState({ localValue });
	}

	clearTextValue = () => {
			this.setState({ textValue: '', localValue: [] });
			this.props.onChange([]);
	}

  render() {
      const {value, multiple, className, options, name, id, labelLeft, labelClass, required, label, whenFilled, disabled, error, height, selectClass,
							maxwidth, buttonLabel, buttonIcon, listAbove } = this.props;
			const {textValue} = this.state;

		  return (
		    <div className={classes(styles.container, className)}>
						<div className={styles.row}>
								<div>
										<div className={styles.row}>
						        		<label htmlFor={name} className={classes(labelLeft ? styles.labelLeft : styles.labelTop, labelClass, required ? styles.lower : '')}>
														{label}
												</label>
												<Required setIf={required} setWhen={whenFilled}/>
										</div>
                    {multiple && listAbove &&
        								<div className={styles.moreBottom}>
        										{value && value.length > 0 && value.map((m, i) =>
        												<div key={i} className={classes(styles.text, styles.row)} onClick={() => this.handleRemove(m.id)}>
        														<div className={classes(globalStyles.remove, styles.removePosition)}>remove</div>
        													 	<div className={styles.listTextPosition}>{m.label}</div>
        											  </div>
        										)}
        								</div>
        						}
										<input type="text"
												ref={(ref) => (this.input = ref)}
												list={name || id}
												value={textValue || ''}
												onChange={this.handleTextChange}
												autoComplete={'dontdoit'}
												className={classes(styles.editControl, styles[`size${height}`], selectClass, styles[`maxwidth${maxwidth}`])}
												disabled={disabled}/>
										<datalist id={name || id} name={name || id} ref={(ref) => (this.menuThing = ref)} autoComplete={'dontdoit'} className={styles.maxWidth}>
												{options && options.length > 0 && options.map((m, i) =>
														<option key={i} id={m.id} value={m.label} className={styles.maxWidth}/>
												)}
										</datalist>
										{error && <div className={styles.alertMessage}>{error}</div>}
						    </div>
								{textValue && <Icon pathName={'cross'} fillColor={'maroon'} className={required ? styles.iconCrossTop : styles.iconCross} onClick={this.clearTextValue}/>}
								{multiple && buttonLabel &&
										<div className={classes(globalStyles.link, styles.row, styles.topPosition)}>
												{buttonIcon && <Icon pathName={buttonIcon} className={styles.iconSmall} fillColor={'#105815'}/>}
												<div>{buttonLabel}</div>
										</div>
								}
						</div>
						{multiple && !listAbove &&
								<div className={styles.moreBottom}>
										{value && value.length > 0 && value.map((m, i) =>
												<div key={i} className={classes(styles.text, styles.row)} onClick={() => this.handleRemove(m.id)}>
														<div className={classes(globalStyles.remove, styles.removePosition)}><L p={p} t={`remove`}/></div>
													 	<div className={styles.listTextPosition}>{m.label}</div>
											  </div>
										)}
								</div>
						}
				</div>
		  );
   }
}
