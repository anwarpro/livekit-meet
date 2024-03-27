import React, { useState } from 'react';
import CustomModal from '../custom/CustomModal';

type Iprops = {
  openModal: { edit: boolean };
};

const ScheduleModal = (props: Iprops) => {
  //   const [openModal, setOpenModal] = useState<{ edit: boolean }>({ edit: true });
  const [closeModal, setCloseModal] = useState<{ status: boolean }>({ status: false });
  return (
    <div>
      <CustomModal
        openModal={props.openModal}
        closeModal={closeModal}
        noCloseIcon
        customStyle={{
          borderRadius: '12px',
          border: 0,
          backgroundColor: 'white',
        }}
      >
        <div>
          <h1>israfil calling</h1>
        </div>
      </CustomModal>
    </div>
  );
};

export default ScheduleModal;
