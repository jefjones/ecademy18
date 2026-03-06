
import styles from './ContextKnowledgeRating.css'
import StandardsRatingColor from '../StandardsRatingColor'
import classes from 'classnames'

function ContextKnowledgeRating(props) {
  const {className, onClick, studentPersonId, assignmentId, standardsRatings} = props
  
          return (
              <div className={classes(styles.container, className, styles.rowWrap)}>
                  {standardsRatings && standardsRatings.length > 0 && standardsRatings.map((m, i) =>
                      <div key={i} onClick={() => onClick(studentPersonId, assignmentId, i+1*1)} className={styles.space}>
                          <StandardsRatingColor label={m.levelAbbrev} color={m.color} description={m.description} showName={false} name={m.name}/>
                      </div>
                  )}
              </div>
          )
}
export default ContextKnowledgeRating
