import React, { useState } from 'react';
import MaintenanceTable from './MaintenanceTable';
import MaintenanceModal from './MaintenanceModal';

const noticeFields = [
  { id: 'title', label: 'Notice Title' },
  { id: 'description', label: 'Description' },
  { id: 'createdAt', label: 'Creation Date' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' },
];

const Maintenance = () => {
  const [isOpenModal, setIsOpenModal] = useState({ edit: false });
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
          //   items={previousEvent}
          //   fetchData={fetchData}
          //   page={page}
          //   setPage={setPage}
          //   limit={limit}
          //   setLimit={setLimit}
          //   total={total}
          //   searchText={searchText}
          //   setSearchText={setSearchText}
        />
      </div>
      <MaintenanceModal openModal={isOpenModal} />
    </div>
  );
};

export default Maintenance;
