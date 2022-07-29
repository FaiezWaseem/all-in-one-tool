import ExternalLink from '@/components/external-link';
import PageLayout from '@/components/page-layout';
import { Box, Flex, HStack, Button, useColorModeValue, VStack, Text, useMediaQuery } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react'
import firebase from '@/backend/firebase';
import { useEffect, useState } from 'react';

const IndexPage = () => {

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
  const [value, setValue] = useState<string>('');
  const [btn, setBtn] = useState<string>('save');

  function copytext(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var resultCopy = document.execCommand("copy");
    document.body.removeChild(input);
    return resultCopy;  
  }

  function onsave() {
    if (value.length > 0) {
      firebase.update('airforshare', {
        text: value,
        date: new Date().toUTCString()
      })
      setBtn('copy')
    } else {
      alert('Please write Something To copy')
    }
  }
  function onclear() {
    firebase.remove('airforshare', (res) => null)
    setValue('')
    setBtn('save')
  }
  function btnclick() {
    if (btn === 'save') {
      onsave();
    } else {
      copytext(value)
    }
  }

  useEffect(() => {
    firebase.getValueFromExactPath('airforshare', (snap) => {
      if (snap.exists()) {
        setValue(snap.val().text)
        setBtn('copy')
      }
    })
    firebase.onChanged('airforshare', snap => {
      console.log({
        method: 'onchanged',
        response: snap.val()
      })
    })
    firebase.onRemoved('airforshare', (res) => {
      setValue('')
      setBtn('save')
    })
  }, [])

  return (
    <PageLayout
      title='Home'
      description='Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template ! Enjoy coding.'
    >
      <VStack px={4} py={6} w={'100%'} height='95vh' bg={useColorModeValue('white', 'gray.800')}
        justify={'center'} align={'center'}>
        <Box w={'100%'}>
          <Text fontWeight={'bold'} color={'blue.500'} textAlign={'center'} fontSize={'4xl'} py={12}>
            AirForShare
          </Text>
        </Box>
        <Box w={'100%'} display={'flex'} justifyContent={'center'} py={12}>
          <Textarea w={isLargerThan768 ? '60%' : '100%'}
            h={isLargerThan768 ? 300 : 200} boxShadow={'2xl'}
            p={2} placeholder='write here or paste here'
            value={value}
            onChange={(e) => { setValue(e.target.value); setBtn('save') }}
          />
        </Box>
        <HStack w={'100%'} justifyContent={'flex-end'} paddingRight={20}>
          <Button
            onClick={onclear}
            px={8}
            colorScheme={'red'}
            bg={'red.400'}
            _hover={{ bg: 'red.500' }}
            color={'white'}
            rounded={'md'}
          >
            Clear
          </Button>
          <Button
            px={8}
            bg={useColorModeValue('blue.500', 'blue.600')}
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            onClick={btnclick}>
            {btn}
          </Button>
        </HStack>
      </VStack>

    </PageLayout>
  );
};

export default IndexPage;
