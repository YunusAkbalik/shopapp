import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import NoPage from './components/NoPage'
import Layout from './components/Layout'
import ProductDetail from './components/Product/ProductDetail'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import Basket from './components/Basket'
import Admin from './components/Admin'
import AdminHome from './components/Admin/AdminHome'
import AdminOrders from './components/Admin/AdminOrders'
import AdminProducts from './components/Admin/AdminProducts'
import AdminUsers from './components/Admin/AdminUsers'
import CreateProduct from './components/Admin/AdminProducts/CreateProduct'
import UpdateProduct from './components/Admin/AdminProducts/UpdateProduct'
import AdminCategoryList from './components/Admin/Category/List'
import AdminCategoryCreate from './components/Admin/Category/Create'
import AdminCategoryEdit from './components/Admin/Category/Edit'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="/product/:product_id" element={<ProductDetail/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="basket" element={<Basket/>}/>
          <Route path={'/'} element={<ProtectedRoute/>}>
            <Route path="profile" element={<Profile/>}/>
          </Route>
          <Route path={'admin'} element={<ProtectedRoute admin={true}/>}>
            <Route path="/admin" element={<Admin/>}>
              <Route index element={<AdminHome/>}/>
              <Route path={'orders'} element={<AdminOrders/>}/>
              <Route path={'products'} element={<AdminProducts/>}/>
              <Route path={'product/create'} element={<CreateProduct/>}/>
              <Route path={'product/:productId'} element={<UpdateProduct/>}/>
              <Route path={'users'} element={<AdminUsers/>}/>
              <Route path={'category'} element={<AdminCategoryList/>}/>
              <Route path={'category/create'} element={<AdminCategoryCreate/>}/>
              <Route path={'category/:categoryId'} element={<AdminCategoryEdit/>}/>
            </Route>
          </Route>

          <Route path="*" element={<NoPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
