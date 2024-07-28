import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import serverMaintenanceService from '../../service/serverMaintenance/serverMaintenanceService';
import { useRouter } from 'next/router';
import announcementIcon from '../../components/assets/icons/announcement.png';
import Image from 'next/image';
import maintenanceService from '../../service/serverMaintenance/serverMaintenanceService';

const ServerMaintenance = () => {
  const router = useRouter();
  const sm = useMediaQuery(`(min-width:768px)`);
  const [isMeetifyDown, setIsMeetifyDown] = useState(false);
  const [noticeList, setNoticeList] = useState([]);

  const fetchAllNotice = () => {
    maintenanceService
      .allNotice()
      .then((res) => {
        const data = res?.data?.data;
        const activeNotice = data.filter((notice: any) => notice.status);
        setNoticeList(activeNotice);
      })
      .catch((err) => console.log('err', err));
  };

  useEffect(() => {
    fetchAllNotice();
    serverMaintenanceService
      .checkServerHealth()
      .then((res) => {
        router.push('/');
      })
      .catch((err) => {
        setIsMeetifyDown(true);
        console.error(err);
      });
  }, []);

  return (
    <Box
      sx={{
        height: '95vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          backgroundColor: 'rgba(245, 246, 250, 1)',
          width: sm ? '70%' : '100%',
          borderRadius: 8,
          padding: sm ? 10 : 2,
          m: sm ? 5 : 2,
        }}
      >
        <Box
          sx={{
            h1: {
              fontSize: sm ? '32px' : '20px',
              fontWeight: 700,
              lineHeight: '48px',
              textAlign: 'center',
              color: 'rgba(16, 3, 36, 1)',
              m: 0,
              mt: 3,
            },
            p: {
              fontSize: sm ? '26px' : '16px',
              fontWeight: 400,
              lineHeight: '32px',
              textAlign: 'center',
              color: 'rgba(16, 3, 36, 0.6)',
            },
          }}
        >
          <Image src={announcementIcon} width={200} height={200} alt="icon" />
          {isMeetifyDown && <h1>Meetify Under Maintenance</h1>}
          {noticeList?.map((notice: any) => (
            <>
              <h1>{notice?.title}</h1>
              <p>{notice?.description}</p>
            </>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ServerMaintenance;
