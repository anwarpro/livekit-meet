import { useEffect, useState } from 'react';

const SkeletonRoot = () => {
  const [loadingDots, setLoadingDots] = useState('.');

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
          <h1 className="">Authenticating User</h1>
          <p className="">Please wait{loadingDots}</p>
        </div>
      </div>
    </div>
  );
};

export default SkeletonRoot;
