import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Circle,
  Stack,
  useColorModeValue,
  Divider,
  Progress,
  HStack,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FaCoins, FaLock, FaExchangeAlt, FaUsers } from 'react-icons/fa';

// TokenStat component
const TokenStat = ({ title, stat, helpText, icon, accentColor }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Stat
      px={4}
      py={5}
      bg={bgColor}
      shadow="base"
      rounded="lg"
      borderTop="4px solid"
      borderColor={accentColor}
    >
      <HStack spacing={3}>
        <Circle size="40px" bg={`${accentColor}`} color="white">
          {icon}
        </Circle>
        <Box>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium">
            {stat}
          </StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Box>
      </HStack>
    </Stat>
  );
};

// Token distribution component
const TokenDistribution = ({ label, percentage, color }) => {
  return (
    <Box mb={4}>
      <HStack justifyContent="space-between" mb={1}>
        <Text fontWeight="medium">{label}</Text>
        <Text fontWeight="medium">{percentage}%</Text>
      </HStack>
      <Progress value={percentage} size="sm" colorScheme={color} rounded="md" />
    </Box>
  );
};

export default function TokenPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={12}>
        {/* Header Section */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            PRM Token Economics
          </Heading>
          <Text 
            fontSize="xl"
            maxW="3xl"
            mx="auto"
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            The PRM token powers the PRISM ecosystem, aligning incentives among all participants.
          </Text>
        </Box>

        {/* Token Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <TokenStat
            title="Total Supply"
            stat="100,000,000 PRM"
            helpText="Maximum token supply"
            icon={<Icon as={FaCoins} w={5} h={5} />}
            accentColor="prism.500"
          />
          <TokenStat
            title="Token Type"
            stat="ERC-20"
            helpText="Ethereum-based token"
            icon={<Icon as={FaExchangeAlt} w={5} h={5} />}
            accentColor="blue.500"
          />
          <TokenStat
            title="Current Price"
            stat="--"
            helpText="TGE scheduled for Q3 2025"
            icon={<Icon as={FaLock} w={5} h={5} />}
            accentColor="green.500"
          />
          <TokenStat
            title="Staking Rewards"
            stat="Up to 15% APY"
            helpText="For token holders"
            icon={<Icon as={FaUsers} w={5} h={5} />}
            accentColor="purple.500"
          />
        </SimpleGrid>

        {/* Token Utility */}
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            Token Utility
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <Heading as="h3" size="md" mb={4} color="prism.600">
                Access
              </Heading>
              <Text mb={4}>
                Unlock premium features, advanced AI capabilities, and priority support by holding or staking PRM tokens.
              </Text>
              <Divider mb={4} />
              <VStack align="start" spacing={2}>
                <Text>• Unlimited use of professional-grade AI assistants</Text>
                <Text>• Priority access to the latest features</Text>
                <Text>• Increased API call quotas</Text>
                <Text>• Access to exclusive in-depth analysis tools</Text>
              </VStack>
            </Box>

            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <Heading as="h3" size="md" mb={4} color="blue.500">
                Payment
              </Heading>
              <Text mb={4}>
                Pay for knowledge services, custom assistants, and expert consultations using PRM tokens with special discounts.
              </Text>
              <Divider mb={4} />
              <VStack align="start" spacing={2}>
                <Text>• Subscription to advanced professional assistants</Text>
                <Text>• Purchase of customized knowledge bases</Text>
                <Text>• Payment for expert manual review services</Text>
                <Text>• Special analyses and reports</Text>
              </VStack>
            </Box>

            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <Heading as="h3" size="md" mb={4} color="purple.500">
                Staking
              </Heading>
              <Text mb={4}>
                Stake tokens to participate in information verification for rewards and reduce usage fees for platform services.
              </Text>
              <Divider mb={4} />
              <VStack align="start" spacing={2}>
                <Text>• Earn rewards for verifying information</Text>
                <Text>• Reduce advanced feature usage fees</Text>
                <Text>• Receive platform revenue sharing</Text>
                <Text>• Increase exposure of created assistants</Text>
              </VStack>
            </Box>

            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <Heading as="h3" size="md" mb={4} color="green.500">
                Governance
              </Heading>
              <Text mb={4}>
                Participate in platform governance and influence the future development of the PRISM ecosystem.
              </Text>
              <Divider mb={4} />
              <VStack align="start" spacing={2}>
                <Text>• Vote on platform feature updates</Text>
                <Text>• Participate in knowledge verification rule formulation</Text>
                <Text>• Propose new features and improvements</Text>
                <Text>• Decide community fund usage directions</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Token Distribution */}
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            Token Distribution
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <Heading as="h3" size="md" mb={6}>
                Allocation
              </Heading>
              <Box>
                <TokenDistribution
                  label="Community Incentives"
                  percentage={40}
                  color="purple"
                />
                <TokenDistribution
                  label="Ecosystem Development"
                  percentage={25}
                  color="blue"
                />
                <TokenDistribution
                  label="Platform Development"
                  percentage={20}
                  color="green"
                />
                <TokenDistribution
                  label="Liquidity Supply"
                  percentage={15}
                  color="orange"
                />
              </Box>
            </Box>

            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <Heading as="h3" size="md" mb={6}>
                Deflationary Mechanism
              </Heading>
              <Text mb={4}>
                PRISM implements a deflationary token model to ensure long-term value for token holders:
              </Text>
              <VStack align="start" spacing={3} mt={4}>
                <Text>• 30% of platform service fees used to buy back and burn PRM tokens</Text>
                <Text>• Quarterly regular burns until total supply reduces to 50 million</Text>
                <Text>• Burn events transparently executed through smart contracts</Text>
                <Text>• Real-time visualization of burn progress and impact</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Box
          bg={useColorModeValue('prism.50', 'prism.900')}
          p={8}
          rounded="xl"
          textAlign="center"
        >
          <Heading as="h3" size="lg" mb={4}>
            Ready to join the PRISM ecosystem?
          </Heading>
          <Text fontSize="lg" maxW="2xl" mx="auto" mb={6}>
            Get early access to the PRM token and be part of the future of decentralized knowledge.
          </Text>
          <Button
            size="lg"
            colorScheme="prism"
            px={8}
            py={6}
            fontSize="md"
            fontWeight="bold"
          >
            Join Token Waitlist
          </Button>
        </Box>
      </Stack>
    </Container>
  );
} 