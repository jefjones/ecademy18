import styles from './MenuPopupSection.css'
import classNames from 'classnames'
//import { Link } from 'react-router-dom';

const titleCase = function(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1))
  }).join(' ')
}


export default ({items=[], divStyle="", textStyle=""}) => {
    return (
        <div className={classNames(styles.columnWidth)}>
            {items && items.map(({name, url, hiddenMenuSearchOnly, liClass, urlInNewWindow, title}, d) =>
                !hiddenMenuSearchOnly &&
                    <a key={d} href={url} className={classNames((liClass === "react-implemented"? styles.highlight : ''), textStyle, divStyle)} target={(urlInNewWindow ? '_blank': '')} title={(title ? '_blank': '')}>
                        {titleCase(name.replace(/\./g, " ").replace("menu ", ""))}
                    </a>
            )}
        </div>
    )
}
