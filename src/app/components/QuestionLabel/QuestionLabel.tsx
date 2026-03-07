import * as styles from './QuestionLabel.css'

export default ({label}) => {
  return (
    <div>
      <hr className={styles.hrHeight}/>
      <div className={styles.questionType}>{label}</div>
    </div>
  )
}
