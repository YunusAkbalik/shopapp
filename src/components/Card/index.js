import { Box, Button, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useBasket } from '../../contexts/BasketContext'
import React from 'react'

function Card({item}) {
  const date = new Date()
  const basket = useBasket()
  const itemInBasket = basket.items.find(basketItem => basketItem.id === parseInt(item.id))

  return(
    <Box borderWidth={"1px"} borderRadius={"lg"} overflow={"hidden"} p={"3"}>
      <Link to={`/product/${item.id}`}>
        <Image src={item.images[0]} alt={"product"} loading={"lazy"} />

        <Box p={"6"}>
          <Box d={"plex"} alignItems={"baseline"}>
            {moment(date).format('DD/MM/YYYY')}
          </Box>

          <Box mt={"1"} fontWeight={"semibold"} as={"h4"} lineHeight={"initial"}>
            {item.title}
          </Box>
          <Box>
            {item.price} ₺
          </Box>
        </Box>
      </Link>

      {
        itemInBasket ? (
          <Button colorScheme={'blue'} variant={'outline'} onClick={() => basket.removeFromBasket(item.id)}>Remove from basket</Button>
        ) : (
          <Button colorScheme={'pink'} onClick={() => basket.addToBasket(item)}>Add to basket</Button>
        )
      }
    </Box>
  )
}

export default Card;