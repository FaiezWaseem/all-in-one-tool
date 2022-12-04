import SimpleSidebar from '@/components/Sidebar';
import { Container, ContainerProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { ReactNode } from 'react';

type PageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};
const MotionContainer = motion<ContainerProps>(Container);

const PageLayout = ({ title, description, children }: PageProps) => {
  return (
    <>
      <NextSeo
        title={title + ' | all in One Tool'}
        description={description}
        twitter={{
          cardType: 'faiezwaseem',
          handle: '@faiezwaseem',
        }}
        openGraph={{
          url: 'https://faiezwasee.live',
          title: title + ' | All in One Tool',
          description: description,
          locale: 'en_US',
          images: [
            {
              url: 'https://www.faiezwaseem.live/static/images/profile.png',
              width: 1200,
              height: 630,
              alt: 'All in One Tool ',
              type: 'image/png',
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: 'https://www.faiezwaseem.live/static/images/profile.png',
          },
        ]}
      />
      <SimpleSidebar>{children}</SimpleSidebar>
    </>
  );
};

export default PageLayout;
