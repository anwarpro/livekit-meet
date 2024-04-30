import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import userService from '../../service/user/userService';

const VerifyCode: NextPage = () => {
  const router = useRouter();
  const { name } = router.query as { name: string };
  const [otp, setOtp] = useState<string>('');

  const handleChange = (e: any) => {
    setOtp(e.target.value);
  };

  const handleVerify = (otp: string) => {
    userService
      .verifyManualUser({ email: name, otp })
      .then((res: any) => {
        console.log('res', res?.data?.token);
        sessionStorage.setItem('jwt-token', `${res?.data?.token}`);

        // navigation.push(`/verify/${email}`)
      })
      .catch((err) => console.log('err', err));
  };
  return (
    <div className="p-5">
      <h3>Hi, please verify using the code that was sent to your email({name})</h3>
      <div>
        <input name="email" onChange={(e) => handleChange(e)} type="email" />
        <button onClick={() => handleVerify(otp)}>verify me</button>
      </div>
    </div>
  );
};

export default VerifyCode;
