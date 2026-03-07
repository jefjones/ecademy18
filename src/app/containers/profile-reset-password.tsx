import { useEffect } from 'react'
import ProfileResetPasswordView from '../views/ProfileResetPasswordView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import { selectMe } from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
    return {
			personId: me.personId,
			newLoginPersonId: props.params && props.params.personId,
			langCode: me.langCode,
      loginData: me,
    }
}

const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		resetPasswordByAdmin: (personId, userPersonId, password) => dispatch(loginUser.resetPasswordByAdmin(personId, userPersonId, password)),
		resetMyProfilePassword: (newLoginPersonId, password) => dispatch(loginUser.resetMyProfilePassword(newLoginPersonId, password)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, personId, langCode} = props
    				getPageLangs(personId, langCode, 'ProfileResetPasswordView')
    		
  }, [])

  return <ProfileResetPasswordView {...props} />
}

export default Container
