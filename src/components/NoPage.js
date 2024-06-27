import { Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

function NoPage() {
  return (
    <div id={'content'}>
      <Alert status="error">
        <AlertIcon/>
        <AlertTitle>404 Not Found!</AlertTitle>
        <AlertDescription>Page Not Found.</AlertDescription>
      </Alert>
      <br/>
      <Link to={'/'}>
        <Button colorScheme='green'>Back To Homepage</Button>
      </Link>
    </div>
  )
}

export default NoPage