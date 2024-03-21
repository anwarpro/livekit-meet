import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { encodePassphrase, generateRoomId, randomString } from '../lib/client-utils';
import styles from '../styles/Home.module.css';
import authService from '../service/auth/authService';
import RootLayout from '../components/layouts/RootLayout';
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps<{ tabIndex: number }> = async ({
  query,
  res,
}) => {
  res.setHeader('Cache-Control', 'public, max-age=7200');
  const tabIndex = query.tab === 'custom' ? 1 : 0;
  return { props: { tabIndex } };
};

const Home = () => {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

  const startMeeting = () => {
    if (e2ee) {
      router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(`/rooms/${generateRoomId()}`);
    }
  };

  const navigateUser = () => {
    if (
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'stage'
    ) {
      window.location.href = 'https://jsdude.com/login?ref=meetify';
      return;
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
      window.location.href = 'https://web.programming-hero.com/login?ref=meetify';
      return;
    } else {
      console.log('No environment found');
    }
  };

  useEffect(() => {
    let mounted = true;
    const savedToken = sessionStorage.getItem('jwt-token');
    const checkCookie = async () => {
      try {
        await authService.verifyCookie().then((res) => {
          if (!mounted) return;
          if (res.data.success) {
            sessionStorage.setItem('jwt-token', res.data.token);
          } else {
            // navigateUser();
          }
        });
      } catch (error) {
        // navigateUser();
      }
    };

    if (savedToken === null) {
      checkCookie();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className={styles.main} data-lk-theme="default">
      <div className="header">
        <h1>
          <Image
            src="https://web.programming-hero.com/home/ph_logo.svg"
            width={32}
            height={32}
            alt="PH Meet"
          />
          PH Meet
        </h1>
        <h2>
          Conference app hosted by{' '}
          <a href="https://www.programming-hero.com" rel="noopener">
            Programming Hero
          </a>
        </h2>
      </div>
      <div className={styles.tabContent}>
        <p style={{ margin: 0 }}>Try PH Meet for free with our live demo project.</p>
        <button style={{ marginTop: '1rem' }} className="lk-button" onClick={startMeeting}>
          Start Meeting
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <input
              id="use-e2ee"
              type="checkbox"
              checked={e2ee}
              onChange={(ev) => setE2ee(ev.target.checked)}
            ></input>
            <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
          </div>
          {e2ee && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
              <label htmlFor="passphrase">Passphrase</label>
              <input
                id="passphrase"
                type="password"
                value={sharedPassphrase}
                onChange={(ev) => setSharedPassphrase(ev.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
