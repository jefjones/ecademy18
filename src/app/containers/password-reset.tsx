import { useEffect } from 'react'
import ResetPasswordView from '../views/LoginView/ResetPasswordView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import {selectMe} from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
		let me = selectMe(state)

    return {
        loginData: me,
				langCode: me.langCode,
    }
}

const bindActionsToDispatch = dispatch => ({
    setResetPasswordResponse: (resetPasswordCode, emailAddress, password) => dispatch(loginUser.setResetPasswordResponse(resetPasswordCode, emailAddress, password)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, personId, langCode} = props
    				getPageLangs(personId, langCode, 'ResetPasswordView')
    		
  }, [])

  return <ResetPasswordView {...props} />
}

export default Container
