import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as lms from '../actions/learning-management-system'
import { selectMe } from '../store'

const mapStateToProps = (state, props) => {
    return {
      loginData: selectMe(state),
			params_personId: props.params && props.params.personId,
			params_workId: props.params && props.params.workId
    }
}

const bindActionsToDispatch = dispatch => ({
    lmsLogin: (personId, workId) => dispatch(lms.lmsLogin(personId, workId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [timerId, setTimerId] = useState(null)
  const [timerCount, setTimerCount] = useState(0)

  useEffect(() => {
    
    				setTimerId(setInterval(() => checkForTransfer(), 1000))
    		
  }, [])

  return null
}

export default Container
