import type { AppProps } from 'next/app';
import { useEffect, type ReactElement, type ReactNode } from 'react';
import type { NextPage } from 'next';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import { DefaultSeo } from 'next-seo';
import { Provider } from 'react-redux';
import store from '../lib/store';
import RootLayout from '../components/layouts/RootLayout';
import '../styles/scss/main.scss';
import Script from 'next/script';
import { useRouter } from 'next/router';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const { pathname } = useRouter();

  //custom theme color set
  useEffect(() => {
    const body = document.getElementsByTagName('BODY')[0];
    if (body && pathname.includes('dashboard')) {
      // @ts-ignore
      body.style.background = '#F5F6FA';
    }
  }, [pathname]);
  //end

  return getLayout(
    <Provider store={store}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@100..900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      ></link>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      />
      <DefaultSeo
        title="Meetify Meet | Conference app hosted by Programming Hero"
        titleTemplate="%s"
        defaultTitle="Meetify Meet | Video calls and meetings for everyone"
        description="Meetify meet provides secure, easy-to-use video calls and meetings
        for everyone, on any device."
        twitter={{
          handle: 'Programming Hero',
          site: 'Programming Hero',
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url: 'https://meet.programming-hero.com',
          images: [
            {
              url: 'https://jsdude.com/home/thumbnail.png',
              width: 2000,
              height: 1000,
              type: 'image/png',
            },
          ],
          site_name: 'Meetify meet',
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
