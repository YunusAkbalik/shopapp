import { Alert, Box, Button, Flex, FormControl, FormLabel, Input, Text, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import validationSchema from '../validation'
import { Button as AntButton, Space, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { fetchCategoryCreate } from '../../../../api'
import CustomSpinner from '../../../CustomSpinner'
import { useNavigate } from 'react-router-dom'
import { handleErrorResponse } from '../../../../helpers/errorHandler'

function AdminCategoryCreate() {

  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (image === null) {
          toast({
            title: 'Error!',
            description: 'Please upload an image!',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-right'
          })
        } else {
          setLoading(true)
          await fetchCategoryCreate({ ...values, image })
          setLoading(false)
          navigate('/admin/category')
          toast({
            title: 'Success!',
            description: 'Category create success!',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top-right'
          })
        }

      } catch (e) {
        handleErrorResponse(e,toast)
      }
    }
  })

  if (loading){
    return (
      <CustomSpinner />
    )
  }

  return (
    <>
      <Box px={200}>
        <form onSubmit={formik.handleSubmit}>
          <Flex flexDirection={'column'} gap={2}>
            {
              formik.errors.general && (
                <Alert status={'error'}>
                  {formik.errors.general}
                </Alert>
              )
            }
            <FormControl>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Upload
                  action="https://api.escuelajs.co/api/v1/files/upload"
                  listType="picture"
                  maxCount={1}
                  accept={'image/*'}
                  onChange={info => {
                    if (info.file.status === 'done') {
                      setImage(info.file.response.location)
                    }
                  }}
                >
                  <AntButton icon={<UploadOutlined/>}>Upload Image</AntButton>
                </Upload>
              </Space>
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                name={'name'}
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isInvalid={formik.touched.name && formik.errors.name}
              />
              {formik.errors.name && formik.touched.name && (
                <Text color={'red'}>{formik.errors.name}</Text>
              )}
            </FormControl>
            <FormControl>
              <Button type={'submit'} colorScheme={'green'}>Create</Button>
            </FormControl>
          </Flex>
        </form>
      </Box>
    </>
  )
}

export default AdminCategoryCreate