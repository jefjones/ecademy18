import { useEffect } from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { setHttpResponseCode } from '../actions/system'
import NotFound from '../components/Error'

// const pageMeta = {
//     title: "Page Not Found :(",
//     tags: [
//         {"name": "description", "content": "This page was not found or an error occured"},
//         {"property": "og:type", "content": "article"}
//     ]
// };
//
// takes values from the redux store and maps them to props
const mapStateToProps = state => ({
  //propName: state.data.specificData
})

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
})



function NotFoundContainer(props) {
  useEffect(() => {
    
        //props.init();
      
  }, [])

  return <NotFound {...props} />
}

export default connect(mapStateToProps, bindActionsToDispatch)(NotFoundContainer)
