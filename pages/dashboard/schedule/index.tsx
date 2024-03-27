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
import ScheduleMeet from '../../../components/schedule/ScheduleMeet';
import ScheduleEvent from '../../../components/schedule/ScheduleEvent';
import Image from 'next/image';
import userIcon from '../../../components/assets/icons/user-colored.png';

const event = [
  {
    _id: 1,
    title: 'Javascript Fundamental',
    roomLink: 'http://localhost:7859/rooms/65ffcc4e1a62d8fae1bea6eb',
    startDate: new Date(),
    endDate: new Date(),
    userInfo: {
      fullName: 'Awlad Hossain',
      team: 'web',
    },
  },
  {
    _id: 2,
    title: 'React Fundamental',
    roomLink: 'http://localhost:7859/rooms/65ffcc4e1a62d8fae1bea6eb',
    startDate: new Date(),
    endDate: new Date(),
    userInfo: {
      fullName: 'Awlad Hossain',
      team: 'web',
    },
  },
];

const ScheduleManagement = () => {
  return (
    <div className="schedule-meet-component">
      <div className='title d-flex align-items-center mt-3'>
        <Image src={userIcon} width="30" height="30" alt="user" />
        <h1>Schedule Management</h1>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <p className='sub-title'>Create Schedule</p>
          <ScheduleMeet />
        </div>
        <div className="col-md-8">
          <p className='sub-title'>Upcoming Schedule</p>
          <ScheduleEvent event={event} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;

ScheduleManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
