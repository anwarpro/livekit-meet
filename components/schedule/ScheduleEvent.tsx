import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import copyIcon from '../assets/icons/copy.png';
import clockIcon from '../assets/icons/clock.png';
import calenderIcon from '../assets/icons/calender.png';
import placeholder from '../assets/icons/placeholder.png';
import playIcon from '../assets/icons/play.png';
import editIcon from '../assets/icons/edit-brand.png';
import moment from 'moment';
import ScheduleModal from './ScheduleModal';
import { IMeet } from '../../types/meet';
import { useRouter } from 'next/router';
import SuccessPopUp from './SuccessPopUp';
import { useSelector } from 'react-redux';

type Events = {
  _id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  meetId: string;
  hostName: string;
  hostTeam: string;
};

const ScheduleEvent = ({ event, fetchData, selectedEvent }: any) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<{ edit: boolean }>({ edit: false });
  const [successModal, setSuccessModal] = useState<{ edit: boolean }>({ edit: false });
  const { events } = useSelector((state: any) => state.events);
  const [editable, setEditable] = useState<IMeet>();
  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    const textToCopy = document.getElementById('textToCopy')!.innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000); // Reset copied state after 2 seconds
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };

  const handleOpenModal = (id: string) => {
    setOpenModal({ edit: true });
    const eachEvent = events.find((event: any) => event._id === id);
    setEditable(eachEvent);
  };

  const handleJoinMeet = (meetId: string) => {
    const joinLink = `${
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
        ? 'http://localhost:7859/'
        : process.env.NEXT_PUBLIC_ENVIRONMENT === 'uat'
        ? 'https://meet.jsdude.com/'
        : 'https://meet.programming-hero.com/'
    }rooms/${meetId}`;
    if (joinLink) {
      router.push(joinLink);
    }
  };

  const eventInfo = useMemo(() => {
    return event.find((event: any) => event._id === selectedEvent) || event[0];
  }, [event, selectedEvent]);

  return (
    <div className="schedule-event">
      <div className="schedule-card p-5 mb-5" style={{ border: 'none' }}>
        <p className="meet-link">Meeting Link</p>
        <div className="link-area d-flex justify-content-between align-items-center p-3">
          <p id="textToCopy" className="m-0">
            {`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
                ? 'http://localhost:7859/'
                : process.env.NEXT_PUBLIC_ENVIRONMENT === 'uat'
                ? 'https://meet.jsdude.com/'
                : 'https://meet.programming-hero.com/'
            }rooms/${eventInfo?.meetId}`}
          </p>
          <Image onClick={handleCopyClick} src={copyIcon} width={24} height={24} alt="copy" />
        </div>
        <div className="date-time d-flex justify-content-start align-items-center mt-3">
          <div>
            <Image src={calenderIcon} width={24} height={24} alt="copy" />
            <span className="ps-2">{moment(eventInfo?.startTime).format('DD MMM, yy')}</span>
          </div>
          <div className="ps-5">
            <Image src={clockIcon} width={24} height={24} alt="copy" className="me-2" />
            <span>{moment(eventInfo?.startTime).format('hh:mm A')}</span> - {''}
            <span>{moment(eventInfo?.endTime).format('hh:mm A')}</span>
          </div>
        </div>
        {/* <div className="user mt-4">
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
          </div> */}
        <div className="participants d-flex justify-content-between align-items-center mt-4">
          <p>Students: {eventInfo?.internalParticipantList?.length}</p>
          <p>Guest: {eventInfo?.externalParticipantList?.length}</p>
        </div>
        <div className="btn-area mt-2">
          <button
            onClick={() => handleOpenModal(eventInfo?._id)}
            className="btn btn-primary reschedule"
          >
            <Image src={editIcon} width={24} height={24} alt="edit" />{' '}
            <span className="ms-2">Modify</span>
          </button>
          <button
            onClick={() => handleJoinMeet(eventInfo?.meetId!)}
            className="btn btn-primary ms-3"
          >
            Join Now <Image src={playIcon} width={24} height={24} alt="" />
          </button>
        </div>
      </div>

      <ScheduleModal
        openModal={openModal}
        fetchData={fetchData}
        editable={editable}
        setSuccessModal={setSuccessModal}
        reschedule
      />
      <SuccessPopUp openModal={successModal} reschedule />
    </div>
  );
};

export default ScheduleEvent;
