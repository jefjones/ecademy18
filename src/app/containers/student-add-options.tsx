import { useEffect } from 'react'
import StudentAddOptionsView from '../views/StudentAddOptionsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import {selectMe, selectCompanyConfig} from '../store'

const mapStateToProps = (state, props) => {
	let me = selectMe(state)
    return {
			personId: me.personId,
			langCode: me.langCode,
			companyConfig: selectCompanyConfig(state),
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
    
    				const {getPageLangs, personId, langCode} = props
    				getPageLangs(personId, langCode, 'StudentAddOptionsView')
    		
  }, [])

  return <StudentAddOptionsView {...props} />
}

export default Container
