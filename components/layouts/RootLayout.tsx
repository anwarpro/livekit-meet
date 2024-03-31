import { ReactElement, useEffect } from 'react';
import Footer from './Footer';
import authService from '../../service/auth/authService';
import { setToken, setUserData } from '../../lib/Slicers/authSlice';
import { useAppDispatch, useAppSelector } from '../../types/common';
import { useRouter } from 'next/router';
import Header from './Header';
import DashboardLayout from './DashboardLayout';

type Props = {
  children: string | JSX.Element | JSX.Element[];
};
const RootLayout = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.auth);

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
          sessionStorage.setItem('jwt-token', `"Bearer ${user.data.token}"`);
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
      getUserDetails(true);
    } else {
      checkCookie();
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (router.pathname.includes('/dashboard') && userData.role !== 'admin') {
      router.push('/');
    }
  }, [router, userData]);

  return (
    <main>
      {/* {router?.pathname?.includes('/dashboard') && <Header />} */}
      {children}
      {/* {!router?.pathname?.includes('/dashboard') && <Footer />} */}
    </main>
  );
};

export default RootLayout;
