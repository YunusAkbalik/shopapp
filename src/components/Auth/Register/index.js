import { Alert, Box, Button, Flex, FormControl, FormLabel, Heading, Input, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import validationSchema from './validation'
import { fetchRegister } from '../../../api'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import UploadImage from '../../UploadImage'

function Index() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [image, setImage] = useState([])
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      name: 'Yunus',
      email: 'test@test.com',
      password: '123123',
      passwordConfirm: '123123',
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      try {
        if (image.length <= 0) {
          toast({
            status: 'error',
            title: 'Error',
            description: 'Please upload an avatar',
            position: 'top-right'
          })
          return
        }

        const registerResponse = await fetchRegister({
          email: values.email,
          password: values.password,
          name: values.name,
          avatar: image[0] })
        bag.resetForm()
        register(registerResponse)

        bag.setStatus({
          success: 'Kayıt işlemi başarılı'
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
            <Heading>Register</Heading>
          </Box>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <UploadImage images={image} setImages={setImage} maxCount={1} alt={'Avatar'} buttonText={'Upload Avatar'}/>
          </Flex>
          <Box my={5}>
            {
              formik.errors.general && (
                formik.errors.general.map((item, key) => (
                  <Alert key={key} status={'error'}>
                    {item}
                  </Alert>
                ))

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
                <FormLabel>Name</FormLabel>
                <Input
                  name={'name'}
                  type={'text'}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.name && formik.errors.name}
                />
              </FormControl>
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

              <FormControl mt={4}>
                <FormLabel>Password Confirm</FormLabel>
                <Input
                  name={'passwordConfirm'}
                  type={'password'}
                  value={formik.values.passwordConfirm}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                />
              </FormControl>

              <Button mt={4} width={'full'} colorScheme={'green'} type={'submit'}>
                Register
              </Button>

            </form>
          </Box>
        </Box>
      </Flex>
    </div>
  )
}

export default Index