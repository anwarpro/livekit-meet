import React, { ReactElement, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from '@mui/lab';
import UserListTable from '../../../components/user/UserListTable';
import Image from 'next/image';
import userIcon from '../../../components/assets/icons/user-colored.png';

const UserManagement = () => {
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const fields = [
    { id: 'fullName', label: 'User Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'team', label: 'Team Name' },
    { id: 'action', label: 'Action' },
  ];
  const [contactList, setcontactList] = useState([
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
    { fullName: 'israfil', email: 'israfil@gmail.com', role: 'admin', team: 'web' },
  ]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  return (
    <Box
      sx={{
        width: '100%',
        typography: 'body1',
        '& .title h1': {
          fontFamily: 'Inter',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '24.2px',
          m: 0,
          pl: 1,
        },
      }}
    >
      <div className="title d-flex align-items-center mt-3 mb-4 ">
        <Image src={userIcon} width="30" height="30" alt="user" />
        <h1>Meetify User List </h1>
      </div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              value="1"
              label={
                <div className="d-flex align-items-center">
                  student
                  <Box
                    sx={{
                      position: 'relative',
                      bottom: '7px',
                      marginLeft: '5px',
                    }}
                  >
                    50
                  </Box>
                </div>
              }
            />
            <Tab
              value="2"
              label={
                <div className="d-flex align-items-center">
                  admin
                  <Box
                    sx={{
                      position: 'relative',
                      bottom: '7px',
                      marginLeft: '5px',
                    }}
                  >
                    3
                  </Box>
                </div>
              }
            />
            <Tab
              value="3"
              label={
                <div className="d-flex align-items-center">
                  supper admin
                  <Box
                    sx={{
                      position: 'relative',
                      bottom: '7px',
                      marginLeft: '5px',
                    }}
                  >
                    5
                  </Box>
                </div>
              }
            />
          </TabList>
        </Box>
        <TabPanel value={value}>
          <UserListTable
            fields={fields}
            items={contactList}
            total={total}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            setSearch={setSearch}
            // isLoading={isLoading}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default UserManagement;
UserManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
