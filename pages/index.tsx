import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clockIcon from '../components/assets/icons/clock.png';
import playIcon from '../components/assets/icons/play.png';
import moment from 'moment';
import meetService from '../service/meet/meetService';
import { setEventStore } from '../lib/Slicers/eventSlice';
import { IMeet } from '../types/meet';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const event = [
  {
    _id: 1,
    startTime: new Date(),
    title: 'Javascript Fundamental',
  },
];

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [event, setEvent] = useState([]);
  const { token } = useSelector((state: any) => state.auth);

  const fetchData = (token: string) => {
    meetService
      .upcomingSchedule(token)
      .then((res: any) => {
        setEvent(res?.data?.data);
        dispatch(setEventStore(res?.data?.data));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

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
    <main className="container homepage-component">
      <div
        className={`d-flex justify-content-center align-items-center ${
          event?.length > 0 ? 'active-height' : 'static-height'
        }`}
      >
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
                <div className="p-4">
                  <p className="m-0">{event.title}</p>
                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <p className="m-0 clock-text">
                      <Image src={clockIcon} width={24} height={24} alt="clock" />{' '}
                      {moment(event.startTime).format('MMMM D YYYY, hh:mm A')}
                    </p>
                    <button
                      onClick={() => handleJoinMeet(event?.meetId!)}
                      className="btn btn-primary"
                    >
                      Join Now <Image src={playIcon} width={24} height={24} alt="" />
                    </button>
                  </div>
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
