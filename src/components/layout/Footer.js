import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Tag,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { FaTwitter, FaGithub } from 'react-icons/fa';

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={8}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Flex align="center">
                <Image src="/images/logo.png" alt="PRISM Logo" h="40px" />
                <Text fontSize="2xl" fontWeight="bold" ml={2}>
                  PRISM
                </Text>
              </Flex>
            </Box>
            <Text fontSize={'sm'}>
              Illuminating crypto knowledge through AI. Making blockchain wisdom accessible to everyone.
            </Text>
            <Stack direction={'row'} spacing={6}>
              <Link href={'https://x.com/PRI_SM_AI'} isExternal>
                <FaTwitter />
              </Link>
              <Link href={'https://github.com/PRISM-AGENT/PRISM'} isExternal>
                <FaGithub />
              </Link>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Product</ListHeader>
            <Link as={RouterLink} to={'/features'}>Features</Link>
            <Link as={RouterLink} to={'/how-it-works'}>How It Works</Link>
            <Link as={RouterLink} to={'/token'}>Token</Link>
            <Link as={RouterLink} to={'/roadmap'}>Roadmap</Link>
            <Link as={RouterLink} to={'/technology'}>Technology</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Link as={RouterLink} to={'/about'}>About Us</Link>
            <Link as={RouterLink} to={'/team'}>Team</Link>
            <Link as={RouterLink} to={'/careers'}>Careers</Link>
            <Link as={RouterLink} to={'/press'}>Press</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Support</ListHeader>
            <Link as={RouterLink} to={'/help'}>Help Center</Link>
            <Link as={RouterLink} to={'/terms'}>Terms of Service</Link>
            <Link as={RouterLink} to={'/privacy'}>Privacy Policy</Link>
            <Link as={RouterLink} to={'/faq'}>FAQ</Link>
            <Link as={RouterLink} to={'/documentation'}>Documentation</Link>
          </Stack>
        </SimpleGrid>
      </Container>
      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
        >
          <Text>© {new Date().getFullYear()} PRISM. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <Tag colorScheme="purple">BETA</Tag>
            <Text>Built with thirdweb</Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
} 