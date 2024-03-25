import React, { ReactElement, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Box, Button, FormControl } from '@mui/material';
import meetService from '../../../service/meet/meetService';
import { useAppDispatch } from '../../../types/common';
import { setRoom } from '../../../lib/Slicers/meetSlice';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import moment from 'moment';
import readXlsxFile from 'read-excel-file';

type Inputs = {
  title: string;
  startTime: string;
  endTime: string;
  internalParticipantList: string[];
  externalParticipantList: string[];
  isScheduled: boolean;
};

const ScheduleManagement = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [internalParticipantList, setInternalParticipantList] = useState<string[]>([]);

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.internalParticipantList = internalParticipantList;
    data.externalParticipantList = ['israfil@programming-hero.com'];
    data.isScheduled = true;
    console.log('🚀 ~ ScheduleManagement ~ data:', data);
    meetService
      .addScheduleMeeting(data)
      .then((res) => {
        console.log('res ==>', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // console.log(watch('example')); // watch input value by passing the name of it

  const handleExcelSheet = (event: any) => {
    const schema = {
      email: {
        prop: 'email',
        type: String,
        required: true,
      },
    };

    readXlsxFile(event.target.files[0], { schema }).then((rows) => {
      let tempUserList: any[] = [];
      rows.rows.forEach((element) => {
        tempUserList.push({
          ...element,
        });
      });
      let arrayOfString = tempUserList.map((element) => element.email);
      setInternalParticipantList(arrayOfString);
    });
  };

  return (
    <div>
      <h1>Meeting management</h1>
      <Box>
        <p>Create instant messaging</p>
        <Button onClick={() => handleInstantMeet()} variant="contained">
          create new meeting
        </Button>
      </Box>
      <Box sx={{ mt: 5 }}>
        <p>Create schedule meeting</p>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Box sx={{ pb: 3 }}>
                <input {...register('title', { required: true })} />
                {errors.title && <span>Title is required</span>}
              </Box>
              <Box sx={{ pb: 3 }}>
                <input type="datetime-local" {...register('startTime', { required: true })} />
                {errors.startTime && <span>startTime is required</span>}
              </Box>
              <Box sx={{ pb: 3 }}>
                <input type="datetime-local" {...register('endTime', { required: true })} />
                {errors.endTime && <span>endTime is required</span>}
              </Box>
            </FormControl>
            <input type="submit" />
          </form>
          <Box sx={{ pb: 3 }}>
            <input
              onChange={(e) => handleExcelSheet(e)}
              type="file"
              name="internalParticipantList"
            />
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default ScheduleManagement;

ScheduleManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
