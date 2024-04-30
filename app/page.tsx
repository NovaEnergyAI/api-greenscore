import '@root/global.scss';

import Bluesky from '@system/svg/social/Bluesky';
import DefaultLayout from '@components/DefaultLayout';
import ListItem from '@components/ListItem';
import Package from '@root/package.json';
import Content from '@system/layouts/Content';
import SectionFullHeight from '@system/sections/SectionFullHeight';
import { H1, Lead } from '@system/typography';
import Button from '@root/system/Button';

export async function generateMetadata({ params, searchParams }) {
  const title = Package.name;
  const description = Package.description;
  const url = 'https://wireframes.internet.dev';
  const handle = '@internetxstudio';

  return {
    metadataBase: new URL('https://wireframes.internet.dev'),
    title,
    description,
    url,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: 'https://intdev-global.s3.us-west-2.amazonaws.com/template-twitter-summary-large.png',
          width: 1200,
          height: 628,
        },
      ],
    },
    twitter: {
      title,
      description,
      url,
      handle,
      card: 'summary_large_image',
      images: ['https://intdev-global.s3.us-west-2.amazonaws.com/template-twitter-summary-large.png'],
    },
    icons: {
      icon: '/favicon-32x32.png',
      shortcut: '/favicon-16x16.png',
      apple: [{ url: '/apple-touch-icon.png' }, { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png',
        },
      ],
    },
  };
}

export default async function Page(props) {
  return (

    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
      <div>
      <SectionFullHeight>
        <Content>
          <H1>ceramic starter</H1>
          <Lead style={{ marginTop: `var(--type-scale-5)` }}>
            An example using ComposeDB & attestion services.
          </Lead>
          <Button/>
        </Content>
      </SectionFullHeight>
      </div>
    </DefaultLayout>
  );
}
