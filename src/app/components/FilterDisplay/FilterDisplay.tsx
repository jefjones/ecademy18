import * as styles from './FilterDisplay.css'
//import classes from 'classnames';
import { Link } from 'react-router-dom'

const FilterDisplay = ({display={}}) => {
    let recordCount = display.reportSections && display.reportSections.length > 0
                        ? display.reportSections.reduce((acc, section) => { acc = acc + section.data.length; return acc; }, 0)
                        : display.data && display.data.length
    if (!recordCount)
        return <span></span>

    return (
        <div className={styles.container}>
            <span className={styles.label}>{`Showing ${recordCount} results`}</span>
            {display.sectionsToShow && display.sectionsToShow.length > 0 &&
                display.sectionsToShow.length === display.sectionsList.length
                ? (<div className={styles.button} onClick={display.clearAllFilters}>
                      {`All Organizations`}
                      <span className={styles.deleteIcon}>&#x029BB;</span>
                   </div>)
                : display.sectionsToShow && display.sectionsToShow.map((section, i) => {
                    let filter = display.sectionsList.filter(item => item.id === section)[0]
                    return (<div key={i} className={styles.button} onClick={() => display.deleteFilter(filter.id)}>
                                {filter && filter.label}
                                <span className={styles.deleteIcon}>&#x029BB;</span>
                            </div>)
                    }
                )
            }
            <Link onClick={display.clearAllFilters} className={styles.clearLink}>Clear Filters <span>&#x029BB;</span></Link>
        </div>
    )
}

export default FilterDisplay
