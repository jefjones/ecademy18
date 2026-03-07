import { useEffect } from 'react'
import PreGateView from '../views/PreGateView'
import { useSelector, useDispatch, connect } from 'react-redux'
import { setPageMeta } from '../actions/page-meta'
import { selectMe  } from '../store'

const pageMeta = {
  title: "edit by invite",
  tags: [
      {"name": "description", "content": "edit by invite, multiple editors, document editing, tranlating, translation, collaboration"},
      {"property": "og:type", "content": "article"}
  ]
}

// takes values from the redux store and maps them to props
const mapStateToProps = (state, ownProps) => {
    return {
        personId: selectMe(state) && selectMe(state).personId,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
  setPageMeta: (meta) => dispatch(setPageMeta(meta)),
})

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component




function HomeContainer(props) {
  useEffect(() => {
    
          props.init()
      
  }, [])

  return <PreGateView {...props} />
}

export default connect(mapStateToProps, bindActionsToDispatch)(HomeContainer)
