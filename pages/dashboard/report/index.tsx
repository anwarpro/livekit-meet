import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import meetService from '../../../service/meet/meetService';
import { useDispatch } from 'react-redux';
import { setPreviousEventStore } from '../../../lib/Slicers/previousEventSlice';
import { IMeet } from '../../../types/meet';
import { useRouter } from 'next/router';
import ScheduleEvent from '../../../components/schedule/ScheduleEvent';

const ReportManagement = () => {
  const [previousEvent, setPreviousEvent] = useState([]);

  const dispatch = useDispatch();
  const fetchData = () => {
    meetService
      .previousSchedule()
      .then((res: any) => {
        console.log(res.data);
        setPreviousEvent(res?.data?.data);
        dispatch(setPreviousEventStore(res?.data?.data));
      })
      .catch((err) => console.log(err));
  };
  useEffect(()=> {
    fetchData();
  },[]);
  return (
    <div className="schedule-meet-component ">
      <div className="row mt-5 justify-content-center">
        
        <div className="col-md-8">
          <p className="sub-title">Upcoming...</p>
          <p className="sub-title">Previous Total Schedule: {previousEvent.length}</p>
          
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;

ReportManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
