import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      // In a real app, this would integrate with a backend
      console.log('Login attempt with:', { email, password });
      // For demo, just clear the form
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 20 }}>
      <Stack spacing={8}>
        <Stack align="center">
          <Heading
            textAlign="center"
            fontSize="3xl"
            fontWeight="bold"
          >
            Sign in to your account
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Access your PRISM dashboard and AI assistants
          </Text>
        </Stack>

        <Box
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!emailError}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
              </FormControl>

              <FormControl id="password" isInvalid={!!passwordError}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>

              <Stack spacing={5}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align="start"
                  justify="space-between"
                >
                  <Link color="prism.500">Forgot password?</Link>
                </Stack>
                <Button
                  type="submit"
                  bg="prism.600"
                  color="white"
                  _hover={{
                    bg: 'prism.700',
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>

          <Stack spacing={4} mt={6}>
            <Flex align="center">
              <Divider />
              <Text
                px={2}
                fontSize="sm"
                color={useColorModeValue('gray.600', 'gray.400')}
              >
                OR CONTINUE WITH
              </Text>
              <Divider />
            </Flex>

            <Stack direction="row" spacing={4}>
              <Button w="full" leftIcon={<FaGoogle />} variant="outline">
                Google
              </Button>
              <Button w="full" leftIcon={<FaTwitter />} variant="outline">
                Twitter
              </Button>
              <Button w="full" leftIcon={<FaGithub />} variant="outline">
                GitHub
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack pt={6} textAlign="center">
          <Text>
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="prism.500">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
} 