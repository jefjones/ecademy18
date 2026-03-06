import { useEffect } from 'react'
import AdminAddView from '../views/AdminAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAdmins from '../actions/admins'
import * as loginUser from '../actions/login'
import { selectMe, selectUsers, selectCompanyConfig, selectAccessRoles, selectGradeLevels } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let admin = props.params && props.params.adminPersonId && selectUsers(state) && selectUsers(state).filter(m => m.personId === props.params.adminPersonId)[0]
    return {
				loginData: me,
				langCode: me.langCode,
        admin,
				adminPersonId: props.params && props.params.adminPersonId,
        companyConfig: selectCompanyConfig(state),
        personId: selectMe(state) && selectMe(state).personId,
        existingAdmins: selectUsers(state, 'Admin'),
        tabsData: {chosenTab: 'FieldEntry', tabs: [{id: 'FieldEntry', label: 'Field Entry'}, {id: 'BulkPaste', label: 'Bulk Paste'}]},
				accessRoles: selectAccessRoles(state),
				gradeLevels: selectGradeLevels(state),
        bulkDelimiterOptions: [{id: 'comma', label: ', comma'},
            {id: 'semicolon', label: '; semicolon'},
            {id: 'hyphen', label: '- hyphen'},
            {id: 'tab', label: 'tab'},
        ],
        fieldOptions: [
            {id: 'firstName', label: 'first name'},
            {id: 'lastName', label: 'last name'},
            {id: 'fullNameLastFirst', label: 'full name (last name first)'},
            {id: 'fullNameFirstFirst', label: 'full name (first name first)'},
            {id: 'externalId', label: 'external id'},
            {id: 'emailAddress', label: 'email address'},
            {id: 'phone', label: 'phone'},
						{id: 'mentor', label: 'learning coach'},
            //{id: 'username', label: 'Username'},
        ],
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addAdmin: (personId, admin) => dispatch(actionAdmins.addAdmin(personId, admin)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updateAdmin: (personId, admin) => dispatch(actionAdmins.updateAdmin(personId, admin)),
    removeAdmin: (personId, member_personId) => dispatch(actionAdmins.removeAdmin(personId, member_personId)),
		login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        		const {getPageLangs, personId, langCode} = props
        		getPageLangs(personId, langCode, 'AdminAddView')
      	
  }, [])

  return <AdminAddView {...props} />
}

export default Container
