import styles from './TextIdLine.css'

export default ({text, id, textStyle="", idStyle="", className=""}) => {
    return (
        <div className={className}>
            <span className={(textStyle ? textStyle : styles.textStyle)}>{text}</span>
            <span className={(idStyle ? idStyle : styles.idStyle)}>({id})</span>
        </div>
    )
}
