import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASE_ENDPOINT

axios.interceptors.request.use(function (config) {

  const { origin } = new URL(config.url)
  const allowedOrigins = [baseUrl]
  const token = localStorage.getItem('access_token')

  if (allowedOrigins.includes(origin)) {
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

export const fetchProductList = async () => {
  const { data } = await axios.get(`${baseUrl}/api/v1/products`)
  data.map(item => {
    const newArray = []
    for (let i = 0; i < item.images.length; i++) {
      newArray.push(item.images[i].replace(/\[|\]|"/g, ''))
    }
    item.images = newArray
    return item
  })
  return data
}

export const fetchProductDetail = async (id) => {
  const { data } = await axios.get(`${baseUrl}/api/v1/products/${id}`)
  data.images = data.images.map(item => item.replace(/\[|\]|"/g, ''))
  return data
}

export const fetchProductUpdate = async (id, input) => {
  const { data } = await axios.put(`${baseUrl}/api/v1/products/${id}`, input)
  return data
}

export const fetchProductDelete = async (id) => {
  const { data } = await axios.delete(`${baseUrl}/api/v1/products/${id}`)
  return data
}
export const fetchProductCreate = async (input) => {
  const { data } = await axios.post(`${baseUrl}/api/v1/products`,input)
  return data
}

export const fetchRegister = async (input) => {
  const { data } = await axios.post(`${baseUrl}/api/v1/users`, input)
  return data
}

export const fetchLogin = async (input) => {
  const { data } = await axios.post(`${baseUrl}/api/v1/auth/login`, input)
  return data
}

export const fetchMe = async () => {
  const { data } = await axios.get(`${baseUrl}/api/v1/auth/profile`)
  return data
}

export const fetchAllUsers = async () => {
  const { data } = await axios.get(`${baseUrl}/api/v1/users`)
  return data
}

export const fetchGetUser = async (userid) => {
  const { data } = await axios.get(`${baseUrl}/api/v1/users/${userid}`)
  return data
}
export const fetchUpdateUser = async (userid, input) => {
  const { data } = await axios.put(`${baseUrl}/api/v1/users/${userid}`, input)
  return data
}

export const fetchMakeAdmin = async (userid) => {
  const { data } = await axios.put(`https://api.escuelajs.co/api/v1/users/${userid}`, { role: 'admin' })
  return data
}
export const fetchCategories = async () => {
  const { data } = await axios.get(`${baseUrl}/api/v1/categories`)
  return data
}

export const fetchCategoryCreate = async (input) => {
  const { data } = await axios.post(`${baseUrl}/api/v1/categories`,input)
  return data
}

export const fetchCategoryDetail = async (id) => {
  const { data } = await axios.get(`${baseUrl}/api/v1/categories/${id}`)
  return data
}

export const fetchCategoryUpdate = async (id,input) => {
  const { data } = await axios.put(`${baseUrl}/api/v1/categories/${id}`,input)
  return data
}

export const fetchCategoryDelete = async (id) => {
  const { data } = await axios.delete(`${baseUrl}/api/v1/categories/${id}`)
  return data
}

export const fetchProductFilterByCategory = async (categoryId) => {
  const { data } = await axios.get(`${baseUrl}/api/v1/products/?categoryId=${categoryId}`)
  data.map(item => {
    const newArray = []
    for (let i = 0; i < item.images.length; i++) {
      newArray.push(item.images[i].replace(/\[|\]|"/g, ''))
    }
    item.images = newArray
    return item
  })
  return data
}

