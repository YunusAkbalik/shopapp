import { Box, Button, Center, Flex, FormControl, FormLabel, Grid, Image, Input, Select, Textarea, useToast } from '@chakra-ui/react'
import React, { useMemo, useRef, useState } from 'react'
import { useFormik } from 'formik'
import validationSchema from '../validation'
import { fetchCategories, fetchProductCreate, fetchProductList } from '../../../../api'
import CustomSpinner from '../../../CustomSpinner'
import { Button as AntButton, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { handleErrorResponse } from '../../../../helpers/errorHandler'

function CreateProduct() {

  const [loading, setLoading] = useState(false)
  const initialRef = useRef(null)
  const toast = useToast()
  const [images, setImages] = useState([])
  const navigate = useNavigate()

  const { refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductList,
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
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
      title: 'Test Product',
      description: 'Test Product Description',
      price: 25,
      categoryId: 1
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
          await fetchProductCreate({ ...values, images })
          await refetch()
          setLoading(false)
          toast({
            title: 'Product Created',
            description: 'Product create success.',
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

  if (loading || categoriesQuery.isPending) {
    return <CustomSpinner/>
  }

  if (categoriesQuery.error) {
    return <div>Categories Error</div>
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
                ref={initialRef}
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
              <Button colorScheme={'green'} type={'submit'}>Create</Button>
            </FormControl>
          </Flex>
        </form>
      </Center>
    </>
  )
}

export default CreateProduct