import { useEffect } from 'react'
import GroupAddNewView from '../views/GroupAddNewView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionGroups from '../actions/groups'
import * as actionPageLang from '../actions/language-list'

import { selectMe, selectLanguageList, selectGroupTypes } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let groupType = selectGroupTypes(state) && selectGroupTypes(state).length > 0 && selectGroupTypes(state).filter(m => m.name === props.params.groupTypeName)[0]

    return {
        personId: me.personId,
        langCode: me.langCode,
        languageChosen: 1,
        languageList: selectLanguageList(state),
        groupTypeDescription: !!groupType ? groupType.description : '',
        groupTypeName: !!groupType ? groupType.name : '',
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addNewGroup: (personId, groupTypeName, groupName, languageChosen, internalId, description) => dispatch(actionGroups.addNewGroup(personId, groupTypeName, groupName, languageChosen, internalId, description)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        const {personId, langCode, getPageLangs} = props
      	getPageLangs(personId, langCode, 'GroupAddNewView')
      
  }, [])

  return <GroupAddNewView {...props} />
}

export default Container
