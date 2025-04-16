import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Flex,
  Avatar,
  useColorModeValue,
  Heading,
  Divider,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { FaRobot } from 'react-icons/fa';

export default function AssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m PRISM Assistant, your blockchain knowledge expert. How can I help you today?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  // Mock crypto knowledge responses
  const demoResponses = {
    'blockchain': 'Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping across a network of computers. It forms the foundation of most cryptocurrencies and decentralized applications (dApps).',
    'bitcoin': 'Bitcoin (BTC) is the first and most valuable cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It operates on a proof-of-work consensus mechanism and has a maximum supply of 21 million coins.',
    'ethereum': 'Ethereum (ETH) is a programmable blockchain that enables the creation of smart contracts and decentralized applications (dApps). It was proposed by Vitalik Buterin in 2013 and launched in 2015. Ethereum has transitioned from proof-of-work to proof-of-stake consensus with "The Merge" upgrade.',
    'defi': 'DeFi (Decentralized Finance) refers to financial services built on blockchain technology that aim to recreate and improve traditional financial systems in a decentralized manner. Key DeFi components include lending protocols, decentralized exchanges (DEXs), yield farming, and stablecoins.',
    'nft': 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items on a blockchain. Unlike cryptocurrencies, each NFT has distinct properties and cannot be exchanged on a 1:1 basis. NFTs are commonly used for digital art, collectibles, gaming items, and virtual real estate.',
    'smart contract': 'Smart contracts are self-executing agreements with the terms directly written into code. They automatically execute when predefined conditions are met, removing the need for intermediaries. Smart contracts are a key feature of programmable blockchains like Ethereum.',
    'liquidity': 'In crypto markets, liquidity refers to how easily an asset can be bought or sold without causing significant price impact. Liquidity pools are a DeFi innovation that create decentralized trading markets where users provide assets to facilitate trades and earn fees in return.',
    'staking': 'Staking involves locking up cryptocurrency to support network operations in proof-of-stake blockchains. Stakers are typically rewarded with additional tokens, similar to interest. It\'s generally more energy-efficient than proof-of-work mining.',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const processMessage = async (message) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Check for keyword matches in the demo responses
      let response = 'I don\'t have specific information about that yet. As a demo assistant, my knowledge is limited. In the full version, I would connect to various knowledge sources to provide accurate information on any crypto topic.';
      
      const lowerMessage = message.toLowerCase();
      for (const [keyword, resp] of Object.entries(demoResponses)) {
        if (lowerMessage.includes(keyword)) {
          response = resp;
          break;
        }
      }

      // If it's a greeting or thanks, respond accordingly
      if (
        lowerMessage.includes('hello') ||
        lowerMessage.includes('hi') ||
        lowerMessage.includes('hey')
      ) {
        response = 'Hello! How can I help you with crypto knowledge today?';
      } else if (
        lowerMessage.includes('thanks') ||
        lowerMessage.includes('thank you')
      ) {
        response = 'You\'re welcome! Feel free to ask any other crypto questions.';
      } else if (
        lowerMessage.includes('who are you') ||
        lowerMessage.includes('what are you')
      ) {
        response = 'I\'m PRISM Assistant, a specialized AI focused on cryptocurrency and blockchain knowledge. I help users access verified information about crypto assets, technologies, and concepts.';
      }

      // Add AI response to chat
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    processMessage(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m PRISM Assistant, your blockchain knowledge expert. How can I help you today?',
      },
    ]);
    toast({
      title: 'Chat cleared',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW={'container.lg'} py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            PRISM Assistant
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Your blockchain knowledge expert
          </Text>
          <Divider my={4} />
        </Box>
        
        <Flex justifyContent="flex-end">
          <Button size="sm" onClick={clearChat} colorScheme="gray">
            Clear Chat
          </Button>
        </Flex>
        
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="md"
          p={4}
          h="500px"
          overflowY="auto"
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message, index) => (
              <HStack
                key={index}
                alignSelf={
                  message.role === 'user' ? 'flex-end' : 'flex-start'
                }
                bg={
                  message.role === 'user'
                    ? useColorModeValue('prism.100', 'prism.900')
                    : useColorModeValue('gray.100', 'gray.700')
                }
                borderRadius="lg"
                p={3}
                maxW="80%"
              >
                {message.role !== 'user' && (
                  <Avatar
                    icon={<FaRobot />}
                    bg="prism.500"
                    color="white"
                    size="sm"
                  />
                )}
                <Text>{message.content}</Text>
              </HStack>
            ))}
            {isTyping && (
              <HStack
                alignSelf="flex-start"
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderRadius="lg"
                p={3}
              >
                <Avatar
                  icon={<FaRobot />}
                  bg="prism.500"
                  color="white"
                  size="sm"
                />
                <Text>Typing...</Text>
              </HStack>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        
        <HStack>
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crypto, blockchain, DeFi, NFTs..."
            size="lg"
            variant="filled"
          />
          <IconButton
            colorScheme="prism"
            aria-label="Send message"
            icon={<ArrowUpIcon />}
            onClick={handleSendMessage}
            size="lg"
          />
        </HStack>
        
        <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} textAlign="center">
          This is a demo version with limited capabilities. The full PRISM Assistant will connect to multiple knowledge sources and provide verified, up-to-date information.
        </Text>
      </VStack>
    </Container>
  );
} 