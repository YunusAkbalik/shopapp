import { createContext, useContext, useEffect, useState } from 'react'
import { fetchLogin, fetchMe } from '../api'
import CustomSpinner from '../components/CustomSpinner'
import { handleErrorResponse } from '../helpers/errorHandler'
import { useToast } from '@chakra-ui/react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {

    (async () => {
      try {
        if (!localStorage.getItem('access_token')) {
          setLoading(false)
          return
        }
        const me = await fetchMe()
        setLoggedIn(true)
        setUser(me)
        setLoading(false)

      } catch (e) {
        logout()
        handleErrorResponse(e, toast)
      }
    })()

  }, [])

  const logout = () => {
    setLoggedIn(false)
    setUser(null)
    setLoading(false)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const register = async (data) => {
    try {
      setLoggedIn(true)
      setUser(data)

      const loginResponse = await fetchLogin({
        email: data.email,
        password: data.password
      })

      localStorage.setItem('access_token', loginResponse.access_token)
      localStorage.setItem('refresh_token', loginResponse.refresh_token)
    } catch (e) {
      logout()
      handleErrorResponse(e, toast)
    }

  }

  const login = async (data) => {
    try {
      setLoading(true)
      setLoggedIn(true)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      const me = await fetchMe()
      setUser(me)
      setLoading(false)
    } catch (e) {
      logout()
      handleErrorResponse(e, toast)
    }

  }

  const values = {
    loggedIn,
    user,
    register,
    login,
    logout,
    setUser
  }

  if (loading) {
    return (
      <CustomSpinner/>
    )
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }