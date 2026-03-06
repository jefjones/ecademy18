import styles from './WeekdayDisplay.css'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({days=[], long=false, horizontal=true, className}) => {
		//Reorder the days so that they are in order of the sequence of the days of the week.
		let orderedDays = []
		if (days && days.length > 0) {
				if (days.indexOf('sunday') > -1) orderedDays.push('sunday')
				if (days.indexOf('monday') > -1) orderedDays.push('monday')
				if (days.indexOf('tuesday') > -1) orderedDays.push('tuesday')
				if (days.indexOf('wednesday') > -1) orderedDays.push('wednesday')
				if (days.indexOf('thursday') > -1) orderedDays.push('thursday')
				if (days.indexOf('friday') > -1) orderedDays.push('friday')
				if (days.indexOf('saturday') > -1) orderedDays.push('saturday')
		}

		let textResult = []
		let dash = <span></span>
		orderedDays && orderedDays.length > 0 && orderedDays.forEach(m => {
				if (m === 'sunday') {
						let text = long ? <L p={p} t={`Sunday`}/> : <L p={p} t={`Su`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
				if (m === 'monday') {
						let text = long ? <L p={p} t={`Monday`}/> : <L p={p} t={`M`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
				if (m === 'tuesday') {
						let text = long ? <L p={p} t={`Tuesday`}/> : <L p={p} t={`Tu`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
				if (m === 'wednesday') {
						let text = long ? <L p={p} t={`Wednesday`}/> : <L p={p} t={`W`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
				if (m === 'thursday') {
						let text = long ? <L p={p} t={`Thursday`}/> : <L p={p} t={`Th`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
				if (m === 'friday') {
						let text = long ? <L p={p} t={`Friday`}/> : <L p={p} t={`F`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
				if (m === 'saturday') {
						let text = long ? <L p={p} t={`Saturday`}/> : <L p={p} t={`Sa`}/>
						textResult[textResult.length] = dash
						textResult[textResult.length] = text
						dash = <span>-</span>
				}
		})

    return (
        <div className={className ? className : styles.text}>
						{horizontal && textResult}
						{!horizontal &&
								<div>
										{orderedDays && orderedDays.length > 0 && orderedDays.map(m =>
												<div>
														{m === 'sunday' && <div>{long ? <L p={p} t={`Sunday`}/> : <L p={p} t={`Su`}/>}</div>}
														{m === 'monday' && <div>{long ? <L p={p} t={`Monday`}/> : <L p={p} t={`M`}/>}</div>}
														{m === 'tuesday' && <div>{long ? <L p={p} t={`Tuesday`}/> : <L p={p} t={`Tu`}/>}</div>}
														{m === 'wednesday' && <div>{long ? <L p={p} t={`Wednesday`}/> : <L p={p} t={`W`}/>}</div>}
														{m === 'thursday' && <div>{long ? <L p={p} t={`Thursday`}/> : <L p={p} t={`Th`}/>}</div>}
														{m === 'friday' && <div>{long ? <L p={p} t={`Friday`}/> : <L p={p} t={`F`}/>}</div>}
														{m === 'saturday' && <div>{long ? <L p={p} t={`Saturday`}/> : <L p={p} t={`Sa`}/>}</div>}
												</div>
										)}
								</div>
						}
        </div>
    )
}
