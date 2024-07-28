import { useEffect, useState } from 'react';

const SkeletonRoot = () => {
  const [loadingDots, setLoadingDots] = useState('.');
  const alreadyRedirected = localStorage.getItem('redirection');

  const navigateUser = () => {
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
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length > 2) {
          return '';
        } else {
          return prev + '.';
        }
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          {alreadyRedirected !== 'true' ? (
            <>
              <h1 className="">Authenticating User</h1>
              <p className="">Please wait{loadingDots}</p>
            </>
          ) : (
            <>
              <h1 className="">Oops! Something went wrong</h1>
              <p>Something went wrong there. Try again</p>
              <button className="btn btn-dark" onClick={() => navigateUser()}>
                Login Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkeletonRoot;
