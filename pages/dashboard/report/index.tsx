import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import meetService from '../../../service/meet/meetService';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import AttendanceTable from '../../../components/reports/AttendanceTable';
import attendanceService from '../../../service/attendance/attendanceService';
import EventsTable from '../../../components/reports/EventsTable';
const fields = [
  { id: 'identity', label: 'Email' },
  { id: 'participant_joined_count', label: 'Join Count' },
  { id: 'participant_left_count', label: 'Left Count' },
  { id: 'total_duration', label: 'Active time' },
  { id: 'participant_first_joined_time', label: 'Joining time' },
  { id: 'action', label: 'Action' },
];
const eventsFields = [
  { id: 'title', label: 'Event Name' },
  { id: 'hostName', label: 'Host Name' },
  { id: 'startTime', label: 'Start Time' },
  { id: 'endTime', label: 'End Time' },
  { id: 'duration', label: 'Active Time' },
  { id: 'totalInvite', label: 'Total Invitation' },
  { id: 'uniqueAttendees', label: 'Join Participant' },
  { id: 'action', label: 'Action' },
];
const ReportManagement = () => {
  const [previousEvent, setPreviousEvent] = useState([]);
  const [meetId, setMeetId] = useState<string>('');
  const [atttendance, setAttendance] = useState([]);

  const handleChangeEvent = (e: any) => {
    setMeetId(e.target.value);
  };

  const fetchData = () => {
    attendanceService
      .getAttendanceReport()
      .then((res: any) => {
        console.log(res.data);
        setPreviousEvent(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchAttendanceData = () => {
    attendanceService
      .getAttendance(meetId)
      .then((res: any) => {
        setAttendance(res?.data?.data);
      })
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

  return (
    <div className="schedule-meet-component ">
      <Box>
        <p>Please Select Event</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          size="small"
          hiddenLabel
          onChange={(e) => handleChangeEvent(e)}
          sx={{ width: '30%', mb: 3 }}
          value={meetId}
        >
          {previousEvent?.map((event: any) => (
            <MenuItem key={event._id} value={event.meetId}>
              {event.title}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <AttendanceTable fields={fields} items={atttendance} fetchData={fetchData} />
      <EventsTable fields={eventsFields} items={previousEvent} fetchData={fetchData} />
    </div>
  );
};

export default ReportManagement;

ReportManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
