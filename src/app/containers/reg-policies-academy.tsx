import { useEffect } from 'react'
import RegPoliciesAcademyView from '../views/RegPoliciesAcademyView'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { useSelector, useDispatch } from 'react-redux'

const mapStateToProps = (state, props) => {
    return {
    }
}

const bindActionsToDispatch = dispatch => ({
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {setMyVisitedPage, personId} = props
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Registration Policies`})
        
  }, [])

  return <RegPoliciesAcademyView {...props} />
}

export default Container
