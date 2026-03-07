import * as styles from './Required.css'
import Icon from '../Icon'

export default ({setIf=false, setWhen=false, className, hideWhenFilled, iconWarningJSX}) => {
    return (
        setIf
            ? setWhen
                ? hideWhenFilled
                    ? null
                    : !setWhen && iconWarningJSX
												? iconWarningJSX
												: <Icon pathName={setWhen ? 'checkmark' : 'warning'} className={className ? className : styles.warning} fillColor={setWhen ? 'green' : 'red'} tabIndex={-1}/>
    						: !setWhen && iconWarningJSX
										? iconWarningJSX
										: <Icon pathName={setWhen ? 'checkmark' : 'warning'} className={className ? className : styles.warning} fillColor={setWhen ? 'green' : 'red'} tabIndex={-1}/>
            : null
    )
}


// If we want it required then
// 	if the required details are entered
// 		if this is set to hide
// 			don't show
// 		else
// 		    show required
// 	else
// 		show required
//
// otherwise
// 	hide required
