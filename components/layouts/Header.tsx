'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../assets/image/logo.png';
import placeholder from '../assets/icons/placeholder.png';
import { useAppSelector } from '../../types/common';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { userData } = useAppSelector((state) => state.auth);

  return (
    <div className="header-component d-flex justify-content-between">
      <Image src={logo} alt="logo" width={300} height={70} />
      {isClient && (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="m-0 name-text">{userData.fullName}</p>
            <p className="m-0 role-text text-end">{userData.role}</p>
          </div>
          <div className="ms-3">
            <Image src={placeholder} alt="logo" width={48} height={48} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
