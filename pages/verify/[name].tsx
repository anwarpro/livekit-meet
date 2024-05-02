import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import userService from '../../service/user/userService';
import { Box, Button, TextField, Typography } from '@mui/material';
import swal from 'sweetalert';

const VerifyCode: NextPage = () => {
  const router = useRouter();
  const { name } = router.query as { name: string };
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: any) => {
    setOtp(e.target.value);
    const isValid = isValidOTP(e.target.value);
    if (!isValid) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleVerify = (otp: string) => {
    const isValid = isValidOTP(otp);
    if (isValid) {
      userService
        .verifyManualUser({ email: name, otp })
        .then((res: any) => {
          sessionStorage.setItem('jwt-token', `${res?.data?.token}`);
          router.push('/');
        })
        .catch((err) => {
          console.log('err', err);
          swal('Validation Failed', err?.response?.data?.message, 'error');
        });
    } else {
      setError(true);
    }
  };

  const isValidOTP = (otp: string) => {
    const emailRegex = /^\d{6}$/;
    return emailRegex.test(otp);
  };

  return (
    <Box
      sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Box sx={{ p: 5, boxShadow: '1px 1px 5px 1px grey', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Please verify using the OTP that was sent to your email ({name})
        </Typography>

        <TextField
          required
          id="outlined-required"
          label="6 digit OTP"
          onChange={(e) => handleChange(e)}
          fullWidth
          error={error}
          sx={{ mt: 2 }}
        />
        <Button
          sx={{ mt: 2, padding: '12px 30px' }}
          onClick={() => handleVerify(otp)}
          variant="outlined"
        >
          verify me
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyCode;
