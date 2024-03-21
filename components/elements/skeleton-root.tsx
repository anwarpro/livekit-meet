import Link from 'next/link';
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
    <>
      <header className='bg-primary-800 sticky top-0 z-20 shadow-sm dark:shadow-xl py-3 lg:py-0 h-[60px] border-0 border-b border-primary-500'>
        <div className='container flex gap-5 justify-between items-center text-gray-800 dark:text-gray-200 h-full'>
          <Link href='/' className='flex items-center select-none'>
            <h1 className='font-bold font-rubik text-2xl uppercase text-colorBase text-transparent bg-clip-text bg-gradient-to-r from-[#E855DE] to-[#5400EE]'>
              <span className='whitespace-nowrap'>meetify</span>
              <p className='text-[10px] font-light capitalize -mt-4 text-slate-600 dark:text-gray-300 animate-pulse'>
                By Programming Hero
              </p>
            </h1>
          </Link>
          <div className='grid grid-cols-4 gap-4 animate-pulse items-center'>
            <div className='h-4 bg-primary-500 w-[100px] rounded-xl invisible md:visible'></div>
            <div className='h-4 bg-primary-500 w-[100px] rounded-xl invisible md:visible'></div>
            <div className='h-4 bg-primary-500 w-[100px] rounded-xl invisible md:visible'></div>
            <div className='h-10 w-10 bg-primary-500 rounded-full'></div>
          </div>
        </div>
      </header>
      <div className='shadow-sm'>
        <div className='container h-[50px] flex gap-6 items-center animate-pulse'>
          <div className='h-4 bg-primary-500 w-[100px] rounded-xl'></div>
          <div className='h-4 bg-primary-500 w-[100px] rounded-xl'></div>
          <div className='h-4 bg-primary-500 w-[100px] rounded-xl'></div>
        </div>
      </div>
      <div className='container grid grid-cols-12 gap-6 mt-6'>
        <div className='col-span-12 md:col-span-7 lg:col-span-8'>
          <div className='border rounded-lg h-[160px] bg-gray-100 border-gray-200 animate-pulse p-4 mb-5 dark:bg-primary-500 dark:border-primary-500'>
            <div className='flex gap-3 items-center'>
              <div className='w-[52px] h-[48px] bg-primary-500 rounded-full dark:bg-primary-600'></div>
              <div className='w-full h-12 bg-primary-500 rounded-full select-none dark:bg-primary-600'></div>
            </div>
            <div className='mt-10 flex items-center justify-between'>
              <div className='h-8 bg-primary-500 w-[70px] rounded-xl dark:bg-primary-600'></div>
              <div className='h-10 bg-primary-500 w-[100px] rounded-xl dark:bg-primary-600'></div>
            </div>
          </div>
          <div className='border rounded-lg h-[250px] bg-gray-100 border-gray-200 p-4 flex items-center justify-center dark:bg-primary-500 dark:border-primary-500'>
            <div className='text-center'>
              <h1 className='text-lg text-gray-400 animate-pulse font-medium'>
                Authenticating User
              </h1>
              <p className='text-xs text-gray-300 dark:text-primary-300'>
                Please wait{loadingDots}
              </p>
            </div>
          </div>
        </div>
        <div className='col-span-12 md:col-span-5 lg:col-span-4'>
          <div className='border rounded-lg h-[250px] bg-gray-100 border-gray-200 animate-pulse p-4 dark:bg-primary-500 dark:border-primary-500'>
            <div className='h-10 bg-gray-200 rounded-lg my-2 dark:bg-primary-600'></div>
            <div className='h-10 bg-gray-200 rounded-lg my-2 w-3/4 dark:bg-primary-600'></div>
            <div className='h-10 bg-gray-200 rounded-lg my-2 dark:bg-primary-600'></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkeletonRoot;
