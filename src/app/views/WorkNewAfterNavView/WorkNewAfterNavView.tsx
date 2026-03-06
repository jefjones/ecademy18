
import styles from './WorkNewAfterNavView.css'
const p = 'WorkNewAfterNavView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { Link } from 'react-router-dom'
import WorkSummary from '../../components/WorkSummary'
import Accordion from '../../components/ListAccordion/Accordion/Accordion'
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem'
import OneFJefFooter from '../../components/OneFJefFooter'

function WorkNewAfterNavView(props) {
  const {workSummary, deleteWork, personId, setWorkCurrentSelected, deleteChapter, updateChapterDueDate, updateChapterComment,
              updatePersonConfig, personConfig} = props
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  New Document
              </div>
              <Accordion allowMultiple={true} noShowExpandAll={true}>
                  <AccordionItem title={workSummary.title} isCurrentTitle={workSummary.isCurrentWork} expanded={false}
                          className={styles.accordionTitle} onTitleClick={setWorkCurrentSelected}
                          showAssignWorkToEditor={false} personId={personId} workSummary={workSummary}
                          setWorkCurrentSelected={setWorkCurrentSelected}
                          deleteWork={deleteWork} deleteChapter={deleteChapter}
                          updatePersonConfig={updatePersonConfig} personConfig={personConfig}>
                      <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={false} showTitle={false}
                          setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter}
                          updateChapterDueDate={updateChapterDueDate} updateChapterComment={updateChapterComment} indexName={`workSettings`}
                          updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                  </AccordionItem>
              </Accordion>
              <hr />
              <span className={styles.goWhere}>Where do you want to go now?</span>
              <ul className={styles.unorderedList}>
                <li><Link to={`/editReview/${workSummary.workId}`} className={styles.menuItem}><L p={p} t={`See the text`}/></Link></li>
                  <li><Link to={'/workAddNew'} className={styles.menuItem}><L p={p} t={`Add another document`}/></Link></li>
                  <li><hr /></li>
                  <li><Link to={`/splitChapter`} className={styles.menuItem}><L p={p} t={`Split the text into one or more sections`}/></Link></li>
                  <li><Link to={`/addOrUpdateChapter`} className={styles.menuItem}><L p={p} t={`Add a section`}/></Link></li>
                  <li><hr /></li>
                  <li><Link to={`/giveAccessToEditors`} className={styles.menuItem}><L p={p} t={`Give access to your editors`}/></Link></li>
                  <li><Link to={`/editorInviteNameEmail`} className={styles.menuItem}><L p={p} t={`Invite new editor`}/></Link></li>
                  <li><hr /></li>
                  <li><Link to={`/workSettings`} className={styles.menuItem}><L p={p} t={`This document's settings`}/></Link></li>
                  <li><hr /></li>
                  <ul>
                      <OneFJefFooter />
                  </ul>
              </ul>
          </div>
      )
}
export default WorkNewAfterNavView
