import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import meetService from '../../../service/meet/meetService';
import { FormControl, MenuItem, Select } from '@mui/material';
import AttendanceTable from '../../../components/reports/AttendanceTable';
import attendanceService from '../../../service/attendance/attendanceService';

const ReportManagement = () => {
  const fields = [
    { id: 'identity', label: 'Email' },

    { id: 'action', label: 'Action' },
  ];
  const [previousEvent, setPreviousEvent] = useState([]);
  console.log('🚀 ~ ReportManagement ~ previousEvent:', previousEvent);
  const [meetId, setMeetId] = useState<string>('');
  console.log('🚀 ~ ReportManagement ~ meetId:', meetId);
  const fetchData = () => {
    meetService
      .previousSchedule()
      .then((res: any) => {
        console.log(res.data);
        setPreviousEvent(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchAttendanceData = () => {
    attendanceService
      .getAttendance(meetId)
      .then((res: any) => console.log('res', res))
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if (meetId !== '') {
      fetchAttendanceData();
    }
  }, [meetId]);

  const handleChangeEvent = (e: any) => {
    setMeetId(e.target.value);
  };

  return (
    <div className="schedule-meet-component ">
      {/* <FormControl sx={{ width: '50%' }}> */}
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        size="small"
        hiddenLabel
        onChange={(e) => handleChangeEvent(e)}
        sx={{ width: '50%', mb: 3 }}
        value={meetId}
      >
        {previousEvent?.map((event: any) => (
          <MenuItem key={event._id} value={event.meetId}>
            {event.title}
          </MenuItem>
        ))}
      </Select>
      {/* </FormControl> */}

      <AttendanceTable fields={fields} items={previousEvent} fetchData={fetchData} />
    </div>
  );
};

export default ReportManagement;

ReportManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
