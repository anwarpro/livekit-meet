import React, { useEffect, useState } from 'react';
import MaintenanceTable from './MaintenanceTable';
import MaintenanceModal from './MaintenanceModal';
import maintenanceService from '../../service/serverMaintenance/serverMaintenanceService';
import swal from 'sweetalert';

const noticeFields = [
  { id: 'title', label: 'Notice Title' },
  { id: 'description', label: 'Description' },
  { id: 'createdAt', label: 'Creation Date' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' },
];

const Maintenance = () => {
  const [isOpenModal, setIsOpenModal] = useState({ edit: false });
  const [noticeList, setNoticeList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [checked, setChecked] = React.useState(true);
  const [editable, setEditable] = React.useState('');
  console.log("🚀 ~ Maintenance ~ editable:", editable)

  const fetchAllNotice = () => {
    maintenanceService
      .allNotice(page, limit)
      .then((res) => {
        setNoticeList(res?.data?.data);
        setTotal(res?.data?.data?.length);
      })
      .catch((err) => console.log('err', err));
  };

  const handleEdit = (id: string) => {
    maintenanceService
      .noticeById(id)
      .then((res) => {
        let data = res?.data?.data;
        if (data.status === true) {
          data.status = 'show';
        } else {
          data.status = 'hide';
        }
        setEditable(data);
        setIsOpenModal({ edit: true });
      })
      .catch((err) => console.log('err', err));
  };

  const handleDelete = (id: string) => {
    maintenanceService
      .deleteNotice(id)
      .then((res) => {
        fetchAllNotice();
        swal('success', 'Notice Deleted Successfully', 'delete');
      })
      .catch((err) => {
        console.log('err', err);
        swal('error', err.response.message, 'error');
      });
  };

  useEffect(() => {
    fetchAllNotice();
  }, [page, limit]);

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-info" onClick={() => setIsOpenModal({ edit: true })}>
          ADD Notice
        </button>
      </div>
      <div>
        <MaintenanceTable
          fields={noticeFields}
          items={noticeList}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total={total}
          //   @ts-ignore
          handleEdit={handleEdit}
          //   @ts-ignore
          handleDelete={handleDelete}
          //   setChecked={setChecked}
        />
      </div>
      <MaintenanceModal
        openModal={isOpenModal}
        //   @ts-ignore
        editable={editable}
        //   @ts-ignore
        setEditable={setEditable}
        fetchAllNotice={fetchAllNotice}
      />
    </div>
  );
};

export default Maintenance;
