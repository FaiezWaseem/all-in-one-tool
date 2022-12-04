import ThemeButton from '@/components/theme-button/';
import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode, ReactText, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import {
  FaCode,
  FaDownload,
  FaFileImage,
  FaFileUpload,
  FaNotesMedical,
  FaPlane,
} from 'react-icons/fa';
import { FiLink, FiMenu } from 'react-icons/fi';

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Airforshare', icon: FaPlane, link: '/' },
  { name: 'file Upload', icon: FaFileUpload, link: '/fileupload' },
  { name: 'Image Upload', icon: FaFileImage, link: '/imageupload' },
  { name: 'Notes', icon: FaNotesMedical, link: '/notes' },
  { name: 'Code', icon: FaCode, link: '/codes' },
  { name: 'links', icon: FiLink, link: '/links' },
  { name: 'Download App', icon: FaDownload, link: '/downloadApp' },
];

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visites, setVisits] = useState(0);

  useEffect(() => {
    fetch('https://api.countapi.xyz/hit/aoit-ashy.vercel.app')
      .then((res) => res.json())
      .then((res) => setVisits(res.value));
  }, []);
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        visites={visites}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} visites={visites} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav
        display={{ base: 'flex', md: 'none' }}
        onOpen={onOpen}
        visites={visites}
      />
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  visites: number | string;
}

const SidebarContent = ({ onClose, visites, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
          AIOT
        </Text>
        <Tooltip label='Total page visit count'>
          <Text
            fontSize='2xl'
            fontFamily='monospace'
            fontWeight='bold'
            _hover={{
              cursor: 'pointer',
            }}
          >
            {visites}
          </Text>
        </Tooltip>
        <ThemeButton />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  link: string;
}
const NavItem = ({ icon, link, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href={link}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  visites: number | string;
}
const MobileNav = ({ onOpen, visites, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height='20'
      alignItems='center'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent='flex-start'
      {...rest}
    >
      <IconButton
        variant='outline'
        onClick={onOpen}
        aria-label='open menu'
        icon={<FiMenu />}
      />

      <Text fontSize='2xl' ml='8' fontFamily='monospace' fontWeight='bold'>
        AIOT
      </Text>
    </Flex>
  );
};
