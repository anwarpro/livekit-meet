import React, { useState } from 'react';
import CustomeModal from '../custom/CustomModal';
type IProps = {
  openModal: { edit: boolean };
};
const UserDetails = (props: IProps) => {
  const [closeModal, setCloseModal] = useState<{ status: boolean }>({ status: false });
  return (
    <div>
      <CustomeModal
        openModal={props.openModal}
        closeModal={closeModal}
        customStyle={{
          borderRadius: '12px',
          border: 0,
          backgroundColor: 'white',
          width: '600px',
        }}
      >
        <h1>hello</h1>
      </CustomeModal>
    </div>
  );
};

export default UserDetails;
