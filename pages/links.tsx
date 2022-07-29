import ExternalLink from '@/components/external-link';
import PageLayout from '@/components/page-layout';
import { Box, Code, Flex, Button, useColorModeValue, VStack, Text, useMediaQuery } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react'
import { FcLink } from 'react-icons/fc'
import Linkcard from '@/components/links/linkCard'
import firebase from '@/backend/firebase';
import { useEffect, useState } from 'react';

import {LinkCard} from '@/types/type-example'

const LinksPage = () => {

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
  const [imgLink , setImgLink] = useState<string>('')
  const [webLink , setWebLink] = useState<string>('')
  const [links , setLinks] = useState<Array<Object>>([])

   let today = new Date();

            // @ts-expect-error
   let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear();
   
   function AddLink(){
      if(webLink.length <=  4){
        alert('please Enter website link')
        return ;
      }
      let domain = (new URL(webLink));
      firebase.push('weblinks' , {
        label : 'web',
        link : webLink,
        imglink : imgLink,
        name : domain.hostname,
        date : date
      })
      setImgLink('')
      setWebLink('')
   }
   useEffect(()=>{
     firebase.onAdded('weblinks', (snap)=> {
      setLinks(link =>{
        return [
          snap.val(),
          ...link
        ]
      })
     })
   },[])


  return (
    <PageLayout
      title='Links'
      description='Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template ! Enjoy coding.'
    >
      <VStack px={4} py={6} w={'100%'} height='100%' bg={useColorModeValue('white', 'gray.800')}>
        <Box w={'100%'} display={'flex'} justifyContent={'space-evenly'} flexWrap={'wrap'} boxShadow={'md'} p={4}>
          <Input value={webLink} onChange={(e)=> setWebLink(e.target.value)}
          placeholder='add website link here' mt={1} width={isLargerThan768 ? '30%' : '100%'} />
          <Input value={imgLink} onChange={(e)=>setImgLink(e.target.value)}
           placeholder='add website Image link here (Optional)' mt={1} width={isLargerThan768 ? '30%' : '100%'} />
          <Button rightIcon={<FcLink />} mt={1} variant='solid' onClick={AddLink}>
            Save
          </Button>
        </Box>
        <Flex flexWrap={'wrap'} justify={'space-evenly'}>
          {links.map((link : LinkCard) => <Linkcard name={link.name} link={link.link} date={link.date} label={link.label} img={link.imglink}  />)}
   

        </Flex>
      </VStack>

    </PageLayout>
  );
};

export default LinksPage;
