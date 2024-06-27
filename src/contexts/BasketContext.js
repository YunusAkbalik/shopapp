import { createContext, useContext, useEffect, useState } from 'react'

const BasketContext = createContext()
const defaultItems = JSON.parse(localStorage.getItem('basket')) || []

const BasketProvider = ({ children }) => {
  const [items, setItems] = useState(defaultItems)

  useEffect(() => {
    localStorage.setItem('basket',JSON.stringify(items))
  }, [items])

  const addToBasket = (data) => {
    setItems(prev => [...prev, data])
  }

  const removeFromBasket = (productId) => {
    const filtered = items.filter(item => item.id !== parseInt(productId))
    setItems(filtered)
  }

  const order = () => {
    setItems([])
  }

  const values = {
    items,
    setItems,
    addToBasket,
    removeFromBasket,
    order
  }

  return (
    <BasketContext.Provider value={values}>{children}</BasketContext.Provider>
  )
}

const useBasket = () => useContext(BasketContext)

export { BasketProvider, useBasket }
