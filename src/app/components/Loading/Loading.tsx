import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './Loading.css'
import classes from 'classnames'
import ButtonWithIcon from '../ButtonWithIcon'
const p = 'component'
import L from '../../components/PageLanguage'

function Loading(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [error, setError] = useState('')
  const [indicator, setIndicator] = useState('...')
  const [timerId, setTimerId] = useState(null)
  const [styleIndex, setStyleIndex] = useState(0)
  const [styleArray, setStyleArray] = useState([styles.first, styles.second, styles.third, styles.fourth])
  const [direction, setDirection] = useState('increasing')
  const [indexCount, setIndexCount] = useState(0)
  const [refreshMessage, setRefreshMessage] = useState(undefined)

  useEffect(() => {
    
            setTimerId(setInterval(() => showProgress(), 1000))
        
    return () => {
      
              clearInterval(timerId)
          
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            !props.isLoading && clearInterval(timerId)
        
  }, [])

  const {isLoading, loadingText='Loading', className, refreshTo} = props
          
  
          return (
              <div>
                  {isLoading
  										? refreshMessage
  												? <div className={classes(styles.container, styles.label, className)}>
  			                        <div className={styles.blue}><L p={p} t={`It's taking too long!`}/></div>
  															<ButtonWithIcon icon={'sync'} label={<L p={p} t={`Refresh`}/>} onClick={refreshTo ? navigate(refreshTo) : () => goBack()} />
  			                    </div>
  												: <div className={classes(styles.container, styles.label, className)}>
  			                        {error && <L p={p} t={`An Error Occurred`}/>}
  			                        <span ref={ref => {loadingThing = ref}}>{loadingText} </span>
  			                        <span>{indicator}</span>
  			                    </div>
  										: ''
                  }
              </div>
  				)
}
export default Loading
