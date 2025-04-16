import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Container,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

export default function NotFoundPage() {
  return (
    <Container maxW="container.xl" py={20}>
      <Stack
        align={'center'}
        spacing={10}
        textAlign="center"
      >
        <Box>
          <Heading
            as="h1"
            size="3xl"
            mb={4}
            bgGradient="linear(to-r, prism.400, prism.600)"
            bgClip="text"
          >
            404
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Page Not Found
          </Text>
          <Text color={useColorModeValue('gray.600', 'gray.400')} mb={8}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            as={RouterLink}
            to="/"
            colorScheme="prism"
            size="lg"
          >
            Return Home
          </Button>
        </Box>
        <Box maxW="400px">
          <Image
            src="https://illustrations.popsy.co/purple/crashed-error.svg"
            alt="404 Illustration"
          />
        </Box>
      </Stack>
    </Container>
  );
} 