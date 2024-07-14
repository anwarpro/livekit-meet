import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomeModal from '../custom/CustomModal';
import { MenuItem, Select } from '@mui/material';
import maintenanceService from '../../service/serverMaintenance/serverMaintenanceService';
import swal from 'sweetalert';

type IProps = {
  openModal: { edit: boolean };
  editable?: any;
  fetchAllNotice: Dispatch<SetStateAction<void>>;
  setEditable: any;
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
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = (data: any) => {
    if (data.status === 'show') {
      data.status = true;
    } else {
      data.status = false;
    }
    if (props.editable?._id) {
      maintenanceService
        .updateNotice(props.editable?._id, data)
        .then((res) => {
          reset();
          setCloseModal({ status: false });
          props.fetchAllNotice();
          swal('success', 'Notice Updated Successfully', 'success');
        })
        .catch((err) => swal('error', err?.response?.message, 'error'));
    } else {
      maintenanceService
        .addNotice(data)
        .then((res) => {
          reset();
          setCloseModal({ status: false });
          props.fetchAllNotice();
          swal('success', 'Notice Created Successfully', 'success');
        })
        .catch((err) => swal('error', err?.response?.message, 'error'));
    }
  };

  useEffect(() => {
    reset();
    if (props.editable?._id) {
      reset(props.editable);
    }
  }, [props.editable]);

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
              <input
                className="form-control"
                placeholder="write a title"
                {...register('title', { required: true })}
              />
            </div>
            {errors.title && <span className="text-danger">Title is required</span>}
          </div>
          <div className="pt-3">
            <div className="mb-2">
              <p>Description</p>
              <textarea
                rows={5}
                className="form-control"
                placeholder="write a description"
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

          <input
            className="btn btn-primary mt-4"
            type="submit"
            value={props.editable?._id ? 'Update' : 'Submit'}
          />
        </form>
      </CustomeModal>
    </div>
  );
};

export default MaintenanceModal;
