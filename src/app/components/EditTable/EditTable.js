import React from 'react';
import styles from './EditTable.css';
import classes from 'classnames';
import Loading from '../Loading';
const p = 'component';
import L from '../../components/PageLanguage';

export default ({id, sortByHeadings={}, headings=[], data=[], className="", labelClass, sendToReport, clickFunction, noColorStripe, emptyMessage, border=0,
									lowLineHeight, onScroll, isFetchingRecord}) => {

    return (
        <div className={classes(className, styles.container)} id={id} key={id}>
            <table className={styles.tableClass} border={border}>
                <tbody>
                {headings && headings[0] && !!headings[0].upperHeader &&
                    <tr><th colSpan={10} className={styles.upperHeader}>{headings[0].upperHeader}</th></tr>
                }
                {headings && headings[0] && !!headings[0].subUpperHeader &&
                    <tr><th colSpan={10} className={styles.upperHeader}>{headings[0].subUpperHeader}</th></tr>
                }
                {headings && <tr className={styles.tallRow}>
                        {headings.map((heading, i) => {
                            return (
                                <th key={i}
																		colSpan={heading.colSpan ? heading.colSpan : 1}
                                    className={classes(styles.header, labelClass, (lowLineHeight ? '' : styles.lineHeight2),
																												(heading.languageNames && heading.languageNames.length > 0 ? styles.headerOverride : ''),
                                                        (heading.verticalText ? styles.rotate : ''),
																												(heading.tightText ? styles.headerOverride : ''),
                                                        (heading.redColor ? styles.redColor : ''))}>
                                        {heading.label &&
                                            <div data-rh={heading.reactHint}
																								className={classes((heading.verticalText ? styles.textLeft : ''),
																										((heading.pathLink || heading.clickFunction) && !heading.notShowLink
																												? heading.biggerClickArea && !heading.notShowLink
																														? styles.tdBigLink
																														: styles.tdLink
																												: styles.regularHeader))}
																								onClick={heading.pathLink
		                                                ? () => sendToReport(heading.pathLink)
		                                                : heading.clickFunction
		                                                    ? heading.clickFunction
		                                                    : () => {}}>

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
                                            </div>
                                        }
                                </th>
                            )})
                        }
                    </tr>
                }
                {headings.length > 1 && data && data.length > 0 && data.map((row, d) => {
                    return (
                        <tr key={d} className={classes(styles.verticalAlign, (noColorStripe ? styles.forceBackground : ''))}>
                            {row && row.length > 0 && row.map((cell, i) => {
                                return (
                                    <td key={cell.key || i}
																				data-rh={cell.reactHint}
																				colSpan={cell.colSpan ? 20 : 1}
                                        className={classes(styles.verticalAlign, cell.dataLabel, (cell.boldText ? styles.bold : ''),
																														(lowLineHeight ? '' : styles.lineHeight2),
																														(cell.wrapCell ? '' : styles.noWrapCell),
																														((cell.pathLink || cell.clickFunction) && !cell.notShowLink ? styles.divLink : ''),
                                                            (cell.noWrap ? styles.noWrap : ''),
																														(cell.textColor === 'white' ? styles.textColorWhite : ''  ),
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
																																												: cell.cellColor === 'white'
																																														? styles.whiteBack
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
                {/*(!data || data.length === 0 || headings.length === 1) &&
                    <tr>
                        <td className={styles.noWrapCell}>
                        </td>
                    </tr>
                */}
                {(!data || data.length === 0 || headings.length === 1) &&
                    <tr>
												<td>
												</td>
                        <td className={classes(styles.noWrapCell, styles.emptyReport, styles.whiteBack)} colSpan={20}>
														{isFetchingRecord &&
																<Loading isLoading={true} />
														}
                            {isFetchingRecord ? '' : emptyMessage ? emptyMessage : <L p={p} t={`No data found`}/>}
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </div>
    )
};


//(d % 2 ? styles.grayBack : styles.blueBack),
