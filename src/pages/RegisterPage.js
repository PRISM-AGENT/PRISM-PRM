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
  Checkbox,
  Divider,
  Flex,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    joinNewsletter: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'acceptTerms' || name === 'joinNewsletter' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      // In a real app, this would integrate with a backend
      console.log('Register attempt with:', formData);
      
      // Success toast
      toast({
        title: 'Registration successful!',
        description: "You've been added to our waitlist. We'll contact you soon.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        joinNewsletter: false,
      });
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 18 }}>
      <Stack spacing={6}>
        <Stack align="center">
          <Heading
            textAlign="center"
            fontSize="3xl"
            fontWeight="bold"
          >
            Join the PRISM Waitlist
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Be the first to access our revolutionary crypto knowledge platform
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
              <HStack>
                <FormControl id="firstName" isInvalid={!!errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                
                <FormControl id="lastName" isInvalid={!!errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <Stack spacing={5} pt={2}>
                <FormControl id="acceptTerms" isInvalid={!!errors.acceptTerms}>
                  <Checkbox
                    name="acceptTerms"
                    isChecked={formData.acceptTerms}
                    onChange={handleChange}
                    colorScheme="prism"
                  >
                    I accept the <Link color="prism.500">Terms of Service</Link> and{' '}
                    <Link color="prism.500">Privacy Policy</Link>
                  </Checkbox>
                  <FormErrorMessage>{errors.acceptTerms}</FormErrorMessage>
                </FormControl>

                <FormControl id="joinNewsletter">
                  <Checkbox
                    name="joinNewsletter"
                    isChecked={formData.joinNewsletter}
                    onChange={handleChange}
                    colorScheme="prism"
                  >
                    Subscribe to our newsletter for updates
                  </Checkbox>
                </FormControl>

                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg="prism.600"
                  color="white"
                  _hover={{
                    bg: 'prism.700',
                  }}
                >
                  Join Waitlist
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
                OR SIGN UP WITH
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

        <Stack pt={4} textAlign="center">
          <Text>
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="prism.500">
              Sign in
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
} 