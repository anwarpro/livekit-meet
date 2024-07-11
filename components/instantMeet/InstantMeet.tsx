import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import meetService from '../../service/meet/meetService';
import { useRouter } from 'next/router';
import { setRoom } from '../../lib/Slicers/meetSlice';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';

const InstantMeet = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleInstantMeet = () => {
    setIsLoading(true);
    meetService
      .getInstantMeet()
      .then((res: any) => {
        router.push(`/rooms/${res?.data?.data?.roomId}`);
        dispatch(setRoom(res?.data?.data));
        if (res?.data?.data?.roomId && router.pathname.includes('/dashboard/instant-meet')) {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        swal('Oops...', err?.response?.data?.message || err?.message, 'error');
        console.log('err', err);
      });
  };
  return (
    <div>
      <Box>
        <Typography fontWeight="500" className="my-3" fontSize="18px">
          Instant Meet
        </Typography>
        <Button
          onClick={() => handleInstantMeet()}
          variant="contained"
          size="large"
          disabled={isLoading}
        >
          {isLoading && router.pathname.includes('/dashboard/instant-meet')
            ? 'redirecting...'
            : 'Create Instant Meet'}
        </Button>
      </Box>
    </div>
  );
};

export default InstantMeet;
