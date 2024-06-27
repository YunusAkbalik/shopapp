import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { handleErrorResponse } from '../helpers/errorHandler'
import { useToast } from '@chakra-ui/react'

const ProtectedRoute = ({ admin }) => {
  const { loggedIn, user } = useAuth()
  const toast = useToast()
  try {
    if (admin && user.role !== 'admin') {
      return <Navigate to="/"/>
    }
  }catch (e){
    handleErrorResponse(e,toast)
    return <Navigate to={'/'} />
  }

  return loggedIn ? <Outlet/> : <Navigate to="/"/>
}

export default ProtectedRoute