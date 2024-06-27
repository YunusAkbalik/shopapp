import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProductDetail } from '../../api'
import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import moment from 'moment'
import ImageGallery from 'react-image-gallery'
import { useBasket } from '../../contexts/BasketContext'
import '../../App.css'

function ProductDetail() {

  const { product_id } = useParams()
  const { addToBasket, items, removeFromBasket } = useBasket()

  const query = useQuery({ queryKey: ['product', product_id], queryFn: () => fetchProductDetail(product_id) })

  const { isPending, error, data } = query

  if (isPending) {
    return (<div>
      <h1>Loading...</h1>
    </div>)
  }
  if (error) {
    return <div>
      <h2>
        {'An error has occurred: ' + error.message}
      </h2>
    </div>
  }

  const itemInBasket = items.find(item => item.id === parseInt(product_id))

  const images = data.images.map(item => ({
    original: item,
    thumbnail: item
  }))

  return (
    <div id={'content'}>
      {
        itemInBasket ? (
          <Button colorScheme={'blue'} variant={'outline'} onClick={() => removeFromBasket(product_id)}>Remove from basket</Button>
        ) : (
          <Button colorScheme={'pink'} onClick={() => addToBasket(data)}>Add to basket</Button>
        )
      }
      <Text as={'h2'} fontSize={'2xl'}>
        {data.title}
      </Text>

      <Text>{moment(new Date()).format('DD/MM/YYYY')}</Text>
      <p>
        {data.description}
      </p>
      <div className={'middle'}>
        <ImageGallery  items={images}/>
      </div>
    </div>
  )
}

export default ProductDetail