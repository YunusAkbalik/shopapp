import { useQuery } from '@tanstack/react-query'
import { fetchProductDelete, fetchProductList } from '../../../api'
import CustomSpinner from '../../CustomSpinner'
import { Button, Center, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import React, {  useRef, useState } from 'react'
import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import Alert from './Alert'
import { Link } from 'react-router-dom'
import { handleErrorResponse } from '../../../helpers/errorHandler'

function AdminProducts() {
  const { isOpen: isOpenDialog, onOpen: onOpenDialog, onClose: onCloseDialog } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const cancelRef = useRef()
  const toast = useToast()

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductList,
  })

  const deleteProductDialog = (item) => {
    setCurrentProduct(item)
    onOpenDialog()
  }

  const deleteProduct = async () => {
    try {
      onCloseDialog()
      setLoading(true)
      await fetchProductDelete(currentProduct.id)
      await refetch()
      setLoading(false)
      toast({
        title: 'Product Deleted.',
        description: 'Product delete success.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

    } catch (e) {
      setLoading(false)
      handleErrorResponse(e,toast)
    }
  }

  if (isPending || loading) {
    return <CustomSpinner/>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <>
      <Alert cancelRef={cancelRef} deleteProduct={deleteProduct} isOpenDialog={isOpenDialog} onCloseDialog={onCloseDialog}/>
      <Center>
        <Flex flexDirection={'column'}>
          <Link to={'/admin/product/create'}>
            <Button colorScheme={'green'} variant={'ghost'}>
              Create a new product
            </Button>
          </Link>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Image</Th>
                  <Th>Title</Th>
                  <Th isNumeric>Price</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  data.map((item, key) => (
                    <Tr key={key}>
                      <Td className={'td'}>
                        <Link to={`/admin/product/${item.id}`}>
                          <Image boxSize={'100px'} borderRadius={'full'} objectFit="cover" src={item.images[0]} alt={'product'} loading={'lazy'}/>
                        </Link>
                      </Td>
                      <Td className={'td'}>
                        <Link to={`/admin/product/${item.id}`}>
                          {item.title}
                        </Link>
                      </Td>
                      <Td className={'td'} isNumeric>{item.price}</Td>
                      <Td className={'td'}>
                        <Menu>
                          <MenuButton
                            px={4}
                            py={2}
                            transition="all 0.2s"
                            borderRadius="md"
                            borderWidth="1px"
                            _hover={{ bg: 'gray.400' }}
                            _expanded={{ bg: 'blue.400' }}
                            _focus={{ boxShadow: 'outline' }}
                          >
                            Actions <ChevronDownIcon/>
                          </MenuButton>
                          <MenuList>
                            <Link to={`/admin/product/${item.id}`}>
                              <MenuItem> <EditIcon/> &nbsp; Edit</MenuItem>
                            </Link>
                            <MenuItem onClick={() => deleteProductDialog(item)}> <DeleteIcon/> &nbsp; Delete</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Center>
    </>

  )
}

export default AdminProducts
