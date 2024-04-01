import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import plusIcon from '../assets/icons/plus.png';
import ScheduleModal from './ScheduleModal';
import SuccessPopUp from './SuccessPopUp';
type IProps = {
  fetchData: Dispatch<SetStateAction<void>>;
};
const ScheduleMeet = ({ fetchData }: IProps) => {
  const [openModal, setOpenModal] = useState<{ edit: boolean }>({ edit: false });
  const [successModal, setSuccessModal] = useState<{ edit: boolean }>({ edit: false });
  const handleOpenModal = () => {
    setOpenModal({ edit: true });
  };
  return (
    <div className="schedule-meet">
      <div onClick={() => handleOpenModal()} className="create-schedule-btn-box">
        <Image src={plusIcon} width={48} height={48} alt="create" />
        <p className="pt-3">Create Schedule</p>
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