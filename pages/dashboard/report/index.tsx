import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import attendanceService from '../../../service/attendance/attendanceService';
import PreviousMeetListTable from '../../../components/reports/PreviousMeetListTable';
import Image from 'next/image';
import userIcon from '../../../components/assets/icons/user-colored.png';

const eventsFields = [
  { id: 'title', label: 'Meeting Title' },
  { id: 'hostName', label: 'Host Name' },
  { id: 'hostTeam', label: 'Host Team' },
  { id: 'createdAt', label: 'Creation Date' },
  { id: 'startTime', label: 'Start Time' },
  { id: 'endTime', label: 'End Time' },
  { id: 'duration', label: 'Duration' },
  { id: 'totalInvite', label: 'Total Invitation' },
  { id: 'uniqueAttendees', label: 'Join Participant' },
  { id: 'action', label: 'Action' },
];
const ReportManagement = () => {
  const [previousEvent, setPreviousEvent] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const fetchData = () => {
    attendanceService
      .getAttendanceReport(page, limit, searchText)
      .then((res: any) => {
        setPreviousEvent(res?.data?.data);
        setTotal(res?.data?.totalCount);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, searchText]);

  return (
    <div className="schedule-meet-component ">
      <div className="title d-flex align-items-center pb-4">
        <Image src={userIcon} width="30" height="30" alt="user" />
        <h1>Previous Meeting Report</h1>
      </div>
      <PreviousMeetListTable
        fields={eventsFields}
        items={previousEvent}
        fetchData={fetchData}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    </div>
  );
};

export default ReportManagement;

ReportManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
