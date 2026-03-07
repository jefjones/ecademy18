import { useEffect } from 'react'
import CreateNewSchoolView from '../views/CreateNewSchoolView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import * as actionOrganizationNames from '../actions/organization-names'
import { selectOrganizationNames, selectMe } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let me = selectMe(state)

    return {
			personId: me.personId,
			langCode: me.langCode,
			//newLoginPersonId: props.params && props.params.newLoginPersonId,
      // username: props.username,
      // password: props.password,
      //loginData: selectMe(state),
			organizationNames: selectOrganizationNames(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		// hasInitialPassword: (newLoginPersonId) => dispatch(loginUser.hasInitialPassword(newLoginPersonId)),
		getOrganizationNames: () => dispatch(actionOrganizationNames.init()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {personId, getPageLangs, langCode, getOrganizationNames} = props
    				getPageLangs(personId, langCode, 'CreateNewSchoolView')
    				//if (newLoginPersonId) hasInitialPassword(newLoginPersonId);
    				getOrganizationNames()
    		
  }, [])

  return <CreateNewSchoolView {...props} />
}

export default Container
