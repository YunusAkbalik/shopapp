import { Alert, Box, Button, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { fetchLogin } from '../../../api'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import validationSchema from './validation'

function Index() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: 'john@mail.com',
      password: 'changeme',
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      try {
        const loginResponse = await fetchLogin(values)
        bag.resetForm()
        login(loginResponse)

        bag.setStatus({
          success: 'Giriş Yapıldı'
        })

        navigate('/profile')
      } catch (e) {
        bag.setErrors({
          general: e.response.data.message
        })
      }
    }
  })

  return (
    <div>
      <Flex align={'center'} width={'full'} justifyContent={'center'}>
        <Box pt={10}>
          <Box textAlign={'center'}>
            <Heading>Login</Heading>
          </Box>
          <Box my={5}>
            {
              formik.errors.general && (
                <Alert status={'error'}>
                  {formik.errors.general}
                </Alert>
              )
            }
            {
              formik.status && (
                <Alert status={'success'}>
                  {formik.status.success}
                </Alert>
              )
            }
          </Box>
          <Box my={5} textAlign={'left'}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name={'email'}
                  type={'email'}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.email && formik.errors.email}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  name={'password'}
                  type={'password'}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.password && formik.errors.password}
                />
              </FormControl>

              <Button mt={4} width={'full'} colorScheme={'green'} type={'submit'}>
                Login
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </div>
  )
}

export default Index