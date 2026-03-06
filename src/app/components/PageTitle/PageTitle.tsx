import styles from './PageTitle.css'
import classes from 'classnames'
import Button from '../Button/Button'
import Icon from '../Icon/Icon'

export const PageTitle = ({title, description, lineStyle, titleStyle, subStyle, printURL}) => (
    <div>
        <div className={classes((lineStyle ? lineStyle : styles.lineStyle), (titleStyle ? titleStyle : styles.titleStyle))}>
            {title}
            {printURL &&
            <span className={styles.farRight}>
                <Button onClick={printURL} className={styles.iconButton}>
                    <Icon pathName={"file_text2"} className={styles.printIcon}/>{`Print`}
                </Button>
            </span>}
        </div>
        {description && <div className={classes(styles.description, (subStyle ? subStyle : styles.subStyle))}
            dangerouslySetInnerHTML={{__html: description}}>
        </div>}

    </div>
)

export default PageTitle
