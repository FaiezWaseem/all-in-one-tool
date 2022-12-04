import PageLayout from '@/components/page-layout';
import {
  Box,
  Button,
  Input,
  Progress,
  Text,
  useColorModeValue,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const FileUpload = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isUploading, setUploading] = useState<Boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [link, setLink] = useState<string>('');
  const toast = useToast();
  function getAccessToken() {
    const id =
      'AKfycbz19inbya5CcwM48qEXSQk4VssWSQNCcvcrmUBIk6QVgGsUoOBi2t9Cjn7Cy_6UnrW9';
    const url = `https://script.google.com/macros/s/${id}/exec`;
    const qs = new URLSearchParams({ filename: 'xx', mimeType: 'xxx' });
    fetch(`${url}?${qs}`, {
      method: 'POST',
      body: '',
    })
      .then((res) => res.json())
      .then((e) => {
        setAccessToken(e.token);
      })
      .catch((err) => {
        console.error('Failed To get AccessToken ReTrying \n', [err]);
        getAccessToken();
      });
  }

  function getFileShaingPermission(fid) {
    const id =
      'AKfycbzKN-K_pAw-Vmg_36AY32hWLOZtrkXJwxNKkE07pQ69k7Re1_RoWzlmCK1bKTBfcLB5';
    const url = `https://script.google.com/macros/s/${id}/exec`;
    const qs = new URLSearchParams({ id: fid, title: 'aiot' });
    fetch(`${url}?${qs}`, {
      method: 'POST',
      body: 'xx',
    })
      .then((res) => res.json())
      .then((e) => {
        console.log(e);
      })
      .catch((err) => {
        // console.warn(err)
        // console.clear();
      });
  }
  function resumableUpload(e) {
    setUploading(true);
    setProgress(0);
    console.log('Initializing.');
    const f = e.target;
    const resource = {
      fileName: f.fileName,
      fileSize: f.fileSize,
      fileType: f.fileType,
      fileBuffer: f.result,
      accessToken: accessToken,
    };
    // @ts-expect-error
    const ru = new ResumableUploadToGoogleDrive();
    ru.Do(resource, function (res, err) {
      if (err) {
        console.log(err);
        return;
      }
      try {
        setProgress(100);
        setLink(
          'https://drive.google.com/uc?export=download&id=' + res.result.id
        );
        getFileShaingPermission(res.result.id);
      } catch (err) {
        console.log(res);
      }
      let msg = '';
      if (res.status == 'Uploading') {
        setProgress(
          (res.progressNumber.current / res.progressNumber.end) * 100
        );
      } else {
        msg = res.status;
      }
    });
  }
  function run(obj) {
    setLink('');
    const file = obj.target.files[0];
    if (file.name != '') {
      let fr = new FileReader();
      // @ts-expect-error
      fr.fileName = file.name;
      // @ts-expect-error
      fr.fileSize = file.size;
      // @ts-expect-error
      fr.fileType = file.type;
      fr.readAsArrayBuffer(file);
      fr.onload = resumableUpload;
    }
  }
  function copytext(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var resultCopy = document.execCommand('copy');
    document.body.removeChild(input);
    return resultCopy;
  }

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  return (
    <PageLayout
      title='File Upload'
      description='AIOT - AIOT is an All in One Tool Thats provides the tools like text sharing , large file uploads , links saving , code snippet sharing etc...'
    >
      <Script src='https://apis.google.com/js/api.js' />
      <Script src='https://cdn.jsdelivr.net/gh/tanaikech/ResumableUploadForGoogleDrive_js@master/resumableupload_js.min.js' />
      <VStack
        px={4}
        py={6}
        w={'100%'}
        height='95vh'
        bg={useColorModeValue('white', 'gray.800')}
        justify={isLargerThan768 ? 'center' : 'flex-start'}
        align={isLargerThan768 ? 'center' : 'flex-start'}
      >
        <Box w={'100%'}>
          <Text
            fontWeight={'bold'}
            color={'blue.500'}
            textAlign={'center'}
            fontSize={'4xl'}
            py={isLargerThan768 ? 12 : 3}
          >
            FileUpload
          </Text>
        </Box>
        <Box w={'100%'} display={'flex'} justifyContent={'center'} py={12}>
          <Input
            type={'file'}
            w={isLargerThan768 ? '30%' : '80%'}
            onChange={run}
          />
        </Box>
        <VStack w={'100%'} justifyContent={'center'}>
          <Progress hasStripe value={progress} width={200} />

          <p>{progress}%</p>
          <p
            style={{
              background: 'yellow',
              wordBreak: 'break-all',
              margin: 20,
              color: 'black',
              padding: 6,
              borderRadius: 20,
            }}
          >
            {link}
          </p>
          <Button
            onClick={() => {
              copytext(link);
              toast({
                title: 'Message',
                description: 'Link Copied',
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
              });
            }}
          >
            Copy Text
          </Button>
        </VStack>
      </VStack>
    </PageLayout>
  );
};

export default FileUpload;
