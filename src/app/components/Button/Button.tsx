import React from 'react';
import styles from './Button.css';
import classes from 'classnames';

type Props {
  label: string,
  id: number;
  disabled: boolean;
  onClick: () => void;
  replaceClassName: string;
  addClassName: string;
  keyIndex: number;
  changeRed: boolean;
}

const Button = ({label="", id, disabled=false, onClick, replaceClassName, addClassName, keyIndex, changeRed}: Props) => {
    return (
        <button id={id} name={name} key={keyIndex} disabled={disabled}
								className={classes(addClassName, (replaceClassName ? replaceClassName : styles.button), (changeRed ? styles.redButton : ''), (disabled ? styles.opacityLow : ''))}
								onClick={disabled ? () => {} : onClick}>
						{label}
				</button>
    )
};

export default Button
