import { Button, Center, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Image, useDisclosure, useToast } from '@chakra-ui/react'
import { Popconfirm, Table } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllUsers, fetchGetUser, fetchUpdateUser } from '../../../api'
import CustomSpinner from '../../CustomSpinner'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useFormik } from 'formik'
import validationSchema from './validation'
import { handleErrorResponse } from '../../../helpers/errorHandler'

function AdminUsers() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [editedUser, setEditedUser] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      role: ''
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      try {
        setLoading(true)
        bag.resetForm()
        onClose()
        await fetchUpdateUser(editedUser.id, values)
        await refetch()
        setLoading(false)
        toast({
          title: 'User updated.',
          description: 'User update success.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })

      } catch (e) {
        setLoading(false)
        setEditedUser(null)
        handleErrorResponse(e,toast)
      }
    }
  })

  const fillModal = async (user) => {
    try {
      setLoading(true)
      const userResponse = await fetchGetUser(user.id)
      setEditedUser(userResponse)
      formik.values.email = userResponse.email
      formik.values.password = userResponse.password
      formik.values.name = userResponse.name
      formik.values.role = userResponse.role
      onOpen()
      setLoading(false)
    }catch (e){
      handleErrorResponse(e,toast)
    }

  }

  const columns = useMemo(() => {
    return [
      {
        title: 'Image',
        key: 'image',
        render: (user) => (
          <Image
            borderRadius='full'
            boxSize='150px'
            src={user.avatar}
            alt='Dan Abramov'
          />
        )
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: 'Created At',
        dataIndex: 'creationAt',
        key: 'creationAt',
      },
      {
        title: 'Action',
        key: 'action',
        render: (user) => (
          <Flex gap={1}>
            <Button onClick={() => fillModal(user)} colorScheme={'blue'} leftIcon={<EditIcon/>}>Edit</Button>
            <Popconfirm
              title="Delete Usr"
              description="Are you sure to delete this user?"
              onConfirm={() => {
                toast({
                  title: 'User deleted.',
                  description: 'NOT : Test api kullanıcı silme işlemi gerçekleştirmiyor.',
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                })
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button variant={'outline'} colorScheme={'red'} leftIcon={<DeleteIcon/>}>Delete</Button>
            </Popconfirm>
          </Flex>
        )
      },
    ]
  }, [toast])

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  })

  if (isPending) {
    return <CustomSpinner/>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (loading) {
    return <CustomSpinner/>
  }
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay/>
        <form onSubmit={formik.handleSubmit}>
          <ModalContent>
            <ModalHeader>Edit User</ModalHeader>
            <ModalCloseButton/>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Email"
                  name={'email'}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.email && formik.errors.email}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Password"
                  name={'password'}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.password && formik.errors.password}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Name"
                  name={'name'}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.name && formik.errors.name}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Role"
                  name={'role'}
                  value={formik.values.role}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.role && formik.errors.role}
                />
              </FormControl>

            </ModalBody>

            <ModalFooter>
              <Button type={'submit'} colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      <Center>
        <Table rowKey={'id'} dataSource={data} columns={columns}/>
      </Center>
    </>
  )
}

export default AdminUsers