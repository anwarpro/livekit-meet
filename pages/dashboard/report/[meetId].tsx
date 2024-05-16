import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import attendanceService from '../../../service/attendance/attendanceService';
import AttendanceTable from '../../../components/reports/AttendanceTable';
import Image from 'next/image';
import userIcon from '../../../components/assets/icons/user-colored.png';

const fields = [
  { id: 'identity', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'participant_joined_count', label: 'Join Count' },
  { id: 'participant_left_count', label: 'Left Count' },
  { id: 'participant_active_time', label: 'Active time' },
  { id: 'participant_first_joined_time', label: 'First join time' },
  { id: 'action', label: 'Action' },
];

const AttendanceReport = () => {
  const router = useRouter();
  const { meetId } = router.query as { meetId: string };
  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const fetchAttendanceData = () => {
    attendanceService
      .getAttendance({ meetId, page, limit, search: searchText })
      .then((res: any) => {
        setAttendance(res?.data?.data);
        setTotal(res?.data?.totalCount);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    if (meetId !== undefined) {
      fetchAttendanceData();
    }
  }, [meetId, page, limit, searchText]);

  return (
    <div className="schedule-meet-component ">
      <div className="title d-flex align-items-center pb-4">
        <Image src={userIcon} width="30" height="30" alt="user" />
        <h1>Joined Participants List</h1>
      </div>
      <AttendanceTable
        fields={fields}
        items={attendance}
        fetchData={fetchAttendanceData}
        meetId={meetId}
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

export default AttendanceReport;

AttendanceReport.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
