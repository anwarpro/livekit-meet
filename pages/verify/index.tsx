import React, { useState } from 'react';
import { useRouter } from 'next/router';
import userService from '../../service/user/userService';

const Verify = () => {
  const navigation = useRouter();
  const [email, setEmail] = useState<string>("");
  const handleChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handleVerify = (email: string) => {
    userService
      .getVerificationManualUserByEmail(email)
      .then((res) => navigation.push(`/verify/${email}`))
      .catch((err) => console.log('err', err));
  };
  return (
    <div>
      <input name="email" onChange={(e) => handleChange(e)} type="email" />
      <button onClick={() => handleVerify(email)}>verify me</button>
    </div>
  );
};

export default Verify;
