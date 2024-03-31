import React, { ReactElement } from 'react';
import InstantMeet from '../../../components/instantMeet/InstantMeet';
import DashboardLayout from '../../../components/layouts/DashboardLayout';

const index = () => {
  return (
    <div>
      <InstantMeet />
    </div>
  );
};

export default index;

index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
