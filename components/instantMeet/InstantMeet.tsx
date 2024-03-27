import { Box, Button } from '@mui/material';
import React from 'react';
import meetService from '../../service/meet/meetService';
import { useAppDispatch } from '../../types/common';
import { useRouter } from 'next/router';
import { setRoom } from '../../lib/Slicers/meetSlice';

const InstantMeet = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleInstantMeet = () => {
    meetService
      .getInstantMeet()
      .then((res: any) => {
        dispatch(setRoom(res?.data?.data));
        router.push(`/rooms/${res?.data?.data?.roomId}`);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  return (
    <div>
      <Box>
        <p>Create instant meeting</p>
        <Button onClick={() => handleInstantMeet()} variant="contained">
          create new meeting
        </Button>
      </Box>
    </div>
  );
};

export default InstantMeet;
