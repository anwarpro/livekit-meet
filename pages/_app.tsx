import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import { DefaultSeo } from 'next-seo';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="PH Meet | Conference app hosted by Programming Hero"
        titleTemplate="%s"
        defaultTitle="PH Meet | Conference app hosted by Programming Hero"
        description="PH meet is hosted for internal vidoe conferences"
        twitter={{
          handle: '@programminghero',
          site: '@programminghero',
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url: 'https://meet.programming-hero.com',
          images: [
            {
              url: 'https://meet.livekit.io/images/livekit-meet-open-graph.png',
              width: 2000,
              height: 1000,
              type: 'image/png',
            },
          ],
          site_name: 'PH Meet',
        }}
        additionalMetaTags={[
          {
            property: 'theme-color',
            content: '#070707',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'apple-touch-icon',
            href: '/images/livekit-apple-touch.png',
            sizes: '180x180',
          },
          {
            rel: 'mask-icon',
            href: '/images/livekit-safari-pinned-tab.svg',
            color: '#070707',
          },
        ]}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
