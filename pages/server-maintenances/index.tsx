import { Box } from '@mui/material';
import { useEffect } from 'react';
import authService from '../../service/auth/authService';
import { useRouter } from 'next/router';

const ServerMaintenance = () => {
  const router = useRouter();
  useEffect(() => {
    authService
      .checkServerHealth()
      .then((res) => {
        router.push('/');
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Meetify is currently down for maintenance</h1>
    </Box>
  );
};

export default ServerMaintenance;
