import { useEffect, useState } from 'react';  //PropTypes
import styles from './LoadingModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'

function LoadingModal(props) {
  const [error, setError] = useState('')
  const [indicator, setIndicator] = useState('...')
  const [timerId, setTimerId] = useState(null)
  const [styleIndex, setStyleIndex] = useState(0)
  const [styleArray, setStyleArray] = useState([styles.first, styles.second, styles.third, styles.fourth])
  const [direction, setDirection] = useState('increasing')

  useEffect(() => {
    
            setTimerId(setInterval(() => showProgress(), 1000))
        
    return () => {
      
              clearInterval(timerId)
          
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            const {isLoading, handleClose} = props
            if (!isLoading) {
                clearInterval(timerId)
                handleClose()
            }
        
  }, [])

  const {handleClose, className, loadingText} = props
          
  
          return (
              <div className={classes(styles.container, className)}>
                  <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
                    <ModalDialog onClose={handleClose} className={styles.label}>
                        {error && "An Error Occurred"}
                        <span ref={ref => {loadingThing = ref}}>
                           {loadingText ? loadingText : 'Loading'}
                        </span>
                        <span>{indicator}</span>
                    </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default LoadingModal
