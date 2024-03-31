import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clockIcon from '../components/assets/icons/clock.png';
import playIcon from '../components/assets/icons/play.png';
import moment from 'moment';
import meetService from '../service/meet/meetService';
import { setEventStore } from '../lib/Slicers/eventSlice';
import { useAppDispatch } from '../types/common';
import { IMeet } from '../types/meet';
import { useRouter } from 'next/router';

const event = [
  {
    _id: 1,
    startTime: new Date(),
    title: 'Javascript Fundamental',
  },
];

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [event, setEvent] = useState([]);

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

  return (
    <main className="container">
      <div className="homepage-component d-flex justify-content-center align-items-center">
        <div>
          <div className="header text-center">
            <h1>
              Video calls and meetings <br /> for everyone
            </h1>
            <p>
              Meetify meet provides secure, easy-to-use video calls and meetings <br /> for
              everyone, on any device.
            </p>
          </div>
          <div className="mt-5">
            {event.map((event: IMeet) => (
              <div key={event._id} className="event mb-4">
                <div className="d-flex justify-content-between align-items-center p-5">
                  <p className="m-0 clock-text">
                    <Image src={clockIcon} width={24} height={24} alt="clock" />{' '}
                    {moment(event.startTime).format('hh:mm A')}
                  </p>
                  <p className="m-0">{event.title}</p>
                  <button
                    onClick={() => handleJoinMeet(event?.meetId!)}
                    className="btn btn-primary"
                  >
                    Join Now <Image src={playIcon} width={24} height={24} alt="" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
