'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import Image from 'next/image';
import userIcon from '../assets/icons/user-colored.png';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import meetService from '../../service/meet/meetService';
import readXlsxFile from 'read-excel-file';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
import dayjs, { Dayjs } from 'dayjs';
import {
  Autocomplete,
  Box,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { IMeet } from '../../types/meet';
import swal from 'sweetalert';
import ParticipantListTable from './ParticipantListTable';

type Iprops = {
  openParticipantModal: { edit: boolean };
  reschedule?: boolean;
  setSuccessModal?: Dispatch<SetStateAction<{ edit: boolean }>>;
  fetchData?: Dispatch<SetStateAction<void>>;
  editable: IMeet;
  canAdd?: boolean;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ScheduleParticipantModal = (props: Iprops) => {
  const [isLoading, setIsLoading] = useState(false);
  const [closeModal, setCloseModal] = useState<{ status: boolean }>({ status: false });
  const [internalParticipantList, setInternalParticipantList] = useState([]);
  const [externalParticipantList, setExternalParticipantList] = useState([]);
  const [internalTotal, setInternalTotal] = useState(0);
  const [externalTotal, setExternalTotal] = useState(0);
  const [meetData, setMeetData] = useState({} as IMeet);
  const [value, setValue] = useState(0);
  const fields = [
    { id: 'email', label: 'Email' },
    { id: 'action', label: 'Action' },
  ];
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setPage(1);
    setLimit(10);
    setSearchText('');
  };
  const fetchMeetData = () => {
    setIsLoading(true);
    meetService
      .scheduleGetById(props.editable?._id as string)
      .then((res: any) => {
        // console.log('res ==>', res.data?.data);
        setMeetData(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setIsLoading(false);
        swal('Oops...', err?.response?.data.message, 'error');
      });
  };
  const fetchData = () => {
    setIsLoading(true);
    if (value === 0) {
      meetService
        .getInternalParticipant(props.editable?._id as string, searchText, limit, page)
        .then((res: any) => {
          // console.log('res ==>', res.data?.data);
          setInternalParticipantList(res?.data?.data[0]?.emails);
          setInternalTotal(res?.data?.data[0]?.total);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log('err', err);
          setIsLoading(false);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    } else {
      meetService
        .getexternalParticipant(props.editable?._id as string, searchText, limit, page)
        .then((res: any) => {
          // console.log('res ==>', res.data?.data);
          setExternalParticipantList(res?.data?.data[0]?.emails);
          setExternalTotal(res?.data?.data[0]?.total);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log('err', err);
          setIsLoading(false);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    }
  };
  useEffect(() => {
    if (props.openParticipantModal.edit) {
      fetchMeetData();
      fetchData();
      setValue(0);
    }
  }, [props.openParticipantModal]);
  useEffect(() => {
    if (props.openParticipantModal.edit) {
      fetchData();
    }
  }, [limit, page, searchText, value]);

  return (
    <Box>
      <CustomModal
        openModal={props.openParticipantModal}
        closeModal={closeModal}
        customStyle={{
          borderRadius: '12px',
          border: 0,
          backgroundColor: 'white',
          width: '600px',
        }}
      >
        <Box
          sx={{
            '& .form-control': {
              padding: '10px',
              borderRadius: '8px',
            },
            '& .submit-btn': {
              background: 'linear-gradient(270deg, #006EFF 0%, #2170D8 100%)',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '17px',
              color: '#FFFFFF',
              padding: '15px',
            },
            '& .heading p': {
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '21px',
              color: '#100324',
            },
            '& label': {
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '26px',
              color: '#100324',
            },
          }}
          className="schedule-modal"
        >
          <div className="heading d-flex align-items-center">
            <Image src={userIcon} width="30" height="30" alt="user" />
            <p className="m-0 ps-2">{props.canAdd ? "Update Participants" : "Invited Participants List"}</p>
          </div>

          <Box className="mt-4">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab
                  sx={{width: "50%"}}
                    label={
                      <div className="d-flex align-items-center">
                        {'Internal Participants'}
                        <Box
                          sx={{
                            position: 'relative',
                            bottom: '7px',
                            marginLeft: '5px',
                          }}
                        >
                          {meetData?.internalParticipantList?.length || 0}
                        </Box>
                      </div>
                    }
                    {...a11yProps(0)}
                  />
                  <Tab
                  sx={{width: "50%"}}
                    label={
                      <div className="d-flex align-items-center">
                        {'External Participants'}
                        <Box
                          sx={{
                            position: 'relative',
                            bottom: '7px',
                            marginLeft: '5px',
                          }}
                        >
                          {meetData?.externalParticipantList?.length || 0}
                        </Box>
                      </div>
                    }
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <ParticipantListTable
                  fields={fields}
                  items={internalParticipantList}
                  total={internalTotal}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  fetchData={fetchData}
                  fetchMeetData={fetchMeetData}
                  tabName="internal"
                  data={meetData}
                  isLoading={isLoading}
                  canAdd={props.canAdd}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <ParticipantListTable
                  fields={fields}
                  items={externalParticipantList}
                  total={externalTotal}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  fetchData={fetchData}
                  fetchMeetData={fetchMeetData}
                  data={meetData}
                  tabName="external"
                  isLoading={isLoading}
                  canAdd={props.canAdd}
                />
              </CustomTabPanel>
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default ScheduleParticipantModal;
