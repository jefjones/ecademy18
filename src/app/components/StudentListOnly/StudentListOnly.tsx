import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './StudentListOnly.css'
import DateMoment from '../DateMoment'
import EditTable from '../EditTable'
import { withAlert } from 'react-alert'
const p = 'component'
import L from '../../components/PageLanguage'

function StudentListOnly(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_duplicate, setIsShowingModal_duplicate] = useState(false)
  const [isShowingModal_hasSchedule, setIsShowingModal_hasSchedule] = useState(false)
  const [studentPersonId, setStudentPersonId] = useState(students[0].personId)

  const {students, gradeLevels} = props
  				
  
  				let headings = [
  						{label: <L p={p} t={`Student`}/>, tightText: true, },
  						{label: <L p={p} t={`Grade`}/>, tightText: true, },
  						{label: <L p={p} t={`Last Login`}/>, tightText: true, },
  				]
  
  				let data = students && students.length > 0 && students.map((m, i) => {
  						return [
  								{ value: m.label,
  										clickFunction: () => chooseRecord(m.personId, m.studentType),
  										cellColor: m.personId === studentPersonId ? 'highlight' : '',
                      boldText: true,
  								},
  								{ value: gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(g => g.id === m.gradeLevelId)[0] && gradeLevels.filter(g => g.id === m.gradeLevelId)[0].label,
  										cellColor: m.personId === studentPersonId ? 'highlight' : ''
  								},
  								{ value: m.lastLoginDate > '2010-01-01'
  										 		? <DateMoment date={m.lastLoginDate}  format={'D MMM YYYY  h:mm a'} minusHours={6} className={styles.entryDate}/>
  												: '',
  										cellColor: m.personId === studentPersonId ? 'highlight' : ''
  								}
  						]
  				})
  
          return (
  						<div className={styles.container}>
  								<EditTable headings={headings} data={data} noColorStripe={true}/>
  						</div>
          )
}

export default withAlert(StudentListOnly)
