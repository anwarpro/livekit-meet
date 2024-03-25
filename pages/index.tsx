import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { encodePassphrase, generateRoomId, randomString } from '../lib/client-utils';
import styles from '../styles/Home.module.css';
import authService from '../service/auth/authService';
import RootLayout from '../components/layouts/RootLayout';
import Image from 'next/image';
import { setToken, setUserData } from '../lib/Slicers/authSlice';
import { useAppDispatch, useAppSelector } from '../types/common';
import SkeletonRoot from '../components/elements/skeleton-root';
import Error from '../components/elements/error';

const Home = () => {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);
  const [error, setError] = useState(false);

  const startMeeting = () => {
    router.push(`/rooms/${generateRoomId()}`);
  };

  const deleteAllCookies = async (): Promise<boolean> => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return true;
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
            setError(false);
            getUserDetails();
          } else {
            // navigateUser();
          }
        });
      } catch (error) {
        // navigateUser();
      }
    };

    const getUserDetails = async (hasOldToken?: boolean) => {
      try {
        const user: any = await authService.getUser(hasOldToken);
        if (user.data.user._id) {
          sessionStorage.setItem('jwt-token', `Bearer ${user.data.token}`);
          dispatch(setToken(user.data.token));
          dispatch(setUserData({ ...user.data.user }));
        }
      } catch (error) {
        // sessionStorage.clear();
        // await deleteAllCookies();
        await checkCookie();
      }
    };

    if (savedToken && savedToken !== null) {
      getUserDetails(false);
    } else {
      checkCookie();
    }

    return () => {
      mounted = false;
    };
  }, []);

  console.log('calling');

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
        </div>
      </div>
    </main>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
