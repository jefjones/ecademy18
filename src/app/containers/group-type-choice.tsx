import { useEffect } from 'react'
import GroupTypeChoiceView from '../views/GroupTypeChoiceView'
import * as actionPageLang from '../actions/language-list'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'

import { selectMe, selectGroupTypes } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        groupTypes: selectGroupTypes(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        const {personId, langCode, getPageLangs} = props
      	getPageLangs(personId, langCode, 'GroupTypeChoiceView')
      
  }, [])

  return <GroupTypeChoiceView {...props} />
}

export default Container
