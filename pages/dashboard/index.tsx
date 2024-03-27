import React, { ReactElement } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';


const Dashboard = () => {
  return <div>welcome to dashboard</div>;
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
