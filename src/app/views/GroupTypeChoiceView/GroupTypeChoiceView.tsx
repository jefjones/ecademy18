
import { Link } from 'react-router-dom'
import styles from './GroupTypeChoiceView.css'
const p = 'GroupTypeChoiceView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import OneFJefFooter from '../../components/OneFJefFooter'

function GroupTypeChoiceView(props) {
  let {groupTypes} = props
          groupTypes = !!groupTypes && groupTypes.filter(m => m.name === "FACILITATORLEARNER")
  
          return (
              <div className={styles.container}>
                  <div className={globalStyles.pageTitle}>
                      <L p={p} t={`Create New Group`}/>
                  </div>
                  {groupTypes && groupTypes.length > 0 &&
                      <Accordion allowMultiple={true}>
                          {groupTypes.map((s, i) => {
                              return (
                                <AccordionItem title={s.description} key={i} className={styles.accordionTitle} onTitleClick={`SameAsOnClick`} expanded={true}>
                                  <Link to={`/groupAddNew/` + s.name} className={styles.button}><L p={p} t={`Create`}/></Link>
                                    {s.groupExplain && s.groupExplain.length > 0 &&
                                        s.groupExplain.map((m, mIndex) =>
                                           <span key={mIndex} className={styles.explanation}>{m.explanation}</span>
                                    )}
                                  <hr />
                                </AccordionItem>
                              )
                          })}
                      </Accordion>
                  }
                  <OneFJefFooter />
              </div>
          )
}
export default GroupTypeChoiceView
