import * as styles from './EditTableFreezeLeft.css'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

export default ({sortByHeadings={}, headings=[], data=[], className="", labelClass, sendToReport, clickFunction, noColorStripe, isFreezeLeft}) => {

    return (
        <div className={classes(className, styles.container)}>
						<div className={styles.tableWrapper}>
		            <table className={styles.tableClass}>
		                <tbody>
		                {headings && headings[0] && !!headings[0].upperHeader &&
		                    <tr><th colSpan={10} className={classes(styles.firstColumn, styles.upperHeader)}>{headings[0].upperHeader}</th></tr>
		                }
		                {headings && headings[0] && !!headings[0].subUpperHeader &&
		                    <tr><th colSpan={10} className={classes(styles.firstColumn, styles.upperHeader)}>{headings[0].subUpperHeader}</th></tr>
		                }
		                {headings && <tr>
		                        {headings.map((heading, i) => {
		                            return (
		                                <th key={i}
		                                    onClick={heading.pathLink
		                                                ? () => sendToReport(heading.pathLink)
		                                                : heading.clickFunction
		                                                    ? heading.clickFunction
		                                                    : () => {}}
		                                    className={styles.rotate}>
		                                        {heading.label &&
		                                            <div data-rh={heading.reactHint}>
		                                                <span>
		                                                    <span className={heading.verticalText ? styles.textLeft : ''}>
		                                                        {heading.label}
		                                                        {heading.subLabel && <br/>}
		                                                        {heading.subLabel}
		                                                        {heading.languageNames && heading.languageNames.length > 0 &&
		                                                            heading.languageNames.map((lang, index) => {  //eslint-disable-line
		                                                                if (heading.workLanguageName !== lang) {
		                                                                    return <div key={index} className={styles.languageName}>{lang}</div>
		                                                                }
		                                                            })
		                                                        }
		                                                    </span>
		                                                </span>
		                                            </div>
		                                        }
		                                </th>
		                            )})
		                        }
		                    </tr>
		                }
		                {(isFreezeLeft || headings.length > 1) && data.map((row, d) => {
		                    return (
		                        <tr key={d} className={noColorStripe ? styles.forceBackground : ''}>
		                            {row && row.length > 0 && row.map((cell, i) => {
		                                return (
		                                    <td key={cell.key || i}
																				 		data-rh={cell.reactHint}
		                                        colSpan={cell.colSpan ? 20 : 1}
		                                        className={classes(cell.wrapCell ? '' : styles.noWrapCell,
																																(i === 0 ? styles.firstColumn : ''),
																																(cell.pathLink || cell.clickFunction ? styles.tdLink : ''),
		                                                            (cell.nowrap ? styles.noWrap : ''),
																																(cell.cellColor === 'green'
																																		? styles.greenBack
																																		: cell.cellColor === 'red'
																																				? styles.redBack
																																				: cell.cellColor === 'maroon'
																																						? styles.maroonBack
																																						: cell.cellColor === 'gray'
																																								? styles.grayBack
																																								: cell.cellColor === 'pink'
																																										? styles.pinkBack
																																										: cell.cellColor === 'tan'
																																												? styles.tanBack
																																												: cell.cellColor === 'highlight'
																																														? styles.highlightBack
																																														: cell.cellColor === 'response'
																																																? styles.responseBack
																																																:''))}
		                                        onClick={cell.pathLink
		                                                ? () => sendToReport(cell.pathLink)
		                                                : cell.clickFunction
		                                                    ? cell.clickFunction
		                                                    : () => {}
		                                                }>
		                                            {cell.value === 0 ? '' : cell.value}
		                                    </td>
		                                )}
		                            )}
		                        </tr>
		                    )}
		                )}
		                {(!data || data.length === 0 || (headings.length === 1 && !isFreezeLeft)) &&
		                    <tr>
		                        <td className={styles.noWrapCell}>
		                        </td>
		                    </tr>
		                }
		                {!isFreezeLeft && (!data || data.length === 0 || headings.length === 1) &&
		                    <tr>
		                        <td className={classes(styles.noWrapCell, styles.emptyReport)}>
		                            <L p={p} t={`No data found. Consider changing your search criteria.`}/>
		                        </td>
		                    </tr>
		                }
										<tr>
												<td className={styles.noWrapCell}>
														{//This last row is for the apple computers which have the horizonal scroll bar that overlaps the last record inconveniently.
														}
														&nbsp
												</td>
										</tr>
		                </tbody>
		            </table>
						</div>
        </div>
    )
}


//(d % 2 ? styles.grayBack : styles.blueBack),
