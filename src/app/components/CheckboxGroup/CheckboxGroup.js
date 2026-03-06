import React, {Component} from 'react';
import styles from './CheckboxGroup.css';
import classes from 'classnames';
import Required from '../Required';
import Checkbox from '../Checkbox';

export default class CarpoolRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
				isInit: false,
				selectedCheckboxes: props.selected,
		}
	}

	componentDidMount() {
			const {selected} = this.props;
			const {selectedCheckboxes, isInit} = this.state;
			if (!isInit && selected && selected.length > 0 && selectedCheckboxes !== selected) {
					this.setState({ selectedCheckboxes: selected, isInit: true });
			}
	}

	handleChange = (event, controlId, selected) => {
			const {recordTypeId} = this.props;
			if (selected && selected.length > 0) {
					if (selected.indexOf(controlId) > -1) {
							selected = selected.filter(m => m !== controlId);
					} else {
							selected = selected ? selected.concat(controlId) : [controlId];
					}
			} else {
					selected = selected ? selected.concat(controlId) : [controlId];
			}
			this.setState({ selectedCheckboxes: selected })
			this.props.onSelectedChanged(selected, controlId, recordTypeId);
	}

	render() {
		const {options=[], name, horizontal=false, position='before', selected, className='', checkboxClass='', labelClass='',
							label, required=false, whenFilled, error } = this.props;

  	return (
				<div className={className}>
						{label &&
								<div className={styles.row}>
										{label &&
												<span htmlFor={name} className={classes(styles.titleClass, required ? styles.lower : '')}>
														{label}
												</span>
										}
										<div className={styles.leftDown}>
												<Required setIf={required} setWhen={whenFilled}/>
										</div>
								</div>
						}
		        <div className={(horizontal ? styles.horizontal : styles.radio)}>
		            {options && options.length > 0 && options.map((d, index) => {
										return (
												<div key={index}>
														<Checkbox
																id={d.id}
																name={d.id}
																label={d.label}
																labelClass={classes(styles.label, labelClass)}
																className={className}
																position={position}
																checked={selected && selected.length > 0 && selected.indexOf(d.id) > -1}
																onClick={(event) => this.handleChange(event, d.id, selected)}
																checkboxClass={classes(styles.moreBottom, checkboxClass)} />
												</div>
			            	)}
								)}
						</div>
						{error && <div className={styles.alertMessage}>{error}</div>}
				</div>
    )
	};
};
