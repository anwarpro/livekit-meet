import React from 'react';
import Image from 'next/image';

const Home = () => {
  return (
    <main>
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
    </main>
  );
};

export default Home;
