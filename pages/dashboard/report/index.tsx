import React, { ReactElement } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';

const index = () => {
  return <div>report</div>;
};

export default index;

index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
