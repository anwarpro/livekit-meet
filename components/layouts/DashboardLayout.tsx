"use client"
import { Provider } from 'react-redux';
import store from '../../lib/store';
import Dashboard from './Dashboard';

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <Dashboard>{children}</Dashboard>
    </Provider>
  );
};
export default DashboardLayout;
