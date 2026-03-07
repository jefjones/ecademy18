import * as styles from './MyFrequentPlaces.css'
import Checkbox from '../Checkbox'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({personId, className, myFrequentPlaces, path, pageName, setMyFrequentPlace }) => {

		let myFrequentPlace = (myFrequentPlaces && myFrequentPlaces.length > 0 && myFrequentPlaces.filter(m => m.path === path)[0]) || {}

    return (
        <div className={styles.container}>
						<hr />
						<div className={styles.myFrequentPlace}>
								<Checkbox
										id={`myFrequentPlace`}
										label={<L p={p} t={`My frequent place`}/>}
										checked={(myFrequentPlace && myFrequentPlace.myFrequentPlaceId) || false}
										onClick={() => setMyFrequentPlace(personId, {...myFrequentPlace, pageName, path, isHomePage: myFrequentPlace.isHomePage })}
										labelClass={styles.labelCheckbox} />
								{/*myFrequentPlace && myFrequentPlace.myFrequentPlaceId &&
										<div className={styles.homeChoice}>
												<Checkbox
														id={`myFrequentPlaceHome`}
														label={`Make this my home page on start-up`}
														checked={myFrequentPlace.isHomePage || false}
														onClick={() => setMyFrequentPlace(personId, {...myFrequentPlace, isHomePage: !myFrequentPlace.isHomePage }, 'HOME')}
														labelClass={styles.labelCheckbox} />
										</div>
								*/}
						</div>
						<hr />
        </div>
    )
}
