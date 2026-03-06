import 'react'
import RegPoliciesElementaryView from '../views/RegPoliciesElementaryView'
import { useSelector, useDispatch } from 'react-redux'

const mapStateToProps = (state, props) => {

    return {
    }
}

const bindActionsToDispatch = dispatch => ({
})


const Container = props => {
    return <RegPoliciesElementaryView {...props} />
}

export default Container
