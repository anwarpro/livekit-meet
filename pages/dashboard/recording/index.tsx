import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import meetService from '../../../service/meet/meetService';
import { useSelector } from 'react-redux';
import RecordingListTable from '../../../components/recording/RecordingListTable';

const recordingFields = [
  { id: 'title', label: 'Meeting Title' },
  { id: 'roomId', label: 'Meeting Room' },
  { id: 'egressId', label: 'Livekit Egress ID' },
  { id: 'file', label: 'file Name' },
  { id: 'action', label: 'Action' },
];

const RecordManagement = () => {
  const { roomInfo } = useSelector((state: any) => state.room);
  const [recordings, setIsRecording] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // const fetchData = () => {
  //   meetService
  //     .recordingStatus()
  //     .then((res: any) => {
  //       setIsRecording(res?.data?.egressList);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [roomInfo.roomId]);

  const handleDownload = (fileName: string) => {
    meetService
      .downloadRecord({ fileName })
      .then((res) => {
        // @ts-ignore
        const signedUrl = res?.data?.url;
        window.location.href = signedUrl;
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    meetService
      .getRecordingList(limit, page)
      .then((res) => {
        // @ts-ignore
        setIsRecording(res?.data?.data);
        // @ts-ignore
        setTotal(res?.data?.data?.length);
      })
      .catch((err) => console.log(err));
  }, [limit, page]);

  return (
    <div className="schedule-meet-component ">
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>roomId</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">File name</TableCell>
              <TableCell align="right">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          
            {recordings?.map((record: any) => (
              <TableRow
                key={record.roomId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {record.roomName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {record.status === 0 ? 'recording' : 'completed'}
                </TableCell>
                <TableCell component="th" scope="row">
                  <a href={`https://meetify.sgp1.digitaloceanspaces.com/${record.file.filename}`}>
                    {`https://meetify.sgp1.digitaloceanspaces.com/${record.file.filename}`}
                  </a>
                </TableCell>
                <TableCell component="th" scope="row">
                  <button onClick={() => handleDownload(record.file.filename)}>download</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      <RecordingListTable
        fields={recordingFields}
        // @ts-ignore
        items={recordings}
        // fetchData={fetchData}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
        // @ts-ignore
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default RecordManagement;

RecordManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
