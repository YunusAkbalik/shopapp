import { Box, Button, Center, Flex, FormControl, FormLabel, Grid, Image, Input, Select, Textarea, useToast } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import validationSchema from '../validation'
import { fetchCategories, fetchProductDetail, fetchProductList, fetchProductUpdate } from '../../../../api'
import CustomSpinner from '../../../CustomSpinner'
import { Button as AntButton, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { DeleteIcon } from '@chakra-ui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { handleErrorResponse } from '../../../../helpers/errorHandler'

function UpdateProduct() {

  const { productId } = useParams()

  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [images, setImages] = useState([])
  const navigate = useNavigate()

  const { refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductList,
  })

  const categoriesQuery = useQuery({
    queryKey: ['category'],
    queryFn: fetchCategories,
  })

  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetail(productId)
  })

  const uploadProps = useMemo(() => ({
    action: 'https://api.escuelajs.co/api/v1/files/upload',
    accept: 'image/*',
    onChange({ file }) {
      if (file.status === 'done') {
        setImages(prevState => [...prevState, file.response.location])
      }
    },
    defaultFileList: [],
  }), [])

  const deleteImage = (link) => {
    const filtered = images.filter(item => item !== link)
    setImages(filtered)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: 0,
      categoryId: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (images.length < 1) {
          toast({
            title: 'Error',
            description: 'Upload at least one image',
            position: 'top-right',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        } else {
          setLoading(true)
          await fetchProductUpdate(productId, { ...values, images })
          await refetch()
          await productQuery.refetch()
          setLoading(false)
          toast({
            title: 'Product Updated',
            description: 'Product update success.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          navigate('/admin/products')
        }
      } catch (e) {
        setLoading(false)
        handleErrorResponse(e,toast)
      }
    }
  })

  useEffect(() => {
    if (productQuery.isSuccess && productQuery.data) {
      formik.setValues({
        title: productQuery.data.title || '',
        description: productQuery.data.description || '',
        price: productQuery.data.price || 0,
        categoryId: productQuery.data.category.id || 0,
      })

      setImages(productQuery.data.images)

    }
  }, [productQuery.isSuccess, productQuery.data])

  if (loading || categoriesQuery.isPending || productQuery.isPending || productQuery.isLoading) {
    return <CustomSpinner/>
  }

  if (categoriesQuery.isError || productQuery.isError) {
    const errorMessage =
      categoriesQuery.error?.response?.data?.message ||
      productQuery.error?.response?.data?.message ||
      'Unknown Error'

    return <div>{errorMessage}</div>
  }

  return (
    <>
      <Center>
        <form onSubmit={formik.handleSubmit}>
          <Flex flexDirection={'column'}>
            <Grid templateColumns={'repeat(3, 1fr)'} gap={3}>
              {
                images.map((item, key) => (
                  <Box key={key}>
                    <Center>
                      <Flex flexDirection={'column'}>
                        <Image
                          borderRadius="full"
                          objectFit={'cover'}
                          boxSize="150px"
                          src={item}
                          alt="product"
                        />
                        <Button colorScheme={'red'} onClick={() => deleteImage(item)} variant={'ghost'}> <DeleteIcon/></Button>
                      </Flex>
                    </Center>
                  </Box>
                ))
              }
            </Grid>
            <Center mt={5}>
              <Upload {...uploadProps}>
                <AntButton icon={<UploadOutlined/>}>Upload</AntButton>
              </Upload>
            </Center>
            <FormControl isRequired mt={4}>
              <FormLabel>Category</FormLabel>
              <Select
                name={'categoryId'}
                placeholder="Select Category"
                value={formik.values.categoryId}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isInvalid={formik.touched.categoryId && formik.errors.categoryId}
              >
                {
                  categoriesQuery.data.map(item => (
                    <option value={item.id} key={item.id}>{item.name}</option>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title"
                name={'title'}
                value={formik.values.title}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isInvalid={formik.touched.title && formik.errors.title}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Description"
                name={'description'}
                value={formik.values.description}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isInvalid={formik.touched.description && formik.errors.description}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type={'number'}
                placeholder="50"
                name={'price'}
                value={formik.values.price}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isInvalid={formik.touched.price && formik.errors.price}
              />
            </FormControl>
            <FormControl mt={4}>
              <Button colorScheme={'green'} type={'submit'}>Update</Button>
            </FormControl>
          </Flex>
        </form>
      </Center>
    </>
  )
}

export default UpdateProduct