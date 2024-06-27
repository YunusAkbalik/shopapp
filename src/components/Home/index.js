import Card from '../Card'
import { Alert, AlertIcon, Button, Center, Grid } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { fetchProductFilterByCategory, fetchProductList } from '../../api'
import CustomSpinner from '../CustomSpinner'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')
  const navigate = useNavigate()
  const { isPending, error, data, refetch } = useQuery({
    queryKey: category ? ['products:category', category] : ['products'],
    queryFn: () => {
      if (category) {
        return fetchProductFilterByCategory(category)
      }
      return fetchProductList()
    }
  })

  useEffect(() => {
    (async () => {
      await refetch()
    })()
  }, [category, refetch])

  if (isPending) {
    return (<CustomSpinner/>)
  }
  if (error) {
    return 'An error has occurred: ' + error.message
  }


  return (
    <div>
      {
        data.length <= 0 &&
        <>
          <Center>
            <Alert status={'info'}>
              <AlertIcon/>
              YOOOOOKKKK da bum tıss
            </Alert>
          </Center>
          <Center>
            <Button mt={2} colorScheme={'blue'} onClick={() => navigate('/')}>Back to All Products</Button>
          </Center>
        </>
      }
      <Grid templateColumns="repeat(5, 1fr)" gap={1}>
        {
          data.map((item, key) => (
            <Card item={item} key={key}/>
          ))
        }
      </Grid>
    </div>
  )
}

export default Home