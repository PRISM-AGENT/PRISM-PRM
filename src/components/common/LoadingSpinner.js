import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

/**
 * Loading spinner component with optional message
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'xl', thickness = '4px', speed = '0.65s' }) => {
  return (
    <Flex direction="column" align="center" justify="center" h="200px">
      <Spinner
        thickness={thickness}
        speed={speed}
        emptyColor="gray.200"
        color="prism.500"
        size={size}
        mb={4}
      />
      {message && <Text color="gray.500">{message}</Text>}
    </Flex>
  );
};

export default LoadingSpinner; 