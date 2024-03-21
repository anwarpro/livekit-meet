import React, { ReactElement } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

const ScheduleManagement = () => {
  return <div>schedule management</div>;
};

export default ScheduleManagement;

ScheduleManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
