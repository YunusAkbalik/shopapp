import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './styles.module.css'
import { Button, Select, useToast } from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { useBasket } from '../../contexts/BasketContext'
import { fetchCategories, fetchMakeAdmin } from '../../api'
import { handleErrorResponse } from '../../helpers/errorHandler'
import { useQuery } from '@tanstack/react-query'
import CustomSpinner from '../CustomSpinner'
import React from 'react'

function Navbar() {

  const { loggedIn, logout, user, setUser } = useAuth()
  const { items } = useBasket()
  const [searchParams, setSearchParams] = useSearchParams()
  const history = useLocation()
  const category = searchParams.get('category')
  const toast = useToast()
  const navigate = useNavigate()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['category'],
    queryFn: fetchCategories
  })
  const makeMeAdmin = async () => {
    try {
      const response = await fetchMakeAdmin(user.id)
      setUser(response)
    } catch (e) {
      handleErrorResponse(e, toast)
    }
  }

  if (isPending) {
    return (<CustomSpinner/>)
  }

  if (isError) {
    const errorMessage = error.response?.data?.message || error.message
    return <div>{errorMessage}</div>
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Link to="/">eCommerce</Link>

        </div>

        <ul className={styles.menu}>
          <li className="menu-item">
            <Link to="/">Products</Link>
          </li>
          {
            history.pathname === '/' &&
            <li className="menu-item">
              <Select defaultValue={'all'} onChange={(item) => {
                if (item.target.value === 'all') {
                  return navigate('/')
                }
                return navigate(`/?category=${item.target.value}`)
              }}>
                <option value={'all'}>All Categories</option>
                {data.map(item => (
                  <option key={item.id} selected={category && parseInt(category) === item.id} value={item.id}>{item.name}</option>
                ))}
              </Select>
            </li>
          }
        </ul>
      </div>
      <div className={styles.right}>
        {
          items.length > 0 && (
            <Link to="/basket">
              <Button colorScheme="pink" variant={'outline'}>Basket ({items.length})</Button>
            </Link>
          )
        }
        {
          loggedIn &&
          <>
            {
              user.role === 'admin' &&
              <Link to="/admin">
                <Button colorScheme="blue" variant={'ghost'}>Admin</Button>
              </Link>
            }
            {
              user.role !== 'admin' &&
              <Button colorScheme="pink" onClick={makeMeAdmin} variant={'ghost'}>Make Me Admin</Button>
            }
            <Link to="/profile">
              <Button colorScheme="blue">My Account</Button>
            </Link>
            <Link to="/">
              <Button colorScheme="pink" onClick={() => {
                logout()
              }}>Logout</Button>
            </Link>
          </>
        }
        {
          !loggedIn &&
          <>
            <Link to="/login">
              <Button colorScheme="pink">Login</Button>
            </Link>
            <Link to="/register">
              <Button colorScheme="blue">Register</Button>
            </Link>
          </>
        }

      </div>
    </nav>
  )
}

export default Navbar