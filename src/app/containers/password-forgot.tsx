import { useEffect } from 'react'
import ForgotPasswordView from '../views/LoginView/ForgotPasswordView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import {selectMe} from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
    return {
        loginData: me,
        langCode: me.langCode,
				salta: props.params && props.params.salta,
    }
}

const bindActionsToDispatch = dispatch => ({
    forgotPassword: (emailAddress, phone, salta) => dispatch(loginUser.forgotPassword(emailAddress, phone, salta)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, personId, langCode} = props
    				getPageLangs(personId, langCode, 'ForgotPasswordView')
    		
  }, [])

  return <ForgotPasswordView {...props} />
}

export default Container
