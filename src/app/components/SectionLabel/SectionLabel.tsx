import styles from './SectionLabel.css'

export const SectionLabel = ({mainLabel, addOnLabel, subLabel, mainStyle, subStyle}) => (
    <div className={styles.container}>
        <div className={(mainStyle ? mainStyle : styles.mainStyle)}>
            {mainLabel}
            <span className={styles.addOnLabel}>{addOnLabel}</span>
        </div>
        <div className={(subStyle ? subStyle : styles.subStyle)}>
            {subLabel}
        </div>
    </div>
)

export default SectionLabel
