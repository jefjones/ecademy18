import { useEffect } from 'react'
import InitStudentLoginView from '../views/InitStudentLoginView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import { selectMe} from '../store'


const mapStateToProps = (state, props) => {
		let me = selectMe(state)

    return {
			newLoginPersonId: props.params && props.params.personId,
			langCode: me.langCode,
			username: props.params && props.params.username,
    }
}

const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setPassword: (newLoginPersonId, user) => dispatch(loginUser.setPassword(newLoginPersonId, user)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, personId, langCode} = props
    				getPageLangs(personId, langCode, 'InitStudentLoginView')
    		
  }, [])

  return <InitStudentLoginView {...props} />
}

export default Container
