import { useAuth } from '../../contexts/AuthContext'
import { Button, Center, FormControl, FormLabel, Image, Input, Select, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import validationSchema from './validation'
import { useMemo, useState } from 'react'
import { Upload } from 'antd'
import { handleErrorResponse } from '../../helpers/errorHandler'
import { fetchMe, fetchUpdateUser } from '../../api'

function Profile() {
  const { user,setUser } = useAuth()
  const [image, setImage] = useState(user.avatar)
  const toast = useToast()

  const uploadProps = useMemo(() => ({
    action: 'https://api.escuelajs.co/api/v1/files/upload',
    accept: 'image/*',
    maxCount: 1,
    showUploadList:false,
    onChange({ file }) {
      if (file.status === 'done') {
        setImage(file.response.location)
      }
    },
    defaultFileList: [
      {
        uid: '-1',
        name: `${user.name}.png`,
        status: 'done',
        url: image,
      },
    ],
  }), [])

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      role: user.role
    },
    validationSchema,
    onSubmit: async(values) => {
      try {
        await fetchUpdateUser(user.id, { ...values, avatar:image })
        const me = await fetchMe()
        setUser(me)
        toast({
          title:'Updated',
          status:'success',
          position: 'top-right',
          duration: 1000,
          isClosable:true
        })
      }catch (e){
        handleErrorResponse(e,toast)
      }
    }
  })

  return (
    <>
      <Center display={'flex'} flexDirection={'column'} gap={2} mt={5}>
        <Image
          borderRadius="full"
          boxSize="150px"
          src={image}
          alt={user.name}
        />
        <Upload {...uploadProps}>
          <Button variant={'outline'} >Upload Image</Button>
        </Upload>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>E-mail</FormLabel>
            <Input
              name={'email'}
              type={'email'}
              placeholder={'E-mail'}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && formik.errors.email}
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Name</FormLabel>
            <Input
              name={'name'}
              placeholder={'Name'}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && formik.errors.name}
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Role</FormLabel>
            <Select
              name={'role'}
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.role && formik.errors.role}
            >
              <option value={'customer'}>Customer</option>
              <option value={'admin'}>Admin</option>
            </Select>
          </FormControl>
          <Button mt={2} colorScheme={'blue'} type={'submit'}>Update</Button>

        </form>
      </Center>
    </>
  )
}

export default Profile