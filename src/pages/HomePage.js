import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaRobot, FaDatabase, FaShieldAlt, FaUserCog } from 'react-icons/fa';

// Hero feature component
const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'prism.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Container maxW={'7xl'}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'prism.400',
                  zIndex: -1,
                }}
              >
                Knowledge-Driven
              </Text>
              <br />
              <Text as={'span'} color={'prism.600'}>
                Crypto Asset Advisory Platform
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              A revolutionary intelligent Q&A platform focused on knowledge acquisition and dissemination in the cryptocurrency and blockchain sectors.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                colorScheme={'prism'}
                bg={'prism.600'}
                _hover={{ bg: 'prism.700' }}
                as={RouterLink}
                to="/assistant"
              >
                Try Demo
              </Button>
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                as={RouterLink}
                to="/about"
              >
                Read Whitepaper
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
          >
            <Box
              position={'relative'}
              height={'300px'}
              rounded={'2xl'}
              boxShadow={'2xl'}
              width={'full'}
              overflow={'hidden'}
            >
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={'100%'}
                src={
                  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80'
                }
              />
            </Box>
          </Flex>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box py={12} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW={'7xl'}>
          <Heading
            textAlign={'center'}
            fontSize={'4xl'}
            py={10}
            fontWeight={'bold'}
          >
            Powered by Intelligence
          </Heading>
          <Text
            fontSize={'xl'}
            textAlign={'center'}
            color={'gray.600'}
            maxW={'3xl'}
            mx={'auto'}
            mb={10}
          >
            PRISM combines advanced AI with blockchain verification to create a trusted knowledge ecosystem.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            <Feature
              icon={<Icon as={FaRobot} w={10} h={10} />}
              title={'Intelligent Assistants'}
              text={'Create customized AI assistants that integrate various knowledge sources including web pages, PDFs, videos, and more.'}
            />
            <Feature
              icon={<Icon as={FaDatabase} w={10} h={10} />}
              title={'Multi-source Knowledge'}
              text={'Import knowledge from cryptocurrency news, analysis articles, project documentation, and technical resources.'}
            />
            <Feature
              icon={<Icon as={FaShieldAlt} w={10} h={10} />}
              title={'Verified Information'}
              text={'Utilize blockchain technology to verify information sources and update times, ensuring reliability and transparency.'}
            />
            <Feature
              icon={<Icon as={FaUserCog} w={10} h={10} />}
              title={'Personalized Delivery'}
              text={'Access knowledge through customized AI assistants tailored to your specific needs and preferences.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxW={'7xl'} py={16}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 8, md: 10 }}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('prism.50', 'prism.900')}
          p={10}
          rounded={'xl'}
        >
          <Stack flex={1} spacing={4}>
            <Heading
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              fontWeight={'bold'}
            >
              Ready to get started?
            </Heading>
            <Text color={'gray.600'} fontSize={{ base: 'md', sm: 'lg' }}>
              Join our waitlist to get early access to the PRISM platform and be the first to experience the future of crypto knowledge.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                colorScheme={'prism'}
                bg={'prism.600'}
                _hover={{ bg: 'prism.700' }}
                as={RouterLink}
                to="/register"
              >
                Join Waitlist
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
} 