export const handleErrorResponse = (error, toast) => {
  const messageData = error.response?.data?.message;

  if (Array.isArray(messageData)) {
    messageData.forEach(item => {
      toast({
        title: 'Error!',
        description: item,
        position: 'top-right',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    });
  } else if (messageData) {
    toast({
      title: 'Error!',
      description: messageData,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  } else {
    toast({
      title: 'Error!',
      description: 'An unknown error occurred',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }
};
