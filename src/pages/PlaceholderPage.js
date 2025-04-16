import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

export default function PlaceholderPage({ title, description }) {
  return (
    <Container maxW="container.xl" py={20}>
      <Stack
        align="center"
        spacing={8}
        textAlign="center"
      >
        <Box>
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, prism.400, prism.600)"
            bgClip="text"
          >
            {title}
          </Heading>
          <Text 
            fontSize="xl" 
            color={useColorModeValue('gray.600', 'gray.400')}
            maxW="2xl"
            mx="auto"
            mb={8}
          >
            {description || 'This feature is coming soon in a future update. Stay tuned for more exciting developments!'}
          </Text>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify="center"
          >
            <Button
              size="lg"
              colorScheme="prism"
              fontWeight="normal"
            >
              Join Waitlist
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="prism"
              fontWeight="normal"
            >
              Learn More
            </Button>
          </Stack>
        </Box>
        
        <Box
          mt={10}
          p={8}
          bg={useColorModeValue('prism.50', 'gray.700')}
          rounded="xl"
          maxW="3xl"
        >
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            What to expect in the full version:
          </Text>
          <Stack spacing={3} align="start" textAlign="left">
            <Text>• Advanced AI-powered features</Text>
            <Text>• Integration with multiple knowledge sources</Text>
            <Text>• Customizable user preferences</Text>
            <Text>• Personalized user experience</Text>
            <Text>• Blockchain verification mechanisms</Text>
            <Text>• Full token utility and rewards</Text>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
} 