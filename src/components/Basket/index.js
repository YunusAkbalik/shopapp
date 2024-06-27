import { useBasket } from '../../contexts/BasketContext'
import { Alert, AlertIcon, Button, FormControl, FormLabel, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Textarea, Tfoot, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import '../../App.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import validationSchema from './validation'
import { handleErrorResponse } from '../../helpers/errorHandler'

function Basket() {

  const basket = useBasket()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [successOrder, setSuccessOrder] = useState(false)
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      address: '',
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      try {
        bag.resetForm()
        basket.order()
        setSuccessOrder(true)
      } catch (e) {
        handleErrorResponse(e,toast)
      }
    }
  })

  if (successOrder) {
    return (
      <div id={'content'}>
        <Alert status="success">
          <AlertIcon/>
          Your order has been created successfully
        </Alert>
        <br/>
        <Link to={'/'}>
          <Button colorScheme='green'>Back To Homepage</Button>
        </Link>
      </div>
    )
  }

  return (
    <div id={'content'}>
      {
        basket.items.length < 1 &&
        <Alert status={'info'}>
          Basket is empty
        </Alert>
      }
      {
        basket.items.length > 0 && <div className={'middle'}>
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
                  basket.items.map((item, key) => (
                    <Tr key={key}>
                      <Td className={'td'}>
                        <Link to={`/product/${item.id}`}>
                          <Image boxSize={'100px'} borderRadius={'full'} objectFit="cover" src={item.images[0]} alt={'product'} loading={'lazy'}/>
                        </Link>
                      </Td>
                      <Td className={'td'}>{item.title}</Td>
                      <Td className={'td'} isNumeric>{item.price}</Td>
                      <Td className={'td'}>
                        <Button colorScheme={'blue'} variant={'outline'} onClick={() => basket.removeFromBasket(item.id)}>Remove from basket</Button>
                      </Td>
                    </Tr>
                  ))
                }
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th></Th>
                  <Th>Total: </Th>
                  <Th isNumeric>{basket.items.reduce((acc, obj) => acc + obj.price, 0)}</Th>
                  <Th></Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>

          <Button onClick={onOpen}>Order</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader>Order</ModalHeader>
              <ModalCloseButton/>
              <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                      name={'address'}
                      value={formik.values.address}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.address && formik.errors.address}
                    />
                  </FormControl>

                  <Button mt={4} width={'full'} colorScheme={'green'} type={'submit'}>
                    Order
                  </Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      }

    </div>
  )
}

export default Basket