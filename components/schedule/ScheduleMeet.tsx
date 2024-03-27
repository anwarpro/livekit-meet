import React, { useState } from 'react';
import { Box, FormControl } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import meetService from '../../service/meet/meetService';
import readXlsxFile from 'read-excel-file';
import Image from 'next/image';
import plusIcon from '../assets/icons/plus.png';
import ScheduleModal from './scheduleModal';

type Inputs = {
  title: string;
  startTime: string;
  endTime: string;
  internalParticipantList: string[];
  externalParticipantList: string[];
  isScheduled: boolean;
};

const ScheduleMeet = () => {
  //   const dispatch = useAppDispatch();
  //   const router = useRouter();
  const [internalParticipantList, setInternalParticipantList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.internalParticipantList = internalParticipantList;
    data.externalParticipantList = ['israfil@programming-hero.com'];
    data.isScheduled = true;
    console.log('🚀 ~ ScheduleManagement ~ data:', data);
    meetService
      .addScheduleMeeting(data)
      .then((res) => {
        console.log('res ==>', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // console.log(watch('example')); // watch input value by passing the name of it

  const handleExcelSheet = (event: any) => {
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
  const [openModal, setOpenModal] = useState<{ edit: boolean }>({ edit: false });
  const handleOpenModal = () => {
    setOpenModal({ edit: true });
  };
  return (
    <div>
      <div onClick={() => handleOpenModal()} className="create-schedule-btn-box">
        <Image src={plusIcon} width={48} height={48} alt="create" />
        <p className="pt-3">Create Schedule</p>
      </div>
      {/* <Box sx={{ mt: 5 }}>
        <p>Create schedule meeting</p>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Box sx={{ pb: 3 }}>
                <input {...register('title', { required: true })} />
                {errors.title && <span>Title is required</span>}
              </Box>
              <Box sx={{ pb: 3 }}>
                <input type="datetime-local" {...register('startTime', { required: true })} />
                {errors.startTime && <span>startTime is required</span>}
              </Box>
              <Box sx={{ pb: 3 }}>
                <input type="datetime-local" {...register('endTime', { required: true })} />
                {errors.endTime && <span>endTime is required</span>}
              </Box>
            </FormControl>
            <input type="submit" />
          </form>
          <Box sx={{ pb: 3 }}>
            <input
              onChange={(e) => handleExcelSheet(e)}
              type="file"
              name="internalParticipantList"
            />
          </Box>
        </div>
      </Box> */}

      <ScheduleModal openModal={openModal} />
    </div>
  );
};

export default ScheduleMeet;
