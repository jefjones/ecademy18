import React from 'react';
import styles from './FilterOptions.css';
import classes from 'classnames';
// import Button from '../Button/Button.js';
// import Icon from '../Icon/Icon.js';
import SearchText from '../../components/SearchText/SearchText.js';
import SelectMultiplePopover from '../../components/SelectMultiplePopover/SelectMultiplePopover.js';
import Checkbox from '../../components/Checkbox/Checkbox.js';
import InputText from '../../components/InputText/InputText.js';
import SelectSingleDropDown from '../../components/SelectSingleDropDown/SelectSingleDropDown.js';
import {Link} from 'react-router';

export const FilterOptions = ({controls=[]}) => (
    <div className={styles.container}>
        {controls.map((control, i) => {
            switch(control.type) {
                case "SearchText":
                    return (
                        <SearchText key={i}
                            className={classes(control.className, styles.searchText)}
                            icon={control.icon}
                            placeholder={control.placeholder}
                            justify={control.justify}
                            value={control.searchText}
                            onChange={control.action}
                        />
                    )
                case "SelectMultiplePopover": {
                    return (
                        <SelectMultiplePopover key={i}
                            label={control.label}
                            disabled={control.disabled}
                            className={classes(control.className, styles.popover, styles[`width${control.width}`])}>
                                {control.options.map(({type, label, parentLevel, subLevel, isOpen, id, isChosen, doNotHide}, index) => {
                                    if (!doNotHide) {
                                        if (type === "LABELONLY") {
                                            return <span key={index} className={styles.option}>{label}</span>
                                        } else if (type === "LINEDIVIDER") {
                                            return <hr key={index} className={styles.lineDivider}/>
                                        } else {
                                            return (
                                                <div key={index}>
                                                    <span className={styles.inline}>
                                                        {parentLevel && <span className={styles.smaller} onClick={() => control.expandOrCollapse(id)}>
                                                            {!parentLevel && !isOpen ? '' : isOpen ? '▼' : '►'}
                                                        </span>}
                                                        {!subLevel && <Checkbox
                                                            label={label}
                                                            checked={isChosen}
                                                            checkboxClass={classes(styles.child, (!parentLevel ? styles.halfIndent : ''))}
                                                            onClick={() => control.action(id)}/>}
                                                    </span>
                                                    <span>
                                                        {subLevel && isOpen &&
                                                            <Checkbox
                                                                label={label}
                                                                hasTab={`true`}
                                                                checked={isChosen}
                                                                checkboxClass={classes(styles.child, (subLevel === 1 && isOpen ? styles.indent : ''), (subLevel === 2 && isOpen ? styles.indentTwo : ''))}
                                                                onClick={() => control.action(id)}/>}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    }})
                                }
                                {control.selectAllAction &&
                                    <div className={styles.selectAllContainer}>
                                        <Link className={styles.linkText} onClick={() => control.selectAllAction(control.options.map(option => option.id))}>Select All</Link>
                                        <Link className={styles.linkText} onClick={control.unselectAllAction}>Clear Selections</Link>
                                    </div>}


                        </SelectMultiplePopover>
                    )
                }
                case "SelectSingleDropDown":
                    return (
                        <SelectSingleDropDown key={i}
                            label={''}
                            id={control.id}
                            value={control.initialValue}
                            options={control.options}
                            error={''}
                            height={control.height}
                            className={classes(control.className, styles.singleDropDown)}
                            onChange={control.action}
                        />
                    )
                case "Checkbox":
                    return (
                        <Checkbox key={i}
                            label={control.label}
                            checked={control.isChosen}
                            className={classes(control.className, styles.checkbox)}
                            checkboxClass={styles.child}
                            onClick={() => control.action(control.id)}
                        />
                    )
                case "InputText":
                    return (
                        <InputText key={i}
                            id={control.id}
                            name={control.id}
                            label={control.label}
                            value={control.value}
                            height={control.height}
                            size={control.size ? control.size : "short"}
                            className={classes(control.className, styles.inputText)}
                            onChange={control.action}
                        />
                    )
                default:
                    return null;
                }
            })
        }
    </div>
)

export default FilterOptions;


// <Checkbox key={index}
//     label={label}
//     checked={isChosen}
//     checkboxClass={styles.child}
//     onClick={() => control.action(id)}/>
