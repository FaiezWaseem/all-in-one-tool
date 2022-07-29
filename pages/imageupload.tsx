import PageLayout from '@/components/page-layout';
import { Box, Code, Flex, Button, useColorModeValue, VStack, Text, useMediaQuery } from '@chakra-ui/react';
import { FcAddImage } from 'react-icons/fc'
import ImageCard from '@/components/imageupload/ImageCard'
import { useState } from 'react';
import firebase from '@/backend/firebase'
import { useEffect } from 'react';



const FileUpload = () => {

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
  const [isUploading, setIsUploading] = useState(false)
  const [imagesdata, setImagesdata] = useState([])

  function fileChange() {
    var file = document.createElement('input')
    file.type = 'file'
    file.accept = 'image/png, image/gif, image/jpeg'
    file.click()
    file.onchange = () => {
      const rf = new FileReader();
      rf.readAsDataURL(file.files[0]); //file is from a useState() hook
      rf.onloadend = function (event) {
        const body = new FormData();
        // @ts-expect-error
        body.append("image", event.target.result.split(",").pop()); //To delete 'data:image/png;base64,' otherwise imgbb won't process it.
        setIsUploading(true)
        ImageUpload(body)

      }

    }



  }

  function ImageUpload(body: any) {

    fetch("https://api.imgbb.com/1/upload?key=a93e83eb482f9d317720c75c023d9874", {
      method: "POST",
      body: body
    })
      .then(res => {
        res.json().then(res => {
          firebase.push('images', {
            title: res.data.title,
            delete_url: res.data.delete_url,
            size: res.data.size,
            display_url: res.data.display_url,
            mime: res.data.image.mime,
            full_url: res.data.image.url,
            time: new Date().toISOString()
          })
        })
        setIsUploading(false)
      })
      .catch(err => { console.log(err); setIsUploading(false) });
  }

  useEffect(() => {
    firebase.onAdded('images', (snap) => {
      setImagesdata(item => {
        return [
          snap.val(),
          ...item
        ]
      })
    })
  }, [])

  return (
    <PageLayout
      title='Image Upload'
      description='Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template ! Enjoy coding.'
    >
      <VStack px={4} py={6} w={'100%'} height='100%' bg={useColorModeValue('white', 'gray.800')}>
        <Box w={'100%'} display={'flex'} justifyContent={'space-evenly'}>
          <Text fontWeight={'bold'} color={'blue.500'} textAlign={'center'} fontSize={isLargerThan768 ? '4xl' : 'xl'} >
            Image Upload
          </Text>
          <Button leftIcon={<FcAddImage />} colorScheme='teal' isLoading={isUploading} variant='outline' onClick={fileChange} >
            Upload
          </Button>
        </Box>
        <Flex flexWrap={'wrap'} justify={'space-evenly'}>
          {imagesdata.map((data , index) => <ImageCard item={data} key={index.toString()} />)}

        </Flex>
      </VStack>

    </PageLayout>
  );
};

export default FileUpload;
