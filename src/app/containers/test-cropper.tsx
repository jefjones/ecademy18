import 'react'
import TestCropperView from '../views/TestCropperView'
import { useSelector, useDispatch } from 'react-redux'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    return {
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
})


const Container = props => {
    return <TestCropperView {...props} />
}

export default Container
