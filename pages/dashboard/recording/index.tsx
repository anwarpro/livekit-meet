import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import meetService from '../../../service/meet/meetService';
import { useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const RecordManagement = () => {
  const { roomInfo } = useSelector((state: any) => state.room);
  const [recordings, setIsRecording] = useState();

  const fetchData = () => {
    meetService
      .recordingStatus()
      .then((res: any) => {
        setIsRecording(res?.data?.egressList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, [roomInfo.roomId]);

  const handleGetRecord = () => {
    fetchData();
  };

  const handleDownload = (fileName: string) => {
    console.log('fileName', fileName);
    meetService
      .downloadRecord({ fileName })
      .then((res) => {
        // @ts-ignore
        const signedUrl = res?.data?.url;
        window.location.href = signedUrl;
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="schedule-meet-component ">
      <button className="btn btn-info mb-3" onClick={() => handleGetRecord()}>
        Refresh
      </button>
      <TableContainer component={Paper}>
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
            {/* @ts-ignore */}
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
      </TableContainer>
    </div>
  );
};

export default RecordManagement;

RecordManagement.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
