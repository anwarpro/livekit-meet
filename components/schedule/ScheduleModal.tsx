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
import { Autocomplete, Box, Button, Chip, Stack, Switch, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { IMeet } from '../../types/meet';
import swal from 'sweetalert';
import ScheduleParticipantModal from './ScheduleParticipantModal';

type Iprops = {
  openModal: { edit: boolean };
  reschedule?: boolean;
  setSuccessModal?: Dispatch<SetStateAction<{ edit: boolean }>>;
  fetchData: Dispatch<SetStateAction<void>>;
  editable?: IMeet;
};

type Inputs = {
  title: string;
  startTime: string;
  endTime: string;
  eventDate: string;
  internalParticipantList: string[];
  externalParticipantList: string[];
  isScheduled: boolean;
};

const ScheduleModal = (props: Iprops) => {
  const [closeModal, setCloseModal] = useState<{ status: boolean }>({ status: false });
  const [internalParticipantList, setInternalParticipantList] = useState<string[]>([]);
  const [externalParticipantList, setExternalParticipantList] = useState<string[]>([]);
  const [checked, setChecked] = React.useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string }>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (props.reschedule) {
      //reschedule session/update
      const startTime = dateTimeConverter(data.eventDate, data.startTime);
      const endTime = dateTimeConverter(data.eventDate, data.endTime);
      const newData = {
        title: data.title,
        // internalParticipantList: internalParticipantList,
        // externalParticipantList: externalParticipantList,
        startTime: startTime,
        endTime: endTime,
      };
      meetService
        .reScheduleMeeting(props.editable?._id as string, newData as any)
        .then((res) => {
          console.log('res ==>', res);
          setCloseModal({ status: false });
          props.setSuccessModal!({ edit: true });
          props.fetchData();
        })
        .catch((err) => {
          console.log('err', err);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    } else {
      const startTime = dateTimeConverter(data.eventDate, data.startTime);
      const endTime = dateTimeConverter(data.eventDate, data.endTime);
      const newData = {
        title: data.title,
        isScheduled: true,
        internalParticipantList: internalParticipantList,
        externalParticipantList: externalParticipantList,
        startTime: startTime,
        endTime: endTime,
      };
      meetService
        .addScheduleMeeting(newData)
        .then((res) => {
          console.log('res ==>', res);
          setCloseModal({ status: false });
          props.setSuccessModal!({ edit: true });
          props.fetchData();
        })
        .catch((err) => {
          console.log('err', err);
          swal('Oops...', err?.response?.data.message, 'error');
        });
    }
  };

  const dateTimeConverter = (date: string, time: string) => {
    const year = new Date(date).getFullYear();
    const month = String(new Date(date).getMonth() + 1).padStart(2, '0');
    const day = String(new Date(date).getDate()).padStart(2, '0');
    const dateString = year + '-' + month + '-' + day;

    const hour = String(new Date(time).getHours()).padStart(2, '0');
    const minute = String(new Date(time).getMinutes()).padStart(2, '0');
    const second = String(new Date(time).getSeconds()).padStart(2, '0');
    const timeString = `${hour}:${minute}:${second}`;

    const dateTime = moment(`${dateString} ${timeString}`, 'YYYY-MM-DD HH:mm:ss').format();
    return dateTime;
  };

  const handleExcelSheet = (event: any) => {
    setUploadedFile(event.target.files[0]);
    const schema = {
      email: {
        prop: 'email',
        type: String,
        required: true,
      },
    };

    readXlsxFile(event.target.files[0], { schema }).then((rows) => {
      let tempUserList: any[] = [];
      rows.rows.forEach((element) => {
        tempUserList.push({
          ...element,
        });
      });
      let arrayOfString = tempUserList.map((element) => element.email);
      setInternalParticipantList(arrayOfString);
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleExternalSelect = (e: any, newValue: any) => {
    setExternalParticipantList(newValue);
  };

  

  useEffect(() => {
    let defaultValues: any = {};
    defaultValues.eventDate = new Date();
    defaultValues.startTime = new Date();
    defaultValues.endTime = new Date();
    reset({ ...defaultValues });
    if (props.editable) {
      // @ts-ignore
      reset(props.editable);
    }
  }, [props.editable, reset]);

  useEffect(() => {
    if (props.openModal.edit) {
      reset();
      setInternalParticipantList([]);
      setUploadedFile({ name: '' });
    }
  }, [props.openModal, reset]);

  return (
    <Box>
      <CustomModal
        openModal={props.openModal}
        closeModal={closeModal}
        customStyle={{
          borderRadius: '12px',
          border: 0,
          backgroundColor: 'white',
          maxWidth: '600px',
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
            <p className="m-0 ps-2">{props.reschedule ? 'Reschedule Meeting' : 'Add Meeting'}</p>
          </div>

          <Box className="mt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="title">Event or Meeting Title</label>
                <input
                  className="form-control mt-2"
                  placeholder="Enter your meeting or event title..."
                  {...register('title', { required: true })}
                />
                {errors.title && (
                  <span className="text-danger d-inline-block pt-2">Title is required</span>
                )}
              </div>
              <Box
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    height: '45px',
                  },
                }}
                className="d-flex justify-content-between"
              >
                <div>
                  <label className="mb-2" htmlFor="eventDate">
                    Date
                  </label>
                  <Controller
                    control={control}
                    name="eventDate"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box>
                          <DatePicker
                            onChange={onChange}
                            slotProps={{ textField: { size: 'small' } }}
                            defaultValue={dayjs(props.editable?.startTime)}
                          />
                        </Box>
                      </LocalizationProvider>
                    )}
                  />
                  {errors.eventDate && (
                    <span className="text-danger d-inline-block pt-2">Event date is required</span>
                  )}
                </div>
                <div className="ms-2">
                  <label className="mb-2" htmlFor="startTime">
                    Time-From
                  </label>
                  <Controller
                    control={control}
                    name="startTime"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          defaultValue={dayjs(props.editable?.startTime)}
                          onChange={onChange}
                          name="startTime"
                          slotProps={{ textField: { size: 'small' } }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.startTime && (
                    <span className="text-danger d-inline-block pt-2">Start time is required</span>
                  )}
                </div>
                <div className="ms-2">
                  <label className="mb-2" htmlFor="endTime">
                    Time-To
                  </label>
                  <Controller
                    control={control}
                    name="endTime"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          defaultValue={dayjs(props.editable?.endTime)}
                          onChange={onChange}
                          slotProps={{ textField: { size: 'small' } }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.endTime && (
                    <span className="text-danger d-inline-block pt-2">End Time is required</span>
                  )}
                </div>
              </Box>
              {!props.reschedule && (
                <>
                  <Box
                    className="my-3"
                    sx={{
                      '& p': {
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '26px',
                        color: '#100324',
                      },
                      '& .btn-up': {
                        border: '1px dashed #006EFF',
                        borderRadius: '12px',
                        p: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '& span': {
                          border: '1px solid #006EFF',
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: '19.2px',
                          borderRadius: '8px',
                          padding: '10px 25px',
                          cursor: 'pointer',
                          color: '#006EFF',
                        },
                      },
                    }}
                  >
                    <p className="m-0 pb-2">Students Sheet Upload</p>
                    <label className="btn-up">
                      <div>
                        <input
                          onChange={(e) => handleExcelSheet(e)}
                          type="file"
                          name="internalParticipantList"
                          hidden
                        />
                        <span>Browse files</span>
                        {uploadedFile && (
                          <p className="m-0 pt-2 text-center"> {uploadedFile.name}</p>
                        )}
                      </div>
                    </label>
                  </Box>

                  <Box
                    className="mb-3"
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <label htmlFor="">Do you have any Special Guest</label>
                    <Switch
                      checked={checked}
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Box>
                </>
              )}

              {checked && (
                <>
                  <Box
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px',
                        padding: '7px',
                      },
                    }}
                    className="mt-3 mb-4"
                  >
                    <label className="mb-2" htmlFor="externalParticipantList">
                      Add External Guest Email
                    </label>
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      id="tags-filled"
                      options={[{ email: 'israfil@programming-hero.com' }].map(
                        (option) => option.email,
                      )}
                      defaultValue={[]}
                      freeSolo
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                          <div key={index}>
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          </div>
                        ))
                      }
                      onChange={(e, newValue) => handleExternalSelect(e, newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="externalParticipantList"
                          placeholder="type and press enter to add email"
                        />
                      )}
                    />
                  </Box>
                  {errors.externalParticipantList && (
                    <span className="text-danger d-inline-block pt-2">
                      External Participant List is required
                    </span>
                  )}
                </>
              )}

              <input
                className={`submit-btn form-control ${props.reschedule ? 'mt-5' : ''}`}
                value={props.reschedule ? 'Update ' : 'Submit'}
                type="submit"
              />
            </form>
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default ScheduleModal;
