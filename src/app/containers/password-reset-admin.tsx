import { useEffect } from 'react'
import PasswordResetAdminView from '../views/PasswordResetAdminView'
import NotFound from '../components/Error'
import * as actionPageLang from '../actions/language-list'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as loginUser from '../actions/login'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import {doSort} from '../utils/sort'
import { selectMe, selectStudents, selectGuardians, selectUsers, selectAccessRoles, selectMyFrequentPlaces } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let users = selectUsers(state, 'Facilitator')
    users = users.concat(selectGuardians(state))
    users = users.concat(selectStudents(state))
    users = doSort(users, { sortField: 'label', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
  			newLoginPersonId: props.params && props.params.personId,
        loginData: selectMe(state),
        accessRoles: selectAccessRoles(state),
        users,
        myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		resetPasswordByAdmin: (personId, userPersonId, password) => dispatch(loginUser.resetPasswordByAdmin(personId, userPersonId, password)),
    setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, personId, langCode} = props
            getPageLangs(personId, langCode, 'PasswordResetAdminView')
        
  }, [])

  const {accessRoles} = props
          return accessRoles.admin ? <PasswordResetAdminView {...props} /> : <NotFound />
}

export default Container
