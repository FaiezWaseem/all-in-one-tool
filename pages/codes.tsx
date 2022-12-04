import firebase from '@/backend/firebase';
import CodeCard from '@/components/codesCard/CodeCard';
import PageLayout from '@/components/page-layout';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';

const Codes = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [notesData, setNotesData] = useState([]);
  const [userIp, setUserIp] = useState<string | undefined | number>('code');
  function AddNote() {
    if (userIp != undefined) {
      const key = firebase.getPushKey();
      firebase.set('notes/' + userIp + '/' + key, {
        title: '',
        content: '',
        date: new Date().toUTCString(),
        key,
      });
    }
  }

  useEffect(() => {
    if (userIp != undefined) {
      firebase.onAdded('notes/' + userIp + '/', (snap) => {
        setNotesData((item) => {
          let obj = snap.val();
          return [obj, ...item];
        });
      });

      firebase.onRemoved('notes/' + userIp + '/', (snap) => {
        let key = snap.val().key;

        setNotesData(notesData.filter((item) => item.key == key));
      });
    }
  }, [userIp]);

  function removeItemAtIndex(arr, index) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return (
    <PageLayout
      title='Notes'
      description='AIOT - AIOT is an All in One Tool Thats provides the tools like text sharing , large file uploads , links saving , code snippet sharing etc...'
    >
      <VStack
        px={4}
        py={6}
        m={2}
        w={'100%'}
        height='100%'
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Box w={'100%'} display={'flex'} justifyContent={'space-evenly'}>
          <Text
            fontWeight={'bold'}
            color={'blue.400'}
            textAlign={'center'}
            fontSize={isLargerThan768 ? '4xl' : '1rem'}
          >
            codes snippets
          </Text>
          <Button
            leftIcon={<IoIosAddCircle />}
            colorScheme='blue'
            variant='solid'
            onClick={AddNote}
          >
            Add Snippet
          </Button>
        </Box>
        <Flex flexWrap={'wrap'} justify={'space-evenly'}>
          {notesData.map((item, index) => (
            <CodeCard item={item} key={index.toString()} ip={userIp} />
          ))}
        </Flex>
      </VStack>
    </PageLayout>
  );
};

export default Codes;
