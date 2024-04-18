import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import plusIcon from '../assets/icons/plus.png';
import ScheduleModal from './ScheduleModal';
import SuccessPopUp from './SuccessPopUp';
import moment from 'moment';
import clockIcon from '../assets/icons/clock.png';
import placeholder from '../assets/icons/placeholder.png';
type IProps = {
  fetchData: Dispatch<SetStateAction<void>>;
  openModal: { edit: boolean };
  event: any;
  setSelectedEvent: Dispatch<SetStateAction<string>>;
  selectedEvent: string;
};
const ScheduleMeet = ({ fetchData, openModal, event, setSelectedEvent, selectedEvent }: IProps) => {
  const [successModal, setSuccessModal] = useState<{ edit: boolean }>({ edit: false });

  return (
    <div className="schedule-meet">
      {/* <div onClick={() => handleOpenModal()} className="create-schedule-btn-box">
        <Image src={plusIcon} width={48} height={48} alt="create" />
        <p className="pt-3">Create Schedule</p>
      </div> */}

      <div className="schedule-event">
        {event?.length === 0 ? (
          <div className="schedule-card text-center">
            <p className="m-0 py-2">No Upcoming Events</p>
          </div>
        ) : (
          event.map((event: any) => (
            <div
              key={event._id}
              className={`schedule-card mb-5 ${event._id === selectedEvent && 'active-event'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedEvent(event._id)}
            >
              <p className="title">{event?.title}</p>
              <div className="d-flex justify-content-start align-items-center">
                <div className="date-time" style={{ border: 'none' }}>
                  <Image src={clockIcon} width={24} height={24} alt="copy" className="me-2" />
                  <span>{moment(event.startTime).format('hh:mm A')}</span> - {''}
                  <span>{moment(event.endTime).format('hh:mm A')}</span>
                </div>
                <div className="user ms-4">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={
                          event?.hostProfile?.endsWith('profileImage.png')
                            ? placeholder
                            : event.hostProfile
                        }
                        alt="user profile"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ps-3">
                      <p className="m-0 name-text">{event?.hostName}</p>
                      <p className="m-0 role-text">{event?.hostTeam}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ScheduleModal
        openModal={openModal}
        setSuccessModal={setSuccessModal}
        fetchData={fetchData}
      />
      <SuccessPopUp openModal={successModal} />
    </div>
  );
};

export default ScheduleMeet;
