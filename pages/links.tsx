import firebase from '@/backend/firebase';
import Linkcard from '@/components/links/linkCard';
import PageLayout from '@/components/page-layout';
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FcLink } from 'react-icons/fc';

import { LinkCard } from '@/types/type-example';

const LinksPage = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [imgLink, setImgLink] = useState<string>('');
  const [webLink, setWebLink] = useState<string>('');
  const [links, setLinks] = useState<Array<Object>>([]);

  let today = new Date();

  let date = `
  ${today.getDate()}-${parseInt(
    (today.getMonth() + 1).toString()
  ).toString()}-${today.getFullYear()}`;

  function AddLink() {
    if (webLink.length <= 4) {
      alert('please Enter website link');
      return;
    }
    function domainName(webLink) {
      let domain = new URL(webLink);
      if (domain.pathname !== '/') {
        return domain.pathname;
      } else {
        return domain.hostname;
      }
    }
    firebase.push('weblinks', {
      label: 'web',
      link: webLink,
      imglink: imgLink,
      name: domainName(webLink),
      date: date,
    });
    setImgLink('');
    setWebLink('');
  }
  useEffect(() => {
    firebase.onAdded('weblinks', (snap) => {
      setLinks((link) => {
        return [snap.val(), ...link];
      });
    });
  }, []);

  return (
    <PageLayout
      title='Links'
      description='AIOT - AIOT is an All in One Tool Thats provides the tools like text sharing , large file uploads , links saving , code snippet sharing etc...'
    >
      <VStack
        px={4}
        py={6}
        w={'100%'}
        height='100%'
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Box
          w={'100%'}
          display={'flex'}
          justifyContent={'space-evenly'}
          flexWrap={'wrap'}
          boxShadow={'md'}
          p={4}
        >
          <Input
            value={webLink}
            onChange={(e) => setWebLink(e.target.value)}
            placeholder='add website link here'
            mt={1}
            width={isLargerThan768 ? '30%' : '100%'}
          />
          <Input
            value={imgLink}
            onChange={(e) => setImgLink(e.target.value)}
            placeholder='add website Image link here (Optional)'
            mt={1}
            width={isLargerThan768 ? '30%' : '100%'}
          />
          <Button
            rightIcon={<FcLink />}
            mt={1}
            variant='solid'
            onClick={AddLink}
          >
            Save
          </Button>
        </Box>
        <Flex flexWrap={'wrap'} justify={'space-evenly'}>
          {links.length <= 0 && <Spinner />}
          {links.map((link: LinkCard, index: number) => (
            <Linkcard
              name={link.name}
              link={link.link}
              date={link.date}
              label={link.label}
              img={link.imglink}
              key={index.toString()}
            />
          ))}
        </Flex>
      </VStack>
    </PageLayout>
  );
};

export default LinksPage;
