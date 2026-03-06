import Paths from './Paths'
import styles from './Icon.css'
import classes from 'classnames'

export const Icon = ({pathName='', className='', superscript='', premium, supPremium, fillColor="#000000", supFillColor="#000000", smaller, onClick,
											superScriptClass, dataRh=null, tabIndex=0}) => {
    return (
        <div className={classes(styles.container, superscript ? styles.row : '')} onClick={onClick} data-rh={dataRh} tabIndex={tabIndex}>
            <svg className={classes(styles.icon, (className ? className : premium ? styles.premiumSize : styles.icon16px))}
                    viewBox={premium ? smaller ? "0 0 22 22" : "0 0 20 20" : "0 0 32 32"}>
                <g>
                    {Paths[pathName] && Paths[pathName].map((path, i) =>
                        <path key={i} d={path} fill={fillColor}/>
                    )}
                </g>
            </svg>
            {superscript &&
                <svg className={classes(superScriptClass, styles.superscript)} viewBox={supPremium ? "0 0 20 20" : "0 0 32 32"}>
                    <g>
                        {Paths[superscript] && Paths[superscript].map((path, i) =>
                            <path key={i} d={path} fill={supFillColor}/>
                        )}
                    </g>
                </svg>
            }
        </div>
    )
}


export default Icon
