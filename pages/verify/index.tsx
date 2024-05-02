import React, { useState } from 'react';
import { useRouter } from 'next/router';
import userService from '../../service/user/userService';
import { Box, Button, TextField, Typography } from '@mui/material';
import swal from 'sweetalert';

const Verify = () => {
  const navigation = useRouter();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const handleChange = (e: any) => {
    setEmail(e.target.value);
    const isValid = isValidEmail(email);
    if (!isValid) {
      setError(true);
    } else {
      setError(false);
    }
  };
  const handleVerify = (email: string) => {
    const isValid = isValidEmail(email);
    if (isValid) {
      userService
        .getVerificationManualUserByEmail(email)
        .then((res) => navigation.push(`/verify/${email}`))
        .catch((err) => {
          swal('Invalid User', 'User not found', 'error');
        });
    } else {
      setError(true);
    }
  };
  const isValidEmail = (email: string) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
        <Typography variant="h5" gutterBottom>
          Please Use Certified Email
        </Typography>

        <TextField
          required
          id="outlined-required"
          label="Email Address"
          onChange={(e) => handleChange(e)}
          fullWidth
          error={error}
          sx={{ mt: 2 }}
        />
        <Button
          sx={{ mt: 2, padding: '12px 30px' }}
          onClick={() => handleVerify(email)}
          variant="outlined"
        >
          verify me
        </Button>
      </Box>
    </Box>
  );
};

export default Verify;
