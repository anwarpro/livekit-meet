import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from '../styles/Home.module.css';

import Image from 'next/image';

const Home = () => {
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
    </main>
  );
};

export default Home;
