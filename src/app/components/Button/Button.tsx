import * as styles from './Button.css'
import classes from 'classnames'

interface ButtonProps {
  label?: string
  id?: string | number
  disabled?: boolean
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  replaceClassName?: string
  addClassName?: string
  keyIndex?: string | number
  changeRed?: boolean
}

const Button = ({
  label = '',
  id,
  disabled = false,
  onClick,
  replaceClassName,
  addClassName,
  keyIndex,
  changeRed,
}: ButtonProps) => {
  return (
    <button
      id={id != null ? String(id) : undefined}
      key={keyIndex}
      disabled={disabled}
      className={classes(
        addClassName,
        replaceClassName ? replaceClassName : styles.button,
        changeRed ? styles.redButton : '',
        disabled ? styles.opacityLow : '',
      )}
      onClick={disabled ? () => {} : onClick}
    >
      {label}
    </button>
  )
}

export default Button

