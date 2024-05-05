import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CustomeModal from '../custom/CustomModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import userService from '../../service/user/userService';
import swal from 'sweetalert';
type Iprops = {
  openModal: { edit: boolean };
  fetchData: Dispatch<SetStateAction<void>>;
};
type Inputs = {
  fullName: string;
  email: string;
  phone: number;
  role: string;
  team: string;
  profileImage: string;
};

const TeamMemberModal = (props: Iprops) => {
  const [closeModal, setCloseModal] = useState<{ status: boolean }>({ status: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.role = 'team_member';
    data.profileImage =
      'https://phero-web.nyc3.cdn.digitaloceanspaces.com/uat-images/public/profileImage.png';
    userService
      .addManualUser(data)
      .then((res) => {
        swal('success', 'Manual User Created Successfully', 'success');
        setCloseModal({ status: false });
        props.fetchData();
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          swal('User Already Exist', err?.response?.data.message, 'error');
        } else {
          swal('error', 'something went wrong', 'error');
        }
      });
  };

  useEffect(() => {
    reset();
  }, [props.openModal]);

  return (
    <CustomeModal
      openModal={props.openModal}
      closeModal={closeModal}
      customStyle={{
        borderRadius: '12px',
        border: 0,
        backgroundColor: 'white',
        maxWidth: '600px',
        width: '400px',
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
        <Box className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="fullName">Full Name</label>
              <input
                className="form-control mt-2"
                placeholder="Enter your Name"
                {...register('fullName', { required: true })}
              />
              {errors.fullName && (
                <span className="text-danger d-inline-block pt-2">fullName is required</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                className="form-control mt-2"
                placeholder="Enter your Email"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <span className="text-danger d-inline-block pt-2">email is required</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="phone">Phone</label>
              <input
                className="form-control mt-2"
                placeholder="Enter your Phone no."
                {...register('phone', { required: true })}
              />
              {errors.phone && (
                <span className="text-danger d-inline-block pt-2">email is required</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="team">Team</label>
              <select {...register('team', { required: true })} className="form-control mt-2">
                <option value={'Neptune'}>Neptune</option>
                <option value={'Job Placement'}>Job Placement</option>
                <option value={'Phitron'}>Phitron</option>
              </select>
              {errors.team && (
                <span className="text-danger d-inline-block pt-2">team is required</span>
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
            ></Box>

            <input className={`submit-btn form-control `} value={'Submit'} type="submit" />
          </form>
        </Box>
      </Box>
    </CustomeModal>
  );
};

export default TeamMemberModal;
