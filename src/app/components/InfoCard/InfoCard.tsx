import * as styles from './InfoCard.css'

export default ({data={}, className=""}) => {

    return (
        <div className={className}>
            {data.map( (field, i) => (
                <div key={i} >
                    <span className={styles.label}>{field.label}</span>
                    <span className={styles.data}>{field.value}</span>
                </div>
                )
            )}
        </div>
    )
}
