import React, { ReactElement } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

const UserManagement = () => {
  return <div>user management page</div>;
};

export default UserManagement;
UserManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
