import * as styles from './TeaserGrid.css'
import classes from 'classnames'
import TeaserImage from '../TeaserImage/TeaserImage'


export default ({teasers=[], className=""}) => {

    return (
        <div className={styles.container}>
            {teasers.map((teaser, i) => (
                <div key={i} className={styles.child}>
                    <TeaserImage className="" teaser={teaser}/>
                </div>
            ))}
        </div>
    )
}
