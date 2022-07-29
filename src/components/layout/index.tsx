import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Box >{children}</Box>
    </>
  );
};

export default Layout;
