import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react'
import React from 'react'
import PropTypes from 'prop-types';


function Alert({ isOpenDialog, cancelRef, onCloseDialog, deleteProduct }) {
  return (
    <AlertDialog
      isOpen={isOpenDialog}
      leastDestructiveRef={cancelRef}
      onClose={onCloseDialog}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Product
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCloseDialog}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteProduct} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

Alert.propTypes = {
  isOpenDialog: PropTypes.any.isRequired,
  cancelRef: PropTypes.any.isRequired,
  onCloseDialog: PropTypes.any.isRequired,
  deleteProduct: PropTypes.any.isRequired
}
export default Alert