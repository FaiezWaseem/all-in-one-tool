import firebase from '@/backend/firebase';
import styles from '@/styles/Notecard.module.css';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function CodeCard({ item, ip }) {
  const [noteTitle, setNoteTitle] = useState<string>(item.title);
  const [noteContent, setNoteContent] = useState<string>(item.content);
  const [content, setcontent] = useState<string>(item.content);
  const [title, setTitle] = useState<string>(item.title);
  const [bgColor] = useState<string>(getRandomColor());

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  function getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function onUpdate() {
    firebase.update(`notes/${ip}/${item.key}`, {
      date: new Date().toUTCString(),
      title: title,
      content: content,
    });
    setNoteTitle(title);
    setNoteContent(content);
    onClose();
  }

  function onDelete() {
    let node = finalRef.current.remove();
    console.log(node);
    firebase.remove(`notes/${ip}/${item.key}`, (res) => onClose());
  }

  return (
    <div ref={finalRef}>
      <div
        className={styles.note_common}
        style={{ width: 260, height: 260, backgroundColor: bgColor }}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: '99',
            top: '-30px',
            left: '90px',
          }}
        >
          <img src='assets/images/pin.png' alt='' />
        </div>
        <div style={{ position: 'absolute', top: '-15px', right: '-15px' }}>
          <a>
            <img
              src='assets/images/delete.png'
              alt=''
              title='delete note'
              onClick={onDelete}
            />
          </a>
        </div>
        <h2 style={{ color: 'yellow' }}>
          {noteTitle.length === 0
            ? 'No Title here start editting...'
            : noteTitle}
        </h2>
        <p
          style={{
            height: '190px',
          }}
          onClick={onOpen}
          dangerouslySetInnerHTML={{
            __html:
              noteContent.length === 0
                ? '<p>No content start writing ..<p>'
                : parseSyntax(noteContent),
          }}
        ></p>
      </div>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder='add title here...'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>content</FormLabel>
              <Textarea
                placeholder='add content here'
                value={content}
                onChange={(e) => {
                  setcontent(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onUpdate}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function parseSyntax(data) {
  data = data.split('\n').filter((item) => item.length);
  var output: string = '';
  // console.log(data);

  data.forEach((item) => {
    // check for heading
    if (item[0] == '#') {
      let hCount = 0;
      let i = 0;
      while (item[i] == '#') {
        hCount++;
        i++;
      }
      let tag = `h${hCount}`;
      output += `<${tag} style="line-height:3ch">${item.slice(
        hCount,
        item.length
      )}</${tag}>`;
    }
    //checking for image format
    else if (item[0] == '!' && item[1] == '[') {
      let seperator;

      for (let i = 0; i <= item.length; i++) {
        if (
          item[i] == ']' &&
          item[i + 1] == '(' &&
          item[item.length - 1] == ')'
        ) {
          seperator = i;
        }
      }

      let alt = item.slice(2, seperator);
      let src = item.slice(seperator + 2, item.length - 1);
      if (alt.includes('.mp4')) {
        output += `
              <video src="${src}" alt="${alt}" controls width="500px" height="300px" class="article-image">
              `;
      } else if (alt.includes('code')) {
        output += `
              <p style=" background: #f4f4f4;
              border: 1px solid #ddd;
              border-left: 3px solid #f36d33;
              color: #666;
              page-break-inside: avoid;
              font-family: monospace;
              font-size: 15px;
              line-height: 1.6;
              margin-bottom: 1.6em;
              max-width: 100%;
              overflow: auto;
              padding: 1em 1.5em;
              display: block;
              word-wrap: break-word;
              width :90%;
              " title="${alt}">
              ${src}
              </p>
              
              `;
      } else if (alt.includes('link')) {
        output += `<p style="color: blue" >${src}</p>                
              `;
      } else {
        output += `
          <img src="${src}" alt="${alt}" class="article-image">
          `;
      }
    } else {
      output += `<p>${item}</p>`;
    }
  });
  return output;
}
