'use client';
import React, { useState } from 'react';
import CustomModal from '../custom/CustomModal';
import Image from 'next/image';
import userIcon from '../assets/icons/user-colored.png';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import meetService from '../../service/meet/meetService';
import readXlsxFile from 'read-excel-file';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
import dayjs, { Dayjs } from 'dayjs';
import { Autocomplete, Box, Chip, Stack, Switch, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

type Iprops = {
  openModal: { edit: boolean };
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

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.internalParticipantList = internalParticipantList;
    data.externalParticipantList = externalParticipantList;
    data.isScheduled = true;
    console.log('🚀 ~ ScheduleManagement ~ data:', data);
    // meetService
    //   .addScheduleMeeting(data)
    //   .then((res) => {
    //     console.log('res ==>', res);
    //   })
    //   .catch((err) => {
    //     console.log('err', err);
    //   });
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

  const [checked, setChecked] = React.useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleExternalSelect = (e: any, newValue: any) => {
    console.log('🚀 ~ handleExternalSelect ~ email:', newValue);
    // setExternalParticipantList((prev) => [...prev, value]);
    setExternalParticipantList(newValue);
  };

  return (
    <div>
      <CustomModal
        openModal={props.openModal}
        closeModal={closeModal}
        noCloseIcon
        customStyle={{
          borderRadius: '12px',
          border: 0,
          backgroundColor: 'white',
          width: '600px',
        }}
      >
        <Box
          sx={{
            '& .submit-btn': {
              background: 'linear-gradient(270deg, #006EFF 0%, #2170D8 100%)',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '17px',
              color: '#FFFFFF',
              padding: '15px',
            },
          }}
          className="schedule-modal"
        >
          <div className="heading d-flex align-items-center">
            <Image src={userIcon} width="30" height="30" alt="user" />
            <p className="m-0 ps-2">Add Meeting</p>
          </div>

          <div className="mt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="title">Event or Meeting TItle</label>
                <input
                  className="form-control mt-2"
                  placeholder="Enter your meeting or event title..."
                  {...register('title', { required: true })}
                />
                {errors.title && (
                  <span className="text-danger d-inline-block pt-2">Title is required</span>
                )}
              </div>
              <div className="d-flex justify-content-between">
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
                          defaultValue={dayjs('2022-04-17T15:30')}
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
                          defaultValue={dayjs('2022-04-17T15:30')}
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
              </div>
              <Box
                className="my-3"
                sx={{
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
                  <input
                    onChange={(e) => handleExcelSheet(e)}
                    type="file"
                    name="internalParticipantList"
                    hidden
                  />
                  <span>Browse files</span>
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

              {checked && (
                <>
                  <div className="mt-3 mb-4">
                    <label className="mb-2" htmlFor="externalParticipantList">
                      Add External Guest Email
                    </label>
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      id="tags-filled"
                      options={[{ email: 'israfil@gmail.com' }, { email: 'rasel@gmail.com' }].map(
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
                          placeholder="type and allowed to enter more"
                        />
                      )}
                    />
                  </div>
                  {errors.externalParticipantList && (
                    <span className="text-danger d-inline-block pt-2">
                      External Participant List is required
                    </span>
                  )}
                </>
              )}

              <input className="submit-btn form-control" type="submit" />
            </form>
          </div>
        </Box>
      </CustomModal>
    </div>
  );
};

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

export default ScheduleModal;
