import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import '../styles/globals.css';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import { DefaultSeo } from 'next-seo';
import { Provider } from 'react-redux';
import store from '../lib/store';
import RootLayout from '../components/layouts/RootLayout';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <Provider store={store}>
      <DefaultSeo
        title="LiveKit Meet | Conference app build with LiveKit Open Source"
        titleTemplate="%s"
        defaultTitle="LiveKit Meet | Conference app build with LiveKit open source"
        description="LiveKit is an open source WebRTC project that gives you everything needed to build scalable and real-time audio and/or video experiences in your applications."
        twitter={{
          handle: '@livekitted',
          site: '@livekitted',
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url: 'https://meet.livekit.io',
          images: [
            {
              url: 'https://meet.livekit.io/images/livekit-meet-open-graph.png',
              width: 2000,
              height: 1000,
              type: 'image/png',
            },
          ],
          site_name: 'LiveKit Meet',
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
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Provider>,
  );
}
