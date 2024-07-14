import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomeModal from '../custom/CustomModal';
import { MenuItem, Select } from '@mui/material';
import maintenanceService from '../../service/serverMaintenance/serverMaintenanceService';

type IProps = {
  openModal: { edit: boolean };
};

type Inputs = {
  title: string;
  description: string;
  notificationType: string;
  status: boolean;
};

const MaintenanceModal = (props: IProps) => {
  const [closeModal, setCloseModal] = useState<{ status: boolean }>({ status: false });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = (data: any) => {
    if (data.status === 'show') {
      data.status = true;
    } else {
      data.status = false;
    }
    console.log(data);
    maintenanceService
      .addNotice(data)
      .then((res) => console.log('res', res))
      .catch((err) => console.log('err', err));
  };

  console.log(watch('status')); // watch input value by passing the name of it
  return (
    <div>
      <CustomeModal
        openModal={props.openModal}
        closeModal={closeModal}
        customStyle={{
          borderRadius: '12px',
          border: 0,
          backgroundColor: 'white',
          maxWidth: '600px',
          width: '600px',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-2">
              <p>Title</p>
              <input className="form-control" {...register('title', { required: true })} />
            </div>
            {errors.title && <span className="text-danger">Title is required</span>}
          </div>
          <div className="pt-3">
            <div className="mb-2">
              <p>Description</p>
              <textarea
                rows={5}
                className="form-control"
                {...register('description', { required: true })}
              />
            </div>
            {errors.description && <span className="text-danger">Description is required</span>}
          </div>
          <div className="pt-3">
            <div className="mb-2">
              <p>Notification Type</p>
              <select
                {...register('notificationType', { required: true })}
                className="form-control mt-2"
              >
                <option value="">Select notice type</option>
                <option value="server-maintenance">Maintenance notice</option>
                <option value="meeting">meeting notice</option>
              </select>
            </div>
            {errors.notificationType && (
              <span className="text-danger">Notification type is required</span>
            )}
          </div>
          <div className="pt-3">
            <div className="mb-2">
              <p>Status</p>
              <select {...register('status', { required: true })} className="form-control mt-2">
                <option value="hide">hide</option>
                <option value="show">show</option>
              </select>
            </div>
            {errors.status && <span className="text-danger">Status is required</span>}
          </div>

          <input className="btn btn-primary mt-4" type="submit" />
        </form>
      </CustomeModal>
    </div>
  );
};

export default MaintenanceModal;
