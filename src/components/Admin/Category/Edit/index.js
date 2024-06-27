import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchCategoryDetail, fetchCategoryUpdate } from '../../../../api'
import CustomSpinner from '../../../CustomSpinner'
import { Flex, FormControl, FormLabel, Input, Text, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import validationSchema from '../validation'
import { useEffect, useMemo, useState } from 'react'
import { Button, Space, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { handleErrorResponse } from '../../../../helpers/errorHandler'

function AdminCategoryEdit() {

  const { categoryId } = useParams()
  const toast = useToast()
  const navigate = useNavigate()

  const { isPending, isSuccess, data, isError, error } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryDetail(categoryId)
  })

  const { refetch } = useQuery({
    queryKey: ['category'],
    queryFn: fetchCategories
  })

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await fetchCategoryUpdate(categoryId, { ...values, image })
        await refetch()
        toast({
          title: 'Category Updated',
          description: 'Category update success.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        navigate('/admin/category')

      } catch (e) {
        handleErrorResponse(e, toast)
      }
    }
  })

  const [image, setImage] = useState(null)

  const uploadProps = useMemo(() => ({
    action: 'https://api.escuelajs.co/api/v1/files/upload',
    accept: 'image/*',
    listType: 'picture',
    maxCount: 1,

    onChange({ file }) {
      if (file.status === 'done') {
        setImage(file.response.location)
      }
    },
  }), [])

  useEffect(() => {
    if (isSuccess) {
      formik.setValues({
        name: data.name
      })
      setImage(data.image)
    }
  }, [data])

  if (isPending) {
    return <CustomSpinner/>
  }

  if (isError) {
    return <Text color={'red'}>{error.response?.data?.message || error.message}</Text>
  }

  return (
    <Flex style={{ padding: '0 5rem' }} flexDirection={'column'}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Upload {...uploadProps} defaultFileList={[
          {
            uid: '-1',
            name: `${data.name}.png`,
            status: 'done',
            url: data.image,
          },
        ]}>
          <Button icon={<UploadOutlined/>}>Upload Image</Button>
        </Upload>
      </Space>

      <form onSubmit={formik.handleSubmit}>
        <Flex flexDirection={'column'} gap={2}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              name={'name'}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <Text color={'red'}>{formik.touched.name && formik.errors.name}</Text>
          </FormControl>
          <FormControl>
            <Button type={'primary'} htmlType={'submit'}>Update</Button>
          </FormControl>
        </Flex>
      </form>
    </Flex>
  )
}

export default AdminCategoryEdit