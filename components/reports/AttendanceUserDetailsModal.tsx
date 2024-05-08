import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import AttendanceDetailsModalTable from './AttendanceDetailsModalTable';
type IProps = {
  openModal: { edit: boolean };
  attendanceDetails: {
    identity: string;
    attendanceInfo: string[];
  };
};

const fields = [
  { id: 'identity', label: 'Email' },
  { id: 'eventType', label: 'Type' },
  { id: 'createdAt', label: 'time' },
];

const AttendanceUserDetailsModal = ({ openModal, attendanceDetails }: IProps) => {
  const [closeModal, setCloseModal] = useState({ status: false });
  return (
    <CustomModal
      openModal={openModal}
      closeModal={closeModal}
      customStyle={{
        borderRadius: '12px',
        border: 0,
        backgroundColor: 'white',
        maxWidth: '900px',
        width: '800px',
      }}
    >
      <div className='mb-4 text-center'>
        <h4>Participant activity</h4>
      </div>
      <AttendanceDetailsModalTable fields={fields} items={attendanceDetails} />
    </CustomModal>
  );
};

export default AttendanceUserDetailsModal;
