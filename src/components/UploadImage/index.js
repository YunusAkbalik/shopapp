import React, { useMemo } from 'react'
import { Box, Button, Flex, Image } from '@chakra-ui/react'
import { Upload } from 'antd'
import { DeleteIcon } from '@chakra-ui/icons'

function UploadImage({ images, setImages, alt = 'Avatar', maxCount = 1, buttonText = 'Upload Image' }) {

  const uploadProps = useMemo(() => ({
    action: 'https://api.escuelajs.co/api/v1/files/upload',
    accept: 'image/*',
    maxCount: maxCount,
    showUploadList: false,
    onChange({ file }) {
      if (file.status === 'done') {
        if (maxCount === 1) {
          setImages([file.response.location])
        } else {
          setImages(prev => [...prev, file.response.location])
        }
      }
    },
    defaultFileList: [],
  }), [])

  const deleteImage = (link) => {
    const filtered = images.filter(item => item !== link)
    setImages(filtered)
  }

  return (
    <Box my={5}>
      {images.length > 0 && images.map(image => (
        <Flex flexDirection={'column'}>
          <Image
            borderRadius="full"
            boxSize="150px"
            src={image}
            alt={alt}
          />
          <Button mt={1} colorScheme={'red'} onClick={() => deleteImage(image)} variant={'ghost'}> <DeleteIcon/></Button>
        </Flex>
      ))}
      {
        !(maxCount > 1 && images.length >= maxCount) &&
        <Upload {...uploadProps}>
          <Button marginTop={'1rem'} variant={'outline'}>{buttonText}</Button>
        </Upload>
      }

    </Box>
  )
}

export default UploadImage