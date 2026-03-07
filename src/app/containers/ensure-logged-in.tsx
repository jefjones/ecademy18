// ensure-logged-in.js
// React Router v6: this is now a layout route component.
// It renders <Outlet /> (child routes) when logged in, or redirects to /login.
import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector, useDispatch, connect } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { selectMe } from '../store'
import * as actionLogin from '../actions/login'

function mapStateToProps(state, ownProps) {
  return {
    person: selectMe(state),
    ownProps,
  }
}

const bindActionsToDispatch = dispatch => ({
    initRecords: (person) => dispatch(actionLogin.initRecords(person)),
})



function EnsureLoggedInContainer(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    
            const { initRecords } = props
            let isLoggedIn = false
    
            try {
                const { exp } = jwtDecode(window.localStorage.getItem('authToken'))
                isLoggedIn = new Date().getTime() < (exp * 1000)
                setIsLoggedIn(isLoggedIn)
            } catch (e) {
                // token missing or malformed — treat as logged out
            }
    
            if (isLoggedIn) {
                const person = window.localStorage.getItem('person')
                if (person) {
                    initRecords(JSON.parse(person))
                }
            }
        
  }, [])

  if (isLoggedIn) {
              // React Router v6 layout route: render matched child routes
              return <Outlet />
          }
          // Not logged in — redirect to login page
          return <Navigate to="/login" replace />
}

export default connect(mapStateToProps, bindActionsToDispatch)(EnsureLoggedInContainer)

