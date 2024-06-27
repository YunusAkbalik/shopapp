import { Link, Outlet } from 'react-router-dom'
import style from './style.module.css'
import { Box } from '@chakra-ui/react'
import { useMemo } from 'react'

function Admin() {


  const url = useMemo(() => {
    return 'admin'
  },[])

  return (
    <div id={'content'}>
      <nav>
        <ul className={style.adminMenu}>
          <li>
            <Link to={`/${url}`}>Home</Link>
          </li>
          <li>
            <Link to={`/${url}/orders`}>Orders</Link>
          </li>
          <li>
            <Link to={`/${url}/products`}>Products</Link>
          </li>
          <li>
            <Link to={`/${url}/category`}>Category</Link>
          </li>
          <li>
            <Link to={`/${url}/users`}>Users</Link>
          </li>
        </ul>
      </nav>
      <Box mt={'10'}>
        <Outlet/>
      </Box>
    </div>
  )
}

export default Admin