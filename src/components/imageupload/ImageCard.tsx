import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
    Button , 
    useToast
  } from '@chakra-ui/react';
  
 
  export default function ImageCard({item } : any) {
    const toast = useToast()
    function copytext(text) {
      var input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      var resultCopy = document.execCommand("copy");
      document.body.removeChild(input);
      return resultCopy;  
    }

    return (
      <Center py={12}>
        <Box
          role={'group'}
          p={6}
          maxW={'330px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}>
          <Box
            rounded={'lg'}
            mt={-12}
            pos={'relative'}
            height={'230px'}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 5,
              left: 0,
              backgroundImage: `url(${item.display_url})`,
              filter: 'blur(15px)',
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: 'blur(20px)',
              },
            }}>
            <Image
              rounded={'lg'}
              height={230}
              width={282}
              objectFit={'cover'}
              src={item.display_url}
            />
          </Box>
          <Stack pt={10} align={'center'}>
            <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
              {item.time}
            </Text>
            <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
              {item.title.length > 40 ? item.title.substring(0,40) + '...' : item.title }
            </Heading>
            <Stack direction={'row'} align={'center'}>
             <Button colorScheme={'facebook'} color='white' as='a' href={item.full_url} >Download</Button>
             <Button colorScheme={'teal'} color='white' onClick={()=> { 
              copytext(item.full_url); 
              toast({
                title: 'Message',
                description: "Link  copied",
                status: 'success',
                position : 'top',
                duration: 3000,
                isClosable: true,
              })
              }}  >Copy Link</Button>
            </Stack>
          </Stack>
        </Box>
      </Center>
    );
  }