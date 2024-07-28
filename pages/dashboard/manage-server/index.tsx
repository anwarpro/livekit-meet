import React, { ReactElement } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Maintenance from '../../../components/manageServer/Maintenance';

const ManageServer = () => {
  return (
    <div>
      <Maintenance />
    </div>
  );
};

export default ManageServer;
ManageServer.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
