import { Box, Button, Image, useToast } from '@chakra-ui/react'
import { Popconfirm, Table } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchCategoryDelete } from '../../../../api'
import CustomSpinner from '../../../CustomSpinner'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DeleteIcon } from '@chakra-ui/icons'
import { handleErrorResponse } from '../../../../helpers/errorHandler'

function AdminCategoryList() {

  const { isPending, isError,refetch, data, error } = useQuery({
    queryKey: ['category'],
    queryFn: fetchCategories,
  })

  const toast = useToast()

  const deleteCategory = async(id) => {
    try {
      await fetchCategoryDelete(id)
      await refetch()
      toast({
        title: 'Category deleted.',
        description: 'Category delete success.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }catch (e){
      handleErrorResponse(e,toast)
    }

  }

  const columns = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        rowScope: 'row'
      },
      {
        title: 'Image',
        key: 'image',
        render: (category) => (
          <Link to={`/admin/category/${category.id}`}>
            <Image
              key={category.id}
              borderRadius="full"
              boxSize="150px"
              src={category.image}
              alt="Dan Abramov"
            />
          </Link>
        )
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Action',
        key: 'action',
        render: (category) => (
          <Popconfirm
            title="Delete Category"
            description="Are you sure to delete this category?"
            onConfirm={() => deleteCategory(category.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button variant={'outline'} colorScheme={'red'} leftIcon={<DeleteIcon/>}>Delete</Button>
          </Popconfirm>
        )
      },
    ]
  }, [])

  if (isPending) {
    return <CustomSpinner/>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <>
      <Box borderRadius="md" color="white" px={10}>
        <Link to={'/admin/category/create'}>
          <Button colorScheme={'green'} variant={'outline'} mb={2}>Create a category</Button>
        </Link>
        <Table rowKey={'id'} dataSource={data} columns={columns}/>
      </Box>
    </>
  )
}

export default AdminCategoryList