import { useEffect, useState } from 'react';
import authService from '../../service/auth/authService';
import { setToken, setUserData } from '../../lib/Slicers/authSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import SkeletonRoot from '../elements/skeleton-root';

type Props = {
  children: string | JSX.Element | JSX.Element[];
};
const RootLayout = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: any) => state.auth);
  const searchParams = useSearchParams();
  const guestToken = searchParams.get('user_t');
  const [isLoading, setIsLoading] = useState(false);

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
    const alreadyRedirected = localStorage.getItem('redirection');
    if (alreadyRedirected !== 'true') {
      if (
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'stage'
      ) {
        window.location.href = 'https://jsdude.com/login?ref=meetify';
        localStorage.setItem('redirection', 'true');
        return;
      } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
        window.location.href = 'https://web.programming-hero.com/login?ref=meetify';
        localStorage.setItem('redirection', 'true');
        return;
      } else {
        console.log('No environment found');
      }
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (guestToken === null) {
        let mounted = true;
        const savedToken = sessionStorage.getItem('jwt-token');
        const checkCookie = async () => {
          try {
            await authService.verifyCookie().then((res) => {
              if (!mounted) return;
              if (res.success) {
                setIsLoading(true);
                getUserDetails(res.token);
              } else {
                setIsLoading(true);
                dispatch(setToken(''));
                dispatch(setUserData({}));
                navigateUser();
              }
            });
          } catch (error) {
            setIsLoading(true);
            dispatch(setToken(''));
            dispatch(setUserData({}));
            navigateUser();
          }
        };

        const getUserDetails = async (token: string, hasOldToken?: boolean) => {
          try {
            const userData: any = await authService.getUser(token, hasOldToken);
            if (userData?.user._id) {
              setIsLoading(false);
              localStorage.setItem('redirection', 'false');
              sessionStorage.setItem('jwt-token', `${userData.token}`);
              dispatch(setToken(userData.token));
              dispatch(setUserData({ ...userData.user }));
            }
          } catch (error) {
            dispatch(setToken(''));
            dispatch(setUserData({}));
            sessionStorage.clear();
            await deleteAllCookies();
            await checkCookie();
            navigateUser();
          }
        };

        if (savedToken && savedToken !== null) {
          getUserDetails(savedToken, true);
        } else {
          checkCookie();
        }
        return () => {
          mounted = false;
        };
      }
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [dispatch, guestToken]);

  useEffect(() => {
    if (userData.role && router.pathname.includes('/dashboard') && userData.role !== 'admin') {
      router.push('/');
    }
  }, [router, userData]);

  if (isLoading) {
    return <SkeletonRoot />;
  }

  return (
    <main>
      {/* {router?.pathname?.includes('/dashboard') && <Header />} */}
      {children}
      {/* {!router?.pathname?.includes('/dashboard') && <Footer />} */}
    </main>
  );
};

export default RootLayout;
