import ExternalLink from '@/components/external-link';
import PageLayout from '@/components/page-layout';
import { Box, Code, Flex, Button, useColorModeValue, VStack, Text, useMediaQuery } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react'
import { IoIosAddCircle } from 'react-icons/io'
import NoteCard from '@/components/notes/NoteCard'
import firebase from '@/backend/firebase';
import { useEffect, useState } from 'react';

const FileUpload = () => {

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
  const [notesData, setNotesData] = useState([])
  const [userIp, setUserIp] = useState<string | undefined | number>(undefined)
  function AddNote() {
    if(userIp != undefined)
    firebase.push('notes/'+userIp, {
      title: '',
      content: '',
      date: new Date().toUTCString()
    })
  }
  useEffect(() => {
    fetch("https://airforshare.com/apiv3/clip.php")
      .then(function (data) {
        return data.json()
      })
      .then(function (data) {
        setUserIp(data.clipId)
      })
      .catch(function (error) {

        console.warn(error)
      });
      if(userIp != undefined)
    firebase.onAdded('notes/'+userIp+'/', (snap) => {
      setNotesData(item => {
        let obj = snap.val();
        obj.key = snap.key;
        return [
          obj,
          ...item
        ]
      })
    })
  }, [])

  return (
    <PageLayout
      title='Notes'
      description='Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template ! Enjoy coding.'
    >
      <VStack px={4} py={6} m={2} w={'100%'} height='100%' bg={useColorModeValue('white', 'gray.800')}>
        <Box w={'100%'} display={'flex'} justifyContent={'space-evenly'}>
          <Text fontWeight={'bold'} color={'orange.400'} textAlign={'center'} fontSize={isLargerThan768 ? '4xl' : '1rem'} >
            Notes ~ Add notes or codes snippets
          </Text>
          <Button leftIcon={<IoIosAddCircle />} colorScheme='orange' variant='solid' onClick={AddNote}>
            Add Note
          </Button>
        </Box>
        <Flex flexWrap={'wrap'} justify={'space-evenly'}>
          {notesData.map((item, index) => <NoteCard item={item} key={index.toString()} ip={userIp} />)}
        </Flex>
      </VStack>

    </PageLayout>
  );
};

export default FileUpload;
