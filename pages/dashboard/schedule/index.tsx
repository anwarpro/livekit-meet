import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import meetService from '../../../service/meet/meetService';
import ScheduleMeet from '../../../components/schedule/ScheduleMeet';
import ScheduleEvent from '../../../components/schedule/ScheduleEvent';
import Image from 'next/image';
import userIcon from '../../../components/assets/icons/user-colored.png';
import plusIcon from '../../../components/assets/icons/plus-dark.png';
import infoIcon from '../../../components/assets/icons/info.png';
import { setEventStore } from '../../../lib/Slicers/eventSlice';
import { useDispatch } from 'react-redux';

const ScheduleManagement = () => {
  const [event, setEvent] = useState([]);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<{ edit: boolean }>({ edit: false });
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  const handleOpenModal = () => {
    setOpenModal({ edit: true });
  };

  const fetchData = () => {
    meetService
      .upcomingSchedule()
      .then((res: any) => {
        setEvent(res?.data?.data);
        dispatch(setEventStore(res?.data?.data));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // @ts-ignore
    setSelectedEvent(event[0]?._id);
  }, [event]);

  return (
    <div className="schedule-meet-component">
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="title d-flex align-items-center">
          <Image src={userIcon} width="30" height="30" alt="user" />
          <h1>Schedule Management</h1>
        </div>
        <div>
          <button
            onClick={() => handleOpenModal()}
            className="create-schedule-btn d-flex align-items-center"
          >
            <Image src={plusIcon} width="30" height="30" alt="user" />
            <span className="ps-2">Create Schedule</span>
          </button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-7">
          <p className="sub-title d-flex justify-content-start align-items-center mb-4">
            <Image src={infoIcon} width="24" height="24" alt="info" />{' '}
            <span className="ps-2">Upcoming Scheduled</span>
          </p>
          <ScheduleMeet
            fetchData={fetchData}
            openModal={openModal}
            event={event}
            setSelectedEvent={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        </div>
        <div className="col-lg-5">
          <p className="sub-title d-flex justify-content-start align-items-center mb-4">
            {' '}
            <Image src={infoIcon} width="24" height="24" alt="info" />{' '}
            <span className="ps-2">Joining Info</span>
          </p>
          <ScheduleEvent event={event} fetchData={fetchData} selectedEvent={selectedEvent} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;

ScheduleManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
